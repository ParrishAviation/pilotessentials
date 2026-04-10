import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const PLAN_LABELS = {
  full_access: 'Full Access',
  cfi_mentorship: 'CFI Mentorship',
};

const Nav = () => (
  <nav style={{ padding: '0 24px', background: 'rgba(6,15,30,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', height: 62 }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 0 18px rgba(14,165,233,0.35)' }}>✈️</div>
        <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: 17, letterSpacing: '-0.3px' }}>Pilot Essentials</span>
      </Link>
    </div>
  </nav>
);

export default function ThankYou() {
  const { hasPaid, tierLoading, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const planKey   = searchParams.get('plan')  || 'full_access';
  const isGuest   = searchParams.get('guest') === '1';
  const planLabel = PLAN_LABELS[planKey] || 'Full Access';

  // Guard: only redirect logged-in users who haven't paid — never block guests
  useEffect(() => {
    if (isGuest) return; // guest flow — always show, no auth required
    if (authLoading || tierLoading) return; // wait for auth to resolve
    if (!hasPaid) navigate('/checkout', { replace: true });
  }, [isGuest, authLoading, tierLoading, hasPaid, navigate]);

  // Guest: render immediately — no auth state needed
  // Logged-in: wait for auth to resolve before showing or redirecting
  if (!isGuest && (authLoading || tierLoading)) return null;
  if (!isGuest && !hasPaid) return null;

  // ── Guest version: account was just created, email is on the way ──────────
  if (isGuest) {
    return (
      <div style={{ minHeight: '100vh', background: '#060f1e', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
        <Nav />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}
          >
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
              style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(52,211,153,0.12)', border: '2px solid rgba(52,211,153,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: 40 }}
            >
              ✅
            </motion.div>

            <h1 style={{ color: '#f1f5f9', fontSize: 36, fontWeight: 900, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px', marginBottom: 14, lineHeight: 1.2 }}>
              You're in the cockpit!
            </h1>

            <p style={{ color: '#94a3b8', fontSize: 17, lineHeight: 1.7, marginBottom: 8 }}>
              Your <strong style={{ color: '#38bdf8' }}>{planLabel}</strong> purchase is confirmed.
            </p>

            {/* Email setup box */}
            <div style={{ background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 16, padding: '24px 28px', margin: '28px 0', textAlign: 'left' }}>
              <p style={{ color: '#38bdf8', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>📧 Check your email to set your password</p>
              <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                We just created your Pilot Essentials account. You'll receive an email shortly with a link to set your password and log in. Once you're in, everything is unlocked and ready to go.
              </p>
            </div>

            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
              Didn't get the email? Check your spam folder or contact us at{' '}
              <a href="mailto:support@pilotessentials.com" style={{ color: '#38bdf8', textDecoration: 'none' }}>support@pilotessentials.com</a>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Logged-in version: user is already authenticated ──────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#060f1e', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}
        >
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
            style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(52,211,153,0.12)', border: '2px solid rgba(52,211,153,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: 40 }}
          >
            ✅
          </motion.div>

          <h1 style={{ color: '#f1f5f9', fontSize: 36, fontWeight: 900, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px', marginBottom: 14, lineHeight: 1.2 }}>
            You're in the cockpit!
          </h1>

          <p style={{ color: '#94a3b8', fontSize: 17, lineHeight: 1.7, marginBottom: 8 }}>
            Thank you for your purchase. Your <strong style={{ color: '#38bdf8' }}>{planLabel}</strong> plan is now active and ready to go.
          </p>

          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6, marginBottom: 40 }}>
            Everything is unlocked — dive in whenever you're ready. Your progress, XP, and badges will be saved automatically.
          </p>

          <Link to="/app" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 40px', borderRadius: 12, background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', color: '#fff', fontWeight: 800, fontSize: 16, textDecoration: 'none', boxShadow: '0 8px 28px rgba(14,165,233,0.3)', fontFamily: "'Space Grotesk', sans-serif" }}>
            ✈️ Start Learning Now
          </Link>

          <div style={{ margin: '48px auto 0', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28, maxWidth: 400 }}>
            <p style={{ color: '#334155', fontSize: 13, lineHeight: 1.7 }}>
              Questions? Email us at{' '}
              <a href="mailto:support@pilotessentials.com" style={{ color: '#38bdf8', textDecoration: 'none' }}>support@pilotessentials.com</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
