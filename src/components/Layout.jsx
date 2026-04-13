import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import XPNotification from './XPNotification';
import Confetti from './Confetti';
import AIChat from './AIChat';

export default function Layout() {
  const location = useLocation();
  const hideAIChat = location.pathname === '/chatroom';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#060f1e' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 240, minHeight: '100vh', position: 'relative' }}>
        <Outlet />
      </main>
      <XPNotification />
      <Confetti />
      {!hideAIChat && <AIChat />}
    </div>
  );
}
