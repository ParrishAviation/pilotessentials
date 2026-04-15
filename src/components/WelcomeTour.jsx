import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, X, Zap, MessageSquare, BookOpen, Trophy, Target, Star } from 'lucide-react';

const TOUR_KEY = 'skyace_tour_complete';

const STEPS = [
  {
    id: 'welcome',
    emoji: '✈️',
    title: 'Welcome to Pilot Essentials',
    subtitle: 'Your path to FAA exam success starts here.',
    body: "You're about to join thousands of student pilots training smarter. This quick tour will show you everything you need to get started — it takes less than 2 minutes.",
    cta: 'Start Tour',
    bg: 'linear-gradient(135deg, rgba(14,165,233,0.18) 0%, rgba(139,92,246,0.12) 100%)',
    border: 'rgba(14,165,233,0.3)',
    accent: '#38bdf8',
  },
  {
    id: 'dashboard',
    emoji: '🏠',
    title: 'Your Dashboard',
    subtitle: 'Mission control for your training.',
    body: "Your dashboard shows your XP, streak, daily goals, and enrolled courses at a glance. The 7-day streak challenge keeps you consistent — students who study daily score 12 points higher on the FAA exam.",
    highlights: [
      { icon: '🔥', text: 'Daily streak tracking' },
      { icon: '⚡', text: 'XP & level system' },
      { icon: '🎯', text: 'Daily challenges' },
    ],
    bg: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(14,165,233,0.1) 100%)',
    border: 'rgba(139,92,246,0.3)',
    accent: '#818cf8',
  },
  {
    id: 'lessons',
    emoji: '📚',
    title: 'Lessons & Study Guides',
    subtitle: 'Video lessons + AI-powered deep dives.',
    body: "Each lesson includes a video, and an AI Study Guide that pulls FAA Handbook content, regulations, and exam tips — all tailored to exactly what you're learning.",
    highlights: [
      { icon: '🎬', text: 'HD video lessons' },
      { icon: '📖', text: 'AI Study Guide per lesson' },
      { icon: '📋', text: 'FAA reference material' },
    ],
    bg: 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(14,165,233,0.08) 100%)',
    border: 'rgba(34,197,94,0.25)',
    accent: '#4ade80',
  },
  {
    id: 'ai',
    emoji: '🤖',
    title: 'AI Instructor — Captain AI',
    subtitle: 'Your personal FAA-trained tutor, available 24/7.',
    body: "Captain AI is trained on FAA handbooks, AIM, regulations, and real exam questions. Ask it anything — from how to read a METAR to understanding airspace classes. It explains concepts the way a real CFI would.",
    highlights: [
      { icon: '💬', text: 'Ask any aviation question' },
      { icon: '📡', text: 'Trained on FAA handbooks' },
      { icon: '⏰', text: 'Available 24/7, instant answers' },
    ],
    featured: true,
    featuredLabel: '⭐ Most popular feature',
    bg: 'linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(251,191,36,0.08) 100%)',
    border: 'rgba(245,158,11,0.4)',
    accent: '#f59e0b',
    navTo: '/ai-instructor',
    navLabel: 'Try Captain AI →',
  },
  {
    id: 'chatroom',
    emoji: '🛩️',
    title: 'Student Chatrooms',
    subtitle: 'Learn alongside real student pilots.',
    body: "Connect with other students studying for the same exams. Share tips, ask questions, celebrate wins, and build accountability. CFIs also drop in to answer questions.",
    highlights: [
      { icon: '👥', text: 'Course-specific chat rooms' },
      { icon: '✈️', text: 'CFIs participate too' },
      { icon: '🤝', text: 'Study accountability' },
    ],
    featured: true,
    featuredLabel: '🔥 Students who use chat pass faster',
    bg: 'linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(129,140,248,0.1) 100%)',
    border: 'rgba(56,189,248,0.3)',
    accent: '#38bdf8',
    navTo: '/chatroom',
    navLabel: 'Visit Chatroom →',
  },
  {
    id: 'quizzes',
    emoji: '📝',
    title: 'Quizzes & XP Rewards',
    subtitle: 'FAA-style practice questions with instant feedback.',
    body: "Every lesson has a quiz built from real FAA exam question banks. Score 80%+ to earn bonus XP, hit 100% for the trophy. Your quiz history tracks improvement over time.",
    highlights: [
      { icon: '🎯', text: 'Real FAA-style questions' },
      { icon: '⚡', text: 'Earn XP for high scores' },
      { icon: '📊', text: 'Track your improvement' },
    ],
    bg: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(245,158,11,0.08) 100%)',
    border: 'rgba(239,68,68,0.25)',
    accent: '#f87171',
  },
  {
    id: 'ready',
    emoji: '🏆',
    title: "You're ready to fly!",
    subtitle: 'Your FAA exam prep starts now.',
    body: "You've got video lessons, AI-powered study guides, a community of student pilots, and a full quiz bank. Everything you need to pass the FAA written exam.",
    reward: { xp: 50, label: '+50 XP awarded for completing the tour!' },
    cta: 'Start Learning',
    bg: 'linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(34,197,94,0.1) 100%)',
    border: 'rgba(245,158,11,0.4)',
    accent: '#f59e0b',
  },
];

export function useTourComplete() {
  return localStorage.getItem(TOUR_KEY) === 'true';
}

export default function WelcomeTour({ onComplete }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  const advance = () => {
    if (isLast) {
      finish();
    } else {
      setStep(s => s + 1);
    }
  };

  const finish = () => {
    localStorage.setItem(TOUR_KEY, 'true');
    onComplete?.();
  };

  const goTo = (path) => {
    finish();
    navigate(path);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(4,10,22,0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.97 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          style={{
            width: '100%',
            maxWidth: 520,
            background: '#0a1628',
            border: `1px solid ${current.border}`,
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px ${current.border}`,
            position: 'relative',
          }}
        >
          {/* Top gradient bar */}
          <div style={{ height: 4, background: current.bg, backgroundSize: '200%' }} />

          {/* Dismiss */}
          {!isLast && (
            <button
              onClick={finish}
              style={{
                position: 'absolute', top: 16, right: 16,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, width: 30, height: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#64748b', zIndex: 1,
              }}
            >
              <X size={14} />
            </button>
          )}

          {/* Content */}
          <div style={{ padding: '32px 32px 28px' }}>
            {/* Featured badge */}
            {current.featured && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: `rgba(${current.accent === '#f59e0b' ? '245,158,11' : '56,189,248'},0.12)`,
                  border: `1px solid ${current.border}`,
                  borderRadius: 20, padding: '4px 12px',
                  fontSize: 11, fontWeight: 700, color: current.accent,
                  marginBottom: 16,
                }}
              >
                {current.featuredLabel}
              </motion.div>
            )}

            {/* Emoji */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              style={{ fontSize: 56, marginBottom: 16, lineHeight: 1 }}
            >
              {current.emoji}
            </motion.div>

            {/* Title */}
            <h2 style={{
              fontSize: 24, fontWeight: 800, color: '#f1f5f9',
              margin: '0 0 6px', lineHeight: 1.2,
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              {current.title}
            </h2>
            <div style={{
              fontSize: 13, fontWeight: 600, color: current.accent,
              marginBottom: 14,
            }}>
              {current.subtitle}
            </div>
            <p style={{
              fontSize: 14, color: '#94a3b8', lineHeight: 1.7,
              margin: '0 0 20px',
            }}>
              {current.body}
            </p>

            {/* Highlights */}
            {current.highlights && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {current.highlights.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 14px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{h.icon}</span>
                    <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 500 }}>{h.text}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* XP reward on last step */}
            {current.reward && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 16px', borderRadius: 12, marginBottom: 24,
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.3)',
                }}
              >
                <Zap size={18} color="#f59e0b" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fbbf24' }}>
                  {current.reward.label}
                </span>
              </motion.div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
              {/* Primary CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={advance}
                style={{
                  width: '100%', padding: '14px',
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${current.accent}, ${current.accent}cc)`,
                  border: 'none', color: step === 0 || isLast ? '#000' : '#fff',
                  fontSize: 15, fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {current.cta || (isLast ? 'Start Learning ✈️' : 'Next')}
                {!current.cta && !isLast && <ChevronRight size={16} />}
              </motion.button>

              {/* Secondary nav-to button for AI / Chat steps */}
              {current.navTo && (
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => goTo(current.navTo)}
                  style={{
                    width: '100%', padding: '12px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${current.border}`,
                    color: current.accent,
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  {current.navLabel}
                </motion.button>
              )}
            </div>
          </div>

          {/* Bottom nav */}
          <div style={{
            padding: '16px 32px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            {/* Back */}
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={isFirst}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'none', border: 'none', cursor: isFirst ? 'default' : 'pointer',
                color: isFirst ? '#1e293b' : '#64748b', fontSize: 13, fontWeight: 600,
              }}
            >
              <ChevronLeft size={14} /> Back
            </button>

            {/* Progress dots */}
            <div style={{ display: 'flex', gap: 6 }}>
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  style={{
                    width: i === step ? 20 : 7, height: 7, borderRadius: 4,
                    background: i === step ? current.accent : i < step ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>

            {/* Step count */}
            <div style={{ fontSize: 12, color: '#334155', fontWeight: 600 }}>
              {step + 1} / {STEPS.length}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
