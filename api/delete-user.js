/**
 * POST /api/delete-user
 * Deletes a user from Supabase auth and all their associated data.
 * Admin-only — requires caller to pass the admin email for verification.
 *
 * Body: { userId, adminEmail }
 */

const ADMIN_EMAILS = ['jack@parrishaviation.com', 'titiusmclaughlin@gmail.com'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, adminEmail } = req.body || {};

  if (!userId || !adminEmail) {
    return res.status(400).json({ error: 'userId and adminEmail are required.' });
  }

  if (!ADMIN_EMAILS.includes(adminEmail)) {
    return res.status(403).json({ error: 'Not authorized.' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  const headers = {
    'apikey': serviceKey,
    'Authorization': `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  };

  // Delete associated data first (order matters for FK constraints)
  const tables = [
    'quiz_attempts',
    'lesson_completions',
    'course_enrollments',
    'purchases',
    'support_tickets',
    'ai_query_log',
    'chat_messages',
    'profiles',
  ];

  for (const table of tables) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/${table}?user_id=eq.${userId}`, {
        method: 'DELETE',
        headers,
      });
    } catch {
      // Non-fatal — table may not exist or may not have user_id column
    }
  }

  // Delete the auth user via admin API
  const deleteRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
    method: 'DELETE',
    headers,
  });

  if (!deleteRes.ok) {
    let errText = '';
    try { errText = await deleteRes.text(); } catch {}
    console.error('Failed to delete auth user:', deleteRes.status, errText);
    return res.status(500).json({ error: 'Failed to delete user from auth. Associated data may have been removed.' });
  }

  return res.status(200).json({ success: true });
}
