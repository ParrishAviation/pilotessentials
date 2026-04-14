import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'Pilot Essentials <info@mypilotessentials.com>';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { campaignId } = req.body;
  if (!campaignId) return res.status(400).json({ error: 'campaignId required' });

  // Load campaign
  const { data: campaign, error: campErr } = await supabase
    .from('email_campaigns')
    .select('*')
    .eq('id', campaignId)
    .single();

  if (campErr || !campaign) return res.status(404).json({ error: 'Campaign not found' });

  // Load recipients based on segment
  let query = supabase.from('profiles').select('id, full_name, username');
  // Note: email is in auth.users, not profiles — fetch from auth admin API
  const { data: authUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  let users = authUsers?.users || [];

  if (campaign.segment === 'paid') {
    // filter users who have a paid plan
    const { data: purchases } = await supabase.from('profiles').select('id, plan').neq('plan', null);
    const paidIds = new Set((purchases || []).filter(p => p.plan && p.plan !== 'free').map(p => p.id));
    users = users.filter(u => paidIds.has(u.id));
  } else if (campaign.segment === 'free') {
    const { data: profiles } = await supabase.from('profiles').select('id, plan');
    const freeIds = new Set((profiles || []).filter(p => !p.plan || p.plan === 'free').map(p => p.id));
    users = users.filter(u => freeIds.has(u.id));
  } else if (campaign.segment === 'cfi') {
    const { data: profiles } = await supabase.from('profiles').select('id, plan');
    const cfiIds = new Set((profiles || []).filter(p => p.plan === 'cfi_mentorship').map(p => p.id));
    users = users.filter(u => cfiIds.has(u.id));
  }
  // 'all' → all users

  if (users.length === 0) return res.status(200).json({ count: 0, message: 'No recipients in segment' });

  // Load profile names
  const { data: profiles } = await supabase.from('profiles').select('id, full_name, username');
  const profileMap = {};
  (profiles || []).forEach(p => { profileMap[p.id] = p; });

  let sent = 0;
  const errors = [];

  // Send in batches of 10 (Resend rate limit)
  for (let i = 0; i < users.length; i += 10) {
    const batch = users.slice(i, i + 10);
    await Promise.all(batch.map(async (u) => {
      const profile = profileMap[u.id] || {};
      const name = profile.full_name || profile.username || 'Pilot';
      const personalizedBody = campaign.body_html.replace(/\{\{name\}\}/g, name);

      try {
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: u.email,
            subject: campaign.subject,
            html: personalizedBody,
          }),
        });
        if (r.ok) sent++;
        else {
          const err = await r.json();
          errors.push({ email: u.email, error: err.message });
        }
      } catch (e) {
        errors.push({ email: u.email, error: e.message });
      }
    }));
    // Small delay between batches
    if (i + 10 < users.length) await new Promise(r => setTimeout(r, 200));
  }

  return res.status(200).json({ count: sent, errors });
}
