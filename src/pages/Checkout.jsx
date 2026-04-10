import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Lock, ArrowLeft, Plane, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PLANS = {
  full_access: {
    name: 'Full Access',
    price: '$399',
    amountCents: 39900,
    color: '#38bdf8',
    gradient: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
    badge: 'MOST POPULAR',
    badgeColor: '#0ea5e9',
    features: [
      'All 17 chapters + video lessons',
      'AI Flight Instructor (unlimited)',
      'Instant AI study guides — every lesson',
      '1,000+ FAA practice questions',
      '60-question randomized final exam',
      'XP, badges & leaderboard',
      'ACS checkride prep guide',
      'Lifetime access — new content free',
    ],
  },
  cfi_mentorship: {
    name: 'CFI Mentorship',
    price: '$999',
    amountCents: 99900,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    badge: 'CFI MENTORSHIP',
    badgeColor: '#f59e0b',
    features: [
      'Everything in Full Access',
      '12-month live CFI chat room access',
      'Ask real CFIs your questions daily',
      'Exclusive 7-page expert study guide',
      'CFI-reviewed study sessions',
      'Small-group mentorship community',
    ],
  },
};

const SQUARE_APP_ID = import.meta.env.VITE_SQUARE_APP_ID;
const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID;

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const planKey = searchParams.get('plan') || 'full_access';
  const plan = PLANS[planKey] || PLANS.full_access;

  const [cardReady, setCardReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sqCard, setSqCard] = useState(null);

  const cardContainerRef = useRef(null);
  const paymentsRef = useRef(null);

  // Load Square Web Payments SDK
  useEffect(() => {
    if (!SQUARE_APP_ID || !SQUARE_LOCATION_ID) {
      setError('Payment configuration error. Please contact support.');
      return;
    }

    let destroyed = false;
    let cardInstance = null;

    const initSquare = async () => {
      // Poll until window.Square is available (handles script-already-exists case)
      let attempts = 0;
      while (!window.Square && attempts < 40) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
      }
      if (destroyed) return;
      if (!window.Square) {
        setError('Payment SDK failed to load. Please refresh.');
        return;
      }

      try {
        const payments = window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
        paymentsRef.current = payments;

        const card = await payments.card({
          style: {
            '.input-container': {
              borderColor: 'rgba(255,255,255,0.2)',
            },
            '.input-container.is-focus': {
              borderColor: '#38bdf8',
            },
            '.input-container.is-error': {
              borderColor: '#f87171',
            },
            input: {
              color: '#ffffff',
            },
          },
        });

        if (destroyed) { card.destroy(); return; }
        await card.attach('#sq-card-container');
        cardInstance = card;
        setSqCard(card);
        setCardReady(true);
      } catch (err) {
        console.error('Square init error:', err);
        // Surface the actual Square error message to help diagnose domain/config issues
        const msg = err?.message || JSON.stringify(err) || 'Unknown error';
        setError(`Payment form error: ${msg}`);
      }
    };

    const scriptId = 'square-web-sdk';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://web.squarecdn.com/v1/square.js';
      script.onerror = () => setError('Failed to load Square SDK. Check your connection.');
      document.head.appendChild(script);
    }
    // Always use the polling init (handles both fresh load and already-existing script)
    initSquare();

    return () => {
      destroyed = true;
      cardInstance?.destroy?.();
    };
  }, [planKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sqCard || !cardReady) return;
    if (!user) {
      navigate(`/login?redirect=/checkout?plan=${planKey}`);
      return;
    }

    setError('');
    setProcessing(true);

    try {
      // Tokenize the card
      const result = await sqCard.tokenize();
      if (result.status !== 'OK') {
        const msgs = result.errors?.map(e => e.message).join('. ') || 'Card error';
        setError(msgs);
        setProcessing(false);
        return;
      }

      // Send token to our API
      const res = await fetch('/api/square-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: result.token,
          plan: planKey,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Payment failed. Please try again.');
        setProcessing(false);
        return;
      }

      // Success!
      setSuccess(true);
      setTimeout(() => navigate('/app'), 3000);

    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred. Please try again.');
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div style={{
        minHeight: '100vh', background: '#060f1e',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          style={{
            textAlign: 'center', maxWidth: 480,
            background: 'rgba(52,211,153,0.08)',
            border: '1px solid rgba(52,211,153,0.25)',
            borderRadius: 24, padding: '56px 40px',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(52,211,153,0.15)',
              border: '2px solid rgba(52,211,153,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px', fontSize: 40,
            }}
          >✅</motion.div>
          <h2 style={{ color: '#f1f5f9', fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
            Welcome to Pilot Essentials!
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, marginBottom: 8 }}>
            Your {plan.name} is now active. Redirecting you to your dashboard...
          </p>
          <p style={{ color: '#34d399', fontSize: 14, fontWeight: 600 }}>
            ✈️ Time to ace your FAA written test!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#060f1e',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '0 0 80px',
    }}>
      {/* Nav */}
      <nav style={{
        padding: '0 24px',
        background: 'rgba(6,15,30,0.97)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 62,
        }}>
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
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
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#34d399', fontSize: 13, fontWeight: 600 }}>
            <Lock size={13} /> Secure Checkout
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px 0' }}>
        {/* Back */}
        <button
          onClick={() => navigate('/#pricing')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#64748b', fontSize: 14, fontWeight: 600, marginBottom: 32,
          }}
        >
          <ArrowLeft size={14} /> Back to pricing
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 32, alignItems: 'start',
        }}>

          {/* Left — Order Summary */}
          <div>
            <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 800, marginBottom: 24 }}>
              Order Summary
            </h2>

            {/* Plan card */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: `2px solid ${plan.color}33`,
              borderRadius: 16, padding: '24px 22px', marginBottom: 24,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -12, left: 20,
                background: plan.gradient,
                color: '#fff', fontSize: 11, fontWeight: 800,
                padding: '3px 14px', borderRadius: 100, letterSpacing: 0.5,
              }}>{plan.badge}</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <p style={{ color: plan.color, fontWeight: 800, fontSize: 16, marginBottom: 2 }}>{plan.name}</p>
                  <p style={{ color: '#64748b', fontSize: 13 }}>One-time payment — lifetime access</p>
                </div>
                <span style={{ color: '#f1f5f9', fontWeight: 900, fontSize: 28, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {plan.price}
                </span>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                {plan.features.map((f, i) => (
                  <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                    <CheckCircle size={15} color={i === 0 && planKey === 'cfi_mentorship' ? '#64748b' : plan.color} style={{ marginTop: 1, flexShrink: 0 }} />
                    <span style={{ color: i === 0 && planKey === 'cfi_mentorship' ? '#64748b' : '#e2e8f0', fontSize: 14, lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Switch plan */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: '14px 18px',
            }}>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Or choose a different plan:</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {Object.entries(PLANS).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => navigate(`/checkout?plan=${key}`)}
                    style={{
                      flex: 1, padding: '8px 12px', borderRadius: 8,
                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      border: key === planKey ? `1px solid ${p.color}` : '1px solid rgba(255,255,255,0.08)',
                      background: key === planKey ? `${p.color}18` : 'rgba(255,255,255,0.02)',
                      color: key === planKey ? p.color : '#64748b',
                    }}
                  >
                    {p.name}<br />
                    <span style={{ fontWeight: 800, fontSize: 15 }}>{p.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 20, marginTop: 24, flexWrap: 'wrap' }}>
              {[
                { icon: '🔒', label: 'SSL Encrypted' },
                { icon: '✅', label: 'Square Secured' },
                { icon: '♾️', label: 'Lifetime Access' },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: 12, fontWeight: 600 }}>
                  <span>{icon}</span> {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Payment Form */}
          <div>
            <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 800, marginBottom: 24 }}>
              Payment Details
            </h2>

            {/* Login reminder */}
            {!user && (
              <div style={{
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.25)',
                borderRadius: 12, padding: '14px 16px', marginBottom: 20,
                display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <AlertCircle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ color: '#fde68a', fontSize: 14, lineHeight: 1.5, margin: 0 }}>
                  You must be signed in to complete your purchase.{' '}
                  <Link to={`/login?redirect=/checkout?plan=${planKey}`} style={{ color: '#f59e0b', fontWeight: 700 }}>
                    Sign in or create a free account →
                  </Link>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Card container — Square mounts here */}
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block', fontSize: 12, fontWeight: 700,
                  color: '#94a3b8', marginBottom: 8,
                  textTransform: 'uppercase', letterSpacing: 0.5,
                }}>
                  Card Information
                </label>
                <div
                  id="sq-card-container"
                  ref={cardContainerRef}
                  style={{
                    minHeight: 89,
                    background: '#0f1f38',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}
                />
                {!cardReady && !error && (
                  <p style={{ color: '#475569', fontSize: 13, marginTop: 8 }}>
                    Loading secure payment form...
                  </p>
                )}
              </div>

              {/* Error display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      padding: '12px 16px', borderRadius: 10, marginBottom: 16,
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      display: 'flex', gap: 10, alignItems: 'flex-start',
                    }}
                  >
                    <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ color: '#f87171', fontSize: 14, margin: 0, lineHeight: 1.5 }}>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Order total */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 16px', marginBottom: 16,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10,
              }}>
                <span style={{ color: '#94a3b8', fontSize: 15, fontWeight: 600 }}>Total due today</span>
                <span style={{ color: '#f1f5f9', fontWeight: 900, fontSize: 22, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {plan.price}
                </span>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={!cardReady || processing || !user}
                whileHover={cardReady && !processing && user ? { scale: 1.02 } : {}}
                whileTap={cardReady && !processing && user ? { scale: 0.98 } : {}}
                style={{
                  width: '100%', padding: '16px',
                  background: !cardReady || !user ? 'rgba(255,255,255,0.06)' : plan.gradient,
                  border: 'none', borderRadius: 12,
                  color: !cardReady || !user ? '#64748b' : '#fff',
                  fontSize: 16, fontWeight: 800,
                  cursor: !cardReady || processing || !user ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: cardReady && user ? '0 6px 24px rgba(14,165,233,0.3)' : 'none',
                  transition: 'all 0.2s',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {processing ? (
                  <>
                    <span style={{
                      width: 18, height: 18,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff', borderRadius: '50%',
                      display: 'inline-block', animation: 'spin 0.8s linear infinite',
                    }} />
                    Processing payment...
                  </>
                ) : !user ? (
                  'Sign in to complete purchase'
                ) : (
                  <>
                    <Lock size={16} />
                    Pay {plan.price} — Get Instant Access
                  </>
                )}
              </motion.button>

              <p style={{ color: '#334155', fontSize: 12, textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
                Payments are processed securely by Square. Your card details never touch our servers.
                By completing your purchase you agree to our Terms of Service.
              </p>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Force Square iframe to use dark background + high-contrast text */
        #sq-card-container iframe {
          background: #0f1f38 !important;
          color-scheme: dark;
        }
        #sq-card-container .sq-card-wrapper,
        #sq-card-container .sq-card-component {
          background: #0f1f38 !important;
        }
      `}</style>
    </div>
  );
}
