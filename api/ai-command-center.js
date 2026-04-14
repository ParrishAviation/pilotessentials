/**
 * POST /api/ai-command-center
 * Aggregates all platform data, runs it through Claude, and returns
 * prioritized recommendations for the AI Command Center dashboard.
 *
 * Env vars required:
 *   ANTHROPIC_API_KEY
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

const ANTHROPIC_API = (process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com') + '/v1/messages';
const MODEL = 'claude-sonnet-4-6';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function sbFetch(path, opts = {}) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) return null;
  return res.json();
}

async function gatherMetrics() {
  // Fetch all relevant data in parallel
  const [
    profiles,
    enrollments,
    completedLessons,
    quizScores,
    purchases,
    events,
    tickets,
  ] = await Promise.all([
    sbFetch('profiles?select=id,xp,level,streak,created_at&limit=1000'),
    sbFetch('enrolled_courses?select=user_id,course_id,enrolled_at&limit=2000'),
    sbFetch('completed_lessons?select=user_id,lesson_id,xp_earned,completed_at&limit=5000'),
    sbFetch('quiz_scores?select=user_id,quiz_id,score,total,percent,is_perfect,updated_at&limit=2000'),
    sbFetch('purchases?select=user_id,plan,amount_cents,created_at&limit=1000'),
    sbFetch('analytics_events?select=user_id,event_type,lesson_id,quiz_id,metadata,created_at&limit=5000&order=created_at.desc'),
    sbFetch('support_tickets?select=id,subject,status,created_at&limit=200'),
  ]);

  return { profiles, enrollments, completedLessons, quizScores, purchases, events, tickets };
}

function computeInsights(data) {
  const { profiles, enrollments, completedLessons, quizScores, purchases, events, tickets } = data;

  const safe = (arr) => arr || [];

  // ── Student counts ─────────────────────────────────────────────────────────
  const totalStudents = safe(profiles).length;
  const totalEnrollments = safe(enrollments).length;
  const uniqueEnrolled = new Set(safe(enrollments).map(e => e.user_id)).size;

  // ── Purchase metrics ──────────────────────────────────────────────────────
  const totalRevenue = safe(purchases).reduce((s, p) => s + (p.amount_cents || 0), 0) / 100;
  const cfiPurchases = safe(purchases).filter(p => p.plan === 'cfi_mentorship').length;
  const fullAccessPurchases = safe(purchases).filter(p => p.plan === 'full_access').length;

  // ── Quiz performance ──────────────────────────────────────────────────────
  const quizByLesson = {};
  safe(quizScores).forEach(q => {
    if (!quizByLesson[q.quiz_id]) quizByLesson[q.quiz_id] = { scores: [], perfects: 0, total: 0 };
    quizByLesson[q.quiz_id].scores.push(q.percent);
    quizByLesson[q.quiz_id].total++;
    if (q.is_perfect) quizByLesson[q.quiz_id].perfects++;
  });

  const quizInsights = Object.entries(quizByLesson).map(([quizId, d]) => {
    const avg = d.scores.reduce((a, b) => a + b, 0) / d.scores.length;
    return { quizId, avgScore: Math.round(avg), attempts: d.total, perfectRate: Math.round((d.perfects / d.total) * 100) };
  }).sort((a, b) => a.avgScore - b.avgScore);

  const hardestQuizzes = quizInsights.slice(0, 5);
  const easiestQuizzes = quizInsights.slice(-3);

  // ── Lesson completion rates ───────────────────────────────────────────────
  const lessonCompletions = {};
  safe(completedLessons).forEach(cl => {
    lessonCompletions[cl.lesson_id] = (lessonCompletions[cl.lesson_id] || 0) + 1;
  });

  // ── Drop-off analysis from events ─────────────────────────────────────────
  const lessonStarts = {};
  const lessonCompletes = {};
  safe(events).forEach(ev => {
    if (ev.event_type === 'lesson_start' && ev.lesson_id) {
      lessonStarts[ev.lesson_id] = (lessonStarts[ev.lesson_id] || 0) + 1;
    }
    if (ev.event_type === 'lesson_complete' && ev.lesson_id) {
      lessonCompletes[ev.lesson_id] = (lessonCompletes[ev.lesson_id] || 0) + 1;
    }
  });

  const dropoffLessons = Object.entries(lessonStarts)
    .filter(([id, starts]) => starts >= 3)
    .map(([id, starts]) => {
      const completes = lessonCompletes[id] || 0;
      const dropoff = Math.round(((starts - completes) / starts) * 100);
      return { lessonId: id, starts, completes, dropoffPct: dropoff };
    })
    .filter(d => d.dropoffPct > 40)
    .sort((a, b) => b.dropoffPct - a.dropoffPct)
    .slice(0, 5);

  // ── At-risk students (enrolled but no activity in 7+ days) ────────────────
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const recentActiveUsers = new Set(
    safe(events).filter(e => e.created_at > sevenDaysAgo).map(e => e.user_id)
  );
  const enrolledUsers = new Set(safe(enrollments).map(e => e.user_id));
  const atRiskCount = [...enrolledUsers].filter(uid => !recentActiveUsers.has(uid)).length;

  // ── Quiz question miss rates from events ──────────────────────────────────
  const questionMisses = {};
  safe(events).filter(e => e.event_type === 'quiz_attempt').forEach(ev => {
    const meta = ev.metadata || {};
    if (meta.wrongQuestions) {
      meta.wrongQuestions.forEach(qid => {
        questionMisses[qid] = (questionMisses[qid] || 0) + 1;
      });
    }
  });
  const highMissQuestions = Object.entries(questionMisses)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([qid, count]) => ({ questionId: qid, missCount: count }));

  // ── Study frequency vs success correlation ────────────────────────────────
  const userEventDays = {};
  safe(events).forEach(ev => {
    if (!ev.user_id) return;
    const day = ev.created_at?.slice(0, 10);
    if (!userEventDays[ev.user_id]) userEventDays[ev.user_id] = new Set();
    if (day) userEventDays[ev.user_id].add(day);
  });

  const studyFrequencies = Object.entries(userEventDays).map(([uid, days]) => ({
    userId: uid,
    daysStudied: days.size,
    hasHighScore: safe(quizScores).some(q => q.user_id === uid && q.percent >= 80),
  }));

  const freqHighScore = studyFrequencies.filter(u => u.daysStudied >= 4 && u.hasHighScore).length;
  const freqLowScore  = studyFrequencies.filter(u => u.daysStudied < 2 && !u.hasHighScore).length;

  // ── Support ticket summary ─────────────────────────────────────────────────
  const openTickets = safe(tickets).filter(t => t.status !== 'resolved' && t.status !== 'closed').length;

  // ── Streak/engagement ─────────────────────────────────────────────────────
  const avgStreak = safe(profiles).length
    ? Math.round(safe(profiles).reduce((s, p) => s + (p.streak || 0), 0) / safe(profiles).length)
    : 0;
  const zeroStreakStudents = safe(profiles).filter(p => (p.streak || 0) === 0).length;

  return {
    totalStudents,
    uniqueEnrolled,
    totalRevenue,
    cfiPurchases,
    fullAccessPurchases,
    hardestQuizzes,
    easiestQuizzes,
    dropoffLessons,
    atRiskCount,
    highMissQuestions,
    freqHighScore,
    freqLowScore,
    openTickets,
    avgStreak,
    zeroStreakStudents,
    totalQuizAttempts: safe(quizScores).length,
    totalLessonCompletions: safe(completedLessons).length,
    conversionRate: totalStudents > 0 ? Math.round(((fullAccessPurchases + cfiPurchases) / totalStudents) * 100) : 0,
  };
}

async function generateRecommendations(insights) {
  const prompt = `You are an AI analytics engine for Pilot Essentials, an FAA private pilot ground school platform.

Analyze the following platform metrics and generate specific, actionable recommendations for the admin.

PLATFORM METRICS:
${JSON.stringify(insights, null, 2)}

Generate exactly 10-15 recommendations across these 4 categories:
1. "errors" - Critical quality/accuracy issues that need immediate attention
2. "learning" - Learning optimization to improve completion rates and test pass rates
3. "engagement" - Student engagement, retention, and study habit improvements
4. "revenue" - Conversion, upsell, and revenue optimization opportunities

For each recommendation return a JSON object with:
- category: "errors" | "learning" | "engagement" | "revenue"
- priority: "critical" | "high" | "medium" | "low"
- title: short title (max 8 words)
- description: what the data shows (2-3 sentences, be specific with numbers from the metrics)
- action: exactly what the admin should do (1-2 concrete sentences)
- impact_score: 0-100 integer (higher = more important)

Rules:
- Be SPECIFIC. Reference actual numbers from the metrics.
- "Critical" priority = needs action within 24 hours
- "High" priority = this week
- Order by impact
- If a metric is 0 or null, note that data collection is just starting and recommend enabling tracking
- Focus on FAA exam pass rate, completion rate, and revenue as the north star metrics

Return ONLY a valid JSON array of recommendation objects. No markdown, no explanation.`;

  const res = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Anthropic API error: ${res.status}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || '[]';

  // Robustly extract the JSON array even if Claude adds prose or markdown
  const clean = text.replace(/^```json\n?/,'').replace(/\n?```$/,'').trim();

  // Find the first [ and last ] to extract just the array
  const start = clean.indexOf('[');
  const end = clean.lastIndexOf(']');
  if (start === -1 || end === -1) throw new Error('Claude did not return a JSON array');
  const arrayStr = clean.slice(start, end + 1);

  return JSON.parse(arrayStr);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { adminEmail, forceRefresh } = req.body || {};
  const ADMIN_EMAILS = ['jack@parrishaviation.com', 'titiusmclaughlin@gmail.com'];
  if (!ADMIN_EMAILS.includes(adminEmail)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured. Add it to your Vercel environment variables.' });

  try {
    // Check cache — if recommendations generated in last 6 hours, return them
    // (Only if ai_recommendations table exists — silently skip if not)
    if (!forceRefresh && serviceKey) {
      try {
        const sixHoursAgo = new Date(Date.now() - 6 * 3600000).toISOString();
        const cached = await sbFetch(
          `ai_recommendations?status=eq.open&generated_at=gte.${sixHoursAgo}&order=impact_score.desc&limit=50`
        );
        if (Array.isArray(cached) && cached.length > 0) {
          return res.status(200).json({ recommendations: cached, cached: true, generatedAt: cached[0].generated_at });
        }
      } catch (_) { /* table may not exist yet — fall through to generate */ }
    }

    // Gather fresh data
    const rawData = await gatherMetrics();
    const insights = computeInsights(rawData);

    // Generate AI recommendations
    const rawRecs = await generateRecommendations(insights);

    // Normalize categories + ensure required fields so the frontend always renders
    const VALID_CATS = { errors: 1, learning: 1, engagement: 1, revenue: 1 };
    const VALID_PRI  = { critical: 1, high: 1, medium: 1, low: 1 };
    const recs = rawRecs.map(r => ({
      ...r,
      id: r.id || null,
      status: 'open',
      category: VALID_CATS[r.category] ? r.category
               : r.category?.includes('error') ? 'errors'
               : r.category?.includes('revenue') || r.category?.includes('growth') ? 'revenue'
               : r.category?.includes('engage') || r.category?.includes('retention') ? 'engagement'
               : 'learning',
      priority: VALID_PRI[r.priority] ? r.priority : 'medium',
      title: String(r.title || 'Recommendation'),
      description: String(r.description || ''),
      action: String(r.action || ''),
      impact_score: Number(r.impact_score) || 50,
    }));

    // Store in Supabase — silently skip if table doesn't exist yet
    if (serviceKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/ai_recommendations?status=eq.open`, {
          method: 'DELETE',
          headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
        });

        const toInsert = recs.map(r => ({
          category: r.category || 'learning',
          priority: r.priority || 'medium',
          title: String(r.title || '').slice(0, 200),
          description: String(r.description || ''),
          action: String(r.action || ''),
          impact_score: Number(r.impact_score) || 50,
          data: {},
          status: 'open',
          generated_at: new Date().toISOString(),
        }));

        await fetch(`${supabaseUrl}/rest/v1/ai_recommendations`, {
          method: 'POST',
          headers: {
            apikey: serviceKey, Authorization: `Bearer ${serviceKey}`,
            'Content-Type': 'application/json', Prefer: 'return=minimal',
          },
          body: JSON.stringify(toInsert),
        });
      } catch (_) { /* table may not exist yet — recommendations still returned to client */ }
    }

    return res.status(200).json({
      recommendations: recs,
      insights,
      cached: false,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('ai-command-center error:', err);
    return res.status(500).json({ error: err.message });
  }
}
