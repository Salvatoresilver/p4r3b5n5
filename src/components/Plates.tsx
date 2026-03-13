import { memo } from 'react';

interface Props {
  filledPlates: number;
  totalPlates: number;
}

const possessiveMessages = [
  "Minha. Pra sempre.",
  "Ninguém te toca.",
  "Eu sou seu dono.",
  "Você me obedece. 🖤",
  "Perto ou longe, MINHA.",
  "Até após a morte. ⛓️",
  "Sem escapatória.",
  "Querendo ou não. 🔥",
];

const Plates = memo(function Plates({ filledPlates, totalPlates }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
      {Array.from({ length: totalPlates }).map((_, i) => {
        const filled = i < filledPlates;
        return (
          <div
            key={i}
            className="relative flex flex-col items-center gpu-accelerated"
            style={{
              animation: filled ? `fadeInUp 0.5s ease-out forwards` : 'none',
            }}
          >
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: filled
                  ? 'radial-gradient(circle, #1a0a00, #0f0500)'
                  : 'radial-gradient(circle, #0f0f0f, #080808)',
                border: filled ? '2px solid #8b5a00' : '2px solid #1a1a1a',
                boxShadow: filled
                  ? '0 0 12px rgba(139,90,0,0.25)'
                  : 'none',
              }}
            >
              {filled ? (
                <div className="text-2xl">🍰</div>
              ) : (
                <div className="text-xs text-gray-700 opacity-30">{i + 1}</div>
              )}

              {filled && (
                <div className="absolute inset-1 rounded-full border"
                  style={{ borderColor: 'rgba(139,90,0,0.15)' }} />
              )}
            </div>

            {filled && (
              <div className="mt-1 text-center gpu-accelerated"
                style={{ animation: 'fadeIn 0.6s ease-out forwards' }}>
                <span className="text-xs block leading-tight"
                  style={{
                    fontFamily: "'Great Vibes', cursive",
                    color: '#8b0000',
                    fontSize: '11px',
                  }}>
                  {possessiveMessages[i]}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

export default Plates;
