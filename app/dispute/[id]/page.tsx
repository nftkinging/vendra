'use client';
import Nav from '../../Nav';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { usePublicClient, useWriteContract } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { useVendraWallet } from '../../lib/useVendraWallet';
import { ESCROW_ADDRESS, escrowAbi } from '../../lib/escrow';
import { addDisputeMessage, getDisputeMessages, uploadEvidence } from '../../lib/disputes';

const STATE = ['None', 'Funded', 'Shipped', 'Released', 'Refunded', 'Disputed'];
const STATE_COLOR: Record<number, string> = { 1: '#B47E0E', 2: '#2563EB', 3: '#15803D', 4: '#6B7280', 5: '#B91C1C' };
const MAX_BYTES = 10 * 1024 * 1024;

type Order = { buyer: string; seller: string; amount: bigint; state: number };
type Msg = { id: string; wallet: string; role: string | null; message: string | null; evidence_url: string | null; created_at: string };

const short = (a?: string) => (a ? a.slice(0, 6) + '…' + a.slice(-4) : '');
const lower = (x?: string) => (x || '').toLowerCase();
const isImg = (u?: string) => !!u && /\.(png|jpe?g|gif|webp|avif)$/i.test(u);

export default function DisputePage() {
  const params = useParams();
  const id = String(params?.id ?? '');
  const { address, isCircle, circle, ready } = useVendraWallet();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [order, setOrder] = useState<Order | null>(null);
  const [arbiter, setArbiter] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [evidence, setEvidence] = useState('');
  const [evidenceName, setEvidenceName] = useState('');
  const [split, setSplit] = useState('');
  const [note, setNote] = useState('');

  const load = useCallback(async () => {
    if (!publicClient || !id) return;
    setLoading(true);
    try {
      const o = await publicClient.readContract({
        address: ESCROW_ADDRESS, abi: escrowAbi, functionName: 'getOrder', args: [BigInt(id)],
      }) as { buyer: string; seller: string; amount: bigint; state: number };
      setOrder({ buyer: String(o.buyer), seller: String(o.seller), amount: o.amount as bigint, state: Number(o.state) });
      const a = await publicClient.readContract({ address: ESCROW_ADDRESS, abi: escrowAbi, functionName: 'arbiter' });
      setArbiter(String(a));
    } catch (e) { /* order may not exist */ }
    try { setMessages((await getDisputeMessages(Number(id))) as Msg[]); } catch (e) { /* table empty */ }
    setLoading(false);
  }, [publicClient, id]);

  useEffect(() => { if (ready) load(); }, [ready, load]);

  const isArbiter = !!order && !!address && lower(address) === lower(arbiter);
  const isBuyer = !!order && !!address && lower(address) === lower(order.buyer);
  const isSeller = !!order && !!address && lower(address) === lower(order.seller);
  const isParty = isBuyer || isSeller || isArbiter;
  const role = isArbiter ? 'arbiter' : isBuyer ? 'buyer' : isSeller ? 'seller' : 'observer';

  const onPickFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > MAX_BYTES) { setNote('File too large — max 10 MB.'); e.target.value = ''; return; }
    if (!/^image\//.test(file.type) && file.type !== 'application/pdf') { setNote('Only images or PDF are allowed.'); e.target.value = ''; return; }
    setUploading(true); setNote('');
    try {
      const url = await uploadEvidence(file);
      setEvidence(url); setEvidenceName(file.name);
    } catch (err) { setNote('Upload failed — try again.'); }
    setUploading(false);
    e.target.value = '';
  };

  const clearFile = () => { setEvidence(''); setEvidenceName(''); };

  const submitMsg = async () => {
    if (!address || (!msg.trim() && !evidence)) return;
    setBusy(true); setNote('');
    try {
      await addDisputeMessage({ escrow_id: Number(id), wallet: address, role, message: msg.trim(), evidence_url: evidence });
      setMsg(''); clearFile();
      setMessages((await getDisputeMessages(Number(id))) as Msg[]);
    } catch (e) { setNote('Could not submit — try again.'); }
    setBusy(false);
  };

  const resolve = async (toBuyer: bigint) => {
    setBusy(true); setNote('');
    try {
      if (isCircle && circle) {
        const res = await fetch('/api/circle/escrow', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletId: circle.walletId, action: 'resolve', id, toBuyer: toBuyer.toString() }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
      } else {
        const hash = await writeContractAsync({
          address: ESCROW_ADDRESS, abi: escrowAbi, functionName: 'resolve', args: [BigInt(id), toBuyer],
        });
        if (publicClient) await publicClient.waitForTransactionReceipt({ hash });
      }
      await load();
    } catch (e) {
      const err = e as { shortMessage?: string; message?: string };
      setNote(err?.shortMessage || err?.message || 'Resolve failed.');
    }
    setBusy(false);
  };

  const amt = order ? Number(formatUnits(order.amount, 6)) : 0;
  const stateLabel = order ? (STATE[order.state] || 'Unknown') : '';
  const stateColor = order ? (STATE_COLOR[order.state] || '#6B7280') : '#6B7280';

  return (
    <main className="v4home" style={{ minHeight: '100vh' }}>
      <Nav theme="v4" />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 80px' }}>
        <div className="eyebrow" style={{ color: 'var(--v4-aDeep,#B47E0E)' }}>DISPUTE RESOLUTION</div>
        <h1 style={{ fontSize: 38, fontWeight: 800, margin: '6px 0 4px', color: 'var(--v4-ink,#1A1206)' }}>
          Dispute <span className="v4amber" style={{ fontStyle: 'italic', color: 'var(--v4-a,#E2A41C)' }}>#{id}</span>
        </h1>

        {loading && <div className="v4spinner" style={{ margin: '40px auto' }} />}

        {!loading && !order && (
          <p className="lede" style={{ color: 'var(--v4-tx60,#6B6256)' }}>
            No on-chain order found for this id. <Link href="/escrow" style={{ color: 'var(--v4-aDeep,#B47E0E)' }}>Back to orders →</Link>
          </p>
        )}

        {!loading && order && !isParty && (
          <div style={{ background: 'var(--v4-card,#fff)', border: '1px solid var(--v4-line,#E7E1D4)', borderRadius: 18, padding: 28, marginTop: 18 }}>
            <p style={{ fontWeight: 700, color: 'var(--v4-ink,#1A1206)', margin: 0 }}>You don&apos;t have access to this dispute.</p>
            <p className="lede" style={{ color: 'var(--v4-tx60,#6B6256)', margin: '8px 0 0' }}>
              Only the buyer, the seller, or the Vendra arbiter can view and act on a dispute.
            </p>
          </div>
        )}

        {!loading && order && isParty && (
          <>
            <div style={{ background: 'var(--v4-card,#fff)', border: '1px solid var(--v4-line,#E7E1D4)', borderRadius: 18, padding: 24, marginTop: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--v4-ink,#1A1206)' }}>{amt} <span style={{ fontSize: 13, color: 'var(--v4-tx60,#6B6256)' }}>USDC</span></div>
                  <div style={{ fontSize: 13, color: 'var(--v4-tx60,#6B6256)', marginTop: 4 }}>
                    buyer {short(order.buyer)} · seller {short(order.seller)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--v4-tx60,#6B6256)', marginTop: 2 }}>
                    you are the <strong>{role}</strong>
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.08em', color: stateColor }}>{stateLabel.toUpperCase()}</span>
              </div>
            </div>

            {/* Evidence thread */}
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: '28px 0 10px', color: 'var(--v4-ink,#1A1206)' }}>Case file</h2>
            {messages.length === 0 && (
              <p className="lede" style={{ color: 'var(--v4-tx60,#6B6256)', margin: 0 }}>No statements yet. Both parties can add their account and evidence below.</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map((m) => (
                <div key={m.id} style={{ background: 'var(--v4-card,#fff)', border: '1px solid var(--v4-line,#E7E1D4)', borderRadius: 14, padding: '14px 16px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--v4-aDeep,#B47E0E)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                    {m.role || 'party'} · {short(m.wallet)}
                  </div>
                  {m.message && <div style={{ fontSize: 14, color: 'var(--v4-ink,#1A1206)', margin: '6px 0 0', whiteSpace: 'pre-wrap' }}>{m.message}</div>}
                  {m.evidence_url && isImg(m.evidence_url) && (
                    <a href={m.evidence_url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 8 }}>
                      <img src={m.evidence_url} alt="evidence" style={{ maxWidth: 220, maxHeight: 220, borderRadius: 10, border: '1px solid var(--v4-line,#E7E1D4)', display: 'block' }} />
                    </a>
                  )}
                  {m.evidence_url && !isImg(m.evidence_url) && (
                    <a href={m.evidence_url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: 'var(--v4-aDeep,#B47E0E)', display: 'inline-block', marginTop: 6 }}>
                      📎 View attachment
                    </a>
                  )}
                  <div style={{ fontSize: 11, color: 'var(--v4-tx60,#6B6256)', marginTop: 6 }}>{new Date(m.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>

            {/* Add statement */}
            <div style={{ background: 'var(--v4-card,#fff)', border: '1px solid var(--v4-line,#E7E1D4)', borderRadius: 14, padding: 16, marginTop: 14 }}>
              <textarea
                value={msg} onChange={(e) => setMsg(e.target.value)}
                placeholder="Describe what happened…"
                rows={3}
                style={{ width: '100%', border: '1px solid var(--v4-line,#E7E1D4)', borderRadius: 10, padding: '10px 12px', fontSize: 14, resize: 'vertical', background: 'var(--v4-paper,#F7F4EC)', color: 'var(--v4-ink,#1A1206)' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                <label className="v4btn v4btn-amber" style={{ cursor: uploading ? 'default' : 'pointer', margin: 0 }}>
                  {uploading ? 'Uploading…' : (evidenceName ? '✓ Attached' : '↑ Attach evidence')}
                  <input type="file" accept="image/*,application/pdf" disabled={uploading} onChange={onPickFile} style={{ display: 'none' }} />
                </label>
                {evidenceName && !uploading && (
                  <span style={{ fontSize: 12, color: 'var(--v4-tx60,#6B6256)' }}>
                    {evidenceName} <button onClick={clearFile} style={{ border: 'none', background: 'none', color: '#B91C1C', cursor: 'pointer', fontSize: 12, padding: 0, marginLeft: 4 }}>remove</button>
                  </span>
                )}
                <span style={{ fontSize: 11, color: 'var(--v4-tx60,#6B6256)' }}>image or PDF · max 10 MB</span>
              </div>
              <button className="v4btn v4btn-ink" disabled={busy || uploading} onClick={submitMsg} style={{ marginTop: 12 }}>
                {busy ? 'Submitting…' : 'Add to case file'}
              </button>
            </div>

            {/* Arbiter console */}
            {isArbiter && (
              <div style={{ border: '2px solid var(--v4-a,#E2A41C)', borderRadius: 18, padding: 22, marginTop: 26, background: 'var(--v4-card,#fff)' }}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.08em', color: 'var(--v4-aDeep,#B47E0E)' }}>ARBITER CONSOLE</div>
                {order.state !== 5 ? (
                  <p className="lede" style={{ color: 'var(--v4-tx60,#6B6256)', margin: '8px 0 0' }}>
                    This order isn&apos;t in dispute (currently {stateLabel}). Resolution is only available once a buyer raises a dispute.
                  </p>
                ) : (
                  <>
                    <p className="lede" style={{ color: 'var(--v4-tx60,#6B6256)', margin: '8px 0 16px' }}>
                      Review the case file above, then settle. Funds are frozen until you resolve.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      <button className="v4btn v4btn-amber" disabled={busy} onClick={() => resolve(order.amount)}>Refund buyer ({amt} USDC)</button>
                      <button className="v4btn v4btn-ink" disabled={busy} onClick={() => resolve(BigInt(0))}>Release to seller</button>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 14 }}>
                      <input
                        value={split} onChange={(e) => setSplit(e.target.value)}
                        placeholder="Refund to buyer (USDC)" inputMode="decimal"
                        style={{ flex: 1, border: '1px solid var(--v4-line,#E7E1D4)', borderRadius: 10, padding: '10px 12px', fontSize: 14, background: 'var(--v4-paper,#F7F4EC)', color: 'var(--v4-ink,#1A1206)' }}
                      />
                      <button
                        className="v4btn v4btn-ghost" disabled={busy || !split}
                        onClick={() => { try { resolve(parseUnits(split || '0', 6)); } catch (e) { setNote('Invalid amount'); } }}
                      >Custom split</button>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--v4-tx60,#6B6256)', marginTop: 10 }}>
                      Custom split sends that amount to the buyer; the remainder goes to the seller.
                    </p>
                  </>
                )}
              </div>
            )}

            {note && <p style={{ color: '#B91C1C', fontSize: 13, marginTop: 14 }}>{note}</p>}

            <div style={{ marginTop: 26, borderTop: '1px solid var(--v4-line,#E7E1D4)', paddingTop: 18 }}>
              <Link href="/escrow" style={{ fontSize: 14, color: 'var(--v4-aDeep,#B47E0E)' }}>← Back to escrow orders</Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
