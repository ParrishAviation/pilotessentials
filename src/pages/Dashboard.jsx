import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, BookOpen, Trophy, Star, TrendingUp, Clock, Target, ChevronRight, Flame, Award, Lock } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { COURSES, BADGES } from '../data/courses';

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
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 12, fontWeight: 600, color: '#38bdf8',
        }}>
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

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, updateStreak } = useUser();
  const { hasPaid, tierLoading } = useAuth();

  useEffect(() => {
    updateStreak();
  }, []);

  const enrolledCourses = COURSES.filter(c => user.enrolledCourses.includes(c.id));
  const earnedBadgeObjects = BADGES.filter(b => user.earnedBadges.includes(b.id));
  const levelTitle = LEVEL_TITLES[user.level] || 'Master Aviator';

  const totalQuizzesTaken = Object.keys(user.quizScores).length;
  const avgScore = totalQuizzesTaken
    ? Math.round(Object.values(user.quizScores).reduce((a, v) => a + v.percent, 0) / totalQuizzesTaken)
    : 0;

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
      {/* Upgrade Banner — only shown to free users */}
      {!tierLoading && !hasPaid && (
        <UpgradeBanner onUpgrade={(plan) => navigate(`/checkout?plan=${plan}`)} />
      )}
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
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
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 200, height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
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
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
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
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    borderRadius: 20, padding: '4px 12px',
                    fontSize: 13, fontWeight: 600, color: '#f87171',
                  }}>
                    🔥 {user.streak} day streak
                  </div>
                )}
              </div>
            </div>
            <button
              className="btn-primary"
              onClick={() => navigate('/courses')}
              style={{
                padding: '14px 28px', borderRadius: 14,
                fontSize: 15, fontWeight: 700, color: '#fff',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              {enrolledCourses.length ? 'Continue Learning' : 'Browse Courses'}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <StatCard icon="⚡" value={user.xp.toLocaleString()} label="Total XP Earned" color="rgba(14,165,233,0.2)" delay={0.1} />
        <StatCard icon="📚" value={user.completedLessons.length} label="Lessons Completed" color="rgba(139,92,246,0.2)" delay={0.15} />
        <StatCard icon="🏆" value={earnedBadgeObjects.length} label="Badges Earned" color="rgba(245,158,11,0.2)" delay={0.2} />
        <StatCard icon="🎯" value={totalQuizzesTaken ? `${avgScore}%` : '—'} label="Avg. Quiz Score" color="rgba(34,197,94,0.2)" delay={0.25} />
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* In-progress courses */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                Your Courses
              </h2>
              <button
                onClick={() => navigate('/courses')}
                style={{ fontSize: 13, color: '#38bdf8', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
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
                      <span style={{ fontSize: 11, color: '#64748b' }}>{course.totalLessons} lessons • {course.totalHours}h</span>
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
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: '22px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>XP Progress</h3>
              <div style={{
                padding: '3px 10px', borderRadius: 20,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                fontSize: 11, fontWeight: 700, color: '#000',
              }}>
                LVL {user.level}
              </div>
            </div>
            {/* Level arc visualization */}
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
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#38bdf8', fontFamily: "'Space Grotesk', sans-serif" }}>
                    {user.xp.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>XP</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', marginBottom: 12 }}>
              {levelTitle}
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
              <motion.div
                className="progress-bar"
                style={{ height: '100%', borderRadius: 4 }}
                initial={{ width: 0 }}
                animate={{ width: `${user.xp > 0 ? Math.min(100, (user.xp / (LEVEL_TITLES.length * 1000)) * 100) : 0}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 6, textAlign: 'center' }}>
              Overall mastery progress
            </div>
          </div>

          {/* Badges */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: '22px',
          }}>
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

          {/* Daily Goal */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(192,132,252,0.06))',
            border: '1px solid rgba(139,92,246,0.25)',
            borderRadius: 20,
            padding: '22px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Target size={16} color="#c084fc" />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Daily Goal</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Complete 1 lesson', done: user.completedLessons.length > 0, xp: 50 },
                { label: 'Score 80%+ on a quiz', done: Object.values(user.quizScores).some(s => s.percent >= 80), xp: 100 },
                { label: 'Maintain your streak', done: user.streak > 0, xp: 25 },
              ].map((goal, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: goal.done ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)',
                    border: `2px solid ${goal.done ? '#22c55e' : 'rgba(255,255,255,0.12)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
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
        </div>
      </div>
    </div>
  );
}
