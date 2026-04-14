import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Send, Edit2, Trash2, X, Mail, Users, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SEGMENTS = [
  { value: 'all', label: 'All Users', desc: 'Every registered student' },
  { value: 'free', label: 'Free Plan Only', desc: 'Students on free plan — upsell opportunity' },
  { value: 'paid', label: 'Paid Students', desc: 'Full access or CFI mentorship students' },
  { value: 'cfi', label: 'CFI Mentorship', desc: 'Students with CFI mentorship plan' },
];

const STATUS_STYLES = {
  draft: { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.25)', label: 'Draft' },
  sent: { color: '#4ade80', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.25)', label: 'Sent' },
  scheduled: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', label: 'Scheduled' },
};

function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.draft;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 20, padding: '3px 10px' }}>
      {s.label}
    </span>
  );
}

function CampaignModal({ campaign, onClose, onSave }) {
  const [form, setForm] = useState(campaign || { name: '', subject: '', body_html: '', segment: 'all', status: 'draft' });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleSave = async (asDraft = true) => {
    if (!form.name || !form.subject || !form.body_html) return;
    setSaving(true);
    const payload = { ...form, status: asDraft ? 'draft' : form.status, updated_at: new Date().toISOString() };
    let res;
    if (campaign?.id) {
      res = await supabase.from('email_campaigns').update(payload).eq('id', campaign.id).select().single();
    } else {
      res = await supabase.from('email_campaigns').insert(payload).select().single();
    }
    setSaving(false);
    if (!res.error) onSave(res.data);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(6,15,30,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 680, background: '#0d1829', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: '32px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
          <X size={15} />
        </button>

        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: '0 0 24px', fontFamily: "'Space Grotesk', sans-serif" }}>
          {campaign ? 'Edit Campaign' : 'New Campaign'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Name */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Campaign Name</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Welcome to Pilot Essentials"
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Subject */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Email Subject</label>
            <input
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              placeholder="e.g. ✈️ Your pilot journey starts here"
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Segment */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 8 }}>Audience Segment</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {SEGMENTS.map(s => (
                <div key={s.value} onClick={() => setForm(f => ({ ...f, segment: s.value }))} style={{ padding: '12px 14px', borderRadius: 10, cursor: 'pointer', background: form.segment === s.value ? 'rgba(56,189,248,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${form.segment === s.value ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.08)'}`, transition: 'all 0.15s' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: form.segment === s.value ? '#38bdf8' : '#f1f5f9' }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8 }}>Email Body (HTML or plain text)</label>
              <button onClick={() => setPreview(v => !v)} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Eye size={13} /> {preview ? 'Edit' : 'Preview'}
              </button>
            </div>
            {preview ? (
              <div style={{ padding: '16px', borderRadius: 10, background: '#fff', color: '#111', fontSize: 14, lineHeight: 1.6, minHeight: 160, maxHeight: 300, overflowY: 'auto' }}
                dangerouslySetInnerHTML={{ __html: form.body_html }} />
            ) : (
              <textarea
                value={form.body_html}
                onChange={e => setForm(f => ({ ...f, body_html: e.target.value }))}
                placeholder={`<p>Hi there,</p>\n<p>Your message here...</p>\n<p>Blue skies,<br/>The Pilot Essentials Team</p>`}
                rows={8}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#f1f5f9', fontSize: 13, lineHeight: 1.6, resize: 'vertical', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }}
              />
            )}
            <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
              Tip: Use <code style={{ color: '#7dd3fc' }}>{'{{name}}'}</code> for the student's name.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={() => handleSave(true)} disabled={saving} style={{ flex: 1, padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            Save Draft
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => handleSave(false)}
            disabled={saving || !form.name || !form.subject || !form.body_html}
            style={{ flex: 2, padding: '12px', borderRadius: 10, background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: !form.name || !form.subject || !form.body_html ? 0.5 : 1 }}
          >
            {saving ? 'Saving...' : '✓ Save Campaign'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [sending, setSending] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    const { data } = await supabase.from('email_campaigns').select('*').order('created_at', { ascending: false });
    setCampaigns(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = (campaign) => {
    setCampaigns(prev => {
      const idx = prev.findIndex(c => c.id === campaign.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = campaign; return next; }
      return [campaign, ...prev];
    });
    setModalOpen(false);
    setEditing(null);
    showToast('Campaign saved');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this campaign?')) return;
    await supabase.from('email_campaigns').delete().eq('id', id);
    setCampaigns(prev => prev.filter(c => c.id !== id));
    showToast('Campaign deleted');
  };

  const handleSend = async (campaign) => {
    if (!confirm(`Send "${campaign.name}" to all ${campaign.segment} users now?`)) return;
    setSending(campaign.id);
    try {
      const res = await fetch('/api/send-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: campaign.id }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      await supabase.from('email_campaigns').update({ status: 'sent', sent_at: new Date().toISOString(), send_count: json.count || 0 }).eq('id', campaign.id);
      setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, status: 'sent', sent_at: new Date().toISOString(), send_count: json.count || 0 } : c));
      showToast(`Sent to ${json.count} recipients 🎉`);
    } catch (e) {
      showToast(e.message, 'error');
    }
    setSending(null);
  };

  return (
    <div style={{ padding: '32px 36px', maxWidth: 960 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>Email Campaigns</h1>
          <p style={{ fontSize: 13, color: '#475569', margin: '4px 0 0' }}>Create, manage, and send email campaigns via Resend</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setEditing(null); setModalOpen(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
        >
          <Plus size={16} /> New Campaign
        </motion.button>
      </div>

      {/* Tips row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { icon: '🎯', title: 'Segment your list', desc: 'Target free users to convert, or paid users to retain.' },
          { icon: '✍️', title: 'Write in HTML', desc: 'Use HTML for rich formatting, or plain text for personal tone.' },
          { icon: '📊', title: 'Track sends', desc: 'Send count is tracked per campaign. Webhook tracking coming soon.' },
        ].map((tip, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20 }}>{tip.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{tip.title}</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{tip.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>Loading campaigns...</div>
      ) : campaigns.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>No campaigns yet</div>
          <div style={{ fontSize: 13, color: '#475569', marginBottom: 20 }}>Create your first campaign to reach your students.</div>
          <button onClick={() => setModalOpen(true)} className="btn-primary" style={{ padding: '12px 24px', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 14 }}>
            Create Campaign →
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {campaigns.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={18} color="#38bdf8" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{c.name}</span>
                  <StatusPill status={c.status} />
                </div>
                <div style={{ fontSize: 13, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.subject}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 5, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Users size={11} /> {SEGMENTS.find(s => s.value === c.segment)?.label || c.segment}
                  </span>
                  {c.send_count > 0 && <span style={{ fontSize: 11, color: '#4ade80' }}>✓ Sent to {c.send_count}</span>}
                  {c.sent_at && <span style={{ fontSize: 11, color: '#475569' }}>{new Date(c.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => { setEditing(c); setModalOpen(true); }} style={{ padding: '7px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600 }}>
                  <Edit2 size={13} /> Edit
                </button>
                {c.status !== 'sent' && (
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => handleSend(c)}
                    disabled={sending === c.id}
                    style={{ padding: '7px 14px', borderRadius: 9, background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.35)', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, opacity: sending === c.id ? 0.6 : 1 }}>
                    <Send size={13} /> {sending === c.id ? 'Sending...' : 'Send Now'}
                  </motion.button>
                )}
                <button onClick={() => handleDelete(c.id)} style={{ padding: '7px 10px', borderRadius: 9, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && <CampaignModal campaign={editing} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={handleSave} />}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, padding: '12px 20px', borderRadius: 12, background: toast.type === 'error' ? 'rgba(239,68,68,0.9)' : 'rgba(34,197,94,0.9)', color: '#fff', fontSize: 14, fontWeight: 600, backdropFilter: 'blur(8px)' }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
