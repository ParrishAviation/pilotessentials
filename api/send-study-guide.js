/**
 * POST /api/send-study-guide
 * Emails the Private Pilot Study Guide PDF to the requester via Resend.
 *
 * Body: { firstName, lastName, email, program }
 * Returns: { success: true } | { error: string }
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { firstName, lastName, email, program } = req.body || {};

  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !program?.trim()) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return res.status(500).json({ error: 'Email service not configured.' });
  }

  // Read the PDF and base64-encode it
  let pdfBase64;
  try {
    const pdfPath = join(__dirname, '..', 'public', 'private-pilot-study-guide.pdf');
    const pdfBuffer = readFileSync(pdfPath);
    pdfBase64 = pdfBuffer.toString('base64');
  } catch (err) {
    console.error('Failed to read PDF:', err);
    return res.status(500).json({ error: 'Study guide file not available.' });
  }

  const fullName = `${firstName.trim()} ${lastName.trim()}`;

  const emailBody = {
    from: 'Pilot Essentials <noreply@mypilotessentials.com>',
    to: [email.trim()],
    subject: 'Your Free Private Pilot Study Guide — Pilot Essentials',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#060f1e;font-family:Inter,system-ui,sans-serif;color:#f1f5f9;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:24px;">
        <div style="width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg,#0ea5e9,#2563eb);display:flex;align-items:center;justify-content:center;font-size:22px;">✈️</div>
        <span style="font-size:20px;font-weight:800;color:#f8fafc;letter-spacing:-0.3px;">Pilot Essentials</span>
      </div>
    </div>

    <!-- Main card -->
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:36px;margin-bottom:24px;">
      <h1 style="font-size:26px;font-weight:900;color:#f1f5f9;margin:0 0 12px;line-height:1.25;">
        Hi ${fullName}! ✈️
      </h1>
      <p style="font-size:15px;color:#94a3b8;line-height:1.7;margin:0 0 24px;">
        Your <strong style="color:#38bdf8;">Private Pilot Study Guide</strong> is attached to this email. This comprehensive guide covers everything you need to ace the FAA Private Pilot Knowledge Test.
      </p>

      <div style="background:rgba(56,189,248,0.07);border:1px solid rgba(56,189,248,0.2);border-radius:14px;padding:20px 24px;margin-bottom:24px;">
        <p style="font-size:14px;font-weight:700;color:#38bdf8;margin:0 0 10px;">📋 What's inside:</p>
        <ul style="margin:0;padding:0 0 0 18px;color:#94a3b8;font-size:14px;line-height:1.8;">
          <li>Aerodynamics &amp; aircraft systems</li>
          <li>Weather theory &amp; interpretation</li>
          <li>Navigation, charts &amp; airspace</li>
          <li>FAA regulations &amp; procedures</li>
          <li>Checkride prep tips</li>
        </ul>
      </div>

      <p style="font-size:14px;color:#64748b;line-height:1.7;margin:0 0 24px;">
        You're enrolled in the <strong style="color:#f1f5f9;">${program}</strong> program. When you're ready to go beyond the basics, check out the full Pilot Essentials platform — interactive lessons, AI-powered study guides, practice quizzes, and more.
      </p>

      <a href="https://www.mypilotessentials.com" style="display:inline-block;padding:14px 32px;border-radius:10px;background:linear-gradient(135deg,#0ea5e9,#2563eb);color:#fff;font-weight:800;font-size:15px;text-decoration:none;letter-spacing:-0.2px;">
        Explore Pilot Essentials →
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:16px;">
      <p style="font-size:12px;color:#334155;margin:0 0 4px;">
        Questions? Email us at <a href="mailto:support@mypilotessentials.com" style="color:#38bdf8;text-decoration:none;">support@mypilotessentials.com</a>
      </p>
      <p style="font-size:11px;color:#1e293b;margin:0;">
        © ${new Date().getFullYear()} Pilot Essentials · Not affiliated with the FAA · For educational purposes only
      </p>
    </div>
  </div>
</body>
</html>
    `.trim(),
    attachments: [
      {
        filename: 'Private-Pilot-Study-Guide-Pilot-Essentials.pdf',
        content: pdfBase64,
      },
    ],
  };

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailBody),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error('Resend error:', resendData);
      return res.status(500).json({ error: 'Failed to send email. Please try again.' });
    }

    // Also notify internal team of new lead
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Pilot Essentials <noreply@mypilotessentials.com>',
        to: ['info@mypilotessentials.com'],
        subject: `New Study Guide Lead: ${fullName}`,
        html: `<p><strong>Name:</strong> ${fullName}</p><p><strong>Email:</strong> ${email}</p><p><strong>Program:</strong> ${program}</p>`,
      }),
    }).catch(() => {});

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('send-study-guide error:', err);
    return res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
}
