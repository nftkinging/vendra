'use client';
import Nav from '../../Nav';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const stores: Record<string, {
  name: string; desc: string; cat: string; tagline: string;
  wallet: string; svgBg: string;
  products: { name: string; price: number; type: string; desc: string }[];
}> = {
  'nour-atelier': {
    name: 'Nour Atelier', cat: 'Fashion',
    tagline: 'Handcrafted jewellery from the Middle East',
    desc: 'Each piece is handmade by artisans across the Middle East using traditional techniques passed down through generations. Shipped worldwide.',
    wallet: '0x1234...abcd',
    svgBg: 'radialGradient(circle at 68% 52%, #f8c8d8, #eddde8, #ddeaf4)',
    products: [
      { name: 'Gold Crescent Ring', price: 45, type: 'Physical', desc: 'Hand-forged 18k gold crescent ring' },
      { name: 'Silver Khamsa Pendant', price: 38, type: 'Physical', desc: 'Sterling silver hand of Fatima pendant' },
      { name: 'Lapis Lazuli Earrings', price: 62, type: 'Physical', desc: 'Natural lapis set in gold-plated brass' },
      { name: 'Lookbook PDF', price: 8, type: 'Digital', desc: 'Full 2025 collection lookbook' },
    ],
  },
  'bytedrop': {
    name: 'ByteDrop', cat: 'Digital',
    tagline: 'Premium UI kits and Figma assets',
    desc: 'Production-ready UI components, design systems, and Figma templates for modern web apps. Instant download after payment.',
    wallet: '0x5678...efgh',
    svgBg: 'radialGradient(circle at 28% 42%, #b8d0f4, #dce8f8, #f4ece4)',
    products: [
      { name: 'Web3 UI Kit', price: 29, type: 'Digital', desc: 'Complete Web3 component library in Figma' },
      { name: 'Dashboard Template', price: 19, type: 'Digital', desc: 'Analytics dashboard with dark/light modes' },
      { name: 'Icon Pack 500+', price: 15, type: 'Digital', desc: '500+ custom SVG icons for web apps' },
      { name: 'Full Bundle', price: 55, type: 'Digital', desc: 'All products at a discounted bundle price' },
    ],
  },
  'solar-prints': {
    name: 'Solar Prints', cat: 'Art',
    tagline: 'Limited edition art prints worldwide',
    desc: 'Museum-quality giclée prints on archival paper. Each edition is limited to 50 copies, signed and numbered. Ships worldwide.',
    wallet: '0x9abc...ijkl',
    svgBg: 'radialGradient(circle at 65% 50%, #f0d0e8, #e8ddf0, #d8eaf4)',
    products: [
      { name: 'Nebula Series #1', price: 120, type: 'Physical', desc: 'A2 giclée print, edition of 50' },
      { name: 'Solstice Series #3', price: 95, type: 'Physical', desc: 'A3 giclée print, edition of 50' },
      { name: 'Digital Download Pack', price: 25, type: 'Digital', desc: 'Full resolution files for personal use' },
    ],
  },
  'kode-studio': {
    name: 'Kode Studio', cat: 'Services',
    tagline: 'Custom dev work & automation',
    desc: 'Full-stack development, smart contract work, and workflow automation. Fast turnaround, clean code, fixed USDC pricing.',
    wallet: '0xdef0...mnop',
    svgBg: 'radialGradient(circle at 62% 48%, #f8d8a0, #ede4d4, #d8eaf4)',
    products: [
      { name: 'Landing Page', price: 299, type: 'Service', desc: 'Custom Next.js landing page, delivered in 5 days' },
      { name: 'Smart Contract Audit', price: 499, type: 'Service', desc: 'Full audit with written report' },
      { name: 'Bot / Automation', price: 199, type: 'Service', desc: 'Custom automation script or trading bot' },
    ],
  },
  'umami-box': {
    name: 'Umami Box', cat: 'Food',
    tagline: 'Artisan Japanese food kits',
    desc: 'Curated Japanese pantry staples and recipe kits, sourced directly from small producers in Japan. Ships globally in temperature-controlled packaging.',
    wallet: '0x1357...qrst',
    svgBg: 'radialGradient(circle at 65% 50%, #b8ecd0, #dceee4, #eeeae0)',
    products: [
      { name: 'Ramen Kit', price: 34, type: 'Physical', desc: 'Authentic tonkotsu ramen for 2' },
      { name: 'Miso Collection', price: 28, type: 'Physical', desc: '3 artisan miso varieties from Kyoto' },
      { name: 'Pantry Starter Box', price: 65, type: 'Physical', desc: '12 essential Japanese pantry items' },
    ],
  },
  'soundvault': {
    name: 'SoundVault', cat: 'Music',
    tagline: 'Exclusive beats & sample packs',
    desc: 'Premium beats and sample packs made by producers who have worked with major labels. Instant download. Commercial license included.',
    wallet: '0x2468...uvwx',
    svgBg: 'radialGradient(circle at 68% 52%, #f4c0d8, #ead8f0, #d0e4f8)',
    products: [
      { name: 'Trap Bundle Vol.3', price: 35, type: 'Digital', desc: '50 trap beats, commercial license' },
      { name: 'Lo-Fi Sample Pack', price: 18, type: 'Digital', desc: '200+ lo-fi samples and loops' },
      { name: 'Exclusive Lease', price: 75, type: 'Digital', desc: 'Exclusive rights to one beat of your choice' },
      { name: 'Full Catalogue', price: 120, type: 'Digital', desc: 'Access to all 400+ beats' },
    ],
  },
};

const typeIcon: Record<string, string> = { Physical: '📦', Digital: '💾', Service: '🛠' };

export default function StorePage() {
  const params = useParams();
  const slug = params.slug as string;
  const store = stores[slug];

  if (!store) return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '10rem 2rem', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem' }}>Store Not Found</div>
        <Link href="/marketplace"><button style={{ marginTop: '2rem', background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '0.75rem 2rem', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Back to Marketplace</button></Link>
      </div>
    </main>
  );

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />

      {/* Store Hero */}
      <div style={{ height: 280, position: 'relative', overflow: 'hidden', background: store.svgBg, borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', bottom: '2rem', left: '2.5rem', zIndex: 2 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{store.cat}</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem,5vw,4rem)', letterSpacing: '0.02em', lineHeight: 0.95 }}>{store.name}</div>
          <div style={{ fontSize: '0.95rem', color: 'var(--muted)', fontWeight: 300, marginTop: '0.5rem' }}>{store.tagline}</div>
        </div>
        <div style={{ position: 'absolute', bottom: '2rem', right: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border)', padding: '0.25rem 0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(240,237,232,0.8)' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)' }} /> Arc Testnet
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2.5rem 4rem' }}>
        {/* About */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>About</div>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>{store.desc}</p>
          </div>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Payment</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', color: 'var(--ink)', wordBreak: 'break-all', padding: '0.75rem', border: '1px solid var(--border)', marginBottom: '1rem' }}>{store.wallet}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
              {[['Currency', 'USDC'], ['Network', 'Arc Testnet'], ['Fee', '0%'], ['Settlement', 'Instant']].map(([l, v]) => (
                <div key={l} style={{ padding: '0.75rem', border: '1px solid var(--border)', borderCollapse: 'collapse' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{l}</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: 'var(--accent)', marginTop: '0.2rem' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Products — {store.products.length} listings</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1px', background: 'var(--border)' }}>
          {store.products.map((p, i) => (
            <div key={i} style={{ background: 'var(--bg)', padding: '1.5rem', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{typeIcon[p.type]}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>{p.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 300, lineHeight: 1.5, marginBottom: '1rem' }}>{p.desc}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', color: 'var(--accent)' }}>${p.price} USDC</div>
                <Link href={`/checkout?store=${slug}&product=${encodeURIComponent(p.name)}&price=${p.price}`}>
                  <button style={{ background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '0.4rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                    Buy →
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <Link href="/marketplace">
            <button style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', padding: '0.65rem 1.5rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
              ← Back to Marketplace
            </button>
          </Link>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Powered by Arc Testnet · 0% fees
          </div>
        </div>
      </div>
    </main>
  );
}