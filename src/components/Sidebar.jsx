import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Trophy, User, Zap, Star, ChevronRight, Plane } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/courses', icon: BookOpen, label: 'Courses' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/profile', icon: User, label: 'My Profile' },
];

export default function Sidebar() {
  const { user, levelPercent, xpForNextLevel } = useUser();
  const location = useLocation();

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(14,165,233,0.4)',
            fontSize: 18,
          }}>
            ✈️
          </div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
              SkyAce
            </div>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 }}>
              Pilot Training
            </div>
          </div>
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
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <NavLink key={to} to={to} className={`sidebar-link ${isActive ? 'active' : ''}`} style={{ marginBottom: 2 }}>
              <Icon size={17} />
              <span>{label}</span>
              {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #0ea5e9, #818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff',
          }}>
            P
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Pilot Student</div>
            <div style={{ fontSize: 11, color: '#475569', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Star size={10} fill="#f59e0b" color="#f59e0b" />
              {user.earnedBadges.length} badges
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
