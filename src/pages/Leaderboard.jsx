import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

function Avatar({ initials, gradient, size = 44 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: gradient || 'linear-gradient(135deg, #0ea5e9, #818cf8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.32, fontWeight: 700, color: '#fff',
      flexShrink: 0,
    }}>
      {initials || '?'}
    </div>
  );
}

function getInitials(entry) {
  const name = entry.full_name || entry.username || '';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || '??';
}

function getDisplayName(entry) {
  return entry.full_name || entry.username || 'Pilot';
}

function TopThreeCard({ entry, rank, isCurrentUser }) {
  const gradients = [
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #94a3b8, #64748b)',
    'linear-gradient(135deg, #cd7c43, #a85d2e)',
  ];
  const glows = [
    'rgba(245,158,11,0.4)',
    'rgba(148,163,184,0.3)',
    'rgba(205,124,67,0.3)',
  ];
  const crowns = ['👑', '🥈', '🥉'];
  const sizes = [80, 68, 68];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        padding: '24px 20px', borderRadius: 20,
        background: isCurrentUser ? 'rgba(14,165,233,0.08)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${rank === 1 ? 'rgba(245,158,11,0.3)' : isCurrentUser ? 'rgba(14,165,233,0.3)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: `0 8px 32px ${glows[rank - 1]}`,
        flex: 1,
        order: rank === 1 ? 0 : rank === 2 ? -1 : 1,
        marginTop: rank === 1 ? 0 : 24,
      }}
    >
      <div style={{ fontSize: 28 }}>{crowns[rank - 1]}</div>
      <Avatar
        initials={getInitials(entry)}
        gradient={isCurrentUser ? 'linear-gradient(135deg, #0ea5e9, #818cf8)' : gradients[rank - 1]}
        size={sizes[rank - 1]}
      />
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 16, fontWeight: 700,
          color: isCurrentUser ? '#38bdf8' : '#f1f5f9',
          ...(rank === 1 ? { fontFamily: "'Space Grotesk', sans-serif" } : {}),
        }}>
          {getDisplayName(entry)} {isCurrentUser && <span style={{ fontSize: 11, color: '#38bdf8' }}>(You)</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 4 }}>
          <Zap size={13} color="#f59e0b" />
          <span style={{ fontSize: 15, fontWeight: 800, color: rank === 1 ? '#fbbf24' : '#94a3b8' }}>
            {(entry.xp || 0).toLocaleString()} XP
          </span>
        </div>
        {entry.streak > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 4 }}>
            <span style={{ fontSize: 12 }}>🔥</span>
            <span style={{ fontSize: 12, color: '#f87171', fontWeight: 600 }}>{entry.streak}d</span>
          </div>
        )}
      </div>
      <div style={{
        padding: '4px 14px', borderRadius: 20,
        background: gradients[rank - 1],
        fontSize: 12, fontWeight: 800, color: rank === 1 ? '#000' : '#fff',
      }}>
        #{rank}
      </div>
    </motion.div>
  );
}

export default function Leaderboard() {
  const { user } = useUser();
  const { user: authUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('leaderboard')
      .select('id, username, full_name, xp, level, streak, rank')
      .then(({ data }) => {
        setEntries(data || []);
        setLoading(false);
      });
  }, []);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const userEntry = authUser ? entries.find(e => e.id === authUser.id) : null;

  return (
    <div className="page-container" style={{ padding: '32px 36px', maxWidth: 800 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
        <span style={{ fontSize: 12, color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
          Global Rankings
        </span>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif", margin: '6px 0 8px', letterSpacing: '-0.5px' }}>
          Leaderboard
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', margin: 0 }}>
          Compete with fellow pilots worldwide. Earn XP to climb the ranks!
        </p>
      </motion.div>

      {/* Your rank highlight */}
      {userEntry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'linear-gradient(135deg, rgba(14,165,233,0.12), rgba(139,92,246,0.08))',
            border: '1px solid rgba(14,165,233,0.3)',
            borderRadius: 16, padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, color: '#38bdf8' }}>Your Rank</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#38bdf8', fontFamily: "'Space Grotesk', sans-serif" }}>
            #{userEntry.rank}
          </div>
          <div style={{ flex: 1 }} />
          <Zap size={14} color="#f59e0b" />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b' }}>{(user.xp || 0).toLocaleString()} XP</span>
          {user.streak > 0 && (
            <span style={{ fontSize: 13, fontWeight: 600, color: '#f87171' }}>🔥 {user.streak}d</span>
          )}
        </motion.div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <div style={{ fontSize: 14 }}>Loading rankings...</div>
        </div>
      ) : entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>
          <div style={{ fontSize: 16, color: '#64748b', marginBottom: 4 }}>No rankings yet</div>
          <div style={{ fontSize: 13, color: '#334155' }}>Be the first to earn XP and top the charts!</div>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {top3.length >= 3 && (
            <div style={{ display: 'flex', gap: 16, marginBottom: 32, alignItems: 'flex-end' }}>
              {top3.map((entry, i) => (
                <TopThreeCard
                  key={entry.id}
                  entry={entry}
                  rank={i + 1}
                  isCurrentUser={authUser && entry.id === authUser.id}
                />
              ))}
            </div>
          )}

          {/* Rest of Leaderboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(top3.length < 3 ? entries : rest).map((entry, i) => {
              const isCurrentUser = authUser && entry.id === authUser.id;
              const rankNum = top3.length < 3 ? i + 1 : i + 4;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '14px 20px', borderRadius: 14,
                    background: isCurrentUser ? 'rgba(14,165,233,0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isCurrentUser ? 'rgba(14,165,233,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  <div style={{
                    width: 32, textAlign: 'center',
                    fontSize: 14, fontWeight: 700,
                    color: isCurrentUser ? '#38bdf8' : '#475569',
                  }}>
                    #{rankNum}
                  </div>
                  <Avatar
                    initials={getInitials(entry)}
                    gradient={isCurrentUser
                      ? 'linear-gradient(135deg, #0ea5e9, #818cf8)'
                      : 'linear-gradient(135deg, #1e3a5f, #334155)'}
                    size={38}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: isCurrentUser ? '#38bdf8' : '#e2e8f0' }}>
                      {getDisplayName(entry)} {isCurrentUser && <span style={{ fontSize: 11, color: '#38bdf8' }}>(You)</span>}
                    </div>
                    {entry.streak > 0 && (
                      <div style={{ fontSize: 12, color: '#f87171', marginTop: 2 }}>🔥 {entry.streak}-day streak</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Zap size={13} color="#f59e0b" />
                    <span style={{ fontSize: 14, fontWeight: 700, color: isCurrentUser ? '#38bdf8' : '#94a3b8' }}>
                      {(entry.xp || 0).toLocaleString()} XP
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* Footer motivator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          marginTop: 32, textAlign: 'center',
          padding: '24px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16,
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 8 }}>🚀</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
          Keep learning to climb the ranks!
        </div>
        <div style={{ fontSize: 13, color: '#475569' }}>
          Complete lessons and quizzes to earn XP and beat the competition.
        </div>
      </motion.div>
    </div>
  );
}
