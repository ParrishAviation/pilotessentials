import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Shield, ShieldCheck, X, AtSign, Trash2, UserPlus, UserMinus, ChevronDown, Users, MessageSquare, Lock, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabase';

const ADMIN_EMAILS = ['jack@parrishaviation.com', 'titiusmclaughlin@gmail.com'];
const MAX_MESSAGES = 150;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function RichContent({ content, currentUserId, userMap }) {
  const parts = content.split(/(@\w[\w\s]*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('@')) {
          const name = part.slice(1).trim();
          const isMe = userMap && Object.entries(userMap).some(
            ([uid, uname]) => uid === currentUserId && uname.toLowerCase() === name.toLowerCase()
          );
          return (
            <span key={i} style={{
              background: isMe ? 'rgba(56,189,248,0.25)' : 'rgba(129,140,248,0.15)',
              color: isMe ? '#38bdf8' : '#a78bfa',
              borderRadius: 4, padding: '1px 5px',
              fontWeight: 700, fontSize: '0.93em',
            }}>{part}</span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

function Avatar({ name, size = 34, isMod, isAdmin, isCfi }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';
  const hue = name ? [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360 : 200;
  const border = isAdmin ? '2px solid #f59e0b' : isCfi ? '2px solid #a78bfa' : isMod ? '2px solid #38bdf8' : '2px solid transparent';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `hsl(${hue}, 60%, 45%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 800, color: '#fff',
      flexShrink: 0, border,
      boxShadow: isAdmin ? '0 0 8px rgba(245,158,11,0.4)' : isCfi ? '0 0 8px rgba(167,139,250,0.4)' : isMod ? '0 0 8px rgba(56,189,248,0.3)' : 'none',
    }}>
      {initials}
    </div>
  );
}

function Message({ msg, isOwn, isMod, isAdmin, canModerate, onDelete, onAssignMod, onRemoveMod, currentUserId, userMap, isModTarget, isCfi }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', gap: 10, padding: '6px 20px',
        background: isOwn ? 'rgba(14,165,233,0.04)' : hovered ? 'rgba(255,255,255,0.015)' : 'transparent',
        transition: 'background 0.15s',
        position: 'relative',
      }}
    >
      <Avatar name={msg.user_name} size={34} isAdmin={ADMIN_EMAILS.includes(msg.user_email)} isMod={isModTarget} isCfi={isCfi} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: isOwn ? '#38bdf8' : '#e2e8f0' }}>
            {msg.user_name}
          </span>
          {ADMIN_EMAILS.includes(msg.user_email) && (
            <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '1px 6px', borderRadius: 4 }}>ADMIN</span>
          )}
          {isCfi && !ADMIN_EMAILS.includes(msg.user_email) && (
            <span style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', background: 'rgba(167,139,250,0.12)', padding: '1px 6px', borderRadius: 4 }}>CFI</span>
          )}
          {isModTarget && !ADMIN_EMAILS.includes(msg.user_email) && !isCfi && (
            <span style={{ fontSize: 10, fontWeight: 700, color: '#38bdf8', background: 'rgba(56,189,248,0.1)', padding: '1px 6px', borderRadius: 4 }}>MOD</span>
          )}
          <span style={{ fontSize: 11, color: '#334155' }}>{formatTime(msg.created_at)}</span>
        </div>
        <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.55, margin: 0, wordBreak: 'break-word' }}>
          <RichContent content={msg.content} currentUserId={currentUserId} userMap={userMap} />
        </p>
      </div>

      {/* Moderation actions */}
      {canModerate && hovered && (
        <div style={{ display: 'flex', gap: 4, position: 'absolute', right: 16, top: 6 }}>
          <button onClick={() => onDelete(msg.id)} title="Delete" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '4px 6px', cursor: 'pointer', color: '#f87171' }}>
            <Trash2 size={11} />
          </button>
          {isAdmin && !isModTarget && msg.user_id !== currentUserId && (
            <button onClick={() => onAssignMod(msg.user_id, msg.user_name)} title="Make Mod" style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 6, padding: '4px 6px', cursor: 'pointer', color: '#38bdf8' }}>
              <UserPlus size={11} />
            </button>
          )}
          {isAdmin && isModTarget && (
            <button onClick={() => onRemoveMod(msg.user_id)} title="Remove Mod" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 6, padding: '4px 6px', cursor: 'pointer', color: '#fbbf24' }}>
              <UserMinus size={11} />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

function MentionDropdown({ suggestions, onSelect, query }) {
  if (!suggestions.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'absolute', bottom: '100%', left: 0, right: 0,
        background: '#0d1b2e', border: '1px solid rgba(56,189,248,0.2)',
        borderRadius: 10, marginBottom: 6, overflow: 'hidden',
        boxShadow: '0 -8px 30px rgba(0,0,0,0.4)', zIndex: 10,
      }}
    >
      <div style={{ padding: '6px 12px 4px', fontSize: 11, color: '#475569', fontWeight: 600 }}>Mentioning @{query}</div>
      {suggestions.map(u => (
        <button key={u.id} onClick={() => onSelect(u.name)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,189,248,0.07)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <Avatar name={u.name} size={26} />
          <span style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 600 }}>{u.name}</span>
        </button>
      ))}
    </motion.div>
  );
}

// ─── CFI Upsell wall ──────────────────────────────────────────────────────────
function CfiUpsellWall() {
  const navigate = useNavigate();
  const perks = [
    'Ask real, certified CFIs your questions daily',
    'Get expert answers on regulations, maneuvers & weather',
    'CFI-reviewed study sessions tailored to your weak spots',
    'Faster progress — real human guidance, not just AI',
    'Included: Full Access course + Pass Guarantee',
  ];
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', overflowY: 'auto' }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>

        {/* Lock icon */}
        <div style={{
          width: 72, height: 72, borderRadius: 20, margin: '0 auto 20px',
          background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(245,158,11,0.15))',
          border: '1px solid rgba(167,139,250,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(167,139,250,0.15)',
        }}>
          <Lock size={30} color="#a78bfa" />
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 20, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', marginBottom: 16 }}>
          <Star size={11} color="#f59e0b" fill="#f59e0b" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: 0.8 }}>CFI Mentorship Plan</span>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#f1f5f9', margin: '0 0 10px', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.2 }}>
          Ask Real CFIs Your Questions
        </h2>
        <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 24px', lineHeight: 1.6 }}>
          Get direct access to certified flight instructors who answer your questions in real time — every day of your training.
        </p>

        {/* Perks list */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, textAlign: 'left' }}>
          {perks.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < perks.length - 1 ? 12 : 0 }}>
              <CheckCircle size={15} color="#a78bfa" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>{p}</span>
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: '#475569' }}>One-time payment · 12 months of live CFI access</span>
        </div>
        <button
          onClick={() => navigate('/checkout?plan=cfi_mentorship')}
          style={{
            width: '100%', padding: '14px 24px', borderRadius: 12,
            background: 'linear-gradient(135deg, #a78bfa, #f59e0b)',
            border: 'none', color: '#0a0a0a', fontSize: 15, fontWeight: 800,
            cursor: 'pointer', letterSpacing: 0.3,
            boxShadow: '0 4px 24px rgba(167,139,250,0.35)',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(167,139,250,0.45)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(167,139,250,0.35)'; }}
        >
          Get CFI Mentorship — $999 →
        </button>
        <p style={{ fontSize: 12, color: '#334155', marginTop: 10 }}>
          Includes Full Access + AI Instructor + Pass Guarantee
        </p>
      </div>
    </div>
  );
}

// ─── Shared chat panel ────────────────────────────────────────────────────────
function ChatPanel({ table, channelName, presenceKey, placeholder, emptyTitle, emptySubtitle, isCfiRoom, roomKey }) {
  const { user: authUser } = useAuth();
  const { awardChatXp } = useUser();
  const myEmail = authUser?.email;
  const myId = authUser?.id;
  const myName = authUser?.user_metadata?.full_name || myEmail?.split('@')[0] || 'Pilot';
  const isAdmin = ADMIN_EMAILS.includes(myEmail);

  const [messages, setMessages] = useState([]);
  const [mods, setMods] = useState(new Set());
  const [modMap, setModMap] = useState({});
  const [onlineCount, setOnlineCount] = useState(1);
  const [isMod, setIsMod] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [userMap, setUserMap] = useState({});

  const bottomRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { loadMessages(); loadMods(); loadUsers(); }, [table]);
  useEffect(() => { if (myId && modMap[myId]) setIsMod(true); else setIsMod(false); }, [myId, modMap]);

  async function loadMessages() {
    setLoading(true);
    const { data } = await supabase.from(table).select('*').is('deleted_at', null).order('created_at', { ascending: true }).limit(MAX_MESSAGES);
    if (data) setMessages(data);
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'instant' }), 50);
  }

  async function loadMods() {
    const { data } = await supabase.from('chat_moderators').select('*');
    if (data) {
      const map = {};
      data.forEach(m => { map[m.user_id] = true; });
      setModMap(map);
      setMods(new Set(Object.keys(map)));
    }
  }

  async function loadUsers() {
    const { data } = await supabase.from('profiles').select('id, username, full_name').limit(200);
    if (data) {
      const users = data.map(p => ({ id: p.id, name: p.full_name || p.username || 'Pilot' }));
      setAllUsers(users);
      const map = {};
      users.forEach(u => { map[u.id] = u.name; });
      setUserMap(map);
    }
  }

  useEffect(() => {
    const msgChannel = supabase.channel(channelName)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table }, payload => {
        const newMsg = payload.new;
        if (newMsg.deleted_at) return;
        setMessages(prev => {
          if (prev.find(m => m.id === newMsg.id)) return prev;
          const updated = [...prev, newMsg];
          return updated.slice(-MAX_MESSAGES);
        });
        const el = listRef.current;
        if (el) {
          const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
          if (nearBottom) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table }, payload => {
        const updated = payload.new;
        if (updated.deleted_at) setMessages(prev => prev.filter(m => m.id !== updated.id));
      })
      .subscribe(status => setConnected(status === 'SUBSCRIBED'));

    const presenceChannel = supabase.channel(`${channelName}_presence`, { config: { presence: { key: myId } } });
    presenceChannel
      .on('presence', { event: 'sync' }, () => setOnlineCount(Object.keys(presenceChannel.presenceState()).length))
      .subscribe(async status => {
        if (status === 'SUBSCRIBED') await presenceChannel.track({ user_id: myId, user_name: myName, online_at: new Date().toISOString() });
      });

    return () => { supabase.removeChannel(msgChannel); supabase.removeChannel(presenceChannel); };
  }, [table, channelName, myId, myName]);

  async function sendMessage() {
    const content = draft.trim();
    if (!content || sending) return;
    const mentionNames = [...content.matchAll(/@(\w[\w\s]*)/g)].map(m => m[1].trim());
    const mentions = allUsers.filter(u => mentionNames.some(n => u.name.toLowerCase().startsWith(n.toLowerCase()))).map(u => u.id);
    setSending(true);
    setDraft('');
    setMentionSuggestions([]);
    const { error } = await supabase.from(table).insert({ user_id: myId, user_name: myName, content, mentions });
    if (error) { console.error('Send error:', error); setDraft(content); }
    else {
      // Award XP for chat engagement (fire-and-forget)
      awardChatXp?.();
      // Fire-and-forget email notification — never blocks the user
      fetch('/api/chat-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: myName, userEmail: myEmail, content, room: roomKey }),
      }).catch(() => {});
    }
    setSending(false);
    inputRef.current?.focus();
  }

  function handleInputChange(e) {
    const val = e.target.value;
    setDraft(val);
    const cursor = e.target.selectionStart;
    const mentionMatch = val.slice(0, cursor).match(/@(\w[\w ]*)$/);
    if (mentionMatch) {
      const q = mentionMatch[1];
      setMentionQuery(q);
      setMentionSuggestions(allUsers.filter(u => u.id !== myId && u.name.toLowerCase().includes(q.toLowerCase())).slice(0, 5));
    } else { setMentionQuery(''); setMentionSuggestions([]); }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (mentionSuggestions.length > 0) completeMention(mentionSuggestions[0].name);
      else sendMessage();
    }
    if (e.key === 'Escape') setMentionSuggestions([]);
  }

  function completeMention(name) {
    const cursor = inputRef.current?.selectionStart || draft.length;
    const before = draft.slice(0, cursor);
    const after = draft.slice(cursor);
    const replaced = before.replace(/@(\w[\w ]*)$/, `@${name} `);
    setDraft(replaced + after);
    setMentionSuggestions([]);
    setMentionQuery('');
    setTimeout(() => { inputRef.current?.focus(); const pos = replaced.length; inputRef.current?.setSelectionRange(pos, pos); }, 0);
  }

  async function deleteMessage(id) {
    await supabase.from(table).update({ deleted_at: new Date().toISOString(), deleted_by: myId }).eq('id', id);
  }

  async function assignMod(userId, userName) {
    if (!isAdmin && !isMod) return;
    const { error } = await supabase.from('chat_moderators').upsert({ user_id: userId, user_name: userName, assigned_by: myId });
    if (!error) { setModMap(prev => ({ ...prev, [userId]: true })); setMods(prev => new Set([...prev, userId])); }
  }

  async function removeMod(userId) {
    if (!isAdmin) return;
    const { error } = await supabase.from('chat_moderators').delete().eq('user_id', userId);
    if (!error) { setModMap(prev => { const n = { ...prev }; delete n[userId]; return n; }); setMods(prev => { const n = new Set(prev); n.delete(userId); return n; }); }
  }

  const canModerate = isAdmin || isMod;

  return (
    <>
      {/* Rules strip */}
      <div style={{ padding: '7px 24px', background: isCfiRoom ? 'rgba(167,139,250,0.04)' : 'rgba(14,165,233,0.04)', borderBottom: `1px solid ${isCfiRoom ? 'rgba(167,139,250,0.1)' : 'rgba(56,189,248,0.08)'}`, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: '#334155' }}>{isCfiRoom ? '👨‍✈️' : '📋'}</span>
        <span style={{ fontSize: 11, color: '#334155' }}>
          {isCfiRoom
            ? 'Ask real CFIs your aviation questions · Be specific · Use @ to mention someone'
            : 'Be respectful · Aviation topics welcome · Use @name to mention someone · No spam'}
        </span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#334155', flexShrink: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: connected ? '#22c55e' : '#ef4444', display: 'inline-block', boxShadow: connected ? '0 0 5px #22c55e' : 'none' }} />
          {connected ? `Live · ${onlineCount} online` : 'Connecting...'}
          <span style={{ color: '#1e3a5f', marginLeft: 4 }}>{messages.length} msgs</span>
        </span>
      </div>

      {/* Message list */}
      <div ref={listRef} onScroll={() => { const el = listRef.current; if (el) setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200); }}
        style={{ flex: 1, overflowY: 'auto', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 2, position: 'relative' }}>
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, marginBottom: 10 }}>{isCfiRoom ? '👨‍✈️' : '✈️'}</div><p style={{ color: '#475569', fontSize: 14 }}>Loading messages...</p></div>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{isCfiRoom ? '🧑‍✈️' : '🛫'}</div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>{emptyTitle}</p>
              <p style={{ color: '#475569', fontSize: 14 }}>{emptySubtitle}</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <Message key={msg.id} msg={msg} isOwn={msg.user_id === myId} isMod={isMod} isAdmin={isAdmin}
                isModTarget={!!modMap[msg.user_id]} canModerate={canModerate} onDelete={deleteMessage}
                onAssignMod={assignMod} onRemoveMod={removeMod} currentUserId={myId} userMap={userMap} isCfi={isCfiRoom} />
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Scroll to bottom */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
            style={{ position: 'absolute', bottom: 90, right: 24, width: 36, height: 36, borderRadius: '50%', background: isCfiRoom ? 'linear-gradient(135deg, #a78bfa, #7c3aed)' : 'linear-gradient(135deg, #0ea5e9, #2563eb)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(14,165,233,0.4)', zIndex: 20 }}>
            <ChevronDown size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${isCfiRoom ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.07)'}`, background: 'rgba(6,15,30,0.98)', backdropFilter: 'blur(20px)', flexShrink: 0, position: 'relative' }}>
        <AnimatePresence>
          {mentionSuggestions.length > 0 && <MentionDropdown suggestions={mentionSuggestions} onSelect={completeMention} query={mentionQuery} />}
        </AnimatePresence>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${isCfiRoom ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.09)'}`, borderRadius: 14, padding: '10px 14px' }}>
          <AtSign size={16} style={{ color: '#334155', flexShrink: 0, marginBottom: 2 }} />
          <textarea ref={inputRef} value={draft} onChange={handleInputChange} onKeyDown={handleKeyDown}
            placeholder={placeholder} rows={1}
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#e2e8f0', fontSize: 14, lineHeight: 1.5, resize: 'none', fontFamily: 'inherit', maxHeight: 120, overflowY: 'auto' }}
            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }} />
          <button onClick={sendMessage} disabled={!draft.trim() || sending}
            style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: draft.trim() ? (isCfiRoom ? 'linear-gradient(135deg, #a78bfa, #7c3aed)' : 'linear-gradient(135deg, #0ea5e9, #2563eb)') : 'rgba(255,255,255,0.04)', border: 'none', cursor: draft.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: draft.trim() ? '0 4px 12px rgba(14,165,233,0.3)' : 'none' }}>
            <Send size={15} color={draft.trim() ? '#fff' : '#334155'} />
          </button>
        </div>
        <p style={{ fontSize: 11, color: '#1e3a5f', marginTop: 6, textAlign: 'center' }}>
          Press Enter to send · Shift+Enter for new line · @name to mention
        </p>
      </div>
    </>
  );
}

// ─── Main ChatRoom page ───────────────────────────────────────────────────────
export default function ChatRoom() {
  const { user: authUser, purchaseTier } = useAuth();
  const myEmail = authUser?.email;
  const isAdmin = ADMIN_EMAILS.includes(myEmail);
  const hasCfiAccess = isAdmin || purchaseTier === 'cfi_mentorship';

  const [activeTab, setActiveTab] = useState('student');

  const tabs = [
    { key: 'student', label: 'Student Chatroom', icon: '🛫', color: '#38bdf8' },
    { key: 'cfi', label: 'CFI Chatroom', icon: '🧑‍✈️', color: '#a78bfa', locked: !hasCfiAccess },
  ];

  return (
    <div style={{ height: 'calc(100vh - 0px)', display: 'flex', flexDirection: 'column', background: '#060f1e', overflow: 'hidden', position: 'relative' }}>

      {/* ── Header with tabs ── */}
      <div style={{ padding: '14px 20px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(6,15,30,0.98)', backdropFilter: 'blur(20px)', flexShrink: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: activeTab === 'cfi' ? 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(124,58,237,0.2))' : 'linear-gradient(135deg, #0ea5e9, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: activeTab === 'cfi' ? '0 0 12px rgba(167,139,250,0.3)' : '0 0 12px rgba(14,165,233,0.3)', transition: 'all 0.3s' }}>
              {activeTab === 'cfi' ? '🧑‍✈️' : '✈️'}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>
              Chatroom
            </div>
          </div>
          {(ADMIN_EMAILS.includes(myEmail)) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 7, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Shield size={12} color="#f59e0b" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>Admin</span>
            </div>
          )}
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 0 }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: '9px 12px', border: 'none', cursor: 'pointer',
                background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                borderBottom: activeTab === tab.key ? `2px solid ${tab.color}` : '2px solid transparent',
                transition: 'all 0.18s',
              }}
            >
              <span style={{ fontSize: 15 }}>{tab.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: activeTab === tab.key ? tab.color : '#475569' }}>
                {tab.label}
              </span>
              {tab.locked && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '1px 7px', borderRadius: 20, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', marginLeft: 2 }}>
                  <Lock size={9} color="#f59e0b" />
                  <span style={{ fontSize: 9, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: 0.5 }}>$999</span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      {activeTab === 'student' ? (
        <ChatPanel
          table="chat_messages"
          channelName="chat_room_messages"
          presenceKey="chat_presence"
          placeholder="Message the student lounge... (@ to mention)"
          emptyTitle="The lounge is empty"
          emptySubtitle="Be the first to say hello to your fellow student pilots!"
          isCfiRoom={false}
          roomKey="student"
        />
      ) : hasCfiAccess ? (
        <ChatPanel
          table="cfi_chat_messages"
          channelName="cfi_chat_room_messages"
          presenceKey="cfi_chat_presence"
          placeholder="Ask your CFI a question... (@ to mention)"
          emptyTitle="CFI Lounge is ready"
          emptySubtitle="Ask your first question — a certified flight instructor will answer!"
          isCfiRoom={true}
          roomKey="cfi"
        />
      ) : (
        <CfiUpsellWall />
      )}
    </div>
  );
}
