import { memo, useMemo } from 'react';

// Pure CSS particles — NO emojis (much lighter), NO state updates, NO re-renders
const FloatingElements = memo(function FloatingElements() {
  // Generate particles once with useMemo
  const particles = useMemo(() => {
    const items: {
      id: number;
      x: number;
      delay: number;
      duration: number;
      size: number;
      color: string;
      shape: 'circle' | 'diamond' | 'line';
    }[] = [];

    const colors = ['#8b0000', '#cc0000', '#4a0000', '#6b1010', '#3a0000'];

    for (let i = 0; i < 18; i++) {
      items.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 20,
        duration: 10 + Math.random() * 15,
        size: 4 + Math.random() * 8,
        color: colors[i % colors.length],
        shape: i % 3 === 0 ? 'diamond' : i % 3 === 1 ? 'line' : 'circle',
      });
    }
    return items;
  }, []);

  const drips = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: 8 + i * 16,
      delay: Math.random() * 12,
      duration: 8 + Math.random() * 8,
    }));
  }, []);

  const glows = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      left: 15 + i * 30,
      top: 20 + (i % 2) * 35,
      size: 180 + i * 40,
      delay: i * 1.5,
      duration: 5 + i * 2,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Blood drips — simple divs, GPU accelerated */}
      {drips.map((d) => (
        <div
          key={`drip-${d.id}`}
          className="absolute top-0 gpu-accelerated"
          style={{
            left: `${d.left}%`,
            width: '2px',
            height: '60px',
            background: 'linear-gradient(to bottom, #8b0000, #4a0000, transparent)',
            animation: `bloodDrip ${d.duration}s ease-in infinite`,
            animationDelay: `${d.delay}s`,
            borderRadius: '0 0 50% 50%',
          }}
        />
      ))}

      {/* Floating CSS particles — NO emojis */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute gpu-accelerated"
          style={{
            left: `${p.x}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'diamond' ? '2px' : '1px',
            transform: p.shape === 'diamond' ? 'rotate(45deg)' : 'none',
            animation: `floatUp ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            opacity: 0,
          }}
        />
      ))}

      {/* Ambient glow spots — opacity animation only */}
      {glows.map((g) => (
        <div
          key={`glow-${g.id}`}
          className="absolute rounded-full gpu-accelerated"
          style={{
            left: `${g.left}%`,
            top: `${g.top}%`,
            width: `${g.size}px`,
            height: `${g.size}px`,
            background: 'radial-gradient(circle, rgba(100,0,0,0.12) 0%, transparent 70%)',
            animation: `glowAmbient ${g.duration}s ease-in-out infinite`,
            animationDelay: `${g.delay}s`,
          }}
        />
      ))}
    </div>
  );
});

export default FloatingElements;
