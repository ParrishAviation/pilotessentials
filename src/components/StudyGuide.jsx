import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Lightbulb, AlertTriangle, Brain, FileText, Target,
  ChevronDown, ChevronUp, RefreshCw, Loader2, Zap, ExternalLink,
  CheckSquare, Calculator, Star, BookMarked, Eye, EyeOff
} from 'lucide-react';
import { getLessonTopics } from '../data/lessonTopics';
import { FAA_SUPPLEMENT_PDF, FIGURE_PAGES } from '../data/courses';

// ─── Section card wrapper ─────────────────────────────────────────────────────
function Section({ icon, title, accentColor = '#38bdf8', children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      style={{
        borderRadius: 16,
        border: `1px solid rgba(255,255,255,0.07)`,
        background: 'rgba(255,255,255,0.025)',
        overflow: 'hidden',
        marginBottom: 16,
      }}
    >
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: `linear-gradient(90deg, ${accentColor}10 0%, transparent 100%)`,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: `${accentColor}18`,
          border: `1px solid ${accentColor}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <h3 style={{
          fontSize: 13, fontWeight: 800, color: '#e2e8f0',
          textTransform: 'uppercase', letterSpacing: 0.8, margin: 0,
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          {title}
        </h3>
      </div>
      <div style={{ padding: '16px 20px' }}>{children}</div>
    </motion.div>
  );
}

// ─── Key fact card ────────────────────────────────────────────────────────────
function FactCard({ fact, detail, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        display: 'flex', gap: 12,
        padding: '12px 14px', borderRadius: 12,
        background: 'rgba(56,189,248,0.05)',
        border: '1px solid rgba(56,189,248,0.12)',
        marginBottom: 8,
      }}
    >
      <div style={{
        width: 24, height: 24, borderRadius: 6, flexShrink: 0, marginTop: 1,
        background: 'rgba(56,189,248,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800, color: '#38bdf8',
      }}>
        {index + 1}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{fact}</div>
        <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.55 }}>{detail}</div>
      </div>
    </motion.div>
  );
}

// ─── Formula block ────────────────────────────────────────────────────────────
function FormulaBlock({ name, formula, example }) {
  return (
    <div style={{
      borderRadius: 12, overflow: 'hidden', marginBottom: 10,
      border: '1px solid rgba(129,140,248,0.2)',
    }}>
      <div style={{
        padding: '8px 14px',
        background: 'rgba(129,140,248,0.1)',
        fontSize: 11, fontWeight: 700, color: '#818cf8',
        textTransform: 'uppercase', letterSpacing: 0.6,
      }}>
        {name}
      </div>
      <div style={{ padding: '12px 14px', background: 'rgba(15,23,42,0.5)' }}>
        <div style={{
          fontFamily: 'monospace', fontSize: 16, fontWeight: 700,
          color: '#c4b5fd', marginBottom: example ? 8 : 0,
          letterSpacing: 0.3,
        }}>
          {formula}
        </div>
        {example && (
          <div style={{
            fontSize: 12, color: '#64748b',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: 8, fontFamily: 'monospace',
          }}>
            <span style={{ color: '#475569' }}>Example: </span>
            <span style={{ color: '#94a3b8' }}>{example}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FAA test tip ─────────────────────────────────────────────────────────────
function TestTip({ tip, index }) {
  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      padding: '10px 14px', borderRadius: 10,
      background: 'rgba(245,158,11,0.06)',
      border: '1px solid rgba(245,158,11,0.15)',
      marginBottom: 8,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 800, color: '#f59e0b',
        background: 'rgba(245,158,11,0.15)',
        borderRadius: 5, padding: '2px 7px', flexShrink: 0, marginTop: 1,
      }}>
        TIP {index + 1}
      </div>
      <span style={{ fontSize: 13, color: '#d1a820', lineHeight: 1.5 }}>{tip}</span>
    </div>
  );
}

// ─── Figure reference ─────────────────────────────────────────────────────────
function FigureRef({ figureNum, name, howToRead }) {
  const page = FIGURE_PAGES[figureNum];
  const url = page ? `${FAA_SUPPLEMENT_PDF}#page=${page}` : FAA_SUPPLEMENT_PDF;
  return (
    <div style={{
      borderRadius: 12, overflow: 'hidden', marginBottom: 10,
      border: '1px solid rgba(34,197,94,0.2)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px',
        background: 'rgba(34,197,94,0.07)',
      }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#4ade80' }}>Figure {figureNum}: {name}</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 11, fontWeight: 700, color: '#38bdf8',
            textDecoration: 'none', background: 'rgba(56,189,248,0.1)',
            border: '1px solid rgba(56,189,248,0.2)',
            padding: '3px 8px', borderRadius: 5,
          }}
        >
          <ExternalLink size={10} /> View
        </a>
      </div>
      <div style={{ padding: '10px 14px', fontSize: 12, color: '#94a3b8', lineHeight: 1.55 }}>
        {howToRead}
      </div>
    </div>
  );
}

// ─── Mnemonic card ────────────────────────────────────────────────────────────
function MnemonicCard({ mnemonic, meaning, context }) {
  return (
    <div style={{
      borderRadius: 12, padding: '14px', marginBottom: 10,
      background: 'rgba(168,85,247,0.06)',
      border: '1px solid rgba(168,85,247,0.18)',
    }}>
      <div style={{
        fontSize: 20, fontWeight: 900, color: '#c084fc',
        fontFamily: 'monospace', letterSpacing: 2, marginBottom: 6,
      }}>
        {mnemonic}
      </div>
      <div style={{ fontSize: 12, color: '#a78bfa', marginBottom: 4, lineHeight: 1.5 }}>{meaning}</div>
      {context && (
        <div style={{ fontSize: 11, color: '#6b5fa0', fontStyle: 'italic' }}>{context}</div>
      )}
    </div>
  );
}

// ─── Self-test Q&A ────────────────────────────────────────────────────────────
function SelfTestItem({ question, answer, index }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{
      borderRadius: 12, overflow: 'hidden', marginBottom: 10,
      border: `1px solid ${revealed ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.08)'}`,
      transition: 'border-color 0.3s',
    }}>
      <button
        onClick={() => setRevealed(!revealed)}
        style={{
          width: '100%', display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{
          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
          background: revealed ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800,
          color: revealed ? '#4ade80' : '#64748b',
          transition: 'all 0.2s',
        }}>
          Q{index + 1}
        </div>
        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#e2e8f0', lineHeight: 1.5 }}>
          {question}
        </span>
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          {revealed
            ? <EyeOff size={14} color="#64748b" />
            : <Eye size={14} color="#475569" />}
        </div>
      </button>
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 14px 12px 46px',
              borderTop: '1px solid rgba(34,197,94,0.15)',
              paddingTop: 10,
            }}>
              <div style={{ fontSize: 12, color: '#86efac', lineHeight: 1.6 }}>
                <span style={{ color: '#4ade80', fontWeight: 700 }}>Answer: </span>
                {answer}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── References footer ────────────────────────────────────────────────────────
function ReferencesRow({ references }) {
  const items = [
    { key: 'phak', label: 'PHAK', color: '#38bdf8' },
    { key: 'afh', label: 'AFH', color: '#818cf8' },
    { key: 'cfr', label: 'CFR', color: '#f59e0b' },
    { key: 'aim', label: 'AIM', color: '#4ade80' },
  ].filter(i => references?.[i.key]);

  if (!items.length) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '12px 0 4px' }}>
      {items.map(({ key, label, color }) => (
        <div key={key} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 8,
          background: `${color}10`, border: `1px solid ${color}25`,
        }}>
          <BookMarked size={11} color={color} />
          <span style={{ fontSize: 11, fontWeight: 700, color }}>{label}: </span>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>{references[key]}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div style={{ padding: '4px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Loader2 size={18} color="#38bdf8" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
            Generating your study guide with Claude AI…
          </div>
          <div style={{ fontSize: 12, color: '#475569' }}>
            Drawing from PHAK, FAA test bank, and exam figures — this takes 15-20 seconds
          </div>
        </div>
      </div>
      {[180, 120, 220, 160].map((w, i) => (
        <div key={i} style={{
          height: i % 2 === 0 ? 80 : 56, borderRadius: 12,
          background: 'rgba(255,255,255,0.04)', marginBottom: 12,
          animation: `pulse-skeleton 1.8s ease-in-out ${i * 0.15}s infinite`,
        }} />
      ))}
      <style>{`
        @keyframes pulse-skeleton { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function StudyGuide({ lesson, courseId, chapterTitle, courseTitle, isAdmin }) {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cached, setCached] = useState(false);
  const [generatedAt, setGeneratedAt] = useState(null);

  const topicMeta = getLessonTopics(lesson.id);

  const fetchGuide = async (regenerate = false) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        chapterTitle,
        courseTitle,
        courseId,
        phak: topicMeta?.phak || null,
        afh: topicMeta?.afh || null,
        cfr: topicMeta?.cfr || null,
        aim: topicMeta?.aim || null,
        figures: topicMeta?.figures || [],
        topics: topicMeta?.topics || [],
        regenerate,
      };

      const res = await fetch('/api/study-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate study guide');
      }

      setGuide(data.guide);
      setCached(data.cached ?? false);
      setGeneratedAt(data.generatedAt || null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Auto-fetch on lesson change
  useEffect(() => {
    if (lesson?.type === 'quiz') return;
    setGuide(null);
    setError(null);
    fetchGuide(false);
  }, [lesson.id]);

  if (lesson?.type === 'quiz') {
    return (
      <div style={{
        padding: '32px', textAlign: 'center',
        color: '#475569', fontSize: 14,
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16, background: 'rgba(255,255,255,0.02)',
      }}>
        Study guides are available for video lessons only.
      </div>
    );
  }

  if (loading) return <LoadingSkeleton />;

  if (error) {
    const isKeyMissing = error.includes('ANTHROPIC_API_KEY');
    return (
      <div style={{
        padding: '24px', borderRadius: 16,
        background: 'rgba(239,68,68,0.06)',
        border: '1px solid rgba(239,68,68,0.2)',
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <AlertTriangle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fca5a5', marginBottom: 6 }}>
              {isKeyMissing ? 'API Key Not Configured' : 'Could not generate study guide'}
            </div>
            <div style={{ fontSize: 12, color: '#ef4444', lineHeight: 1.6, marginBottom: 12 }}>
              {isKeyMissing
                ? 'Add your ANTHROPIC_API_KEY to Vercel environment variables (Project Settings → Environment Variables), then redeploy.'
                : error}
            </div>
            <button
              onClick={() => fetchGuide(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 16px', borderRadius: 8, cursor: 'pointer',
                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171', fontSize: 12, fontWeight: 700,
              }}
            >
              <RefreshCw size={12} /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!guide) return null;

  // Handle raw text fallback
  if (guide.rawText) {
    return (
      <div style={{
        padding: '20px', borderRadius: 16,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        fontSize: 13, color: '#94a3b8', lineHeight: 1.7,
        whiteSpace: 'pre-wrap',
      }}>
        {guide.rawText}
      </div>
    );
  }

  return (
    <div>
      {/* Guide header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '18px 20px', borderRadius: 16, marginBottom: 16,
          background: 'linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(129,140,248,0.08) 100%)',
          border: '1px solid rgba(56,189,248,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{
                fontSize: 10, fontWeight: 800, color: '#818cf8',
                textTransform: 'uppercase', letterSpacing: 1,
                background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.25)',
                padding: '2px 8px', borderRadius: 5,
              }}>
                AI Study Guide
              </div>
              {cached && (
                <div style={{
                  fontSize: 10, fontWeight: 700, color: '#4ade80',
                  background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
                  padding: '2px 8px', borderRadius: 5,
                }}>
                  Cached
                </div>
              )}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.5 }}>
              {guide.headline}
            </div>
            {topicMeta?.phak && (
              <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
                📘 {topicMeta.phak}
                {topicMeta?.cfr && ` • ${topicMeta.cfr}`}
              </div>
            )}
          </div>
          {isAdmin && (
            <button
              onClick={() => fetchGuide(true)}
              title="Regenerate study guide"
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#64748b', fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}
            >
              <RefreshCw size={11} /> Regenerate
            </button>
          )}
        </div>
      </motion.div>

      {/* Core explanation */}
      {guide.explanation && (
        <Section
          icon={<BookOpen size={14} color="#38bdf8" />}
          title="Core Concepts"
          accentColor="#38bdf8"
          delay={0.05}
        >
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>
            {guide.explanation}
          </p>
          {guide.references && <ReferencesRow references={guide.references} />}
        </Section>
      )}

      {/* Key facts */}
      {guide.keyFacts?.length > 0 && (
        <Section
          icon={<Zap size={14} color="#f59e0b" />}
          title="Key Facts to Know"
          accentColor="#f59e0b"
          delay={0.1}
        >
          {guide.keyFacts.map((f, i) => (
            <FactCard key={i} index={i} fact={f.fact} detail={f.detail} />
          ))}
        </Section>
      )}

      {/* Formulas */}
      {guide.formulas?.length > 0 && (
        <Section
          icon={<Calculator size={14} color="#c084fc" />}
          title="Formulas & Calculations"
          accentColor="#c084fc"
          delay={0.15}
        >
          {guide.formulas.map((f, i) => (
            <FormulaBlock key={i} name={f.name} formula={f.formula} example={f.example} />
          ))}
        </Section>
      )}

      {/* FAA Test Tips */}
      {guide.faaTestTips?.length > 0 && (
        <Section
          icon={<Target size={14} color="#f59e0b" />}
          title="FAA Written Exam Tips"
          accentColor="#f59e0b"
          delay={0.2}
        >
          {guide.faaTestTips.map((tip, i) => (
            <TestTip key={i} tip={tip} index={i} />
          ))}
        </Section>
      )}

      {/* Figures */}
      {guide.figures?.length > 0 && (
        <Section
          icon={<FileText size={14} color="#4ade80" />}
          title="FAA Supplement Figures"
          accentColor="#4ade80"
          delay={0.25}
        >
          {guide.figures.map((fig, i) => (
            <FigureRef
              key={i}
              figureNum={fig.figureNum}
              name={fig.name}
              howToRead={fig.howToRead}
            />
          ))}
        </Section>
      )}

      {/* Memory aids */}
      {guide.memoryAids?.length > 0 && (
        <Section
          icon={<Brain size={14} color="#c084fc" />}
          title="Memory Aids & Mnemonics"
          accentColor="#c084fc"
          delay={0.3}
        >
          {guide.memoryAids.map((m, i) => (
            <MnemonicCard key={i} mnemonic={m.mnemonic} meaning={m.meaning} context={m.context} />
          ))}
        </Section>
      )}

      {/* Self-test */}
      {guide.selfTest?.length > 0 && (
        <Section
          icon={<CheckSquare size={14} color="#38bdf8" />}
          title="Quick Self-Test"
          accentColor="#38bdf8"
          delay={0.35}
        >
          <div style={{ fontSize: 12, color: '#475569', marginBottom: 12 }}>
            Click each question to reveal the answer. Test yourself before looking!
          </div>
          {guide.selfTest.map((q, i) => (
            <SelfTestItem key={i} index={i} question={q.question} answer={q.answer} />
          ))}
        </Section>
      )}
    </div>
  );
}
