import { useState, useEffect, useRef, useCallback } from 'react';

const PLATE_MSGS = [
  'Minha. Pra sempre.', 'Ninguém te toca.', 'Eu sou teu dono. 🖤', 'Você me obedece. ⛓️',
  'Perto ou longe, MINHA.', 'Até após a morte. 💀', 'Sem escapatória.', 'Querendo ou não. 🔥'
];

const WELCOME_LINES = [
  { text: 'Eu preparei algo especial pra você...', hl: false },
  { text: 'Algo feito com obsessão. Com posse.', hl: false },
  { text: 'Com um amor que queima, que sufoca, que marca.', hl: false },
  { text: 'Perto ou longe... você é MINHA.', hl: true },
  { text: 'Querendo ou não. Pra sempre. ⛓️🖤', hl: true },
];

const OATH_LINES = [
  { text: 'Eu juro, diante de tudo que é sagrado...', s: false },
  { text: 'Vou te amar pra sempre. Perto ou longe.', s: false },
  { text: 'Na presença ou na distância, você é MINHA.', s: true },
  { text: 'Eu sou teu dono. Você me obedece. 🖤', s: true },
  { text: 'Eu cuido de você. Te protejo. Te guardo.', s: false },
  { text: 'Te amo ao ponto de NUNCA te dividir com nada e ninguém.', s: true },
  { text: 'Você é minha propriedade sagrada. ⛓️', s: true },
  { text: 'Eu morreria por você. Eu mataria por você.', s: false },
  { text: 'Eu te amarei até depois da morte.', s: false },
  { text: 'Querendo ou não... você será minha PRA VIDA INTEIRA. 🔥', s: true },
  { text: 'Na distância eu te possuo com o pensamento.', s: false },
  { text: 'Na presença eu te possuo com o corpo e a alma.', s: true },
  { text: 'Ninguém encosta. Ninguém olha. NINGUÉM. ⛓️🖤', s: true },
];

export default function App() {
  const [phase, setPhase] = useState(1);
  const [fading, setFading] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [oathVisible, setOathVisible] = useState(0);
  const [candlesOut, setCandlesOut] = useState(false);
  const [slices, setSlices] = useState(0);
  const [letterOpen, setLetterOpen] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<{ id: number; x: number; dur: number; delay: number; color: string; size: number }[]>([]);
  const [shaking, setShaking] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);
  const confettiId = useRef(0);
  const letterRef = useRef<HTMLDivElement>(null);

  // Typewriter phase 1
  useEffect(() => {
    if (phase === 1) {
      setVisibleLines(0);
      WELCOME_LINES.forEach((_, i) => {
        setTimeout(() => setVisibleLines(v => Math.max(v, i + 1)), 800 + i * 1200);
      });
    }
  }, [phase]);

  // Oath phase 2
  useEffect(() => {
    if (phase === 2) {
      setOathVisible(0);
      OATH_LINES.forEach((_, i) => {
        setTimeout(() => setOathVisible(v => Math.max(v, i + 1)), 500 + i * 900);
      });
    }
  }, [phase]);

  // Mouse glow
  useEffect(() => {
    const g = glowRef.current;
    if (!g) return;
    let mx = 0, my = 0, gx = 0, gy = 0, raf = 0;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const animate = () => {
      gx += (mx - gx) * 0.1; gy += (my - gy) * 0.1;
      g.style.transform = `translate(${gx - 125}px,${gy - 125}px)`;
      raf = requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(animate);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  // Letter intersection observer
  useEffect(() => {
    if (!letterOpen || !letterRef.current) return;
    const ps = letterRef.current.querySelectorAll('.lp');
    // First 7: animate with delay
    ps.forEach((p, i) => {
      if (i < 7) {
        setTimeout(() => p.classList.add('lp-visible'), 300 + i * 400);
      }
    });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('lp-visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1, root: letterRef.current });
    ps.forEach((p, i) => { if (i >= 7) obs.observe(p); });
    return () => obs.disconnect();
  }, [letterOpen]);

  const spawnConfetti = useCallback((n = 30) => {
    const colors = ['#8b0000', '#dc143c', '#b8860b', '#daa520', '#5c0000', '#ff6347'];
    const pieces = Array.from({ length: n }, () => ({
      id: confettiId.current++,
      x: Math.random() * 100,
      dur: 2 + Math.random() * 3,
      delay: Math.random(),
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 5 + Math.random() * 8,
    }));
    setConfettiPieces(prev => [...prev, ...pieces]);
    setTimeout(() => setConfettiPieces(prev => prev.filter(p => !pieces.includes(p))), 6000);
  }, []);

  const goPhase = useCallback((n: number) => {
    setFading(true);
    setTimeout(() => { setPhase(n); setFading(false); }, 800);
  }, []);

  const blowCandles = useCallback(() => {
    if (candlesOut) return;
    setCandlesOut(true);
    spawnConfetti(40);
    setTimeout(() => goPhase(4), 2500);
  }, [candlesOut, spawnConfetti, goPhase]);

  const doSlice = useCallback(() => {
    if (slices >= 8) return;
    setShaking(true);
    setTimeout(() => setShaking(false), 150);
    setSlices(s => {
      const ns = s + 1;
      if (ns >= 8) { spawnConfetti(50); setTimeout(() => goPhase(5), 2000); }
      return ns;
    });
  }, [slices, spawnConfetti, goPhase]);

  const doOpenLetter = useCallback(() => {
    setLetterOpen(true);
    spawnConfetti(60);
  }, [spawnConfetti]);

  const showBtn1 = visibleLines >= WELCOME_LINES.length;
  const showBtn2 = oathVisible >= OATH_LINES.length;

  return (
    <>
      <style>{`
        @keyframes heartbeat{0%,100%{background:transparent}15%{background:rgba(139,0,0,.04)}30%{background:transparent}45%{background:rgba(139,0,0,.03)}60%{background:transparent}}
        @keyframes floatUp{0%{transform:translateY(110vh) rotate(0deg);opacity:0}10%{opacity:.4}90%{opacity:.4}100%{transform:translateY(-10vh) rotate(360deg);opacity:0}}
        @keyframes drip{0%{transform:translateY(-100%);opacity:0}20%{opacity:.3}100%{transform:translateY(110vh);opacity:0}}
        @keyframes flicker{0%{transform:translateX(-50%) scale(1) rotate(-2deg)}100%{transform:translateX(-50%) scale(1.1,.9) rotate(2deg)}}
        @keyframes btnPulse{0%,100%{box-shadow:0 0 10px rgba(139,0,0,.3)}50%{box-shadow:0 0 25px rgba(139,0,0,.5)}}
        @keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
        @keyframes fadeInUp{0%{opacity:0;transform:translateY(30px)}100%{opacity:1;transform:translateY(0)}}
        .lp{opacity:0;transform:translateY(10px);transition:all .5s ease}
        .lp-visible{opacity:1!important;transform:translateY(0)!important}
      `}</style>

      {/* VIGNETTE */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.85) 100%)', pointerEvents: 'none', zIndex: 9998 }} />

      {/* TOP BLOOD BORDER */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,transparent,#dc143c,#8b0000,#dc143c,transparent)', zIndex: 9999, pointerEvents: 'none', boxShadow: '0 0 15px #8b0000' }} />

      {/* HEARTBEAT */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, animation: 'heartbeat 1.5s ease-in-out infinite' }} />

      {/* MOUSE GLOW */}
      <div ref={glowRef} style={{ position: 'fixed', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,0,0,.12) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 2 }} />

      {/* PARTICLES */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 3, overflow: 'hidden' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={'r' + i} style={{ position: 'absolute', width: 8, height: 8, background: '#8b0000', borderRadius: '50% 0 50% 50%', opacity: .4, animation: `floatUp ${12 + Math.random() * 10}s linear infinite`, animationDelay: `${-Math.random() * 20}s`, left: `${Math.random() * 100}%`, willChange: 'transform' }} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={'e' + i} style={{ position: 'absolute', width: 3, height: 3, background: '#dc143c', borderRadius: '50%', opacity: .6, boxShadow: '0 0 4px #dc143c', animation: `floatUp ${8 + Math.random() * 8}s linear infinite`, animationDelay: `${-Math.random() * 15}s`, left: `${Math.random() * 100}%`, willChange: 'transform' }} />
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={'c' + i} style={{ position: 'absolute', fontSize: 14, opacity: .15, color: '#b8860b', animation: `floatUp ${15 + Math.random() * 10}s linear infinite`, animationDelay: `${-Math.random() * 20}s`, left: `${Math.random() * 100}%`, willChange: 'transform' }}>⛓️</div>
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={'d' + i} style={{ position: 'absolute', top: -20, width: 3, height: 40 + Math.random() * 60, background: 'linear-gradient(to bottom,transparent,#8b0000)', borderRadius: '0 0 50% 50%', opacity: .3, animation: `drip ${6 + Math.random() * 6}s linear infinite`, animationDelay: `${-Math.random() * 10}s`, left: `${Math.random() * 100}%`, willChange: 'transform' }} />
        ))}
      </div>

      {/* CONFETTI */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9997, overflow: 'hidden' }}>
        {confettiPieces.map(p => (
          <div key={p.id} style={{ position: 'absolute', top: -10, left: `${p.x}%`, width: p.size, height: p.size, background: p.color, borderRadius: p.id % 2 === 0 ? '50%' : 0, opacity: .8, animation: `confettiFall ${p.dur}s linear forwards`, animationDelay: `${p.delay}s`, willChange: 'transform' }} />
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10, padding: '2rem', opacity: fading ? 0 : 1, transition: 'opacity .8s ease' }}>

        {/* PHASE 1 */}
        {phase === 1 && (
          <>
            <h1 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(1.8rem,5vw,3.5rem)', fontWeight: 900, background: 'linear-gradient(135deg,#b8860b,#daa520,#8b0000,#dc143c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', lineHeight: 1.3, marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(139,0,0,.3))' }}>
              🖤 Feliz Aniversário 🖤<br />Minha Gostosa
            </h1>
            <p style={{ fontFamily: "'Great Vibes',cursive", fontSize: 'clamp(1.5rem,3vw,2.5rem)', color: '#dc143c', textAlign: 'center', marginBottom: '2rem', opacity: .9 }}>⛓️ Só Minha ⛓️</p>
            <div style={{ minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem', marginBottom: '2rem' }}>
              {WELCOME_LINES.map((l, i) => (
                <p key={i} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: l.hl ? 'clamp(1.2rem,2.5vw,1.6rem)' : 'clamp(1rem,2vw,1.3rem)', color: l.hl ? '#dc143c' : '#999', fontWeight: l.hl ? 700 : 400, fontStyle: 'italic', textAlign: 'center', opacity: i < visibleLines ? 1 : 0, transform: i < visibleLines ? 'translateY(0)' : 'translateY(10px)', transition: 'all .6s ease' }}>
                  {l.text}
                </p>
              ))}
            </div>
            <p style={{ fontSize: '1.5rem', letterSpacing: '1rem', color: '#b8860b', opacity: .4, margin: '1rem 0' }}>⛓ ⛓ ⛓</p>
            <button onClick={() => goPhase(2)} style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(.9rem,2vw,1.1rem)', padding: '1rem 2.5rem', background: 'linear-gradient(135deg,#5c0000,#8b0000)', color: '#b8860b', border: '2px solid #b8860b', cursor: 'pointer', letterSpacing: 3, textTransform: 'uppercase', transition: 'all .3s', animation: 'btnPulse 2s ease-in-out infinite', opacity: showBtn1 ? 1 : 0 }}>⛓️ ENTRAR ⛓️</button>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", color: '#444', fontSize: '.8rem', marginTop: '2rem', letterSpacing: 3, fontStyle: 'italic' }}>feito com obsessão • posse • amor eterno</p>
          </>
        )}

        {/* PHASE 2: OATH */}
        {phase === 2 && (
          <>
            <p style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(1.5rem,4vw,2.5rem)', color: '#b8860b', textAlign: 'center', marginBottom: '.5rem', letterSpacing: 4 }}>⛓️ JURAMENTO DE POSSE ⛓️</p>
            <p style={{ fontFamily: "'Great Vibes',cursive", fontSize: 'clamp(1.2rem,2.5vw,1.8rem)', color: '#dc143c', marginBottom: '2rem', textAlign: 'center' }}>Uma promessa eterna</p>
            <div style={{ minHeight: 200, display: 'flex', flexDirection: 'column', gap: '.8rem', alignItems: 'center', marginBottom: '2rem' }}>
              {OATH_LINES.map((l, i) => (
                <p key={i} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: l.s ? 'clamp(1.1rem,2.5vw,1.5rem)' : 'clamp(1rem,2vw,1.3rem)', color: l.s ? '#dc143c' : '#bbb', fontWeight: l.s ? 700 : 400, textAlign: 'center', maxWidth: 600, opacity: i < oathVisible ? 1 : 0, transform: i < oathVisible ? 'translateY(0)' : 'translateY(15px)', transition: 'all .6s ease' }}>
                  {l.text}
                </p>
              ))}
            </div>
            <p style={{ fontSize: '1.5rem', letterSpacing: '1rem', color: '#b8860b', opacity: .4, margin: '1rem 0' }}>🥀 🥀 🥀</p>
            <button onClick={() => goPhase(3)} style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(.9rem,2vw,1.1rem)', padding: '1rem 2.5rem', background: 'linear-gradient(135deg,#5c0000,#8b0000)', color: '#b8860b', border: '2px solid #b8860b', cursor: 'pointer', letterSpacing: 3, textTransform: 'uppercase', transition: 'all .3s', animation: 'btnPulse 2s ease-in-out infinite', opacity: showBtn2 ? 1 : 0 }}>⛓️ ACEITAR O JURAMENTO ⛓️</button>
          </>
        )}

        {/* PHASE 3: CANDLES */}
        {phase === 3 && (
          <>
            <p style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(1.3rem,3.5vw,2.2rem)', color: '#b8860b', textAlign: 'center', marginBottom: '.5rem' }}>🕯️ Faz um Pedido, Gostosa 🕯️</p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1rem,2vw,1.3rem)', color: '#888', fontStyle: 'italic', textAlign: 'center', marginBottom: '2rem' }}>"Mas já te adianto: seu maior desejo sou eu."</p>
            <div onClick={blowCandles} style={{ position: 'relative', cursor: 'pointer', transition: 'transform .3s', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: -5, position: 'relative', zIndex: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ width: 8, height: 45, borderRadius: '3px 3px 0 0', background: i % 2 === 0 ? 'linear-gradient(to bottom,#1a1a1a,#333)' : 'linear-gradient(to bottom,#5c0000,#8b0000)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', width: 10, height: 18, background: 'radial-gradient(ellipse,#ffd700,#ff6600,#dc143c)', borderRadius: '50% 50% 50% 50%/60% 60% 40% 40%', animation: candlesOut ? 'none' : 'flicker .15s ease-in-out infinite alternate', opacity: candlesOut ? 0 : 1, transition: 'opacity .5s' }} />
                    {candlesOut && <div style={{ position: 'absolute', top: -30, left: '50%', width: 2, height: 25, background: 'rgba(150,150,150,.3)', borderRadius: '50%', opacity: .4, transform: 'translateX(-50%)' }} />}
                  </div>
                ))}
              </div>
              <div style={{ width: 200, height: 80, background: 'linear-gradient(to bottom,#2a1810,#1a0f08)', borderRadius: '10px 10px 5px 5px', border: '2px solid #8b6914', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'Great Vibes',cursive", fontSize: '1.1rem', color: '#b8860b', opacity: .6 }}>SÓ MINHA</span>
              </div>
            </div>
            <p style={{ fontFamily: "'Great Vibes',cursive", fontSize: '1.2rem', color: '#dc143c', opacity: .7, animation: 'btnPulse 2s ease-in-out infinite' }}>
              {candlesOut ? '🖤 Seu desejo já foi realizado. Eu tô aqui. 🖤' : '🖤 toque no bolo para soprar 🖤'}
            </p>
          </>
        )}

        {/* PHASE 4: SLICE */}
        {phase === 4 && (
          <>
            <p style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(1.3rem,3.5vw,2rem)', color: '#b8860b', textAlign: 'center', marginBottom: '.3rem' }}>🔪 Fatia Pra Mim, Gostosa 🔪</p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(.9rem,1.8vw,1.1rem)', color: '#777', fontStyle: 'italic', textAlign: 'center', marginBottom: '1rem' }}>"Cada corte é uma promessa: você é minha e de mais ninguém."</p>
            <p style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(.7rem,1.5vw,.9rem)', color: '#b8860b', letterSpacing: 3, opacity: .6, marginBottom: '1.5rem', textAlign: 'center' }}>⛓️ EU NÃO DIVIDO O QUE É MEU ⛓️</p>
            <div onClick={doSlice} style={{ position: 'relative', cursor: 'pointer', marginBottom: '1.5rem' }}>
              <span style={{ position: 'absolute', top: -10, left: '50%', fontSize: '2rem', opacity: 0, transform: 'translate(-50%,-30%) rotate(-45deg)', transition: 'all .3s', pointerEvents: 'none', zIndex: 5 }} className="knife-icon">🔪</span>
              <div style={{ width: 220, height: 90, background: 'linear-gradient(to bottom,#2a1810,#1a0f08)', borderRadius: '12px 12px 5px 5px', border: '2px solid #8b6914', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: shaking ? 'shake .15s ease' : 'none' }}>
                <span style={{ fontFamily: "'Great Vibes',cursive", fontSize: '1rem', color: '#b8860b', opacity: .5, whiteSpace: 'nowrap' }}>⛓️ SÓ MINHA ⛓️</span>
              </div>
            </div>
            <div style={{ width: 220, height: 6, background: '#1a1a1a', borderRadius: 3, margin: '0 auto 1rem', overflow: 'hidden', border: '1px solid #333' }}>
              <div style={{ height: '100%', width: `${(slices / 8) * 100}%`, background: 'linear-gradient(90deg,#5c0000,#dc143c)', borderRadius: 3, transition: 'width .3s ease' }} />
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '.9rem', color: '#666', textAlign: 'center', marginBottom: '1.5rem' }}>{slices} / 8 fatias</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', maxWidth: 500, width: '100%', margin: '0 auto' }}>
              {PLATE_MSGS.map((msg, i) => {
                const filled = i < slices;
                return (
                  <div key={i} style={{ aspectRatio: '1', borderRadius: '50%', background: 'radial-gradient(circle,#1a1a1a,#111)', border: `2px solid ${filled ? '#8b6914' : '#333'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: filled ? '0 0 10px rgba(139,0,0,.2)' : 'none', transition: 'all .3s' }}>
                    <span style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', opacity: filled ? 1 : 0, transform: filled ? 'scale(1) rotate(0)' : 'scale(0) rotate(-30deg)', transition: 'all .5s cubic-bezier(.68,-.55,.27,1.55)' }}>🍰</span>
                    <span style={{ fontFamily: "'Great Vibes',cursive", fontSize: 'clamp(.55rem,1.2vw,.75rem)', color: '#dc143c', opacity: filled ? .8 : 0, transition: 'opacity .5s .3s', textAlign: 'center', padding: '0 .2rem', lineHeight: 1.2 }}>{msg}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* PHASE 5: LETTER */}
        {phase === 5 && !letterOpen && (
          <div style={{ textAlign: 'center' }}>
            <div onClick={doOpenLetter} style={{ cursor: 'pointer', transition: 'transform .3s', display: 'inline-block' }}>
              <div style={{ width: 280, height: 180, background: 'linear-gradient(135deg,#1a1a1a,#111)', border: '2px solid #8b6914', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: 60, height: 60, background: 'radial-gradient(circle,#dc143c,#5c0000)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cinzel Decorative',serif", fontSize: '1.5rem', color: '#b8860b', border: '3px solid #5c0000', boxShadow: '0 0 15px rgba(139,0,0,.4)', position: 'relative', zIndex: 2 }}>M</div>
              </div>
            </div>
            <p style={{ fontFamily: "'Great Vibes',cursive", fontSize: '1.1rem', color: '#dc143c', marginTop: '1rem', opacity: .7 }}>🖤 Toque para abrir... se tiver coragem 🖤</p>
          </div>
        )}

        {phase === 5 && letterOpen && (
          <div ref={letterRef} style={{ maxWidth: 650, width: '100%', maxHeight: '70vh', overflowY: 'auto', padding: 'clamp(1.5rem,4vw,2.5rem)', background: 'linear-gradient(135deg,rgba(15,15,15,.97),rgba(10,10,10,.99))', border: '2px solid #8b6914', borderRadius: 3, animation: 'fadeInUp .8s ease' }}>
            <p style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(1.2rem,3vw,1.8rem)', color: '#b8860b', textAlign: 'center', marginBottom: '.3rem' }}>⛓️ CARTA DE POSSE ⛓️</p>
            <p style={{ fontFamily: "'Great Vibes',cursive", fontSize: 'clamp(1.3rem,3vw,2rem)', color: '#dc143c', textAlign: 'center', marginBottom: '2rem' }}>Para Minha Gostosa</p>
            <Divider text="🥀 ─────── 🥀" />
            <SectionTitle>── EU SOU TEU DONO ──</SectionTitle>
            <LP i={0}>Você é SÓ MINHA.</LP>
            <LP i={1} strong>De mais ninguém. Nem em pensamento. Nem em sonho. Nem em olhar.</LP>
            <LP i={2}>Eu sou teu DONO. E você me OBEDECE.</LP>
            <LP i={3} strong>Não porque eu obrigo. Mas porque você sabe que eu sou TUDO que você precisa.</LP>
            <LP i={4}>TUDO que você tem. TUDO que você vai ter. Pra sempre. ⛓️</LP>
            <LP i={5}>Eu cuido de você como ninguém nunca cuidou e nunca vai cuidar.</LP>
            <LP i={6} strong>Eu te protejo de tudo e de todos. Inclusive de você mesma. 🖤</LP>

            <Divider text="⛓️ ─────── ⛓️" />
            <SectionTitle>── PERTO OU LONGE ──</SectionTitle>
            <LP i={7}>Na presença, eu te possuo com o corpo e com a alma.</LP>
            <LP i={8} strong>Na distância, eu te possuo com o pensamento, com o ciúme, com a obsessão.</LP>
            <LP i={9}>Não importa quantos quilômetros nos separem.</LP>
            <LP i={10} strong>Você continua sendo MINHA. Cada centímetro. Cada suspiro. Cada pensamento. ⛓️</LP>
            <LP i={11}>Longe, eu sinto teu cheiro na memória. Perto, eu te marco.</LP>
            <LP i={12}>A distância é só um teste. E eu passo TODOS os testes.</LP>
            <LP i={13} strong>Porque NADA me afasta do que é MEU. NADA. 🔥</LP>

            <Divider text="🥀 ─────── 🥀" />
            <SectionTitle>── MEU AMOR POSSESSIVO ──</SectionTitle>
            <LP i={14}>Eu sou possessivo? SOU.</LP>
            <LP i={15}>Ciumento? DEMAIS.</LP>
            <LP i={16} strong>Obsessivo? COMPLETAMENTE.</LP>
            <LP i={17}>Eu te amo ao ponto de NUNCA te dividir com NADA e NINGUÉM.</LP>
            <LP i={18}>Minha gostosa, minha bonitona, minha razão de existir.</LP>
            <LP i={19} strong>Propriedade sagrada não se empresta. Não se divide. Não se toca. ⛓️</LP>
            <LP i={20}>Eu não divido o que é meu. EU NÃO DIVIDO.</LP>
            <LP i={21} strong>E se alguém ousar... vai saber o que é lidar comigo. 🔥</LP>

            <Divider text="💀 ─────── 💀" />
            <SectionTitle>── QUERENDO OU NÃO ──</SectionTitle>
            <LP i={22}>Você é minha pra vida inteira.</LP>
            <LP i={23} strong>Querendo ou não.</LP>
            <LP i={24}>Esse amor não pede permissão. Ele invade. Ele consome. Ele DOMINA.</LP>
            <LP i={25}>Não tem saída. Não tem porta dos fundos. Não tem plano B.</LP>
            <LP i={26} strong>Só tem EU e VOCÊ. Pra sempre. Sem negociação. ⛓️</LP>
            <LP i={27}>Eu escolhi você. E quando eu escolho, eu não devolvo.</LP>
            <LP i={28}>Eu não largo. Eu não desisto. Eu não abro mão.</LP>
            <LP i={29} strong>Você é minha sentença ETERNA. E eu cumpro com prazer. 🖤</LP>

            <Divider text="⛓️ ─────── ⛓️" />
            <SectionTitle>── EU CUIDO DE VOCÊ ──</SectionTitle>
            <LP i={30}>Eu sou teu dono, mas também sou teu protetor.</LP>
            <LP i={31}>Eu te protejo do mundo. De quem te faz mal. De quem ousa te olhar.</LP>
            <LP i={32} strong>Eu morreria por você. Sem pensar. Sem hesitar. 💀</LP>
            <LP i={33}>Eu cuido do teu sorriso. Do teu choro. Do teu silêncio.</LP>
            <LP i={34}>Quando longe, cuido com a preocupação, com a mensagem, com a ligação.</LP>
            <LP i={35}>Quando perto, cuido com as mãos, com os olhos, com o corpo inteiro.</LP>
            <LP i={36} strong>Ninguém vai cuidar de você como eu cuido. NINGUÉM. Porque ninguém te AMA como eu. 🔥</LP>

            <Divider text="💀 ─────── 💀" />
            <SectionTitle>── ATÉ DEPOIS DA MORTE ──</SectionTitle>
            <LP i={37}>Esse amor não acaba quando a vida acaba.</LP>
            <LP i={38}>Se existir algo depois... eu vou te encontrar lá também.</LP>
            <LP i={39} strong>E vou te puxar pra perto e dizer: "Você AINDA é minha." ⛓️</LP>
            <LP i={40}>Na vida, na morte, no que vier depois.</LP>
            <LP i={41}>Eu te amarei. Eu te protegerei. Eu cuidarei de você.</LP>
            <LP i={42} strong>Até a pós-morte. Até o fim de tudo. E depois do fim. 💀🖤</LP>
            <LP i={43}>Minha alma vai perseguir a tua pela eternidade.</LP>
            <LP i={44} strong>Porque nem a MORTE me separa do que é MEU. ⛓️🔥</LP>

            <Divider text="🥀 ⛓️ 💀 ⛓️ 🥀" />
            <SectionTitle>── MINHA GOSTOSA ──</SectionTitle>
            <LP i={45}>Você é a mulher mais linda que existe.</LP>
            <LP i={46}>Minha gostosa. Minha bonitona. Minha perdição.</LP>
            <LP i={47} strong>Minha dona... que tem dono. 🖤</LP>
            <LP i={48}>Eu amo cada curva, cada olhar, cada birra, cada sorriso.</LP>
            <LP i={49}>Você foi feita pra mim. Moldada pra mim. Destinada a mim.</LP>
            <LP i={50} strong>Nenhuma distância muda isso. Nenhum tempo apaga isso. NADA desfaz isso. ⛓️</LP>
            <LP i={51}>Eu sou TUDO que você precisa. TUDO que você tem.</LP>
            <LP i={52} strong>E você é TUDO que eu tenho. PRA SEMPRE. 🔥💀⛓️</LP>

            <Divider text="🥀 ─── ⛓️ ─── 💀 ─── ⛓️ ─── 🥀" />

            <p style={{ fontFamily: "'Great Vibes',cursive", fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: '#dc143c', textAlign: 'center', marginTop: '2rem' }}>Com todo meu amor obsessivo,</p>
            <p style={{ fontFamily: "'Great Vibes',cursive", fontSize: 'clamp(1.2rem,2.5vw,1.8rem)', color: '#dc143c', textAlign: 'center', marginTop: '.5rem' }}>possessivo e eterno ⛓️🖤💀</p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(.85rem,1.5vw,1rem)', color: '#b8860b', textAlign: 'center', marginTop: '.5rem', fontStyle: 'italic', letterSpacing: 2 }}>— Seu dono. Seu amor. Seu tudo.</p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(.85rem,1.5vw,1rem)', color: '#b8860b', textAlign: 'center', fontStyle: 'italic', letterSpacing: 2 }}>Pra sempre. Até depois do pra sempre.</p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1rem,2vw,1.3rem)', color: '#dc143c', textAlign: 'center', marginTop: '1rem' }}>❤️‍🔥 Querendo ou não. ⛓️ ❤️‍🔥</p>
          </div>
        )}
      </div>
    </>
  );
}

function Divider({ text }: { text: string }) {
  return <p style={{ textAlign: 'center', color: '#b8860b', opacity: .3, letterSpacing: '.5rem', margin: '1.5rem 0', fontSize: '.8rem' }}>{text}</p>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(.8rem,2vw,1rem)', color: '#b8860b', letterSpacing: 4, textAlign: 'center', margin: '1.5rem 0 1rem', opacity: .7 }}>{children}</p>;
}

function LP({ children, i, strong }: { children: React.ReactNode; i: number; strong?: boolean }) {
  return (
    <p className="lp" data-d={i} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: strong ? 'clamp(1.1rem,2.2vw,1.35rem)' : 'clamp(1rem,2vw,1.2rem)', color: strong ? '#dc143c' : '#bbb', fontWeight: strong ? 700 : 400, lineHeight: 1.8, textAlign: 'center', marginBottom: '.8rem' }}>
      {children}
    </p>
  );
}
