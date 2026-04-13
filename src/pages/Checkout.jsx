import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom'; // Link used in nav
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Lock, ArrowLeft, AlertCircle, Tag, X } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PLANS = {
  basic_access: {
    name: 'Basic Access',
    price: '$299',
    amountCents: 29900,
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    badge: 'SELF-STUDY',
    features: [
      'All 17 chapters + video lessons',
      'AI Flight Instructor (unlimited)',
      'Instant study guides — every lesson',
      '1,000+ FAA practice questions',
      '60-question randomized final exam',
      'XP, badges & leaderboard',
      'ACS checkride prep guide',
      'Lifetime access — new content free',
    ],
  },
  full_access: {
    name: 'Full Access',
    price: '$399',
    amountCents: 39900,
    color: '#38bdf8',
    gradient: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
    badge: 'MOST POPULAR',
    features: [
      'Everything in Basic Access',
      '✈️ Pass Guarantee — retake covered if you don\'t pass',
      'Priority email support',
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

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#f1f5f9',
      fontSize: '15px',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': { color: '#475569' },
      iconColor: '#64748b',
    },
    invalid: {
      color: '#f87171',
      iconColor: '#f87171',
    },
  },
};

function PaymentForm({ plan, planKey }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useAuth(); // may be null for guests

  // Contact fields
  const [firstName, setFirstName] = useState(user?.user_metadata?.full_name?.split(' ')[0] || '');
  const [lastName, setLastName]   = useState(user?.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail]         = useState(user?.email || '');
  const [phone, setPhone]         = useState('');

  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

  const [processing, setProcessing]     = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  // Discount code state
  const [discountInput, setDiscountInput]   = useState('');
  const [appliedCode, setAppliedCode]       = useState(null);
  const [discountError, setDiscountError]   = useState('');
  const [discountChecking, setDiscountChecking] = useState(false);

  const isFree     = appliedCode?.discountPct === 100;
  const finalPrice = isFree ? '$0' : plan.price;

  // Field validation
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const formValid  = firstName.trim() && lastName.trim() && emailValid && phone.trim() && (isFree || cardComplete);

  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) return;
    setDiscountError('');
    setDiscountChecking(true);
    try {
      const res = await fetch('/api/stripe-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'validate_discount', discountCode: discountInput.trim() }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCode({ code: discountInput.trim(), discountPct: data.discountPct });
        setDiscountInput('');
      } else {
        setDiscountError(data.error || 'Invalid discount code.');
      }
    } catch {
      setDiscountError('Could not validate code. Try again.');
    } finally {
      setDiscountChecking(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedCode(null);
    setDiscountError('');
    setDiscountInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return;

    setError('');
    setProcessing(true);

    // Shared contact payload — use logged-in userId if available
    const contact = {
      name: fullName,
      email: email.trim(),
      phone: phone.trim(),
      userId: user?.id || undefined,
    };

    try {
      // ── Free checkout via 100% discount code ─────────────────────────────
      if (isFree) {
        const res = await fetch('/api/stripe-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'free_purchase', plan: planKey, discountCode: appliedCode.code, ...contact }),
        });
        const data = await res.json();
        if (!res.ok || data.error) { setError(data.error || 'Failed to apply discount.'); setProcessing(false); return; }
        setSuccess(true);
        const isGuest = !user;
        setTimeout(() => { window.location.href = `https://www.mypilotessentials.com/thank-you?plan=${planKey}${isGuest ? '&guest=1' : ''}`; }, 1500);
        return;
      }

      // ── Normal Stripe card payment ────────────────────────────────────────
      if (!stripe || !elements) return;

      // Step 1: Create PaymentIntent
      const createRes = await fetch('/api/stripe-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', plan: planKey, email: email.trim() }),
      });
      const createData = await createRes.json();
      if (!createRes.ok || createData.error) { setError(createData.error || 'Failed to initialize payment.'); setProcessing(false); return; }

      // Step 2: Confirm card with Stripe.js
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        createData.clientSecret,
        { payment_method: { card: elements.getElement(CardElement), billing_details: { name: fullName, email: email.trim(), phone: phone.trim() } } }
      );
      if (stripeError) { setError(stripeError.message || 'Payment failed.'); setProcessing(false); return; }

      // Step 3: Confirm + create account + record purchase
      if (paymentIntent.status === 'succeeded') {
        await fetch('/api/stripe-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'confirm', plan: planKey, paymentIntentId: paymentIntent.id, ...contact }),
        });
        setSuccess(true);
        const isGuest = !user;
        setTimeout(() => { window.location.href = `https://www.mypilotessentials.com/thank-you?plan=${planKey}${isGuest ? '&guest=1' : ''}`; }, 1500);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred. Please try again.');
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ textAlign: 'center', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 20, padding: '48px 32px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px', background: 'rgba(52,211,153,0.15)', border: '2px solid rgba(52,211,153,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>✅</div>
        <h2 style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 800, marginBottom: 10 }}>Payment confirmed!</h2>
        <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7 }}>Setting up your account and redirecting…</p>
      </motion.div>
    );
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)',
    color: '#f1f5f9', outline: 'none', fontFamily: 'Inter, system-ui, sans-serif',
    boxSizing: 'border-box',
  };
  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 700,
    color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5,
  };

  return (
    <form onSubmit={handleSubmit}>

      {/* ── Contact fields ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>First Name</label>
          <input
            type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
            placeholder="Jane" required style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Last Name</label>
          <input
            type="text" value={lastName} onChange={e => setLastName(e.target.value)}
            placeholder="Smith" required style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="jane@example.com" required style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Phone Number</label>
          <input
            type="tel" value={phone} onChange={e => setPhone(e.target.value)}
            placeholder="(555) 000-0000" required style={inputStyle}
          />
        </div>
      </div>

      {/* ── Card — hidden when free ── */}
      {!isFree && (
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Card Information</label>
          <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10 }}>
            <CardElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={e => { setCardComplete(e.complete); setError(e.error ? e.error.message : ''); }}
            />
          </div>
        </div>
      )}

      {/* ── Discount Code ── */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Discount Code</label>
        {appliedCode ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', borderRadius: 10, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tag size={14} color="#34d399" />
              <span style={{ color: '#34d399', fontWeight: 700, fontSize: 14 }}>{appliedCode.code}</span>
              <span style={{ color: '#64748b', fontSize: 13 }}>— {appliedCode.discountPct === 100 ? '100% off' : `${appliedCode.discountPct}% off`}</span>
            </div>
            <button type="button" onClick={handleRemoveDiscount} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 4 }}>
              <X size={15} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text" value={discountInput}
              onChange={e => { setDiscountInput(e.target.value); setDiscountError(''); }}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleApplyDiscount())}
              placeholder="Enter code" style={{ ...inputStyle, flex: 1, border: `1px solid ${discountError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.12)'}` }}
            />
            <button type="button" onClick={handleApplyDiscount} disabled={!discountInput.trim() || discountChecking}
              style={{ padding: '11px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: !discountInput.trim() || discountChecking ? 'not-allowed' : 'pointer', background: discountInput.trim() ? 'rgba(56,189,248,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${discountInput.trim() ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.08)'}`, color: discountInput.trim() ? '#38bdf8' : '#475569', whiteSpace: 'nowrap' }}>
              {discountChecking ? '…' : 'Apply'}
            </button>
          </div>
        )}
        <AnimatePresence>
          {discountError && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ color: '#f87171', fontSize: 13, marginTop: 6 }}>
              {discountError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Error ── */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: '#f87171', fontSize: 14, margin: 0, lineHeight: 1.5 }}>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Total ── */}
      <div style={{ padding: '14px 16px', marginBottom: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#94a3b8', fontSize: 15, fontWeight: 600 }}>Total due today</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {appliedCode && <span style={{ color: '#64748b', fontSize: 16, fontWeight: 600, textDecoration: 'line-through', fontFamily: "'Space Grotesk', sans-serif" }}>{plan.price}</span>}
            <span style={{ color: isFree ? '#34d399' : '#f1f5f9', fontWeight: 900, fontSize: 22, fontFamily: "'Space Grotesk', sans-serif" }}>{finalPrice}</span>
          </div>
        </div>
        {isFree && <p style={{ color: '#34d399', fontSize: 12, fontWeight: 600, marginTop: 4 }}>✓ Discount code applied — full access at no charge</p>}
      </div>

      {/* ── Submit ── */}
      <motion.button
        type="submit" disabled={!formValid || processing}
        whileHover={formValid && !processing ? { scale: 1.02 } : {}}
        whileTap={formValid && !processing ? { scale: 0.98 } : {}}
        style={{
          width: '100%', padding: '16px',
          background: !formValid || processing ? 'rgba(255,255,255,0.06)' : isFree ? 'linear-gradient(135deg, #059669, #10b981)' : plan.gradient,
          border: 'none', borderRadius: 12,
          color: !formValid || processing ? '#64748b' : '#fff',
          fontSize: 16, fontWeight: 800,
          cursor: !formValid || processing ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: formValid && !processing ? (isFree ? '0 6px 24px rgba(16,185,129,0.3)' : '0 6px 24px rgba(14,165,233,0.25)') : 'none',
          transition: 'all 0.2s', fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {processing ? (
          <><span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />{isFree ? 'Activating access…' : 'Processing payment…'}</>
        ) : isFree ? (
          <><CheckCircle size={16} />Activate Free Access</>
        ) : (
          <><Lock size={16} />Pay {plan.price} — Get Instant Access</>
        )}
      </motion.button>

      <p style={{ color: '#334155', fontSize: 12, textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
        Payments processed securely by Stripe. Your card details never touch our servers.
        By completing your purchase you agree to our Terms of Service.
      </p>
    </form>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const planKey = searchParams.get('plan') || 'full_access';
  const plan = PLANS[planKey] || PLANS.full_access;

  return (
    <div style={{
      minHeight: '100vh', background: '#060f1e',
      fontFamily: 'Inter, system-ui, sans-serif', padding: '0 0 80px',
    }}>
      {/* Nav */}
      <nav style={{
        padding: '0 24px',
        background: 'rgba(6,15,30,0.97)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#34d399', fontSize: 13, fontWeight: 600 }}>
            <Lock size={13} /> Secure Checkout
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px 0' }}>
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
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
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
                { icon: '✅', label: 'Stripe Secured' },
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
            <Elements stripe={stripePromise}>
              <PaymentForm plan={plan} planKey={planKey} />
            </Elements>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
