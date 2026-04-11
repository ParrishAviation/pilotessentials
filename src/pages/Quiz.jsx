import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Trophy, Zap, RotateCcw, Home, ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { QUIZ_BANK, COURSES, FIGURE_PAGES, FAA_SUPPLEMENT_PDF } from '../data/courses';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabase';

// Merge Supabase overrides on top of static quiz bank questions
function applyOverrides(questions, overridesMap) {
  if (!overridesMap || Object.keys(overridesMap).length === 0) return questions;
  return questions.map(q => {
    const ov = overridesMap[q.id];
    if (!ov) return q;
    return { ...q, question: ov.question, options: ov.options, correct: ov.correct, explanation: ov.explanation };
  });
}

// Parse figure numbers from question text e.g. "Refer to figure 8" → [8]
function parseFigures(text) {
  const matches = [...text.matchAll(/figure\s+(\d+)/gi)];
  const nums = [...new Set(matches.map(m => parseInt(m[1], 10)))];
  return nums;
}

function FigureBanner({ questionText }) {
  const figNums = parseFigures(questionText);
  if (figNums.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10,
        padding: '12px 18px', borderRadius: 12, marginBottom: 16,
        background: 'rgba(56,189,248,0.08)',
        border: '1px solid rgba(56,189,248,0.25)',
      }}
    >
      <BookOpen size={15} color="#38bdf8" style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: '#7dd3fc', fontWeight: 600 }}>
        This question references the FAA Supplement:
      </span>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {figNums.map(num => {
          const page = FIGURE_PAGES[num];
          const url = page
            ? `${FAA_SUPPLEMENT_PDF}#page=${page}`
            : FAA_SUPPLEMENT_PDF;
          return (
            <a
              key={num}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 12px', borderRadius: 8,
                background: 'rgba(56,189,248,0.15)',
                border: '1px solid rgba(56,189,248,0.35)',
                color: '#38bdf8', fontSize: 12, fontWeight: 700,
                textDecoration: 'none', cursor: 'pointer',
              }}
            >
              <ExternalLink size={11} />
              View Figure {num}
            </a>
          );
        })}
      </div>
    </motion.div>
  );
}

function ProgressDots({ total, current, answers }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 28 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 24 : 10,
            height: 10,
            borderRadius: 5,
            background: answers[i] === undefined
              ? 'rgba(255,255,255,0.1)'
              : answers[i]
                ? 'rgba(34,197,94,0.8)'
                : 'rgba(239,68,68,0.8)',
            border: i === current ? '2px solid #38bdf8' : '1px solid transparent',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}

function ScoreScreen({ score, total, quizTitle, onRetry, onContinue, courseId, lessonId }) {
  const navigate = useNavigate();
  const pct = Math.round((score / total) * 100);
  const isPerfect = pct === 100;
  const isPassed = pct >= 70;

  const getGrade = () => {
    if (pct === 100) return { label: 'Perfect!', icon: '🏆', color: '#f59e0b' };
    if (pct >= 90) return { label: 'Excellent!', icon: '🎯', color: '#22c55e' };
    if (pct >= 80) return { label: 'Great Job!', icon: '⭐', color: '#38bdf8' };
    if (pct >= 70) return { label: 'Passed!', icon: '✅', color: '#818cf8' };
    return { label: 'Try Again', icon: '📚', color: '#f87171' };
  };

  const grade = getGrade();

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}
    >
      {/* Score Circle */}
      <div style={{ marginBottom: 32 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
          style={{
            width: 140, height: 140, borderRadius: '50%',
            background: `radial-gradient(circle, ${grade.color}22 0%, transparent 70%)`,
            border: `4px solid ${grade.color}`,
            display: 'inline-flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 40px ${grade.color}40`,
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 36 }}>{grade.icon}</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: grade.color, fontFamily: "'Space Grotesk', sans-serif" }}>
            {pct}%
          </div>
        </motion.div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', margin: '0 0 8px', fontFamily: "'Space Grotesk', sans-serif" }}>
          {grade.label}
        </h2>
        <p style={{ fontSize: 15, color: '#94a3b8', margin: 0 }}>
          You answered {score} out of {total} questions correctly
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Correct', value: score, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
          { label: 'Incorrect', value: total - score, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
          { label: 'Score', value: `${pct}%`, color: grade.color, bg: `${grade.color}15`, border: `${grade.color}40` },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, padding: '16px 12px', borderRadius: 14,
            background: s.bg, border: `1px solid ${s.border}`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {isPerfect && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 20px', borderRadius: 14, marginBottom: 24,
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid rgba(245,158,11,0.35)',
          }}
        >
          <span style={{ fontSize: 24 }}>🏅</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fbbf24' }}>Badge Unlocked: Quiz Ace!</div>
            <div style={{ fontSize: 12, color: '#92400e' }}>Perfect score — you're a true aviator</div>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={onRetry}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '13px 20px', borderRadius: 12,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#94a3b8', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <RotateCcw size={15} /> Retry Quiz
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={isPassed ? 'btn-primary' : 'btn-gold'}
          onClick={onContinue}
          style={{
            flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '13px 20px', borderRadius: 12,
            fontSize: 14, fontWeight: 700, color: '#fff',
          }}
        >
          {isPassed ? (
            <><ArrowRight size={15} /> Continue Learning</>
          ) : (
            <><Home size={15} /> Back to Course</>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

function buildFinalTest(courseId, count = 60) {
  // Pool all questions from every quiz in this course's QUIZ_BANK entries
  const course = COURSES.find(c => c.id === courseId);
  if (!course) return null;
  const allLessonIds = course.modules.flatMap(m => m.lessons).map(l => l.id);
  let pool = [];
  for (const id of allLessonIds) {
    if (QUIZ_BANK[id]) pool = pool.concat(QUIZ_BANK[id].questions);
  }
  // Shuffle using Fisher-Yates, then take `count`
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return {
    title: 'Private Pilot End of Course Test',
    questions: pool.slice(0, Math.min(count, pool.length)),
  };
}

export default function Quiz() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, completeLesson, saveQuizScore } = useUser();

  const isFinalTest = lessonId === 'ppl-final-test';
  const [finalTestData] = useState(() => isFinalTest ? buildFinalTest(courseId, 60) : null);
  const [overridesMap, setOverridesMap] = useState({});

  // Load any admin overrides for this quiz key
  useEffect(() => {
    if (isFinalTest) return;
    supabase
      .from('quiz_overrides')
      .select('question_id, question, options, correct, explanation')
      .eq('quiz_key', lessonId)
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const map = {};
        data.forEach(row => { map[row.question_id] = row; });
        setOverridesMap(map);
      });
  }, [lessonId, isFinalTest]);

  const staticQuizData = isFinalTest ? finalTestData : QUIZ_BANK[lessonId];
  const quizData = staticQuizData
    ? { ...staticQuizData, questions: applyOverrides(staticQuizData.questions, overridesMap) }
    : staticQuizData;
  const course = COURSES.find(c => c.id === courseId);
  const lesson = course?.modules.flatMap(m => m.lessons).find(l => l.id === lessonId);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  const handleReset = () => {
    setCurrentQ(0);
    setSelected(null);
    setRevealed(false);
    setAnswers({});
    setDone(false);
    setScore(0);
  };

  if (!quizData || !lesson) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
        <div style={{ fontSize: 18, marginBottom: 8 }}>Quiz not available yet</div>
        <div style={{ fontSize: 14, marginBottom: 24 }}>This quiz content hasn't been added yet.</div>
        <button onClick={() => navigate(`/course/${courseId}`)} style={{ padding: '10px 24px', borderRadius: 10, background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)', color: '#38bdf8', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
          ← Back to Course
        </button>
      </div>
    );
  }

  const questions = quizData.questions;
  const q = questions[currentQ];

  const handleSelect = (idx) => {
    if (revealed) return;
    setSelected(idx);
  };

  const handleReveal = () => {
    if (selected === null) return;
    setRevealed(true);
    const correct = selected === q.correct;
    setAnswers(a => ({ ...a, [currentQ]: correct }));
  };

  const handleNext = () => {
    if (currentQ === questions.length - 1) {
      const finalScore = Object.values({ ...answers }).filter(Boolean).length;
      const isPerfect = finalScore === questions.length;
      setScore(finalScore);
      setDone(true);
      if (!user.completedLessons.includes(lessonId)) {
        completeLesson(lessonId, lesson.xp);
        saveQuizScore(lessonId, finalScore, questions.length, isPerfect);
      } else {
        saveQuizScore(lessonId, finalScore, questions.length, isPerfect);
      }
    } else {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const isCorrect = revealed && selected === q.correct;
  const isWrong = revealed && selected !== q.correct;

  return (
    <div style={{ minHeight: '100vh', background: '#060f1e', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <div style={{
        padding: '16px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(6,15,30,0.8)',
        backdropFilter: 'blur(12px)',
      }}>
        <button
          onClick={() => navigate(`/course/${courseId}`)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <ChevronLeft size={16} /> Back to Course
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{quizData.title}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            {done ? 'Completed' : `Question ${currentQ + 1} of ${questions.length}`}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap size={14} color="#f59e0b" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b' }}>+{lesson.xp} XP</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 680 }}>
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="score" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ScoreScreen
                  score={score}
                  total={questions.length}
                  quizTitle={quizData.title}
                  onRetry={handleReset}
                  onContinue={() => navigate(`/course/${courseId}`)}
                  courseId={courseId}
                  lessonId={lessonId}
                />
              </motion.div>
            ) : (
              <motion.div key={currentQ} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
                {/* Question */}
                <ProgressDots total={questions.length} current={currentQ} answers={answers} />

                <FigureBanner questionText={q.question} />

                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 20,
                  padding: '32px 36px',
                  marginBottom: 20,
                }}>
                  <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                    Question {currentQ + 1}
                  </div>
                  <p style={{ fontSize: 20, fontWeight: 600, color: '#f1f5f9', lineHeight: 1.5, margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                    {q.question}
                  </p>
                </div>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {q.options.map((option, idx) => {
                    let cls = 'quiz-option';
                    if (revealed) {
                      if (idx === q.correct) cls += ' correct';
                      else if (idx === selected) cls += ' incorrect';
                    } else if (idx === selected) {
                      cls += ' selected';
                    }
                    return (
                      <motion.button
                        key={idx}
                        whileHover={!revealed ? { x: 4 } : {}}
                        className={cls}
                        onClick={() => handleSelect(idx)}
                        disabled={revealed}
                        style={{ position: 'relative' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                            background: revealed && idx === q.correct
                              ? 'rgba(34,197,94,0.25)'
                              : revealed && idx === selected
                                ? 'rgba(239,68,68,0.25)'
                                : 'rgba(255,255,255,0.06)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700,
                            color: revealed && idx === q.correct ? '#4ade80' : revealed && idx === selected ? '#f87171' : '#94a3b8',
                          }}>
                            {revealed && idx === q.correct
                              ? <CheckCircle size={14} />
                              : revealed && idx === selected
                                ? <XCircle size={14} />
                                : String.fromCharCode(65 + idx)}
                          </div>
                          <span style={{ flex: 1 }}>{option}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {revealed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{
                        borderRadius: 14, padding: '16px 20px', marginBottom: 20,
                        background: isCorrect ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                        border: `1px solid ${isCorrect ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.25)'}`,
                        display: 'flex', gap: 12, alignItems: 'flex-start',
                      }}
                    >
                      <span style={{ fontSize: 20, flexShrink: 0 }}>{isCorrect ? '✅' : '❌'}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: isCorrect ? '#4ade80' : '#f87171', marginBottom: 4 }}>
                          {isCorrect ? 'Correct!' : 'Not quite right'}
                        </div>
                        <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
                          {q.explanation}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CTA */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {!revealed ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary"
                      onClick={handleReveal}
                      disabled={selected === null}
                      style={{
                        padding: '13px 32px', borderRadius: 12,
                        fontSize: 14, fontWeight: 700, color: '#fff',
                        opacity: selected === null ? 0.4 : 1,
                        cursor: selected === null ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Submit Answer
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary"
                      onClick={handleNext}
                      style={{ padding: '13px 32px', borderRadius: 12, fontSize: 14, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      {currentQ === questions.length - 1 ? (
                        <><Trophy size={16} /> See Results</>
                      ) : (
                        <>Next Question <ChevronRight size={16} /></>
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
