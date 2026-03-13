import { useState, useEffect, useCallback, useRef, memo } from 'react';
import FloatingElements from './components/FloatingElements';
import ChocolateCake from './components/ChocolateCake';
import Plates from './components/Plates';
import Confetti from './components/Confetti';
import RomanticMessage from './components/RomanticMessage';
import Heartbeat from './components/Heartbeat';

type GamePhase = 'welcome' | 'oath' | 'candles' | 'slicing' | 'message';

// Mouse glow that follows cursor — uses DOM directly, ZERO re-renders
const MouseGlow = memo(function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    const handleMouse = (e: MouseEvent) => {
      targetX = e.clientX - 100;
      targetY = e.clientY - 100;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouse, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-[1] rounded-full"
      style={{
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(100,0,0,0.06) 0%, transparent 70%)',
        top: 0,
        left: 0,
        willChange: 'transform',
      }}
    />
  );
});

function App() {
  const [phase, setPhase] = useState<GamePhase>('welcome');
  const [candlesLit, setCandlesLit] = useState(true);
  const [slicesRemoved, setSlicesRemoved] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [showWelcomeButton, setShowWelcomeButton] = useState(false);
  const [oathStep, setOathStep] = useState(0);
  const [oathTyped, setOathTyped] = useState('');
  const [showOathButton, setShowOathButton] = useState(false);

  const totalSlices = 8;
  const totalPlates = 8;

  // WELCOME TYPEWRITER — uses ref for char index to avoid closure issues
  const welcomeTexts = [
    "Eu preparei algo pra você...",
    "Algo feito com obsessão. Com posse.",
    "Com um amor que queima, que sufoca, que marca.",
    "Porque você é MINHA.",
    "Querendo ou não. 🖤⛓️",
  ];

  useEffect(() => {
    if (phase !== 'welcome') return;
    if (welcomeStep >= welcomeTexts.length) {
      const t = setTimeout(() => setShowWelcomeButton(true), 800);
      return () => clearTimeout(t);
    }

    const text = welcomeTexts[welcomeStep];
    let charIndex = 0;
    setTypedText('');

    const typeInterval = setInterval(() => {
      if (charIndex <= text.length) {
        setTypedText(text.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setWelcomeStep(prev => prev + 1), 900);
      }
    }, 55);

    return () => clearInterval(typeInterval);
  }, [phase, welcomeStep]);

  // OATH TYPEWRITER
  const oathTexts = [
    "Eu juro:",
    "Eu vou te amar pra sempre.",
    "Vou te proteger com minha vida.",
    "Vou cuidar de você até depois da morte.",
    "Perto ou longe — você é MINHA.",
    "Eu sou seu dono. Você me obedece.",
    "E eu? Eu morro por você. 🔥",
    "Essa é minha promessa eterna. ⛓️💀",
  ];

  useEffect(() => {
    if (phase !== 'oath') return;
    if (oathStep >= oathTexts.length) {
      const t = setTimeout(() => setShowOathButton(true), 800);
      return () => clearTimeout(t);
    }

    const text = oathTexts[oathStep];
    let charIndex = 0;
    setOathTyped('');

    const typeInterval = setInterval(() => {
      if (charIndex <= text.length) {
        setOathTyped(text.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setOathStep(prev => prev + 1), 700);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [phase, oathStep]);

  const handleBlowCandles = useCallback(() => {
    setCandlesLit(false);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setTimeout(() => setPhase('slicing'), 800);
    }, 2500);
  }, []);

  const handleSlice = useCallback(() => {
    if (slicesRemoved < totalSlices) {
      const newCount = slicesRemoved + 1;
      setSlicesRemoved(newCount);
      if (newCount >= totalSlices) {
        setTimeout(() => {
          setShowConfetti(true);
          setTimeout(() => {
            setShowConfetti(false);
            setPhase('message');
          }, 2000);
        }, 600);
      }
    }
  }, [slicesRemoved]);

  return (
    <div className="min-h-screen relative"
      style={{
        background: 'radial-gradient(ellipse at center, #1a0500 0%, #0f0200 30%, #0a0000 60%, #050000 100%)',
      }}
    >
      {/* Static overlays — no animation cost */}
      <div className="vignette" />
      <div className="blood-top" />
      <div className="blood-bottom" />

      {/* Lightweight animated overlays */}
      <Heartbeat />
      <FloatingElements />
      <MouseGlow />

      {/* Confetti — only rendered when needed */}
      {showConfetti && <Confetti />}

      {/* MAIN CONTENT */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">

        {/* ========== PHASE: WELCOME ========== */}
        {phase === 'welcome' && (
          <div className="text-center max-w-2xl mx-auto">
            {/* Chain decoration */}
            <div className="mb-6 text-2xl opacity-25 gpu-accelerated"
              style={{ animation: 'rattleChain 2.5s ease-in-out infinite' }}>
              ⛓️ ⛓️ ⛓️ ⛓️ ⛓️
            </div>

            {/* Title */}
            <h1 className="mb-8 gpu-accelerated"
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 'clamp(24px, 5vw, 42px)',
                fontWeight: 900,
                color: '#cc0000',
                lineHeight: 1.2,
                animation: 'fadeIn 2s ease-out forwards',
              }}
            >
              Feliz Aniversário
              <br />
              <span style={{ color: '#ffd700' }}>Minha Gostosa</span>
            </h1>

            {/* Subtitle */}
            <div className="mb-8 gpu-accelerated" style={{ animation: 'fadeIn 3s ease-out forwards' }}>
              <p style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '22px',
                color: '#8b0000',
              }}>
                ⛓️ Você é minha. Pra sempre. ⛓️
              </p>
            </div>

            {/* Previous texts */}
            <div className="mb-4 space-y-2">
              {welcomeTexts.slice(0, welcomeStep).map((text, i) => (
                <p key={i}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: i >= 3 ? '22px' : '19px',
                    color: i >= 3 ? '#cc0000' : '#b89878',
                    fontWeight: i >= 3 ? 700 : 400,
                    fontStyle: 'italic',
                    opacity: 0.6,
                  }}
                >
                  {text}
                </p>
              ))}
            </div>

            {/* Currently typing */}
            {welcomeStep < welcomeTexts.length && (
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: welcomeStep >= 3 ? '24px' : '20px',
                color: welcomeStep >= 3 ? '#cc0000' : '#e8c4a0',
                fontWeight: welcomeStep >= 3 ? 700 : 400,
                fontStyle: 'italic',
                minHeight: '30px',
              }}>
                {typedText}
                <span className="inline-block w-0.5 h-5 ml-1 align-middle"
                  style={{ background: '#cc0000', animation: 'blink 0.7s infinite' }} />
              </p>
            )}

            {/* Button */}
            {showWelcomeButton && (
              <button
                onClick={() => setPhase('oath')}
                className="mt-10 px-10 py-4 rounded-lg transition-transform duration-200 hover:scale-110 group gpu-accelerated"
                style={{
                  background: 'linear-gradient(135deg, #3a0000, #5a0000, #3a0000)',
                  border: '2px solid #8b0000',
                  boxShadow: '0 0 25px rgba(139,0,0,0.3)',
                  animation: 'scaleIn 0.8s ease-out forwards',
                  fontFamily: "'Cinzel Decorative', serif",
                  color: '#ffd700',
                  fontSize: '16px',
                  letterSpacing: '3px',
                }}
              >
                <span className="group-hover:hidden">⛓️ ENTRAR ⛓️</span>
                <span className="hidden group-hover:inline">🔥 SEM VOLTA 🔥</span>
              </button>
            )}

            {/* Footer */}
            <div className="mt-12 opacity-20 text-xs" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#5a0000' }}>
              💀 feito com obsessão • posse • amor eterno • sem escapatória 💀
            </div>
          </div>
        )}

        {/* ========== PHASE: OATH ========== */}
        {phase === 'oath' && (
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="text-3xl mb-4 gpu-accelerated" style={{ animation: 'rattleChain 2.5s ease-in-out infinite' }}>
                ⛓️💀⛓️
              </div>
              <h2 style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 'clamp(18px, 4vw, 28px)',
                color: '#8b0000',
                fontWeight: 900,
                letterSpacing: '4px',
                animation: 'fadeIn 1s ease-out forwards',
              }}>
                JURAMENTO DE POSSE
              </h2>
              <div className="mt-2 mx-auto w-48 h-px" style={{ background: 'linear-gradient(90deg, transparent, #8b0000, transparent)' }} />
            </div>

            {/* Oath lines */}
            <div className="mb-4 space-y-3">
              {oathTexts.slice(0, oathStep).map((text, i) => (
                <p key={i}
                  style={{
                    fontFamily: i === 0 ? "'Cinzel Decorative', serif" : "'Cormorant Garamond', serif",
                    fontSize: i === 0 ? '24px' : '19px',
                    color: i === 0 ? '#ffd700' : (text.includes('MINHA') || text.includes('dono') ? '#cc0000' : '#b89878'),
                    fontWeight: i === 0 ? 900 : (text.includes('MINHA') || text.includes('dono') ? 700 : 400),
                    fontStyle: i === 0 ? 'normal' : 'italic',
                    opacity: 0.6,
                  }}
                >
                  {text}
                </p>
              ))}
            </div>

            {/* Currently typing oath */}
            {oathStep < oathTexts.length && (
              <p style={{
                fontFamily: oathStep === 0 ? "'Cinzel Decorative', serif" : "'Cormorant Garamond', serif",
                fontSize: oathStep === 0 ? '26px' : '20px',
                color: oathStep === 0 ? '#ffd700' : '#e8c4a0',
                fontWeight: oathStep === 0 ? 900 : 400,
                fontStyle: oathStep === 0 ? 'normal' : 'italic',
                minHeight: '30px',
              }}>
                {oathTyped}
                <span className="inline-block w-0.5 h-5 ml-1 align-middle"
                  style={{ background: '#cc0000', animation: 'blink 0.7s infinite' }} />
              </p>
            )}

            {/* Oath button */}
            {showOathButton && (
              <div className="gpu-accelerated" style={{ animation: 'scaleIn 0.8s ease-out forwards' }}>
                <div className="mt-8 mb-4">
                  <div className="mx-auto w-64 h-px" style={{ background: 'linear-gradient(90deg, transparent, #5a0000, transparent)' }} />
                </div>
                <p className="mb-6 text-sm" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#5a0000', fontStyle: 'italic' }}>
                  "Essa é a promessa de quem te ama além da vida."
                </p>
                <button
                  onClick={() => setPhase('candles')}
                  className="px-10 py-4 rounded-lg transition-transform duration-200 hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #2a0000, #4a0000, #2a0000)',
                    border: '2px solid #8b0000',
                    boxShadow: '0 0 25px rgba(139,0,0,0.3)',
                    fontFamily: "'Cinzel Decorative', serif",
                    color: '#ffd700',
                    fontSize: '14px',
                    letterSpacing: '3px',
                  }}
                >
                  ⛓️ ACEITAR O JURAMENTO ⛓️
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========== PHASE: CANDLES ========== */}
        {phase === 'candles' && (
          <div className="text-center gpu-accelerated"
            style={{ animation: 'fadeInUp 1s ease-out forwards' }}>
            <h2 className="mb-2"
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 'clamp(18px, 4vw, 26px)',
                color: '#cc0000',
                fontWeight: 900,
                letterSpacing: '2px',
              }}>
              Sopre as Velas, Minha Gostosa
            </h2>

            <p className="mb-6" style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: '18px',
              color: '#b89878',
            }}>
              {candlesLit
                ? "Faz um pedido... mas eu já sou tudo que você precisa 🖤"
                : "As chamas se apagaram... mas o meu fogo por você nunca apaga 🔥"
              }
            </p>

            <ChocolateCake
              candlesLit={candlesLit}
              onBlowCandles={handleBlowCandles}
              onSlice={() => {}}
              slicesRemoved={0}
              phase="candles"
            />

            {candlesLit && (
              <p className="mt-6 text-sm gpu-accelerated" style={{ color: '#5a0000', fontFamily: "'Cormorant Garamond', serif", animation: 'gentlePulse 2s ease-in-out infinite' }}>
                ⛓️ Clique no bolo para soprar ⛓️
              </p>
            )}

            {!candlesLit && (
              <div className="mt-6 gpu-accelerated" style={{ animation: 'fadeIn 2s ease-out forwards' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', color: '#8b0000', fontStyle: 'italic' }}>
                  "Seu desejo? Já foi realizado. Eu tô aqui." ⛓️
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========== PHASE: SLICING ========== */}
        {phase === 'slicing' && (
          <div className="text-center w-full max-w-4xl mx-auto gpu-accelerated"
            style={{ animation: 'fadeInUp 1s ease-out forwards' }}>
            <h2 className="mb-1"
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 'clamp(16px, 3.5vw, 24px)',
                color: '#cc0000',
                fontWeight: 900,
                letterSpacing: '2px',
              }}>
              Fatia Pra Mim, Gostosa 🔪
            </h2>

            <p className="mb-1" style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: '16px',
              color: '#b89878',
            }}>
              Cada corte é uma promessa: você é minha e de mais ninguém.
            </p>

            {/* Badge */}
            <div className="mb-4 inline-block px-4 py-1 rounded-full" style={{
              background: 'rgba(139,0,0,0.12)',
              border: '1px solid rgba(139,0,0,0.25)',
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: '10px',
              color: '#8b0000',
              letterSpacing: '3px',
            }}>
              ⛓️ EU NÃO DIVIDO O QUE É MEU ⛓️
            </div>

            <ChocolateCake
              candlesLit={false}
              onBlowCandles={() => {}}
              onSlice={handleSlice}
              slicesRemoved={slicesRemoved}
              phase="slicing"
            />

            {/* Progress bar */}
            <div className="mt-4 mb-6 max-w-xs mx-auto">
              <div className="flex justify-between text-xs mb-1" style={{ color: '#5a0000', fontFamily: "'Cormorant Garamond', serif" }}>
                <span>⛓️ Fatias</span>
                <span>{slicesRemoved}/{totalSlices} ⛓️</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#1a0800', border: '1px solid #2a1000' }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(slicesRemoved / totalSlices) * 100}%`,
                    background: 'linear-gradient(90deg, #5a0000, #8b0000, #cc0000)',
                  }}
                />
              </div>
            </div>

            <Plates filledPlates={slicesRemoved} totalPlates={totalPlates} />

            {slicesRemoved < totalSlices && (
              <p className="mt-4 text-sm gpu-accelerated" style={{ color: '#5a0000', fontFamily: "'Cormorant Garamond', serif", animation: 'gentlePulse 2s ease-in-out infinite' }}>
                🔪 Clique no bolo para fatiar 🔪
              </p>
            )}
          </div>
        )}

        {/* ========== PHASE: MESSAGE ========== */}
        {phase === 'message' && (
          <div className="w-full py-8 gpu-accelerated"
            style={{ animation: 'fadeInUp 1s ease-out forwards' }}>
            <div className="text-center mb-8">
              <h2 style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 'clamp(16px, 3vw, 22px)',
                color: '#8b0000',
                letterSpacing: '4px',
              }}>
                ⛓️ UMA CARTA PRA VOCÊ ⛓️
              </h2>
              <div className="mt-2 mx-auto w-48 h-px" style={{ background: 'linear-gradient(90deg, transparent, #8b0000, transparent)' }} />
              <p className="mt-2" style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '16px',
                color: '#5a0000',
              }}>
                Do seu dono, com amor obsessivo
              </p>
            </div>

            <RomanticMessage />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
