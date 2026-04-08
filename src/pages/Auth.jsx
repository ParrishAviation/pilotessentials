import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Plane, Zap, Shield, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) { setError('Please enter your full name.'); setLoading(false); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        setSuccess('Account created! Check your email to confirm, then sign in.');
        setMode('signin');
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        // Navigation handled by App.jsx auth state
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060f1e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background radial glows */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Floating stars */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: Math.random() * 2 + 1, height: Math.random() * 2 + 1,
          borderRadius: '50%', background: 'rgba(255,255,255,0.25)',
          left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
          pointerEvents: 'none',
        }} />
      ))}

      <div style={{ display: 'flex', width: '100%', maxWidth: 960, gap: 0, position: 'relative', zIndex: 1, borderRadius: 24, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>

        {/* Left Brand Panel */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(139,92,246,0.1) 60%, rgba(6,15,30,0.9) 100%)',
          borderLeft: '1px solid rgba(14,165,233,0.2)',
          borderTop: '1px solid rgba(14,165,233,0.2)',
          borderBottom: '1px solid rgba(14,165,233,0.2)',
          padding: '56px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
              <div style={{
                width: 46, height: 46,
                background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                borderRadius: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, boxShadow: '0 4px 20px rgba(14,165,233,0.4)',
              }}>✈️</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px' }}>Pilot Essentials</div>
                <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Pilot Training</div>
              </div>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif", margin: '0 0 16px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
              Your FAA exam<br />
              <span className="gradient-text">starts here.</span>
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, margin: '0 0 40px' }}>
              Video-based courses, practice quizzes, and gamified progress tracking — everything you need to pass your written exams.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: <BookOpen size={16} />, text: '4 full FAA exam prep courses' },
                { icon: <Zap size={16} />, text: 'XP system, badges & leaderboard' },
                { icon: <Shield size={16} />, text: 'Progress synced to your account' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#94a3b8', fontSize: 14 }}>
                  <div style={{ color: '#38bdf8', flexShrink: 0 }}>{item.icon}</div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom quote */}
          <div style={{
            padding: '18px 20px', borderRadius: 14,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            marginTop: 40,
          }}>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
              "The desire to fly is an idea handed down to us by our ancestors who looked enviously on the birds soaring freely through space."
            </p>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 8, fontWeight: 600 }}>— Wilbur Wright</div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div style={{
          width: 420,
          flexShrink: 0,
          background: 'rgba(8,18,35,0.98)',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          {/* Tab switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 12, padding: 4,
            marginBottom: 32,
          }}>
            {['signin', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 9,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  border: 'none',
                  background: mode === m ? 'rgba(14,165,233,0.2)' : 'transparent',
                  color: mode === m ? '#38bdf8' : '#64748b',
                  transition: 'all 0.2s',
                  boxShadow: mode === m ? '0 2px 8px rgba(14,165,233,0.2)' : 'none',
                }}
              >
                {m === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 6px', fontFamily: "'Space Grotesk', sans-serif" }}>
                {mode === 'signin' ? 'Welcome back!' : 'Join Pilot Essentials'}
              </h3>
              <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px' }}>
                {mode === 'signin' ? 'Sign in to continue your training.' : 'Create your free pilot training account.'}
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {mode === 'signup' && (
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                      <input
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="Your full name"
                        required
                        style={{
                          width: '100%', padding: '12px 12px 12px 40px',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 10, color: '#f1f5f9', fontSize: 14,
                          outline: 'none', boxSizing: 'border-box',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = 'rgba(56,189,248,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      style={{
                        width: '100%', padding: '12px 12px 12px 40px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 10, color: '#f1f5f9', fontSize: 14,
                        outline: 'none', boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(56,189,248,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Your password'}
                      required
                      style={{
                        width: '100%', padding: '12px 40px 12px 40px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 10, color: '#f1f5f9', fontSize: 14,
                        outline: 'none', boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(56,189,248,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                    <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Error / Success */}
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 13 }}>
                      {error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', fontSize: 13 }}>
                      {success}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    width: '100%', padding: '13px', borderRadius: 12,
                    fontSize: 15, fontWeight: 700, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginTop: 4,
                  }}
                >
                  {loading ? (
                    <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                    {mode === 'signin' ? 'Signing in...' : 'Creating account...'}</>
                  ) : (
                    <>{mode === 'signin' ? '✈️ Sign In' : '🚀 Create Account'}</>
                  )}
                </motion.button>
              </form>

              <p style={{ fontSize: 12, color: '#334155', textAlign: 'center', marginTop: 20, lineHeight: 1.6 }}>
                By continuing you agree to our Terms of Service and Privacy Policy.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #334155; }
      `}</style>
    </div>
  );
}
