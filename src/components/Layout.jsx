import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import XPNotification from './XPNotification';
import Confetti from './Confetti';

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#060f1e' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 240, minHeight: '100vh', position: 'relative' }}>
        <Outlet />
      </main>
      <XPNotification />
      <Confetti />
    </div>
  );
}
