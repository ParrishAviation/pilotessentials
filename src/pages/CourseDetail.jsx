import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Play, CheckCircle, Lock, Clock,
  BookOpen, Zap, Star, Users, Award, ChevronDown, ChevronUp, Video, FileText, Shield, BookMarked,
  Trash2, RotateCcw
} from 'lucide-react';
import { COURSES } from '../data/courses';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import StudyGuide from '../components/StudyGuide';

const ADMIN_EMAILS = ['jack@parrishaviation.com', 'titiusmclaughlin@gmail.com'];

// Strip a leading number like "1 — " or "1 — " from a title, returning [num, rest]
function parseTitle(title) {
  const m = title.match(/^(\d+)\s*[—\-–]\s*(.+)$/);
  if (m) return { num: m[1], rest: m[2] };
  return { num: null, rest: title };
}

// Build the a/b virtual lessons from a real video lesson
function expandLesson(lesson) {
  const { num, rest } = parseTitle(lesson.title);
  const prefix = num ? `${num}` : '';

  const partA = {
    ...lesson,
    _partLabel: prefix ? `${prefix}a` : null,
    _displayTitle: prefix ? `${prefix}a — ${rest}` : lesson.title,
    _isPartA: true,
  };

  const partB = {
    id: `${lesson.id}-guide`,
    title: lesson.title,
    _displayTitle: prefix ? `${prefix}b — ${rest}` : `${lesson.title} — Study Guide`,
    _partLabel: prefix ? `${prefix}b` : null,
    duration: '10 min read',
    xp: Math.round(lesson.xp * 0.5),
    type: 'guide',
    _parentId: lesson.id,
  };

  return [partA, partB];
}

// Expand modules so every video lesson becomes two entries (a + b)
function expandModules(modules) {
  return modules.map(mod => ({
    ...mod,
    lessons: mod.lessons.flatMap(lesson =>
      lesson.type === 'video' ? expandLesson(lesson) : [lesson]
    ),
  }));
}

function LessonRow({ lesson, isCompleted, isActive, isLocked, isHidden, isAdmin, onSelect, onDelete, onRestore }) {
  const [hovered, setHovered] = useState(false);
  const isGuide = lesson.type === 'guide';
  const isQuiz = lesson.type === 'quiz';

  const typeIcon = isQuiz
    ? <FileText size={13} />
    : isGuide
      ? <BookMarked size={13} />
      : <Video size={13} />;

  return (
    <div
      className={`lesson-item ${isActive ? 'active' : ''}`}
      onClick={!isLocked && !isHidden ? onSelect : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: isLocked ? 0.4 : isHidden ? 0.35 : 1,
        cursor: isLocked || isHidden ? 'default' : 'pointer',
        position: 'relative',
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isCompleted
          ? 'rgba(34,197,94,0.2)'
          : isActive
            ? (isGuide ? 'rgba(129,140,248,0.2)' : 'rgba(14,165,233,0.2)')
            : (isGuide ? 'rgba(129,140,248,0.07)' : 'rgba(255,255,255,0.05)'),
        border: `1px solid ${isCompleted
          ? 'rgba(34,197,94,0.4)'
          : isActive
            ? (isGuide ? 'rgba(129,140,248,0.4)' : 'rgba(14,165,233,0.4)')
            : (isGuide ? 'rgba(129,140,248,0.2)' : 'rgba(255,255,255,0.1)')}`,
        color: isCompleted ? '#4ade80' : isActive ? (isGuide ? '#a78bfa' : '#38bdf8') : (isGuide ? '#7c6fcf' : '#64748b'),
      }}>
        {isCompleted ? <CheckCircle size={13} /> : isLocked ? <Lock size={13} /> : typeIcon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 500,
          color: isActive
            ? (isGuide ? '#a78bfa' : '#38bdf8')
            : isCompleted ? '#4ade80'
            : (isGuide ? '#b0a4e8' : '#e2e8f0'),
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          textDecoration: isHidden ? 'line-through' : 'none',
        }}>
          {lesson._displayTitle || lesson.title}
        </div>
        <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{lesson.duration}</div>
      </div>

      {/* Admin delete/restore — shown on hover */}
      {isAdmin && hovered ? (
        isHidden ? (
          <button
            onClick={(e) => { e.stopPropagation(); onRestore(lesson.id); }}
            title="Restore lesson"
            style={{
              flexShrink: 0, padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
              background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)',
              color: '#4ade80', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700,
            }}
          >
            <RotateCcw size={11} /> Restore
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(lesson.id); }}
            title="Hide lesson"
            style={{
              flexShrink: 0, padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700,
            }}
          >
            <Trash2 size={11} /> Delete
          </button>
        )
      ) : !isHidden && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <Zap size={10} color="#f59e0b" />
          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>+{lesson.xp}</span>
        </div>
      )}
    </div>
  );
}

function ModuleSection({ module, completedLessons, activeLesson, hiddenLessons, isAdmin, onSelectLesson, onDeleteLesson, onRestoreLesson }) {
  const [open, setOpen] = useState(true);
  // For progress count, exclude hidden lessons (unless admin)
  const visibleLessons = isAdmin ? module.lessons : module.lessons.filter(l => !hiddenLessons.has(l.id));
  const total = visibleLessons.length;
  const done = visibleLessons.filter(l => completedLessons.includes(l.id)).length;

  // Admins see all lessons (hidden ones dimmed); students see only visible ones
  const displayLessons = isAdmin ? module.lessons : visibleLessons;

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
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #818cf8)', width: `${total ? (done / total) * 100 : 0}%`, borderRadius: 2 }} />
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
            {displayLessons.map((lesson) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                isCompleted={completedLessons.includes(lesson.id)}
                isActive={activeLesson?.id === lesson.id}
                isLocked={false}
                isHidden={hiddenLessons.has(lesson.id)}
                isAdmin={isAdmin}
                onSelect={() => onSelectLesson(lesson)}
                onDelete={onDeleteLesson}
                onRestore={onRestoreLesson}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getGoogleDriveEmbedUrl(url) {
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
  return null;
}

function isGoogleDriveUrl(url) {
  return url?.includes('drive.google.com');
}

function VideoPlayer({ lesson, onComplete, isCompleted, videoUrl, isAdmin, onGoToAdmin }) {
  const videoRef = useRef(null);
  const [watched, setWatched] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const isDrive = isGoogleDriveUrl(videoUrl);
  const embedUrl = isDrive ? getGoogleDriveEmbedUrl(videoUrl) : null;

  useEffect(() => {
    setWatched(false);
    setVideoProgress(0);
  }, [lesson.id]);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const pct = (v.currentTime / v.duration) * 100;
    setVideoProgress(pct);
    if (pct >= 90 && !watched) setWatched(true);
  };

  const handleEnded = () => {
    setVideoProgress(100);
    setWatched(true);
  };

  return (
    <div>
      {videoUrl ? (
        isDrive ? (
          <div style={{
            width: '100%', borderRadius: 16, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            background: '#000', marginBottom: 20,
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            position: 'relative', aspectRatio: '16/9',
          }}>
            <iframe
              src={embedUrl}
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              allow="autoplay"
              allowFullScreen
            />
          </div>
        ) : (
          <div style={{
            width: '100%', borderRadius: 16, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            background: '#000', marginBottom: 20,
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            position: 'relative',
          }}>
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              style={{ width: '100%', display: 'block', maxHeight: 480 }}
            />
            <div style={{ height: 3, background: 'rgba(255,255,255,0.05)' }}>
              <motion.div
                style={{ height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #818cf8)' }}
                animate={{ width: `${videoProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )
      ) : (
        <div style={{
          width: '100%', aspectRatio: '16/9',
          background: 'linear-gradient(135deg, #0c1a2e, #0a1628)',
          borderRadius: 16,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.08)',
          position: 'relative', overflow: 'hidden', marginBottom: 20,
        }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: Math.random() * 3 + 1, height: Math.random() * 3 + 1,
              borderRadius: '50%', background: 'rgba(255,255,255,0.3)',
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            }} />
          ))}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(14,165,233,0.08) 0%, transparent 70%)',
          }} />
          <Video size={40} color="rgba(56,189,248,0.25)" style={{ zIndex: 2, marginBottom: 14 }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: '#475569', zIndex: 2, textAlign: 'center' }}>
            {lesson.title}
          </div>
          <div style={{ fontSize: 12, color: '#334155', marginTop: 6, zIndex: 2 }}>
            Video coming soon • {lesson.duration}
          </div>
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onGoToAdmin}
              style={{
                marginTop: 20, zIndex: 2,
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 20px', borderRadius: 10, cursor: 'pointer',
                background: 'rgba(129,140,248,0.15)',
                border: '1px solid rgba(129,140,248,0.35)',
                color: '#818cf8', fontSize: 13, fontWeight: 700,
              }}
            >
              <Shield size={14} /> Upload Video in Admin Panel
            </motion.button>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px', fontFamily: "'Space Grotesk', sans-serif" }}>
            {lesson._displayTitle || lesson.title}
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
  const { user: authUser } = useAuth();

  const course = COURSES.find(c => c.id === courseId);
  if (!course) return <div style={{ padding: 40, color: '#94a3b8' }}>Course not found.</div>;

  const isAdmin = ADMIN_EMAILS.includes(authUser?.email);

  // Expand modules to include a guide lesson after every video lesson
  const expandedModules = expandModules(course.modules);
  const allLessons = expandedModules.flatMap(m => m.lessons);

  const firstUncompleted = allLessons.find(l => !user.completedLessons.includes(l.id));
  const [activeLesson, setActiveLesson] = useState(firstUncompleted || allLessons[0]);
  const [videoUrls, setVideoUrls] = useState({});
  const [hiddenLessons, setHiddenLessons] = useState(new Set());

  // Fetch video URLs for this course
  useEffect(() => {
    supabase
      .from('lesson_videos')
      .select('lesson_id, video_url')
      .eq('course_id', courseId)
      .then(({ data }) => {
        if (data) {
          const map = {};
          data.forEach(r => { map[r.lesson_id] = r.video_url; });
          setVideoUrls(map);
        }
      });
  }, [courseId]);

  // Fetch hidden lesson IDs for this course
  useEffect(() => {
    supabase
      .from('hidden_lessons')
      .select('lesson_id')
      .eq('course_id', courseId)
      .then(({ data }) => {
        if (data) setHiddenLessons(new Set(data.map(r => r.lesson_id)));
      });
  }, [courseId]);

  const handleDeleteLesson = async (lessonId) => {
    const { error } = await supabase.from('hidden_lessons').insert({
      lesson_id: lessonId,
      course_id: courseId,
      hidden_by: authUser.id,
    });
    if (!error) {
      setHiddenLessons(prev => new Set([...prev, lessonId]));
      // If the deleted lesson is currently active, move to the next visible one
      if (activeLesson?.id === lessonId) {
        const next = allLessons.find(l => l.id !== lessonId && !hiddenLessons.has(l.id));
        if (next) setActiveLesson(next);
      }
    }
  };

  const handleRestoreLesson = async (lessonId) => {
    const { error } = await supabase.from('hidden_lessons').delete().eq('lesson_id', lessonId);
    if (!error) {
      setHiddenLessons(prev => { const s = new Set(prev); s.delete(lessonId); return s; });
    }
  };

  const isEnrolled = user.enrolledCourses.includes(course.id);
  const totalDone = allLessons.filter(l => user.completedLessons.includes(l.id)).length;
  const pct = allLessons.length ? Math.round((totalDone / allLessons.length) * 100) : 0;

  const handleEnroll = () => enrollInCourse(course.id);

  const handleCompleteLesson = () => {
    completeLesson(activeLesson.id, activeLesson.xp);
    // Check if module is complete (use expandedModules)
    const parentModule = expandedModules.find(m => m.lessons.some(l => l.id === activeLesson.id));
    if (parentModule) {
      const allModuleLessons = parentModule.lessons.map(l => l.id);
      const newCompleted = [...user.completedLessons, activeLesson.id];
      const moduleComplete = allModuleLessons.every(id => newCompleted.includes(id));
      if (moduleComplete) completeModule(parentModule.id);
    }
    // Check if course is complete
    const allIds = allLessons.map(l => l.id);
    const newCompleted = [...user.completedLessons, activeLesson.id];
    if (allIds.every(id => newCompleted.includes(id))) completeCourse(course.id);
    // Auto-advance
    const idx = allLessons.findIndex(l => l.id === activeLesson.id);
    if (idx < allLessons.length - 1) {
      setTimeout(() => setActiveLesson(allLessons[idx + 1]), 600);
    }
  };

  const isQuizLesson = activeLesson?.type === 'quiz';
  const isGuide = activeLesson?.type === 'guide';

  // For guide lessons, find the parent video lesson to get chapter context
  const parentLesson = isGuide
    ? course.modules.flatMap(m => m.lessons).find(l => l.id === activeLesson._parentId)
    : null;
  const chapterTitle = expandedModules.find(m => m.lessons.some(l => l.id === activeLesson?.id))?.title || '';

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
          {expandedModules.map(module => (
            <ModuleSection
              key={module.id}
              module={module}
              completedLessons={user.completedLessons}
              activeLesson={activeLesson}
              hiddenLessons={hiddenLessons}
              isAdmin={isAdmin}
              onSelectLesson={(lesson) => {
                if (lesson.type === 'quiz') {
                  navigate(`/quiz/${courseId}/${lesson.id}`);
                } else {
                  setActiveLesson(lesson);
                }
              }}
              onDeleteLesson={handleDeleteLesson}
              onRestoreLesson={handleRestoreLesson}
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
                {isQuizLesson ? (
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
                ) : isGuide ? (
                  /* Study Guide lesson */
                  <div>
                    {/* Header */}
                    <div style={{ marginBottom: 24 }}>
                      <h2 style={{
                        fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 6px',
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}>
                        {activeLesson._displayTitle || activeLesson.title}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 13, color: '#64748b' }}>{chapterTitle}</span>
                        <span style={{ fontSize: 12, color: '#475569' }}>· {activeLesson.duration}</span>
                        <span style={{ fontSize: 12, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
                          <Zap size={11} /> +{activeLesson.xp} XP
                        </span>
                      </div>
                    </div>

                    <StudyGuide
                      lesson={parentLesson || activeLesson}
                      courseId={courseId}
                      chapterTitle={chapterTitle}
                      courseTitle={course.title}
                      isAdmin={isAdmin}
                    />

                    {/* Complete button */}
                    <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
                      {user.completedLessons.includes(activeLesson.id) ? (
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
                          onClick={handleCompleteLesson}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '11px 24px', borderRadius: 12,
                            background: 'linear-gradient(135deg, rgba(129,140,248,0.3), rgba(168,85,247,0.2))',
                            border: '1px solid rgba(129,140,248,0.4)',
                            color: '#a78bfa', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                          }}
                        >
                          <CheckCircle size={16} />
                          Mark as Complete (+{activeLesson.xp} XP)
                        </motion.button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Video lesson */
                  <VideoPlayer
                    lesson={activeLesson}
                    onComplete={handleCompleteLesson}
                    isCompleted={user.completedLessons.includes(activeLesson?.id)}
                    videoUrl={videoUrls[activeLesson?.id]}
                    isAdmin={isAdmin}
                    onGoToAdmin={() => navigate('/admin')}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next navigation */}
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
                        maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        <ChevronLeft size={16} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prev._displayTitle || prev.title}</span>
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
                        maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{next._displayTitle || next.title}</span>
                        <ChevronRight size={16} style={{ flexShrink: 0 }} />
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
