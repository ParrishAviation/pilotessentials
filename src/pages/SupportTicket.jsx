import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Send, Loader2, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const SUBJECTS = [
  'Course content question',
  'Technical issue',
  'Billing / payment',
  'Pass Guarantee',
  'Account access',
  'Other',
];

const STATUS_COLORS = {
  open:        { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Open' },
  in_progress: { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', label: 'In Progress' },
  resolved:    { color: '#4ade80', bg: 'rgba(34,197,94,0.12)',  label: 'Resolved' },
};

export default function SupportTicket() {
  const { user: authUser } = useAuth();

  // Form state
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // My tickets
  const [myTickets, setMyTickets] = useState(null);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState(null);

  const displayName = authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || '';

  useEffect(() => {
    if (authUser) loadMyTickets();
  }, [authUser]);

  const loadMyTickets = async () => {
    setTicketsLoading(true);
    const { data } = await supabase
      .from('support_tickets')
      .select('id, subject, message, status, admin_notes, created_at, updated_at')
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false });
    setMyTickets(data || []);
    setTicketsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message.trim()) return;
    setError('');
    setSubmitting(true);

    const { error: insertErr } = await supabase.from('support_tickets').insert({
      user_id: authUser?.id ?? null,
      user_email: authUser?.email ?? null,
      user_name: displayName,
      subject,
      message: message.trim(),
    });

    if (insertErr) {
      setError(`Failed to submit ticket: ${insertErr.message}`);
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
    setSubject('');
    setMessage('');
    loadMyTickets();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="page-container" style={{ padding: '32px 36px', maxWidth: 760 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
        <span style={{ fontSize: 12, color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Help Center</span>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif", margin: '6px 0 8px', letterSpacing: '-0.5px' }}>
          Submit a Support Ticket
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
          Have a question or issue? Send us a message and we'll get back to you.
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 18,
          padding: '28px',
          marginBottom: 32,
        }}
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '20px 0' }}
            >
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <CheckCircle size={28} color="#4ade80" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: '0 0 8px' }}>Ticket Submitted!</h3>
              <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
                We've received your message and will respond as soon as possible.
              </p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit}>
              {/* Subject */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
                  Subject
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
                  {SUBJECTS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSubject(s)}
                      style={{
                        padding: '9px 14px', borderRadius: 9, cursor: 'pointer',
                        fontSize: 13, fontWeight: 600, textAlign: 'center',
                        background: subject === s ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${subject === s ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        color: subject === s ? '#38bdf8' : '#64748b',
                        transition: 'all 0.15s',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Describe your issue or question in detail…"
                  rows={5}
                  required
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#f1f5f9', fontSize: 14, lineHeight: 1.6,
                    outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(56,189,248,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              {error && (
                <div style={{ fontSize: 13, color: '#f87171', marginBottom: 14 }}>{error}</div>
              )}

              <button
                type="submit"
                disabled={!subject || !message.trim() || submitting}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 28px', borderRadius: 10,
                  background: subject && message.trim() && !submitting
                    ? 'linear-gradient(135deg, #0ea5e9, #2563eb)'
                    : 'rgba(255,255,255,0.06)',
                  border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
                  cursor: subject && message.trim() && !submitting ? 'pointer' : 'not-allowed',
                  opacity: subject && message.trim() && !submitting ? 1 : 0.5,
                  transition: 'all 0.15s',
                  boxShadow: subject && message.trim() && !submitting ? '0 4px 20px rgba(14,165,233,0.3)' : 'none',
                }}
              >
                {submitting
                  ? <><Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Sending…</>
                  : <><Send size={15} /> Send Ticket</>
                }
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* My Tickets */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <MessageSquare size={16} color="#64748b" />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#94a3b8', margin: 0 }}>
            My Tickets {myTickets && myTickets.length > 0 && <span style={{ color: '#475569' }}>({myTickets.length})</span>}
          </h2>
        </div>

        {ticketsLoading ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#475569' }}>
            <Loader2 size={22} style={{ animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : !myTickets || myTickets.length === 0 ? (
          <div style={{
            padding: '32px', borderRadius: 14, textAlign: 'center',
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            color: '#334155', fontSize: 14,
          }}>
            No tickets yet. Submit one above if you need help.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {myTickets.map(ticket => {
              const isExpanded = expandedTicket === ticket.id;
              const st = STATUS_COLORS[ticket.status] || STATUS_COLORS.open;
              return (
                <div key={ticket.id} style={{
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isExpanded ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.07)'}`,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}>
                  <div
                    onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', cursor: 'pointer' }}
                  >
                    {/* Status dot */}
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: st.color, flexShrink: 0 }} />

                    {/* Subject */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{ticket.subject}</div>
                      <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                        {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>

                    {/* Status badge */}
                    <div style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                      background: st.bg, color: st.color, flexShrink: 0,
                    }}>
                      {st.label}
                    </div>

                    {isExpanded ? <ChevronUp size={15} color="#475569" /> : <ChevronDown size={15} color="#475569" />}
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 6 }}>Your Message</div>
                          <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{ticket.message}</div>
                        </div>
                        {ticket.admin_notes && (
                          <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.18)' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 6 }}>Response from Support</div>
                            <div style={{ fontSize: 13, color: '#7dd3fc', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{ticket.admin_notes}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
