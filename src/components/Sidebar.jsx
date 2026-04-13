import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Trophy, User, Zap, Star, ChevronRight, LogOut, Shield, LifeBuoy, MessageSquare } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const ADMIN_EMAILS = ['jack@parrishaviation.com', 'titiusmclaughlin@gmail.com'];

const navItems = [
  { to: '/app', icon: Home, label: 'Dashboard' },
  { to: '/courses', icon: BookOpen, label: 'Courses' },
  { to: '/ai-instructor', icon: null, label: 'AI Instructor', emoji: '✈️' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/chatroom', icon: MessageSquare, label: 'Student Chatroom' },
  { to: '/profile', icon: User, label: 'My Profile' },
  { to: '/support', icon: LifeBuoy, label: 'Support' },
];

export default function Sidebar() {
  const { user, levelPercent, xpForNextLevel } = useUser();
  const { user: authUser, signOut } = useAuth();
  const location = useLocation();
  const displayName = authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'Pilot';
  const isAdmin = ADMIN_EMAILS.includes(authUser?.email);

  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: 'rgba(6,15,30,0.95)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 20, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
          Pilot Essentials
        </div>
      </div>

      {/* User XP Card */}
      <div style={{ padding: '16px 16px 8px' }}>
        <div style={{
          background: 'rgba(14,165,233,0.08)',
          border: '1px solid rgba(14,165,233,0.2)',
          borderRadius: 12,
          padding: '12px 14px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#000',
                boxShadow: '0 2px 8px rgba(245,158,11,0.4)',
              }}>
                {user.level}
              </div>
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Level {user.level}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Zap size={12} color="#38bdf8" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8' }}>{user.xp.toLocaleString()} XP</span>
            </div>
          </div>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
            <motion.div
              className="progress-bar"
              style={{ height: '100%', borderRadius: 3 }}
              initial={{ width: 0 }}
              animate={{ width: `${levelPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 10, color: '#475569' }}>{levelPercent}% to next level</span>
            <span style={{ fontSize: 10, color: '#475569' }}>{xpForNextLevel?.toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      {/* Streak */}
      {user.streak > 0 && (
        <div style={{ padding: '4px 16px 8px' }}>
          <div style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 10,
            padding: '8px 12px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>🔥</span>
            <span style={{ fontSize: 12, color: '#fbbf24', fontWeight: 600 }}>{user.streak}-day streak!</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ padding: '8px 12px', flex: 1 }}>
        <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, padding: '8px 8px 4px' }}>Menu</div>
        {navItems.map(({ to, icon: Icon, label, emoji }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          const isAI = !!emoji;
          return (
            <NavLink
              key={to} to={to}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              style={{
                marginBottom: 2,
                ...(isAI && !isActive ? {
                  background: 'rgba(14,165,233,0.06)',
                  border: '1px solid rgba(14,165,233,0.15)',
                } : {}),
              }}
            >
              {emoji
                ? <span style={{ fontSize: 16, lineHeight: 1 }}>{emoji}</span>
                : <Icon size={17} />}
              <span style={isAI ? { color: isActive ? '#38bdf8' : '#7dd3fc' } : {}}>{label}</span>
              {isAI && !isActive && (
                <span style={{
                  marginLeft: 'auto', fontSize: 9, fontWeight: 800,
                  padding: '2px 6px', borderRadius: 4,
                  background: 'rgba(14,165,233,0.15)', color: '#38bdf8',
                  textTransform: 'uppercase', letterSpacing: 0.5,
                }}>AI</span>
              )}
              {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
            </NavLink>
          );
        })}

        {/* Admin link — only visible to master accounts */}
        {isAdmin && (
          <>
            <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, padding: '16px 8px 4px' }}>Admin</div>
            <NavLink
              to="/admin"
              className={`sidebar-link ${location.pathname === '/admin' ? 'active' : ''}`}
              style={{
                marginBottom: 2,
                background: location.pathname === '/admin'
                  ? 'rgba(129,140,248,0.15)'
                  : 'rgba(129,140,248,0.06)',
                border: '1px solid rgba(129,140,248,0.2)',
              }}
            >
              <Shield size={17} color="#818cf8" />
              <span style={{ color: '#818cf8' }}>Video Manager</span>
              {location.pathname === '/admin' && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5, color: '#818cf8' }} />}
            </NavLink>
          </>
        )}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #0ea5e9, #818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {displayName[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
            <div style={{ fontSize: 11, color: '#475569', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Star size={10} fill="#f59e0b" color="#f59e0b" />
              {user.earnedBadges.length} badges
            </div>
          </div>
          <button
            onClick={signOut}
            title="Sign out"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 4, borderRadius: 6, transition: 'color 0.2s', flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={e => e.currentTarget.style.color = '#475569'}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
