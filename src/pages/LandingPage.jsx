import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, CheckCircle, Star, ChevronRight, Play, Award,
  Users, Clock, Zap, Shield, MessageCircle, BarChart2,
  ChevronDown, Menu, X, ArrowRight, Plane, Brain, FileText,
  Target, TrendingUp, Lock
} from 'lucide-react';

// ─── SEO structured data injected via Helmet-like approach ───────────────────
function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Private Pilot Certificate Training",
    "description": "FAA-approved Private Pilot ground school curriculum. 17 chapters covering aerodynamics, aircraft systems, weather, navigation, airspace, and regulations. Includes AI-powered study guides, practice quizzes, and checkride prep.",
    "provider": {
      "@type": "Organization",
      "name": "Pilot Essentials",
      "url": "https://pilotessentials.vercel.app"
    },
    "educationalLevel": "Beginner to Intermediate",
    "about": "FAA Private Pilot Certificate",
    "teaches": "Aviation, Aerodynamics, FAA Regulations, Weather Theory, Navigation",
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "instructor": {
        "@type": "Person",
        "name": "Certified Flight Instructor"
      }
    }
  };
  useEffect(() => {
    const el = document.getElementById('structured-data');
    if (el) el.textContent = JSON.stringify(schema);
  }, []);
  return null;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onLogin }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 24px',
      background: scrolled ? 'rgba(6,15,30,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 68,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
            borderRadius: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 18,
            boxShadow: '0 0 20px rgba(14,165,233,0.35)',
          }}>✈️</div>
          <span style={{
            fontSize: 18, fontWeight: 800, color: '#f1f5f9',
            fontFamily: "'Space Grotesk', sans-serif", letterSpacing: -0.3,
          }}>Pilot Essentials</span>
        </div>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}
          className="desktop-nav">
          {[['Curriculum', 'curriculum'], ['Features', 'features'], ['Pricing', 'pricing'], ['FAQ', 'faq']].map(([label, id]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, color: '#94a3b8',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = '#f1f5f9'}
              onMouseLeave={e => e.target.style.color = '#94a3b8'}
            >{label}</button>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onLogin} style={{
            padding: '9px 20px', borderRadius: 9,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#e2e8f0', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
          >Log In</button>
          <button onClick={onLogin} style={{
            padding: '9px 22px', borderRadius: 9,
            background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
            border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', transition: 'opacity 0.2s',
            boxShadow: '0 4px 20px rgba(14,165,233,0.3)',
          }}
            onMouseEnter={e => e.target.style.opacity = 0.85}
            onMouseLeave={e => e.target.style.opacity = 1}
          >Start Free →</button>
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none', background: 'none', border: 'none',
              cursor: 'pointer', color: '#94a3b8', padding: 4,
            }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute', top: 68, left: 0, right: 0,
              background: 'rgba(6,15,30,0.98)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              padding: '16px 24px 24px',
            }}
          >
            {[['Curriculum', 'curriculum'], ['Features', 'features'], ['Pricing', 'pricing'], ['FAQ', 'faq']].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                display: 'block', width: '100%', background: 'none', border: 'none',
                cursor: 'pointer', fontSize: 15, fontWeight: 600, color: '#94a3b8',
                textAlign: 'left', padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>{label}</button>
            ))}
            <button onClick={onLogin} style={{
              marginTop: 16, width: '100%', padding: '12px',
              borderRadius: 10, background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer',
            }}>Get Started Free</button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onLogin }) {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
      padding: '120px 24px 80px',
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(14,165,233,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 780 }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28 }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 16px', borderRadius: 100,
              background: 'rgba(14,165,233,0.1)',
              border: '1px solid rgba(14,165,233,0.25)',
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#38bdf8',
                boxShadow: '0 0 8px #38bdf8',
                animation: 'ping 1.5s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8' }}>
                FAA Private Pilot Ground School — Online
              </span>
            </div>
          </motion.div>

          {/* Headline — rich with keywords for SEO/GEO */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{
              fontSize: 'clamp(38px, 6vw, 72px)',
              fontWeight: 900, lineHeight: 1.08,
              color: '#f1f5f9', margin: '0 0 24px',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: -1.5,
            }}
          >
            Pass Your FAA{' '}
            <span style={{
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Private Pilot
            </span>{' '}
            Written Test — First Try
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: '#94a3b8', lineHeight: 1.7,
              margin: '0 0 40px', maxWidth: 620,
            }}
          >
            Structured video lessons, AI-powered study guides, 1,000+ FAA practice questions, and an AI Flight Instructor — everything you need to ace the PAR written exam and checkride.
          </motion.p>

          {/* CTA group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}
          >
            <button onClick={onLogin} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '16px 32px', borderRadius: 12,
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              border: 'none', color: '#fff',
              fontSize: 17, fontWeight: 800,
              cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 8px 32px rgba(14,165,233,0.4)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(14,165,233,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(14,165,233,0.4)'; }}
            >
              Start Learning Free <ArrowRight size={18} />
            </button>
            <button onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '16px 28px', borderRadius: 12,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#e2e8f0', fontSize: 16, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              <Play size={16} style={{ color: '#38bdf8' }} /> View Curriculum
            </button>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: 48,
              display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'center',
            }}
          >
            {[
              { icon: '🎓', text: '17 structured chapters' },
              { icon: '🤖', text: 'AI Flight Instructor included' },
              { icon: '📝', text: '1,000+ FAA practice questions' },
              { icon: '✅', text: 'ACS checkride aligned' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <style>{`
        @keyframes ping { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.3); } }
      `}</style>
    </section>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: '17', label: 'PHAK-aligned chapters' },
    { value: '60+', label: 'Lessons with video' },
    { value: '1,000+', label: 'FAA practice questions' },
    { value: '100%', label: 'ACS checkride coverage' },
  ];
  return (
    <section style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(255,255,255,0.015)',
      padding: '32px 24px',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 24,
      }}>
        {stats.map(({ value, label }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontSize: 36, fontWeight: 900, color: '#38bdf8',
              fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1,
            }}>{value}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: 600 }}>{label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Curriculum section ────────────────────────────────────────────────────────
const CHAPTERS = [
  { num: 1, title: 'Aerodynamics of Flight', topics: 'Lift, drag, stability, stalls, spins, load factor', icon: '✈️' },
  { num: 2, title: 'Aircraft Systems', topics: 'Engine, fuel, magnetos, propeller, electrical', icon: '⚙️' },
  { num: 3, title: 'Flight Instruments', topics: 'Pitot-static, gyroscopes, magnetic compass', icon: '🎛️' },
  { num: 4, title: 'Weather Theory', topics: 'Atmosphere, clouds, fog, density altitude, thunderstorms', icon: '🌦️' },
  { num: 5, title: 'Navigation', topics: 'Sectional charts, dead reckoning, VOR, GPS', icon: '🗺️' },
  { num: 6, title: 'Airspace', topics: 'Class A–G, special use, TFRs, transponder requirements', icon: '🏔️' },
  { num: 7, title: 'Airport Operations', topics: 'Signs, markings, PAPI, traffic patterns, right-of-way', icon: '🛬' },
  { num: 8, title: 'FAA Regulations', topics: 'FAR Part 91, ARROW, fuel reserves, VFR minimums', icon: '📜' },
  { num: 9, title: 'Aeronautical Decision Making', topics: 'ADM, DECIDE model, hazardous attitudes, CRM', icon: '🧠' },
  { num: 10, title: 'Human Factors', topics: 'Hypoxia, spatial disorientation, vision illusions', icon: '👁️' },
  { num: 11, title: 'Cross-Country Flight Planning', topics: 'NOTAMs, weight & balance, VFR flight plan', icon: '📋' },
  { num: 12, title: 'Weight & Balance', topics: 'Moment calculations, CG limits, loading graphs', icon: '⚖️' },
  { num: 13, title: 'Aircraft Performance', topics: 'Takeoff/landing charts, Vx vs Vy, density altitude', icon: '📈' },
  { num: 14, title: 'Night Flying', topics: 'Night vision, illusions, required equipment', icon: '🌙' },
  { num: 15, title: 'Emergency Procedures', topics: 'Engine-out, forced landing, fires, squawk codes', icon: '🚨' },
  { num: 16, title: 'Advanced Topics', topics: 'Icing, wake turbulence, high-altitude operations', icon: '🎯' },
  { num: 17, title: 'Checkride Preparation', topics: 'ACS standards, oral exam prep, common exam traps', icon: '🏆' },
];

function CurriculumSection({ onLogin }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? CHAPTERS : CHAPTERS.slice(0, 8);

  return (
    <section id="curriculum" style={{ padding: '100px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <div style={{
            display: 'inline-block', padding: '5px 16px', borderRadius: 100,
            background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)',
            fontSize: 12, fontWeight: 800, color: '#38bdf8',
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16,
          }}>Complete Curriculum</div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900,
            color: '#f1f5f9', margin: '0 0 16px',
            fontFamily: "'Space Grotesk', sans-serif", letterSpacing: -0.8,
          }}>
            Everything on the FAA Written Test.<br />In One Place.
          </h2>
          <p style={{ fontSize: 16, color: '#64748b', maxWidth: 560, margin: '0 auto' }}>
            17 chapters mapped directly to the FAA Pilot's Handbook of Aeronautical Knowledge (PHAK) and the Airmen Certification Standards.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {visible.map((ch, i) => (
            <motion.div
              key={ch.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.06 }}
              onClick={onLogin}
              style={{
                borderRadius: 14, padding: '18px 20px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', gap: 14, alignItems: 'flex-start',
              }}
              whileHover={{ borderColor: 'rgba(56,189,248,0.25)', background: 'rgba(56,189,248,0.04)', y: -2 }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: 'rgba(56,189,248,0.08)',
                border: '1px solid rgba(56,189,248,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
              }}>{ch.icon}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, color: '#38bdf8',
                    background: 'rgba(56,189,248,0.1)', padding: '2px 7px', borderRadius: 5,
                  }}>CH. {String(ch.num).padStart(2, '0')}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
                  {ch.title}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
                  {ch.topics}
                </div>
              </div>
              <Lock size={14} color="#334155" style={{ flexShrink: 0, marginTop: 4 }} />
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button onClick={() => setExpanded(!expanded)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 24px', borderRadius: 10,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            {expanded ? 'Show Less' : `Show All ${CHAPTERS.length} Chapters`}
            <ChevronDown size={16} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function FeaturesSection({ onLogin }) {
  const features = [
    {
      icon: <Brain size={22} color="#818cf8" />,
      color: '#818cf8',
      title: 'AI Flight Instructor',
      desc: 'Ask any aviation question 24/7. Captain AI is trained on the PHAK, AFH, FAR/AIM, and AKT Supplement — just like a real CFI.',
    },
    {
      icon: <FileText size={22} color="#38bdf8" />,
      color: '#38bdf8',
      title: 'Instant Study Guides',
      desc: 'Every lesson includes a structured study guide with key facts, formulas, FAA test tips, mnemonics, and self-test Q&A.',
    },
    {
      icon: <Target size={22} color="#f59e0b" />,
      color: '#f59e0b',
      title: '1,000+ Practice Questions',
      desc: 'FAA-style questions for every chapter. The 60-question end-of-course test pulls randomly from the full question bank.',
    },
    {
      icon: <TrendingUp size={22} color="#4ade80" />,
      color: '#4ade80',
      title: 'XP & Progress Tracking',
      desc: 'Earn XP for completing lessons and quizzes. Level up, unlock badges, and track your progress toward the written exam.',
    },
    {
      icon: <Plane size={22} color="#c084fc" />,
      color: '#c084fc',
      title: 'FAA Supplement Figures',
      desc: 'Integrated links to the official FAA Airmen Knowledge Test Supplement figures — so you practice reading them exactly as on the exam.',
    },
    {
      icon: <Shield size={22} color="#f87171" />,
      color: '#f87171',
      title: 'ACS Checkride Aligned',
      desc: 'Every topic maps to the Airmen Certification Standards. Study with confidence that you\'re covering everything the DPE will test.',
    },
  ];

  return (
    <section id="features" style={{
      padding: '100px 24px',
      background: 'rgba(255,255,255,0.01)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div style={{
            display: 'inline-block', padding: '5px 16px', borderRadius: 100,
            background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)',
            fontSize: 12, fontWeight: 800, color: '#818cf8',
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16,
          }}>Platform Features</div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900,
            color: '#f1f5f9', margin: '0 0 16px',
            fontFamily: "'Space Grotesk', sans-serif", letterSpacing: -0.8,
          }}>
            More Than Just Videos
          </h2>
          <p style={{ fontSize: 16, color: '#64748b', maxWidth: 500, margin: '0 auto' }}>
            A complete ground school ecosystem built to get you from zero to passing your FAA written test.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
          gap: 20,
        }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              style={{
                borderRadius: 16, padding: '26px 24px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'border-color 0.2s',
              }}
              whileHover={{ borderColor: `${f.color}30` }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 12, marginBottom: 18,
                background: `${f.color}12`,
                border: `1px solid ${f.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{f.icon}</div>
              <h3 style={{
                fontSize: 17, fontWeight: 800, color: '#f1f5f9', marginBottom: 10,
                fontFamily: "'Space Grotesk', sans-serif",
              }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65, margin: 0 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function PricingSection({ onLogin, onCheckout }) {
  return (
    <section id="pricing" style={{
      padding: '100px 24px',
      background: 'rgba(255,255,255,0.01)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <div style={{
            display: 'inline-block', padding: '5px 16px', borderRadius: 100,
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
            fontSize: 12, fontWeight: 800, color: '#f59e0b',
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16,
          }}>Simple Pricing</div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900,
            color: '#f1f5f9', margin: '0 0 16px',
            fontFamily: "'Space Grotesk', sans-serif", letterSpacing: -0.8,
          }}>
            Invest in Your Wings
          </h2>
          <p style={{ fontSize: 16, color: '#64748b', maxWidth: 560, margin: '0 auto' }}>
            Choose your path — self-paced ground school or hands-on CFI mentorship. Both include lifetime access and everything you need to ace your FAA written test.
          </p>
        </motion.div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24, maxWidth: 1100, margin: '0 auto',
        }}>
          {/* Free tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              borderRadius: 20, padding: '36px 32px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 800, color: '#94a3b8', marginBottom: 12 }}>Free Preview</div>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>$0</span>
            </div>
            {[
              'Chapter 1: Aerodynamics',
              'Sample AI study guides',
              '50 practice questions',
              'AI Instructor (5 questions/day)',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <CheckCircle size={16} color="#4ade80" />
                <span style={{ fontSize: 14, color: '#94a3b8' }}>{item}</span>
              </div>
            ))}
            <button onClick={onLogin} style={{
              marginTop: 24, width: '100%', padding: '13px',
              borderRadius: 10, background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#e2e8f0', fontSize: 15, fontWeight: 700,
              cursor: 'pointer',
            }}>Get Started Free</button>
          </motion.div>

          {/* Full access — $399 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              borderRadius: 20, padding: '36px 32px',
              background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(37,99,235,0.12) 100%)',
              border: '2px solid rgba(14,165,233,0.35)',
              position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
              padding: '4px 18px', borderRadius: 100,
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              fontSize: 12, fontWeight: 800, color: '#fff',
              whiteSpace: 'nowrap',
            }}>MOST POPULAR</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#38bdf8', marginBottom: 12 }}>Full Access</div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>$399</span>
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>One-time payment — lifetime access</div>
            {[
              'All 17 chapters + video lessons',
              'AI Flight Instructor (unlimited)',
              'Instant study guides — every lesson',
              '1,000+ FAA practice questions',
              '60-question randomized final exam',
              'XP, badges & leaderboard',
              'ACS checkride prep guide',
              'New content added free',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <CheckCircle size={16} color="#38bdf8" />
                <span style={{ fontSize: 14, color: '#e2e8f0' }}>{item}</span>
              </div>
            ))}
            <button onClick={() => onCheckout('full_access')} style={{
              marginTop: 24, width: '100%', padding: '15px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              border: 'none', color: '#fff', fontSize: 15, fontWeight: 800,
              cursor: 'pointer', transition: 'opacity 0.2s',
              boxShadow: '0 6px 24px rgba(14,165,233,0.35)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
              onMouseEnter={e => e.target.style.opacity = 0.85}
              onMouseLeave={e => e.target.style.opacity = 1}
            >Get Full Access — $399 →</button>
          </motion.div>

          {/* CFI Mentorship — $999 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              borderRadius: 20, padding: '36px 32px',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(217,119,6,0.08) 100%)',
              border: '2px solid rgba(245,158,11,0.35)',
              position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
              padding: '4px 18px', borderRadius: 100,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              fontSize: 12, fontWeight: 800, color: '#fff',
              whiteSpace: 'nowrap',
            }}>CFI MENTORSHIP</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#f59e0b', marginBottom: 12 }}>Full Access + Live CFI</div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>$999</span>
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>One-time payment — includes 12 months of live CFI access</div>
            {[
              'Everything in Full Access',
              '12-month live CFI chat room access',
              'Ask real CFIs your questions daily',
              'Exclusive 7-page expert study guide',
              'CFI-reviewed study sessions',
              'Small-group mentorship community',
            ].map((item, i) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <CheckCircle size={16} color={i === 0 ? '#94a3b8' : '#f59e0b'} />
                <span style={{ fontSize: 14, color: i === 0 ? '#94a3b8' : '#fde68a' }}>{item}</span>
              </div>
            ))}
            <button onClick={() => onCheckout('cfi_mentorship')} style={{
              marginTop: 24, width: '100%', padding: '15px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none', color: '#fff', fontSize: 15, fontWeight: 800,
              cursor: 'pointer', transition: 'opacity 0.2s',
              boxShadow: '0 6px 24px rgba(245,158,11,0.35)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
              onMouseEnter={e => e.target.style.opacity = 0.85}
              onMouseLeave={e => e.target.style.opacity = 1}
            >Get CFI Mentorship — $999 →</button>
          </motion.div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: '#334155' }}>
          Compare to flight school ground school fees of $500–$1,500. Questions? Contact us.
        </p>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'What is covered in this private pilot ground school?', a: 'All 17 knowledge areas tested on the FAA Private Pilot Airmen Knowledge Test (PAR): aerodynamics, aircraft systems, flight instruments, weather theory, weather services, navigation, airspace, airport operations, FAA regulations, aeronautical decision making, human factors, cross-country planning, weight & balance, aircraft performance, night operations, emergency procedures, and checkride prep.' },
  { q: 'Is this course sufficient to pass the FAA written test?', a: 'Yes. The curriculum is fully aligned with the FAA\'s Airmen Certification Standards (ACS) and the Pilot\'s Handbook of Aeronautical Knowledge (PHAK). With 17 chapters, 1,000+ practice questions, and AI-powered study guides, students have everything they need to pass the PAR written exam.' },
  { q: 'Do I need any prior knowledge to start?', a: 'No. The course starts from the very basics and builds up systematically. Whether you\'re a complete beginner or already have some flight time, the structured curriculum covers everything you need.' },
  { q: 'What is the AI Flight Instructor?', a: '"Captain AI" is a conversational AI assistant trained specifically on FAA aviation materials — the PHAK, AFH, FAR/AIM, and AKT Supplement. You can ask it any aviation question, request explanations, or quiz yourself, 24 hours a day.' },
  { q: 'Does this replace a real flight instructor (CFI)?', a: 'For ground school and written exam preparation, yes. You still need a certified flight instructor (CFI) for actual flight training, solo endorsements, and sign-off for the practical test. This platform handles the knowledge/written exam portion of your training.' },
  { q: 'How long does it take to complete the course?', a: 'At your own pace. Most students complete the ground school in 2–8 weeks studying a few hours per week. The FAA written test can be taken as soon as you feel prepared — there\'s no minimum time requirement.' },
  { q: 'Is my progress saved?', a: 'Yes. All progress, XP, badges, and completed lessons are saved to your account using Supabase cloud storage — accessible from any device.' },
];

function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <div style={{
            display: 'inline-block', padding: '5px 16px', borderRadius: 100,
            background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)',
            fontSize: 12, fontWeight: 800, color: '#38bdf8',
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16,
          }}>FAQ</div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900,
            color: '#f1f5f9', margin: 0,
            fontFamily: "'Space Grotesk', sans-serif",
          }}>Common Questions</h2>
        </motion.div>

        {FAQS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            style={{
              borderRadius: 12, marginBottom: 8,
              background: open === i ? 'rgba(56,189,248,0.04)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${open === i ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.07)'}`,
              transition: 'all 0.2s',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: 16,
                padding: '18px 22px', background: 'none', border: 'none',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.4 }}>{item.q}</span>
              <ChevronDown size={18} color="#475569" style={{
                flexShrink: 0,
                transform: open === i ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }} />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{
                    padding: '0 22px 18px',
                    fontSize: 14, color: '#94a3b8', lineHeight: 1.7,
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: 14,
                  }}>
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Bottom CTA ───────────────────────────────────────────────────────────────
function BottomCTA({ onLogin, onCheckout }) {
  return (
    <section style={{
      padding: '100px 24px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(14,165,233,0.12) 0%, transparent 70%)',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>✈️</div>
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900,
            color: '#f1f5f9', margin: '0 0 20px',
            fontFamily: "'Space Grotesk', sans-serif", letterSpacing: -1,
          }}>
            Your Private Pilot Certificate Starts Here
          </h2>
          <p style={{ fontSize: 17, color: '#64748b', marginBottom: 40, lineHeight: 1.6 }}>
            Join students who passed the FAA written with Pilot Essentials. Start free, or go all-in with full access or CFI mentorship.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
            <button onClick={onLogin} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '15px 32px', borderRadius: 12,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#e2e8f0', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif",
            }}>
              Start Free
            </button>
            <button onClick={() => onCheckout('full_access')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '15px 32px', borderRadius: 12,
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              border: 'none', color: '#fff',
              fontSize: 15, fontWeight: 800,
              cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 8px 30px rgba(14,165,233,0.4)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >
              Full Access — $399 <ArrowRight size={16} />
            </button>
            <button onClick={() => onCheckout('cfi_mentorship')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '15px 32px', borderRadius: 12,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none', color: '#fff',
              fontSize: 15, fontWeight: 800,
              cursor: 'pointer', transition: 'transform 0.2s',
              boxShadow: '0 8px 30px rgba(245,158,11,0.35)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >
              CFI Mentorship — $999
            </button>
          </div>
          <div style={{ fontSize: 13, color: '#334155' }}>
            Free account · No credit card · Instant access · Secure checkout via Square
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ onLogin }) {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '48px 24px 32px',
      background: 'rgba(0,0,0,0.2)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'space-between', gap: 40, marginBottom: 40,
        }}>
          {/* Brand */}
          <div style={{ maxWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 34, height: 34,
                background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>✈️</div>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>
                Pilot Essentials
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.65 }}>
              FAA Private Pilot online ground school. Structured, AI-powered, and built for modern student pilots.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 60, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 }}>Platform</div>
              {[['Curriculum', 'curriculum'], ['Features', 'features'], ['Pricing', 'pricing']].map(([label, id]) => (
                <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })} style={{
                  display: 'block', background: 'none', border: 'none',
                  fontSize: 14, color: '#475569', cursor: 'pointer',
                  padding: '4px 0', textAlign: 'left', transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.target.style.color = '#94a3b8'}
                  onMouseLeave={e => e.target.style.color = '#475569'}
                >{label}</button>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 }}>Account</div>
              {[['Sign In', onLogin], ['Create Account', onLogin]].map(([label, action]) => (
                <button key={label} onClick={action} style={{
                  display: 'block', background: 'none', border: 'none',
                  fontSize: 14, color: '#475569', cursor: 'pointer',
                  padding: '4px 0', textAlign: 'left', transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.target.style.color = '#94a3b8'}
                  onMouseLeave={e => e.target.style.color = '#475569'}
                >{label}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 24,
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'space-between', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 13, color: '#334155' }}>
            © {new Date().getFullYear()} Pilot Essentials. All rights reserved.
          </span>
          <span style={{ fontSize: 13, color: '#1e293b' }}>
            Not affiliated with the FAA · For educational purposes
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  const goToLogin = () => navigate('/login');
  const goToCheckout = (plan) => navigate(`/checkout?plan=${plan}`);

  return (
    <div style={{ background: '#060f1e', minHeight: '100vh', color: '#f1f5f9' }}>
      <StructuredData />
      <Navbar onLogin={goToLogin} />
      <Hero onLogin={goToLogin} onCheckout={goToCheckout} />
      <StatsBar />
      <CurriculumSection onLogin={goToLogin} />
      <FeaturesSection onLogin={goToLogin} />
      <PricingSection onLogin={goToLogin} onCheckout={goToCheckout} />
      <FAQSection />
      <BottomCTA onLogin={goToLogin} onCheckout={goToCheckout} />
      <Footer onLogin={goToLogin} />
    </div>
  );
}
