'use client';
import Nav from '../../Nav';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function OrderPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
      setOrder(data);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Nav />
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading order...</div>
    </main>
  );

  if (!order) return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Nav />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', marginBottom: '1rem' }}>Order Not Found</div>
        <Link href="/profile">
          <button className="btn-3d-accent" style={{ padding: '0.75rem 2rem', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Back to Profile
          </button>
        </Link>
      </div>
    </main>
  );

  const explorerUrl = 'https://testnet.arcscan.app/tx/' + order.tx_hash;

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '7rem 2rem 4rem' }}>

        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Order Receipt
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.02em', marginBottom: '2rem' }}>
          ORDER DETAILS
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(80,200,80,0.1)', border: '1px solid rgba(80,200,80,0.3)', padding: '0.4rem 1rem', marginBottom: '2rem' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#50c850' }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#50c850', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {order.status || 'Confirmed'}
          </span>
        </div>

        <div className="card-3d" style={{ marginBottom: '1.5rem', overflow: 'hidden' }}>
          <div style={{ padding: '2rem', background: 'radial-gradient(ellipse at 70% 50%, rgba(201,77,122,0.15), transparent 60%)', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              {order.product_name}
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: 'var(--accent2)' }}>
              {'$'}{Number(order.amount).toFixed(2)}{' USDC'}
            </div>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {[
              ['Date', new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
              ['Time', new Date(order.created_at).toLocaleTimeString()],
              ['Buyer', order.buyer_wallet ? order.buyer_wallet.slice(0, 8) + '...' + order.buyer_wallet.slice(-6) : ''],
              ['Seller', order.seller_wallet ? order.seller_wallet.slice(0, 8) + '...' + order.seller_wallet.slice(-6) : ''],
              ['Network', 'Arc Testnet'],
              ['Status', order.status || 'Confirmed'],
            ].map(([label, val]) => (
              <div key={String(label)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--ink)' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {order.tx_hash && (
          
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', border: '1px solid var(--border)', padding: '1rem', marginBottom: '1.5rem', textDecoration: 'none', background: 'var(--bg2)' }}
          >
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Transaction Hash
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--accent)', wordBreak: 'break-all' }}>
              {order.tx_hash}
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
              View on Arc Explorer
            </div>
          </a>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/profile">
            <button className="btn-3d-purple" style={{ padding: '0.75rem 1.5rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              View All Orders
            </button>
          </Link>
          <Link href="/marketplace">
            <button className="btn-3d-ghost" style={{ padding: '0.75rem 1.5rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Keep Shopping
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
