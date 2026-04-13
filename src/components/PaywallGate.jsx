import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Wrap any route element with this component.
 * If the user hasn't paid, they see the upgrade wall instead of the content.
 */
export default function PaywallGate({ children }) {
  const { hasPaid, tierLoading, user } = useAuth();
  const navigate = useNavigate();

  // Still resolving purchase tier — show spinner so there's no flash
  if (tierLoading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#060f1e',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Loader size={32} color="#38bdf8" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (hasPaid) return children;

  // Unpaid — show upgrade wall
  return (
    <div style={{
      minHeight: '100vh', background: '#060f1e',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{
        position: 'absolute', top: '-10%', left: '20%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '15%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: 600, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        {/* Lock icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          style={{
            width: 80, height: 80, borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(37,99,235,0.15))',
            border: '1px solid rgba(56,189,248,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
            boxShadow: '0 0 40px rgba(14,165,233,0.15)',
          }}
        >
          <Lock size={36} color="#38bdf8" />
        </motion.div>

        <h1 style={{
          color: '#f8fafc', fontSize: 'clamp(24px, 4vw, 36px)',
          fontWeight: 800, marginBottom: 14, letterSpacing: '-0.5px',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          Unlock Full Course Access
        </h1>
        <p style={{
          color: '#64748b', fontSize: 17, lineHeight: 1.7,
          marginBottom: 36, maxWidth: 480, margin: '0 auto 36px',
        }}>
          You're signed in as <strong style={{ color: '#94a3b8' }}>{user?.email}</strong>.
          Purchase a plan to access all 17 chapters, AI study guides, practice tests, and more.
        </p>

        {/* Feature pills */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 10,
          justifyContent: 'center', marginBottom: 36,
        }}>
          {[
            '17-Chapter Ground School',
            '1,000+ Practice Questions',
            'AI Study Guides',
            'AI Flight Instructor',
            'End-of-Course Exam',
            'Checkride Prep',
          ].map(f => (
            <div key={f} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(56,189,248,0.08)',
              border: '1px solid rgba(56,189,248,0.18)',
              borderRadius: 100, padding: '5px 14px',
              color: '#38bdf8', fontSize: 13, fontWeight: 600,
            }}>
              <CheckCircle size={12} /> {f}
            </div>
          ))}
        </div>

        {/* Plan buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 14, marginBottom: 20,
        }}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/checkout?plan=basic_access')}
            style={{
              padding: '16px 20px', borderRadius: 14,
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              border: 'none', color: '#fff',
              fontWeight: 800, fontSize: 16, cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(124,58,237,0.3)',
              fontFamily: "'Space Grotesk', sans-serif",
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4,
            }}
          >
            <span>Basic Access</span>
            <span style={{ fontSize: 22, fontWeight: 900 }}>$299</span>
            <span style={{ fontSize: 12, opacity: 0.85, fontWeight: 500 }}>One-time · Lifetime access</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/checkout?plan=full_access')}
            style={{
              padding: '16px 20px', borderRadius: 14,
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              border: 'none', color: '#fff',
              fontWeight: 800, fontSize: 16, cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(14,165,233,0.35)',
              fontFamily: "'Space Grotesk', sans-serif",
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4,
            }}
          >
            <span>Full Access</span>
            <span style={{ fontSize: 22, fontWeight: 900 }}>$399</span>
            <span style={{ fontSize: 12, opacity: 0.85, fontWeight: 500 }}>+ Pass Guarantee</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/checkout?plan=cfi_mentorship')}
            style={{
              padding: '16px 20px', borderRadius: 14,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none', color: '#fff',
              fontWeight: 800, fontSize: 16, cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(245,158,11,0.3)',
              fontFamily: "'Space Grotesk', sans-serif",
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4,
            }}
          >
            <span>CFI Mentorship</span>
            <span style={{ fontSize: 22, fontWeight: 900 }}>$999</span>
            <span style={{ fontSize: 12, opacity: 0.85, fontWeight: 500 }}>Live CFI + study guide</span>
          </motion.button>
        </div>

        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#475569', fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6,
            margin: '0 auto',
          }}
        >
          ← Back to home
        </button>
      </motion.div>
    </div>
  );
}
