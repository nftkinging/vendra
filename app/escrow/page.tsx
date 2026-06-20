'use client';
import Nav from '../Nav';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { usePublicClient, useWriteContract } from 'wagmi';
import { formatUnits } from 'viem';
import { useVendraWallet } from '../lib/useVendraWallet';
import { ESCROW_ADDRESS, escrowAbi } from '../lib/escrow';

const STATE = ['None', 'Funded', 'Shipped', 'Released', 'Refunded', 'Disputed'];
const STATE_COLOR: Record<number, string> = { 1: '#B47E0E', 2: '#2563EB', 3: '#15803D', 4: '#6B7280', 5: '#B91C1C' };
const SHIP_DEADLINE = 5 * 24 * 60 * 60;
const CONFIRM_WINDOW = 7 * 24 * 60 * 60;

type Ord = { id: number; buyer: string; seller: string; amount: bigint; fundedAt: number; shippedAt: number; state: number };

export default function EscrowOrders() {
  const { address, isCircle, circle, ready } = useVendraWallet();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [orders, setOrders] = useState<Ord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    if (!publicClient || !address) { setLoading(false); return; }
    setLoading(true); setErr('');
    try {
      const nextIdBig = await publicClient.readContract({ address: ESCROW_ADDRESS, abi: escrowAbi, functionName: 'nextId' }) as bigint;
      const nextId = Number(nextIdBig);
      const nextNum = Number(nextId);
      const startNum = nextNum > 100 ? nextNum - 100 : 1;
      const mine: Ord[] = [];
      for (let i = startNum; i <= nextNum; i++) {
        try {
          const o = await publicClient.readContract({ address: ESCROW_ADDRESS, abi: escrowAbi, functionName: 'getOrder', args: [BigInt(i)] }) as any;
          if (Number(o.state) === 0) continue; // empty / not-yet-assigned id
          const buyer = String(o.buyer); const seller = String(o.seller);
          if (buyer.toLowerCase() === address.toLowerCase() || seller.toLowerCase() === address.toLowerCase()) {
            mine.push({ id: i, buyer, seller, amount: o.amount as bigint, fundedAt: Number(o.fundedAt), shippedAt: Number(o.shippedAt), state: Number(o.state) });
          }
        } catch (e) { /* skip unreadable id */ }
      }
      setOrders(mine.reverse());
    } catch (e: any) { setErr(e?.shortMessage || e?.message || 'Could not load orders'); }
    setLoading(false);
  }, [publicClient, address]);

  useEffect(() => { if (ready) load(); }, [ready, load]);

  const act = async (fn: 'markShipped' | 'confirmReceipt' | 'raiseDispute' | 'reclaimUnshipped' | 'autoRelease', id: number) => {
    setBusy(id); setErr('');
    try {
      if (isCircle && circle) {
        const res = await fetch('/api/circle/escrow', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletId: circle.walletId, action: fn, id }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
      } else {
        const hash = await writeContractAsync({ address: ESCROW_ADDRESS, abi: escrowAbi, functionName: fn, args: [BigInt(id)] });
        if (publicClient) await publicClient.waitForTransactionReceipt({ hash });
      }
      await load();
    } catch (e: any) { setErr(e?.shortMessage || e?.message || 'Transaction failed'); }
    setBusy(null);
  };

  const now = Math.floor(Date.now() / 1000);

  return (
    <main className='v4home'>
      <Nav theme='v4' />
      <div className='co-wrap'>
        <p className='eyebrow'>On-chain</p>
        <h1 className='co-title'>Your escrow <span className='v4amber'>orders</span></h1>
        <p className='lede' style={{ marginBottom: 28 }}>Read live from the Vendra escrow contract on Arc. Sellers mark items shipped; buyers confirm receipt to release funds.</p>

        {ready && !address && <div className='co-escrow'><span className='co-dot' /><span>Connect a wallet or log in to see your escrow orders.</span></div>}
        {err && <div className='co-escrow' style={{ background: '#FBE9E7' }}><span className='co-dot' /><span>{err}</span></div>}
        {loading && address && <div className='v4spinner' style={{ margin: '40px auto' }} />}
        {!loading && address && orders.length === 0 && (
          <div className='co-escrow'><span className='co-dot' /><span>No escrow orders yet — buy something to fund your first one.</span></div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
          {orders.map(o => {
            const isBuyer = o.buyer.toLowerCase() === address?.toLowerCase();
            const isSeller = o.seller.toLowerCase() === address?.toLowerCase();
            const canReclaim = isBuyer && o.state === 1 && now >= o.fundedAt + SHIP_DEADLINE;
            const canAuto = isSeller && o.state === 2 && now >= o.shippedAt + CONFIRM_WINDOW;
            const cp = isBuyer ? o.seller : o.buyer;
            return (
              <div key={o.id} style={{ border: '1px solid var(--v4-line, #E7E0CF)', borderRadius: 16, padding: '18px 20px', background: 'var(--v4-card, #FCFAF4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontWeight: 600, color: 'var(--v4-ink, #1A1206)' }}>Order #{o.id}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: STATE_COLOR[o.state] || '#6B7280' }}>{STATE[o.state] || 'Unknown'}</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--v4-ink, #1A1206)' }}>{formatUnits(o.amount, 6)} <span style={{ fontSize: 13, color: 'var(--v4-tx60, #6B6450)' }}>USDC</span></div>
                <div style={{ fontSize: 13, color: 'var(--v4-tx60, #6B6450)', margin: '6px 0 14px' }}>
                  {isBuyer ? 'You are the buyer' : isSeller ? 'You are the seller' : ''} · {isBuyer ? 'seller' : 'buyer'} {cp.slice(0, 6)}…{cp.slice(-4)}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {isSeller && o.state === 1 && <button onClick={() => act('markShipped', o.id)} disabled={busy === o.id} className='v4btn v4btn-amber'>{busy === o.id ? '…' : 'Mark as shipped'}</button>}
                  {isBuyer && o.state === 2 && <button onClick={() => act('confirmReceipt', o.id)} disabled={busy === o.id} className='v4btn v4btn-amber'>{busy === o.id ? '…' : 'Confirm receipt & release'}</button>}
                  {canAuto && <button onClick={() => act('autoRelease', o.id)} disabled={busy === o.id} className='v4btn v4btn-ink'>{busy === o.id ? '…' : 'Claim (auto-release)'}</button>}
                  {canReclaim && <button onClick={() => act('reclaimUnshipped', o.id)} disabled={busy === o.id} className='v4btn v4btn-ink'>{busy === o.id ? '…' : 'Reclaim (not shipped)'}</button>}
                  {isBuyer && (o.state === 1 || o.state === 2) && <button onClick={() => act('raiseDispute', o.id)} disabled={busy === o.id} className='v4btn v4btn-ghost'>{busy === o.id ? '…' : 'Raise dispute'}</button>}
                  {(o.state === 1 || o.state === 2 || o.state === 5) && <Link className='v4btn v4btn-ghost' href={'/dispute/' + o.id}>{o.state === 5 ? 'Open dispute' : 'Dispute / evidence'}</Link>}
                  <a className='v4btn v4btn-ghost' href={'https://testnet.arcscan.app/address/' + ESCROW_ADDRESS} target='_blank' rel='noreferrer'>View contract</a>
                </div>
              </div>
            );
          })}
        </div>

        <div className='co-back' style={{ marginTop: 24 }}><Link href='/marketplace'>← Back to marketplace</Link></div>
      </div>
    </main>
  );
}
