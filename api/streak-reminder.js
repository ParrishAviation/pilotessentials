// Vercel Cron: runs daily at 6 PM UTC (see vercel.json)
// Sends streak reminder emails to students who haven't studied today

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Verify cron secret to prevent unauthorized calls
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const today = new Date().toISOString().split('T')[0];

  try {
    // Fetch active students: streak >= 2, haven't trained today, haven't been reminded today
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, streak, last_active_date, last_reminder_sent')
      .gte('streak', 2)
      .neq('last_active_date', today)
      .or(`last_reminder_sent.is.null,last_reminder_sent.neq.${today}`)
      .limit(500);

    if (error) throw error;

    const results = { sent: 0, skipped: 0, errors: 0 };

    for (const profile of profiles || []) {
      if (!profile.email) { results.skipped++; continue; }

      const name = profile.full_name?.split(' ')[0] || 'Pilot';
      const streak = profile.streak || 0;
      const daysToMilestone = Math.max(0, 7 - streak);
      const isNearMilestone = daysToMilestone <= 2 && daysToMilestone > 0;
      const isAtRisk = streak >= 7;

      const subject = isAtRisk
        ? `⚠️ Don't break your ${streak}-day streak, ${name}!`
        : isNearMilestone
          ? `🔥 ${daysToMilestone} day${daysToMilestone > 1 ? 's' : ''} away from unlocking your free practice test!`
          : `🔥 Your ${streak}-day streak is on the line, ${name}`;

      const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#060f1e;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:48px;margin-bottom:8px;">✈️</div>
      <div style="font-size:13px;color:#38bdf8;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Pilot Essentials</div>
    </div>

    <div style="background:linear-gradient(135deg,rgba(239,68,68,0.15),rgba(245,158,11,0.08));border:1px solid rgba(239,68,68,0.3);border-radius:20px;padding:32px;margin-bottom:24px;">
      <div style="font-size:36px;text-align:center;margin-bottom:12px;">🔥</div>
      <h1 style="color:#f1f5f9;font-size:22px;font-weight:800;text-align:center;margin:0 0 10px;">
        ${streak}-Day Streak at Risk
      </h1>
      <p style="color:#94a3b8;font-size:15px;text-align:center;margin:0 0 24px;line-height:1.6;">
        Hey ${name}, you haven't studied yet today.<br>
        ${isNearMilestone
          ? `You're only <strong style="color:#f59e0b">${daysToMilestone} day${daysToMilestone > 1 ? 's' : ''}</strong> away from unlocking your <strong style="color:#f59e0b">free PPL practice test</strong>!`
          : `Complete just one lesson today to keep your ${streak}-day streak alive.`
        }
      </p>

      <!-- Streak bar -->
      <div style="background:rgba(255,255,255,0.06);border-radius:12px;padding:16px;margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">7-Day Challenge Progress</span>
          <span style="color:#f59e0b;font-size:13px;font-weight:700;">${streak}/7 days</span>
        </div>
        <div style="height:10px;background:rgba(255,255,255,0.08);border-radius:5px;overflow:hidden;">
          <div style="height:100%;width:${Math.min(100, (streak / 7) * 100)}%;background:linear-gradient(90deg,#ef4444,#f59e0b);border-radius:5px;"></div>
        </div>
        ${daysToMilestone > 0
          ? `<div style="color:#64748b;font-size:11px;margin-top:8px;text-align:center;">${daysToMilestone} more day${daysToMilestone > 1 ? 's' : ''} to unlock a free practice test 🎁</div>`
          : `<div style="color:#f59e0b;font-size:11px;margin-top:8px;text-align:center;font-weight:700;">🏆 Reward unlocked! Keep the streak to earn bonus XP.</div>`
        }
      </div>

      <div style="text-align:center;">
        <a href="https://pilotessentials.vercel.app/courses"
          style="display:inline-block;padding:14px 36px;border-radius:12px;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;font-size:15px;font-weight:700;text-decoration:none;">
          Study Now — Keep Your Streak 🔥
        </a>
      </div>
    </div>

    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;margin-bottom:24px;">
      <div style="font-size:13px;font-weight:700;color:#f1f5f9;margin-bottom:12px;">🎯 Today's FAA Exam Readiness Tip</div>
      <div style="font-size:13px;color:#94a3b8;line-height:1.6;">
        The FAA Private Pilot written exam covers weather, airspace, navigation, and regulations.
        Students who study consistently for 7+ days score an average of <strong style="color:#38bdf8">12 points higher</strong> than those who cram.
        Your daily habit is your competitive edge.
      </div>
    </div>

    <div style="text-align:center;padding-top:16px;border-top:1px solid rgba(255,255,255,0.06);">
      <div style="font-size:12px;color:#334155;line-height:1.8;">
        Pilot Essentials · <a href="https://pilotessentials.vercel.app" style="color:#475569;text-decoration:none;">pilotessentials.vercel.app</a><br>
        <a href="https://pilotessentials.vercel.app/profile" style="color:#334155;text-decoration:none;">Manage email preferences</a>
      </div>
    </div>
  </div>
</body>
</html>`;

      try {
        await resend.emails.send({
          from: 'Pilot Essentials <noreply@mypilotessentials.com>',
          to: profile.email,
          subject,
          html,
        });

        // Mark reminder sent so we don't spam
        await supabase.from('profiles').update({ last_reminder_sent: today }).eq('id', profile.id);
        results.sent++;
      } catch {
        results.errors++;
      }
    }

    return res.status(200).json({ ok: true, ...results, date: today });
  } catch (err) {
    console.error('streak-reminder error:', err);
    return res.status(500).json({ error: err.message });
  }
}
