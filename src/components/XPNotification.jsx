import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';

export default function XPNotification() {
  const { notifications } = useUser();

  return (
    <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 9000, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
      <AnimatePresence>
        {notifications.map(n => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 60, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              padding: '10px 18px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backdropFilter: 'blur(12px)',
              border: '1px solid',
              ...(n.type === 'xp' ? {
                background: 'rgba(14,165,233,0.2)',
                borderColor: 'rgba(14,165,233,0.5)',
                color: '#38bdf8',
                boxShadow: '0 4px 20px rgba(14,165,233,0.3)'
              } : n.type === 'levelup' ? {
                background: 'rgba(139,92,246,0.25)',
                borderColor: 'rgba(139,92,246,0.6)',
                color: '#c084fc',
                boxShadow: '0 4px 20px rgba(139,92,246,0.4)'
              } : n.type === 'badge' ? {
                background: 'rgba(245,158,11,0.2)',
                borderColor: 'rgba(245,158,11,0.5)',
                color: '#fbbf24',
                boxShadow: '0 4px 20px rgba(245,158,11,0.3)'
              } : {
                background: 'rgba(34,197,94,0.15)',
                borderColor: 'rgba(34,197,94,0.4)',
                color: '#4ade80',
              })
            }}
          >
            {n.type === 'xp' && '⚡'}
            {n.type === 'levelup' && '🚀'}
            {n.type === 'badge' && '🏆'}
            {n.type === 'info' && '✈️'}
            {n.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
