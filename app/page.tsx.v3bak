'use client';
import Nav from './Nav';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getAllProfiles, getStoreByWallet } from './lib/supabase';

const TICKS = ['Arc Testnet|0% Platform Fees','USDC Native|Sub-Second Settlement','ERC-8183|Escrow Protection','ERC-8004|Onchain Identity','Commerce Unchained|No Middlemen','Global Reach|Borderless Payments'];
const STRIP = [
  { slug:'nour-atelier', cat:'Fashion', name:'Nour Atelier', price:'From $38 USDC', bg:'linear-gradient(145deg,#1a1508,#3d2e14,#1a1508)' },
  { slug:'bytedrop', cat:'Digital', name:'ByteDrop', price:'From $19 USDC', bg:'linear-gradient(145deg,#080f1a,#142035,#080f1a)' },
  { slug:'solar-prints', cat:'Art', name:'Solar Prints', price:'From $40 USDC', bg:'linear-gradient(145deg,#0f0810,#261630,#0f0810)' },
  { slug:'soundvault', cat:'Music', name:'SoundVault', price:'From $20 USDC', bg:'linear-gradient(145deg,#050d08,#122018,#050d08)' },
];
const FEATURED = [
  { slug:'nour-atelier', name:'Gold Crescent Ring', seller:'Nour Atelier', price:45, cat:'Fashion', glow:'a', bg:'linear-gradient(145deg,#1e1608,#3d2e14)' },
  { slug:'bytedrop', name:'Dashboard UI Kit', seller:'ByteDrop', price:49, cat:'Digital', glow:'s', bg:'linear-gradient(145deg,#060d18,#142035)' },
  { slug:'solar-prints', name:'Desert Bloom Print', seller:'Solar Prints', price:55, cat:'Art', glow:'a', bg:'linear-gradient(145deg,#100810,#261630)' },
  { slug:'soundvault', name:'Lo-Fi Essentials', seller:'SoundVault', price:25, cat:'Music', glow:'s', bg:'linear-gradient(145deg,#040c08,#122018)' },
];
const SELLERS = [
  { rank:'I', init:'N', name:'Nour Atelier', meta:'Fashion · 12 products · 48 sales', score:'9.8' },
  { rank:'II', init:'B', name:'ByteDrop', meta:'Digital · 8 products · 31 sales', score:'9.6' },
  { rank:'III', init:'S', name:'Solar Prints', meta:'Art · 24 products · 27 sales', score:'9.4' },
  { rank:'IV', init:'K', name:'Kode Studio', meta:'Services · 6 products · 19 sales', score:'9.2' },
  { rank:'V', init:'U', name:'Umami Box', meta:'Food · 4 products · 14 sales', score:'9.0' },
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGetStarted = async () => {
    // Check Circle wallet session
    try {
      const saved = sessionStorage.getItem('vendra_circle_wallet');
      if (saved) { router.push('/onboarding'); return; }
    } catch {}
    if (!isConnected) { router.push('/join'); return; }
    setLoading(true);
    try {
      const [profiles, store] = await Promise.all([getAllProfiles(address!), getStoreByWallet(address!)]);
      const hasSeller = profiles.some((p:any) => p.role==='seller');
      const hasBuyer = profiles.some((p:any) => p.role==='buyer');
      if (hasSeller && hasBuyer) router.push('/welcome');
      else if (hasSeller || hasBuyer) router.push('/profile');
      else router.push('/onboarding');
    } catch { router.push('/onboarding'); }
    finally { setLoading(false); }
  };

  const Footer = () => (
    <footer className='v-footer'>
      <div style={{ opacity:0.5, display:'flex', alignItems:'center', gap:10 }}>
        <div className='v-logo-emblem' style={{ width:24, height:24 }}><span className='v-logo-v' style={{ fontSize:11 }}>V</span></div>
        <span style={{ fontFamily:"'Cormorant',serif", fontSize:15, fontWeight:300, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--w85)' }}>Vendra</span>
      </div>
      <div className='v-footer-copy'>© 2026 Vendra · Built on Arc Testnet · Powered by USDC · 0% Fees</div>
      <div className='v-footer-links'><Link href='/marketplace'>Marketplace</Link><Link href='/store/create'>Sellers</Link><a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer'>Faucet</a></div>
    </footer>
  );

  return (
    <main style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Nav />

      {/* HERO */}
      <section className='v-hero'>
        <div className='v-atm'>
          <div className='v-orb-a'/><div className='v-orb-sl-l'/><div className='v-orb-sl-r'/>
          <div className='v-grid-overlay'/><div className='v-hairline'/>
        </div>
        <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:1000 }}>
          <div className='v-arc-badge' style={{ marginBottom:40 }}>
            <div className='v-arc-badge-dot'/>
            <span className='v-arc-badge-text'>Live on Arc Testnet · Powered by USDC</span>
          </div>
          <div className='v-hero-eyebrow'>
            <div className='v-eyebrow-line'/>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:300, fontStyle:'italic', letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--a)' }}>Commerce Unchained</span>
            <div className='v-eyebrow-line'/>
          </div>
          <h1 className='v-hero-h1'>
            <span className='v-h1-line1'>The marketplace</span>
            <span className='v-h1-line2'>everyone deserves</span>
            <span className='v-h1-line3'>Commerce Unchained</span>
          </h1>
          <p className='v-hero-sub'>Launch your store in minutes. Sell anything. Get paid instantly in USDC — with 0% platform fees and fraud protection baked into the protocol.</p>
          <div className='v-hero-actions'>
            <button className='btn-primary' onClick={handleGetStarted} disabled={loading}>{loading?'Loading...':isConnected?'Open Your Store':'Get Started'}</button>
            <Link href='/marketplace'><button className='btn-ghost'>Explore Marketplace</button></Link>
          </div>
          <div className='v-stats-bar'>
            <div className='v-stat'><div className='v-stat-val amber'>0%</div><div className='v-stat-label'>Platform Fees</div></div>
            <div className='v-stat'><div className='v-stat-val'>&lt;2s</div><div className='v-stat-label'>Settlement</div></div>
            <div className='v-stat'><div className='v-stat-val'>USDC</div><div className='v-stat-label'>Native Currency</div></div>
            <div className='v-stat'><div className='v-stat-val amber'>∞</div><div className='v-stat-label'>Global Reach</div></div>
          </div>
          <div className='v-showcase-card'>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
              <div><div className='v-sc-label'>Store Balance</div><div className='v-sc-bal'>$2,847.50</div><div className='v-sc-network'>USDC · Arc Testnet · 0x3a9f...6ef4</div></div>
              <div className='v-sc-badge'>Settled</div>
            </div>
            <div className='v-sc-divider'/>
            <div className='v-sc-label' style={{ marginBottom:12 }}>Recent Transactions</div>
            {[{icon:'💍',dot:'a',name:'Gold Crescent Ring — Nour Atelier',sub:'Apr 12 · 0x4a7f...8f1a · Settled in 1.2s',amt:'+$45.00'},{icon:'🎵',dot:'s',name:'Lo-Fi Essentials — SoundVault',sub:'Apr 12 · 0x9f2a...cc33 · Settled in 0.9s',amt:'+$25.00'},{icon:'🎨',dot:'a',name:'Desert Bloom Print — Solar Prints',sub:'Apr 11 · 0x7c3f...2e91 · Settled in 1.4s',amt:'+$55.00'}].map(tx=>(
              <div key={tx.name} className='v-sc-row'>
                <div className='v-sc-row-l'><div className={'v-sc-dot v-sc-dot-'+tx.dot}>{tx.icon}</div><div><div className='v-sc-tx-name'>{tx.name}</div><div className='v-sc-tx-sub'>{tx.sub}</div></div></div>
                <div className='v-sc-amount'>{tx.amt}</div>
              </div>))}
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className='v-ticker-wrap'>
        <div className='v-ticker-track'>
          {[...TICKS,...TICKS].map((t,i)=>{ const [a,b]=t.split('|'); return <div key={i} className='v-ticker-item'><span>{a}</span><div className='v-ticker-dot'/>{b}<div className='v-ticker-dot'/></div>; })}
        </div>
      </div>

      {/* IMAGE STRIP */}
      <div className='v-strip-section'>
        <div className='v-strip-ghost'><span className='v-strip-ghost-text'>Vendra</span></div>
        <div className='v-strip-grid'>
          {STRIP.map(s=>(
            <Link key={s.slug} href={'/store/'+s.slug} style={{ display:'block' }}>
              <div className='v-strip-col'>
                <div className='v-strip-col-bg' style={{ background:s.bg }}/>
                <div className='v-strip-col-inner'>
                  <div className='v-strip-col-cat'>{s.cat}</div>
                  <div className='v-strip-col-name'>{s.name}</div>
                  <div className='v-strip-col-price'>{s.price}</div>
                </div>
              </div>
            </Link>))}
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div style={{ background:'var(--bg2)', padding:'1px 0' }}>
        <div className='v-section'>
          <div className='v-eyebrow'><div className='v-eyebrow-rule'/><span className='v-eyebrow-label'>Live Listings</span></div>
          <div className='v-section-head'>
            <h2 className='v-section-title'>Featured <em>products</em></h2>
            <Link href='/marketplace' className='v-view-all'>View all <span>→</span></Link>
          </div>
          <div className='v-product-grid'>
            {FEATURED.map(p=>(
              <Link key={p.slug+p.name} href={'/store/'+p.slug} style={{ textDecoration:'none' }}>
                <div className='v-pcard'>
                  <div className='v-pcard-img'>
                    <div className='v-pcard-img-fill' style={{ background:p.bg }}/>
                    <div className='v-pcard-overlay'/>
                    <div className={'v-pcard-hover-glow v-phg-'+p.glow}/>
                    <div className='v-pcard-cat'>{p.cat}</div>
                    {p.glow==='a'&&<div className='v-pcard-verified'>Verified</div>}
                  </div>
                  <div className='v-pcard-body'>
                    <div className='v-pcard-name'>{p.name}</div>
                    <div className='v-pcard-seller'>{p.seller} · Arc Testnet</div>
                    <div className='v-pcard-foot'>
                      <div className='v-pcard-price'>{'$'}{p.price}{' USDC'}</div>
                      <button className='v-pcard-buy'>Buy Now</button>
                    </div>
                  </div>
                </div>
              </Link>))}
          </div>
        </div>
      </div>

      {/* WHY VENDRA BENTO */}
      <div style={{ background:'var(--bg)' }}>
        <div className='v-section'>
          <div className='v-eyebrow'><div className='v-eyebrow-rule'/><span className='v-eyebrow-label'>Why Vendra</span></div>
          <div className='v-section-head'><h2 className='v-section-title'>Built differently.<br/><em>By design.</em></h2></div>
          <div className='v-bento-grid'>
            <div className='v-bcard'><div className='v-bcard-num'>01 — Settlement</div><div className='v-bcard-title'>Paid in under two seconds</div><div className='v-bcard-body'>Arc's Malachite consensus engine makes every transaction final in under two seconds. Sellers get paid the moment buyers confirm.</div><div className='v-bcard-stat'>&lt;2s</div><div className='v-bcard-stat-label'>Settlement Time · Arc Testnet</div></div>
            <div className='v-bcard'><div className='v-bcard-num'>02 — Fees</div><div className='v-bcard-title'>Zero percent. Zero exceptions.</div><div className='v-bcard-body'>Traditional platforms take 6–20% of every sale. Vendra takes nothing. Arc's low gas costs make this viable for the first time at scale.</div><div className='v-bcard-stat'>0%</div><div className='v-bcard-stat-label'>Platform Fee · Forever</div></div>
            <div className='v-bcard v-bcard-wide'>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
                <div><div className='v-bcard-num'>03 — Comparison</div><div className='v-bcard-title'>What you keep vs. what they take</div><div className='v-bcard-body'>Every platform takes a cut. eBay, Etsy, Poshmark — all charging sellers with no real alternative. Until now.</div></div>
                <div className='v-fee-bars'>
                  {[{label:'Vendra',w:'2%',cls:'amber',pct:'0%'},{label:'Facebook',w:'25%',cls:'slate',pct:'5%'},{label:'Etsy',w:'39%',cls:'slate',pct:'6.5%'},{label:'eBay',w:'65%',cls:'dim',pct:'12.9%'},{label:'Poshmark',w:'100%',cls:'dim',pct:'20%'}].map(f=>(
                    <div key={f.label} className='v-fee-row'>
                      <div className='v-fee-label' style={f.cls==='amber'?{color:'var(--a)',fontWeight:500}:{}}>{f.label}</div>
                      <div className='v-fee-bar-wrap'><div className={'v-fee-bar-fill '+f.cls} style={{width:f.w}}/></div>
                      <div className={'v-fee-pct'+(f.cls==='amber'?' amber':'')}>{f.pct}</div>
                    </div>))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FRAUD / ARC INTEGRATIONS */}
      <div className='v-editorial'>
        <div className='v-editorial-bg'/><div className='v-editorial-vignette'/><div className='v-editorial-orb'/>
        <div className='v-editorial-inner'>
          <div>
            <div className='v-arc-pill'><div className='v-arc-badge-dot' style={{width:4,height:4}}/>Protocol-Level Protection</div>
            <h2 style={{ fontFamily:"'Cormorant',serif", fontSize:'clamp(36px,5vw,62px)', fontWeight:300, lineHeight:0.94, letterSpacing:'-0.01em', color:'var(--w)', marginBottom:24 }}>
              Fraud doesn't<br/><em style={{ fontStyle:'italic', background:'linear-gradient(120deg,var(--a),var(--a2))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>stand a chance</em>
            </h2>
            <p style={{ fontSize:14, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.8, marginBottom:16, maxWidth:400 }}>Every payment on Vendra is held in an ERC-8183 smart contract escrow until the buyer confirms delivery. No fake listings. No payment reversals. The blockchain is the guarantor.</p>
            <p style={{ fontSize:14, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.8, marginBottom:36, maxWidth:400 }}>Onchain identity via ERC-8004 gives every seller a permanent, unfakeable reputation score built from their entire transaction history.</p>
            <Link href='/store/create'><button className='btn-amber-ghost'>Launch Your Store →</button></Link>
          </div>
          <div className='v-ed-stat-card'>
            <div className='v-ed-kpi'><div className='v-ed-kpi-val'>$0</div><div className='v-ed-kpi-label'>Fraud losses on Vendra</div></div>
            <div className='v-ed-kpi'><div className='v-ed-kpi-val' style={{color:'var(--sl2)',fontSize:36}}>ERC-8183</div><div className='v-ed-kpi-label'>Escrow Smart Contracts</div></div>
            <div className='v-ed-divider'/>
            <div className='v-ed-kpi' style={{marginBottom:0}}><div className='v-ed-kpi-val' style={{fontSize:36}}>ERC-8004</div><div className='v-ed-kpi-label'>Onchain Identity & Reputation</div></div>
          </div>
        </div>
      </div>

      {/* TOP SELLERS */}
      <div style={{ background:'var(--bg2)', padding:'1px 0' }}>
        <div className='v-section'>
          <div className='v-eyebrow'><div className='v-eyebrow-rule'/><span className='v-eyebrow-label'>Top Sellers</span></div>
          <div className='v-section-head'><h2 className='v-section-title'>The stores<br/><em>setting the standard</em></h2></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64 }}>
            <div>
              <p style={{ fontSize:14, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.8, maxWidth:380, marginBottom:32 }}>Every seller on Vendra owns their reputation onchain. It cannot be deleted, gamed, or transferred. What they build here, they keep forever.</p>
              <div className='v-promo-card'>
                <div className='v-promo-card-title'>Launch your store today</div>
                <div className='v-promo-card-body'>Deploy in under two minutes. $0.50 USDC deployment fee on Arc Testnet. Your storefront, your products, your wallet.</div>
                <Link href='/store/create'><button className='btn-amber-ghost'>Open Your Store →</button></Link>
              </div>
            </div>
            <div>
              {SELLERS.map(s=>(
                <div key={s.name} className='v-seller-item'>
                  <div className='v-seller-rank'>{s.rank}</div>
                  <div className='v-seller-avatar'>{s.init}</div>
                  <div style={{flex:1}}><div className='v-seller-name'>{s.name}</div><div className='v-seller-meta'>{s.meta}</div></div>
                  <div><div className='v-seller-score'>{s.score}</div><div className='v-seller-score-label'>Trust Score</div></div>
                </div>))}
            </div>
          </div>
        </div>
      </div>



      {/* CTA */}
      <div style={{ background:'var(--bg)', borderTop:'1px solid var(--b1)' }}>
        <div style={{ padding:'112px 56px', textAlign:'center', maxWidth:640, margin:'0 auto' }}>
          <div className='v-cta-rule'><div className='v-cta-rule-line'/><div className='v-cta-rule-text'>Commerce Unchained</div><div className='v-cta-rule-line'/></div>
          <h2 style={{ fontFamily:"'Cormorant',serif", fontSize:'clamp(40px,6vw,78px)', fontWeight:300, lineHeight:0.94, letterSpacing:'-0.01em', color:'var(--w)', marginBottom:20 }}>
            The future of commerce<br/><em style={{ display:'block', fontStyle:'italic', background:'linear-gradient(120deg,var(--a),var(--a2),var(--a3))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>is already here</em>
          </h2>
          <p style={{ fontSize:14, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.8, marginBottom:44 }}>Zero fees. Instant settlement. Fraud-proof escrow. Borderless payments. Everything legacy platforms promised and never delivered.</p>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16 }}>
            <button className='btn-primary' onClick={handleGetStarted}>{isConnected?'Launch My Store':'Get Started'}</button>
            <Link href='/marketplace'><button className='btn-ghost'>Explore Marketplace</button></Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}