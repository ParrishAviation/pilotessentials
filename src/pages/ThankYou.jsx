import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const PLAN_LABELS = {
  full_access: 'Full Access',
  cfi_mentorship: 'CFI Mentorship',
};

export default function ThankYou() {
  const { hasPaid, tierLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planKey = searchParams.get('plan') || 'full_access';
  const planLabel = PLAN_LABELS[planKey] || 'Full Access';

  // Guard: if user hasn't paid, send them to checkout
  useEffect(() => {
    if (!tierLoading && !hasPaid) {
      navigate('/checkout', { replace: true });
    }
  }, [hasPaid, tierLoading, navigate]);

  if (tierLoading) return null;
  if (!hasPaid) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060f1e',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Nav */}
      <nav style={{
        padding: '0 24px',
        background: 'rgba(6,15,30,0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', alignItems: 'center', height: 62,
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, boxShadow: '0 0 18px rgba(14,165,233,0.35)',
            }}>✈️</div>
            <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: 17, letterSpacing: '-0.3px' }}>
              Pilot Essentials
            </span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}
        >
          {/* Checkmark icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
            style={{
              width: 88, height: 88, borderRadius: '50%',
              background: 'rgba(52,211,153,0.12)',
              border: '2px solid rgba(52,211,153,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px',
              fontSize: 40,
            }}
          >
            ✅
          </motion.div>

          <h1 style={{
            color: '#f1f5f9', fontSize: 36, fontWeight: 900,
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: '-0.5px', marginBottom: 14, lineHeight: 1.2,
          }}>
            You're in the cockpit!
          </h1>

          <p style={{ color: '#94a3b8', fontSize: 17, lineHeight: 1.7, marginBottom: 8 }}>
            Thank you for your purchase. Your <strong style={{ color: '#38bdf8' }}>{planLabel}</strong> plan is now active and ready to go.
          </p>

          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6, marginBottom: 40 }}>
            Everything is unlocked — dive in whenever you're ready. Your progress, XP, and badges will be saved automatically.
          </p>

          {/* CTA */}
          <Link
            to="/app"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 40px', borderRadius: 12,
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              color: '#fff', fontWeight: 800, fontSize: 16,
              textDecoration: 'none',
              boxShadow: '0 8px 28px rgba(14,165,233,0.3)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            ✈️ Start Learning Now
          </Link>

          {/* Divider */}
          <div style={{
            margin: '48px auto 0',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: 28, maxWidth: 400,
          }}>
            <p style={{ color: '#334155', fontSize: 13, lineHeight: 1.7 }}>
              A confirmation email is on its way. Questions? Email us at{' '}
              <a href="mailto:support@pilotessentials.com" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                support@pilotessentials.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
