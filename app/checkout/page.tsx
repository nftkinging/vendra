'use client';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWaitForTransactionReceipt, useAccount, useSendTransaction } from 'wagmi';
import { parseUnits } from 'viem';
import Nav from '../Nav';


const storeName: Record<string, string> = {
  'nour-atelier': 'Nour Atelier',
  'bytedrop': 'ByteDrop',
  'solar-prints': 'Solar Prints',
  'kode-studio': 'Kode Studio',
  'umami-box': 'Umami Box',
  'soundvault': 'SoundVault',
};

const storeWallets: Record<string, `0x${string}`> = {
  'nour-atelier': '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  'bytedrop': '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  'solar-prints': '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
  'kode-studio': '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
  'umami-box': '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
  'soundvault': '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const { isConnected } = useAccount();
  const [step, setStep] = useState<'review' | 'paying' | 'success' | 'error'>('review');
  const [errorMsg, setErrorMsg] = useState('');
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const store = searchParams.get('store') || 'nour-atelier';
  const product = searchParams.get('product') || 'Signature Piece';
  const price = Number(searchParams.get('price') || '45');
  const sellerWallet = storeWallets[store] || storeWallets['nour-atelier'];

const { sendTransactionAsync } = useSendTransaction();
const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });
 const handlePay = async () => {
    if (!isConnected) {
      setErrorMsg('Please connect your wallet first');
      setStep('error');
      return;
    }
    try {
      setStep('paying');
      // Arc USDC is native — send as native token with 18 decimals
      const hash = await sendTransactionAsync({
        to: sellerWallet,
        value: parseUnits(price.toString(), 18),
      });
      setTxHash(hash);
      setStep('success');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Transaction failed';
      setErrorMsg(
        msg.includes('rejected')
          ? 'Transaction rejected in wallet'
          : msg.includes('insufficient')
          ? 'Insufficient USDC balance'
          : 'Transaction failed — please try again'
      );
      setStep('error');
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />
      <div style={{ maxWidth: 460, margin: '0 auto', padding: '7rem 2rem 4rem' }}>
        <div style={{ border: '1px solid var(--border)' }}>

          {step === 'review' && (
            <>
              <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', textAlign: 'center', background: 'var(--bg2)' }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{storeName[store] || store}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.05em' }}>{product}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', color: 'var(--accent)', letterSpacing: '0.02em' }}>${price} USDC</div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                {[
                  ['Product', product, false],
                  ['Network', 'Arc Testnet', true],
                  ['Gas fee', '~$0.001 USDC', false],
                  ['Total', `$${price} USDC`, true],
                ].map(([label, val, accent], i) => (
                  <div key={String(label)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ color: 'var(--muted)', fontWeight: 300, fontSize: '0.875rem' }}>{String(label)}</span>
                    <span style={{ fontWeight: 500, fontSize: String(label) === 'Total' ? '1.2rem' : '0.875rem', color: accent ? 'var(--accent)' : 'var(--ink)', fontFamily: String(label) === 'Total' ? "'Bebas Neue', sans-serif" : 'inherit' }}>{String(val)}</span>
                  </div>
                ))}
                {!isConnected && (
                  <div style={{ background: 'rgba(232,114,12,0.08)', border: '1px solid rgba(232,114,12,0.3)', padding: '0.75rem', marginTop: '1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.05em', textAlign: 'center' }}>
                    Connect your wallet to pay
                  </div>
                )}
                <button onClick={handlePay} disabled={!isConnected} style={{ width: '100%', background: isConnected ? 'var(--ink)' : 'var(--muted)', color: 'var(--bg)', border: 'none', padding: '1rem', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.15em', cursor: isConnected ? 'pointer' : 'not-allowed', marginTop: '1.5rem' }}>
                  {isConnected ? `Pay $${price} USDC →` : 'Connect Wallet to Pay'}
                </button>
                <div style={{ textAlign: 'center', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '1rem' }}>
                  Arc · Onchain · 0% Fee
                </div>
              </div>
            </>
          )}

          {step === 'paying' && (
            <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', marginBottom: '1rem' }}>
                {isConfirming ? 'Confirming...' : 'Waiting for approval...'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 300, marginBottom: '2rem' }}>
                {isConfirming ? 'Transaction submitted, waiting for confirmation' : 'Please approve the transaction in your wallet'}
              </div>
              <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '4rem', color: 'var(--accent)' }}>✓</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Payment Confirmed</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem', fontWeight: 300 }}>
                ${price} USDC sent to {storeName[store]} on Arc Testnet
              </div>
              {txHash && (
                <a href={`https://testnet.arcscan.app/tx/${txHash}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--accent)', wordBreak: 'break-all', padding: '0.75rem', border: '1px solid var(--border)', marginBottom: '1.5rem', textDecoration: 'none' }}>
                  View on Arc Explorer →<br />{txHash.slice(0, 20)}...{txHash.slice(-8)}
                </a>
              )}
              <Link href={`/store/${store}`}>
                <button style={{ background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '0.75rem 2rem', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Back to Store
                </button>
              </Link>
            </div>
          )}

          {step === 'error' && (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', color: '#e84040' }}>✕</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Transaction Failed</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem', fontWeight: 300 }}>{errorMsg}</div>
              <button onClick={() => setStep('review')} style={{ background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '0.75rem 2rem', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                Try Again
              </button>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

export default function Checkout() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}