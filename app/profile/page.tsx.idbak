'use client';
import Nav from '../Nav';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { getAllProfiles, getOrdersByBuyer, getOrdersBySeller, getStoreByWallet, deleteStore, getStores } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [buyerProfile, setBuyerProfile] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [buyerOrders, setBuyerOrders] = useState<any[]>([]);
  const [sellerOrders, setSellerOrders] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [view, setView] = useState<'seller'|'buyer'>('seller');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) { router.push('/'); return; }
    Promise.all([getAllProfiles(address), getStoreByWallet(address), getOrdersByBuyer(address), getOrdersBySeller(address), getStores()]).then(([all, s, bo, so, st]) => {
      const sp = all.find((p:any) => p.role === 'seller') || null;
      const bp = all.find((p:any) => p.role === 'buyer') || null;
      setSellerProfile(sp); setBuyerProfile(bp); setStore(s); setBuyerOrders(bo); setSellerOrders(so); setStores(st || []);
      if (sp) setView('seller'); else if (bp) setView('buyer');
      setLoading(false);
    });
  }, [address, isConnected, router]);

  const handleDeleteStore = async () => {
    if (!store) return; setDeleting(true);
    try { await deleteStore(store.id); setStore(null); setShowDelete(false); }
    catch (e) { console.error(e); } finally { setDeleting(false); }
  };

  const isSeller = !!sellerProfile, isBuyer = !!buyerProfile;
  const active = view === 'seller' ? sellerProfile : buyerProfile;
  const initials = active?.display_name?.slice(0,2).toUpperCase() || address?.slice(2,4).toUpperCase() || 'VN';
  const totalRevenue = sellerOrders.reduce((s,o) => s + Number(o.amount), 0);
  const totalSpent = buyerOrders.reduce((s,o) => s + Number(o.amount), 0);

  // resolve an order back to its product image (seller+name, then name-only)
  const stripQty = (n:string) => (n || '').replace(/\s+x\d+$/i, '');
  const imgExact: Record<string,string> = {};
  const imgName: Record<string,string> = {};
  stores.forEach((s:any) => (s.products || []).forEach((p:any) => {
    if (p?.image_url) { imgExact[s.owner_wallet + '|' + p.name] = p.image_url; if (!imgName[p.name]) imgName[p.name] = p.image_url; }
  }));
  const imgFor = (o:any): string | null => imgExact[o.seller_wallet + '|' + stripQty(o.product_name)] || imgName[stripQty(o.product_name)] || null;
  const Thumb = ({ o, sm }: { o:any; sm?:boolean }) => {
    const src = imgFor(o);
    return (
      <span className={'pf-thumb-wrap' + (sm ? ' sm' : '')}><span className='pf-thumb-box'>📦</span>{src && <img src={src} alt='' className='pf-thumb-img' onError={(e) => { e.currentTarget.style.display = 'none'; }} />}</span>
    );
  };

  if (loading) return <main className='v4home' style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Nav theme='v4' /><div className='v4spinner' /></main>;

  if (!isSeller && !isBuyer) return (
    <main className='v4home' style={{ minHeight: '100vh' }}><Nav theme='v4' />
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
        <h1 className='pf-name' style={{ fontSize: 'clamp(32px,5vw,52px)' }}>No profile <span className='v4amber'>found</span></h1>
        <p className='lede' style={{ margin: '12px 0 28px' }}>Complete onboarding to join Vendra.</p>
        <Link href='/onboarding' className='v4btn v4btn-amber'>Get started</Link>
      </div>
    </main>
  );

  return (
    <main className='v4home' style={{ minHeight: '100vh' }}>
      <Nav theme='v4' />
      {showDelete && <div className='pf-modal-bg'><div className='pf-modal'><div className='pf-modal-title'>Delete store?</div><div className='pf-modal-body'>This will permanently delete <strong style={{ color: 'var(--v4-ink)' }}>{store?.name}</strong> and all its products. This cannot be undone.</div><div style={{ display: 'flex', gap: 12 }}><button onClick={handleDeleteStore} disabled={deleting} className='pf-del-solid'>{deleting ? 'Deleting…' : 'Yes, delete'}</button><button onClick={() => setShowDelete(false)} className='v4btn v4btn-ghost'>Cancel</button></div></div></div>}

      <div className='pf-hero'>
        <div className='pf-hero-in'>
          <div className='pf-avatar'>{active?.avatar_url ? <img src={active.avatar_url} alt='avatar' /> : initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className='pf-name'>{active?.display_name || 'Vendra user'}{view === 'seller' && store && <span className='pf-owner'>owner · {store.name}</span>}</div>
            {active?.bio && <div className='pf-bio'>{active.bio}</div>}
            {active?.x_handle && <a href={'https://x.com/' + active.x_handle.replace('@','')} target='_blank' rel='noopener noreferrer' className='pf-x'>𝕏 {active.x_handle.startsWith('@') ? active.x_handle : '@' + active.x_handle} ↗</a>}
            <div className='pf-addr'>{address ? address.slice(0,6) + '...' + address.slice(-4) : ''} · Arc Testnet</div>
            <div className='pf-badges'>
              {isSeller && <div className='pf-badge amber'>Seller</div>}
              {isBuyer && <div className='pf-badge'>Buyer</div>}
              <div className='pf-badge'>ERC-8004 Identity</div>
            </div>
          </div>
          <div className='pf-actions'>
            {isSeller && isBuyer && <div className='pf-toggle'><button onClick={() => setView('seller')} className={view === 'seller' ? 'on' : ''}>Seller</button><button onClick={() => setView('buyer')} className={view === 'buyer' ? 'on' : ''}>Buyer</button></div>}
            {!isSeller && <Link href='/onboarding?role=seller' className='v4btn v4btn-amber'>+ Seller profile</Link>}
            {!isBuyer && <Link href='/onboarding?role=buyer' className='v4btn v4btn-ink'>+ Buyer profile</Link>}
            <Link href={'/edit-profile?role=' + view} className='v4btn v4btn-ghost'>Edit profile</Link>
          </div>
        </div>
      </div>

      {view === 'seller' && isSeller && (
        <div className='pf-wrap'>
          <div className='pf-stats s4'>
            {[{ val: '$' + totalRevenue.toFixed(2), label: 'Total revenue', amber: true }, { val: String(sellerOrders.length), label: 'Orders' }, { val: String(store?.products?.length || 0), label: 'Products' }, { val: '0%', label: 'Platform fee', amber: true }].map(s => (
              <div key={s.label} className='pf-stat'><div className={'pf-stat-v' + ((s as any).amber ? ' amber' : '')}>{s.val}</div><div className='pf-stat-l'>{s.label}</div></div>
            ))}
          </div>
          <div className='pf-grid'>
            <div>
              <div className='eyebrow' style={{ marginBottom: 14 }}>Your store</div>
              <div className='pf-card'>
                {store ? (
                  <div className='pf-store-pad'>
                    {store.banner_url && <div className='pf-store-banner'><img src={store.banner_url} alt='banner' /></div>}
                    <div className='pf-store-name'>{store.name}</div>
                    <div className='pf-store-tag'>{store.tagline}</div>
                    <div className='pf-store-meta'>{store.category} · {store.products?.length || 0} products · Arc Testnet</div>
                    <div className='pf-store-btns'>
                      <Link href={'/store/' + store.slug} className='v4btn v4btn-amber'>View storefront</Link>
                      <Link href='/store/edit?tab=products' className='v4btn v4btn-ghost'>+ Add products</Link>
                      <Link href='/store/edit' className='v4btn v4btn-ghost'>Edit store</Link>
                      <button onClick={() => setShowDelete(true)} className='pf-del'>Delete</button>
                    </div>
                  </div>
                ) : (
                  <div className='pf-empty'><div className='pf-empty-h'>No store yet</div><Link href='/store/create' className='v4btn v4btn-amber'>Create store</Link></div>
                )}
              </div>
            </div>
            <div className='pf-bal'>
              <div className='pf-bal-l'>Store balance</div>
              <div className='pf-bal-v'>${totalRevenue.toFixed(2)}</div>
              <div className='pf-bal-u'>USDC · Arc Testnet</div>
              <div className='pf-recent-h'>Recent sales</div>
              {sellerOrders.slice(0,3).length === 0 ? <div className='pf-recent-empty'>No sales yet</div>
              : sellerOrders.slice(0,3).map((o:any) => (
                <div key={o.id} className='pf-recent-row'><Thumb o={o} sm /><div style={{ flex: 1, minWidth: 0 }}><div className='pf-recent-name'>{o.product_name}</div><div className='pf-recent-date'>{new Date(o.created_at).toLocaleDateString()}</div></div><div className='pf-recent-amt'>+{Number(o.amount).toFixed(0)}</div></div>
              ))}
            </div>
          </div>
          <div className='eyebrow' style={{ marginBottom: 14 }}>All sales</div>
          <div className='pf-orders'>
            {sellerOrders.length === 0 ? <div className='pf-orders-empty'>No sales yet</div>
            : sellerOrders.map((o:any) => (
              <div key={o.id} className='pf-order'><Thumb o={o} /><div style={{ flex: 1, minWidth: 0 }}><div className='pf-order-name'>{o.product_name}</div><div className='pf-order-meta'>{new Date(o.created_at).toLocaleDateString()}{o.tx_hash ? ' · ' + o.tx_hash.slice(0,14) + '...' : ''}</div></div><div className='pf-order-amt'>${Number(o.amount).toFixed(2)}</div></div>
            ))}
          </div>
        </div>
      )}

      {view === 'buyer' && isBuyer && (
        <div className='pf-wrap'>
          <div className='pf-stats s3'>
            {[{ val: '$' + totalSpent.toFixed(2), label: 'Total spent' }, { val: String(buyerOrders.length), label: 'Orders' }, { val: 'Arc Testnet', label: 'Network' }].map(s => (
              <div key={s.label} className='pf-stat'><div className='pf-stat-v'>{s.val}</div><div className='pf-stat-l'>{s.label}</div></div>
            ))}
          </div>
          <div className='eyebrow' style={{ marginBottom: 14 }}>Order history</div>
          <div className='pf-orders' style={{ marginBottom: 28 }}>
            {buyerOrders.length === 0 ? <div className='pf-orders-empty'>No orders yet — <Link href='/marketplace' style={{ color: 'var(--v4-aDeep)' }}>explore the marketplace</Link></div>
            : buyerOrders.map((o:any) => (
              <Link key={o.id} href={'/orders/' + o.id} className='pf-order'><Thumb o={o} /><div style={{ flex: 1, minWidth: 0 }}><div className='pf-order-name'>{o.product_name}</div><div className='pf-order-meta'>{new Date(o.created_at).toLocaleDateString()} · click to view →</div></div><div className='pf-order-amt'>${Number(o.amount).toFixed(2)}</div></Link>
            ))}
          </div>
          <Link href='/marketplace' className='v4btn v4btn-amber'>Browse marketplace →</Link>
        </div>
      )}

      <footer className='pf-foot'><div className='pf-foot-brand'>Vendra</div><div className='pf-foot-copy'>ERC-8183 Escrow · ERC-8004 Identity · Arc Testnet</div><div className='pf-foot-links'><Link href='/marketplace'>Marketplace</Link><Link href='/store/create'>Sell</Link></div></footer>
    </main>
  );
}
