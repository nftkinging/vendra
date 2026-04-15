'use client';
import Nav from '../../Nav';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getStoreBySlug } from '../../lib/supabase';

const sampleStores: Record<string, any> = {
  'nour-atelier': {
    name: 'Nour Atelier', slug: 'nour-atelier', category: 'Fashion',
    tagline: 'Handcrafted jewellery from the Middle East',
    description: 'Each piece is handcrafted using traditional techniques passed down through generations.',
    owner_wallet: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    x_handle: '@nour_atelier',
    products: [
      { id: '1', name: 'Gold Crescent Ring', price: 45, type: 'Physical', description: 'Sterling silver with gold plating' },
      { id: '2', name: 'Lapis Lazuli Earrings', price: 62, type: 'Physical', description: 'Genuine lapis lazuli stones' },
      { id: '3', name: 'Silver Khamsa Pendant', price: 38, type: 'Physical', description: 'Traditional Khamsa hand symbol' },
      { id: '4', name: 'Lookbook PDF', price: 8, type: 'Digital', description: 'Full season lookbook' },
    ],
  },
  'bytedrop': {
    name: 'ByteDrop', slug: 'bytedrop', category: 'Digital',
    tagline: 'Premium UI kits and Figma assets',
    description: 'Professional design assets for modern products.',
    owner_wallet: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    x_handle: '@bytedrop',
    products: [
      { id: '1', name: 'Dashboard UI Kit', price: 49, type: 'Digital', description: 'Complete dashboard component library' },
      { id: '2', name: 'Icon Pack Pro', price: 19, type: 'Digital', description: '500+ custom icons' },
      { id: '3', name: 'Landing Page Templates', price: 35, type: 'Digital', description: '12 conversion-optimized templates' },
    ],
  },
  'solar-prints': {
    name: 'Solar Prints', slug: 'solar-prints', category: 'Art',
    tagline: 'Limited edition art prints worldwide',
    description: 'Gallery-quality prints from independent artists.',
    owner_wallet: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    x_handle: '@solarprints',
    products: [
      { id: '1', name: 'Desert Bloom Print', price: 55, type: 'Physical', description: 'A2 giclée print, limited to 50' },
      { id: '2', name: 'Neon City Poster', price: 40, type: 'Physical', description: 'A1 format, signed by artist' },
    ],
  },
  'kode-studio': {
    name: 'Kode Studio', slug: 'kode-studio', category: 'Services',
    tagline: 'Custom dev work & automation',
    description: 'We build custom tools, bots, and web apps.',
    owner_wallet: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    x_handle: '@kodestudio',
    products: [
      { id: '1', name: 'Landing Page Build', price: 299, type: 'Service', description: 'Custom Next.js landing page' },
      { id: '2', name: 'Bot Development', price: 199, type: 'Service', description: 'Telegram or Discord bot' },
    ],
  },
  'umami-box': {
    name: 'Umami Box', slug: 'umami-box', category: 'Food',
    tagline: 'Artisan Japanese food kits',
    description: 'Curated Japanese pantry essentials delivered worldwide.',
    owner_wallet: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    x_handle: '@umamibox',
    products: [
      { id: '1', name: 'Ramen Kit Deluxe', price: 28, type: 'Physical', description: 'Everything for authentic ramen' },
      { id: '2', name: 'Matcha Collection', price: 35, type: 'Physical', description: 'Ceremonial grade matcha set' },
    ],
  },
  'soundvault': {
    name: 'SoundVault', slug: 'soundvault', category: 'Music',
    tagline: 'Exclusive beats & sample packs',
    description: 'Professional-grade audio for creators.',
    owner_wallet: '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
    x_handle: '@soundvault',
    products: [
      { id: '1', name: 'Lo-Fi Essentials Pack', price: 25, type: 'Digital', description: '50 lo-fi samples and loops' },
      { id: '2', name: 'Trap Drums Vol.2', price: 20, type: 'Digital', description: '200 one-shot drum samples' },
      { id: '3', name: 'Custom Beat License', price: 150, type: 'Digital', description: 'Exclusive rights to one beat' },
    ],
  },
};

export default function StorePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (sampleStores[slug]) { setStore(sampleStores[slug]); setLoading(false); return; }
      const dbStore = await getStoreBySlug(slug);
      setStore(dbStore);
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Nav />
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading store...</div>
    </main>
  );

  if (!store) return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Nav />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', marginBottom: '1rem' }}>Store Not Found</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '2rem', letterSpacing: '0.08em' }}>This store doesn't exist or has been removed</div>
        <Link href="/marketplace"><button style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '0.75rem 2rem', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Back to Marketplace</button></Link>
      </div>
    </main>
  );

  const products = store.products || [];
  const xHandle = store.x_handle ? (store.x_handle.startsWith('@') ? store.x_handle : `@${store.x_handle}`) : null;

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />

      {/* Store Hero */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'radial-gradient(ellipse at 70% 50%, rgba(201,77,122,0.15), transparent 60%), radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.15), transparent 60%)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '8rem 2.5rem 3rem' }}>

          {/* Store identity row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {/* Store avatar */}
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', flexShrink: 0, border: '2px solid var(--border2)' }}>
              {store.name?.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                {store.category} · Arc Testnet
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: '0.5rem' }}>
                {store.name}
              </div>
              {store.tagline && (
                <div style={{ fontSize: '0.95rem', color: 'var(--muted)', fontWeight: 300, marginBottom: '0.5rem' }}>{store.tagline}</div>
              )}
              {xHandle && (
                <a href={`https://x.com/${xHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--accent)', textDecoration: 'none', marginBottom: '0.5rem' }}>
                  <span>𝕏</span> {xHandle} ↗
                </a>
              )}
              {store.description && (
                <div style={{ fontSize: '0.875rem', color: 'var(--muted)', fontWeight: 300, maxWidth: 500, lineHeight: 1.7, marginTop: '0.5rem' }}>{store.description}</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Products */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2.5rem 4rem' }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2rem' }}>
          {products.length} product{products.length !== 1 ? 's' : ''}
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', border: '1px solid var(--border)' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', marginBottom: '0.5rem' }}>No Products Yet</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>This store hasn't listed any products yet</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1px', background: 'var(--border)' }}>
            {products.map((product: any) => (
              <div key={product.id} style={{ background: 'var(--bg)', padding: '1.5rem', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '0.04em', flex: 1, paddingRight: '1rem' }}>{product.name}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.2rem 0.5rem', border: '1px solid var(--border)', color: 'var(--muted)', flexShrink: 0 }}>{product.type}</div>
                </div>
                {product.description && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 300, lineHeight: 1.6, marginBottom: '1.25rem' }}>{product.description}</div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', color: 'var(--accent2)' }}>${product.price} USDC</div>
                  <Link href={`/checkout?store=${store.slug}&product=${encodeURIComponent(product.name)}&price=${product.price}`}>
                    <button style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                      Buy →
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}