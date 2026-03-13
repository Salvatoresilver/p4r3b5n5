import { memo, useMemo } from 'react';

// CSS-only confetti — no emojis, no state updates, GPU accelerated
const Confetti = memo(function Confetti() {
  const pieces = useMemo(() => {
    const colors = ['#8b0000', '#cc0000', '#4a0000', '#ffd700', '#b8860b', '#1a0000'];
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[i % colors.length],
      delay: Math.random() * 2,
      duration: 2.5 + Math.random() * 3,
      size: 6 + Math.random() * 10,
      isRound: i % 3 === 0,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 gpu-accelerated"
          style={{
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: p.isRound ? `${p.size}px` : `${p.size * 0.6}px`,
            background: p.color,
            borderRadius: p.isRound ? '50%' : '2px',
            animation: `confettiFall ${p.duration}s ease-in forwards`,
            animationDelay: `${p.delay}s`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
});

export default Confetti;
