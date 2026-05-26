'use client';
import Nav from '../../Nav';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getStoreBySlug } from '../../lib/supabase';
import { useCart } from '../../lib/cart';

const sampleStores: Record<string, any> = {
  'nour-atelier': { name: 'Nour Atelier', slug: 'nour-atelier', category: 'Fashion', tagline: 'Handcrafted jewellery from the Middle East', description: 'Each piece is handcrafted using traditional techniques passed down through generations.', owner_wallet: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', x_handle: '@nour_atelier', banner_url: '', products: [{ id: '1', name: 'Gold Crescent Ring', price: 45, type: 'Physical', description: 'Sterling silver with gold plating', image_url: '' }, { id: '2', name: 'Lapis Lazuli Earrings', price: 62, type: 'Physical', description: 'Genuine lapis lazuli stones', image_url: '' }, { id: '3', name: 'Silver Khamsa Pendant', price: 38, type: 'Physical', description: 'Traditional Khamsa hand symbol', image_url: '' }, { id: '4', name: 'Lookbook PDF', price: 8, type: 'Digital', description: 'Full season lookbook', image_url: '' }] },
  'bytedrop': { name: 'ByteDrop', slug: 'bytedrop', category: 'Digital', tagline: 'Premium UI kits and Figma assets', description: 'Professional design assets for modern products.', owner_wallet: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', x_handle: '@bytedrop', banner_url: '', products: [{ id: '1', name: 'Dashboard UI Kit', price: 49, type: 'Digital', description: 'Complete dashboard component library', image_url: '' }, { id: '2', name: 'Icon Pack Pro', price: 19, type: 'Digital', description: '500+ custom icons', image_url: '' }, { id: '3', name: 'Landing Page Templates', price: 35, type: 'Digital', description: '12 conversion-optimized templates', image_url: '' }] },
  'solar-prints': { name: 'Solar Prints', slug: 'solar-prints', category: 'Art', tagline: 'Limited edition art prints worldwide', description: 'Gallery-quality prints from independent artists.', owner_wallet: '0x90F79bf6EB2c4f870365E785982E1f101E93b906', x_handle: '@solarprints', banner_url: '', products: [{ id: '1', name: 'Desert Bloom Print', price: 55, type: 'Physical', description: 'A2 giclée print', image_url: '' }, { id: '2', name: 'Neon City Poster', price: 40, type: 'Physical', description: 'A1 format signed', image_url: '' }] },
  'kode-studio': { name: 'Kode Studio', slug: 'kode-studio', category: 'Services', tagline: 'Custom dev work and automation', description: 'We build custom tools, bots, and web apps.', owner_wallet: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', x_handle: '@kodestudio', banner_url: '', products: [{ id: '1', name: 'Landing Page Build', price: 299, type: 'Service', description: 'Custom Next.js landing page', image_url: '' }, { id: '2', name: 'Bot Development', price: 199, type: 'Service', description: 'Telegram or Discord bot', image_url: '' }] },
  'umami-box': { name: 'Umami Box', slug: 'umami-box', category: 'Food', tagline: 'Artisan Japanese food kits', description: 'Curated Japanese pantry essentials.', owner_wallet: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc', x_handle: '@umamibox', banner_url: '', products: [{ id: '1', name: 'Ramen Kit Deluxe', price: 28, type: 'Physical', description: 'Everything for authentic ramen', image_url: '' }, { id: '2', name: 'Matcha Collection', price: 35, type: 'Physical', description: 'Ceremonial grade matcha set', image_url: '' }] },
  'soundvault': { name: 'SoundVault', slug: 'soundvault', category: 'Music', tagline: 'Exclusive beats and sample packs', description: 'Professional-grade audio for creators.', owner_wallet: '0x976EA74026E726554dB657fA54763abd0C3a0aa9', x_handle: '@soundvault', banner_url: '', products: [{ id: '1', name: 'Lo-Fi Essentials Pack', price: 25, type: 'Digital', description: '50 lo-fi samples', image_url: '' }, { id: '2', name: 'Trap Drums Vol.2', price: 20, type: 'Digital', description: '200 one-shot drum samples', image_url: '' }, { id: '3', name: 'Custom Beat License', price: 150, type: 'Digital', description: 'Exclusive rights to one beat', image_url: '' }] },
};

export default function StorePage() {
  const params = useParams();
  const storeSlug = Array.isArray(params.slug) ? params.slug[0] : (params.slug as string);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const { addItem } = useCart();

  useEffect(() => {
    const load = async () => {
      if (sampleStores[storeSlug]) { setStore(sampleStores[storeSlug]); setLoading(false); return; }
      const dbStore = await getStoreBySlug(storeSlug);
      setStore(dbStore);
      setLoading(false);
    };
    load();
  }, [storeSlug]);

  const handleAddToCart = (product: any) => {
    if (!store) return;
    addItem({
      id: store.slug + '-' + product.id,
      storeSlug: store.slug,
      storeName: store.name,
      sellerWallet: store.owner_wallet,
      productName: product.name,
      price: product.price,
      image: product.image_url || '',
    });
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [product.id]: false })), 2000);
  };

  if (loading) return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Nav />
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 300, fontStyle: 'italic', color: 'var(--w18)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading store...</div>
    </main>
  );

  if (!store) return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Nav />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Cormorant',serif", fontSize: '3rem', fontWeight: 300, color: 'var(--w)', marginBottom: '1rem' }}>Store Not Found</div>
        <Link href='/marketplace'><button className='btn-primary'>Back to Marketplace</button></Link>
      </div>
    </main>
  );

  const products: any[] = store.products || [];
  const xHandle: string | null = store.x_handle ? (store.x_handle.startsWith('@') ? store.x_handle : '@' + store.x_handle) : null;

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />
      {store.banner_url ? (
        <div style={{ width: '100%', height: 300, overflow: 'hidden', position: 'relative', marginTop: '4.5rem' }}>
          <img src={store.banner_url} alt='store banner' style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, var(--bg) 100%)' }} />
        </div>
      ) : <div style={{ height: '4.5rem' }} />}

      <div style={{ borderBottom: '1px solid var(--b1)', background: store.banner_url ? 'transparent' : 'var(--bg2)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: store.banner_url ? '2rem 56px 3rem' : '5rem 56px 3rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,var(--a),var(--sl))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant',serif", fontSize: '1.4rem', fontWeight: 300, fontStyle: 'italic', flexShrink: 0, border: '1px solid var(--b2)', color: 'var(--bg)' }}>
              {store.name?.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 300, fontStyle: 'italic', color: 'var(--a)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6 }}>{store.category}{' · Arc Testnet'}</div>
              <div style={{ fontFamily: "'Cormorant',serif", fontSize: 'clamp(32px,5vw,52px)', fontWeight: 300, letterSpacing: '-0.01em', lineHeight: 0.94, color: 'var(--w)', marginBottom: 8 }}>{store.name}</div>
              {store.tagline && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 300, fontStyle: 'italic', color: 'var(--w35)', marginBottom: 6 }}>{store.tagline}</div>}
              {xHandle && <a href={'https://x.com/' + xHandle.replace('@', '')} target='_blank' rel='noopener noreferrer' style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 300, fontStyle: 'italic', color: 'var(--a)', textDecoration: 'none', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>{'𝕏 '}{xHandle}{' ↗'}</a>}
              {store.description && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 300, fontStyle: 'italic', color: 'var(--w35)', maxWidth: 520, lineHeight: 1.8, marginTop: 8 }}>{store.description}</div>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 56px 80px' }}>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--w18)', marginBottom: 32 }}>
          {products.length}{' product'}{products.length !== 1 ? 's' : ''}
        </div>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', border: '1px solid var(--b1)' }}>
            <div style={{ fontFamily: "'Cormorant',serif", fontSize: '2rem', fontWeight: 300, color: 'var(--w)', marginBottom: 8 }}>No Products Yet</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 300, fontStyle: 'italic', color: 'var(--w18)', letterSpacing: '0.10em' }}>This store has not listed any products yet</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1px', background: 'var(--b1)' }}>
            {products.map((product: any) => (
              <div key={product.id} style={{ background: 'var(--bg)', transition: 'background 0.35s' }} onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg2)')} onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}>
                {product.image_url ? (
                  <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden' }}>
                    <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.55s' }} />
                  </div>
                ) : (
                  <div style={{ width: '100%', aspectRatio: '3/4', background: 'linear-gradient(145deg,var(--bg2),var(--bg3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--w18)' }}>{'📦'}</div>
                )}
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontFamily: "'Cormorant',serif", fontSize: 20, fontWeight: 400, color: 'var(--w85)', lineHeight: 1.2, flex: 1, paddingRight: 12 }}>{product.name}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8, fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--w18)', border: '1px solid var(--b1)', padding: '3px 8px', flexShrink: 0 }}>{product.type}</div>
                  </div>
                  {product.description && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 300, fontStyle: 'italic', color: 'var(--w35)', lineHeight: 1.75, marginBottom: 16 }}>{product.description}</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontFamily: "'Cormorant',serif", fontSize: 24, fontWeight: 300, color: 'var(--w85)' }}>{'$'}{product.price}{' USDC'}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleAddToCart(product)} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', color: addedIds[product.id] ? 'var(--a2)' : 'var(--w35)', border: addedIds[product.id] ? '1px solid rgba(201,168,76,0.5)' : '1px solid var(--b1)', padding: '7px 14px', borderRadius: 2, background: 'transparent', cursor: 'pointer', transition: 'all 0.35s' }}>
                        {addedIds[product.id] ? '✓ Added' : '+ Cart'}
                      </button>
                      <Link href={'/checkout?store=' + store.slug + '&product=' + encodeURIComponent(product.name) + '&price=' + product.price}>
                        <button className='btn-primary' style={{ fontSize: 9, padding: '7px 14px' }}>Buy Now</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}