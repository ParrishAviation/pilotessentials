import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, MessageSquare } from 'lucide-react';

const HEADLINE = 'Pass Your FAA Written Test in 21 Days ...or Get a Free 90 Minute Ground Lesson';

const STEPS = [
  {
    num: '1',
    title: 'Enroll Today',
    desc: 'Get instant access to the full course — 17 chapters, AI study guides, and 1,000+ practice questions.',
  },
  {
    num: '2',
    title: 'Study for 3 Weeks',
    desc: 'Work through structured lessons at your own pace. Our AI Flight Instructor answers every question.',
  },
  {
    num: '3',
    title: 'Pass the FAA Test',
    desc: "Take the test with confidence. If you don't pass, we do 1-on-1 tutoring with a CFI until you do.",
  },
];

export default function AdLandingTemplate() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#f1f5f9', background: '#060f1e', position: 'relative' }}>

      {/* ── LOGO BAR ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        padding: '18px 32px',
        display: 'flex', alignItems: 'center',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, boxShadow: '0 0 14px rgba(14,165,233,0.35)' }}>✈️</div>
          <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: 15, letterSpacing: '-0.3px' }}>Pilot Essentials</span>
        </Link>
      </div>

      {/* ── ABOVE THE FOLD ── */}
      <section style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 32px 24px',
        position: 'relative',
        overflowX: 'hidden',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(14,165,233,0.13) 0%, transparent 70%), #060f1e',
      }}>
        {/* subtle grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1100, width: '100%', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

          {/* Headline — full width, 2 lines */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{
              fontSize: 'clamp(26px, 4.2vw, 54px)', fontWeight: 900, lineHeight: 1.1,
              letterSpacing: '-1.5px', margin: 0, textAlign: 'center',
              fontFamily: "'Space Grotesk', Inter, sans-serif",
              color: '#f1f5f9', width: '100%',
            }}
          >
            {HEADLINE}
          </motion.h1>

          {/* Image + CTA row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>

            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                flex: '1 1 320px', maxWidth: 480, borderRadius: 20, overflow: 'hidden',
                border: '1px solid rgba(56,189,248,0.18)',
                boxShadow: '0 24px 64px rgba(14,165,233,0.22)',
              }}
            >
              <img
                src="/hero-cockpit.jpg"
                alt="Student pilots in the cockpit"
                style={{ width: '100%', display: 'block' }}
              />
            </motion.div>

            {/* CTA + badges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, flex: '0 1 auto' }}
            >
              <Link
                to="/checkout"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '18px 44px', borderRadius: 14,
                  background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                  color: '#fff', fontWeight: 800, fontSize: 18,
                  textDecoration: 'none',
                  boxShadow: '0 8px 32px rgba(14,165,233,0.35)',
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: '-0.2px',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 44px rgba(14,165,233,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(14,165,233,0.35)'; }}
              >
                Become a Pilot <ArrowRight size={18} />
              </Link>

              {/* Trust badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { emoji: '🦜', label: 'Duolingo for pilots' },
                  { emoji: '💬', label: '24/7 Support' },
                  { emoji: '🛰️', label: 'Live chatroom' },
                ].map(b => (
                  <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15 }}>{b.emoji}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>{b.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ── BELOW THE FOLD ── */}
      <section style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        gap: 56,
      }}>

        {/* 3-Step Process */}
        <div style={{ maxWidth: 860, width: '100%', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800, marginBottom: 36,
            fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px',
          }}>
            How it works
          </h2>

          <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
            {STEPS.map((step, i) => (
              <div key={step.num} style={{ display: 'flex', alignItems: 'stretch', flex: 1 }}>
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{
                  flex: 1,
                  padding: '28px 24px', borderRadius: 18,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(56,189,248,0.14)',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 18, color: '#fff',
                  marginBottom: 16,
                  fontFamily: "'Space Grotesk', sans-serif",
                  boxShadow: '0 4px 14px rgba(14,165,233,0.3)',
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0', marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65, margin: 0 }}>
                  {step.desc}
                </p>
              </motion.div>
              {/* Connector arrow between steps */}
              {i < STEPS.length - 1 && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px', flexShrink: 0,
                }}>
                  <div style={{ width: 24, height: 2, background: 'linear-gradient(90deg, rgba(56,189,248,0.3), rgba(56,189,248,0.7))' }} />
                </div>
              )}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial + Screenshot */}
        <div style={{ maxWidth: 860, width: '100%', display: 'flex', alignItems: 'stretch', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>

          {/* Screenshot */}
          <motion.div
            initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            style={{
              flex: '1 1 340px', maxWidth: 420, borderRadius: 16, overflow: 'hidden',
              alignSelf: 'stretch',
            }}
          >
            <img
              src="/platform-screenshot.jpg"
              alt="Pilot Essentials platform"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </motion.div>

          {/* Testimonial + CTA stacked, matching screenshot height */}
          <motion.div
            initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            style={{
              flex: '1 1 280px', maxWidth: 380,
              alignSelf: 'stretch',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              textAlign: 'left',
            }}
          >
            {/* Quote */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <MessageSquare size={18} color="#38bdf8" />
              <p style={{ fontSize: 15, color: '#cbd5e1', fontWeight: 400, lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                "Pilot essentials looks good, I really like it!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 13, color: '#fff', flexShrink: 0,
                }}>
                  T
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#f1f5f9' }}>Taylor H.</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#475569' }}>Private Pilot</p>
                </div>
              </div>
            </div>

            {/* CTA pinned to bottom */}
            <Link
              to="/checkout"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: '15px 24px', borderRadius: 12,
                background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                color: '#fff', fontWeight: 700, fontSize: 15,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(14,165,233,0.3)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(14,165,233,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(14,165,233,0.3)'; }}
            >
              Start Course Now <ArrowRight size={15} />
            </Link>
          </motion.div>

        </div>

      </section>

    </div>
  );
}
