const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = 'Pilot Essentials <info@mypilotessentials.com>';
const ADMIN_EMAIL = 'info@mypilotessentials.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { studentName, studentEmail, cfiName, cfiEmail, scheduledAt, duration, topic, zoomLink } = req.body;

  const dateStr = new Date(scheduledAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const timeStr = new Date(scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });

  const studentHtml = `
    <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; background: #060f1e; color: #e2e8f0; padding: 32px; border-radius: 16px;">
      <div style="font-size: 32px; margin-bottom: 16px;">✈️</div>
      <h1 style="color: #38bdf8; font-size: 22px; margin: 0 0 8px;">Session Requested!</h1>
      <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
        Hi ${studentName}, your 1-on-1 session with <strong style="color: #f1f5f9;">${cfiName}</strong> has been requested. We'll confirm within 24 hours.
      </p>
      <div style="background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25); border-radius: 12px; padding: 18px 20px; margin-bottom: 20px;">
        <div style="font-size: 16px; font-weight: 700; color: #38bdf8;">${dateStr}</div>
        <div style="font-size: 14px; color: #7dd3fc; margin-top: 4px;">${timeStr} · ${duration} minutes</div>
        <div style="font-size: 13px; color: #94a3b8; margin-top: 8px;">Topic: ${topic}</div>
      </div>
      ${zoomLink ? `<a href="${zoomLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #0ea5e9, #2563eb); color: #fff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px;">Join Zoom Session →</a>` : ''}
      <p style="color: #475569; font-size: 12px; margin-top: 24px;">Blue skies,<br/>The Pilot Essentials Team</p>
    </div>
  `;

  const adminHtml = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #0ea5e9;">New CFI Booking Request</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 8px 0; color: #888; width: 120px;">Student:</td><td><strong>${studentName}</strong> (${studentEmail})</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">CFI:</td><td>${cfiName}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Date:</td><td>${dateStr}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Time:</td><td>${timeStr}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Duration:</td><td>${duration} minutes</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Topic:</td><td>${topic}</td></tr>
      </table>
      <p style="margin-top: 16px; font-size: 13px; color: #666;">Confirm or cancel in the <a href="https://pilotessentials.vercel.app/admin/cfis">Admin CFI panel</a>.</p>
    </div>
  `;

  try {
    await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({ from: FROM, to: studentEmail, subject: `✈️ Session Requested with ${cfiName} — ${dateStr}`, html: studentHtml }),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({ from: FROM, to: ADMIN_EMAIL, subject: `New CFI Booking: ${studentName} → ${cfiName} on ${dateStr}`, html: adminHtml }),
      }),
      cfiEmail && fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({ from: FROM, to: cfiEmail, subject: `New Session Request: ${studentName} on ${dateStr}`, html: adminHtml }),
      }),
    ]);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
