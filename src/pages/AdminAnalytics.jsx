import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, TrendingUp, Star, DollarSign, MessageSquare, RefreshCw, BarChart2, ClipboardList } from 'lucide-react';
import { supabase } from '../lib/supabase';

function MetricCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: '20px 22px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={22} color="#fff" />
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 1 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: '#38bdf8', marginTop: 3 }}>{sub}</div>}
      </div>
    </motion.div>
  );
}

function MiniBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{value}</span>
      </div>
      <div style={{ height: 7, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: 4 }}
        />
      </div>
    </div>
  );
}

function StarRow({ rating, count, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 12, color: '#94a3b8', width: 20, textAlign: 'right' }}>{rating}★</span>
      <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
          transition={{ duration: 0.8 }}
          style={{ height: '100%', background: '#f59e0b', borderRadius: 4 }}
        />
      </div>
      <span style={{ fontSize: 12, color: '#64748b', width: 28, textAlign: 'right' }}>{count}</span>
    </div>
  );
}

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const load = async () => {
    setLoading(true);
    try {
      const [
        profilesRes,
        lessonsRes,
        quizRes,
        surveysRes,
        enrolledRes,
        bookingsRes,
      ] = await Promise.all([
        supabase.from('profiles').select('id, xp, level, streak, created_at, plan').order('created_at', { ascending: false }),
        supabase.from('completed_lessons').select('user_id, created_at'),
        supabase.from('quiz_attempts').select('percent, is_perfect, created_at'),
        supabase.from('exit_survey_responses').select('course_rating, preparedness, recommend, heard_from, most_valuable, exam_score, submitted_at'),
        supabase.from('enrolled_courses').select('user_id, course_id, created_at'),
        supabase.from('cfi_bookings').select('status, created_at').limit(200),
      ]);

      const profiles = profilesRes.data || [];
      const lessons = lessonsRes.data || [];
      const quizzes = quizRes.data || [];
      const surveys = surveysRes.data || [];
      const enrolled = enrolledRes.data || [];
      const bookings = bookingsRes.data || [];

      // Time ranges
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const weekAgo = new Date(now - 7 * 86400000).toISOString();
      const monthAgo = new Date(now - 30 * 86400000).toISOString();

      // Users
      const totalUsers = profiles.length;
      const paidUsers = profiles.filter(p => p.plan && p.plan !== 'free').length;
      const newThisWeek = profiles.filter(p => p.created_at >= weekAgo).length;
      const activeStreaks = profiles.filter(p => p.streak >= 3).length;

      // Lessons
      const totalLessonsCompleted = lessons.length;
      const lessonsThisWeek = lessons.filter(l => l.created_at >= weekAgo).length;

      // Quizzes
      const avgScore = quizzes.length
        ? Math.round(quizzes.reduce((a, q) => a + q.percent, 0) / quizzes.length)
        : 0;
      const passRate = quizzes.length
        ? Math.round(quizzes.filter(q => q.percent >= 70).length / quizzes.length * 100)
        : 0;
      const perfectCount = quizzes.filter(q => q.is_perfect).length;

      // Surveys
      const totalSurveys = surveys.length;
      const avgRating = surveys.length
        ? (surveys.reduce((a, s) => a + (s.course_rating || 0), 0) / surveys.filter(s => s.course_rating).length || 0).toFixed(1)
        : '—';
      const avgPreparedness = surveys.length
        ? (surveys.reduce((a, s) => a + (s.preparedness || 0), 0) / surveys.filter(s => s.preparedness).length || 0).toFixed(1)
        : '—';

      // Rating distribution
      const ratingDist = [5, 4, 3, 2, 1].map(r => ({
        rating: r,
        count: surveys.filter(s => s.course_rating === r).length,
      }));

      // Heard from distribution
      const heardFrom = {};
      surveys.forEach(s => {
        if (s.heard_from) heardFrom[s.heard_from] = (heardFrom[s.heard_from] || 0) + 1;
      });
      const heardFromSorted = Object.entries(heardFrom).sort((a, b) => b[1] - a[1]);

      // Recommend distribution
      const recommendDist = {};
      surveys.forEach(s => {
        if (s.recommend) recommendDist[s.recommend] = (recommendDist[s.recommend] || 0) + 1;
      });

      // Course enrollment
      const courseEnrollment = {};
      enrolled.forEach(e => {
        courseEnrollment[e.course_id] = (courseEnrollment[e.course_id] || 0) + 1;
      });

      // Recent signups (last 10)
      const recentSignups = profiles.slice(0, 10);

      // Recent surveys
      const recentSurveys = [...surveys].sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)).slice(0, 8);

      // Bookings
      const pendingBookings = bookings.filter(b => b.status === 'pending').length;
      const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;

      setStats({
        totalUsers, paidUsers, newThisWeek, activeStreaks,
        totalLessonsCompleted, lessonsThisWeek,
        avgScore, passRate, perfectCount,
        totalSurveys, avgRating, avgPreparedness, ratingDist,
        heardFromSorted, recommendDist,
        courseEnrollment,
        recentSignups, recentSurveys,
        pendingBookings, confirmedBookings,
      });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    setLastRefresh(new Date());
  };

  useEffect(() => { load(); }, []);

  const HEARD_LABELS = {
    google: 'Google Search', youtube: 'YouTube', social_media: 'Social Media',
    friend: 'Friend / Word of Mouth', flight_school: 'Flight School', other: 'Other',
  };
  const RECOMMEND_LABELS = {
    yes: '🙌 Absolutely', probably: '👍 Probably', maybe: '🤔 Maybe', no: '👎 Probably not',
  };
  const RECOMMEND_COLORS = { yes: '#22c55e', probably: '#38bdf8', maybe: '#f59e0b', no: '#f87171' };

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
            Analytics Dashboard
          </h1>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
            Last refreshed {lastRefresh.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </div>
        </div>
        <button
          onClick={load}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 18px', borderRadius: 10,
            background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)',
            color: '#38bdf8', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {loading && !stats ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#475569' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          Loading analytics...
        </div>
      ) : stats ? (
        <>
          {/* Top metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
            <MetricCard icon={Users} label="Total Users" value={stats.totalUsers} sub={`+${stats.newThisWeek} this week`} color="rgba(14,165,233,0.35)" delay={0.05} />
            <MetricCard icon={DollarSign} label="Paying Students" value={stats.paidUsers} sub={`${stats.totalUsers > 0 ? Math.round(stats.paidUsers / stats.totalUsers * 100) : 0}% conversion`} color="rgba(34,197,94,0.35)" delay={0.1} />
            <MetricCard icon={BookOpen} label="Lessons Completed" value={stats.totalLessonsCompleted.toLocaleString()} sub={`${stats.lessonsThisWeek} this week`} color="rgba(139,92,246,0.35)" delay={0.15} />
            <MetricCard icon={TrendingUp} label="Avg Quiz Score" value={`${stats.avgScore}%`} sub={`${stats.passRate}% pass rate`} color="rgba(245,158,11,0.35)" delay={0.2} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
            <MetricCard icon={Star} label="Avg Course Rating" value={stats.avgRating} sub={`${stats.totalSurveys} survey responses`} color="rgba(251,191,36,0.35)" delay={0.25} />
            <MetricCard icon={Star} label="Avg Exam Preparedness" value={stats.avgPreparedness} sub="Self-reported (1–5)" color="rgba(56,189,248,0.25)" delay={0.3} />
            <MetricCard icon={BarChart2} label="Active Streaks (3d+)" value={stats.activeStreaks} sub="Students on a roll" color="rgba(239,68,68,0.25)" delay={0.35} />
            <MetricCard icon={ClipboardList} label="CFI Bookings" value={stats.confirmedBookings} sub={`${stats.pendingBookings} pending`} color="rgba(192,132,252,0.3)" delay={0.4} />
          </div>

          {/* Mid row: Survey ratings + Heard from + Recommend */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 24 }}>
            {/* Rating distribution */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '22px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: '0 0 16px' }}>Course Ratings</h3>
              {stats.ratingDist.map(r => (
                <StarRow key={r.rating} rating={r.rating} count={r.count} total={stats.totalSurveys} />
              ))}
              <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', textAlign: 'center' }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#fbbf24', fontFamily: "'Space Grotesk', sans-serif" }}>{stats.avgRating}</span>
                <span style={{ fontSize: 12, color: '#78716c', marginLeft: 6 }}>/ 5.0 average</span>
              </div>
            </div>

            {/* How they heard */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '22px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: '0 0 16px' }}>How They Found Us</h3>
              {stats.heardFromSorted.length === 0 ? (
                <div style={{ color: '#475569', fontSize: 13 }}>No survey data yet</div>
              ) : (
                stats.heardFromSorted.map(([key, val]) => (
                  <MiniBar
                    key={key}
                    label={HEARD_LABELS[key] || key}
                    value={val}
                    max={Math.max(...stats.heardFromSorted.map(([, v]) => v))}
                    color="linear-gradient(90deg, #38bdf8, #818cf8)"
                  />
                ))
              )}
            </div>

            {/* Would recommend */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '22px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: '0 0 16px' }}>Would Recommend?</h3>
              {Object.keys(RECOMMEND_LABELS).map(key => {
                const val = stats.recommendDist[key] || 0;
                const total = Object.values(stats.recommendDist).reduce((a, v) => a + v, 0);
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: '#94a3b8', width: 130, flexShrink: 0 }}>{RECOMMEND_LABELS[key]}</span>
                    <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: total > 0 ? `${(val / total) * 100}%` : '0%' }}
                        transition={{ duration: 0.8 }}
                        style={{ height: '100%', background: RECOMMEND_COLORS[key], borderRadius: 4 }}
                      />
                    </div>
                    <span style={{ fontSize: 12, color: '#64748b', width: 20, textAlign: 'right' }}>{val}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent signups + Recent surveys */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Recent signups */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '22px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: '0 0 16px' }}>Recent Signups</h3>
              {stats.recentSignups.length === 0 ? (
                <div style={{ color: '#475569', fontSize: 13 }}>No users yet</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {stats.recentSignups.map((u, i) => (
                    <div key={u.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: i < stats.recentSignups.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#38bdf8' }}>
                          {(u.full_name || u.username || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{u.full_name || u.username || 'Student'}</div>
                          <div style={{ fontSize: 11, color: '#475569' }}>Lvl {u.level} · {u.xp} XP</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                        {u.plan && u.plan !== 'free' && (
                          <div style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700, marginTop: 2 }}>PAID</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent survey responses */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '22px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: '0 0 16px' }}>Exit Survey Responses</h3>
              {stats.recentSurveys.length === 0 ? (
                <div style={{ color: '#475569', fontSize: 13 }}>No surveys yet</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {stats.recentSurveys.map((s, i) => (
                    <div key={i} style={{
                      padding: '10px 0',
                      borderBottom: i < stats.recentSurveys.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <span style={{ fontSize: 13, color: '#fbbf24' }}>{'★'.repeat(s.course_rating || 0)}</span>
                            {s.exam_score != null && (
                              <span style={{ fontSize: 11, color: s.exam_score >= 70 ? '#4ade80' : '#f87171', fontWeight: 700 }}>
                                Exam: {s.exam_score}%
                              </span>
                            )}
                          </div>
                          {s.comments && (
                            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3, lineHeight: 1.4, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              "{s.comments}"
                            </div>
                          )}
                          <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
                            {HEARD_LABELS[s.heard_from] || s.heard_from || '—'}
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: '#475569', flexShrink: 0 }}>
                          {new Date(s.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
