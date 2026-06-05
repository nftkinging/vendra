'use client';
import Nav from '../Nav';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getStores } from '../lib/supabase';

export default function Marketplace() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getStores().then(s => { setStores(s || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const items = stores.flatMap((s: any) => (s.products || []).map((p: any) => ({
    id: p.id, name: p.name, price: p.price, image: p.image_url || '',
    cat: s.category || 'Other', storeSlug: s.slug, storeName: s.name,
  })));
  const CATS = ['All', ...Array.from(new Set(items.map(i => i.cat)))];
  const filtered = items.filter(i =>
    (cat === 'All' || i.cat === cat) &&
    ((i.name || '').toLowerCase().includes(search.toLowerCase()) ||
     (i.storeName || '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className='v4home'>
      <Nav theme='v4' />
      <section className='v4mkt-head'>
        <div className='v4mkt-head-inner'>
          <p className='eyebrow'>Arc Testnet {'·'} Live listings</p>
          <h1>The <span className='v4amber'>Marketplace</span></h1>
          <p className='lede'>Every listing on Vendra {'—'} zero platform fees, instant USDC settlement, and escrow on every order.</p>
          <input className='v4search' value={search} onChange={e => setSearch(e.target.value)} placeholder='Search listings…' />
        </div>
      </section>
      <section className='v4mkt-body'>
        <div className='chips'>
          {CATS.map(c => (<span key={c} className={'chip' + (cat === c ? ' active' : '')} onClick={() => setCat(c)}>{c}</span>))}
        </div>
        {loading ? (
          <div style={{ padding: '72px 0', display: 'flex', justifyContent: 'center' }}><div className='v4spinner' /></div>
        ) : filtered.length === 0 ? (
          <div className='v4empty'><h3>No listings yet</h3><p>Open a store and your products show up here instantly.</p></div>
        ) : (
          <div className='v4grid' style={{ marginTop: 32 }}>
            {filtered.map(i => (
              <Link key={i.storeSlug + '-' + i.id} href={'/store/' + i.storeSlug + '/' + i.id} className='pcard'>
                <div className='pc-img'>
                  <span className='pc-badge'>{i.cat}</span>
                  <img src={i.image} alt={i.name} loading='lazy' onError={(e) => { const d = e.currentTarget.parentElement; if (d) { d.classList.add('grad'); (d as HTMLElement).style.background = 'linear-gradient(150deg,#2c2c34,#16161a)'; } }} />
                  <span className='ph-name'>{i.name}</span>
                </div>
                <div className='pc-body'>
                  <div className='pc-name'>{i.name}</div>
                  <div className='pc-seller'>{i.storeName}</div>
                  <div className='pc-foot'><div className='pc-price'>{i.price}<span className='u'>USDC</span></div><span className='pc-buy'>View</span></div>
                </div>
              </Link>
            ))}
          </div>
        )}
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
