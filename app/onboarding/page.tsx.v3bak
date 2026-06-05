'use client';
import Nav from '../Nav';
import { useState, useRef, Suspense } from 'react';
import { useAccount } from 'wagmi';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveProfile, uploadAvatar } from '../lib/supabase';
import Link from 'next/link';

function OnboardingContent() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const params = useSearchParams();
  const avatarRef = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState<'buyer'|'seller'>(params.get('role')==='seller'?'seller':'buyer');
  const [step, setStep] = useState<'role'|'profile'|'done'>('role');
  const [form, setForm] = useState({ display_name:'', bio:'', x_handle:'' });
  const [avatarFile, setAvatarFile] = useState<File|null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!address||!isConnected) { setError('Please connect your wallet'); return; }
    if (!form.display_name) { setError('Display name is required'); return; }
    setLoading(true); setError('');
    try {
      let avatar_url = '';
      if (avatarFile) avatar_url = await uploadAvatar(address, avatarFile);
      await saveProfile({ wallet_address:address, role, display_name:form.display_name, bio:form.bio, avatar_url, x_handle:form.x_handle });
      setStep('done');
    } catch(e:any) { setError(e?.message||'Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <main style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Nav />
      <div style={{maxWidth:560,margin:'0 auto',padding:'120px 56px 80px'}}>
        {step==='role'&&(
          <>
            <div className='v-eyebrow' style={{marginBottom:16}}><div className='v-eyebrow-rule'/><span className='v-eyebrow-label'>Welcome to Vendra</span></div>
            <h1 style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(36px,5vw,62px)',fontWeight:300,letterSpacing:'-0.01em',lineHeight:0.94,color:'var(--w)',marginBottom:12}}>How will you<br/><em style={{fontStyle:'italic',background:'linear-gradient(120deg,var(--a),var(--a2))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>use Vendra?</em></h1>
            <p style={{fontSize:13,fontWeight:300,fontStyle:'italic',color:'var(--w35)',marginBottom:40,lineHeight:1.7}}>You can always add both roles later from your profile.</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1px',background:'var(--b1)',marginBottom:32}}>
              <div onClick={()=>setRole('buyer')} style={{background:role==='buyer'?'rgba(212,176,90,0.08)':'var(--bg2)',padding:'32px 24px',cursor:'pointer',borderBottom:role==='buyer'?'1px solid var(--a)':'1px solid transparent',transition:'all 0.2s'}}>
                <div style={{fontSize:'2rem',marginBottom:12}}>{'🛍️'}</div>
                <div style={{fontFamily:"'Cormorant',serif",fontSize:22,fontWeight:300,color:role==='buyer'?'var(--a2)':'var(--w)',marginBottom:8}}>I want to buy</div>
                <div style={{fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.7}}>Browse stores, discover products, pay instantly in USDC on Arc.</div>
              </div>
              <div onClick={()=>setRole('seller')} style={{background:role==='seller'?'rgba(212,176,90,0.08)':'var(--bg2)',padding:'32px 24px',cursor:'pointer',borderBottom:role==='seller'?'1px solid var(--a)':'1px solid transparent',transition:'all 0.2s'}}>
                <div style={{fontSize:'2rem',marginBottom:12}}>{'🏪'}</div>
                <div style={{fontFamily:"'Cormorant',serif",fontSize:22,fontWeight:300,color:role==='seller'?'var(--a2)':'var(--w)',marginBottom:8}}>I want to sell</div>
                <div style={{fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.7}}>Launch a store, list products, get paid directly in USDC. Zero fees.</div>
              </div>
            </div>
            <button onClick={()=>setStep('profile')} className='btn-primary' style={{width:'100%',padding:'18px',fontSize:12}}>{'Continue as '}{role==='buyer'?'Buyer':'Seller'}{' →'}</button>
          </>
        )}
        {step==='profile'&&(
          <>
            <div className='v-eyebrow' style={{marginBottom:16}}><div className='v-eyebrow-rule'/><span className='v-eyebrow-label'>{role==='seller'?'Seller':'Buyer'}{' Profile'}</span></div>
            <h1 style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(36px,5vw,62px)',fontWeight:300,letterSpacing:'-0.01em',lineHeight:0.94,color:'var(--w)',marginBottom:32}}>Set up your<br/><em style={{fontStyle:'italic',background:'linear-gradient(120deg,var(--a),var(--a2))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>profile</em></h1>
            <div style={{marginBottom:28,display:'flex',alignItems:'center',gap:20}}>
              <div onClick={()=>avatarRef.current?.click()} style={{width:72,height:72,borderRadius:'50%',border:'1px dashed var(--b2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',overflow:'hidden',transition:'border-color 0.35s',background:'var(--bg2)',flexShrink:0}} onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--a)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--b2)')}>
                {avatarPreview?<img src={avatarPreview} alt='avatar' style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{textAlign:'center'}}><div style={{fontSize:'1.5rem'}}>{'📷'}</div><div style={{fontSize:8,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.10em',marginTop:4}}>Photo</div></div>}
              </div>
              <input ref={avatarRef} type='file' accept='image/*' onChange={handleAvatar} style={{display:'none'}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.10em',marginBottom:4}}>Profile photo</div>
                <div style={{fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.6}}>Click the circle to upload. Optional but recommended.</div>
              </div>
            </div>
            <div style={{border:'1px solid var(--b1)',marginBottom:24}}>
              <div className='v-block-head'>Profile Info</div>
              <div style={{padding:20}}>
                <div className='v-field'><label className='v-label'>Display name *</label><input className='v-input' placeholder='Your name or handle' value={form.display_name} onChange={e=>setForm({...form,display_name:e.target.value})}/></div>
                <div className='v-field'><label className='v-label'>Bio</label><textarea className='v-textarea' placeholder='Tell the Vendra community about yourself...' value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}/></div>
                <div className='v-field' style={{marginBottom:0}}><label className='v-label'>X (Twitter) handle</label><input className='v-input' placeholder='@yourhandle' value={form.x_handle} onChange={e=>setForm({...form,x_handle:e.target.value})}/></div>
              </div>
            </div>
            <div style={{border:'1px solid var(--b1)',padding:'14px 18px',marginBottom:24,display:'flex',alignItems:'center',gap:10}}>
              <div className='v-arc-badge-dot'/>
              <div style={{fontSize:11,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.7}}>Your profile is linked to your wallet via ERC-8004 onchain identity.</div>
            </div>
            {error&&<div style={{border:'1px solid rgba(232,112,112,0.3)',background:'rgba(232,112,112,0.08)',padding:'10px 16px',fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--err)',marginBottom:16}}>{error}</div>}
            <button onClick={handleSave} disabled={loading} className='btn-primary' style={{width:'100%',padding:'18px',fontSize:12}}>{loading?'Saving...':'Create Profile →'}</button>
            <div style={{textAlign:'center',marginTop:12}}><button onClick={()=>setStep('role')} style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.10em',background:'transparent',border:'none',cursor:'pointer'}}>← Back</button></div>
          </>
        )}
        {step==='done'&&(
          <div style={{textAlign:'center'}}>
            <div style={{fontFamily:"'Cormorant',serif",fontSize:'5rem',fontWeight:300,color:'var(--a2)',lineHeight:1,marginBottom:16}}>✓</div>
            <div style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:300,color:'var(--w)',marginBottom:12}}>Profile Created</div>
            <div style={{fontSize:13,fontWeight:300,fontStyle:'italic',color:'var(--w35)',marginBottom:40,lineHeight:1.7}}>Welcome to Vendra, {form.display_name}.</div>
            <div style={{display:'flex',flexDirection:'column',gap:12,maxWidth:260,margin:'0 auto'}}>
              {role==='seller'?(<><Link href='/store/create'><button className='btn-primary' style={{width:'100%',padding:'14px',fontSize:10}}>Create My Store →</button></Link><Link href='/marketplace'><button className='btn-ghost' style={{width:'100%',padding:'14px',fontSize:10}}>Explore First</button></Link></>):(<><Link href='/marketplace'><button className='btn-primary' style={{width:'100%',padding:'14px',fontSize:10}}>Browse Marketplace →</button></Link><Link href='/profile'><button className='btn-ghost' style={{width:'100%',padding:'14px',fontSize:10}}>View Profile</button></Link></>)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Onboarding() {
  return <Suspense><OnboardingContent /></Suspense>;
}