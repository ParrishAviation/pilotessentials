import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle, X, ChevronLeft, ChevronRight, Video } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const TOPICS = [
  'General Q&A / Lesson Review',
  'Checkride Preparation',
  'Weak Topic Deep Dive',
  'Flight Planning',
  'Weather Briefing Practice',
  'Instrument Procedures',
  'Emergency Procedures',
  'Navigation Review',
  'Regulations & Airspace',
  'Other',
];

function generateSlots(availability, existingBookings, year, month) {
  const slots = [];
  const bookedTimes = new Set(existingBookings.map(b => new Date(b.scheduled_at).toISOString()));

  // Get all days in this month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dow = date.getDay();
    const avail = availability.filter(a => a.day_of_week === dow);

    avail.forEach(a => {
      // Generate slots from start_time to end_time in slot_minutes increments
      const [sh, sm] = a.start_time.split(':').map(Number);
      const [eh, em] = a.end_time.split(':').map(Number);
      let cur = sh * 60 + sm;
      const end = eh * 60 + em;

      while (cur + a.slot_minutes <= end) {
        const slotDate = new Date(year, month, day, Math.floor(cur / 60), cur % 60);
        if (slotDate > new Date()) {
          const iso = slotDate.toISOString();
          if (!bookedTimes.has(iso)) {
            slots.push({ date: slotDate, iso, duration: a.slot_minutes });
          }
        }
        cur += a.slot_minutes;
      }
    });
  }
  return slots;
}

function BookingModal({ cfi, slot, onClose, onBooked }) {
  const { user: authUser } = useAuth();
  const [form, setForm] = useState({ student_name: '', student_email: authUser?.email || '', topic: TOPICS[0], notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleBook = async () => {
    if (!form.student_name || !form.student_email) return;
    setSubmitting(true);
    const { data, error } = await supabase.from('cfi_bookings').insert({
      cfi_id: cfi.id,
      student_id: authUser?.id || null,
      student_name: form.student_name,
      student_email: form.student_email,
      scheduled_at: slot.iso,
      duration_min: slot.duration,
      topic: form.topic,
      notes: form.notes,
      zoom_link: cfi.zoom_link || null,
      status: 'pending',
    }).select().single();

    if (!error) {
      // Send confirmation email
      fetch('/api/cfi-booking-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: form.student_name,
          studentEmail: form.student_email,
          cfiName: cfi.name,
          cfiEmail: cfi.email,
          scheduledAt: slot.iso,
          duration: slot.duration,
          topic: form.topic,
          zoomLink: cfi.zoom_link,
        }),
      }).catch(() => {});
      setDone(true);
      onBooked?.(data);
    }
    setSubmitting(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(6,15,30,0.88)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => e.target === e.currentTarget && !done && onClose()}>
      <motion.div initial={{ scale: 0.92, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 480, background: '#0d1829', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: '32px', position: 'relative' }}>
        {!done && (
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
            <X size={15} />
          </button>
        )}

        {done ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.1 }} style={{ fontSize: 56, marginBottom: 16 }}>✅</motion.div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px', fontFamily: "'Space Grotesk', sans-serif" }}>Booking Confirmed!</h2>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: '0 0 6px' }}>
              Your session with <strong style={{ color: '#f1f5f9' }}>{cfi.name}</strong> is scheduled for
            </p>
            <div style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 12, padding: '12px 18px', margin: '12px 0 16px' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#38bdf8' }}>
                {new Date(slot.iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <div style={{ fontSize: 14, color: '#7dd3fc', marginTop: 3 }}>
                {new Date(slot.iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} · {slot.duration} min
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px' }}>A confirmation email is on its way. We'll confirm your booking within 24 hours.</p>
            {cfi.zoom_link && (
              <a href={cfi.zoom_link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 10, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa', fontSize: 13, fontWeight: 700, textDecoration: 'none', marginBottom: 16 }}>
                <Video size={14} /> Join Zoom Session
              </a>
            )}
            <button onClick={onClose} className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 14 }}>Done</button>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px', fontFamily: "'Space Grotesk', sans-serif" }}>Book a Session</h2>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 22 }}>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>
                {cfi.name} · {new Date(slot.iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {new Date(slot.iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} · {slot.duration} min
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Your Name</label>
                <input value={form.student_name} onChange={e => setForm(f => ({ ...f, student_name: e.target.value }))} placeholder="Full name"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Email</label>
                <input value={form.student_email} onChange={e => setForm(f => ({ ...f, student_email: e.target.value }))} placeholder="your@email.com"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 8 }}>Session Topic</label>
                <select value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Notes (optional)</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any specific questions or areas to focus on..."
                  rows={3} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#f1f5f9', fontSize: 13, resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleBook} disabled={submitting || !form.student_name || !form.student_email}
              style={{ width: '100%', marginTop: 22, padding: '14px', borderRadius: 12, background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: !form.student_name || !form.student_email ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {submitting ? 'Booking...' : <><CheckCircle size={15} /> Confirm Booking</>}
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function CFIScheduling() {
  const [cfis, setCfis] = useState([]);
  const [selectedCfi, setSelectedCfi] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [existingBookings, setExistingBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    supabase.from('cfis').select('*').eq('active', true).order('sort_order').then(({ data }) => {
      setCfis(data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedCfi) return;
    Promise.all([
      supabase.from('cfi_availability').select('*').eq('cfi_id', selectedCfi.id),
      supabase.from('cfi_bookings').select('scheduled_at').eq('cfi_id', selectedCfi.id).neq('status', 'cancelled'),
    ]).then(([availRes, bookRes]) => {
      const avail = availRes.data || [];
      const booked = bookRes.data || [];
      setAvailability(avail);
      setExistingBookings(booked);
      setSlots(generateSlots(avail, booked, calYear, calMonth));
    });
  }, [selectedCfi, calYear, calMonth]);

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDow = new Date(calYear, calMonth, 1).getDay();

  const slotsByDay = {};
  slots.forEach(s => {
    const d = new Date(s.date).getDate();
    if (!slotsByDay[d]) slotsByDay[d] = [];
    slotsByDay[d].push(s);
  });

  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); setSelectedDay(null); };
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); setSelectedDay(null); };

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>Book a CFI Session</h1>
        <p style={{ fontSize: 13, color: '#475569', margin: '4px 0 0' }}>Schedule a 1-on-1 session with one of our certified flight instructors</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#475569' }}>Loading instructors...</div>
      ) : cfis.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍✈️</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>No instructors available yet</div>
          <div style={{ fontSize: 13, color: '#475569' }}>Check back soon — we're adding CFIs to the platform.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedCfi ? '320px 1fr' : '1fr', gap: 24 }}>
          {/* CFI List */}
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 14px' }}>Choose an Instructor</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cfis.map(cfi => (
                <motion.div key={cfi.id} whileHover={{ scale: 1.01 }}
                  onClick={() => { setSelectedCfi(cfi); setSelectedDay(null); }}
                  style={{ background: selectedCfi?.id === cfi.id ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedCfi?.id === cfi.id ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 16, padding: '18px', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    {cfi.photo_url ? (
                      <img src={cfi.photo_url} alt={cfi.name} style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(56,189,248,0.3)' }} />
                    ) : (
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(56,189,248,0.15)', border: '2px solid rgba(56,189,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <User size={20} color="#38bdf8" />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{cfi.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{cfi.title}</div>
                      {cfi.specialties?.length > 0 && (
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
                          {cfi.specialties.slice(0, 3).map(s => (
                            <span key={s} style={{ fontSize: 10, color: '#818cf8', background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.2)', borderRadius: 20, padding: '2px 7px', fontWeight: 600 }}>{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    {selectedCfi?.id === cfi.id && <CheckCircle size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: 2 }} />}
                  </div>
                  {cfi.bio && <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, margin: '10px 0 0' }}>{cfi.bio}</p>}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Calendar + slots */}
          {selectedCfi && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 14px' }}>
                Select a Date & Time
              </h2>

              {/* Calendar */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '20px', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <button onClick={prevMonth} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                    <ChevronLeft size={16} />
                  </button>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>
                    {MONTHS[calMonth]} {calYear}
                  </span>
                  <button onClick={nextMonth} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
                  {DAYS.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#475569', padding: '4px 0', textTransform: 'uppercase', letterSpacing: 0.5 }}>{d}</div>)}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                  {Array.from({ length: firstDow }).map((_, i) => <div key={`empty-${i}`} />)}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const hasSlots = slotsByDay[day]?.length > 0;
                    const isSelected = selectedDay === day;
                    const isPast = new Date(calYear, calMonth, day) < new Date(new Date().setHours(0,0,0,0));
                    return (
                      <button key={day}
                        onClick={() => hasSlots && !isPast && setSelectedDay(isSelected ? null : day)}
                        disabled={!hasSlots || isPast}
                        style={{
                          aspectRatio: '1', borderRadius: 10, border: 'none', cursor: hasSlots && !isPast ? 'pointer' : 'default',
                          background: isSelected ? 'rgba(56,189,248,0.2)' : hasSlots && !isPast ? 'rgba(56,189,248,0.06)' : 'transparent',
                          color: isSelected ? '#38bdf8' : hasSlots && !isPast ? '#94a3b8' : '#2d3748',
                          fontSize: 13, fontWeight: isSelected || hasSlots ? 700 : 400,
                          outline: isSelected ? '2px solid rgba(56,189,248,0.5)' : 'none',
                          position: 'relative', transition: 'all 0.15s',
                        }}>
                        {day}
                        {hasSlots && !isPast && !isSelected && (
                          <div style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#38bdf8' }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots for selected day */}
              <AnimatePresence>
                {selectedDay && slotsByDay[selectedDay] && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 12px' }}>
                      Available Times — {MONTHS[calMonth]} {selectedDay}
                    </h3>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {slotsByDay[selectedDay].map((slot, i) => (
                        <motion.button key={i} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                          onClick={() => setSelectedSlot(slot)}
                          style={{ padding: '10px 18px', borderRadius: 10, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)', color: '#38bdf8', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock size={13} />
                          {new Date(slot.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          <span style={{ fontSize: 11, opacity: 0.7 }}>{slot.duration}m</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!selectedDay && (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#475569', fontSize: 13 }}>
                  Select a highlighted date to see available time slots
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedSlot && (
          <BookingModal cfi={selectedCfi} slot={selectedSlot} onClose={() => setSelectedSlot(null)} onBooked={() => { setSelectedSlot(null); setSelectedDay(null); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
