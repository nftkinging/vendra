'use client';
import Nav from '../../Nav';
import { useState, useRef, useEffect } from 'react';
import { useVendraWallet } from '../../lib/useVendraWallet';
import { useRouter } from 'next/navigation';
import { saveStore, getStoreByWallet, uploadImage, getProfile } from '../../lib/supabase';
import { useSendTransaction } from 'wagmi';
import { parseUnits } from 'viem';
import Link from 'next/link';

const CATS = [{ icon: '👗', name: 'Fashion' }, { icon: '💾', name: 'Digital' }, { icon: '🎨', name: 'Art' }, { icon: '🛠', name: 'Services' }, { icon: '🍱', name: 'Food' }, { icon: '📱', name: 'Tech' }, { icon: '🎵', name: 'Music' }, { icon: '✨', name: 'Other' }];
const FEE = 0.5;
const FEE_WALLET = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' as `0x${string}`;

export default function CreateStore() {
  const { address, isCircle, circle, ready } = useVendraWallet();
  const router = useRouter();
  const { sendTransactionAsync } = useSendTransaction();
  const bannerRef = useRef<HTMLInputElement>(null);
  const [cat, setCat] = useState('Fashion');
  const [form, setForm] = useState({ name: '', tagline: '', description: '', xHandle: '' });
  const [bannerFile, setBannerFile] = useState<File|null>(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [step, setStep] = useState<'form'|'paying'|'success'>('form');
  const [error, setError] = useState('');
  const [deployedStore, setDeployedStore] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [gate, setGate] = useState<'checking'|'ok'|'need'>('checking');

  useEffect(() => {
    if (!ready) return;
    if (!address) { setGate('ok'); return; }
    getProfile(address, 'seller').then(p => setGate(p ? 'ok' : 'need')).catch(() => setGate('ok'));
  }, [ready, address]);

  const slug = (form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) + (address ? '-' + address.slice(2,6) : '');
  const storeUrl = 'https://vendramarket.xyz/store/' + slug;
  const tweet = 'I just deployed my store "' + form.name + '" on Arc Testnet!\n\n' + storeUrl + '\n\n#ArcTestnet #Web3 #Vendra';

  // A store is only publishable when it's actually complete — name, tagline,
  // description and a banner image. This blocks half-empty / spam stores.
  const complete = !!(form.name.trim() && form.tagline.trim() && form.description.trim() && bannerFile);

  const handleBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setBannerFile(f); setBannerPreview(URL.createObjectURL(f));
  };

  const handleCreate = async () => {
    if (!address) { setError('Please connect your wallet'); return; }
    if (!form.name.trim()) { setError('Store name is required.'); return; }
    if (!form.tagline.trim()) { setError('Add a tagline so buyers know what you sell.'); return; }
    if (!form.description.trim()) { setError('Add a description for your store.'); return; }
    if (!bannerFile) { setError('A store banner image is required.'); return; }
    setLoading(true); setError('');
    try {
      const existing = await getStoreByWallet(address);
      if (existing) { setError('You already have a store. Delete it first.'); setLoading(false); return; }
      setStep('paying');
      let hash: string;
      if (isCircle && circle) {
        const res = await fetch('/api/circle/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ walletId: circle.walletId, walletAddress: address, toAddress: FEE_WALLET, amount: FEE.toString() }) });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        hash = 'circle:' + (data.txId || '');
      } else {
        hash = await sendTransactionAsync({ to: FEE_WALLET, value: parseUnits(FEE.toString(), 18) });
      }
      let bannerUrl = '';
      if (bannerFile && address) bannerUrl = await uploadImage('banners/' + address, bannerFile);
      const store = await saveStore({ owner_wallet: address, name: form.name, tagline: form.tagline, description: form.description, category: cat, slug, x_handle: form.xHandle, deploy_fee_tx: hash, banner_url: bannerUrl });
      setDeployedStore(store); setStep('success');
    } catch (e:any) {
      setStep('form');
      setError(e?.message?.includes('rejected') ? 'Transaction rejected.' : 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <main className='v4home' style={{ minHeight: '100vh' }}>
      <Nav theme='v4' />
      <div className='ob-wrap' style={{ maxWidth: 660 }}>

        {step === 'paying' && (
          <div className='sc-state'>
            <div className='v4spinner' style={{ margin: '0 auto 24px' }} />
            <h2 className='sc-state-h'>Deploying store</h2>
            <p className='sc-state-p'>{isCircle ? <>{'Sending the $'}{FEE}{' USDC deployment fee…'}</> : <>{'Approve the $'}{FEE}{' USDC deployment fee in your wallet…'}</>}</p>
          </div>)}

        {step === 'success' && (
          <div className='sc-state'>
            <div className='sc-tick'>✓</div>
            <h2 className='sc-state-h'>Store deployed</h2>
            <p className='sc-state-p'><strong>{form.name}</strong> is now live on Arc Testnet.</p>
            <div className='sc-state-actions'>
              <Link href={'/store/' + (deployedStore?.slug || slug)} className='v4btn v4btn-amber'>View my store →</Link>
              <Link href='/store/edit' className='v4btn v4btn-ink'>Add products →</Link>
              <a href={'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweet)} target='_blank' rel='noopener noreferrer' className='v4btn v4btn-ghost'>Share on 𝕏</a>
            </div>
          </div>)}

        {step === 'form' && (
          <>
            <p className='eyebrow'>Arc Testnet</p>
            <h1 className='ob-title'>Launch your <span className='v4amber'>store</span></h1>
            <p className='lede'>Set up in 2 minutes. Sell globally, get paid instantly.</p>
            <div className='sc-fee'><span className='sc-fee-dot' /><span className='sc-fee-txt'>{'Deployment fee: $'}{FEE}{' USDC · Arc Testnet'}</span></div>

            <div className='ob-card'>
              <div className='ob-card-head'>Store banner *</div>
              <div className='ob-card-body'>
                <input ref={bannerRef} type='file' accept='image/*' onChange={handleBanner} style={{ display: 'none' }} />
                {bannerPreview
                  ? <div className='sc-banner-prev'><img src={bannerPreview} alt='banner' /><button onClick={() => bannerRef.current?.click()} className='sc-banner-change'>Change</button></div>
                  : <div onClick={() => bannerRef.current?.click()} className='sc-banner-zone'><div className='sc-banner-ic'>🖼️</div><div className='sc-banner-label'>Click to upload banner</div><div className='sc-banner-hint'>Required · recommended 1200×400px</div></div>}
              </div>
            </div>

            <div className='ob-card'>
              <div className='ob-card-head'>Store identity</div>
              <div className='ob-card-body'>
                <div className='ob-field'><label className='ob-label'>Store name *</label><input className='ob-input' type='text' placeholder='e.g. Nour Atelier' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className='ob-field'><label className='ob-label'>Tagline *</label><input className='ob-input' type='text' placeholder='One line about what you sell' value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} /></div>
                <div className='ob-field'><label className='ob-label'>Description *</label><textarea className='ob-textarea' placeholder='Tell buyers what makes your store special...' value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                <div className='ob-field last'><label className='ob-label'>X (Twitter) handle</label><input className='ob-input' type='text' placeholder='@yourhandle' value={form.xHandle} onChange={e => setForm({ ...form, xHandle: e.target.value })} /></div>
              </div>
            </div>

            <div className='ob-card'>
              <div className='ob-card-head'>Category</div>
              <div className='sc-cats'>
                {CATS.map(c => <div key={c.name} onClick={() => setCat(c.name)} className={'sc-cat' + (cat === c.name ? ' sel' : '')}><div className='sc-cat-ic'>{c.icon}</div><div className='sc-cat-name'>{c.name}</div></div>)}
              </div>
            </div>

            <div className='ob-card'>
              <div className='ob-card-head'>Payment wallet · ERC-8004 Identity</div>
              <div className='ob-card-body'>
                <div className='sc-wallet-l'>Receives USDC payments from buyers</div>
                <div className='sc-wallet-v'>{address ? address.slice(0,6) + '...' + address.slice(-4) + ' · Arc Testnet' : 'Connect your wallet'}</div>
              </div>
            </div>

            {error && <div className='ob-error'>{error}</div>}
            {gate === 'need' ? (<>
              <div className='co-escrow' style={{ background: 'var(--v4-aSoft2)' }}><span className='co-dot' /><span>You need a seller profile to set up a store — it takes a few seconds.</span></div>
              <Link href={'/onboarding?role=seller&next=' + encodeURIComponent('/store/create')} className='v4btn v4btn-amber ob-cta' style={{ textAlign: 'center', display: 'block' }}>{'Create a seller profile →'}</Link>
            </>) : (<>
              {!complete && <div className='co-escrow' style={{ background: 'var(--v4-aSoft2)' }}><span className='co-dot' /><span>Add a banner, name, tagline and description to publish your store.</span></div>}
              <button onClick={handleCreate} disabled={loading || gate === 'checking' || !complete} className='v4btn v4btn-amber ob-cta'>{'Deploy store on Arc · $'}{FEE}{' USDC →'}</button>
            </>)}
            <div style={{ textAlign: 'center' }}><Link href='/profile' className='ob-backlink'>← Back to profile</Link></div>
          </>
        )}
      </div>
    </main>
  );
}
