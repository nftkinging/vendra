'use client';
import Nav from '../../Nav';
import { useState, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { saveStore, getStoreByWallet, uploadImage } from '../../lib/supabase';
import { useSendTransaction } from 'wagmi';
import { parseUnits } from 'viem';
import Link from 'next/link';

const CATS = [{icon:'👗',name:'Fashion'},{icon:'💾',name:'Digital'},{icon:'🎨',name:'Art'},{icon:'🛠',name:'Services'},{icon:'🍱',name:'Food'},{icon:'📱',name:'Tech'},{icon:'🎵',name:'Music'},{icon:'✨',name:'Other'}];
const FEE = 0.5;
const FEE_WALLET = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' as `0x${string}`;

export default function CreateStore() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { sendTransactionAsync } = useSendTransaction();
  const bannerRef = useRef<HTMLInputElement>(null);
  const [cat, setCat] = useState('Fashion');
  const [form, setForm] = useState({ name:'', tagline:'', description:'', xHandle:'' });
  const [bannerFile, setBannerFile] = useState<File|null>(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [step, setStep] = useState<'form'|'paying'|'success'>('form');
  const [error, setError] = useState('');
  const [deployedStore, setDeployedStore] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const slug = (form.name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''))+(address?'-'+address.slice(2,6):'');
  const storeUrl = 'https://vendra-app-omega.vercel.app/store/'+slug;
  const tweet = 'I just deployed my store "'+form.name+'" on Arc Testnet!\n\n'+storeUrl+'\n\n#ArcTestnet #Web3 #Vendra';

  const handleBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setBannerFile(f); setBannerPreview(URL.createObjectURL(f));
  };

  const handleCreate = async () => {
    if (!address || !isConnected) { setError('Please connect your wallet'); return; }
    if (!form.name) { setError('Store name is required'); return; }
    setLoading(true); setError('');
    try {
      const existing = await getStoreByWallet(address);
      if (existing) { setError('You already have a store. Delete it first.'); setLoading(false); return; }
      setStep('paying');
      const hash = await sendTransactionAsync({ to: FEE_WALLET, value: parseUnits(FEE.toString(), 18) });
      let bannerUrl = '';
      if (bannerFile && address) bannerUrl = await uploadImage('banners/'+address, bannerFile);
      const store = await saveStore({ owner_wallet:address, name:form.name, tagline:form.tagline, description:form.description, category:cat, slug, x_handle:form.xHandle, deploy_fee_tx:hash, banner_url:bannerUrl });
      setDeployedStore(store); setStep('success');
    } catch(e:any) {
      setStep('form');
      setError(e?.message?.includes('rejected')?'Transaction rejected.':'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <main style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Nav />
      <div style={{maxWidth:640,margin:'0 auto',padding:'120px 56px 80px'}}>

        {step==='paying'&&(
          <div style={{textAlign:'center',padding:'4rem 0'}}>
            <div style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:300,color:'var(--w)',marginBottom:16}}>Deploying Store</div>
            <div style={{fontSize:13,fontWeight:300,fontStyle:'italic',color:'var(--w35)',marginBottom:32}}>Approve the {'$'}{FEE}{' USDC deployment fee in your wallet'}</div>
            <div className='v-spinner' style={{margin:'0 auto'}}/>
          </div>)}

        {step==='success'&&(
          <div style={{textAlign:'center',padding:'3rem 0'}}>
            <div style={{fontFamily:"'Cormorant',serif",fontSize:'5rem',fontWeight:300,color:'var(--a2)',lineHeight:1,marginBottom:16}}>✓</div>
            <div style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:300,color:'var(--w)',marginBottom:12}}>Store Deployed</div>
            <div style={{fontSize:13,fontWeight:300,fontStyle:'italic',color:'var(--w35)',marginBottom:36,lineHeight:1.7}}><strong style={{color:'var(--w)'}}>{form.name}</strong>{' is now live on Arc Testnet'}</div>
            <div style={{display:'flex',flexDirection:'column',gap:12,maxWidth:280,margin:'0 auto'}}>
              <a href={'https://twitter.com/intent/tweet?text='+encodeURIComponent(tweet)} target='_blank' rel='noopener noreferrer'><button className='btn-ghost' style={{width:'100%',padding:'14px'}}>Share on 𝕏</button></a>
              <Link href={'/store/'+(deployedStore?.slug||slug)}><button className='btn-primary' style={{width:'100%',padding:'14px'}}>View My Store →</button></Link>
              <Link href='/store/edit'><button className='btn-amber-ghost' style={{width:'100%',padding:'14px'}}>Add Products →</button></Link>
            </div>
          </div>)}

        {step==='form'&&(
          <>
            <div className='v-eyebrow' style={{marginBottom:24}}><div className='v-eyebrow-rule'/><span className='v-eyebrow-label'>Arc Testnet</span></div>
            <h1 style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(40px,6vw,72px)',fontWeight:300,letterSpacing:'-0.01em',lineHeight:0.94,color:'var(--w)',marginBottom:12}}>Launch Your<br/><em style={{fontStyle:'italic',background:'linear-gradient(120deg,var(--a),var(--a2))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Store</em></h1>
            <p style={{fontSize:13,fontWeight:300,fontStyle:'italic',color:'var(--w35)',marginBottom:8,lineHeight:1.7}}>Set up in 2 minutes. Sell globally, get paid instantly.</p>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,border:'1px solid rgba(212,176,90,0.2)',padding:'8px 16px',marginBottom:40}}>
              <div className='v-arc-badge-dot'/>
              <span style={{fontSize:10,fontWeight:300,fontStyle:'italic',letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--a)'}}>{'Deployment fee: $'}{FEE}{' USDC · Arc Testnet'}</span>
            </div>
            {/* Banner */}
            <div style={{border:'1px solid var(--b1)',marginBottom:28,overflow:'hidden'}}>
              <div className='v-block-head'>Store Banner</div>
              <div style={{padding:20}}>
                <input ref={bannerRef} type='file' accept='image/*' onChange={handleBanner} style={{display:'none'}}/>
                {bannerPreview
                  ? <div style={{position:'relative'}}><img src={bannerPreview} alt='banner' style={{width:'100%',height:160,objectFit:'cover',display:'block',filter:'brightness(0.7)'}}/><button onClick={()=>bannerRef.current?.click()} style={{position:'absolute',bottom:12,right:12,fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:300,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--w35)',border:'1px solid var(--b2)',padding:'6px 12px',background:'rgba(12,14,26,0.85)',cursor:'pointer'}}>Change</button></div>
                  : <div onClick={()=>bannerRef.current?.click()} className='v-upload-zone' style={{height:140}}><div style={{fontSize:'2rem'}}>{'🖼️'}</div><div className='v-upload-label'>Click to upload banner</div><div style={{fontSize:9,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.10em'}}>Recommended: 1200×400px</div></div>}
              </div>
            </div>
            {/* Identity */}
            <div style={{border:'1px solid var(--b1)',marginBottom:28}}>
              <div className='v-block-head'>Store Identity</div>
              <div style={{padding:20}}>
                <div className='v-field'><label className='v-label'>Store name *</label><input className='v-input' type='text' placeholder='e.g. Nour Atelier' value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
                <div className='v-field'><label className='v-label'>Tagline</label><input className='v-input' type='text' placeholder='One line about what you sell' value={form.tagline} onChange={e=>setForm({...form,tagline:e.target.value})}/></div>
                <div className='v-field'><label className='v-label'>Description</label><textarea className='v-textarea' placeholder='Tell buyers what makes your store special...' value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
                <div className='v-field' style={{marginBottom:0}}><label className='v-label'>X (Twitter) handle</label><input className='v-input' type='text' placeholder='@yourhandle' value={form.xHandle} onChange={e=>setForm({...form,xHandle:e.target.value})}/></div>
              </div>
            </div>
            {/* Category */}
            <div style={{border:'1px solid var(--b1)',marginBottom:28}}>
              <div className='v-block-head'>Category</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'var(--b1)'}}>
                {CATS.map(c=><div key={c.name} onClick={()=>setCat(c.name)} style={{padding:'16px 8px',textAlign:'center',cursor:'pointer',background:cat===c.name?'rgba(212,176,90,0.12)':'var(--bg2)',borderBottom:cat===c.name?'1px solid var(--a)':'1px solid transparent',transition:'all 0.2s'}}><div style={{fontSize:'1.2rem',marginBottom:6}}>{c.icon}</div><div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.12em',textTransform:'uppercase',color:cat===c.name?'var(--a)':'var(--w18)'}}>{c.name}</div></div>)}
              </div>
            </div>
            {/* Wallet */}
            <div style={{border:'1px solid var(--b1)',marginBottom:28}}>
              <div className='v-block-head'>Payment Wallet · ERC-8004 Identity</div>
              <div style={{padding:'16px 20px'}}>
                <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--w18)',marginBottom:6}}>Receives USDC payments from buyers</div>
                <div style={{fontFamily:"'Cormorant',serif",fontSize:16,fontWeight:300,color:'var(--a2)'}}>{address?address.slice(0,6)+'...'+address.slice(-4)+' · Arc Testnet':'Connect your wallet'}</div>
              </div>
            </div>
            {error&&<div style={{border:'1px solid rgba(232,112,112,0.3)',background:'rgba(232,112,112,0.08)',padding:'12px 16px',fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--err)',marginBottom:20}}>{error}</div>}
            <button onClick={handleCreate} disabled={loading} className='btn-primary' style={{width:'100%',padding:'18px',fontSize:12}}>{'Deploy Store on Arc · $'}{FEE}{' USDC →'}</button>
            <div style={{textAlign:'center',marginTop:16}}><Link href='/profile' style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.10em',textDecoration:'none'}}>← Back to Profile</Link></div>
          </>
        )}
      </div>
    </main>
  );
}