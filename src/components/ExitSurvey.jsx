import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Star, CheckCircle, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const QUESTIONS = [
  {
    id: 'preparedness',
    type: 'stars',
    label: 'How prepared do you feel for your FAA written exam?',
    sublabel: '1 = Not ready at all · 5 = Very confident',
  },
  {
    id: 'course_rating',
    type: 'stars',
    label: 'Overall, how would you rate this course?',
    sublabel: '1 = Poor · 5 = Excellent',
  },
  {
    id: 'most_valuable',
    type: 'choice',
    label: 'What was the most valuable part of the course?',
    options: [
      { value: 'video_lessons', label: '🎬 Video lessons' },
      { value: 'ai_study_guides', label: '🤖 AI study guides' },
      { value: 'quizzes', label: '📝 Practice quizzes' },
      { value: 'final_exam', label: '🏆 End-of-course exam' },
      { value: 'chatroom', label: '💬 CFI chatroom' },
    ],
  },
  {
    id: 'heard_from',
    type: 'choice',
    label: 'How did you hear about Pilot Essentials?',
    options: [
      { value: 'google', label: '🔍 Google search' },
      { value: 'youtube', label: '▶️ YouTube' },
      { value: 'social_media', label: '📱 Social media' },
      { value: 'friend', label: '🤝 Friend / word of mouth' },
      { value: 'flight_school', label: '✈️ Flight school / instructor' },
      { value: 'other', label: '💡 Other' },
    ],
  },
  {
    id: 'recommend',
    type: 'choice',
    label: 'Would you recommend Pilot Essentials to other student pilots?',
    options: [
      { value: 'yes', label: '🙌 Absolutely — I already have!' },
      { value: 'probably', label: '👍 Probably yes' },
      { value: 'maybe', label: '🤔 Maybe' },
      { value: 'no', label: '👎 Probably not' },
    ],
  },
  {
    id: 'comments',
    type: 'text',
    label: 'Any other feedback or suggestions?',
    sublabel: 'Optional — we read every response.',
    placeholder: 'What would make this course even better? What did you love? What was confusing?',
  },
];

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(null);
  const active = hovered ?? value;
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '8px 0' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <motion.button
          key={n}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(n)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            color: n <= active ? '#f59e0b' : 'rgba(255,255,255,0.15)',
            transition: 'color 0.15s',
          }}
        >
          <Star size={36} fill={n <= active ? '#f59e0b' : 'none'} strokeWidth={1.5} />
        </motion.button>
      ))}
    </div>
  );
}

function ChoiceGrid({ options, value, onChange }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: options.length > 4 ? '1fr 1fr' : '1fr 1fr', gap: 10 }}>
      {options.map(opt => {
        const selected = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '12px 16px', borderRadius: 12, cursor: 'pointer',
              background: selected ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${selected ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.1)'}`,
              color: selected ? '#38bdf8' : '#94a3b8',
              fontSize: 13, fontWeight: selected ? 700 : 500,
              textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.15s',
            }}
          >
            {selected && <CheckCircle size={13} color="#38bdf8" style={{ flexShrink: 0 }} />}
            <span>{opt.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default function ExitSurvey({ isOpen, onClose, onComplete, courseId, score, total }) {
  const { user: authUser } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const pct = Math.round((score / total) * 100);
  const q = QUESTIONS[step];
  const answer = answers[q?.id];
  const canAdvance = q?.type === 'text' ? true : answer !== undefined;

  const handleAnswer = (val) => {
    setAnswers(prev => ({ ...prev, [q.id]: val }));
  };

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(s => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await supabase.from('exit_survey_responses').insert({
        user_id: authUser?.id || null,
        user_email: authUser?.email || null,
        course_id: courseId,
        exam_score: pct,
        preparedness: answers.preparedness || null,
        course_rating: answers.course_rating || null,
        most_valuable: answers.most_valuable || null,
        heard_from: answers.heard_from || null,
        recommend: answers.recommend || null,
        comments: answers.comments || null,
        submitted_at: new Date().toISOString(),
      });
    } catch (e) {
      // Don't block on error
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="survey-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(6,15,30,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          key="survey-panel"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          style={{
            width: '100%', maxWidth: 520,
            background: '#0d1829',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 24,
            padding: '32px',
            position: 'relative',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, width: 30, height: 30,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#64748b',
            }}
          >
            <X size={15} />
          </button>

          {submitted ? (
            /* Thank-you screen */
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '16px 0' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                style={{ fontSize: 64, marginBottom: 16 }}
              >
                🙏
              </motion.div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px', fontFamily: "'Space Grotesk', sans-serif" }}>
                Thank you, Pilot!
              </h2>
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6, margin: '0 0 8px' }}>
                Your feedback helps us build the best pilot training platform out there.
              </p>
              <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px' }}>
                We personally read every response.
              </p>
              <div style={{
                background: 'rgba(56,189,248,0.08)',
                border: '1px solid rgba(56,189,248,0.2)',
                borderRadius: 14, padding: '14px 20px', marginBottom: 24,
                fontSize: 14, color: '#7dd3fc',
              }}>
                {pct >= 70
                  ? `🎉 You passed the final exam with ${pct}%. Clear skies ahead!`
                  : `📚 You scored ${pct}%. Review the missed questions and try again — you've got this!`}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary"
                onClick={onComplete}
                style={{
                  width: '100%', padding: '14px', borderRadius: 14,
                  fontSize: 15, fontWeight: 700, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                Back to Course Dashboard →
              </motion.button>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{
                    padding: '3px 10px', borderRadius: 20,
                    background: pct >= 70 ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                    border: `1px solid ${pct >= 70 ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`,
                    fontSize: 12, fontWeight: 700,
                    color: pct >= 70 ? '#4ade80' : '#fbbf24',
                  }}>
                    {pct >= 70 ? `✓ Passed — ${pct}%` : `${pct}% — Keep studying`}
                  </div>
                  <div style={{ fontSize: 12, color: '#475569', marginLeft: 'auto' }}>
                    {step + 1} / {QUESTIONS.length}
                  </div>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', borderRadius: 2 }}
                  />
                </div>
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.22 }}
                >
                  <h3 style={{
                    fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: '0 0 6px',
                    fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.4,
                  }}>
                    {q.label}
                  </h3>
                  {q.sublabel && (
                    <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 20px' }}>{q.sublabel}</p>
                  )}
                  {!q.sublabel && <div style={{ marginBottom: 20 }} />}

                  {q.type === 'stars' && (
                    <StarRating value={answer} onChange={handleAnswer} />
                  )}
                  {q.type === 'choice' && (
                    <ChoiceGrid options={q.options} value={answer} onChange={handleAnswer} />
                  )}
                  {q.type === 'text' && (
                    <textarea
                      value={answer || ''}
                      onChange={e => handleAnswer(e.target.value)}
                      placeholder={q.placeholder}
                      rows={4}
                      style={{
                        width: '100%', padding: '14px 16px', borderRadius: 14,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#f1f5f9', fontSize: 14, lineHeight: 1.6,
                        resize: 'vertical', outline: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
                {step > 0 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    style={{
                      padding: '12px 18px', borderRadius: 12,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    ← Back
                  </button>
                )}
                <motion.button
                  whileHover={{ scale: canAdvance ? 1.02 : 1 }}
                  whileTap={{ scale: canAdvance ? 0.97 : 1 }}
                  onClick={canAdvance ? handleNext : undefined}
                  disabled={!canAdvance || submitting}
                  style={{
                    flex: 1, padding: '13px 20px', borderRadius: 12,
                    background: canAdvance
                      ? 'linear-gradient(135deg, #0ea5e9, #2563eb)'
                      : 'rgba(255,255,255,0.06)',
                    border: 'none',
                    color: canAdvance ? '#fff' : '#475569',
                    fontSize: 14, fontWeight: 700, cursor: canAdvance ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    opacity: submitting ? 0.7 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  {submitting ? (
                    'Submitting...'
                  ) : step === QUESTIONS.length - 1 ? (
                    <><Send size={15} /> Submit Feedback</>
                  ) : (
                    <>Next <ChevronRight size={15} /></>
                  )}
                </motion.button>
              </div>

              {/* Skip option on last question */}
              {step === QUESTIONS.length - 1 && !submitting && (
                <button
                  onClick={handleSubmit}
                  style={{
                    width: '100%', marginTop: 10, background: 'none', border: 'none',
                    color: '#475569', fontSize: 12, cursor: 'pointer',
                  }}
                >
                  Skip this question
                </button>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
