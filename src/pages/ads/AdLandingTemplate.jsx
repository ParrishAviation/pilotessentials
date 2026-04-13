import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, Zap, BookOpen, Brain, FileText, Award, ArrowRight, Phone } from 'lucide-react';

const FEATURES = [
  { icon: <BookOpen size={20} />, title: '17 Structured Chapters', desc: 'Every topic on the FAA knowledge test — aerodynamics, weather, airspace, regulations, navigation, and more.' },
  { icon: <Brain size={20} />, title: 'AI Flight Instructor', desc: 'Ask any question, get a real answer. Available 24/7 — as many questions as you need.' },
  { icon: <FileText size={20} />, title: '1,000+ Practice Questions', desc: 'Pulled directly from the FAA question bank. Drill by topic or take a full 60-question mock exam.' },
  { icon: <Zap size={20} />, title: 'Instant Study Guides', desc: 'Every lesson has a detailed study guide ready instantly. No waiting, no fluff.' },
  { icon: <Award size={20} />, title: 'ACS Checkride Prep', desc: 'Aligned to the FAA Airmen Certification Standards so you\'re ready for your examiner, not just the test.' },
  { icon: <Shield size={20} />, title: 'Lifetime Access', desc: 'Pay once. Access everything forever — including all future updates at no extra cost.' },
];

const WHAT_YOU_GET = [
  'Full 17-chapter PPL ground school curriculum',
  'Unlimited AI Flight Instructor access',
  'Study guides for every single lesson',
  '1,000+ FAA practice questions',
  '60-question randomized final exam',
  'XP system, badges & progress tracking',
  'ACS checkride prep guide',
  'Lifetime access — all future content free',
];

function Navbar() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 24px',
      background: 'rgba(6,15,30,0.97)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, boxShadow: '0 0 18px rgba(14,165,233,0.35)' }}>✈️</div>
          <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: 17, letterSpacing: '-0.3px' }}>Pilot Essentials</span>
        </Link>
        <Link to="/checkout?plan=full_access" style={{
          padding: '9px 22px', borderRadius: 10,
          background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
          color: '#fff', fontWeight: 700, fontSize: 14,
          textDecoration: 'none', whiteSpace: 'nowrap',
          boxShadow: '0 4px 14px rgba(14,165,233,0.3)',
        }}>
          Enroll Now — from $299
        </Link>
      </div>
    </nav>
  );
}

function CtaButton({ label = 'Enroll Now — from $299', size = 'lg' }) {
  const lg = size === 'lg';
  return (
    <Link to="/checkout?plan=full_access" style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: lg ? '18px 48px' : '14px 32px',
      borderRadius: 14,
      background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
      color: '#fff', fontWeight: 800, fontSize: lg ? 18 : 15,
      textDecoration: 'none',
      boxShadow: '0 8px 32px rgba(14,165,233,0.35)',
      fontFamily: "'Space Grotesk', sans-serif",
      letterSpacing: '-0.2px',
      transition: 'transform 0.15s, box-shadow 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(14,165,233,0.45)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(14,165,233,0.35)'; }}
    >
      {label} <ArrowRight size={lg ? 18 : 15} />
    </Link>
  );
}

/**
 * props:
 *   headline       string   — big H1
 *   subheadline    string   — paragraph under H1
 *   guaranteeCopy  string   — text inside the guarantee badge
 *   accentColor    string   — optional accent (default cyan)
 *   heroTag        string   — small label above headline (e.g. "FAA WRITTEN EXAM PREP")
 */
export default function AdLandingTemplate({ headline, subheadline, guaranteeCopy, heroTag, accentColor = '#38bdf8' }) {
  return (
    <div style={{ minHeight: '100vh', background: '#060f1e', fontFamily: 'Inter, system-ui, sans-serif', color: '#f1f5f9' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '100px 24px 80px',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(14,165,233,0.12) 0%, transparent 70%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* subtle grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 820, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {heroTag && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <span style={{
                display: 'inline-block', padding: '5px 16px', borderRadius: 100,
                background: `${accentColor}18`, border: `1px solid ${accentColor}40`,
                color: accentColor, fontSize: 12, fontWeight: 800,
                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 24,
              }}>{heroTag}</span>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
            style={{
              fontSize: 'clamp(32px, 5.5vw, 62px)', fontWeight: 900, lineHeight: 1.1,
              letterSpacing: '-1.5px', marginBottom: 24,
              fontFamily: "'Space Grotesk', sans-serif",
              color: '#f1f5f9',
            }}
          >
            {headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontSize: 'clamp(16px, 2.2vw, 20px)', color: '#94a3b8', lineHeight: 1.7, marginBottom: 40, maxWidth: 640, margin: '0 auto 40px' }}
          >
            {subheadline}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <CtaButton label="Enroll Now — from $299" size="lg" />
            <p style={{ color: '#475569', fontSize: 13 }}>One-time payment · Lifetime access · Instant course unlock</p>
          </motion.div>

          {/* Guarantee badge */}
          {guaranteeCopy && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.25 }}
              style={{
                marginTop: 48, display: 'inline-flex', alignItems: 'center', gap: 12,
                padding: '16px 28px', borderRadius: 16,
                background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
              }}
            >
              <span style={{ fontSize: 28 }}>🛡️</span>
              <p style={{ color: '#fde68a', fontSize: 15, fontWeight: 600, margin: 0, textAlign: 'left', lineHeight: 1.5 }}>{guaranteeCopy}</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, marginBottom: 12, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px' }}>
            Everything you need to pass — in one place
          </h2>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: 16, marginBottom: 48 }}>
            One-time payment. Everything included. No subscriptions.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 56 }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                style={{
                  padding: '24px 22px', borderRadius: 16,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div style={{ color: accentColor, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, marginBottom: 12, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px' }}>
            Simple, one-time pricing
          </h2>
          <p style={{ color: '#64748b', fontSize: 16, marginBottom: 40 }}>Plans starting at $299. No subscriptions. No hidden fees. Pay once, access forever.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 32 }}>
            {/* Basic Access — $299 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{
                padding: '32px 28px', borderRadius: 20,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(167,139,250,0.3)',
                textAlign: 'left',
              }}
            >
              <p style={{ color: '#a78bfa', fontWeight: 700, fontSize: 13, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Basic Access</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 20 }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>$299</span>
                <span style={{ color: '#475569', fontSize: 14, marginBottom: 6 }}>one-time</span>
              </div>
              <div style={{ marginBottom: 24 }}>
                {WHAT_YOU_GET.map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                    <CheckCircle size={14} color="#a78bfa" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/checkout?plan=basic_access" style={{
                display: 'block', textAlign: 'center', padding: '13px 24px', borderRadius: 10,
                background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.35)',
                color: '#a78bfa', fontWeight: 700, fontSize: 14, textDecoration: 'none',
              }}>
                Get Basic Access — $299
              </Link>
            </motion.div>

            {/* Full Access — $399 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}
              style={{
                padding: '32px 28px', borderRadius: 20,
                background: 'rgba(255,255,255,0.04)',
                border: '2px solid rgba(56,189,248,0.35)',
                position: 'relative', textAlign: 'left',
              }}
            >
              <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 18px', borderRadius: 100, letterSpacing: 1, whiteSpace: 'nowrap' }}>
                MOST POPULAR
              </div>
              <p style={{ color: '#38bdf8', fontWeight: 700, fontSize: 13, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Full Access</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 20 }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>$399</span>
                <span style={{ color: '#475569', fontSize: 14, marginBottom: 6 }}>one-time</span>
              </div>
              {/* Pass Guarantee callout */}
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', marginBottom: 16 }}>
                <span style={{ fontSize: 13, color: '#86efac', fontWeight: 600 }}>✈️ Pass Guarantee — if you don't pass, we do 1-on-1 live ground school with a CFI until you do</span>
              </div>
              <div style={{ marginBottom: 24 }}>
                {WHAT_YOU_GET.map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                    <CheckCircle size={14} color="#38bdf8" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
              <CtaButton label="Get Full Access — $399" size="md" />
              <p style={{ color: '#334155', fontSize: 12, marginTop: 12 }}>Payments secured by Stripe · Instant access after purchase</p>
            </motion.div>
          </div>

          {/* CFI upsell link */}
          <p style={{ color: '#475569', fontSize: 14 }}>
            Want 1-on-1 CFI mentorship?{' '}
            <Link to="/checkout?plan=cfi_mentorship" style={{ color: '#f59e0b', fontWeight: 700, textDecoration: 'none' }}>
              See the CFI Mentorship plan — $999 →
            </Link>
          </p>
        </div>
      </section>

      {/* ── GUARANTEE DETAIL ── */}
      <section style={{ padding: '64px 24px', background: 'rgba(245,158,11,0.04)', borderTop: '1px solid rgba(245,158,11,0.12)', borderBottom: '1px solid rgba(245,158,11,0.12)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: '#fde68a', marginBottom: 16, fontFamily: "'Space Grotesk', sans-serif" }}>
            The Pilot Essentials Guarantee
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
            Complete the course and still don't pass your FAA written test? We'll personally coach you until you do — at no additional charge. No fine print. No limits. We're in it with you until you get that passing score.
          </p>
          <CtaButton label="Enroll with Confidence — from $299" size="md" />
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, marginBottom: 16, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px', lineHeight: 1.2 }}>
            Your FAA written test is waiting.
          </h2>
          <p style={{ color: '#64748b', fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            Enroll in minutes. Start studying today. Pass with confidence.
          </p>
          <CtaButton label="Start Now — from $299" size="lg" />
          <p style={{ color: '#334155', fontSize: 13, marginTop: 16 }}>
            Questions?{' '}
            <a href="mailto:support@mypilotessentials.com" style={{ color: '#38bdf8', textDecoration: 'none' }}>support@mypilotessentials.com</a>
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✈️</div>
          <span style={{ color: '#475569', fontWeight: 700, fontSize: 14 }}>Pilot Essentials</span>
        </div>
        <p style={{ color: '#334155', fontSize: 12 }}>
          © {new Date().getFullYear()} Pilot Essentials · <Link to="/" style={{ color: '#475569', textDecoration: 'none' }}>Home</Link> · <a href="mailto:support@mypilotessentials.com" style={{ color: '#475569', textDecoration: 'none' }}>Contact</a>
        </p>
      </footer>
    </div>
  );
}
