import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Zap, ChevronRight, Search, HardHat } from 'lucide-react';
import { COURSES } from '../data/courses';
import { useUser } from '../context/UserContext';

const DIFFICULTY_COLORS = {
  'Beginner': '#22c55e',
  'Intermediate': '#f59e0b',
  'Advanced': '#ef4444',
  'Expert': '#c084fc',
};

function UnderConstructionCard({ course }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'default',
        position: 'relative',
      }}
    >
      {/* Dimmed content */}
      <div style={{ opacity: 0.35, pointerEvents: 'none', userSelect: 'none' }}>
        {/* Header */}
        <div style={{
          padding: '24px 24px 20px',
          background: `linear-gradient(135deg, ${course.bgColor}, transparent)`,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{
              display: 'inline-block',
              padding: '3px 10px', borderRadius: 20,
              background: `${course.badgeColor}22`,
              border: `1px solid ${course.badgeColor}55`,
              fontSize: 11, fontWeight: 700, color: course.badgeColor,
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>{course.badge}</div>
          </div>
          <div style={{ fontSize: 44, marginBottom: 14 }}>{course.icon}</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px', fontFamily: "'Space Grotesk', sans-serif" }}>
            {course.title}
          </h3>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>{course.subtitle}</div>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{course.description}</p>
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <BookOpen size={13} color="#64748b" />
              <span style={{ fontSize: 12, color: '#64748b' }}>{course.totalLessons} lessons</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={13} color="#64748b" />
              <span style={{ fontSize: 12, color: '#64748b' }}>{course.totalHours}h content</span>
            </div>
          </div>
          <div style={{
            width: '100%', padding: '12px', borderRadius: 12,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            height: 44,
          }} />
        </div>
      </div>

      {/* Under Construction overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(6,15,30,0.55)',
        backdropFilter: 'blur(2px)',
      }}>
        <div style={{
          background: 'rgba(245,158,11,0.12)',
          border: '1px solid rgba(245,158,11,0.35)',
          borderRadius: 16, padding: '20px 28px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(245,158,11,0.15)',
            border: '1px solid rgba(245,158,11,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <HardHat size={22} color="#f59e0b" />
          </div>
          <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: 15, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4 }}>
            Under Construction
          </div>
          <div style={{ color: '#78716c', fontSize: 12, lineHeight: 1.5 }}>
            Coming soon — check back later
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CourseCard({ course, enrolled, completed, progress, totalLessons, onClick }) {
  const pct = totalLessons ? Math.round((progress / totalLessons) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${enrolled ? course.borderColor : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: enrolled ? `0 0 30px ${course.glowColor}` : '0 4px 20px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '24px 24px 20px',
        background: `linear-gradient(135deg, ${course.bgColor}, transparent)`,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
      }}>
        {/* Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{
            padding: '3px 10px', borderRadius: 20,
            background: `${course.badgeColor}22`,
            border: `1px solid ${course.badgeColor}55`,
            fontSize: 11, fontWeight: 700, color: course.badgeColor,
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>
            {course.badge}
          </div>
          {enrolled && (
            <div style={{
              padding: '3px 10px', borderRadius: 20,
              background: completed ? 'rgba(34,197,94,0.15)' : 'rgba(14,165,233,0.15)',
              border: `1px solid ${completed ? 'rgba(34,197,94,0.4)' : 'rgba(14,165,233,0.4)'}`,
              fontSize: 11, fontWeight: 700, color: completed ? '#4ade80' : '#38bdf8',
            }}>
              {completed ? '✓ Completed' : '▶ In Progress'}
            </div>
          )}
        </div>
        <div style={{ fontSize: 44, marginBottom: 14 }}>{course.icon}</div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px', fontFamily: "'Space Grotesk', sans-serif" }}>
          {course.title}
        </h3>
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>{course.subtitle}</div>
        <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{course.description}</p>
      </div>

      {/* Stats */}
      <div style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <BookOpen size={13} color="#64748b" />
            <span style={{ fontSize: 12, color: '#64748b' }}>{course.totalLessons} lessons</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Clock size={13} color="#64748b" />
            <span style={{ fontSize: 12, color: '#64748b' }}>{course.totalHours}h content</span>
          </div>
        </div>

        {/* XP Reward */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              padding: '3px 10px', borderRadius: 20,
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.25)',
              fontSize: 12, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <Zap size={12} color="#f59e0b" />
              <span style={{ color: '#f59e0b' }}>{course.xpReward.toLocaleString()} XP</span>
            </div>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 700,
            color: DIFFICULTY_COLORS[course.difficulty] || '#94a3b8',
            padding: '3px 10px', borderRadius: 20,
            background: `${DIFFICULTY_COLORS[course.difficulty]}15`,
          }}>
            {course.difficulty}
          </div>
        </div>

        {/* Progress bar if enrolled */}
        {enrolled && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>Your progress</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8' }}>{pct}%</span>
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
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            ...(enrolled ? {
              background: `linear-gradient(135deg, ${course.borderColor.replace('0.3', '0.8')}, ${course.bgColor.replace('0.12', '0.4')})`,
              border: `1px solid ${course.borderColor}`,
            } : {
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(14,165,233,0.3)',
            }),
            cursor: 'pointer',
          }}
        >
          {enrolled ? (completed ? '🔁 Review Course' : '▶ Continue') : '🚀 Start Course'}
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function CourseCatalog() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState('All');

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const filtered = COURSES.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.subtitle.toLowerCase().includes(search.toLowerCase());
    const matchDiff = filterDiff === 'All' || c.difficulty === filterDiff;
    return matchSearch && matchDiff;
  });

  return (
    <div style={{ padding: '32px 36px' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Course Library</span>
        </div>
        <h1 style={{
          fontSize: 32, fontWeight: 800, color: '#f1f5f9',
          fontFamily: "'Space Grotesk', sans-serif",
          margin: '0 0 8px', letterSpacing: '-0.5px',
        }}>
          FAA Exam Prep Courses
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', margin: '0 0 28px' }}>
          Video-based courses with quizzes and practice tests to prepare you for every FAA written exam.
        </p>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          <div style={{
            flex: 1, minWidth: 240,
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12, padding: '10px 16px',
          }}>
            <Search size={16} color="#64748b" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses..."
              style={{
                background: 'none', border: 'none', outline: 'none',
                color: '#e2e8f0', fontSize: 14, flex: 1,
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {difficulties.map(d => (
              <button
                key={d}
                onClick={() => setFilterDiff(d)}
                style={{
                  padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  border: filterDiff === d ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                  background: filterDiff === d ? 'rgba(14,165,233,0.15)' : 'rgba(255,255,255,0.03)',
                  color: filterDiff === d ? '#38bdf8' : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Course Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {filtered.map((course) => {
          if (course.underConstruction) {
            return <UnderConstructionCard key={course.id} course={course} />;
          }
          const enrolled = user.enrolledCourses.includes(course.id);
          const allLessons = course.modules.flatMap(m => m.lessons);
          const progress = allLessons.filter(l => user.completedLessons.includes(l.id)).length;
          const completed = user.completedCourses.includes(course.id);
          return (
            <CourseCard
              key={course.id}
              course={course}
              enrolled={enrolled}
              completed={completed}
              progress={progress}
              totalLessons={allLessons.length}
              onClick={() => navigate(`/course/${course.id}`)}
            />
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No courses found</div>
          <div style={{ fontSize: 14 }}>Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  );
}
