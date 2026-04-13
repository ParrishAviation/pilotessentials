// POST /api/notify-signup
// Called after a new user signs up — sends an email notification to info@mypilotessentials.com
// Requires: RESEND_API_KEY in environment variables

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, fullName, userId } = req.body ?? {};

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Silently succeed if not configured — don't break signup flow
    return res.status(200).json({ ok: true, skipped: 'no api key' });
  }

  const signedUpAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const html = `
    <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1e293b;">
      <div style="background: linear-gradient(135deg, #0ea5e9, #6366f1); padding: 24px 28px; border-radius: 12px 12px 0 0;">
        <h2 style="margin: 0; color: #fff; font-size: 20px;">✈️ New Student Sign-Up</h2>
        <p style="margin: 4px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Pilot Essentials</p>
      </div>
      <div style="background: #f8fafc; padding: 24px 28px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 110px;">Name</td>
            <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${fullName || '—'}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Email</td>
            <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${email || '—'}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">User ID</td>
            <td style="padding: 8px 0; color: #94a3b8; font-size: 12px; font-family: monospace;">${userId || '—'}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Signed up</td>
            <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${signedUpAt} ET</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
          This is an automated notification from <a href="https://pilotessentials.vercel.app" style="color: #0ea5e9; text-decoration: none;">pilotessentials.vercel.app</a>
        </div>
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Pilot Essentials <noreply@mypilotessentials.com>',
        to: ['info@mypilotessentials.com'],
        subject: `New sign-up: ${fullName || email || 'Unknown'}`,
        html,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Resend error:', err);
      // Still return 200 — don't break signup flow
      return res.status(200).json({ ok: true, warning: 'email failed to send' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('notify-signup error:', err);
    return res.status(200).json({ ok: true, warning: err.message });
  }
}
