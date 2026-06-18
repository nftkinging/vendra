'use client';
import Nav from '../Nav';
import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useWriteContract, usePublicClient } from 'wagmi';
import { parseUnits } from 'viem';
import { saveOrder, createEscrowJob, getProfile } from '../lib/supabase';
import { useVendraWallet } from '../lib/useVendraWallet';
import { ESCROW_ADDRESS, USDC_ADDRESS, escrowAbi, erc20Abi } from '../lib/escrow';

const ZERO_REF = '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`;
const isFundsError = (m: string) => /insufficient|not enough|balance|funds|exceeds/i.test(m || '');

function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { address, isCircle, circle, ready } = useVendraWallet();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const store = params.get('store') || '';
  const product = params.get('product') || '';
  const price = Number(params.get('price') || 0);
  const qty = Math.max(1, Number(params.get('qty') || 1));
  const total = price * qty;
  const seller = (params.get('seller') || '0x70997970C51812dc3A010C7d01b50e0d17dc79C8') as `0x${string}`;
  const [step, setStep] = useState<'review'|'confirm'|'paying'|'success'|'error'|'nofunds'>('review');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [gate, setGate] = useState<'checking'|'ok'|'need'>('checking');
  const nextUrl = '/checkout?' + params.toString();

  useEffect(() => {
    if (!ready) return;
    if (!address) { setGate('ok'); return; }
    getProfile(address, 'buyer').then(p => setGate(p ? 'ok' : 'need')).catch(() => setGate('ok'));
  }, [ready, address]);

  // Click "Pay": web3 goes straight to the wallet popups; Circle does a balance
  // pre-check and then an explicit in-app confirmation (custodial = no native popup).
  const onPay = async () => {
    if (!address) { router.push('/join'); return; }
    if (!(isCircle && circle)) { handleBuy(); return; }
    setChecking(true); setError('');
    try {
      const res = await fetch('/api/circle/balance', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletId: circle.walletId }),
      });
      const data = await res.json();
      const bal = parseFloat(data.balance || '0');
      if (bal < total) { setStep('nofunds'); return; }
      setStep('confirm');
    } catch {
      // if the balance check itself fails, don't block — let them confirm and try
      setStep('confirm');
    } finally { setChecking(false); }
  };

  const handleBuy = async () => {
    if (!address) { router.push('/join'); return; }
    setStep('paying');
    try {
      let hash: string;
      if (isCircle && circle) {
        // Circle wallets: fund the on-chain escrow via Circle contract execution
        // (approve + fund, server-signed). Returns the real on-chain tx hash.
        const res = await fetch('/api/circle/escrow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletId: circle.walletId, action: 'fund', seller, amount: total.toString() }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        hash = data.txHash || ('circle:' + (data.fundTxId || ''));
      } else {
        // Web3 wallets: USDC is a 6-decimal ERC-20 on Arc. Step 1: approve. Step 2: fund.
        const amount6 = parseUnits(total.toString(), 6);
        const approveHash = await writeContractAsync({
          address: USDC_ADDRESS, abi: erc20Abi, functionName: 'approve', args: [ESCROW_ADDRESS, amount6],
        });
        if (publicClient) await publicClient.waitForTransactionReceipt({ hash: approveHash });
        const fundHash = await writeContractAsync({
          address: ESCROW_ADDRESS, abi: escrowAbi, functionName: 'fund', args: [seller, amount6, ZERO_REF],
        });
        if (publicClient) await publicClient.waitForTransactionReceipt({ hash: fundHash });
        hash = fundHash;
      }
      const order = await saveOrder({ buyer_wallet: address, seller_wallet: seller, product_name: qty > 1 ? product + ' x' + qty : product, amount: total, tx_hash: hash });
      await createEscrowJob({ order_id: order?.id, buyer_wallet: address, seller_wallet: seller, amount: total, tx_hash: hash });
      setTxHash(hash); setStep('success');
    } catch (e: any) {
      const msg = e?.message || '';
      if (isFundsError(msg)) { setStep('nofunds'); return; }
      setError(msg.includes('rejected') ? 'Transaction rejected in wallet' : (msg || 'Transaction failed — please try again'));
      setStep('error');
    }
  };

  return (
    <main className='v4home'>
      <Nav theme='v4' />
      <div className='co-wrap'>
        {step === 'review' && (<>
          <p className='eyebrow'>Checkout</p>
          <h1 className='co-title'>Confirm your <span className='v4amber'>purchase</span></h1>
          <div className='co-card'>
            <div className='co-row'>
              <div>
                <div className='co-lbl'>Product</div>
                <div className='co-prod'>{product}</div>
                <div className='co-store'>{store}</div>
              </div>
              <div className='co-qtytag'>Qty {qty}</div>
            </div>
            <div className='co-total'>
              <span className='co-lbl'>Total</span>
              <span className='co-amt'>{total}<span className='u'>USDC</span></span>
            </div>
          </div>
          <div className='co-escrow'><span className='co-dot' /><span>Your USDC is locked in an on-chain escrow contract on Arc until you confirm delivery. It auto-releases to the seller after 7 days, and you can open a dispute for a refund if the item isn't as described.</span></div>
          {gate === 'need' ? (<>
            <div className='co-escrow' style={{ background: 'var(--v4-aSoft2)' }}><span className='co-dot' /><span>You need a buyer profile to complete checkout — it takes a few seconds and lets you track your orders.</span></div>
            <Link href={'/onboarding?role=buyer&next=' + encodeURIComponent(nextUrl)} className='v4btn v4btn-amber co-pay'>Create a buyer profile <span className='arr'>→</span></Link>
          </>) : (
            <button onClick={onPay} disabled={gate === 'checking' || checking} className='v4btn v4btn-amber co-pay'>{checking ? 'Checking your wallet…' : <>Pay {total} USDC on Arc <span className='arr'>→</span></>}</button>
          )}
          <div className='co-back'><Link href={'/store/' + store}>← Back to store</Link></div>
        </>)}
        {step === 'confirm' && (
          <div className='co-state'>
            <p className='eyebrow'>Confirm payment</p>
            <h2 className='co-state-h'>Pay {total} USDC from your Circle wallet?</h2>
            <p className='co-state-p'>This locks <strong>{total} USDC</strong> in Vendra&apos;s on-chain escrow on Arc. It releases to the seller when you confirm receipt — or automatically after 7 days — and you can dispute for a refund if the item isn&apos;t as described. A small gas fee (also in USDC) applies.</p>
            <div className='co-state-actions'>
              <button onClick={handleBuy} className='v4btn v4btn-amber'>Confirm &amp; pay {total} USDC</button>
              <button onClick={() => setStep('review')} className='v4btn v4btn-ghost'>Cancel</button>
            </div>
          </div>)}
        {step === 'paying' && (
          <div className='co-state'>
            <div className='v4spinner' style={{ margin: '0 auto 24px' }} />
            <h2 className='co-state-h'>Processing</h2>
            <p className='co-state-p'>{isCircle ? 'Approving and funding the escrow from your Circle wallet — this can take a few seconds…' : 'Approve the USDC, then confirm the escrow deposit in your wallet…'}</p>
          </div>)}
        {step === 'success' && (
          <div className='co-state'>
            <div className='co-tick'>✓</div>
            <h2 className='co-state-h'>Payment confirmed</h2>
            <p className='co-state-p'>Settled on Arc Testnet · your USDC is locked in escrow and releases when you confirm receipt (or automatically after 7 days).</p>
            {txHash && (txHash.startsWith('0x')
              ? <a className='co-tx' href={'https://testnet.arcscan.app/tx/' + txHash} target='_blank' rel='noreferrer'>{txHash}</a>
              : <div className='co-tx'>{txHash}</div>)}
            <div className='co-state-actions'>
              <Link href='/escrow' className='v4btn v4btn-amber'>View my orders</Link>
              <Link href='/marketplace' className='v4btn v4btn-ghost'>Keep shopping</Link>
            </div>
          </div>)}
        {step === 'nofunds' && (
          <div className='co-state'>
            <div className='co-cross'>!</div>
            <h2 className='co-state-h'>Not enough USDC</h2>
            <p className='co-state-p'>Your Circle wallet doesn&apos;t have enough USDC to cover this {total} USDC purchase plus the small Arc gas fee (also paid in USDC). Top up your wallet and try again.</p>
            <div className='co-state-actions'>
              <a href='https://faucet.circle.com/' target='_blank' rel='noreferrer' className='v4btn v4btn-amber'>Get testnet USDC →</a>
              <button onClick={() => setStep('review')} className='v4btn v4btn-ghost'>Back</button>
            </div>
          </div>)}
        {step === 'error' && (
          <div className='co-state'>
            <div className='co-cross'>✕</div>
            <h2 className='co-state-h'>Transaction failed</h2>
            <p className='co-state-p'>{error}</p>
            <button onClick={() => setStep('review')} className='v4btn v4btn-ghost' style={{ marginTop: 20 }}>Try again</button>
          </div>)}
      </div>
    </main>
  );
}

export default function Checkout() {
  return <Suspense><CheckoutContent /></Suspense>;
}
