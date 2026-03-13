import { memo, useCallback, useRef } from 'react';

interface Props {
  candlesLit: boolean;
  onBlowCandles: () => void;
  onSlice: () => void;
  slicesRemoved: number;
  phase: 'candles' | 'slicing';
}

const ChocolateCake = memo(function ChocolateCake({ candlesLit, onBlowCandles, onSlice, slicesRemoved, phase }: Props) {
  const rippleRef = useRef<HTMLDivElement>(null);
  const totalSlices = 8;
  const sliceAngle = 360 / totalSlices;

  const handleClick = useCallback(() => {
    if (phase === 'candles' && candlesLit) {
      onBlowCandles();
    } else if (phase === 'slicing' && slicesRemoved < totalSlices) {
      onSlice();
      // Ripple via DOM manipulation — no state update needed
      if (rippleRef.current) {
        const el = document.createElement('div');
        el.className = 'absolute rounded-full border-2 gpu-accelerated';
        el.style.cssText = `
          left: 50%; top: 50%; width: 40px; height: 40px;
          margin-left: -20px; margin-top: -20px;
          border-color: #8b0000;
          animation: ripple 0.8s ease-out forwards;
        `;
        rippleRef.current.appendChild(el);
        setTimeout(() => el.remove(), 800);
      }
    }
  }, [phase, candlesLit, onBlowCandles, onSlice, slicesRemoved]);

  return (
    <div className="relative flex flex-col items-center" ref={rippleRef}>
      <svg
        width="320"
        height="320"
        viewBox="0 0 320 320"
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
        onClick={handleClick}
      >
        {/* Plate */}
        <ellipse cx="160" cy="200" rx="155" ry="50" fill="#1a1a1a" stroke="#8b7500" strokeWidth="2" />
        <ellipse cx="160" cy="198" rx="150" ry="47" fill="none" stroke="#6b5500" strokeWidth="1" strokeDasharray="4 4" />

        {/* Cake base shadow */}
        <ellipse cx="160" cy="200" rx="120" ry="38" fill="rgba(0,0,0,0.5)" />

        {/* Cake body */}
        <rect x="40" y="120" width="240" height="80" rx="4" fill="url(#darkChoc)" />
        <ellipse cx="160" cy="120" rx="120" ry="38" fill="url(#darkChocTop)" />
        <ellipse cx="160" cy="200" rx="120" ry="38" fill="#1a0a00" />

        {/* Chocolate layers */}
        <rect x="40" y="155" width="240" height="4" fill="#2a1000" opacity="0.6" />
        <rect x="40" y="145" width="240" height="2" fill="#3a1800" opacity="0.4" />

        {/* Blood red drip on sides */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <path
            key={`drip-${i}`}
            d={`M${60 + i * 30},120 Q${65 + i * 30},${140 + (i % 3) * 15} ${60 + i * 30},${145 + (i % 3) * 15}`}
            stroke="#5a0000"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
        ))}

        {/* "SÓ MINHA" text on cake */}
        <text x="160" y="165" textAnchor="middle" fill="#8b0000" fontSize="14"
          fontFamily="'Great Vibes', cursive" opacity="0.9">
          Só Minha
        </text>
        <text x="160" y="180" textAnchor="middle" fill="#5a0000" fontSize="10" opacity="0.6">
          ⛓ ⛓ ⛓ ⛓ ⛓
        </text>

        {/* Removed slices */}
        {Array.from({ length: slicesRemoved }).map((_, i) => (
          <path
            key={`removed-${i}`}
            d={`M160,120 L${160 + 115 * Math.cos((sliceAngle * i - 90) * Math.PI / 180)},${120 + 35 * Math.sin((sliceAngle * i - 90) * Math.PI / 180)} A115,35 0 0,1 ${160 + 115 * Math.cos((sliceAngle * (i + 1) - 90) * Math.PI / 180)},${120 + 35 * Math.sin((sliceAngle * (i + 1) - 90) * Math.PI / 180)} Z`}
            fill="#0a0000"
            opacity="0.8"
          />
        ))}

        {/* Thorns */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const x1 = 160 + 125 * Math.cos(angle);
          const y1 = 120 + 40 * Math.sin(angle);
          const x2 = 160 + 133 * Math.cos(angle);
          const y2 = 120 + 43 * Math.sin(angle);
          return (
            <line key={`thorn-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#3a1800" strokeWidth="2" opacity="0.4" />
          );
        })}

        {/* Candles */}
        {candlesLit && phase === 'candles' && [0, 1, 2, 3, 4].map(i => {
          const cx = 100 + i * 30;
          return (
            <g key={`candle-${i}`}>
              <rect x={cx - 4} y="80" width="8" height="40" rx="2"
                fill={i % 2 === 0 ? '#1a0000' : '#3a0000'} />
              <rect x={cx - 3} y="82" width="2" height="36" rx="1"
                fill="rgba(255,255,255,0.05)" />
              {/* Flame — NO blur filter */}
              <g className="gpu-accelerated"
                style={{ animation: `flicker ${0.3 + i * 0.1}s ease-in-out infinite` }}>
                <ellipse cx={cx} cy="76" rx="5" ry="10" fill="#cc3300" opacity="0.8" />
                <ellipse cx={cx} cy="74" rx="3" ry="7" fill="#ff6600" />
                <ellipse cx={cx} cy="72" rx="2" ry="4" fill="#ffcc00" />
                <ellipse cx={cx} cy="76" rx="10" ry="12" fill="rgba(180,50,0,0.1)" />
              </g>
            </g>
          );
        })}

        {/* Smoke after blowing — limited to 3 */}
        {!candlesLit && phase === 'candles' && [0, 2, 4].map(i => {
          const cx = 100 + i * 30;
          return (
            <circle key={`smoke-${i}`} cx={cx} cy="75" r="3" fill="rgba(150,150,150,0.3)"
              className="gpu-accelerated"
              style={{ animation: `smokeRise 3s ease-out forwards`, animationDelay: `${i * 0.15}s` }} />
          );
        })}

        {/* Gradients */}
        <defs>
          <linearGradient id="darkChoc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a1200" />
            <stop offset="50%" stopColor="#1a0800" />
            <stop offset="100%" stopColor="#0f0400" />
          </linearGradient>
          <radialGradient id="darkChocTop" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#3a1a00" />
            <stop offset="60%" stopColor="#2a1000" />
            <stop offset="100%" stopColor="#1a0800" />
          </radialGradient>
        </defs>
      </svg>

      {/* Knife */}
      {phase === 'slicing' && slicesRemoved < totalSlices && (
        <div className="mt-3 text-2xl gpu-accelerated" style={{ animation: 'gentlePulse 1.5s ease-in-out infinite' }}>
          🔪
        </div>
      )}
    </div>
  );
});

export default ChocolateCake;
