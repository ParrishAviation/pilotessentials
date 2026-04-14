import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Trophy, User, Zap, Star, ChevronRight, LogOut, Shield, LifeBuoy, MessageSquare, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const ADMIN_EMAILS = ['jack@parrishaviation.com', 'titiusmclaughlin@gmail.com'];

const navItems = [
  { to: '/app', icon: Home, label: 'Dashboard' },
  { to: '/courses', icon: BookOpen, label: 'Courses' },
  { to: '/ai-instructor', icon: null, label: 'AI Instructor', emoji: '✈️' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/chatroom', icon: MessageSquare, label: 'Chatroom' },
  { to: '/profile', icon: User, label: 'My Profile' },
  { to: '/support', icon: LifeBuoy, label: 'Support' },
];

export default function Sidebar({ onClose, collapsed, onToggleCollapse }) {
  const { user, levelPercent, xpForNextLevel } = useUser();
  const { user: authUser, signOut } = useAuth();
  const location = useLocation();
  const displayName = authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'Pilot';
  const isAdmin = ADMIN_EMAILS.includes(authUser?.email);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isIPad   = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth <= 1024;

  // When used as mobile overlay (onClose present), never collapse
  const isCollapsed = !onClose && collapsed;
  const sidebarWidth = isCollapsed ? 56 : (isIPad ? 200 : 240);

  return (
    <aside style={{
      width: sidebarWidth,
      minHeight: '100vh',
      background: 'rgba(6,15,30,0.97)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      overflowY: isCollapsed ? 'visible' : 'auto',
      overflowX: 'hidden',
      transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
      paddingTop: isMobile ? 'env(safe-area-inset-top, 0px)' : 0,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      paddingLeft: 'env(safe-area-inset-left, 0px)',
    }}>

      {/* Logo / Collapse toggle */}
      <div style={{
        padding: isCollapsed ? '20px 0' : '20px 16px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        minHeight: 64,
        flexShrink: 0,
      }}>
        {!isCollapsed && (
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 18, color: '#f1f5f9', letterSpacing: '-0.5px', whiteSpace: 'nowrap', overflow: 'hidden' }}>
            Pilot Essentials
          </div>
        )}

        {/* Mobile close / Desktop collapse toggle */}
        {onClose ? (
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', flexShrink: 0 }}>
            <X size={15} />
          </button>
        ) : onToggleCollapse ? (
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              width: isCollapsed ? 36 : 28,
              height: isCollapsed ? 36 : 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#475569', flexShrink: 0,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          >
            {isCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
          </button>
        ) : null}
      </div>

      {/* User XP Card — hidden when collapsed */}
      {!isCollapsed && (
        <div style={{ padding: '12px 12px 6px' }}>
          <div style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 12, padding: '10px 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#000', boxShadow: '0 2px 8px rgba(245,158,11,0.4)' }}>
                  {user.level}
                </div>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Level {user.level}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Zap size={11} color="#38bdf8" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8' }}>{user.xp.toLocaleString()} XP</span>
              </div>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
              <motion.div className="progress-bar" style={{ height: '100%', borderRadius: 3 }} initial={{ width: 0 }} animate={{ width: `${levelPercent}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 10, color: '#475569' }}>{levelPercent}% to next</span>
              <span style={{ fontSize: 10, color: '#475569' }}>{xpForNextLevel?.toLocaleString()} XP</span>
            </div>
          </div>
        </div>
      )}

      {/* Streak — only when expanded */}
      {!isCollapsed && user.streak > 0 && (
        <div style={{ padding: '4px 12px 6px' }}>
          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 14 }}>🔥</span>
            <span style={{ fontSize: 11, color: '#fbbf24', fontWeight: 600 }}>{user.streak}-day streak!</span>
          </div>
        </div>
      )}

      {/* Collapsed: level badge instead of XP card */}
      {isCollapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0 4px', gap: 6 }}>
          <div title={`Level ${user.level} · ${user.xp.toLocaleString()} XP`} style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#000', boxShadow: '0 2px 8px rgba(245,158,11,0.35)', cursor: 'default' }}>
            {user.level}
          </div>
          {user.streak > 0 && (
            <div title={`${user.streak}-day streak`} style={{ fontSize: 16, lineHeight: 1, cursor: 'default' }}>🔥</div>
          )}
        </div>
      )}

      {/* Nav */}
      <nav style={{ padding: isCollapsed ? '8px 0' : '8px 8px', flex: 1 }}>
        {!isCollapsed && (
          <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, padding: '6px 8px 4px' }}>Menu</div>
        )}
        {navItems.map(({ to, icon: Icon, label, emoji }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          const isAI = !!emoji;

          if (isCollapsed) {
            return (
              <NavLink
                key={to} to={to}
                title={label}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 40, height: 40, borderRadius: 10, margin: '3px auto',
                  background: isActive ? 'rgba(56,189,248,0.15)' : isAI ? 'rgba(14,165,233,0.06)' : 'transparent',
                  border: isActive ? '1px solid rgba(56,189,248,0.35)' : isAI ? '1px solid rgba(14,165,233,0.15)' : '1px solid transparent',
                  color: isActive ? '#38bdf8' : '#64748b',
                  transition: 'all 0.15s', textDecoration: 'none',
                  flexShrink: 0,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = isAI ? 'rgba(14,165,233,0.06)' : 'transparent'; }}
              >
                {emoji ? <span style={{ fontSize: 16 }}>{emoji}</span> : <Icon size={17} />}
              </NavLink>
            );
          }

          return (
            <NavLink
              key={to} to={to}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              style={{
                marginBottom: 2,
                ...(isAI && !isActive ? { background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)' } : {}),
              }}
            >
              {emoji ? <span style={{ fontSize: 16, lineHeight: 1 }}>{emoji}</span> : <Icon size={17} />}
              <span style={isAI ? { color: isActive ? '#38bdf8' : '#7dd3fc' } : {}}>{label}</span>
              {isAI && !isActive && (
                <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: 'rgba(14,165,233,0.15)', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: 0.5 }}>AI</span>
              )}
              {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
            </NavLink>
          );
        })}

        {/* Admin link */}
        {isAdmin && (
          <>
            {!isCollapsed && (
              <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, padding: '14px 8px 4px' }}>Admin</div>
            )}
            {isCollapsed ? (
              <NavLink to="/admin" title="Admin Panel"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 40, height: 40, borderRadius: 10, margin: '3px auto',
                  background: location.pathname === '/admin' ? 'rgba(129,140,248,0.2)' : 'rgba(129,140,248,0.08)',
                  border: '1px solid rgba(129,140,248,0.25)',
                  color: '#818cf8', textDecoration: 'none',
                }}
              >
                <Shield size={17} />
              </NavLink>
            ) : (
              <NavLink to="/admin"
                className={`sidebar-link ${location.pathname === '/admin' ? 'active' : ''}`}
                style={{ marginBottom: 2, background: location.pathname === '/admin' ? 'rgba(129,140,248,0.15)' : 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.2)' }}
              >
                <Shield size={17} color="#818cf8" />
                <span style={{ color: '#818cf8' }}>Admin Panel</span>
                {location.pathname === '/admin' && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5, color: '#818cf8' }} />}
              </NavLink>
            )}
          </>
        )}
      </nav>

      {/* Bottom user area */}
      <div style={{
        padding: isCollapsed ? '12px 0' : '14px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: 8,
        flexShrink: 0,
      }}>
        <div title={displayName} style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #0ea5e9, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
          {displayName[0].toUpperCase()}
        </div>
        {!isCollapsed && (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
              <div style={{ fontSize: 10, color: '#475569', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Star size={9} fill="#f59e0b" color="#f59e0b" />
                {user.earnedBadges.length} badges
              </div>
            </div>
            <button onClick={signOut} title="Sign out" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 4, borderRadius: 6, transition: 'color 0.2s', flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
              <LogOut size={14} />
            </button>
          </>
        )}
        {isCollapsed && (
          <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            {/* sign out available via long press / tooltip — kept minimal */}
          </div>
        )}
      </div>
    </aside>
  );
}
