'use client';
import Nav from '../Nav';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { formatUnits } from 'viem';
import { useVendraWallet } from '../lib/useVendraWallet';
import { ESCROW_ADDRESS, escrowAbi } from '../lib/escrow';

type Row = { id: number; buyer: string; seller: string; amount: bigint };
const short = (a?: string) => (a ? a.slice(0, 6) + '…' + a.slice(-4) : '');
const lower = (x?: string) => (x || '').toLowerCase();

export default function ArbiterPage() {
  const { address, ready } = useVendraWallet();
  const publicClient = usePublicClient();
  const [arbiter, setArbiter] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!publicClient) return;
    setLoading(true);
    try {
      const a = await publicClient.readContract({ address: ESCROW_ADDRESS, abi: escrowAbi, functionName: 'arbiter' });
      setArbiter(String(a));
      const nextBig = await publicClient.readContract({ address: ESCROW_ADDRESS, abi: escrowAbi, functionName: 'nextId' }) as bigint;
      const next = Number(nextBig);
      const found: Row[] = [];
      for (let i = 1; i < next; i++) {
        try {
          const o = await publicClient.readContract({ address: ESCROW_ADDRESS, abi: escrowAbi, functionName: 'getOrder', args: [BigInt(i)] }) as { buyer: string; seller: string; amount: bigint; state: number };
          if (Number(o.state) === 5) found.push({ id: i, buyer: String(o.buyer), seller: String(o.seller), amount: o.amount as bigint });
        } catch (e) { /* skip */ }
      }
      setRows(found.reverse());
    } catch (e) { /* read failed */ }
    setLoading(false);
  }, [publicClient]);

  useEffect(() => { if (ready) load(); }, [ready, load]);

  const isArbiter = !!address && !!arbiter && lower(address) === lower(arbiter);

  return (
    <main className="v4home" style={{ minHeight: '100vh' }}>
      <Nav theme="v4" />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 80px' }}>
        <div className="eyebrow" style={{ color: 'var(--v4-aDeep,#B47E0E)' }}>ARBITER</div>
        <h1 style={{ fontSize: 38, fontWeight: 800, margin: '6px 0 4px', color: 'var(--v4-ink,#1A1206)' }}>
          Dispute <span className="v4amber" style={{ fontStyle: 'italic', color: 'var(--v4-a,#E2A41C)' }}>queue</span>
        </h1>
        <p className="lede" style={{ color: 'var(--v4-tx60,#6B6256)', maxWidth: 480 }}>
          Orders currently frozen in dispute, read live from the Vendra escrow contract. Open one to review the case file and settle.
        </p>

        {loading && <div className="v4spinner" style={{ margin: '40px auto' }} />}

        {!loading && !isArbiter && (
          <div style={{ background: 'var(--v4-card,#fff)', border: '1px solid var(--v4-line,#E7E1D4)', borderRadius: 18, padding: 28, marginTop: 18 }}>
            <p style={{ fontWeight: 700, color: 'var(--v4-ink,#1A1206)', margin: 0 }}>Arbiter access only.</p>
            <p className="lede" style={{ color: 'var(--v4-tx60,#6B6256)', margin: '8px 0 0' }}>
              Connect the Vendra arbiter wallet to review disputes.
              {arbiter ? <> Expected: <strong>{short(arbiter)}</strong>.</> : null}
              {address ? <> You&apos;re connected as {short(address)}.</> : <> No wallet connected.</>}
            </p>
          </div>
        )}

        {!loading && isArbiter && rows.length === 0 && (
          <div style={{ background: 'var(--v4-card,#fff)', border: '1px solid var(--v4-line,#E7E1D4)', borderRadius: 18, padding: 28, marginTop: 18 }}>
            <p style={{ fontWeight: 700, color: 'var(--v4-ink,#1A1206)', margin: 0 }}>No open disputes 🎉</p>
            <p className="lede" style={{ color: 'var(--v4-tx60,#6B6256)', margin: '8px 0 0' }}>Nothing is frozen right now. New disputes will appear here automatically.</p>
          </div>
        )}

        {!loading && isArbiter && rows.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18 }}>
            {rows.map((r) => (
              <div key={r.id} style={{ background: 'var(--v4-card,#fff)', border: '1px solid var(--v4-line,#E7E1D4)', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--v4-ink,#1A1206)' }}>Order #{r.id}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--v4-ink,#1A1206)', marginTop: 4 }}>{Number(formatUnits(r.amount, 6))} <span style={{ fontSize: 12, color: 'var(--v4-tx60,#6B6256)' }}>USDC</span></div>
                    <div style={{ fontSize: 13, color: 'var(--v4-tx60,#6B6256)', marginTop: 4 }}>buyer {short(r.buyer)} · seller {short(r.seller)}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.08em', color: '#B91C1C' }}>DISPUTED</span>
                </div>
                <div style={{ marginTop: 14 }}>
                  <Link href={'/dispute/' + r.id} className="v4btn v4btn-amber">Review &amp; settle →</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 26 }}>
          <Link href="/escrow" style={{ fontSize: 14, color: 'var(--v4-aDeep,#B47E0E)' }}>← Back to escrow orders</Link>
        </div>
      </div>
    </main>
  );
}
