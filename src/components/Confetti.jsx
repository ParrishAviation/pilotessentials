import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';

const COLORS = ['#38bdf8', '#818cf8', '#c084fc', '#f59e0b', '#22c55e', '#f472b6', '#fb923c'];

export default function Confetti() {
  const { showConfetti } = useUser();
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!showConfetti) { setPieces([]); return; }
    const newPieces = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2.5 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }));
    setPieces(newPieces);
    return () => setPieces([]);
  }, [showConfetti]);

  if (!showConfetti || !pieces.length) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            top: -20,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
