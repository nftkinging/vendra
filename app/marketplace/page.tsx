'use client';
import Nav from '../Nav';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getStores } from '../lib/supabase';

const sampleStores = [
  { slug: 'nour-atelier', name: 'Nour Atelier', desc: 'Handcrafted jewellery from the Middle East', cat: 'Fashion', products: 12, svgId: 'ring' },
  { slug: 'bytedrop', name: 'ByteDrop', desc: 'Premium UI kits and Figma assets', cat: 'Digital', products: 8, svgId: 'cube' },
  { slug: 'solar-prints', name: 'Solar Prints', desc: 'Limited edition art prints worldwide', cat: 'Art', products: 24, svgId: 'orb' },
  { slug: 'kode-studio', name: 'Kode Studio', desc: 'Custom dev work & automation', cat: 'Services', products: 5, svgId: 'cylinder' },
  { slug: 'umami-box', name: 'Umami Box', desc: 'Artisan Japanese food kits', cat: 'Food', products: 6, svgId: 'pill' },
  { slug: 'soundvault', name: 'SoundVault', desc: 'Exclusive beats & sample packs', cat: 'Music', products: 40, svgId: 'torus' },
];

const categories = ['All', 'Fashion', 'Digital', 'Art', 'Services', 'Food', 'Music', 'Tech', 'Other'];

const bannerBg: Record<string, string> = {
  ring: 'radial-gradient(ellipse at 60% 40%, rgba(201,77,122,0.4), rgba(10,6,18,0.95))',
  cube: 'radial-gradient(ellipse at 40% 50%, rgba(124,58,237,0.4), rgba(10,6,18,0.95))',
  orb: 'radial-gradient(ellipse at 65% 45%, rgba(201,77,122,0.3), rgba(124,58,237,0.25), rgba(10,6,18,0.95))',
  cylinder: 'radial-gradient(ellipse at 60% 45%, rgba(232,93,138,0.35), rgba(10,6,18,0.95))',
  pill: 'radial-gradient(ellipse at 55% 50%, rgba(124,58,237,0.3), rgba(201,77,122,0.2), rgba(10,6,18,0.95))',
  torus: 'radial-gradient(ellipse at 65% 50%, rgba(201,77,122,0.35), rgba(124,58,237,0.3), rgba(10,6,18,0.95))',
  default: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.3), rgba(201,77,122,0.2), rgba(10,6,18,0.95))',
};

function GlassIcon({ id }: { id: string }) {
  if (id === 'ring') return (
    <svg viewBox="0 0 120 100" style={{ width: 90, height: 75 }}>
      <defs>
        <radialGradient id="rg" cx="35%" cy="25%" r="65%"><stop offset="0%" stopColor="rgba(255,255,255,0.9)"/><stop offset="60%" stopColor="rgba(201,77,122,0.4)"/><stop offset="100%" stopColor="rgba(124,58,237,0.15)"/></radialGradient>
      </defs>
      <circle cx="60" cy="52" r="28" fill="none" stroke="rgba(20,5,20,0.9)" strokeWidth="16"/>
      <circle cx="60" cy="52" r="28" fill="none" stroke="url(#rg)" strokeWidth="13"/>
      <path d="M 42 32 A 28 28 0 0 1 76 26" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="5" strokeLinecap="round"/>
      <path d="M 82 44 A 28 28 0 0 1 86 62" fill="none" stroke="rgba(201,77,122,0.7)" strokeWidth="3" strokeLinecap="round"/>
      <polygon points="60,14 68,24 60,30 52,24" fill="rgba(255,255,255,0.9)"/>
      <circle cx="58" cy="18" r="2.5" fill="white"/>
    </svg>
  );
  if (id === 'cube') return (
    <svg viewBox="0 0 120 100" style={{ width: 90, height: 75 }}>
      <defs>
        <linearGradient id="ctg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="rgba(255,255,255,0.9)"/><stop offset="100%" stopColor="rgba(124,58,237,0.4)"/></linearGradient>
        <linearGradient id="clg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="rgba(200,190,255,0.7)"/><stop offset="100%" stopColor="rgba(80,40,160,0.3)"/></linearGradient>
        <linearGradient id="crg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="rgba(201,77,122,0.5)"/><stop offset="100%" stopColor="rgba(232,93,138,0.8)"/></linearGradient>
      </defs>
      <polygon points="90,38 60,20 60,54 90,72" fill="url(#crg)"/>
      <polygon points="30,38 60,20 60,54 30,72" fill="url(#clg)"/>
      <polygon points="60,20 90,38 60,38 30,38" fill="url(#ctg)"/>
      <polygon points="60,20 90,38 75,44 45,28" fill="rgba(255,255,255,0.5)"/>
      <line x1="30" y1="38" x2="60" y2="20" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
      <ellipse cx="45" cy="30" rx="8" ry="4" fill="rgba(255,255,255,0.6)" transform="rotate(-22,45,30)"/>
    </svg>
  );
  if (id === 'orb') return (
    <svg viewBox="0 0 120 100" style={{ width: 90, height: 75 }}>
      <defs>
        <radialGradient id="sg" cx="32%" cy="26%" r="64%"><stop offset="0%" stopColor="rgba(255,255,255,0.95)"/><stop offset="40%" stopColor="rgba(201,77,122,0.5)"/><stop offset="100%" stopColor="rgba(80,20,60,0.2)"/></radialGradient>
        <radialGradient id="ss" cx="78%" cy="78%" r="45%"><stop offset="0%" stopColor="rgba(5,0,15,0.9)"/><stop offset="100%" stopColor="rgba(5,0,15,0)"/></radialGradient>
      </defs>
      <circle cx="60" cy="50" r="32" fill="#0e0020"/>
      <circle cx="60" cy="50" r="32" fill="url(#sg)"/>
      <circle cx="60" cy="50" r="32" fill="url(#ss)"/>
      <ellipse cx="46" cy="36" rx="12" ry="8" fill="rgba(255,255,255,0.85)" transform="rotate(-28,46,36)"/>
      <circle cx="44" cy="34" r="4" fill="white"/>
    </svg>
  );
  if (id === 'cylinder') return (
    <svg viewBox="0 0 120 100" style={{ width: 90, height: 75 }}>
      <defs>
        <radialGradient id="cytop" cx="38%" cy="32%" r="65%"><stop offset="0%" stopColor="rgba(255,255,255,0.9)"/><stop offset="70%" stopColor="rgba(201,77,122,0.5)"/><stop offset="100%" stopColor="rgba(80,10,30,0.3)"/></radialGradient>
        <linearGradient id="cybod" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="rgba(255,255,255,0.7)"/><stop offset="40%" stopColor="rgba(201,77,122,0.4)"/><stop offset="100%" stopColor="rgba(10,0,5,0.8)"/></linearGradient>
      </defs>
      <ellipse cx="60" cy="75" rx="30" ry="9" fill="rgba(40,10,20,0.8)"/>
      <rect x="30" y="30" width="60" height="46" fill="url(#cybod)"/>
      <ellipse cx="60" cy="30" rx="30" ry="9" fill="url(#cytop)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
      <ellipse cx="50" cy="26" rx="12" ry="4" fill="rgba(255,255,255,0.7)" transform="rotate(-5,50,26)"/>
      <rect x="30" y="32" width="9" height="43" fill="rgba(255,255,255,0.5)"/>
      <circle cx="46" cy="24" r="4" fill="rgba(255,255,255,0.95)"/>
    </svg>
  );
  if (id === 'pill') return (
    <svg viewBox="0 0 120 100" style={{ width: 90, height: 75 }}>
      <defs>
        <linearGradient id="pbod" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="rgba(255,255,255,0.9)"/><stop offset="45%" stopColor="rgba(124,58,237,0.6)"/><stop offset="100%" stopColor="rgba(20,5,40,0.8)"/></linearGradient>
        <radialGradient id="pcapr" cx="68%" cy="68%" r="55%"><stop offset="0%" stopColor="rgba(201,77,122,0.8)"/><stop offset="100%" stopColor="rgba(201,77,122,0)"/></radialGradient>
      </defs>
      <g transform="rotate(-12,60,50)">
        <rect x="18" y="34" width="84" height="32" rx="16" fill="url(#pbod)"/>
        <rect x="20" y="36" width="80" height="10" rx="5" fill="rgba(255,255,255,0.6)"/>
        <ellipse cx="34" cy="50" rx="16" ry="16" fill="rgba(255,255,255,0.2)"/>
        <ellipse cx="28" cy="42" rx="9" ry="5" fill="rgba(255,255,255,0.85)" transform="rotate(-5,28,42)"/>
        <circle cx="24" cy="40" r="4" fill="rgba(255,255,255,0.95)"/>
      </g>
    </svg>
  );
  if (id === 'torus') return (
    <svg viewBox="0 0 120 100" style={{ width: 90, height: 75 }}>
      <defs>
        <radialGradient id="tor" cx="34%" cy="26%" r="66%"><stop offset="0%" stopColor="rgba(255,255,255,0.9)"/><stop offset="55%" stopColor="rgba(124,58,237,0.6)"/><stop offset="100%" stopColor="rgba(20,5,40,0.3)"/></radialGradient>
        <radialGradient id="tamb" cx="76%" cy="74%" r="44%"><stop offset="0%" stopColor="rgba(201,77,122,0.7)"/><stop offset="100%" stopColor="rgba(201,77,122,0)"/></radialGradient>
        <mask id="dm2"><circle cx="60" cy="50" r="36" fill="white"/><circle cx="60" cy="50" r="17" fill="black"/></mask>
      </defs>
      <circle cx="60" cy="50" r="36" fill="#0c0030" mask="url(#dm2)"/>
      <circle cx="60" cy="50" r="36" fill="url(#tor)" mask="url(#dm2)"/>
      <circle cx="60" cy="50" r="36" fill="url(#tamb)" mask="url(#dm2)"/>
      <path d="M 34 18 A 36 36 0 0 1 84 14" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="7" strokeLinecap="round" mask="url(#dm2)"/>
      <ellipse cx="42" cy="20" rx="10" ry="5" fill="rgba(255,255,255,0.85)" transform="rotate(-40,42,20)"/>
    </svg>
  );
  // Default glass orb for real stores
  return (
    <svg viewBox="0 0 120 100" style={{ width: 90, height: 75 }}>
      <defs>
        <radialGradient id="defg" cx="32%" cy="26%" r="64%"><stop offset="0%" stopColor="rgba(255,255,255,0.95)"/><stop offset="40%" stopColor="rgba(201,77,122,0.4)"/><stop offset="100%" stopColor="rgba(80,20,60,0.2)"/></radialGradient>
      </defs>
      <circle cx="60" cy="50" r="32" fill="#0e0020"/>
      <circle cx="60" cy="50" r="32" fill="url(#defg)"/>
      <ellipse cx="46" cy="36" rx="12" ry="8" fill="rgba(255,255,255,0.85)" transform="rotate(-28,46,36)"/>
      <circle cx="44" cy="34" r="4" fill="white"/>
    </svg>
  );
}

export default function Marketplace() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [dbStores, setDbStores] = useState<any[]>([]);

  useEffect(() => {
    getStores().then(setDbStores);
  }, []);

  const realStores = dbStores.map(s => ({
    slug: s.slug,
    name: s.name,
    desc: s.tagline || s.description || 'A Vendra store',
    cat: s.category || 'Other',
    products: s.products?.length || 0,
    svgId: 'default',
    isReal: true,
  }));

  const allStores = [...sampleStores, ...realStores];

  const filtered = allStores.filter(s => {
    const matchCat = activeCat === 'All' || s.cat === activeCat;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase()) || s.cat.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '7rem 2.5rem 4rem' }}>

        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Live Stores</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: 0.95 }}>
            THE<br /><span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.25)' }}>MARKETPLACE</span>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
          <input type="text" placeholder="Search stores, categories, products..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', padding: '0.85rem 1rem 0.85rem 3rem', color: 'var(--ink)', fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', outline: 'none', borderRadius: 0 }} />
          <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '1rem' }}>🔍</div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 0, marginBottom: '2.5rem', flexWrap: 'wrap', border: '1px solid var(--border)' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.6rem 1.25rem', border: 'none', borderRight: '1px solid var(--border)', background: activeCat === cat ? 'var(--accent)' : 'transparent', color: activeCat === cat ? '#fff' : 'var(--muted)', cursor: 'pointer', transition: 'all 0.2s' }}>
              {cat}
            </button>
          ))}
        </div>

        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          {filtered.length} store{filtered.length !== 1 ? 's' : ''} found
        </div>

        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1px', background: 'var(--border)' }}>
            {filtered.map(store => (
              <Link key={store.slug} href={`/store/${store.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: 'var(--bg)', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}>
                  <div style={{ height: 200, position: 'relative', overflow: 'hidden', background: bannerBg[store.svgId] || bannerBg.default, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GlassIcon id={store.svgId} />
                  </div>
                  <div style={{ padding: '1.25rem 1.25rem 1.5rem', borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>{store.name}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 300, lineHeight: 1.5, marginBottom: '1rem' }}>{store.desc}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{store.cat}</span>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--accent2)' }}>{store.products} products</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', border: '1px solid var(--border)' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', marginBottom: '0.5rem' }}>No stores found</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>Try a different search or category</div>
          </div>
        )}
      </div>
    </main>
  );
}