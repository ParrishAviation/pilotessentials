import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RotateCcw, Loader2, AlertCircle, BookOpen, Zap } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const TOPIC_STARTERS = [
  { category: 'Aerodynamics', questions: ['What are the four forces of flight?', 'Explain angle of attack and stalls', 'What is ground effect?', 'How does load factor relate to bank angle?'] },
  { category: 'Weather', questions: ['How does density altitude affect performance?', 'What causes carburetor ice?', 'Explain the difference between METAR and TAF', 'What are the types of fog?'] },
  { category: 'Regulations', questions: ['What does FAR 91.119 say about minimum safe altitudes?', 'When is a transponder required?', 'What are the currency requirements for night flight?', 'Explain the difference between PIC and SIC'] },
  { category: 'Navigation', questions: ['How do I read a sectional chart?', 'What is the difference between true, magnetic, and compass heading?', 'How do VORs work?', 'Explain dead reckoning'] },
  { category: 'Airspace', questions: ['What are the VFR weather minimums for Class B?', 'Explain the different airspace classes', 'What is special use airspace?', 'When do I need ATC clearance?'] },
  { category: 'Systems', questions: ['How does a magneto ignition system work?', 'Explain the pitot-static system', 'What instruments use gyroscopes?', 'How do I read the airspeed indicator?'] },
];

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '6px 2px' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8' }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 16,
        gap: 10,
      }}
    >
      {!isUser && (
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, marginTop: 2,
          boxShadow: '0 2px 12px rgba(14,165,233,0.35)',
        }}>
          ✈️
        </div>
      )}
      <div style={{
        maxWidth: '72%',
        padding: '12px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser
          ? 'linear-gradient(135deg, #0ea5e9, #6366f1)'
          : 'rgba(255,255,255,0.05)',
        border: isUser ? 'none' : '1px solid rgba(255,255,255,0.09)',
        color: '#f1f5f9',
        fontSize: 14,
        lineHeight: 1.7,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        boxShadow: isUser ? '0 4px 16px rgba(14,165,233,0.3)' : 'none',
      }}>
        {msg.content}
      </div>
    </motion.div>
  );
}

export default function AIInstructor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput('');
    setError(null);

    const newMessages = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (data.error) {
        if (data.error.includes('ANTHROPIC_API_KEY')) {
          setNotConfigured(true);
        } else {
          setError(data.error);
        }
        setLoading(false);
        return;
      }

      const reply = data.content?.[0]?.text || 'Sorry, I could not generate a response.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        setNotConfigured(true);
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#060f1e' }}>

      {/* Left: topic panel */}
      <div style={{
        width: 260, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.015)', overflow: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '24px 16px 12px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            Topic Starters
          </div>
          {TOPIC_STARTERS.map(({ category, questions }) => {
            const isOpen = activeCategory === category;
            return (
              <div key={category} style={{ marginBottom: 4 }}>
                <button
                  onClick={() => setActiveCategory(isOpen ? null : category)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '8px 10px',
                    borderRadius: 8, cursor: 'pointer',
                    background: isOpen ? 'rgba(14,165,233,0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isOpen ? 'rgba(14,165,233,0.25)' : 'rgba(255,255,255,0.06)'}`,
                    color: isOpen ? '#38bdf8' : '#94a3b8',
                    fontSize: 12, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <BookOpen size={12} />
                  {category}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ paddingLeft: 8, paddingTop: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {questions.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => { sendMessage(q); setActiveCategory(null); }}
                            style={{
                              textAlign: 'left', padding: '7px 10px', borderRadius: 7,
                              cursor: 'pointer', background: 'transparent',
                              border: '1px solid transparent',
                              color: '#64748b', fontSize: 11, lineHeight: 1.4,
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = 'rgba(14,165,233,0.06)';
                              e.currentTarget.style.borderColor = 'rgba(14,165,233,0.2)';
                              e.currentTarget.style.color = '#7dd3fc';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.borderColor = 'transparent';
                              e.currentTarget.style.color = '#64748b';
                            }}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Sources */}
        <div style={{ padding: '16px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Knowledge Sources</div>
          {[
            'PHAK (FAA-H-8083-25B)',
            'Airplane Flying Handbook',
            'AKT Supplement (CT-8080)',
            'FAR/AIM',
            'PPL · IFR · CPL Exam Banks',
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#1e3a5f', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#334155' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{
          padding: '20px 32px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0,
          background: 'rgba(255,255,255,0.01)',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 13,
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, boxShadow: '0 4px 16px rgba(14,165,233,0.4)',
          }}>
            ✈️
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>
              Captain AI
            </div>
            <div style={{ fontSize: 12, color: '#475569' }}>
              FAA Flight Instructor · PHAK · AFH · FAR/AIM · AKT Supplement
            </div>
          </div>
          {hasMessages && (
            <button
              onClick={() => { setMessages([]); setError(null); setNotConfigured(false); }}
              style={{
                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                color: '#64748b', fontSize: 12, fontWeight: 600,
              }}
            >
              <RotateCcw size={12} /> New Chat
            </button>
          )}
        </div>

        {/* Not configured banner */}
        {notConfigured && (
          <div style={{
            margin: '16px 32px 0',
            padding: '14px 16px',
            borderRadius: 12,
            background: 'rgba(251,191,36,0.07)',
            border: '1px solid rgba(251,191,36,0.2)',
            display: 'flex', gap: 12, alignItems: 'flex-start', flexShrink: 0,
          }}>
            <AlertCircle size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fde68a', marginBottom: 4 }}>
                Edge function not deployed yet
              </div>
              <div style={{ fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
                To activate Captain AI: <strong>1)</strong> Deploy <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 3 }}>supabase/functions/chat/index.ts</code> as a Supabase Edge Function.{' '}
                <strong>2)</strong> Go to{' '}
                <a href="https://supabase.com/dashboard/project/djesjwffqgiknfyvbrqn/settings/vault" target="_blank" rel="noopener noreferrer" style={{ color: '#fbbf24', textDecoration: 'underline' }}>
                  Supabase → Edge Functions → Secrets
                </a>{' '}
                and add <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 3 }}>ANTHROPIC_API_KEY</code> with your key from{' '}
                <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fbbf24', textDecoration: 'underline' }}>console.anthropic.com</a>.
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
          {!hasMessages && !notConfigured ? (
            <div style={{ maxWidth: 600, margin: '40px auto 0', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✈️</div>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px', fontFamily: "'Space Grotesk', sans-serif" }}>
                Ask Captain AI anything
              </h2>
              <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, margin: '0 0 32px' }}>
                Your personal FAA exam prep instructor. Trained on the PHAK, Airplane Flying Handbook, FAR/AIM, AKT Supplement, and all written exam topics.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, textAlign: 'left' }}>
                {[
                  { emoji: '🌀', text: 'Explain aerodynamics concepts' },
                  { emoji: '⛅', text: 'Decode weather reports & METARs' },
                  { emoji: '📋', text: 'Look up FAR regulations' },
                  { emoji: '🗺️', text: 'Help with navigation & charts' },
                  { emoji: '⚙️', text: 'Explain aircraft systems' },
                  { emoji: '🧠', text: 'Quiz me on any topic' },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '12px 14px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <span style={{ fontSize: 20 }}>{item.emoji}</span>
                    <span style={{ fontSize: 13, color: '#64748b' }}>{item.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, fontSize: 12, color: '#1e3a5f' }}>
                Select a topic from the left panel or type your question below
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}
              {loading && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, marginTop: 2,
                  }}>✈️</div>
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: '18px 18px 18px 4px',
                  }}>
                    <TypingDots />
                  </div>
                </div>
              )}
              {error && (
                <div style={{
                  display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 10,
                  background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
                  marginBottom: 16, maxWidth: 800,
                }}>
                  <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: '#fca5a5' }}>{error}</span>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '16px 32px 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.01)',
          flexShrink: 0,
        }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div
              style={{
                display: 'flex', gap: 10, alignItems: 'flex-end',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14, padding: '10px 10px 10px 18px',
                transition: 'border-color 0.2s',
              }}
              onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(14,165,233,0.4)'}
              onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about aerodynamics, weather, regulations, navigation..."
                rows={1}
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: '#f1f5f9', fontSize: 14, resize: 'none', lineHeight: 1.6,
                  maxHeight: 120, overflowY: 'auto',
                  fontFamily: 'Inter, sans-serif',
                }}
                onInput={e => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                disabled={loading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                style={{
                  width: 38, height: 38, borderRadius: 10, border: 'none',
                  cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  background: input.trim() && !loading
                    ? 'linear-gradient(135deg, #0ea5e9, #6366f1)'
                    : 'rgba(255,255,255,0.06)',
                  opacity: input.trim() && !loading ? 1 : 0.4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.15s',
                  boxShadow: input.trim() && !loading ? '0 4px 12px rgba(14,165,233,0.4)' : 'none',
                }}
              >
                {loading
                  ? <Loader2 size={16} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
                  : <Send size={16} color="#fff" />
                }
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: '#1e3a5f' }}>
              Captain AI · Powered by Claude · For exam prep only — not a substitute for a real CFI
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
