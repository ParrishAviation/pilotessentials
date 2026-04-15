import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, BookOpen, Trophy, Star, ChevronRight, Flame, Lock, MessageSquare, Target, AlertTriangle, Gift } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { COURSES, BADGES } from '../data/courses';
import { supabase } from '../lib/supabase';

const LEVEL_TITLES = ['', 'Student Pilot', 'Solo Flyer', 'Cross-Country Pilot', 'Instrument Student', 'Commercial Trainee', 'CFI Candidate', 'Multi-Engine Pilot', 'ATP Candidate', 'Check Airman', 'Master Aviator'];

function StatCard({ icon, value, label, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flex: 1,
      }}
    >
      <div style={{
        width: 48, height: 48,
        borderRadius: 14,
        background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22,
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{label}</div>
      </div>
    </motion.div>
  );
}

function CourseProgressCard({ course, progress, onContinue }) {
  const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);
  const pct = totalLessons ? Math.round((progress / totalLessons) * 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={onContinue}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      className="glass-hover"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: course.bgColor,
          border: `1px solid ${course.borderColor}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>
          {course.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {course.title}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{progress}/{totalLessons} lessons</div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#38bdf8' }}>{pct}%</div>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        <motion.div
          className="progress-bar"
          style={{ height: '100%', borderRadius: 3 }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#38bdf8' }}>
          Continue <ChevronRight size={14} />
        </div>
      </div>
    </motion.div>
  );
}

function BadgeShowcase({ badges }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {badges.slice(0, 6).map((b, i) => (
        <motion.div
          key={b.id}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
          title={b.title}
          style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid rgba(245,158,11,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
            boxShadow: '0 0 15px rgba(245,158,11,0.15)',
          }}
        >
          {b.icon}
        </motion.div>
      ))}
      {badges.length > 6 && (
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#64748b',
        }}>
          +{badges.length - 6}
        </div>
      )}
    </div>
  );
}

function UpgradeBanner({ onUpgrade }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(234,88,12,0.08) 100%)',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: 16,
        padding: '16px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'rgba(245,158,11,0.15)',
          border: '1px solid rgba(245,158,11,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Lock size={18} color="#f59e0b" />
        </div>
        <div>
          <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: 14, fontFamily: "'Space Grotesk', sans-serif" }}>
            You're on the Free Plan
          </div>
          <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 1 }}>
            Upgrade to unlock all 17 chapters, AI study guides, practice tests, and more.
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onUpgrade('full_access')}
          style={{
            padding: '9px 20px', borderRadius: 10,
            background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
            border: 'none', color: '#fff',
            fontWeight: 700, fontSize: 14, cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Full Access — $399
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onUpgrade('cfi_mentorship')}
          style={{
            padding: '9px 20px', borderRadius: 10,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: 'none', color: '#fff',
            fontWeight: 700, fontSize: 14, cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          CFI Mentorship — $999
        </motion.button>
      </div>
    </motion.div>
  );
}

// Pick a "daily challenge" lesson based on the date + user progress
function getDailyChallenge(enrolledCourses, completedLessons) {
  const today = new Date().toISOString().split('T')[0];
  const seed = today.split('-').reduce((a, v) => a + parseInt(v), 0);

  for (const course of enrolledCourses) {
    const allLessons = course.modules.flatMap(m => m.lessons);
    const incomplete = allLessons.filter(l => !completedLessons.includes(l.id) && l.type !== 'info');
    if (incomplete.length > 0) {
      const pick = incomplete[seed % incomplete.length];
      const mod = course.modules.find(m => m.lessons.some(l => l.id === pick.id));
      return { lesson: pick, course, module: mod };
    }
  }
  return null;
}

const STREAK_MILESTONE = 7;
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function StreakChallengeWidget({ streak, navigate }) {
  const [platformAvg, setPlatformAvg] = useState(null);
  const [unlockAnim, setUnlockAnim] = useState(false);
  const daysLeft = Math.max(0, STREAK_MILESTONE - streak);
  const isUnlocked = streak >= STREAK_MILESTONE;
  const pct = Math.min(100, (streak / STREAK_MILESTONE) * 100);

  useEffect(() => {
    supabase
      .from('profiles')
      .select('streak')
      .gt('streak', 0)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const avg = Math.round(data.reduce((s, r) => s + (r.streak || 0), 0) / data.length);
          setPlatformAvg(avg);
        }
      });
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      setTimeout(() => setUnlockAnim(true), 400);
    }
  }, [isUnlocked]);

  const circumference = 2 * Math.PI * 30;
  const dashOffset = circumference - (circumference * pct) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      style={{
        background: isUnlocked
          ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,191,36,0.06))'
          : 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(245,158,11,0.06))',
        border: `1px solid ${isUnlocked ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.25)'}`,
        borderRadius: 20,
        padding: '20px 22px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow behind ring when unlocked */}
      {isUnlocked && (
        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Flame size={15} color={isUnlocked ? '#f59e0b' : '#f87171'} />
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>7-Day Streak Challenge</h3>
        {isUnlocked && (
          <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: '#f59e0b', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, padding: '2px 8px' }}>
            UNLOCKED ✓
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
        {/* Ring */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width="76" height="76" viewBox="0 0 76 76">
            <circle cx="38" cy="38" r="30" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
            <circle cx="38" cy="38" r="30" fill="none"
              stroke={isUnlocked ? '#f59e0b' : '#f87171'}
              strokeWidth="7" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 38 38)"
              style={{ transition: 'stroke-dashoffset 1.2s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: isUnlocked ? '#fbbf24' : '#f87171', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>{streak}</div>
            <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>days</div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
            {isUnlocked ? '🎉 Practice Test Unlocked!' : daysLeft === 1 ? '1 day away from the reward!' : `${daysLeft} days to unlock reward`}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, marginBottom: 8 }}>
            {isUnlocked
              ? 'You earned a free PPL practice test. Keep the streak going for XP bonuses!'
              : `Study ${daysLeft} more day${daysLeft !== 1 ? 's' : ''} in a row to unlock a free PPL practice test.`}
          </div>
          {platformAvg !== null && (
            <div style={{ fontSize: 11, color: '#475569' }}>
              Platform avg: <span style={{ color: '#94a3b8', fontWeight: 600 }}>{platformAvg} days</span>
              {streak > platformAvg && <span style={{ color: '#4ade80', fontWeight: 700, marginLeft: 4 }}>↑ You're above average!</span>}
            </div>
          )}
        </div>
      </div>

      {/* Day dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {Array.from({ length: STREAK_MILESTONE }).map((_, i) => {
          const filled = i < streak;
          const current = i === streak && !isUnlocked;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <motion.div
                animate={current ? { scale: [1, 1.15, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.8 }}
                style={{
                  width: '100%', height: 8, borderRadius: 4,
                  background: filled
                    ? (i >= 6 ? '#f59e0b' : '#f87171')
                    : current
                      ? 'rgba(248,113,113,0.3)'
                      : 'rgba(255,255,255,0.07)',
                  border: current ? '1px solid rgba(248,113,113,0.5)' : 'none',
                  transition: 'background 0.4s ease',
                }}
              />
              <div style={{ fontSize: 9, color: filled ? '#94a3b8' : '#334155' }}>{DAY_LABELS[i]}</div>
            </div>
          );
        })}
      </div>

      {/* Reward / CTA */}
      <AnimatePresence>
        {isUnlocked ? (
          <motion.button
            key="unlock"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/course/ppl-course/quiz/ppl-final-test')}
            style={{
              width: '100%', padding: '11px', borderRadius: 12,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none', color: '#000', fontSize: 13, fontWeight: 800,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <Gift size={14} /> Take Your Free Practice Test →
          </motion.button>
        ) : (
          <motion.button
            key="study"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/courses')}
            style={{
              width: '100%', padding: '10px', borderRadius: 12,
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <Flame size={13} /> Study Now to Extend Streak →
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, updateStreak, checkStreakWarning, streakWarning } = useUser();
  const { hasPaid, tierLoading } = useAuth();

  useEffect(() => {
    updateStreak();
  }, []);

  useEffect(() => {
    checkStreakWarning?.();
  }, [user.streak, user.lastActiveDate]);

  const enrolledCourses = COURSES.filter(c => user.enrolledCourses.includes(c.id));
  const earnedBadgeObjects = BADGES.filter(b => user.earnedBadges.includes(b.id));
  const levelTitle = LEVEL_TITLES[user.level] || 'Master Aviator';

  const totalQuizzesTaken = Object.keys(user.quizScores).length;
  const avgScore = totalQuizzesTaken
    ? Math.round(Object.values(user.quizScores).reduce((a, v) => a + v.percent, 0) / totalQuizzesTaken)
    : 0;

  const dailyChallenge = getDailyChallenge(enrolledCourses, user.completedLessons);

  // Daily goals: check today's activity
  const today = new Date().toISOString().split('T')[0];
  const trainedToday = user.lastActiveDate === today;

  return (
    <div className="page-container" style={{ padding: '32px 36px', maxWidth: 1100 }}>
      {/* Upgrade Banner */}
      {!tierLoading && !hasPaid && (
        <UpgradeBanner onUpgrade={(plan) => navigate(`/checkout?plan=${plan}`)} />
      )}

      {/* Streak Warning Banner */}
      <AnimatePresence>
        {streakWarning && user.streak >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            style={{
              background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(245,158,11,0.08))',
              border: '1px solid rgba(239,68,68,0.35)',
              borderRadius: 14,
              padding: '14px 20px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <AlertTriangle size={18} color="#f87171" />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#f87171' }}>
                ⚠️ Train today or lose your {user.streak}-day streak!
              </span>
              <span style={{ fontSize: 13, color: '#94a3b8', marginLeft: 8 }}>
                Complete a lesson to keep it alive.
              </span>
            </div>
            <button
              onClick={() => navigate('/courses')}
              style={{
                padding: '7px 16px', borderRadius: 9,
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.35)',
                color: '#f87171', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Train Now →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-hero"
        style={{
          background: 'linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(192,132,252,0.05) 100%)',
          border: '1px solid rgba(14,165,233,0.2)',
          borderRadius: 24,
          padding: '32px 36px',
          marginBottom: 28,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                Welcome back, Pilot
              </div>
              <h1 style={{
                fontSize: 30, fontWeight: 800,
                fontFamily: "'Space Grotesk', sans-serif",
                color: '#f1f5f9', margin: 0, lineHeight: 1.2, letterSpacing: '-0.5px',
              }}>
                Ready to hit the books?<br />
                <span className="gradient-text">Let's fly through today's lessons.</span>
              </h1>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(245,158,11,0.15)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  borderRadius: 20, padding: '4px 12px',
                  fontSize: 13, fontWeight: 600, color: '#fbbf24',
                }}>
                  <span>✈️</span> {levelTitle}
                </div>
                {user.streak > 0 && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: user.streak >= 7 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.12)',
                    border: `1px solid ${user.streak >= 7 ? 'rgba(245,158,11,0.35)' : 'rgba(239,68,68,0.25)'}`,
                    borderRadius: 20, padding: '4px 12px',
                    fontSize: 13, fontWeight: 600,
                    color: user.streak >= 7 ? '#fbbf24' : '#f87171',
                  }}>
                    🔥 {user.streak}-day streak
                    {user.streak >= 7 && <span style={{ fontSize: 11, opacity: 0.8 }}>+XP bonus</span>}
                  </div>
                )}
              </div>
            </div>
            <button
              className="btn-primary"
              onClick={() => navigate('/courses')}
              style={{ padding: '14px 28px', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {enrolledCourses.length ? 'Continue Learning' : 'Browse Courses'}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="stats-row" style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <StatCard icon="⚡" value={user.xp.toLocaleString()} label="Total XP Earned" color="rgba(14,165,233,0.2)" delay={0.1} />
        <StatCard icon="📚" value={user.completedLessons.length} label="Lessons Completed" color="rgba(139,92,246,0.2)" delay={0.15} />
        <StatCard icon="🏆" value={earnedBadgeObjects.length} label="Badges Earned" color="rgba(245,158,11,0.2)" delay={0.2} />
        <StatCard icon="🎯" value={totalQuizzesTaken ? `${avgScore}%` : '—'} label="Avg. Quiz Score" color="rgba(34,197,94,0.2)" delay={0.25} />
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* In-progress courses */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                Your Courses
              </h2>
              <button onClick={() => navigate('/courses')} style={{ fontSize: 13, color: '#38bdf8', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                View All <ChevronRight size={14} />
              </button>
            </div>
            {enrolledCourses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '2px dashed rgba(255,255,255,0.1)',
                  borderRadius: 16,
                  padding: '48px 32px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>✈️</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>No courses enrolled yet</div>
                <div style={{ fontSize: 14, color: '#475569', marginBottom: 20 }}>Choose a course to begin your pilot training journey</div>
                <button className="btn-primary" onClick={() => navigate('/courses')} style={{ padding: '12px 24px', borderRadius: 12, color: '#fff', fontWeight: 600, fontSize: 14 }}>
                  Browse Courses →
                </button>
              </motion.div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {enrolledCourses.map(course => {
                  const progress = course.modules.flatMap(m => m.lessons).filter(l => user.completedLessons.includes(l.id)).length;
                  return (
                    <CourseProgressCard
                      key={course.id}
                      course={course}
                      progress={progress}
                      onContinue={() => navigate(`/course/${course.id}`)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Daily Challenge */}
          {dailyChallenge && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(139,92,246,0.08))',
                border: '1px solid rgba(14,165,233,0.25)',
                borderRadius: 18,
                padding: '20px 22px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(14,165,233,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={15} color="#38bdf8" />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: 0.8 }}>Today's Challenge</span>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, padding: '2px 10px' }}>
                  <Zap size={11} color="#f59e0b" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24' }}>+{dailyChallenge.lesson.xp} XP</span>
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
                {dailyChallenge.lesson._displayTitle || dailyChallenge.lesson.title}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
                {dailyChallenge.module?.title} · {dailyChallenge.course.title}
              </div>
              <button
                onClick={() => navigate(`/course/${dailyChallenge.course.id}`)}
                className="btn-primary"
                style={{ padding: '9px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                Start Lesson <ChevronRight size={14} />
              </button>
            </motion.div>
          )}

          {/* Suggested courses */}
          {COURSES.filter(c => !user.enrolledCourses.includes(c.id)).length > 0 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: '0 0 16px', fontFamily: "'Space Grotesk', sans-serif" }}>
                Suggested Courses
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {COURSES.filter(c => !user.enrolledCourses.includes(c.id)).slice(0, 2).map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ y: -4 }}
                    onClick={() => navigate(`/course/${course.id}`)}
                    style={{
                      background: course.bgColor,
                      border: `1px solid ${course.borderColor}`,
                      borderRadius: 16,
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{course.icon}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{course.title}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12, lineHeight: 1.4 }}>{course.subtitle}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: '#64748b' }}>{course.totalLessons} lessons · {course.totalHours}h</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8' }}>View →</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* XP Progress */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>XP Progress</h3>
              <div style={{ padding: '3px 10px', borderRadius: 20, background: 'linear-gradient(135deg, #f59e0b, #d97706)', fontSize: 11, fontWeight: 700, color: '#000' }}>
                LVL {user.level}
              </div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <svg width="120" height="70" viewBox="0 0 120 70">
                  <path d="M10 65 A 50 50 0 0 1 110 65" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" strokeLinecap="round" />
                  <path
                    d="M10 65 A 50 50 0 0 1 110 65"
                    fill="none"
                    stroke="url(#xpGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="157"
                    strokeDashoffset={157 - (157 * (user.xp > 0 ? Math.min(100, (user.xp / (LEVEL_TITLES.length * 1000)) * 100) : 0)) / 100}
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                  <defs>
                    <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#38bdf8', fontFamily: "'Space Grotesk', sans-serif" }}>{user.xp.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>XP</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', marginBottom: 12 }}>{levelTitle}</div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
              <motion.div
                className="progress-bar"
                style={{ height: '100%', borderRadius: 4 }}
                initial={{ width: 0 }}
                animate={{ width: `${user.xp > 0 ? Math.min(100, (user.xp / (LEVEL_TITLES.length * 1000)) * 100) : 0}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 6, textAlign: 'center' }}>Overall mastery progress</div>
          </div>

          {/* Daily Goals */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(192,132,252,0.06))',
            border: '1px solid rgba(139,92,246,0.25)',
            borderRadius: 20,
            padding: '22px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Target size={15} color="#c084fc" />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Daily Goals</h3>
              {trainedToday && (
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#4ade80', fontWeight: 700, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, padding: '2px 8px' }}>
                  ✓ Active today
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Complete 1 lesson', done: user.completedLessons.length > 0, xp: 50, action: () => navigate('/courses') },
                { label: 'Score 80%+ on a quiz', done: Object.values(user.quizScores).some(s => s.percent >= 80), xp: 100, action: () => navigate('/courses') },
                { label: 'Maintain your streak', done: trainedToday, xp: 25, action: null },
                { label: 'Post in chatroom', done: (user.chatMessages || 0) > 0, xp: 10, action: () => navigate('/chatroom') },
              ].map((goal, i) => (
                <div
                  key={i}
                  onClick={goal.action && !goal.done ? goal.action : undefined}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: goal.action && !goal.done ? 'pointer' : 'default' }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: goal.done ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)',
                    border: `2px solid ${goal.done ? '#22c55e' : 'rgba(255,255,255,0.12)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.3s',
                  }}>
                    {goal.done && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />}
                  </div>
                  <span style={{ fontSize: 13, color: goal.done ? '#4ade80' : '#94a3b8', flex: 1, textDecoration: goal.done ? 'line-through' : 'none' }}>
                    {goal.label}
                  </span>
                  <span style={{ fontSize: 11, color: '#38bdf8', fontWeight: 600 }}>+{goal.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Streak Challenge Widget */}
          <StreakChallengeWidget streak={user.streak || 0} navigate={navigate} />

          {/* Badges */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Badges</h3>
              <button onClick={() => navigate('/profile')} style={{ fontSize: 12, color: '#38bdf8', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                View all →
              </button>
            </div>
            {earnedBadgeObjects.length > 0 ? (
              <BadgeShowcase badges={earnedBadgeObjects} />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🏅</div>
                <div style={{ fontSize: 13, color: '#475569' }}>Complete lessons to earn badges</div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/chatroom')}
              style={{
                flex: 1, padding: '12px 14px', borderRadius: 12,
                background: 'rgba(56,189,248,0.08)',
                border: '1px solid rgba(56,189,248,0.2)',
                color: '#38bdf8', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <MessageSquare size={14} /> Chatroom
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/leaderboard')}
              style={{
                flex: 1, padding: '12px 14px', borderRadius: 12,
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.2)',
                color: '#fbbf24', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <Trophy size={14} /> Leaderboard
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
