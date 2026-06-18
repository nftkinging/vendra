'use client';
import Nav from '../../Nav';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { parseEventLogs } from 'viem';
import { supabase, getStores } from '../../lib/supabase';
import { ESCROW_ADDRESS, escrowAbi } from '../../lib/escrow';

const STATE = ['None', 'Funded', 'Shipped', 'Released', 'Refunded', 'Disputed'];
const STATE_COLOR: Record<number, string> = { 1: '#B47E0E', 2: '#2563EB', 3: '#15803D', 4: '#6B7280', 5: '#B91C1C' };

export default function OrderPage() {
  const params = useParams();
  const id = params.id as string;
  const publicClient = usePublicClient();
  const [order, setOrder] = useState<any>(null);
  const [productImg, setProductImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [chainState, setChainState] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: o } = await supabase.from('orders').select('*').eq('id', id).single();
      setOrder(o);
      if (o) {
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

  // Read the real on-chain escrow state by recovering the order id from the fund tx hash.
  useEffect(() => {
    const readChain = async () => {
      if (!order || !publicClient) return;
      const hash = order.tx_hash as string | undefined;
      if (!hash || !hash.startsWith('0x')) return;
      try {
        const receipt = await publicClient.getTransactionReceipt({ hash: hash as `0x${string}` });
        const ev = parseEventLogs({ abi: escrowAbi, logs: receipt.logs, eventName: 'OrderFunded' });
        const escrowId = (ev[0] as any)?.args?.id;
        if (escrowId === undefined) return;
        const o = await publicClient.readContract({ address: ESCROW_ADDRESS, abi: escrowAbi, functionName: 'getOrder', args: [escrowId] }) as any;
        setChainState(Number(o.state));
      } catch { /* leave as generic escrow copy */ }
    };
    readChain();
  }, [order, publicClient]);

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
          <div className='co-escrow' style={{ background: 'var(--v4-aSoft, #FBF3DF)', display: 'block' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--v4-tx60, #6B6450)' }}>On-chain escrow</span>
              {chainState !== null && <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: STATE_COLOR[chainState] || '#6B7280' }}>{STATE[chainState] || 'Active'}</span>}
            </div>
            <span style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--v4-ink, #1A1206)' }}>
              {chainState === 1 && 'Your USDC is held in the Vendra escrow contract on Arc. It releases to the seller when you confirm receipt — or automatically after 7 days if you take no action.'}
              {chainState === 2 && 'The seller marked this shipped. Confirm receipt to release the funds, or it auto-releases after 7 days. Not as described? Open a dispute for a refund.'}
              {chainState === 3 && 'Funds have been released to the seller — this order is complete.'}
              {chainState === 4 && 'Funds were refunded to the buyer.'}
              {chainState === 5 && 'This order is in dispute and under Vendra arbitration.'}
              {chainState === null && "Your payment is secured by Vendra's on-chain escrow on Arc — the seller is paid when you confirm receipt, it auto-releases after 7 days if you take no action, and you can open a dispute for a refund."}
              {' '}<Link href='/escrow' style={{ color: 'var(--v4-aDeep, #B47E0E)', fontWeight: 600 }}>Manage on Escrow Orders →</Link>
            </span>
          </div>
        </div>
        {order.tx_hash && order.tx_hash.startsWith('0x') && (
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
      <footer className='ord-foot'><div className='ord-foot-brand'>Vendra</div><div className='ord-foot-copy'>On-chain Escrow · Arc Testnet</div><div className='ord-foot-links'><Link href='/marketplace'>Marketplace</Link></div></footer>
    </main>
  );
}
