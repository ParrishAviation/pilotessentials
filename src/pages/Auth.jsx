import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Plane, Zap, Shield, BookOpen, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Auth() {
  const { signIn, signUp, resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Detect if we're in password-reset or post-purchase setup mode
  const [mode, setMode] = useState(() => {
    if (searchParams.get('mode') === 'reset') return 'reset';
    if (searchParams.get('mode') === 'setup') return 'setup';
    return 'signin';
  });

  const setupEmail = searchParams.get('email') || '';
  const setupPlan  = searchParams.get('plan')  || '';

  const [email, setEmail] = useState(setupEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const switchMode = (m) => {
    setMode(m);
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
  };

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

      } else if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;

      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) throw error;
        setSuccess('Password reset email sent! Check your inbox and follow the link.');

      } else if (mode === 'reset') {
        if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
        if (password !== confirmPassword) { setError('Passwords do not match.'); setLoading(false); return; }
        const { error } = await updatePassword(password);
        if (error) throw error;
        setSuccess('Password updated successfully!');
        setTimeout(() => { switchMode('signin'); navigate('/login'); }, 2000);

      } else if (mode === 'setup') {
        if (!fullName.trim()) { setError('Please enter your full name.'); setLoading(false); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
        if (password !== confirmPassword) { setError('Passwords do not match.'); setLoading(false); return; }

        // Use server-side admin API to set password + confirm email in one step
        const setupRes = await fetch('/api/setup-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, fullName }),
        });
        const setupData = await setupRes.json();
        if (!setupRes.ok || setupData.error) {
          throw new Error(setupData.error || 'Failed to set up account.');
        }

        // Now sign in — email is confirmed server-side so this will succeed
        const { error: signInErr } = await signIn(email, password);
        if (signInErr) throw signInErr;
        navigate('/app', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 12px 12px 40px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: '#f1f5f9', fontSize: 14,
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    fontSize: 12, fontWeight: 600, color: '#94a3b8',
    display: 'block', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: 0.5,
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#060f1e',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Stars */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: Math.random() * 2 + 1, height: Math.random() * 2 + 1,
          borderRadius: '50%', background: 'rgba(255,255,255,0.25)',
          left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
          pointerEvents: 'none',
        }} />
      ))}

      <div style={{ display: 'flex', width: '100%', maxWidth: 960, position: 'relative', zIndex: 1, borderRadius: 24, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>

        {/* ── Left Brand Panel ── */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(139,92,246,0.1) 60%, rgba(6,15,30,0.9) 100%)',
          borderLeft: '1px solid rgba(14,165,233,0.2)',
          borderTop: '1px solid rgba(14,165,233,0.2)',
          borderBottom: '1px solid rgba(14,165,233,0.2)',
          padding: '56px 48px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <button onClick={() => navigate('/')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#475569', fontSize: 13, fontWeight: 600,
              marginBottom: 28, padding: 0, transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
              onMouseLeave={e => e.currentTarget.style.color = '#475569'}
            >
              <ArrowLeft size={14} /> Back to Home
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
              <div style={{ width: 46, height: 46, background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 4px 20px rgba(14,165,233,0.4)' }}>✈️</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px' }}>Pilot Essentials</div>
                <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Pilot Training</div>
              </div>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif", margin: '0 0 16px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
              Your FAA exam<br /><span className="gradient-text">starts here.</span>
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
          <div style={{ padding: '18px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginTop: 40 }}>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
              "The desire to fly is an idea handed down to us by our ancestors who looked enviously on the birds soaring freely through space."
            </p>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 8, fontWeight: 600 }}>— Wilbur Wright</div>
          </div>
        </div>

        {/* ── Right Form Panel ── */}
        <div style={{
          width: 420, flexShrink: 0,
          background: 'rgba(8,18,35,0.98)',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '48px 40px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>

          {/* Tab switcher — only for signin/signup */}
          {(mode === 'signin' || mode === 'signup') && !setupEmail && (
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, marginBottom: 32 }}>
              {['signin', 'signup'].map(m => (
                <button key={m} onClick={() => switchMode(m)} style={{
                  flex: 1, padding: '9px 0', borderRadius: 9,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none',
                  background: mode === m ? 'rgba(14,165,233,0.2)' : 'transparent',
                  color: mode === m ? '#38bdf8' : '#64748b',
                  transition: 'all 0.2s',
                  boxShadow: mode === m ? '0 2px 8px rgba(14,165,233,0.2)' : 'none',
                }}>
                  {m === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>
          )}

          {/* Back link for forgot/reset (not setup) */}
          {(mode === 'forgot' || mode === 'reset') && (
            <button onClick={() => switchMode('signin')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#475569', fontSize: 13, fontWeight: 600,
              marginBottom: 28, padding: 0, transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
              onMouseLeave={e => e.currentTarget.style.color = '#475569'}
            >
              <ArrowLeft size={14} /> Back to Sign In
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Heading */}
              {/* Post-purchase success banner */}
              {mode === 'setup' && (
                <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 12, padding: '14px 16px', marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CheckCircle size={16} color="#4ade80" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#4ade80', marginBottom: 2 }}>
                      {setupPlan === 'cfi_mentorship' ? 'CFI Mentorship' : setupPlan === 'basic_access' ? 'Basic Access' : 'Full Access'} unlocked!
                    </div>
                    <div style={{ fontSize: 12, color: '#86efac', lineHeight: 1.5 }}>Create your account below to start learning.</div>
                  </div>
                </div>
              )}

              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 6px', fontFamily: "'Space Grotesk', sans-serif" }}>
                {mode === 'signin' && 'Welcome back!'}
                {mode === 'signup' && 'Join Pilot Essentials'}
                {mode === 'forgot' && 'Reset your password'}
                {mode === 'reset' && 'Set new password'}
                {mode === 'setup' && 'Create your account'}
              </h3>
              <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px' }}>
                {mode === 'signin' && 'Sign in to continue your training.'}
                {mode === 'signup' && 'Create your free pilot training account.'}
                {mode === 'forgot' && "Enter your email and we'll send you a reset link."}
                {mode === 'reset' && 'Choose a strong new password for your account.'}
                {mode === 'setup' && 'Set your name and password to access your courses.'}
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Full name — signup + setup */}
                {(mode === 'signup' || mode === 'setup') && (
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                      <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                        placeholder="Your full name" required style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'rgba(56,189,248,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                  </div>
                )}

                {/* Email — all modes except reset */}
                {mode !== 'reset' && (
                  <div>
                    <label style={labelStyle}>Email</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com" required
                        readOnly={mode === 'setup' && !!setupEmail}
                        style={{
                          ...inputStyle,
                          ...(mode === 'setup' && setupEmail ? { opacity: 0.6, cursor: 'not-allowed', background: 'rgba(255,255,255,0.02)' } : {}),
                        }}
                        onFocus={e => { if (mode !== 'setup') e.target.style.borderColor = 'rgba(56,189,248,0.5)'; }}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                  </div>
                )}

                {/* Password — signin, signup, reset */}
                {mode !== 'forgot' && (
                  <div>
                    <label style={labelStyle}>
                      {mode === 'reset' ? 'New Password' : 'Password'}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={password} onChange={e => setPassword(e.target.value)}
                        placeholder={mode === 'reset' ? 'Min. 6 characters' : mode === 'signup' ? 'Min. 6 characters' : 'Your password'}
                        required
                        style={{ ...inputStyle, paddingRight: 40 }}
                        onFocus={e => e.target.style.borderColor = 'rgba(56,189,248,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                      <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirm password — reset + setup modes */}
                {(mode === 'reset' || mode === 'setup') && (
                  <div>
                    <label style={labelStyle}>Confirm New Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password" required
                        style={{ ...inputStyle, paddingRight: 40 }}
                        onFocus={e => e.target.style.borderColor = 'rgba(56,189,248,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                      <button type="button" onClick={() => setShowConfirmPass(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                        {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Forgot password link — sign in only (not setup) */}
                {mode === 'signin' && (
                  <div style={{ textAlign: 'right', marginTop: -8 }}>
                    <button type="button" onClick={() => switchMode('forgot')} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#38bdf8', fontSize: 12, fontWeight: 600,
                      padding: 0, transition: 'opacity 0.15s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

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
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', fontSize: 13 }}>
                      <CheckCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                      {success}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={loading}
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
                    {mode === 'signin' && 'Signing in...'}
                    {mode === 'signup' && 'Creating account...'}
                    {mode === 'forgot' && 'Sending link...'}
                    {mode === 'reset' && 'Updating password...'}
                    {mode === 'setup' && 'Creating account...'}</>
                  ) : (
                    <>
                      {mode === 'signin' && '✈️ Sign In'}
                      {mode === 'signup' && '🚀 Create Account'}
                      {mode === 'forgot' && '📧 Send Reset Link'}
                      {mode === 'reset' && '🔒 Set New Password'}
                      {mode === 'setup' && '🚀 Create Account & Start Learning'}
                    </>
                  )}
                </motion.button>
              </form>

              <p style={{ fontSize: 12, color: '#334155', textAlign: 'center', marginTop: 20, lineHeight: 1.6 }}>
                {mode === 'reset' && 'Your password will be updated and you will be signed in.'}
                {mode === 'setup' && 'You will be signed in automatically after creating your account.'}
                {(mode === 'signin' || mode === 'signup' || mode === 'forgot') && 'By continuing you agree to our Terms of Service and Privacy Policy.'}
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
