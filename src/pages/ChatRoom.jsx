import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Shield, ShieldCheck, X, AtSign, Trash2, UserPlus, UserMinus, ChevronDown, Users, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';

const ADMIN_EMAILS = ['jack@parrishaviation.com', 'titiusmclaughlin@gmail.com'];
const MAX_MESSAGES = 150; // keep in DOM

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

// Parse content and highlight @mentions
function RichContent({ content, currentUserId, userMap }) {
  const parts = content.split(/(@\w[\w\s]*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('@')) {
          const name = part.slice(1).trim();
          // Check if this mention is the current user
          const isMe = userMap && Object.entries(userMap).some(
            ([uid, uname]) => uid === currentUserId && uname.toLowerCase() === name.toLowerCase()
          );
          return (
            <span key={i} style={{
              background: isMe ? 'rgba(56,189,248,0.25)' : 'rgba(129,140,248,0.15)',
              color: isMe ? '#38bdf8' : '#a78bfa',
              borderRadius: 4, padding: '1px 5px',
              fontWeight: 700, fontSize: '0.93em',
            }}>
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, size = 34, isMod, isAdmin }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';
  const hue = name ? [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360 : 200;
  const border = isAdmin ? '2px solid #f59e0b' : isMod ? '2px solid #38bdf8' : '2px solid transparent';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `hsl(${hue}, 60%, 45%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 800, color: '#fff',
      flexShrink: 0, border,
      boxShadow: isAdmin ? '0 0 8px rgba(245,158,11,0.4)' : isMod ? '0 0 8px rgba(56,189,248,0.3)' : 'none',
    }}>
      {initials}
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function Message({ msg, isOwn, isMod, isAdmin, canModerate, onDelete, onAssignMod, onRemoveMod, currentUserId, userMap, isModTarget }) {
  const [hovered, setHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowActions(false); }}
      style={{
        display: 'flex', gap: 10, padding: '6px 16px',
        background: isOwn ? 'rgba(14,165,233,0.04)' : 'transparent',
        borderLeft: isOwn ? '2px solid rgba(14,165,233,0.2)' : '2px solid transparent',
        transition: 'background 0.15s',
        position: 'relative',
      }}
    >
      <Avatar name={msg.user_name} isMod={isModTarget} isAdmin={ADMIN_EMAILS.includes(msg.user_email)} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
          <span style={{
            fontWeight: 700, fontSize: 14,
            color: ADMIN_EMAILS.includes(msg.user_email) ? '#f59e0b' : isModTarget ? '#38bdf8' : '#e2e8f0',
          }}>
            {msg.user_name}
          </span>
          {ADMIN_EMAILS.includes(msg.user_email) && (
            <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', borderRadius: 4, padding: '1px 6px', letterSpacing: 0.5 }}>
              ADMIN
            </span>
          )}
          {isModTarget && !ADMIN_EMAILS.includes(msg.user_email) && (
            <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(56,189,248,0.1)', color: '#38bdf8', borderRadius: 4, padding: '1px 6px', letterSpacing: 0.5 }}>
              MOD
            </span>
          )}
          <span style={{ fontSize: 11, color: '#334155' }}>{formatTime(msg.created_at)}</span>
        </div>

        <p style={{ margin: 0, fontSize: 14.5, color: '#cbd5e1', lineHeight: 1.55, wordBreak: 'break-word' }}>
          <RichContent content={msg.content} currentUserId={currentUserId} userMap={userMap} />
        </p>
      </div>

      {/* Hover action bar */}
      {hovered && canModerate && (
        <div style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          display: 'flex', gap: 4,
        }}>
          {/* Delete */}
          <button
            onClick={() => onDelete(msg.id)}
            title="Delete message"
            style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Trash2 size={13} />
          </button>
          {/* Assign/Remove mod (not on own message if not admin) */}
          {(isAdmin || isMod) && msg.user_id !== currentUserId && (
            isModTarget ? (
              <button
                onClick={() => onRemoveMod(msg.user_id)}
                title="Remove moderator"
                style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.18)',
                  color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <UserMinus size={13} />
              </button>
            ) : (
              <button
                onClick={() => onAssignMod(msg.user_id, msg.user_name)}
                title="Make moderator"
                style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)',
                  color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <UserPlus size={13} />
              </button>
            )
          )}
        </div>
      )}
    </motion.div>
  );
}

// ─── @mention autocomplete dropdown ──────────────────────────────────────────
function MentionDropdown({ suggestions, onSelect, query }) {
  if (!suggestions.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'absolute', bottom: '100%', left: 0, right: 0,
        background: '#0d1b2e', border: '1px solid rgba(56,189,248,0.2)',
        borderRadius: 10, marginBottom: 6, overflow: 'hidden',
        boxShadow: '0 -8px 30px rgba(0,0,0,0.4)',
        zIndex: 10,
      }}
    >
      <div style={{ padding: '6px 12px 4px', fontSize: 11, color: '#475569', fontWeight: 600 }}>
        Mentioning @{query}
      </div>
      {suggestions.map(u => (
        <button
          key={u.id}
          onClick={() => onSelect(u.name)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '8px 12px',
            background: 'none', border: 'none', cursor: 'pointer',
            textAlign: 'left', transition: 'background 0.1s',
          }}
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

// ─── Main ChatRoom ────────────────────────────────────────────────────────────
export default function ChatRoom() {
  const { user: authUser } = useAuth();
  const myEmail = authUser?.email;
  const myId = authUser?.id;
  const myName = authUser?.user_metadata?.full_name || myEmail?.split('@')[0] || 'Pilot';
  const isAdmin = ADMIN_EMAILS.includes(myEmail);

  const [messages, setMessages] = useState([]);
  const [mods, setMods] = useState(new Set()); // Set of user_ids who are mods
  const [modMap, setModMap] = useState({});    // uid → true
  const [onlineCount, setOnlineCount] = useState(1);
  const [isMod, setIsMod] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Input state
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // [{id, name}]
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Build a userMap: uid → name for @mention highlighting
  const [userMap, setUserMap] = useState({});

  const bottomRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const channelRef = useRef(null);
  const presenceChannelRef = useRef(null);

  // ── Load initial data ──
  useEffect(() => {
    loadMessages();
    loadMods();
    loadUsers();
  }, []);

  // ── Check if current user is mod ──
  useEffect(() => {
    if (myId && modMap[myId]) setIsMod(true);
    else setIsMod(false);
  }, [myId, modMap]);

  async function loadMessages() {
    setLoading(true);
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: true })
      .limit(MAX_MESSAGES);
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
    const { data } = await supabase
      .from('profiles')
      .select('id, username, full_name')
      .limit(200);
    if (data) {
      const users = data.map(p => ({
        id: p.id,
        name: p.full_name || p.username || 'Pilot',
      }));
      setAllUsers(users);
      const map = {};
      users.forEach(u => { map[u.id] = u.name; });
      setUserMap(map);
    }
  }

  // ── Supabase Realtime subscription ──
  useEffect(() => {
    // Messages channel
    const msgChannel = supabase
      .channel('chat_room_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
      }, payload => {
        const newMsg = payload.new;
        if (newMsg.deleted_at) return;
        setMessages(prev => {
          const exists = prev.find(m => m.id === newMsg.id);
          if (exists) return prev;
          const updated = [...prev, newMsg];
          return updated.slice(-MAX_MESSAGES);
        });
        // Auto-scroll if near bottom
        const el = listRef.current;
        if (el) {
          const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
          if (nearBottom) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_messages',
      }, payload => {
        const updated = payload.new;
        if (updated.deleted_at) {
          setMessages(prev => prev.filter(m => m.id !== updated.id));
        }
      })
      .subscribe(status => {
        setConnected(status === 'SUBSCRIBED');
      });

    channelRef.current = msgChannel;

    // Presence channel for online count
    const presenceChannel = supabase.channel('chat_presence', {
      config: { presence: { key: myId } },
    });
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        setOnlineCount(Object.keys(state).length);
      })
      .subscribe(async status => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ user_id: myId, user_name: myName, online_at: new Date().toISOString() });
        }
      });

    presenceChannelRef.current = presenceChannel;

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [myId, myName]);

  // ── Scroll detection ──
  function handleScroll() {
    const el = listRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 200);
  }

  // ── Send message ──
  async function sendMessage() {
    const content = draft.trim();
    if (!content || sending) return;

    // Extract mentions: words after @
    const mentionNames = [...content.matchAll(/@(\w[\w\s]*)/g)].map(m => m[1].trim());
    const mentions = allUsers
      .filter(u => mentionNames.some(n => u.name.toLowerCase().startsWith(n.toLowerCase())))
      .map(u => u.id);

    setSending(true);
    setDraft('');
    setMentionQuery('');
    setMentionSuggestions([]);

    const { error } = await supabase.from('chat_messages').insert({
      user_id: myId,
      user_name: myName,
      content,
      mentions,
    });

    if (error) {
      console.error('Send error:', error);
      setDraft(content); // restore on fail
    }
    setSending(false);
    inputRef.current?.focus();
  }

  // ── Input handling ──
  function handleInputChange(e) {
    const val = e.target.value;
    setDraft(val);

    // Detect @mention typing
    const cursor = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, cursor);
    const mentionMatch = textBeforeCursor.match(/@(\w[\w ]*)$/);
    if (mentionMatch) {
      const q = mentionMatch[1];
      setMentionQuery(q);
      const suggestions = allUsers.filter(
        u => u.id !== myId && u.name.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 5);
      setMentionSuggestions(suggestions);
    } else {
      setMentionQuery('');
      setMentionSuggestions([]);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (mentionSuggestions.length > 0) {
        completeMention(mentionSuggestions[0].name);
      } else {
        sendMessage();
      }
    }
    if (e.key === 'Escape') {
      setMentionSuggestions([]);
    }
  }

  function completeMention(name) {
    const cursor = inputRef.current?.selectionStart || draft.length;
    const before = draft.slice(0, cursor);
    const after = draft.slice(cursor);
    const replaced = before.replace(/@(\w[\w ]*)$/, `@${name} `);
    setDraft(replaced + after);
    setMentionSuggestions([]);
    setMentionQuery('');
    setTimeout(() => {
      inputRef.current?.focus();
      const pos = replaced.length;
      inputRef.current?.setSelectionRange(pos, pos);
    }, 0);
  }

  // ── Moderate ──
  async function deleteMessage(id) {
    await supabase
      .from('chat_messages')
      .update({ deleted_at: new Date().toISOString(), deleted_by: myId })
      .eq('id', id);
  }

  async function assignMod(userId, userName) {
    if (!isAdmin && !isMod) return;
    const { error } = await supabase.from('chat_moderators').upsert({
      user_id: userId,
      user_name: userName,
      assigned_by: myId,
    });
    if (!error) {
      setModMap(prev => ({ ...prev, [userId]: true }));
      setMods(prev => new Set([...prev, userId]));
    }
  }

  async function removeMod(userId) {
    if (!isAdmin) return; // only admins can remove mods
    const { error } = await supabase
      .from('chat_moderators')
      .delete()
      .eq('user_id', userId);
    if (!error) {
      setModMap(prev => { const n = { ...prev }; delete n[userId]; return n; });
      setMods(prev => { const n = new Set(prev); n.delete(userId); return n; });
    }
  }

  const canModerate = isAdmin || isMod;

  return (
    <div style={{
      height: 'calc(100vh - 0px)',
      display: 'flex',
      flexDirection: 'column',
      background: '#060f1e',
      overflow: 'hidden',
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(6,15,30,0.98)',
        backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, boxShadow: '0 0 16px rgba(14,165,233,0.3)',
          }}>✈️</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>
              Student Lounge
            </div>
            <div style={{ fontSize: 12, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: connected ? '#22c55e' : '#ef4444', display: 'inline-block', boxShadow: connected ? '0 0 6px #22c55e' : 'none' }} />
              {connected ? 'Live' : 'Connecting...'}
              <span style={{ color: '#334155' }}>·</span>
              <Users size={11} style={{ color: '#475569' }} />
              <span>{onlineCount} online</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {(isAdmin || isMod) && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 8,
              background: isAdmin ? 'rgba(245,158,11,0.1)' : 'rgba(56,189,248,0.1)',
              border: `1px solid ${isAdmin ? 'rgba(245,158,11,0.25)' : 'rgba(56,189,248,0.2)'}`,
            }}>
              {isAdmin ? <Shield size={13} color="#f59e0b" /> : <ShieldCheck size={13} color="#38bdf8" />}
              <span style={{ fontSize: 12, fontWeight: 700, color: isAdmin ? '#f59e0b' : '#38bdf8' }}>
                {isAdmin ? 'Admin' : 'Moderator'}
              </span>
            </div>
          )}
          <div style={{ fontSize: 12, color: '#334155' }}>
            {messages.length} messages
          </div>
        </div>
      </div>

      {/* ── Rules strip ── */}
      <div style={{
        padding: '8px 24px',
        background: 'rgba(14,165,233,0.04)',
        borderBottom: '1px solid rgba(56,189,248,0.08)',
        display: 'flex', alignItems: 'center', gap: 8,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, color: '#334155' }}>📋</span>
        <span style={{ fontSize: 11, color: '#334155' }}>
          Be respectful · Aviation topics welcome · Use <span style={{ color: '#818cf8' }}>@name</span> to mention someone · No spam
        </span>
      </div>

      {/* ── Message list ── */}
      <div
        ref={listRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>✈️</div>
              <p style={{ color: '#475569', fontSize: 14 }}>Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛫</div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>The lounge is empty</p>
              <p style={{ color: '#475569', fontSize: 14 }}>Be the first to say hello to your fellow student pilots!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <Message
                key={msg.id}
                msg={msg}
                isOwn={msg.user_id === myId}
                isMod={isMod}
                isAdmin={isAdmin}
                isModTarget={!!modMap[msg.user_id]}
                canModerate={canModerate}
                onDelete={deleteMessage}
                onAssignMod={assignMod}
                onRemoveMod={removeMod}
                currentUserId={myId}
                userMap={userMap}
              />
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* ── Scroll to bottom button ── */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              position: 'absolute',
              bottom: 90, right: 24,
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              border: 'none', color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(14,165,233,0.4)',
              zIndex: 20,
            }}
          >
            <ChevronDown size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Input bar ── */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(6,15,30,0.98)',
        backdropFilter: 'blur(20px)',
        flexShrink: 0,
        position: 'relative',
      }}>
        {/* @mention autocomplete */}
        <AnimatePresence>
          {mentionSuggestions.length > 0 && (
            <MentionDropdown
              suggestions={mentionSuggestions}
              onSelect={completeMention}
              query={mentionQuery}
            />
          )}
        </AnimatePresence>

        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 10,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 14, padding: '10px 14px',
          transition: 'border-color 0.2s',
        }}
          onFocus={() => {}}
        >
          <AtSign size={16} style={{ color: '#334155', flexShrink: 0, marginBottom: 2 }} />
          <textarea
            ref={inputRef}
            value={draft}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`Message the student lounge... (@ to mention)`}
            rows={1}
            style={{
              flex: 1,
              background: 'none', border: 'none', outline: 'none',
              color: '#e2e8f0', fontSize: 14, lineHeight: 1.5,
              resize: 'none', fontFamily: 'inherit',
              maxHeight: 120, overflowY: 'auto',
            }}
            onInput={e => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!draft.trim() || sending}
            style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: draft.trim() ? 'linear-gradient(135deg, #0ea5e9, #2563eb)' : 'rgba(255,255,255,0.04)',
              border: 'none', cursor: draft.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow: draft.trim() ? '0 4px 12px rgba(14,165,233,0.3)' : 'none',
            }}
          >
            <Send size={15} color={draft.trim() ? '#fff' : '#334155'} />
          </button>
        </div>
        <p style={{ fontSize: 11, color: '#1e3a5f', marginTop: 6, textAlign: 'center' }}>
          Press Enter to send · Shift+Enter for new line · @name to mention
        </p>
      </div>
    </div>
  );
}
