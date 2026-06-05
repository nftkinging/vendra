'use client';
import Nav from '../../Nav';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getStoreBySlug } from '../../lib/supabase';
import { useCart } from '../../lib/cart';

export default function StorePage() {
  const params = useParams();
  const storeSlug = Array.isArray(params.slug) ? params.slug[0] : (params.slug as string);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Record<string,boolean>>({});
  const { addItem } = useCart();

  useEffect(() => {
    let active = true;
    setLoading(true);
    getStoreBySlug(storeSlug)
      .then(db => { if (active) { setStore(db); setLoading(false); } })
      .catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [storeSlug]);

  const handleAddToCart = (product: any) => {
    if (!store) return;
    addItem({ id: store.slug + '-' + product.id, storeSlug: store.slug, storeName: store.name, sellerWallet: store.owner_wallet, productName: product.name, price: product.price, image: product.image_url || '' });
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [product.id]: false })), 2000);
  };

  if (loading) return (<main className='v4home'><Nav theme='v4' /><div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 68 }}><div className='v4spinner' /></div></main>);
  if (!store) return (<main className='v4home'><Nav theme='v4' /><div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, paddingTop: 68 }}><div style={{ fontSize: 30, fontWeight: 600 }}>Store not found</div><Link href='/marketplace'><button className='v4btn v4btn-ink'>Back to marketplace</button></Link></div></main>);

  const products: any[] = store.products || [];
  const xHandle = store.x_handle ? (store.x_handle.startsWith('@') ? store.x_handle : '@' + store.x_handle) : null;

  return (
    <main className='v4home'>
      <Nav theme='v4' />
      {store.banner_url
        ? <div className='v4st-banner'><img src={store.banner_url} alt='' /></div>
        : <div style={{ height: 68 }} />}
      <section className='v4st-head'>
        <div className='v4st-head-inner'>
          <div className='v4st-emblem'>{store.name?.slice(0,2).toUpperCase()}</div>
          <div className='v4st-info'>
            <div className='v4st-cat'>{store.category}{' · Arc Testnet · ERC-8004 Verified'}</div>
            <h1 className='v4st-title'>{store.name}</h1>
            {store.tagline && <div className='v4st-tag'>{store.tagline}</div>}
            {xHandle && <a className='v4st-x' href={'https://x.com/' + xHandle.replace('@','')} target='_blank' rel='noopener noreferrer'>{'𝕏 '}{xHandle}{' ↗'}</a>}
            {store.description && <div className='v4st-desc'>{store.description}</div>}
          </div>
        </div>
      </section>
      <section className='v4st-body'>
        <div className='v4st-count'>{products.length}{' product'}{products.length !== 1 ? 's' : ''}</div>
        {products.length === 0
          ? <div className='v4empty' style={{ marginTop: 24 }}><h3>No products yet</h3><p>This store has not listed anything.</p></div>
          : <div className='v4grid' style={{ marginTop: 24 }}>
              {products.map((product: any) => {
                const pdp = '/store/' + store.slug + '/' + product.id;
                const checkoutHref = '/checkout?store=' + store.slug + '&product=' + encodeURIComponent(product.name) + '&price=' + product.price + '&seller=' + store.owner_wallet + '&qty=1';
                return (
                  <div key={product.id} className='pcard'>
                    <Link href={pdp} className='pc-imglink'>
                      <div className='pc-img'>
                        <span className='pc-badge'>{product.type}</span>
                        <img src={product.image_url} alt={product.name} loading='lazy' onError={(e) => { const d = e.currentTarget.parentElement; if (d) { d.classList.add('grad'); (d as HTMLElement).style.background = 'linear-gradient(150deg,#2c2c34,#16161a)'; } }} />
                        <span className='ph-name'>{product.name}</span>
                      </div>
                    </Link>
                    <div className='pc-body'>
                      <Link href={pdp} className='pc-namelink'><div className='pc-name'>{product.name}</div></Link>
                      {product.description && <div className='pc-desc'>{product.description}</div>}
                      <div className='pc-foot'>
                        <div className='pc-price'>{product.price}<span className='u'>USDC</span></div>
                        <Link href={checkoutHref}><button className='pc-buynow'>Buy</button></Link>
                      </div>
                      <button className={'pc-addcart' + (addedIds[product.id] ? ' added' : '')} onClick={() => handleAddToCart(product)}>{addedIds[product.id] ? 'Added ✓' : 'Add to cart'}</button>
                    </div>
                  </div>
                );
              })}
            </div>}
      </section>
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
