import { motion } from 'framer-motion';
import { Zap, Flame, BookOpen, Target, Award, Star, TrendingUp, CheckCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { BADGES, COURSES } from '../data/courses';

const LEVEL_TITLES = ['', 'Student Pilot', 'Solo Flyer', 'Cross-Country Pilot', 'Instrument Student', 'Commercial Trainee', 'CFI Candidate', 'Multi-Engine Pilot', 'ATP Candidate', 'Check Airman', 'Master Aviator'];

function StatBox({ icon, value, label, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16, padding: '18px 20px',
      flex: 1, minWidth: 130,
    }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: color || '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function Profile() {
  const { user, levelPercent, xpForNextLevel, xpForCurrentLevel } = useUser();
  const levelTitle = LEVEL_TITLES[user.level] || 'Master Aviator';
  const earnedBadges = BADGES.filter(b => user.earnedBadges.includes(b.id));
  const lockedBadges = BADGES.filter(b => !user.earnedBadges.includes(b.id));
  const totalQuizzes = Object.keys(user.quizScores).length;
  const avgScore = totalQuizzes
    ? Math.round(Object.values(user.quizScores).reduce((a, v) => a + v.percent, 0) / totalQuizzes)
    : 0;

  return (
    <div style={{ padding: '32px 36px', maxWidth: 900 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <span style={{ fontSize: 12, color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>My Profile</span>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif", margin: '6px 0 0', letterSpacing: '-0.5px' }}>
          Pilot Training Hub
        </h1>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(139,92,246,0.08))',
          border: '1px solid rgba(14,165,233,0.2)',
          borderRadius: 24, padding: '28px 32px',
          marginBottom: 28,
          display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap',
        }}
      >
        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0ea5e9, #818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, fontWeight: 700, color: '#fff',
            boxShadow: '0 0 30px rgba(14,165,233,0.4)',
          }}>
            P
          </div>
          {/* Level badge */}
          <div style={{
            position: 'absolute', bottom: -4, right: -4,
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, color: '#000',
            border: '2px solid #060f1e',
            boxShadow: '0 2px 8px rgba(245,158,11,0.4)',
          }}>
            {user.level}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>
            Pilot Student
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 14, color: '#94a3b8' }}>{levelTitle}</span>
            {user.streak > 0 && (
              <span style={{
                fontSize: 12, color: '#fbbf24', fontWeight: 700,
                padding: '2px 8px', borderRadius: 20,
                background: 'rgba(245,158,11,0.12)',
                border: '1px solid rgba(245,158,11,0.25)',
              }}>
                🔥 {user.streak}-day streak
              </span>
            )}
          </div>
          {/* XP bar */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>Level {user.level} → {user.level + 1}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8' }}>
                {user.xp.toLocaleString()} / {xpForNextLevel?.toLocaleString()} XP
              </span>
            </div>
            <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 5, overflow: 'hidden' }}>
              <motion.div
                className="progress-bar"
                style={{ height: '100%', borderRadius: 5 }}
                initial={{ width: 0 }}
                animate={{ width: `${levelPercent}%` }}
                transition={{ duration: 1.2 }}
              />
            </div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{levelPercent}% to next level</div>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'XP', value: user.xp.toLocaleString(), icon: '⚡', color: '#38bdf8' },
            { label: 'Badges', value: earnedBadges.length, icon: '🏆', color: '#f59e0b' },
            { label: 'Streak', value: `${user.streak}d`, icon: '🔥', color: '#f87171' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '12px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 22 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
        <StatBox icon="📚" value={user.completedLessons.length} label="Lessons Done" color="#38bdf8" />
        <StatBox icon="🎯" value={totalQuizzes ? `${avgScore}%` : '—'} label="Avg Quiz Score" color="#22c55e" />
        <StatBox icon="📖" value={user.enrolledCourses.length} label="Courses Enrolled" color="#818cf8" />
        <StatBox icon="✅" value={user.completedCourses.length} label="Courses Completed" color="#f59e0b" />
        <StatBox icon="🏅" value={user.perfectQuizzes.length} label="Perfect Quizzes" color="#c084fc" />
      </div>

      {/* Course Progress */}
      {user.enrolledCourses.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: '0 0 16px', fontFamily: "'Space Grotesk', sans-serif" }}>
            Course Progress
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {COURSES.filter(c => user.enrolledCourses.includes(c.id)).map((course, i) => {
              const allLessons = course.modules.flatMap(m => m.lessons);
              const done = allLessons.filter(l => user.completedLessons.includes(l.id)).length;
              const pct = allLessons.length ? Math.round((done / allLessons.length) * 100) : 0;
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${pct === 100 ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 14, padding: '16px 20px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <span style={{ fontSize: 22 }}>{course.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{course.title}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{done}/{allLessons.length} lessons</div>
                    </div>
                    {pct === 100 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#4ade80', fontSize: 13, fontWeight: 600 }}>
                        <CheckCircle size={14} /> Complete
                      </div>
                    ) : (
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#38bdf8' }}>{pct}%</span>
                    )}
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div
                      className="progress-bar"
                      style={{ height: '100%', borderRadius: 3 }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Badges Section */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: '0 0 16px', fontFamily: "'Space Grotesk', sans-serif" }}>
          Badges & Achievements
        </h2>

        {earnedBadges.length > 0 && (
          <>
            <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              Earned ({earnedBadges.length})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
              {earnedBadges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.06, type: 'spring', stiffness: 300 }}
                  className="badge-card earned"
                >
                  <div style={{ fontSize: 36 }}>{badge.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24', textAlign: 'center' }}>{badge.title}</div>
                  <div style={{ fontSize: 11, color: '#92400e', textAlign: 'center', lineHeight: 1.4 }}>{badge.description}</div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {lockedBadges.length > 0 && (
          <>
            <div style={{ fontSize: 12, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              Locked ({lockedBadges.length})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {lockedBadges.map((badge, i) => (
                <div key={badge.id} className="badge-card" style={{ opacity: 0.5 }}>
                  <div style={{ fontSize: 36, filter: 'grayscale(1)' }}>{badge.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', textAlign: 'center' }}>{badge.title}</div>
                  <div style={{ fontSize: 11, color: '#334155', textAlign: 'center', lineHeight: 1.4 }}>{badge.description}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
