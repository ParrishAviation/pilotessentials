/**
 * api/stripe-payment.js
 * Vercel serverless function — Stripe payment processing.
 *
 * POST /api/stripe-payment  { action: 'create', plan, userId, userEmail }
 *   → { clientSecret }
 *
 * POST /api/stripe-payment  { action: 'confirm', paymentIntentId, plan, userId }
 *   → { success }
 */

import { createClient } from '@supabase/supabase-js';

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, plan, userId, userEmail, paymentIntentId } = req.body || {};

  if (!plan || !PLANS[plan]) return res.status(400).json({ error: 'Invalid plan' });
  if (!userId)               return res.status(400).json({ error: 'Missing userId' });

  const planInfo = PLANS[plan];

  // ── Create PaymentIntent ───────────────────────────────────────────────────
  if (!action || action === 'create') {
    try {
      const params = {
        amount: planInfo.amountCents,
        currency: 'usd',
        description: planInfo.label,
        'metadata[plan]': plan,
        'metadata[userId]': userId,
        'automatic_payment_methods[enabled]': 'true',
      };
      if (userEmail) params.receipt_email = userEmail;

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

  // ── Confirm + Record purchase after frontend confirms ──────────────────────
  if (action === 'confirm') {
    if (!paymentIntentId) return res.status(400).json({ error: 'Missing paymentIntentId' });

    try {
      const intent = await stripeGet(`/payment_intents/${paymentIntentId}`);

      if (intent.error) {
        return res.status(402).json({ error: intent.error.message });
      }
      if (intent.status !== 'succeeded') {
        return res.status(402).json({ error: `Payment not completed (${intent.status})` });
      }

      const supabase = createClient(
        process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
      );

      const cfiExpiry = plan === 'cfi_mentorship'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { error: dbError } = await supabase.from('purchases').upsert({
        user_id: userId,
        plan,
        stripe_payment_id: paymentIntentId,
        amount_cents: planInfo.amountCents,
        status: 'completed',
        cfi_access_expires_at: cfiExpiry,
      }, { onConflict: 'stripe_payment_id' });

      if (dbError) console.error('Supabase insert error (payment already charged!):', dbError);

      return res.status(200).json({ success: true, plan });
    } catch (err) {
      console.error('Stripe confirm error:', err);
      return res.status(500).json({ error: 'Confirmation failed' });
    }
  }

  return res.status(400).json({ error: 'Unknown action' });
}
