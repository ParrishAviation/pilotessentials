/**
 * POST /api/admin-users
 * Returns all Supabase auth users (id + email + created_at).
 * Admin-only — requires caller to pass their admin email for verification.
 *
 * Body: { adminEmail }
 */

const ADMIN_EMAILS = ['jack@parrishaviation.com', 'titiusmclaughlin@gmail.com'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { adminEmail } = req.body || {};

  if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail)) {
    return res.status(403).json({ error: 'Not authorized.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured.' });
  }

  // Fetch all users via Supabase admin API (paginates up to 1000)
  const headers = {
    'apikey': serviceKey,
    'Authorization': `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
  };

  let allUsers = [];
  let page = 1;
  const perPage = 1000;

  while (true) {
    const url = `${supabaseUrl}/auth/v1/admin/users?page=${page}&per_page=${perPage}`;
    const resp = await fetch(url, { headers });
    if (!resp.ok) {
      const text = await resp.text();
      return res.status(502).json({ error: `Supabase error: ${text}` });
    }
    const body = await resp.json();
    const users = body.users || [];
    allUsers = allUsers.concat(users.map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
    })));
    if (users.length < perPage) break;
    page++;
  }

  return res.status(200).json({ users: allUsers });
}
