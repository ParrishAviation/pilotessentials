/**
 * POST /api/setup-account
 * Called from the post-purchase account setup page.
 * Uses the Supabase admin SDK to set the user's password + name without
 * requiring email confirmation — the purchase itself is the verification.
 *
 * Body: { email, password, fullName }
 * Returns: { success: true } | { error: string }
 */

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password, fullName } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    // Find the user by email
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (listError) throw listError;

    const existing = listData?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (!existing) {
      // User doesn't exist yet — create them now (edge case: purchase recording failed)
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName || '' },
      });
      if (createError) throw createError;
      return res.status(200).json({ success: true, userId: newUser.user.id });
    }

    // User exists — update password, confirm email, set name
    const resolvedName = fullName || existing.user_metadata?.full_name || '';
    const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: { full_name: resolvedName },
    });
    if (updateError) throw updateError;

    // Ensure a profiles row exists (trigger only fires on new auth.users inserts)
    await supabase.from('profiles').upsert(
      { id: existing.id, full_name: resolvedName },
      { onConflict: 'id', ignoreDuplicates: false }
    );

    return res.status(200).json({ success: true, userId: existing.id });
  } catch (err) {
    console.error('setup-account error:', err);
    return res.status(500).json({ error: err.message || 'Failed to set up account.' });
  }
}
