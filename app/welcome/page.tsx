'use client';
import Nav from '../Nav';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { getAllProfiles, getStoreByWallet } from '../lib/supabase';

export default function Welcome() {
  const { address } = useAccount();
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [buyerProfile, setBuyerProfile] = useState<any>(null);
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    if (!address) return;
    const load = async () => {
      const profiles = await getAllProfiles(address);
      setSellerProfile(profiles.find((p: any) => p.role === 'seller') || null);
      setBuyerProfile(profiles.find((p: any) => p.role === 'buyer') || null);
      setStore(await getStoreByWallet(address));
    };
    load();
  }, [address]);

  const displayName = () => {
    if (sellerProfile && store) return `${sellerProfile.display_name}, owner at ${store.name}`;
    if (sellerProfile) return sellerProfile.display_name;
    if (buyerProfile) return buyerProfile.display_name;
    return 'Vendra User';
  };

  const avatar = sellerProfile?.avatar_url || buyerProfile?.avatar_url;
  const initials = (sellerProfile?.display_name || buyerProfile?.display_name || 'VN').slice(0, 2).toUpperCase();

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem 3rem',
        background: 'radial-gradient(ellipse at 30% 50%, rgba(201,77,122,0.1), transparent 55%), radial-gradient(ellipse at 70% 40%, rgba(124,58,237,0.1), transparent 55%)'
      }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', marginBottom: '1.5rem', overflow: 'hidden', border: '2px solid var(--border2)' }}>
          {avatar ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
        </div>

        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>Welcome back</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.8rem,4vw,3rem)', textAlign: 'center', letterSpacing: '0.02em', marginBottom: '0.5rem', maxWidth: 700 }}>
          Hey, {displayName()}!
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--muted)', textAlign: 'center', fontWeight: 300, marginBottom: '3rem', maxWidth: 400 }}>
          You&apos;re all set up on Vendra. What would you like to do today?
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1px', width: '100%', maxWidth: 700, background: 'var(--border)' }}>
          <Link href="/marketplace" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '2.5rem', background: 'var(--bg2)', cursor: 'pointer', borderTop: '2px solid transparent', transition: 'all 0.2s', height: '100%' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderTopColor = '#7c3aed'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.borderTopColor = 'transparent'; }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛍️</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.03em', marginBottom: '0.5rem' }}>Continue Shopping</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '1.5rem' }}>Browse the marketplace, discover new stores and buy products with USDC.</div>
              <div style={{ background: '#7c3aed', color: '#fff', padding: '0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>Go to Marketplace →</div>
            </div>
          </Link>

          <Link href={store ? `/store/${store.slug}` : '/store/create'} style={{ textDecoration: 'none' }}>
            <div style={{ padding: '2.5rem', background: 'var(--bg2)', cursor: 'pointer', borderTop: '2px solid transparent', transition: 'all 0.2s', height: '100%' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderTopColor = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.borderTopColor = 'transparent'; }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏪</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.03em', marginBottom: '0.5rem' }}>
                {store ? 'Manage My Store' : 'Create My Store'}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '1.5rem' }}>
                {store ? `${store.name} — view products, track sales and manage your storefront.` : 'Launch your store and start selling on Arc Testnet instantly.'}
              </div>
              <div style={{ background: 'var(--accent)', color: '#fff', padding: '0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>
                {store ? 'Go to My Store →' : 'Create Store →'}
              </div>
            </div>
          </Link>
        </div>

        <Link href="/profile" style={{ marginTop: '1.5rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', textDecoration: 'none' }}>
          View full profile →
        </Link>
      </div>
    </main>
  );
}