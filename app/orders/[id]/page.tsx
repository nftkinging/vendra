'use client';
import Nav from '../../Nav';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase, getStores } from '../../lib/supabase';
import ArcEscrowStatus from '../../components/ArcEscrowStatus';

export default function OrderPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [escrow, setEscrow] = useState<any>(null);
  const [productImg, setProductImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: o } = await supabase.from('orders').select('*').eq('id', id).single();
      setOrder(o);
      if (o) {
        const { data: e } = await supabase.from('escrow_jobs').select('*').eq('order_id', id).single();
        setEscrow(e);
        try {
          const stores = await getStores();
          const base = (o.product_name || '').replace(/\s+x\d+$/i, '');
          let exact: string | null = null, nameOnly: string | null = null;
          (stores || []).forEach((s:any) => (s.products || []).forEach((p:any) => {
            if (p?.image_url && p.name === base) { if (s.owner_wallet === o.seller_wallet && !exact) exact = p.image_url; if (!nameOnly) nameOnly = p.image_url; }
          }));
          setProductImg(exact || nameOnly);
        } catch { /* keep box fallback */ }
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <main className='v4home' style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Nav theme='v4' /><div className='v4spinner' /></main>;

  if (!order) return (
    <main className='v4home' style={{ minHeight: '100vh' }}><Nav theme='v4' />
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
        <h1 className='ord-title'>Order not <span className='v4amber'>found</span></h1>
        <Link href='/profile' className='v4btn v4btn-amber'>Back to profile</Link>
      </div>
    </main>
  );

  const explorerUrl = 'https://testnet.arcscan.app/tx/' + order.tx_hash;

  return (
    <main className='v4home' style={{ minHeight: '100vh' }}>
      <Nav theme='v4' />
      <div className='ord-wrap'>
        <p className='eyebrow'>Order receipt</p>
        <h1 className='ord-title'>Order <span className='v4amber'>details</span></h1>
        <div className='ord-status'><span className='ord-status-dot' />{order.status || 'Confirmed'}</div>
        <div className='ord-card'>
          <div className='ord-card-top'>
            <div className='ord-imgwrap'><div className='ord-imgbox'>📦</div>{productImg && <img src={productImg} alt={order.product_name} className='ord-imgimg' onError={(e) => { e.currentTarget.style.display = 'none'; }} />}</div>
            <div className='ord-pname'>{order.product_name}</div>
            <div className='ord-amt'>${Number(order.amount).toFixed(2)} USDC</div>
          </div>
          <div className='ord-rows'>
            {[['Date', new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })], ['Time', new Date(order.created_at).toLocaleTimeString()], ['Buyer', order.buyer_wallet ? order.buyer_wallet.slice(0,8) + '...' + order.buyer_wallet.slice(-6) : ''], ['Seller', order.seller_wallet ? order.seller_wallet.slice(0,8) + '...' + order.seller_wallet.slice(-6) : ''], ['Network', 'Arc Testnet'], ['Status', order.status || 'Confirmed']].map(([label, val]) => (
              <div key={String(label)} className='ord-row'><span className='ord-row-l'>{label}</span><span className='ord-row-v'>{val}</span></div>
            ))}
          </div>
        </div>
        <div style={{ margin: '16px 0' }}>
          <ArcEscrowStatus orderId={id} status={escrow?.status || 'locked'} amount={Number(order.amount)} createdAt={order.created_at} />
        </div>
        {order.tx_hash && (
          <a href={explorerUrl} target='_blank' rel='noopener noreferrer' className='ord-tx'>
            <div className='ord-tx-l'>Transaction hash · Arc Testnet</div>
            <div className='ord-tx-h'>{order.tx_hash}</div>
            <div className='ord-tx-v'>View on Arc Explorer ↗</div>
          </a>)}
        <div className='ord-btns'>
          <Link href='/profile' className='v4btn v4btn-amber'>View all orders</Link>
          <Link href='/marketplace' className='v4btn v4btn-ghost'>Keep shopping</Link>
        </div>
      </div>
      <footer className='ord-foot'><div className='ord-foot-brand'>Vendra</div><div className='ord-foot-copy'>ERC-8183 Escrow · Arc Testnet</div><div className='ord-foot-links'><Link href='/marketplace'>Marketplace</Link></div></footer>
    </main>
  );
}
