'use client';
import Nav from '../../Nav';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { saveStore, getStoreByWallet } from '../../lib/supabase';
import { useSendTransaction } from 'wagmi';
import { parseUnits } from 'viem';

const categories = [
  { icon: '👗', name: 'Fashion' }, { icon: '💾', name: 'Digital' },
  { icon: '🎨', name: 'Art' }, { icon: '🛠', name: 'Services' },
  { icon: '🍱', name: 'Food' }, { icon: '📱', name: 'Tech' },
  { icon: '🎵', name: 'Music' }, { icon: '✨', name: 'Other' },
];

const DEPLOY_FEE = 0.5;
const FEE_WALLET = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' as `0x${string}`;

export default function CreateStore() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { sendTransactionAsync } = useSendTransaction();
  const [selectedCat, setSelectedCat] = useState('Fashion');
  const [form, setForm] = useState({ name: '', tagline: '', description: '', xHandle: '' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'paying' | 'success'>('form');
  const [error, setError] = useState('');
  const [deployedStore, setDeployedStore] = useState<any>(null);
  const [showShareCard, setShowShareCard] = useState(false);
  const [copied, setCopied] = useState('');

  const tweetText = `I just deployed my store "${form.name}" on Arc Testnet! 🛍️\n\nVisit now and start shopping on Vendra — the decentralized marketplace built on Arc.\n\n👉 https://vendra-app-omega.vercel.app/store/${form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${address?.slice(2, 6)}\n\n#ArcTestnet #Web3 #Vendra`;

  const handleCopyTweet = () => {
    navigator.clipboard.writeText(tweetText);
    setCopied('tweet');
    setTimeout(() => setCopied(''), 2000);
  };

  const handleShareX = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
  };

  const inputStyle = { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.6rem 0', color: 'var(--ink)', fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', outline: 'none' };
  const labelStyle = { display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '0.4rem' };
  const blockHeadStyle = { padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, background: 'var(--bg2)' };

  const handleCreate = async () => {
    if (!address || !isConnected) { setError('Please connect your wallet'); return; }
    if (!form.name) { setError('Please enter a store name'); return; }
    setLoading(true);
    setError('');
    try {
      const existing = await getStoreByWallet(address);
      if (existing) { setError('You already have a store. Delete it first to create a new one.'); setLoading(false); return; }
      setStep('paying');
      const hash = await sendTransactionAsync({
        to: FEE_WALLET,
        value: parseUnits(DEPLOY_FEE.toString(), 18),
      });
      const slug = `${form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${address.slice(2, 6)}`;
      const store = await saveStore({
        owner_wallet: address,
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        category: selectedCat,
        slug,
        x_handle: form.xHandle,
        deploy_fee_tx: hash,
      });
      setDeployedStore(store);
      setStep('success');
    } catch (e: any) {
      setStep('form');
      setError(e?.message?.includes('rejected') ? 'Transaction rejected.' : 'Something went wrong. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />

      {/* Share card modal */}
      {showShareCard && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,6,18,0.85)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', maxWidth: 480, width: '100%' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.05em' }}>Share Your Store 🎉</div>
              <button onClick={() => setShowShareCard(false)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {/* Tweet preview */}
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '1.25rem', marginBottom: '1.5rem', fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>
                {tweetText}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={handleCopyTweet} style={{ flex: 1, background: copied === 'tweet' ? 'rgba(80,200,80,0.2)' : 'var(--bg3)', color: copied === 'tweet' ? '#50c850' : 'var(--ink)', border: '1px solid var(--border)', padding: '0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  {copied === 'tweet' ? '✓ Copied!' : 'Copy Tweet'}
                </button>
                <button onClick={handleShareX} style={{ flex: 1, background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Share on X →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '7rem 2.5rem 4rem' }}>

        {step === 'paying' && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', marginBottom: '1rem' }}>Deploying Store...</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 300, marginBottom: '2rem' }}>Please approve the ${DEPLOY_FEE} USDC deployment fee in your wallet</div>
            <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '5rem', color: 'var(--accent)', lineHeight: 1 }}>✓</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.02em', marginBottom: '0.75rem' }}>Store Deployed!</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 300, marginBottom: '2.5rem' }}>
              <strong style={{ color: 'var(--ink)' }}>{form.name}</strong> is now live on Arc Testnet and visible in the marketplace.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 320, margin: '0 auto' }}>
              <button onClick={() => setShowShareCard(true)} style={{ background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.85rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                🐦 Share on X
              </button>
              <button onClick={() => router.push(`/store/${deployedStore?.slug}`)} style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '0.85rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                View My Store →
              </button>
              <button onClick={() => router.push('/profile')} style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', padding: '0.85rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                Go to Profile
              </button>
            </div>
          </div>
        )}

        {step === 'form' && (
          <>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border)', padding: '0.25rem 0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)' }} /> Arc Testnet
              </div>
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3.5rem', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: '0.5rem' }}>
              LAUNCH<br />YOUR STORE
            </div>
            <p style={{ color: 'var(--muted)', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 300 }}>
              Set up in 2 minutes. Start selling globally, instantly.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(201,77,122,0.08)', border: '1px solid rgba(201,77,122,0.2)', padding: '0.5rem 0.75rem', marginBottom: '2.5rem', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--accent)', letterSpacing: '0.06em' }}>
              ⚡ Deployment fee: ${DEPLOY_FEE} USDC · paid on Arc Testnet
            </div>

            <div style={{ border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <div style={blockHeadStyle}>Store Identity</div>
              <div style={{ padding: '1.25rem' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>Store name *</label>
                  <input type="text" placeholder="e.g. Nour Atelier" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>Tagline</label>
                  <input type="text" placeholder="One line about what you sell" value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>Description</label>
                  <textarea placeholder="Tell buyers what makes your store special..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} />
                </div>
                <div>
                  <label style={labelStyle}>X (Twitter) handle</label>
                  <input type="text" placeholder="@yourhandle" value={form.xHandle} onChange={e => setForm({ ...form, xHandle: e.target.value })} style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={{ border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <div style={blockHeadStyle}>Category</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
                {categories.map(cat => (
                  <div key={cat.name} onClick={() => setSelectedCat(cat.name)} style={{ padding: '0.75rem 0.5rem', textAlign: 'center', cursor: 'pointer', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: selectedCat === cat.name ? 'var(--accent)' : 'transparent', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{cat.icon}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: selectedCat === cat.name ? '#fff' : 'var(--muted)' }}>{cat.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <div style={blockHeadStyle}>Payment Wallet</div>
              <div style={{ padding: '1.25rem' }}>
                <label style={labelStyle}>Receives USDC payments from buyers</label>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)} · Arc Testnet` : 'Connect your wallet'}
                </div>
              </div>
            </div>

            {error && (
              <div style={{ border: '1px solid rgba(232,80,80,0.3)', background: 'rgba(232,80,80,0.08)', padding: '0.75rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#e85050', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <button onClick={handleCreate} disabled={loading} style={{ width: '100%', background: loading ? 'var(--muted)' : 'var(--accent)', color: '#fff', border: 'none', padding: '1rem', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.15em', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Processing...' : `Deploy Store on Arc · $${DEPLOY_FEE} USDC →`}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', cursor: 'pointer' }} onClick={() => router.push('/profile')}>
              ← Back to Profile
            </div>
          </>
        )}
      </div>
    </main>
  );
}