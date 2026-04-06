'use client';
import Nav from '../Nav';
import Link from 'next/link';

const stores = [
  {
    slug: 'nour-atelier',
    name: 'Nour Atelier',
    desc: 'Handcrafted jewellery from the Middle East',
    cat: 'Fashion',
    products: 12,
    bg: 'radialGradient(circle at 68% 52%, #f8c8d8, #eddde8, #ddeaf4)',
    svgId: 'ring',
  },
  {
    slug: 'bytedrop',
    name: 'ByteDrop',
    desc: 'Premium UI kits and Figma assets',
    cat: 'Digital',
    products: 8,
    bg: 'radialGradient(circle at 28% 42%, #b8d0f4, #dce8f8, #f4ece4)',
    svgId: 'cube',
  },
  {
    slug: 'solar-prints',
    name: 'Solar Prints',
    desc: 'Limited edition art prints worldwide',
    cat: 'Art',
    products: 24,
    bg: 'radialGradient(circle at 65% 50%, #f0d0e8, #e8ddf0, #d8eaf4)',
    svgId: 'orb',
  },
  {
    slug: 'kode-studio',
    name: 'Kode Studio',
    desc: 'Custom dev work & automation',
    cat: 'Services',
    products: 5,
    bg: 'radialGradient(circle at 62% 48%, #f8d8a0, #ede4d4, #d8eaf4)',
    svgId: 'cylinder',
  },
  {
    slug: 'umami-box',
    name: 'Umami Box',
    desc: 'Artisan Japanese food kits',
    cat: 'Food',
    products: 6,
    bg: 'radialGradient(circle at 65% 50%, #b8ecd0, #dceee4, #eeeae0)',
    svgId: 'pill',
  },
  {
    slug: 'soundvault',
    name: 'SoundVault',
    desc: 'Exclusive beats & sample packs',
    cat: 'Music',
    products: 40,
    bg: 'radialGradient(circle at 68% 52%, #f4c0d8, #ead8f0, #d0e4f8)',
    svgId: 'torus',
  },
];

function GlassIcon({ id }: { id: string }) {
  if (id === 'ring') return (
    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <defs>
        <radialGradient id="rb" cx="32%" cy="22%" r="58%"><stop offset="0%" stopColor="#ffffff"/><stop offset="55%" stopColor="#b0c8f0"/><stop offset="100%" stopColor="#283870"/></radialGradient>
        <radialGradient id="rpink" cx="80%" cy="55%" r="45%"><stop offset="0%" stopColor="rgba(240,80,130,0.7)"/><stop offset="100%" stopColor="rgba(240,80,130,0)"/></radialGradient>
        <filter id="rg"><feGaussianBlur stdDeviation="22"/></filter>
        <filter id="rs"><feGaussianBlur stdDeviation="5"/></filter>
        <radialGradient id="gem3d" cx="28%" cy="22%" r="62%"><stop offset="0%" stopColor="#ffffff"/><stop offset="30%" stopColor="#ffe8c0"/><stop offset="100%" stopColor="#803010"/></radialGradient>
      </defs>
      <ellipse cx="270" cy="118" rx="100" ry="75" fill="rgba(220,60,110,0.25)" filter="url(#rg)"/>
      <ellipse cx="148" cy="88" rx="72" ry="60" fill="rgba(100,140,240,0.2)" filter="url(#rg)"/>
      <circle cx="200" cy="105" r="58" fill="none" stroke="#18243a" strokeWidth="34"/>
      <circle cx="200" cy="105" r="58" fill="none" stroke="url(#rb)" strokeWidth="26"/>
      <circle cx="200" cy="105" r="58" fill="none" stroke="url(#rpink)" strokeWidth="26"/>
      <path d="M 162 52 A 58 58 0 0 1 238 44" fill="none" stroke="rgba(255,255,255,0.98)" strokeWidth="10" strokeLinecap="round"/>
      <path d="M 218 162 A 58 58 0 0 0 258 138" fill="none" stroke="rgba(8,12,30,0.85)" strokeWidth="18" strokeLinecap="round"/>
      <path d="M 145 108 A 58 58 0 0 0 156 148" fill="none" stroke="rgba(240,80,130,0.65)" strokeWidth="7" strokeLinecap="round" filter="url(#rs)"/>
      <ellipse cx="168" cy="60" rx="12" ry="6" fill="rgba(255,255,255,0.9)" transform="rotate(-42,168,60)"/>
      <polygon points="200,26 218,44 200,56 182,44" fill="url(#gem3d)" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>
      <polygon points="200,26 218,44 200,38" fill="rgba(255,255,255,0.9)"/>
      <polygon points="200,56 218,44 200,38" fill="rgba(180,90,20,0.55)"/>
      <circle cx="197" cy="30" r="4" fill="rgba(255,255,255,0.98)"/>
      <ellipse cx="200" cy="188" rx="55" ry="9" fill="rgba(100,50,80,0.22)" filter="url(#rs)"/>
    </svg>
  );

  if (id === 'cube') return (
    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="ctop" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ffffff"/><stop offset="100%" stopColor="#7090d0"/></linearGradient>
        <linearGradient id="cleft" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#e8f0ff"/><stop offset="100%" stopColor="#3050a0"/></linearGradient>
        <linearGradient id="cright" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#c06020"/><stop offset="100%" stopColor="#ffd090"/></linearGradient>
        <filter id="cg"><feGaussianBlur stdDeviation="22"/></filter>
        <filter id="cs"><feGaussianBlur stdDeviation="5"/></filter>
      </defs>
      <ellipse cx="268" cy="118" rx="90" ry="68" fill="rgba(232,114,12,0.22)" filter="url(#cg)"/>
      <ellipse cx="148" cy="88" rx="70" ry="55" fill="rgba(80,120,240,0.22)" filter="url(#cg)"/>
      <polygon points="230,35 310,75 310,145 230,105" fill="url(#cright)"/>
      <line x1="230" y1="35" x2="230" y2="105" stroke="rgba(20,10,0,0.7)" strokeWidth="3"/>
      <polygon points="90,75 170,35 230,35 230,105 170,145 90,145" fill="url(#cleft)"/>
      <polygon points="170,35 230,35 310,75 250,75 200,48 90,75 170,35" fill="url(#ctop)"/>
      <polygon points="170,35 230,35 260,50 200,50" fill="rgba(255,255,255,0.72)"/>
      <line x1="112" y1="88" x2="130" y2="158" stroke="rgba(255,255,255,0.75)" strokeWidth="6" strokeLinecap="round"/>
      <line x1="288" y1="90" x2="268" y2="158" stroke="rgba(232,114,12,0.7)" strokeWidth="5" strokeLinecap="round" filter="url(#cs)"/>
      <line x1="90" y1="75" x2="170" y2="35" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5"/>
      <line x1="170" y1="35" x2="230" y2="35" stroke="rgba(255,255,255,0.95)" strokeWidth="2.5"/>
      <ellipse cx="155" cy="52" rx="18" ry="8" fill="rgba(255,255,255,0.82)" transform="rotate(-22,155,52)"/>
      <ellipse cx="200" cy="168" rx="110" ry="12" fill="rgba(20,40,100,0.2)" filter="url(#cs)"/>
    </svg>
  );

  if (id === 'orb') return (
    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <defs>
        <radialGradient id="osph" cx="32%" cy="26%" r="60%"><stop offset="0%" stopColor="#ffffff"/><stop offset="45%" stopColor="#d0b0f0"/><stop offset="100%" stopColor="#1a0860"/></radialGradient>
        <radialGradient id="oshad" cx="78%" cy="80%" r="50%"><stop offset="0%" stopColor="rgba(5,0,20,0.92)"/><stop offset="100%" stopColor="rgba(20,5,60,0)"/></radialGradient>
        <radialGradient id="obounce" cx="88%" cy="62%" r="40%"><stop offset="0%" stopColor="rgba(240,80,150,0.55)"/><stop offset="100%" stopColor="rgba(240,80,150,0)"/></radialGradient>
        <filter id="og"><feGaussianBlur stdDeviation="24"/></filter>
        <filter id="os"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>
      <ellipse cx="260" cy="120" rx="95" ry="72" fill="rgba(220,60,140,0.25)" filter="url(#og)"/>
      <circle cx="200" cy="100" r="75" fill="#0e0530"/>
      <circle cx="200" cy="100" r="75" fill="url(#osph)"/>
      <circle cx="200" cy="100" r="75" fill="url(#oshad)"/>
      <circle cx="200" cy="100" r="75" fill="url(#obounce)"/>
      <ellipse cx="218" cy="100" rx="30" ry="75" fill="rgba(5,0,20,0.45)" filter="url(#os)"/>
      <ellipse cx="168" cy="68" rx="28" ry="20" fill="rgba(255,255,255,0.92)" transform="rotate(-30,168,68)" filter="url(#os)"/>
      <ellipse cx="165" cy="65" rx="14" ry="10" fill="rgba(255,255,255,0.98)" transform="rotate(-30,165,65)"/>
      <circle cx="162" cy="62" r="6" fill="#ffffff"/>
      <path d="M 248 58 A 75 75 0 0 1 272 120 A 75 75 0 0 1 248 170" fill="none" stroke="rgba(240,80,150,0.5)" strokeWidth="5" strokeLinecap="round" filter="url(#os)"/>
      <ellipse cx="200" cy="185" rx="60" ry="10" fill="rgba(80,30,120,0.2)" filter="url(#os)"/>
    </svg>
  );

  if (id === 'cylinder') return (
    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <defs>
        <radialGradient id="cytop" cx="38%" cy="32%" r="65%"><stop offset="0%" stopColor="#ffffff"/><stop offset="70%" stopColor="#c07030"/><stop offset="100%" stopColor="#703010"/></radialGradient>
        <linearGradient id="cybod" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/><stop offset="12%" stopColor="#ffecd0"/><stop offset="65%" stopColor="#804010"/><stop offset="100%" stopColor="#100400"/></linearGradient>
        <filter id="cyg"><feGaussianBlur stdDeviation="22"/></filter>
        <filter id="cys"><feGaussianBlur stdDeviation="5"/></filter>
      </defs>
      <ellipse cx="255" cy="112" rx="88" ry="65" fill="rgba(232,114,12,0.28)" filter="url(#cyg)"/>
      <ellipse cx="200" cy="162" rx="72" ry="22" fill="rgba(80,40,10,0.7)"/>
      <rect x="128" y="60" width="144" height="104" fill="url(#cybod)"/>
      <ellipse cx="200" cy="60" rx="72" ry="22" fill="url(#cytop)" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
      <ellipse cx="182" cy="54" rx="30" ry="9" fill="rgba(255,255,255,0.88)" transform="rotate(-8,182,54)"/>
      <rect x="128" y="62" width="22" height="100" fill="rgba(255,255,255,0.7)"/>
      <rect x="240" y="62" width="32" height="100" fill="rgba(0,0,0,0.55)"/>
      <circle cx="166" cy="50" r="8" fill="rgba(255,255,255,0.98)"/>
      <ellipse cx="200" cy="188" rx="60" ry="9" fill="rgba(140,70,10,0.22)" filter="url(#cys)"/>
    </svg>
  );

  if (id === 'pill') return (
    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="pbod" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#ffffff"/><stop offset="45%" stopColor="#50c878"/><stop offset="100%" stopColor="#082818"/></linearGradient>
        <radialGradient id="pcapr" cx="68%" cy="68%" r="55%"><stop offset="0%" stopColor="rgba(232,114,12,0.65)"/><stop offset="100%" stopColor="rgba(232,114,12,0)"/></radialGradient>
        <filter id="pg"><feGaussianBlur stdDeviation="22"/></filter>
        <filter id="ps"><feGaussianBlur stdDeviation="5"/></filter>
      </defs>
      <ellipse cx="260" cy="115" rx="90" ry="66" fill="rgba(50,200,100,0.22)" filter="url(#pg)"/>
      <g transform="rotate(-12,200,105)">
        <rect x="90" y="74" width="220" height="62" rx="31" fill="url(#pbod)"/>
        <rect x="92" y="76" width="216" height="20" rx="10" fill="rgba(255,255,255,0.75)"/>
        <ellipse cx="121" cy="105" rx="31" ry="31" fill="rgba(255,255,255,0.3)"/>
        <rect x="248" y="76" width="60" height="60" rx="6" fill="rgba(0,0,0,0.45)"/>
        <ellipse cx="279" cy="105" rx="31" ry="31" fill="url(#pcapr)"/>
        <line x1="200" y1="76" x2="200" y2="136" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
        <ellipse cx="108" cy="86" rx="22" ry="10" fill="rgba(255,255,255,0.92)" transform="rotate(-5,108,86)"/>
        <circle cx="104" cy="84" r="7" fill="rgba(255,255,255,0.98)"/>
        <path d="M 290 80 Q 308 105 290 130" fill="none" stroke="rgba(232,114,12,0.7)" strokeWidth="5" strokeLinecap="round"/>
      </g>
      <ellipse cx="200" cy="186" rx="65" ry="9" fill="rgba(20,100,40,0.2)" filter="url(#ps)"/>
    </svg>
  );

  if (id === 'torus') return (
    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <defs>
        <radialGradient id="tor" cx="34%" cy="26%" r="66%"><stop offset="0%" stopColor="#ffffff"/><stop offset="55%" stopColor="#9060e0"/><stop offset="100%" stopColor="#180860"/></radialGradient>
        <radialGradient id="tamb" cx="76%" cy="74%" r="44%"><stop offset="0%" stopColor="rgba(232,114,12,0.58)"/><stop offset="100%" stopColor="rgba(232,114,12,0)"/></radialGradient>
        <filter id="tg"><feGaussianBlur stdDeviation="24"/></filter>
        <filter id="ts"><feGaussianBlur stdDeviation="6"/></filter>
        <mask id="dm"><circle cx="200" cy="100" r="78" fill="white"/><circle cx="200" cy="100" r="36" fill="black"/></mask>
      </defs>
      <ellipse cx="262" cy="120" rx="95" ry="72" fill="rgba(220,60,140,0.25)" filter="url(#tg)"/>
      <circle cx="200" cy="100" r="78" fill="#0c0430" mask="url(#dm)"/>
      <circle cx="200" cy="100" r="78" fill="url(#tor)" mask="url(#dm)"/>
      <circle cx="200" cy="100" r="78" fill="url(#tamb)" mask="url(#dm)"/>
      <circle cx="200" cy="100" r="36" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeDasharray="42 185" mask="url(#dm)"/>
      <path d="M 148 26 A 78 78 0 0 1 250 14" fill="none" stroke="rgba(255,255,255,0.97)" strokeWidth="14" strokeLinecap="round" mask="url(#dm)"/>
      <path d="M 154 176 A 78 78 0 0 0 252 164" fill="none" stroke="rgba(3,0,16,0.92)" strokeWidth="22" strokeLinecap="round" mask="url(#dm)"/>
      <path d="M 256 68 A 78 78 0 0 1 278 130" fill="none" stroke="rgba(240,70,150,0.58)" strokeWidth="8" strokeLinecap="round" filter="url(#ts)" mask="url(#dm)"/>
      <ellipse cx="164" cy="34" rx="20" ry="10" fill="rgba(255,255,255,0.88)" transform="rotate(-40,164,34)"/>
      <circle cx="152" cy="32" r="7" fill="rgba(255,255,255,0.98)"/>
      <ellipse cx="200" cy="192" rx="62" ry="9" fill="rgba(70,30,110,0.22)" filter="url(#ts)"/>
    </svg>
  );

  return null;
}

export default function Marketplace() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '7rem 2.5rem 4rem' }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Live Stores</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: 0.95 }}>
            THE<br /><span style={{ color: 'transparent', WebkitTextStroke: '1.5px var(--ink)' }}>MARKETPLACE</span>
          </div>
          <Link href="/create">
            <button style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'transparent', color: 'var(--ink)', border: '1px solid var(--ink)', padding: '0.65rem 1.25rem', cursor: 'pointer' }}>
              Open Your Store →
            </button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1px', background: 'var(--border)' }}>
          {stores.map(store => (
            <Link key={store.slug} href={`/store/${store.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: 'var(--bg)', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}>
                <div style={{ height: 200, position: 'relative', overflow: 'hidden', background: store.bg }}>
                  <GlassIcon id={store.svgId} />
                </div>
                <div style={{ padding: '1.25rem 1.25rem 1.5rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>{store.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 300, lineHeight: 1.5, marginBottom: '1rem' }}>{store.desc}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{store.cat}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--accent)' }}>{store.products} products</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}