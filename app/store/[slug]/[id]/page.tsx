'use client';
import Nav from '../../../Nav';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getStoreBySlug } from '../../../lib/supabase';
import { useCart } from '../../../lib/cart';

export default function ProductPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : (params.slug as string);
  const pid = Array.isArray(params.id) ? params.id[0] : (params.id as string);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const { items, addItem, updateQuantity, openCart } = useCart();

  useEffect(() => {
    let active = true;
    setLoading(true);
    getStoreBySlug(slug)
      .then(db => { if (active) { setStore(db); setLoading(false); } })
      .catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  if (loading) return (<main className='v4home'><Nav theme='v4' /><div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 68 }}><div className='v4spinner' /></div></main>);

  const product = store && (store.products || []).find((p: any) => String(p.id) === String(pid));
  if (!store || !product) return (<main className='v4home'><Nav theme='v4' /><div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, paddingTop: 68 }}><div style={{ fontSize: 30, fontWeight: 600 }}>Product not found</div><Link href='/marketplace'><button className='v4btn v4btn-ink'>Back to marketplace</button></Link></div></main>);

  const cartId = store.slug + '-' + product.id;
  const others = (store.products || []).filter((p: any) => String(p.id) !== String(pid));
  const xHandle = store.x_handle ? (store.x_handle.startsWith('@') ? store.x_handle : '@' + store.x_handle) : null;

  const addToCart = () => {
    const existing = items.find(i => i.id === cartId);
    if (!existing) addItem({ id: cartId, storeSlug: store.slug, storeName: store.name, sellerWallet: store.owner_wallet, productName: product.name, price: product.price, image: product.image_url || '' });
    updateQuantity(cartId, (existing ? existing.quantity : 0) + qty);
    openCart();
    setAdded(true); setTimeout(() => setAdded(false), 1800);
  };

  const checkoutHref = '/checkout?store=' + store.slug + '&product=' + encodeURIComponent(product.name) + '&price=' + product.price + '&seller=' + store.owner_wallet + '&qty=' + qty;

  return (
    <main className='v4home'>
      <Nav theme='v4' />
      <div className='pdp-wrap'>
        <Link href={'/store/' + store.slug} className='pdp-back'>{'← '}{store.name}</Link>
        <div className='pdp-grid'>
          <div className='pdp-media'>
            {product.image_url
              ? <div className='pdp-img' onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }} onMouseLeave={() => setZoom({ on: false, x: 50, y: 50 })}>
                  <img src={product.image_url} alt={product.name} style={{ transformOrigin: zoom.x + '% ' + zoom.y + '%', transform: zoom.on ? 'scale(2)' : 'scale(1)' }} onError={(e) => { const d = e.currentTarget.parentElement; if (d) { (d as HTMLElement).style.background = 'linear-gradient(150deg,#2c2c34,#16161a)'; e.currentTarget.style.display = 'none'; } }} />
                </div>
              : <div className='pdp-img pdp-img-ph' style={{ background: 'linear-gradient(150deg,#2c2c34,#16161a)' }}><span>{product.name}</span></div>}
            {product.image_url && <div className='pdp-zoomhint'>Hover image to zoom</div>}
          </div>
          <div className='pdp-info'>
            <div className='pdp-cat'>{store.category}{xHandle ? ' · ' + xHandle : ''}</div>
            <h1 className='pdp-title'>{product.name}</h1>
            <div className='pdp-price'>{product.price}<span className='u'>USDC</span></div>
            {product.description && <p className='pdp-desc'>{product.description}</p>}
            <div className='pdp-specs'>
              {product.dimensions && <div className='spec-row'><span>Size</span><b>{product.dimensions}</b></div>}
              {product.weight && <div className='spec-row'><span>Weight</span><b>{product.weight}</b></div>}
              {product.condition && <div className='spec-row'><span>Condition</span><b>{product.condition}</b></div>}
              <div className='spec-row'><span>Type</span><b>{product.type}</b></div>
            </div>
            <div className='pdp-policy'><b>Buyer protection.</b> Every order is held in Vendra escrow (ERC-8183) until you confirm it arrived as described. If it does not, you are refunded in full — settlement is instant in USDC on Arc.</div>
            <div className='pdp-buybar'>
              <div className='pdp-qty'>
                <button className='qty-btn' onClick={() => setQty(q => Math.max(1, q - 1))} aria-label='Decrease quantity'>{'−'}</button>
                <span className='qty-val'>{qty}</span>
                <button className='qty-btn' onClick={() => setQty(q => q + 1)} aria-label='Increase quantity'>+</button>
              </div>
              <button className={'v4btn v4btn-ghost pdp-add' + (added ? ' is-added' : '')} onClick={addToCart}>{added ? 'Added ✓' : 'Add to cart'}</button>
              <Link href={checkoutHref} className='v4btn v4btn-amber pdp-buy'>Buy now</Link>
            </div>
          </div>
        </div>

        {others.length > 0 && (
          <div className='pdp-more'>
            <h2 className='pdp-more-h'>More from {store.name}</h2>
            <div className='v4grid' style={{ marginTop: 22 }}>
              {others.map((p: any) => (
                <Link key={p.id} href={'/store/' + store.slug + '/' + p.id} className='pcard'>
                  <div className='pc-img'>
                    <span className='pc-badge'>{p.type}</span>
                    <img src={p.image_url} alt={p.name} loading='lazy' onError={(e) => { const d = e.currentTarget.parentElement; if (d) { d.classList.add('grad'); (d as HTMLElement).style.background = 'linear-gradient(150deg,#2c2c34,#16161a)'; } }} />
                    <span className='ph-name'>{p.name}</span>
                  </div>
                  <div className='pc-body'>
                    <div className='pc-name'>{p.name}</div>
                    <div className='pc-seller'>{store.name}</div>
                    <div className='pc-foot'><div className='pc-price'>{p.price}<span className='u'>USDC</span></div><span className='pc-buy'>View</span></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <footer className='v4foot'>
        <div className='foot-wrap'>
          <div className='foot-brand'>
            <div className='v4brandrow'><span className='v4emblem'><span>V</span></span><span className='fb-name'>Vendra</span></div>
            <p>The Web3-native marketplace. Sell anything, keep everything, get paid instantly in USDC. Powered by Arc.</p>
          </div>
          <div className='foot-col'><h4>Marketplace</h4><Link href='/marketplace'>Browse</Link><Link href='/marketplace'>Categories</Link><Link href='/marketplace'>Top sellers</Link></div>
          <div className='foot-col'><h4>Sell</h4><Link href='/store/create'>Open a store</Link><Link href='/store/create'>Escrow and payouts</Link><Link href='/profile'>Reputation</Link></div>
          <div className='foot-col'><h4>Company</h4><Link href='/marketplace'>About</Link><a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer'>Faucet</a><a href='https://docs.arc.io/' target='_blank' rel='noopener noreferrer'>Docs</a></div>
        </div>
        <div className='foot-bot'><span>{'©'} 2026 Vendra {'·'} Commerce Unchained</span><span>Live on Arc Testnet {'·'} USDC native</span></div>
      </footer>
    </main>
  );
}
