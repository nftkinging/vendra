'use client';
import Nav from '../Nav';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getStores } from '../lib/supabase';

const CATS = ['All','Fashion','Digital','Art','Services','Food','Tech','Music','Other'];

const SAMPLE = [
  { id:'s1', slug:'nour-atelier', name:'Nour Atelier', tagline:'Handcrafted jewellery from the Middle East', category:'Fashion', productCount:4, bg:'linear-gradient(145deg,#1e1608,#3d2e14)', banner_url:'' },
  { id:'s2', slug:'bytedrop', name:'ByteDrop', tagline:'Premium UI kits and Figma assets', category:'Digital', productCount:3, bg:'linear-gradient(145deg,#060d18,#142035)', banner_url:'' },
  { id:'s3', slug:'solar-prints', name:'Solar Prints', tagline:'Limited edition art prints worldwide', category:'Art', productCount:2, bg:'linear-gradient(145deg,#100810,#261630)', banner_url:'' },
  { id:'s4', slug:'kode-studio', name:'Kode Studio', tagline:'Custom dev work and automation', category:'Services', productCount:2, bg:'linear-gradient(145deg,#0a1208,#162418)', banner_url:'' },
  { id:'s5', slug:'umami-box', name:'Umami Box', tagline:'Artisan Japanese food kits', category:'Food', productCount:2, bg:'linear-gradient(145deg,#180d06,#2e1a0c)', banner_url:'' },
  { id:'s6', slug:'soundvault', name:'SoundVault', tagline:'Exclusive beats and sample packs', category:'Music', productCount:3, bg:'linear-gradient(145deg,#050d18,#0d1a2e)', banner_url:'' },
];

export default function Marketplace() {
  const [dbStores, setDbStores] = useState<any[]>([]);
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStores().then(db => {
      setDbStores(db || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Merge: DB stores override samples with same slug
  const allStores = [
    ...SAMPLE.filter(s => !dbStores.find(d => d.slug === s.slug)),
    ...dbStores.map(s => ({
      ...s,
      productCount: s.products?.length || 0,
      bg: 'linear-gradient(145deg,var(--bg2),var(--bg3))',
    })),
  ];

  const filtered = allStores.filter(s =>
    (cat === 'All' || s.category === cat) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) ||
     (s.tagline||'').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Nav />
      <div style={{ paddingTop:72 }}>
        {/* Header */}
        <div style={{ background:'var(--bg2)', borderBottom:'1px solid var(--b1)', padding:'64px 56px 48px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>
            <div className='v-eyebrow' style={{ marginBottom:16 }}><div className='v-eyebrow-rule'/><span className='v-eyebrow-label'>Arc Testnet · Live Stores</span></div>
            <h1 style={{ fontFamily:"'Cormorant',serif", fontSize:'clamp(40px,6vw,72px)', fontWeight:300, letterSpacing:'-0.01em', lineHeight:0.94, color:'var(--w)', marginBottom:32 }}>
              The <em style={{ fontStyle:'italic', background:'linear-gradient(120deg,var(--a),var(--a2))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Marketplace</em>
            </h1>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Search stores and products...'
              style={{ width:'100%', maxWidth:480, background:'transparent', border:'none', borderBottom:'1px solid var(--b2)', padding:'10px 0', color:'var(--w85)', fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:300, fontStyle:'italic', outline:'none', letterSpacing:'0.04em' }}
            />
          </div>
        </div>
        {/* Category Tabs */}
        <div style={{ borderBottom:'1px solid var(--b1)', background:'var(--bg)', overflowX:'auto' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 56px', display:'flex' }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:300, fontStyle:'italic', letterSpacing:'0.16em', textTransform:'uppercase', padding:'16px 24px', background:'transparent', border:'none', borderBottom: cat===c ? '1px solid var(--a)' : '1px solid transparent', color: cat===c ? 'var(--a)' : 'var(--w18)', cursor:'pointer', transition:'all 0.3s', whiteSpace:'nowrap' }}>{c}</button>))}
          </div>
        </div>
        {/* Store Grid */}
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'48px 56px 80px' }}>
          {loading ? (
            <div style={{ textAlign:'center', padding:'4rem' }}><div className='v-spinner' style={{ margin:'0 auto' }}/></div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'4rem', border:'1px solid var(--b1)' }}>
              <div style={{ fontFamily:"'Cormorant',serif", fontSize:28, fontWeight:300, color:'var(--w)', marginBottom:8 }}>No stores found</div>
              <div style={{ fontSize:12, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.10em' }}>Try a different search or category</div>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:'var(--b1)' }}>
              {filtered.map(s => (
                <Link key={s.id||s.slug} href={'/store/'+s.slug} style={{ textDecoration:'none' }}>
                  <div className='v-store-card'>
                    <div className='v-store-banner' style={{ background: s.banner_url ? 'none' : s.bg, position:'relative' }}>
                      {s.banner_url && <img src={s.banner_url} alt={s.name} style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.6)' }}/>}
                      {!s.banner_url && (
                        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Cormorant',serif", fontSize:56, fontWeight:300, fontStyle:'italic', color:'rgba(212,176,90,0.15)' }}>{s.name?.slice(0,1)}</div>
                      )}
                    </div>
                    <div className='v-store-body'>
                      <div className='v-store-name'>{s.name}</div>
                      <div className='v-store-desc'>{s.tagline}</div>
                      <div className='v-store-meta'>
                        <span className='v-store-cat'>{s.category}</span>
                        <span className='v-store-count'>{s.productCount || s.products?.length || 0} products</span>
                      </div>
                    </div>
                  </div>
                </Link>))}
            </div>)}
        </div>
      </div>
      <footer className='v-footer'>
        <div style={{ opacity:0.5, fontFamily:"'Cormorant',serif", fontSize:15, fontWeight:300, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--w85)' }}>Vendra</div>
        <div className='v-footer-copy'>Arc Testnet · 0% Fees · USDC Native · ERC-8183 Escrow</div>
        <div className='v-footer-links'><Link href='/store/create'>Open a Store</Link><a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer'>Faucet</a></div>
      </footer>
    </main>
  );
}