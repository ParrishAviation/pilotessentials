import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Play, CheckCircle, Lock, Clock,
  BookOpen, Zap, Star, Users, Award, ChevronDown, ChevronUp, Video, FileText
} from 'lucide-react';
import { COURSES } from '../data/courses';
import { useUser } from '../context/UserContext';

function LessonRow({ lesson, isCompleted, isActive, isLocked, onSelect }) {
  const typeIcon = lesson.type === 'quiz' ? <FileText size={14} /> : <Video size={14} />;
  return (
    <div
      className={`lesson-item ${isActive ? 'active' : ''}`}
      onClick={!isLocked ? onSelect : undefined}
      style={{ opacity: isLocked ? 0.4 : 1, cursor: isLocked ? 'not-allowed' : 'pointer' }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isCompleted
          ? 'rgba(34,197,94,0.2)'
          : isActive
            ? 'rgba(14,165,233,0.2)'
            : 'rgba(255,255,255,0.05)',
        border: `1px solid ${isCompleted ? 'rgba(34,197,94,0.4)' : isActive ? 'rgba(14,165,233,0.4)' : 'rgba(255,255,255,0.1)'}`,
        color: isCompleted ? '#4ade80' : isActive ? '#38bdf8' : '#64748b',
      }}>
        {isCompleted ? <CheckCircle size={14} /> : isLocked ? <Lock size={14} /> : typeIcon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 500,
          color: isActive ? '#38bdf8' : isCompleted ? '#4ade80' : '#e2e8f0',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {lesson.title}
        </div>
        <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{lesson.duration}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <Zap size={10} color="#f59e0b" />
        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>+{lesson.xp}</span>
      </div>
    </div>
  );
}

function ModuleSection({ module, completedLessons, activeLesson, onSelectLesson }) {
  const [open, setOpen] = useState(true);
  const total = module.lessons.length;
  const done = module.lessons.filter(l => completedLessons.includes(l.id)).length;

  return (
    <div style={{ marginBottom: 8 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          cursor: 'pointer', marginBottom: 4,
        }}
      >
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{module.title}</div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{done}/{total} completed</div>
        </div>
        {done === total && total > 0 && <CheckCircle size={14} color="#4ade80" />}
        <div style={{ height: 4, width: 60, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #818cf8)', width: `${(done / total) * 100}%`, borderRadius: 2 }} />
        </div>
        {open ? <ChevronUp size={14} color="#64748b" /> : <ChevronDown size={14} color="#64748b" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden', paddingLeft: 8 }}
          >
            {module.lessons.map((lesson, idx) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                isCompleted={completedLessons.includes(lesson.id)}
                isActive={activeLesson?.id === lesson.id}
                isLocked={false}
                onSelect={() => onSelectLesson(lesson)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VideoPlayer({ lesson, onComplete, isCompleted }) {
  const [watched, setWatched] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulate video progress for demo purposes
  useEffect(() => {
    setWatched(false);
    setProgress(0);
  }, [lesson.id]);

  const handleSimulateWatch = () => {
    setProgress(100);
    setWatched(true);
  };

  return (
    <div>
      {/* Video placeholder */}
      <div style={{
        width: '100%', aspectRatio: '16/9',
        background: 'linear-gradient(135deg, #0c1a2e, #0a1628)',
        borderRadius: 16,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 20,
      }}>
        {/* Star background */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }} />
        ))}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(14,165,233,0.08) 0%, transparent 70%)',
        }} />
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(14,165,233,0.15)',
          border: '2px solid rgba(14,165,233,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 0 30px rgba(14,165,233,0.3)',
          zIndex: 2,
          transition: 'all 0.2s',
        }}
          onClick={handleSimulateWatch}
          className="animate-pulse-glow"
        >
          <Play size={32} color="#38bdf8" style={{ marginLeft: 4 }} />
        </div>
        <div style={{ marginTop: 20, fontSize: 15, fontWeight: 600, color: '#94a3b8', zIndex: 2 }}>
          {lesson.title}
        </div>
        <div style={{ fontSize: 12, color: '#475569', marginTop: 6, zIndex: 2 }}>
          Upload your recorded video here • {lesson.duration}
        </div>

        {/* Video progress bar at bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            style={{ height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #818cf8)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px', fontFamily: "'Space Grotesk', sans-serif" }}>
            {lesson.title}
          </h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} /> {lesson.duration}
            </span>
            <span style={{ fontSize: 13, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
              <Zap size={12} /> +{lesson.xp} XP on completion
            </span>
          </div>
        </div>

        {isCompleted ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 12,
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.3)',
            color: '#4ade80', fontSize: 14, fontWeight: 600,
          }}>
            <CheckCircle size={16} /> Completed
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary"
            onClick={onComplete}
            style={{
              padding: '11px 24px', borderRadius: 12,
              fontSize: 14, fontWeight: 700, color: '#fff',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <CheckCircle size={16} />
            Mark as Complete (+{lesson.xp} XP)
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, completeLesson, completeModule, completeCourse, enrollInCourse } = useUser();

  const course = COURSES.find(c => c.id === courseId);
  if (!course) return <div style={{ padding: 40, color: '#94a3b8' }}>Course not found.</div>;

  const allLessons = course.modules.flatMap(m => m.lessons);
  const firstUncompleted = allLessons.find(l => !user.completedLessons.includes(l.id));
  const [activeLesson, setActiveLesson] = useState(firstUncompleted || allLessons[0]);

  const isEnrolled = user.enrolledCourses.includes(course.id);
  const totalDone = allLessons.filter(l => user.completedLessons.includes(l.id)).length;
  const pct = allLessons.length ? Math.round((totalDone / allLessons.length) * 100) : 0;

  const handleEnroll = () => {
    enrollInCourse(course.id);
  };

  const handleCompleteLesson = () => {
    completeLesson(activeLesson.id, activeLesson.xp);
    // Check if module is complete
    const parentModule = course.modules.find(m => m.lessons.some(l => l.id === activeLesson.id));
    if (parentModule) {
      const allModuleLessons = parentModule.lessons.map(l => l.id);
      const newCompleted = [...user.completedLessons, activeLesson.id];
      const moduleComplete = allModuleLessons.every(id => newCompleted.includes(id));
      if (moduleComplete) completeModule(parentModule.id);
    }
    // Check if course is complete
    const allIds = allLessons.map(l => l.id);
    const newCompleted = [...user.completedLessons, activeLesson.id];
    if (allIds.every(id => newCompleted.includes(id))) {
      completeCourse(course.id);
    }
    // Auto-advance to next lesson
    const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
    if (currentIndex < allLessons.length - 1) {
      setTimeout(() => setActiveLesson(allLessons[currentIndex + 1]), 600);
    }
  };

  const isQuiz = activeLesson?.type === 'quiz';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{
        width: 320, flexShrink: 0,
        background: 'rgba(6,15,30,0.8)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        overflow: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Course Header */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => navigate('/courses')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: '#64748b', fontSize: 13, fontWeight: 500,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              marginBottom: 14,
            }}
          >
            <ChevronLeft size={16} /> Back to Courses
          </button>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: course.bgColor, border: `1px solid ${course.borderColor}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>
              {course.icon}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3 }}>{course.title}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{course.subtitle}</div>
            </div>
          </div>

          {/* Progress */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: '#64748b' }}>{totalDone}/{allLessons.length} lessons</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8' }}>{pct}%</span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
              <div className="progress-bar" style={{ height: '100%', width: `${pct}%`, borderRadius: 3 }} />
            </div>
          </div>
        </div>

        {/* Modules */}
        <div style={{ padding: '12px 12px', flex: 1, overflow: 'auto' }}>
          {course.modules.map(module => (
            <ModuleSection
              key={module.id}
              module={module}
              completedLessons={user.completedLessons}
              activeLesson={activeLesson}
              onSelectLesson={(lesson) => {
                if (lesson.type === 'quiz') {
                  navigate(`/quiz/${courseId}/${lesson.id}`);
                } else {
                  setActiveLesson(lesson);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto', background: '#060f1e' }}>
        {!isEnrolled ? (
          /* Enroll CTA */
          <div style={{ padding: '60px 48px', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div style={{ fontSize: 72, marginBottom: 24 }}>{course.icon}</div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px', fontFamily: "'Space Grotesk', sans-serif" }}>
                {course.title}
              </h1>
              <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 32px' }}>
                {course.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 36, flexWrap: 'wrap' }}>
                {[
                  { icon: <BookOpen size={16} />, text: `${course.totalLessons} Video Lessons` },
                  { icon: <Clock size={16} />, text: `${course.totalHours} Hours of Content` },
                  { icon: <Zap size={16} />, text: `${course.xpReward.toLocaleString()} XP Reward` },
                  { icon: <Award size={16} />, text: 'Certificate Worthy' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 14 }}>
                    <span style={{ color: '#38bdf8' }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="btn-primary"
                onClick={handleEnroll}
                style={{ padding: '16px 48px', borderRadius: 16, fontSize: 16, fontWeight: 700, color: '#fff' }}
              >
                🚀 Enroll Now — It's Free!
              </motion.button>
            </motion.div>
          </div>
        ) : (
          /* Lesson Content */
          <div style={{ padding: '32px 40px', maxWidth: 900 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLesson?.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {isQuiz ? (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ fontSize: 60, marginBottom: 20 }}>📝</div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', margin: '0 0 12px', fontFamily: "'Space Grotesk', sans-serif" }}>
                      {activeLesson.title}
                    </h2>
                    <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 28 }}>
                      Test your knowledge from this module with {activeLesson.duration}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="btn-gold"
                      onClick={() => navigate(`/quiz/${courseId}/${activeLesson.id}`)}
                      style={{ padding: '14px 36px', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#fff' }}
                    >
                      🎯 Start Quiz (+{activeLesson.xp} XP)
                    </motion.button>
                  </div>
                ) : (
                  <VideoPlayer
                    lesson={activeLesson}
                    onComplete={handleCompleteLesson}
                    isCompleted={user.completedLessons.includes(activeLesson?.id)}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {(() => {
                const idx = allLessons.findIndex(l => l.id === activeLesson?.id);
                const prev = allLessons[idx - 1];
                const next = allLessons[idx + 1];
                return (
                  <>
                    {prev ? (
                      <button onClick={() => {
                        if (prev.type === 'quiz') navigate(`/quiz/${courseId}/${prev.id}`);
                        else setActiveLesson(prev);
                      }} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 20px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#94a3b8', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                      }}>
                        <ChevronLeft size={16} /> {prev.title}
                      </button>
                    ) : <div />}
                    {next ? (
                      <button onClick={() => {
                        if (next.type === 'quiz') navigate(`/quiz/${courseId}/${next.id}`);
                        else setActiveLesson(next);
                      }} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 20px', borderRadius: 10,
                        background: 'rgba(14,165,233,0.1)',
                        border: '1px solid rgba(14,165,233,0.3)',
                        color: '#38bdf8', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                      }}>
                        {next.title} <ChevronRight size={16} />
                      </button>
                    ) : (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 20px', borderRadius: 10,
                        background: 'rgba(34,197,94,0.1)',
                        border: '1px solid rgba(34,197,94,0.3)',
                        color: '#4ade80', fontSize: 14, fontWeight: 600,
                      }}>
                        🎉 Course Complete!
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
