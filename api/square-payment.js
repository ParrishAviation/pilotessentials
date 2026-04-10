/**
 * api/square-payment.js
 * Vercel serverless function — processes Square card payment and records purchase in Supabase.
 *
 * POST /api/square-payment
 * Body: { sourceId, plan, userId, userEmail }
 * Returns: { success, paymentId } | { error }
 */

import { createClient } from '@supabase/supabase-js';

const PLANS = {
  full_access: { label: 'Pilot Essentials — Full Access', amountCents: 39900 },
  cfi_mentorship: { label: 'Pilot Essentials — CFI Mentorship', amountCents: 99900 },
};

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sourceId, plan, userId, userEmail } = req.body || {};

  // Validate inputs
  if (!sourceId) return res.status(400).json({ error: 'Missing sourceId' });
  if (!plan || !PLANS[plan]) return res.status(400).json({ error: 'Invalid plan' });
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  const planInfo = PLANS[plan];

  try {
    // 1. Charge the card via Square Payments API
    const squareRes = await fetch('https://connect.squareup.com/v2/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Square-Version': '2024-01-18',
      },
      body: JSON.stringify({
        source_id: sourceId,
        idempotency_key: `${userId.replace(/-/g, '').slice(0, 28)}-${Date.now()}`,
        amount_money: {
          amount: planInfo.amountCents,
          currency: 'USD',
        },
        note: planInfo.label,
        buyer_email_address: userEmail || undefined,
      }),
    });

    const squareData = await squareRes.json();

    if (!squareRes.ok || squareData.errors) {
      const msg = squareData.errors?.[0]?.detail || 'Payment declined';
      console.error('Square error:', squareData.errors);
      return res.status(402).json({ error: msg });
    }

    const payment = squareData.payment;
    if (payment.status !== 'COMPLETED') {
      return res.status(402).json({ error: `Payment status: ${payment.status}` });
    }

    // 2. Record the purchase in Supabase using the service role key
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    const cfiExpiry = plan === 'cfi_mentorship'
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const { error: dbError } = await supabase.from('purchases').insert({
      user_id: userId,
      plan,
      square_payment_id: payment.id,
      amount_cents: planInfo.amountCents,
      status: 'completed',
      cfi_access_expires_at: cfiExpiry,
    });

    if (dbError) {
      // Payment succeeded but DB write failed — log it but don't fail the user
      console.error('Supabase insert error (payment already charged!):', dbError);
    }

    return res.status(200).json({
      success: true,
      paymentId: payment.id,
      plan,
    });

  } catch (err) {
    console.error('Unexpected error in square-payment handler:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
