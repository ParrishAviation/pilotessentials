// POST /api/chat-notify
// Called after a new chat message is posted in either chatroom.
// Sends a notification email to info@mypilotessentials.com
// Requires: RESEND_API_KEY in environment variables

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userName, userEmail, content, room } = req.body ?? {};

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ ok: true, skipped: 'no api key' });
  }

  const isCfi = room === 'cfi';
  const roomLabel = isCfi ? '🧑‍✈️ CFI Chatroom' : '🛫 Student Chatroom';
  const accentColor = isCfi ? '#a78bfa' : '#0ea5e9';
  const accentGradient = isCfi
    ? 'linear-gradient(135deg, #a78bfa, #7c3aed)'
    : 'linear-gradient(135deg, #0ea5e9, #6366f1)';

  const sentAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // Truncate long messages for the email preview
  const preview = content?.length > 400 ? content.slice(0, 400) + '…' : content;

  const html = `
    <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1e293b;">
      <div style="background: ${accentGradient}; padding: 24px 28px; border-radius: 12px 12px 0 0;">
        <h2 style="margin: 0; color: #fff; font-size: 20px;">New Message in ${roomLabel}</h2>
        <p style="margin: 4px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Pilot Essentials</p>
      </div>
      <div style="background: #f8fafc; padding: 24px 28px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 80px;">From</td>
            <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${userName || '—'}</td>
          </tr>
          ${userEmail ? `
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Email</td>
            <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${userEmail}</td>
          </tr>` : ''}
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Room</td>
            <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: ${accentColor};">${roomLabel}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Sent</td>
            <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${sentAt} ET</td>
          </tr>
        </table>

        <div style="margin-top: 20px; background: #fff; border: 1px solid #e2e8f0; border-left: 4px solid ${accentColor}; border-radius: 8px; padding: 16px 18px;">
          <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${preview}</p>
        </div>

        <div style="margin-top: 20px;">
          <a href="https://pilotessentials.vercel.app/chatroom"
            style="display: inline-block; padding: 10px 22px; background: ${accentColor}; color: #fff; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700;">
            View in Chatroom →
          </a>
        </div>

        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
          Automated notification from <a href="https://pilotessentials.vercel.app" style="color: #0ea5e9; text-decoration: none;">pilotessentials.vercel.app</a>
        </div>
      </div>
    </div>
  `;

  const subjectPrefix = isCfi ? '[CFI Chat]' : '[Student Chat]';

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
        subject: `${subjectPrefix} New message from ${userName || 'a student'}`,
        html,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Resend chat-notify error:', err);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('chat-notify error:', err);
    return res.status(200).json({ ok: true, warning: err.message });
  }
}
