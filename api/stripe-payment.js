/**
 * api/stripe-payment.js
 * Vercel serverless function — Stripe payment processing.
 *
 * POST { action: 'create',         plan, email }                          → { clientSecret }
 * POST { action: 'confirm',        plan, paymentIntentId, name, email, phone, userId? } → { success }
 * POST { action: 'free_purchase',  plan, discountCode, name, email, phone, userId? }    → { success }
 * POST { action: 'validate_discount', discountCode }                       → { valid, discountPct }
 */

import { createClient } from '@supabase/supabase-js';

// Discount codes → discount percentage (100 = free)
const DISCOUNT_CODES = {
  'StudyyHarderOKAY!1a45$': 100,
};

const PLANS = {
  full_access:    { label: 'Pilot Essentials — Full Access',    amountCents: 39900 },
  cfi_mentorship: { label: 'Pilot Essentials — CFI Mentorship', amountCents: 99900 },
};

async function stripePost(path, params) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params).toString(),
  });
  return res.json();
}

async function stripeGet(path) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    headers: { 'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}` },
  });
  return res.json();
}

/**
 * Find an existing Supabase user by email, or create a new one and send
 * them an invite email so they can set their password.
 */
async function findOrCreateUser(supabase, email, name, phone) {
  // Try to invite — this creates the account AND sends the welcome/set-password email
  const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { full_name: name || '', phone: phone || '' },
    redirectTo: (process.env.VITE_PUBLIC_URL || 'https://www.mypilotessentials.com') + '/app',
  });

  if (!inviteError) {
    return { userId: inviteData.user.id, isNew: true };
  }

  // User already exists — find them via listUsers
  try {
    const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const existing = listData?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (existing) return { userId: existing.id, isNew: false };
  } catch (e) {
    console.error('listUsers error:', e);
  }

  throw new Error('Could not create or find user account for ' + email);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, plan, userId, email, name, phone, paymentIntentId, discountCode } = req.body || {};

  // validate_discount doesn't need plan/userId
  if (action === 'validate_discount') {
    const discount = DISCOUNT_CODES[discountCode];
    if (!discount) return res.status(200).json({ valid: false, error: 'Invalid discount code.' });
    return res.status(200).json({ valid: true, discountPct: discount });
  }

  if (!plan || !PLANS[plan]) return res.status(400).json({ error: 'Invalid plan' });
  const planInfo = PLANS[plan];

  // ── Create PaymentIntent ──────────────────────────────────────────────────
  if (!action || action === 'create') {
    try {
      const params = {
        amount: planInfo.amountCents,
        currency: 'usd',
        description: planInfo.label,
        'metadata[plan]': plan,
        'automatic_payment_methods[enabled]': 'true',
      };
      if (email) params.receipt_email = email;
      if (userId) params['metadata[userId]'] = userId;

      const intent = await stripePost('/payment_intents', params);
      if (intent.error) {
        console.error('Stripe error:', intent.error);
        return res.status(402).json({ error: intent.error.message });
      }
      return res.status(200).json({ clientSecret: intent.client_secret });
    } catch (err) {
      console.error('Stripe create error:', err);
      return res.status(500).json({ error: 'Failed to create payment' });
    }
  }

  // ── Confirm payment + create/find account + record purchase ──────────────
  if (action === 'confirm') {
    if (!paymentIntentId) return res.status(400).json({ error: 'Missing paymentIntentId' });
    if (!email && !userId)  return res.status(400).json({ error: 'Missing email or userId' });

    try {
      const intent = await stripeGet(`/payment_intents/${paymentIntentId}`);
      if (intent.error)                  return res.status(402).json({ error: intent.error.message });
      if (intent.status !== 'succeeded') return res.status(402).json({ error: `Payment not completed (${intent.status})` });

      const supabase = createClient(
        process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
      );

      // Resolve user — use existing session userId if provided, otherwise find/create
      let resolvedUserId = userId || null;
      let isNew = false;
      if (!resolvedUserId) {
        const result = await findOrCreateUser(supabase, email, name, phone);
        resolvedUserId = result.userId;
        isNew = result.isNew;
      }

      const cfiExpiry = plan === 'cfi_mentorship'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { error: dbError } = await supabase.from('purchases').upsert({
        user_id: resolvedUserId,
        plan,
        stripe_payment_id: paymentIntentId,
        amount_cents: planInfo.amountCents,
        status: 'completed',
        cfi_access_expires_at: cfiExpiry,
      }, { onConflict: 'stripe_payment_id' });

      if (dbError) console.error('Supabase insert error:', dbError);

      return res.status(200).json({ success: true, plan, isNew });
    } catch (err) {
      console.error('Stripe confirm error:', err);
      return res.status(500).json({ error: 'Confirmation failed' });
    }
  }

  // ── Free purchase via 100% discount code ─────────────────────────────────
  if (action === 'free_purchase') {
    const discount = DISCOUNT_CODES[discountCode];
    if (!discount || discount < 100) return res.status(400).json({ error: 'Invalid or insufficient discount code' });
    if (!email && !userId)           return res.status(400).json({ error: 'Missing email or userId' });

    try {
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
      );

      let resolvedUserId = userId || null;
      let isNew = false;
      if (!resolvedUserId) {
        const result = await findOrCreateUser(supabase, email, name, phone);
        resolvedUserId = result.userId;
        isNew = result.isNew;
      }

      const cfiExpiry = plan === 'cfi_mentorship'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { error: dbError } = await supabase.from('purchases').upsert({
        user_id: resolvedUserId,
        plan,
        stripe_payment_id: `discount_${Date.now()}_${resolvedUserId}`,
        amount_cents: 0,
        status: 'completed',
        cfi_access_expires_at: cfiExpiry,
      }, { onConflict: 'user_id' });

      if (dbError) {
        console.error('Supabase free purchase error:', dbError);
        return res.status(500).json({ error: 'Failed to record purchase' });
      }

      return res.status(200).json({ success: true, plan, isNew });
    } catch (err) {
      console.error('Free purchase error:', err);
      return res.status(500).json({ error: 'Free purchase failed' });
    }
  }

  return res.status(400).json({ error: 'Unknown action' });
}
