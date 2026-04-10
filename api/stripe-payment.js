/**
 * api/stripe-payment.js
 * Vercel serverless function — creates a Stripe PaymentIntent and records
 * the purchase in Supabase on completion.
 *
 * POST /api/stripe-payment  { plan, userId, userEmail }
 *   → { clientSecret }        (frontend confirms with Stripe.js)
 *
 * POST /api/stripe-payment/confirm  { paymentIntentId, plan, userId }
 *   → { success }             (called after client confirms payment)
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const PLANS = {
  full_access:    { label: 'Pilot Essentials — Full Access',    amountCents: 39900 },
  cfi_mentorship: { label: 'Pilot Essentials — CFI Mentorship', amountCents: 99900 },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, plan, userId, userEmail, paymentIntentId } = req.body || {};

  if (!plan || !PLANS[plan]) return res.status(400).json({ error: 'Invalid plan' });
  if (!userId)               return res.status(400).json({ error: 'Missing userId' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const planInfo = PLANS[plan];

  // ── Step 1: Create PaymentIntent ────────────────────────────────────────────
  if (!action || action === 'create') {
    try {
      const intent = await stripe.paymentIntents.create({
        amount: planInfo.amountCents,
        currency: 'usd',
        description: planInfo.label,
        receipt_email: userEmail || undefined,
        metadata: { plan, userId },
        automatic_payment_methods: { enabled: true },
      });
      return res.status(200).json({ clientSecret: intent.client_secret });
    } catch (err) {
      console.error('Stripe create error:', err);
      return res.status(500).json({ error: err.message || 'Failed to create payment' });
    }
  }

  // ── Step 2: Confirm purchase in Supabase after client confirms ──────────────
  if (action === 'confirm') {
    if (!paymentIntentId) return res.status(400).json({ error: 'Missing paymentIntentId' });

    try {
      // Verify the PaymentIntent actually succeeded
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
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

      if (dbError) console.error('Supabase insert error:', dbError);

      return res.status(200).json({ success: true, plan });
    } catch (err) {
      console.error('Stripe confirm error:', err);
      return res.status(500).json({ error: err.message || 'Confirmation failed' });
    }
  }

  return res.status(400).json({ error: 'Unknown action' });
}
