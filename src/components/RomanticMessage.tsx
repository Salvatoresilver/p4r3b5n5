import { useState, useEffect, useCallback, memo } from 'react';

const lines = [
  { text: "Minha garota...", style: "title" },
  { text: "Minha gostosa. Minha vida. Minha dona. Minha tudo.", style: "emphasis" },
  { text: "", style: "spacer" },
  { text: "Você é SÓ MINHA.", style: "possessive" },
  { text: "De mais ninguém.", style: "normal" },
  { text: "Nem em pensamento. Nem em sonho. Nem em olhar.", style: "normal" },
  { text: "Ninguém encosta. Ninguém chega perto.", style: "normal" },
  { text: "Porque EU sou o dono. E você... você me obedece. 🖤", style: "emphasis" },
  { text: "", style: "spacer" },
  { text: "⛓️ PERTO OU LONGE ⛓️", style: "chain-title" },
  { text: "", style: "spacer" },
  { text: "Quando eu tô perto, você sente.", style: "normal" },
  { text: "Minha mão na sua cintura. Meu olhar que não desgruda.", style: "normal" },
  { text: "Meu ciúme que queima. Meu abraço que sufoca — de amor.", style: "normal" },
  { text: "Eu te seguro como quem não vai largar NUNCA.", style: "emphasis" },
  { text: "Porque eu não largo. Eu não divido. Eu não empresto.", style: "emphasis" },
  { text: "Você é MINHA. Ponto.", style: "possessive" },
  { text: "", style: "spacer" },
  { text: "E quando a distância tenta me separar de você?", style: "normal" },
  { text: "Ela PERDE.", style: "possessive" },
  { text: "Porque nem mil quilômetros mudam o fato:", style: "normal" },
  { text: "VOCÊ. É. MINHA.", style: "possessive" },
  { text: "A distância me faz mais possessivo.", style: "normal" },
  { text: "Mais ciumento. Mais grudento. Mais obcecado.", style: "normal" },
  { text: "Cada segundo longe é um segundo que eu tô pensando em você.", style: "normal" },
  { text: "Em te ter. Em te prender. Em te devorar. 🔥", style: "emphasis" },
  { text: "", style: "spacer" },
  { text: "⛓️ EU SOU SEU DONO ⛓️", style: "chain-title" },
  { text: "", style: "spacer" },
  { text: "Eu cuido de você como ninguém cuida.", style: "normal" },
  { text: "Eu protejo você como ninguém protege.", style: "normal" },
  { text: "Eu te amo como ninguém ama.", style: "normal" },
  { text: "Com posse. Com obsessão. Com entrega total.", style: "emphasis" },
  { text: "", style: "spacer" },
  { text: "Você me obedece porque sabe:", style: "normal" },
  { text: "tudo que eu faço é POR VOCÊ e PRA VOCÊ.", style: "emphasis" },
  { text: "Eu mando porque eu cuido.", style: "normal" },
  { text: "Eu possuo porque eu amo.", style: "normal" },
  { text: "Eu prendo porque eu protejo.", style: "normal" },
  { text: "E você? Você é minha garota obediente.", style: "emphasis" },
  { text: "Minha gostosa que sabe quem é o dono dela. 🖤🔥", style: "emphasis" },
  { text: "", style: "spacer" },
  { text: "⛓️ PRA SEMPRE ⛓️", style: "chain-title" },
  { text: "", style: "spacer" },
  { text: "Eu sou TUDO que você precisa.", style: "possessive" },
  { text: "TUDO que você tem.", style: "possessive" },
  { text: "TUDO que você vai ter.", style: "possessive" },
  { text: "Querendo ou não.", style: "emphasis" },
  { text: "", style: "spacer" },
  { text: "Você pode tentar fugir — mas sabe que não quer.", style: "normal" },
  { text: "Porque no fundo, você AMA ser minha.", style: "normal" },
  { text: "Ama ser cuidada. Ama ser protegida.", style: "normal" },
  { text: "Ama saber que tem um homem que MORRE por você.", style: "emphasis" },
  { text: "Que MATA por você.", style: "emphasis" },
  { text: "Que vive, respira e existe POR VOCÊ.", style: "emphasis" },
  { text: "", style: "spacer" },
  { text: "⛓️ ATÉ DEPOIS DA MORTE ⛓️", style: "chain-title" },
  { text: "", style: "spacer" },
  { text: "Eu vou te amar nessa vida.", style: "normal" },
  { text: "Eu vou te amar na próxima.", style: "normal" },
  { text: "Eu vou te amar depois que tudo acabar.", style: "normal" },
  { text: "Minha alma é sua. Sua alma é minha.", style: "emphasis" },
  { text: "Acorrentadas pra eternidade. ⛓️", style: "emphasis" },
  { text: "", style: "spacer" },
  { text: "Eu vou te proteger até quando eu não existir mais.", style: "normal" },
  { text: "Vou cuidar de você além do último suspiro.", style: "normal" },
  { text: "Porque o que eu sinto por você não morre.", style: "normal" },
  { text: "É eterno. É absoluto. É INCURÁVEL. 💀🖤", style: "possessive" },
  { text: "", style: "spacer" },
  { text: "Você não tem escolha, meu amor.", style: "normal" },
  { text: "Você nunca teve.", style: "normal" },
  { text: "Porque desde o momento que você entrou na minha vida...", style: "normal" },
  { text: "Eu decidi: ESSA É MINHA.", style: "possessive" },
  { text: "Essa eu não largo.", style: "emphasis" },
  { text: "Essa eu não perco.", style: "emphasis" },
  { text: "Essa eu POSSUO. 🔥⛓️", style: "possessive" },
  { text: "", style: "spacer" },
  { text: "Feliz aniversário, minha gostosa.", style: "emphasis" },
  { text: "Minha vida. Minha razão. Minha obsessão.", style: "emphasis" },
  { text: "Minha garota obediente que eu amo loucamente.", style: "emphasis" },
  { text: "", style: "spacer" },
  { text: "Eu te amo de um jeito que consome.", style: "normal" },
  { text: "Que queima. Que marca. Que não sai.", style: "normal" },
  { text: "Que te prende pra sempre. ⛓️🔥🖤", style: "emphasis" },
  { text: "", style: "spacer" },
  { text: "— Seu dono. Seu amor. Seu tudo.", style: "signature" },
  { text: "Pra sempre. Até depois do pra sempre. 💀🥀⛓️", style: "signature" },
];

const getLineStyle = (style: string): React.CSSProperties => {
  switch (style) {
    case 'title':
      return {
        fontFamily: "'Great Vibes', cursive",
        fontSize: '30px',
        color: '#cc0000',
        marginBottom: '4px',
      };
    case 'emphasis':
      return {
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '17px',
        color: '#e8c4a0',
        fontStyle: 'italic',
        fontWeight: 600,
      };
    case 'possessive':
      return {
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: '20px',
        color: '#cc0000',
        fontWeight: 900,
        letterSpacing: '2px',
        textTransform: 'uppercase' as const,
      };
    case 'chain-title':
      return {
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: '15px',
        color: '#b8860b',
        fontWeight: 700,
        letterSpacing: '4px',
        textAlign: 'center' as const,
      };
    case 'signature':
      return {
        fontFamily: "'Great Vibes', cursive",
        fontSize: '22px',
        color: '#8b0000',
      };
    case 'spacer':
      return { height: '10px' };
    default:
      return {
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '16px',
        color: '#c4a882',
        lineHeight: '1.6',
      };
  }
};

const RomanticMessage = memo(function RomanticMessage() {
  const [sealBroken, setSealBroken] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showFinal, setShowFinal] = useState(false);

  const breakSeal = useCallback(() => {
    setSealBroken(true);
    setTimeout(() => setLetterOpen(true), 800);
  }, []);

  useEffect(() => {
    if (!letterOpen) return;
    if (visibleLines >= lines.length) {
      const t = setTimeout(() => setShowFinal(true), 1000);
      return () => clearTimeout(t);
    }
    const delay = lines[visibleLines].style === 'spacer' ? 150 : 500;
    const timer = setTimeout(() => setVisibleLines(prev => prev + 1), delay);
    return () => clearTimeout(timer);
  }, [letterOpen, visibleLines]);

  // ENVELOPE STATE
  if (!sealBroken) {
    return (
      <div
        className="flex flex-col items-center justify-center gpu-accelerated"
        style={{ animation: 'scaleIn 1s ease-out forwards' }}
      >
        <div
          className="relative cursor-pointer group"
          onClick={breakSeal}
        >
          <div
            className="relative w-80 h-52 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
            style={{
              background: 'linear-gradient(145deg, #1a0800, #0f0400, #1a0600)',
              border: '2px solid #3a1800',
              boxShadow: '0 0 30px rgba(100,0,0,0.2)',
            }}
          >
            {/* Flap */}
            <div
              className="absolute -top-1 left-0 right-0 h-24"
              style={{
                background: 'linear-gradient(to bottom, #2a1200, #1a0800)',
                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                borderBottom: '1px solid #3a1800',
              }}
            />

            {/* Wax seal */}
            <div
              className="absolute z-10 w-16 h-16 rounded-full flex items-center justify-center gpu-accelerated"
              style={{
                background: 'radial-gradient(circle at 40% 35%, #cc0000, #8b0000, #5a0000)',
                boxShadow: '0 0 15px rgba(180,0,0,0.4)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'gentlePulse 2s ease-in-out infinite',
              }}
            >
              <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '20px', color: '#ffd700' }}>
                M
              </span>
              <div className="absolute -bottom-3 left-1/2 w-1 h-4 rounded-b-full"
                style={{ background: 'linear-gradient(to bottom, #8b0000, transparent)', transform: 'translateX(-50%)' }} />
            </div>

            {/* Corner chains */}
            <div className="absolute top-2 left-2 text-sm opacity-20">⛓️</div>
            <div className="absolute top-2 right-2 text-sm opacity-20">⛓️</div>
            <div className="absolute bottom-2 left-2 text-sm opacity-20">⛓️</div>
            <div className="absolute bottom-2 right-2 text-sm opacity-20">⛓️</div>
          </div>

          <div className="mt-6 text-center">
            <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ fontFamily: "'Great Vibes', cursive", fontSize: '20px', color: '#8b0000' }}>
              Quebre o selo... se tiver coragem 🖤
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm opacity-40 gpu-accelerated"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b0000', animation: 'gentlePulse 2s ease-in-out infinite' }}>
          ⛓️ Toque no selo ⛓️
        </p>
      </div>
    );
  }

  // OPENING STATE
  if (!letterOpen) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="w-80 h-52 rounded-lg flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, #1a0800, #0f0400)',
            border: '2px solid #3a1800',
            boxShadow: '0 0 30px rgba(100,0,0,0.2)',
          }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center gpu-accelerated"
            style={{
              background: 'radial-gradient(circle, #cc0000, #5a0000)',
              animation: 'sealCrack 0.8s ease-out forwards',
            }}
          >
            <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '18px', color: '#ffd700' }}>M</span>
          </div>
        </div>
        <p className="mt-4 text-sm opacity-60" style={{ color: '#8b0000', fontFamily: "'Cormorant Garamond', serif" }}>
          Abrindo...
        </p>
      </div>
    );
  }

  // LETTER CONTENT
  return (
    <div className="w-full max-w-2xl mx-auto px-4 gpu-accelerated"
      style={{ animation: 'letterRise 1s ease-out forwards' }}>
      <div className="relative p-6 md:p-10 rounded-lg"
        style={{
          background: 'linear-gradient(170deg, #1a0a00 0%, #0f0500 30%, #0a0200 60%, #0f0500 100%)',
          border: '2px solid #3a1800',
          boxShadow: '0 0 40px rgba(100,0,0,0.2)',
        }}
      >
        {/* Corner decorations — static, no animation */}
        <div className="absolute top-3 left-3 text-base opacity-20">⛓️</div>
        <div className="absolute top-3 right-3 text-base opacity-20">⛓️</div>
        <div className="absolute bottom-3 left-3 text-base opacity-20">🥀</div>
        <div className="absolute bottom-3 right-3 text-base opacity-20">💀</div>

        {/* Blood stain corners — static */}
        <div className="absolute top-0 right-0 w-16 h-16 opacity-8 rounded-bl-full"
          style={{ background: 'radial-gradient(circle at top right, #8b0000, transparent)', opacity: 0.08 }} />

        {/* Lines */}
        <div className="space-y-1">
          {lines.slice(0, visibleLines).map((line, i) => (
            <div key={i} style={getLineStyle(line.style)}>
              {line.text}
            </div>
          ))}

          {visibleLines < lines.length && (
            <span className="inline-block w-0.5 h-5 ml-1"
              style={{ background: '#8b0000', animation: 'blink 0.8s infinite', verticalAlign: 'middle' }} />
          )}
        </div>

        {/* Final */}
        {showFinal && (
          <div className="mt-6 pt-5 text-center gpu-accelerated"
            style={{ borderTop: '1px solid rgba(139,0,0,0.3)', animation: 'scaleIn 1s ease-out forwards' }}>
            <div className="text-2xl mb-2">⛓️🖤🔥🖤⛓️</div>
            <p style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: '13px',
              color: '#8b0000',
              letterSpacing: '3px',
            }}>
              VOCÊ É MINHA. PRA SEMPRE. QUERENDO OU NÃO.
            </p>
            <div className="mt-2 text-xl">💀⛓️🥀⛓️💀</div>
          </div>
        )}
      </div>
    </div>
  );
});

export default RomanticMessage;
