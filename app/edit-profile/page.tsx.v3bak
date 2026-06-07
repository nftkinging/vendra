'use client';
import Nav from '../Nav';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useAccount } from 'wagmi';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProfile, saveProfile, uploadAvatar } from '../lib/supabase';
import Link from 'next/link';

function EditProfileContent() {
  const { address } = useAccount();
  const router = useRouter();
  const params = useSearchParams();
  const role = (params.get('role')||'buyer') as 'buyer'|'seller';
  const avatarRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ display_name:'', bio:'', x_handle:'' });
  const [avatarFile, setAvatarFile] = useState<File|null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!address) return;
    getProfile(address, role).then(p => {
      if (p) { setForm({ display_name:p.display_name||'', bio:p.bio||'', x_handle:p.x_handle||'' }); setAvatarPreview(p.avatar_url||''); }
      setLoading(false);
    });
  }, [address, role]);

  const handleSave = async () => {
    if (!address) return;
    if (!form.display_name) { setError('Display name required'); return; }
    setSaving(true); setError(''); setSuccess('');
    try {
      let avatar_url = avatarPreview;
      if (avatarFile) avatar_url = await uploadAvatar(address, avatarFile);
      await saveProfile({ wallet_address:address, role, display_name:form.display_name, bio:form.bio, avatar_url, x_handle:form.x_handle });
      setSuccess('Profile updated!'); setTimeout(()=>setSuccess(''),2500);
    } catch(e:any) { setError(e?.message||'Something went wrong'); }
    finally { setSaving(false); }
  };

  if (loading) return <main style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center'}}><Nav /><div className='v-spinner'/></main>;

  return (
    <main style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Nav />
      <div style={{maxWidth:560,margin:'0 auto',padding:'120px 56px 80px'}}>
        <div className='v-eyebrow' style={{marginBottom:16}}><div className='v-eyebrow-rule'/><span className='v-eyebrow-label'>Edit {role==='seller'?'Seller':'Buyer'} Profile</span></div>
        <h1 style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:300,letterSpacing:'-0.01em',lineHeight:0.94,color:'var(--w)',marginBottom:32}}>Update your<br/><em style={{fontStyle:'italic',background:'linear-gradient(120deg,var(--a),var(--a2))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>profile</em></h1>
        <div style={{marginBottom:28,display:'flex',alignItems:'center',gap:20}}>
          <div onClick={()=>avatarRef.current?.click()} style={{width:72,height:72,borderRadius:'50%',border:'1px dashed var(--b2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',overflow:'hidden',transition:'border-color 0.35s',background:'var(--bg2)',flexShrink:0}} onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--a)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--b2)')}>
            {avatarPreview?<img src={avatarPreview} alt='avatar' style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{textAlign:'center'}}><div style={{fontSize:'1.5rem'}}>{'📷'}</div><div style={{fontSize:8,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.10em',marginTop:4}}>Change</div></div>}
          </div>
          <input ref={avatarRef} type='file' accept='image/*' onChange={e=>{const f=e.target.files?.[0];if(!f)return;setAvatarFile(f);setAvatarPreview(URL.createObjectURL(f));}} style={{display:'none'}}/>
          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.6}}>Click to change your profile photo.</div></div>
        </div>
        <div style={{border:'1px solid var(--b1)',marginBottom:24}}>
          <div className='v-block-head'>Profile Info</div>
          <div style={{padding:20}}>
            <div className='v-field'><label className='v-label'>Display name *</label><input className='v-input' value={form.display_name} onChange={e=>setForm({...form,display_name:e.target.value})}/></div>
            <div className='v-field'><label className='v-label'>Bio</label><textarea className='v-textarea' value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}/></div>
            <div className='v-field' style={{marginBottom:0}}><label className='v-label'>X (Twitter) handle</label><input className='v-input' placeholder='@yourhandle' value={form.x_handle} onChange={e=>setForm({...form,x_handle:e.target.value})}/></div>
          </div>
        </div>
        {error&&<div style={{border:'1px solid rgba(232,112,112,0.3)',background:'rgba(232,112,112,0.08)',padding:'10px 16px',fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--err)',marginBottom:16}}>{error}</div>}
        {success&&<div style={{border:'1px solid rgba(143,196,152,0.3)',background:'rgba(143,196,152,0.08)',padding:'10px 16px',fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--gr)',marginBottom:16}}>{success}</div>}
        <button onClick={handleSave} disabled={saving} className='btn-primary' style={{width:'100%',padding:'18px',fontSize:12}}>{saving?'Saving...':'Save Changes →'}</button>
        <div style={{textAlign:'center',marginTop:16}}><Link href='/profile' style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.10em',textDecoration:'none'}}>← Back to Profile</Link></div>
      </div>
    </main>
  );
}

export default function EditProfile() {
  return <Suspense><EditProfileContent /></Suspense>;
}