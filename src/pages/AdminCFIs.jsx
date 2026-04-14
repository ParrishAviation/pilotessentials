import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save, Calendar, Clock, CheckCircle, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SPECIALTIES = ['PPL', 'IFR', 'Commercial', 'CFI', 'Multi-Engine', 'Checkride Prep', 'Ground School'];

function CFIModal({ cfi, onClose, onSave }) {
  const [form, setForm] = useState(cfi || { name: '', title: 'Certified Flight Instructor', bio: '', email: '', photo_url: '', zoom_link: '', specialties: [], active: true, sort_order: 0 });
  const [saving, setSaving] = useState(false);

  const toggleSpecialty = (s) => {
    setForm(f => ({
      ...f,
      specialties: f.specialties.includes(s) ? f.specialties.filter(x => x !== s) : [...f.specialties, s],
    }));
  };

  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);
    let res;
    if (cfi?.id) {
      res = await supabase.from('cfis').update(form).eq('id', cfi.id).select().single();
    } else {
      res = await supabase.from('cfis').insert(form).select().single();
    }
    setSaving(false);
    if (!res.error) onSave(res.data);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(6,15,30,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.93, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 580, background: '#0d1829', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: '32px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
          <X size={15} />
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: '0 0 24px', fontFamily: "'Space Grotesk', sans-serif" }}>{cfi ? 'Edit CFI' : 'Add CFI'}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { key: 'name', label: 'Full Name', placeholder: 'e.g. Captain John Smith' },
            { key: 'title', label: 'Title', placeholder: 'e.g. Certified Flight Instructor' },
            { key: 'email', label: 'Email', placeholder: 'cfi@example.com' },
            { key: 'photo_url', label: 'Photo URL', placeholder: 'https://...' },
            { key: 'zoom_link', label: 'Zoom / Meet Link', placeholder: 'https://zoom.us/j/...' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input value={form[f.key] || ''} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Bio</label>
            <textarea value={form.bio || ''} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} placeholder="Brief bio about this CFI..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#f1f5f9', fontSize: 14, resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 8 }}>Specialties</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SPECIALTIES.map(s => (
                <button key={s} onClick={() => toggleSpecialty(s)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: form.specialties?.includes(s) ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${form.specialties?.includes(s) ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.1)'}`, color: form.specialties?.includes(s) ? '#38bdf8' : '#94a3b8' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} id="active-toggle" style={{ width: 16, height: 16 }} />
            <label htmlFor="active-toggle" style={{ fontSize: 13, color: '#94a3b8', cursor: 'pointer' }}>Active (visible to students)</label>
          </div>
        </div>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={handleSave} disabled={saving || !form.name}
          style={{ width: '100%', marginTop: 24, padding: '13px', borderRadius: 12, background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: !form.name ? 0.5 : 1 }}>
          <Save size={15} /> {saving ? 'Saving...' : 'Save CFI'}
        </motion.button>
      </motion.div>
    </div>
  );
}

function AvailabilityModal({ cfi, onClose }) {
  const [slots, setSlots] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('cfi_availability').select('*').eq('cfi_id', cfi.id).then(({ data }) => {
      setSlots(data || []);
      setLoading(false);
    });
  }, [cfi.id]);

  const addSlot = () => setSlots(s => [...s, { cfi_id: cfi.id, day_of_week: 1, start_time: '09:00', end_time: '17:00', slot_minutes: 60, _new: true, _id: Date.now() }]);

  const removeSlot = async (slot) => {
    if (slot.id) await supabase.from('cfi_availability').delete().eq('id', slot.id);
    setSlots(s => s.filter(x => (x.id || x._id) !== (slot.id || slot._id)));
  };

  const updateSlot = (idx, key, val) => setSlots(s => s.map((slot, i) => i === idx ? { ...slot, [key]: val } : slot));

  const handleSave = async () => {
    setSaving(true);
    const newSlots = slots.filter(s => s._new);
    const existSlots = slots.filter(s => !s._new && s.id);
    await Promise.all([
      newSlots.length && supabase.from('cfi_availability').insert(newSlots.map(({ _new, _id, ...rest }) => rest)),
      ...existSlots.map(({ _new, _id, ...rest }) => supabase.from('cfi_availability').update(rest).eq('id', rest.id)),
    ]);
    setSaving(false);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(6,15,30,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ width: '100%', maxWidth: 560, background: '#0d1829', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: '32px', maxHeight: '85vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
          <X size={15} />
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px', fontFamily: "'Space Grotesk', sans-serif" }}>Availability — {cfi.name}</h2>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 20px' }}>Set recurring weekly time blocks. Students book within these windows.</p>

        {loading ? <div style={{ color: '#475569', textAlign: 'center', padding: '20px 0' }}>Loading...</div> : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {slots.map((slot, i) => (
                <div key={slot.id || slot._id} style={{ display: 'grid', gridTemplateColumns: '130px 90px 90px 80px auto', gap: 8, alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 12px' }}>
                  <select value={slot.day_of_week} onChange={e => updateSlot(i, 'day_of_week', parseInt(e.target.value))}
                    style={{ padding: '7px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#f1f5f9', fontSize: 13, outline: 'none' }}>
                    {DAY_FULL.map((d, idx) => <option key={idx} value={idx}>{d}</option>)}
                  </select>
                  <input type="time" value={slot.start_time} onChange={e => updateSlot(i, 'start_time', e.target.value)}
                    style={{ padding: '7px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#f1f5f9', fontSize: 13, outline: 'none' }} />
                  <input type="time" value={slot.end_time} onChange={e => updateSlot(i, 'end_time', e.target.value)}
                    style={{ padding: '7px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#f1f5f9', fontSize: 13, outline: 'none' }} />
                  <select value={slot.slot_minutes} onChange={e => updateSlot(i, 'slot_minutes', parseInt(e.target.value))}
                    style={{ padding: '7px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#f1f5f9', fontSize: 12, outline: 'none' }}>
                    {[30, 60, 90].map(m => <option key={m} value={m}>{m}min</option>)}
                  </select>
                  <button onClick={() => removeSlot(slot)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '7px 9px', cursor: 'pointer', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addSlot} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.15)', color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 20 }}>
              <Plus size={14} /> Add Time Block
            </button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
              style={{ width: '100%', padding: '13px', borderRadius: 12, background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Save size={15} /> {saving ? 'Saving...' : 'Save Availability'}
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function AdminCFIs() {
  const [cfis, setCfis] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cfiModal, setCfiModal] = useState(null);
  const [availModal, setAvailModal] = useState(null);
  const [tab, setTab] = useState('cfis');

  const load = async () => {
    const [cfiRes, bookRes] = await Promise.all([
      supabase.from('cfis').select('*').order('sort_order'),
      supabase.from('cfi_bookings').select('*, cfis(name)').order('scheduled_at', { ascending: false }).limit(50),
    ]);
    setCfis(cfiRes.data || []);
    setBookings(bookRes.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this CFI?')) return;
    await supabase.from('cfis').delete().eq('id', id);
    setCfis(prev => prev.filter(c => c.id !== id));
  };

  const handleBookingStatus = async (id, status) => {
    await supabase.from('cfi_bookings').update({ status }).eq('id', id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#22c55e', cancelled: '#f87171' };

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>CFI Management</h1>
          <p style={{ fontSize: 13, color: '#475569', margin: '4px 0 0' }}>Manage instructors, availability, and bookings</p>
        </div>
        {tab === 'cfis' && (
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setCfiModal({})}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            <Plus size={16} /> Add CFI
          </motion.button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {[{ key: 'cfis', label: `Instructors (${cfis.length})` }, { key: 'bookings', label: `Bookings (${bookings.length})` }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', background: tab === t.key ? 'rgba(56,189,248,0.15)' : 'transparent', color: tab === t.key ? '#38bdf8' : '#64748b', transition: 'all 0.15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>Loading...</div> : (
        <>
          {tab === 'cfis' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {cfis.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍✈️</div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>No CFIs yet</div>
                  <button onClick={() => setCfiModal({})} className="btn-primary" style={{ padding: '12px 24px', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 14 }}>Add First CFI →</button>
                </div>
              ) : cfis.map((cfi, i) => (
                <motion.div key={cfi.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '22px', position: 'relative' }}>
                  {!cfi.active && (
                    <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 700, color: '#f87171', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 20, padding: '2px 8px' }}>INACTIVE</div>
                  )}
                  <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                    {cfi.photo_url ? (
                      <img src={cfi.photo_url} alt={cfi.name} style={{ width: 52, height: 52, borderRadius: 14, objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(56,189,248,0.3)' }} />
                    ) : (
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(56,189,248,0.15)', border: '2px solid rgba(56,189,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <User size={22} color="#38bdf8" />
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{cfi.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{cfi.title}</div>
                      {cfi.email && <div style={{ fontSize: 12, color: '#38bdf8', marginTop: 2 }}>{cfi.email}</div>}
                    </div>
                  </div>
                  {cfi.bio && <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, margin: '0 0 12px' }}>{cfi.bio}</p>}
                  {cfi.specialties?.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                      {cfi.specialties.map(s => (
                        <span key={s} style={{ fontSize: 11, color: '#818cf8', background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.25)', borderRadius: 20, padding: '2px 9px', fontWeight: 600 }}>{s}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setAvailModal(cfi)} style={{ flex: 1, padding: '8px', borderRadius: 9, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa', cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                      <Clock size={13} /> Availability
                    </button>
                    <button onClick={() => setCfiModal(cfi)} style={{ padding: '8px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(cfi.id)} style={{ padding: '8px 10px', borderRadius: 9, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {tab === 'bookings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>No bookings yet</div>
              ) : bookings.map((b, i) => (
                <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${STATUS_COLORS[b.status]}22`, border: `1px solid ${STATUS_COLORS[b.status]}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Calendar size={16} color={STATUS_COLORS[b.status]} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{b.student_name}</span>
                      <span style={{ fontSize: 11, color: '#64748b' }}>with {b.cfis?.name || 'CFI'}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLORS[b.status], background: `${STATUS_COLORS[b.status]}18`, borderRadius: 20, padding: '2px 9px' }}>{b.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
                      {new Date(b.scheduled_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      {' · '}{new Date(b.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      {b.topic && ` · ${b.topic}`}
                    </div>
                    {b.student_email && <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>{b.student_email}</div>}
                  </div>
                  {b.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => handleBookingStatus(b.id, 'confirmed')} style={{ padding: '7px 14px', borderRadius: 9, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle size={13} /> Confirm
                      </button>
                      <button onClick={() => handleBookingStatus(b.id, 'cancelled')} style={{ padding: '7px 12px', borderRadius: 9, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                        Cancel
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {cfiModal !== null && <CFIModal cfi={Object.keys(cfiModal).length ? cfiModal : null} onClose={() => setCfiModal(null)} onSave={(saved) => { setCfis(prev => { const idx = prev.findIndex(c => c.id === saved.id); if (idx >= 0) { const n = [...prev]; n[idx] = saved; return n; } return [saved, ...prev]; }); setCfiModal(null); }} />}
        {availModal && <AvailabilityModal cfi={availModal} onClose={() => setAvailModal(null)} />}
      </AnimatePresence>
    </div>
  );
}
