import { useNavigate } from 'react-router-dom';
import { Plane, ArrowRight, CheckCircle } from 'lucide-react';

const SITE_URL = 'https://pilotessentials.vercel.app';

// Top CTA banner
export function TopCTA() {
  const navigate = useNavigate();
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
      padding: '18px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        maxWidth: 900, margin: '0 auto',
        display: 'flex', flexWrap: 'wrap',
        alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
          ✈️ Ready to ace your FAA written test? Get the complete ground school — 17 chapters, AI study guides, and 1,000+ practice questions.
        </span>
        <button
          onClick={() => navigate('/checkout?plan=full_access')}
          style={{
            background: '#fff', color: '#0ea5e9',
            border: 'none', borderRadius: 8,
            padding: '10px 22px', fontWeight: 800,
            fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          }}
        >
          Start Free Today →
        </button>
      </div>
    </div>
  );
}

// Bottom CTA section
export function BottomCTA({ headline, sub }) {
  const navigate = useNavigate();
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(37,99,235,0.12) 100%)',
      border: '1px solid rgba(56,189,248,0.25)',
      borderRadius: 20, padding: '48px 36px',
      textAlign: 'center', margin: '64px auto 0',
      maxWidth: 720,
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: 16,
        background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, margin: '0 auto 20px',
        boxShadow: '0 0 30px rgba(14,165,233,0.4)',
      }}>✈️</div>
      <h2 style={{ color: '#f8fafc', fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
        {headline || 'Pass Your FAA Written Test — First Attempt'}
      </h2>
      <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, marginBottom: 28, maxWidth: 560, margin: '0 auto 28px' }}>
        {sub || 'Join thousands of student pilots who used Pilot Essentials to pass their FAA knowledge test. Start free — no credit card required.'}
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
        {['17-Chapter Ground School', '1,000+ Practice Questions', 'AI Study Guides', 'Live CFI Chat Rooms'].map(f => (
          <div key={f} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: '#38bdf8', fontSize: 13, fontWeight: 600,
          }}>
            <CheckCircle size={14} /> {f}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
            color: '#fff', border: 'none', borderRadius: 12,
            padding: '14px 32px', fontWeight: 800, fontSize: 16,
            cursor: 'pointer', boxShadow: '0 0 30px rgba(14,165,233,0.35)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          Start Free <ArrowRight size={16} />
        </button>
        <button
          onClick={() => navigate('/checkout?plan=full_access')}
          style={{
            background: 'rgba(255,255,255,0.05)',
            color: '#94a3b8', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 12, padding: '14px 32px',
            fontWeight: 700, fontSize: 16, cursor: 'pointer',
          }}
        >
          Full Access — $399
        </button>
        <button
          onClick={() => navigate('/checkout?plan=cfi_mentorship')}
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff', border: 'none', borderRadius: 12,
            padding: '14px 32px', fontWeight: 800, fontSize: 16,
            cursor: 'pointer', boxShadow: '0 0 24px rgba(245,158,11,0.3)',
          }}
        >
          CFI Mentorship — $999
        </button>
      </div>
    </div>
  );
}

// Shared blog page wrapper
export function BlogLayout({ children, title, description, slug }) {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#060f1e', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(6,15,30,0.97)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 62,
        }}>
          <button onClick={() => navigate('/')} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: 'none', cursor: 'pointer',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, boxShadow: '0 0 18px rgba(14,165,233,0.35)',
            }}>✈️</div>
            <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: 17, letterSpacing: '-0.3px' }}>
              Pilot Essentials
            </span>
          </button>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => navigate('/blog')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#94a3b8', fontSize: 14, fontWeight: 600,
            }}>Blog</button>
            <button onClick={() => navigate('/login')} style={{
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              color: '#fff', border: 'none', borderRadius: 9,
              padding: '8px 18px', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}>
              Start Free
            </button>
          </div>
        </div>
      </nav>

      {/* Top CTA */}
      <TopCTA />

      {/* Content */}
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '56px 24px 80px' }}>
        {children}
      </main>
    </div>
  );
}

// Reusable prose styles as inline style object
export const prose = {
  h1: { color: '#f8fafc', fontSize: 'clamp(28px,5vw,42px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.5px' },
  h2: { color: '#f1f5f9', fontSize: 'clamp(20px,3vw,26px)', fontWeight: 700, lineHeight: 1.3, marginTop: 52, marginBottom: 14 },
  h3: { color: '#e2e8f0', fontSize: 18, fontWeight: 700, marginTop: 36, marginBottom: 10 },
  p: { color: '#94a3b8', fontSize: 16, lineHeight: 1.85, marginBottom: 18 },
  meta: { color: '#38bdf8', fontSize: 13, fontWeight: 600, marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap' },
  tag: {
    display: 'inline-block', background: 'rgba(56,189,248,0.1)',
    border: '1px solid rgba(56,189,248,0.2)',
    color: '#38bdf8', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700,
  },
  ul: { paddingLeft: 22, marginBottom: 18 },
  li: { color: '#94a3b8', fontSize: 16, lineHeight: 1.85, marginBottom: 6 },
  infoBox: {
    background: 'rgba(56,189,248,0.07)',
    border: '1px solid rgba(56,189,248,0.18)',
    borderRadius: 12, padding: '20px 24px', margin: '28px 0',
  },
  warningBox: {
    background: 'rgba(245,158,11,0.08)',
    border: '1px solid rgba(245,158,11,0.22)',
    borderRadius: 12, padding: '20px 24px', margin: '28px 0',
  },
  divider: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '44px 0' },
};
