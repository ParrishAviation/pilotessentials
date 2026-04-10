import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { X, Send, RotateCcw, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import { COURSES } from '../data/courses';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const SUGGESTED = [
  "What are the four forces of flight?",
  "Explain density altitude and why it matters",
  "What are the VFR weather minimums for Class B airspace?",
  "What does ATOMATOFLAMES stand for?",
  "Explain the difference between true, magnetic, and indicated altitude",
  "When is a transponder required?",
  "What are the currency requirements to carry passengers at night?",
  "Explain how a carburetor ice forms",
];

function useCurrentContext(location) {
  const match = location.pathname.match(/^\/course\/([^/]+)/);
  if (!match) return null;
  const courseId = match[1];
  const course = COURSES.find(c => c.id === courseId);
  return course ? course.title : null;
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          style={{ width: 7, height: 7, borderRadius: '50%', background: '#38bdf8' }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 12,
      }}
    >
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, marginRight: 8, marginTop: 2,
          boxShadow: '0 2px 8px rgba(14,165,233,0.35)',
        }}>
          ✈️
        </div>
      )}
      <div style={{
        maxWidth: '80%',
        padding: '10px 14px',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background: isUser
          ? 'linear-gradient(135deg, #0ea5e9, #6366f1)'
          : 'rgba(255,255,255,0.06)',
        border: isUser ? 'none' : '1px solid rgba(255,255,255,0.1)',
        color: '#f1f5f9',
        fontSize: 13,
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        boxShadow: isUser ? '0 4px 12px rgba(14,165,233,0.25)' : 'none',
      }}>
        {msg.content}
      </div>
    </motion.div>
  );
}

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const context = useCurrentContext(location);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open]);

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
          context,
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

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            style={{
              position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
              height: 52, borderRadius: 16,
              padding: '0 20px 0 16px',
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 10,
              boxShadow: '0 4px 24px rgba(14,165,233,0.5), 0 0 0 1px rgba(14,165,233,0.3)',
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>✈️</span>
            <span style={{
              fontSize: 14, fontWeight: 700, color: '#fff',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '-0.2px', whiteSpace: 'nowrap',
            }}>AI Instructor</span>
            <motion.div
              style={{
                position: 'absolute', inset: -2, borderRadius: 18,
                border: '2px solid rgba(14,165,233,0.4)',
              }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
              width: 400, height: 600,
              background: 'rgba(6,15,30,0.97)',
              border: '1px solid rgba(14,165,233,0.25)',
              borderRadius: 20,
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(14,165,233,0.1)',
              overflow: 'hidden',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.02)',
              display: 'flex', alignItems: 'center', gap: 10,
              flexShrink: 0,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, boxShadow: '0 2px 10px rgba(14,165,233,0.4)',
              }}>
                ✈️
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>
                  Captain AI
                </div>
                <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 500 }}>
                  {context ? `📚 ${context}` : 'FAA Flight Instructor'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {messages.length > 0 && (
                  <button
                    onClick={() => { setMessages([]); setError(null); setNotConfigured(false); }}
                    title="Clear chat"
                    style={{
                      width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Not configured warning */}
            {notConfigured && (
              <div style={{
                margin: '12px 14px 0',
                padding: '12px 14px',
                borderRadius: 10,
                background: 'rgba(251,191,36,0.08)',
                border: '1px solid rgba(251,191,36,0.25)',
                display: 'flex', gap: 10, alignItems: 'flex-start',
                flexShrink: 0,
              }}>
                <AlertCircle size={15} color="#fbbf24" style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 12, color: '#fde68a', lineHeight: 1.5 }}>
                  <strong>Setup required:</strong> Deploy the edge function and add your{' '}
                  <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 4px', borderRadius: 3 }}>ANTHROPIC_API_KEY</code>{' '}
                  to Supabase secrets. See setup instructions below.
                </div>
              </div>
            )}

            {/* Messages */}
            <div style={{ flex: 1, overflow: 'auto', padding: '16px 14px 8px' }}>
              {messages.length === 0 && !notConfigured ? (
                <div>
                  {/* Welcome */}
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>✈️</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
                      Hey, I'm Captain AI
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                      Your FAA exam prep instructor. Ask me anything about aerodynamics, weather, regulations, airspace, navigation — or any FAA test topic.
                    </div>
                  </div>
                  {/* Suggested questions */}
                  <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>
                    Try asking
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {SUGGESTED.slice(0, 5).map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        style={{
                          textAlign: 'left', padding: '9px 12px', borderRadius: 10, cursor: 'pointer',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#94a3b8', fontSize: 12, lineHeight: 1.4,
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(14,165,233,0.08)';
                          e.currentTarget.style.borderColor = 'rgba(14,165,233,0.25)';
                          e.currentTarget.style.color = '#38bdf8';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                          e.currentTarget.style.color = '#94a3b8';
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  {messages.map((msg, i) => (
                    <MessageBubble key={i} msg={msg} />
                  ))}
                  {loading && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, marginRight: 8, marginTop: 2,
                      }}>
                        ✈️
                      </div>
                      <div style={{
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px 16px 16px 4px',
                      }}>
                        <TypingDots />
                      </div>
                    </div>
                  )}
                  {error && (
                    <div style={{
                      display: 'flex', gap: 8, padding: '10px 12px', borderRadius: 10,
                      background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                      marginBottom: 10,
                    }}>
                      <AlertCircle size={14} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 12, color: '#fca5a5' }}>{error}</span>
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '12px 14px',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.02)',
              flexShrink: 0,
            }}>
              <div style={{
                display: 'flex', gap: 8, alignItems: 'flex-end',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12, padding: '8px 8px 8px 14px',
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
                  placeholder="Ask about aerodynamics, weather, regs..."
                  rows={1}
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    color: '#f1f5f9', fontSize: 13, resize: 'none', lineHeight: 1.5,
                    maxHeight: 100, overflowY: 'auto',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onInput={e => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                  }}
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  style={{
                    width: 32, height: 32, borderRadius: 8, border: 'none',
                    cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                    background: input.trim() && !loading
                      ? 'linear-gradient(135deg, #0ea5e9, #6366f1)'
                      : 'rgba(255,255,255,0.06)',
                    opacity: input.trim() && !loading ? 1 : 0.4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.15s',
                    boxShadow: input.trim() && !loading ? '0 2px 8px rgba(14,165,233,0.4)' : 'none',
                  }}
                >
                  {loading
                    ? <Loader2 size={14} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
                    : <Send size={14} color="#fff" />
                  }
                </button>
              </div>
              <div style={{ textAlign: 'center', marginTop: 6, fontSize: 10, color: '#1e3a5f' }}>
                Captain AI · Powered by Claude · Not a substitute for a real CFI
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
