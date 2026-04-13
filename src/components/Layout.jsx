import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import XPNotification from './XPNotification';
import Confetti from './Confetti';
import AIChat from './AIChat';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const location = useLocation();
  const hideAIChat = location.pathname === '/chatroom';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile nav tap)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setSidebarOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#060f1e' }}>

      {/* Desktop sidebar — always visible ≥768px */}
      <div className="sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 199,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(2px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar — slides in */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="mobile-sidebar"
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 200 }}
            className="sidebar-mobile"
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="main-content" style={{ flex: 1, minHeight: '100vh', position: 'relative' }}>

        {/* Mobile top bar */}
        <div className="mobile-topbar">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#f1f5f9', flexShrink: 0,
            }}
          >
            <Menu size={20} />
          </button>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 18, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
            Pilot Essentials
          </span>
          <div style={{ width: 40 }} />{/* spacer to centre title */}
        </div>

        <Outlet />
      </main>

      <XPNotification />
      <Confetti />
      {!hideAIChat && <AIChat />}

      <style>{`
        .sidebar-desktop { display: block; }
        .sidebar-mobile  { display: block; }
        .mobile-topbar   { display: none; }
        .main-content    { margin-left: 240px; }

        @media (max-width: 767px) {
          .sidebar-desktop { display: none; }
          .mobile-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: rgba(6,15,30,0.95);
            border-bottom: 1px solid rgba(255,255,255,0.06);
            backdrop-filter: blur(12px);
            position: sticky;
            top: 0;
            z-index: 50;
          }
          .main-content { margin-left: 0; }
        }
      `}</style>
    </div>
  );
}
