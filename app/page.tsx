'use client';
import Nav from './Nav';
import Link from 'next/link';
import { useVendraWallet } from './lib/useVendraWallet';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { getStores } from './lib/supabase';

const PRODUCTS = [
  { n:'Air Jordan 1 "Chicago"', s:'kicksbyleo', c:'Sneakers', p:'182', v:true, g:'linear-gradient(150deg,#c0392b,#7d2018)', img:'/showcase/sneakers.jpg' },
  { n:'Contax T2 — titanium', s:'analog.archive', c:'Cameras', p:'560', v:true, g:'linear-gradient(150deg,#3d3d3d,#1a1a1a)', img:'/showcase/camera.jpg' },
  { n:'Seiko SKX007 diver', s:'wristgame', c:'Watches', p:'240', v:false, g:'linear-gradient(150deg,#1e3a5f,#0d1b2a)', img:'/showcase/watch.jpg' },
  { n:'Sony WH-1000XM5', s:'soundvault', c:'Audio', p:'198', v:true, g:'linear-gradient(150deg,#2c2c34,#16161a)', img:'/showcase/headphones.jpg' },
  { n:'Vintage Levi’s Type III', s:'denimdays', c:'Fashion', p:'95', v:false, g:'linear-gradient(150deg,#2e5a88,#1b3a5c)', img:'/showcase/jacket.jpg' },
  { n:'Handmade stoneware vase', s:'claystudio.co', c:'Home', p:'64', v:true, g:'linear-gradient(150deg,#a47148,#6b4423)', img:'/showcase/vase.jpg' },
  { n:'Eames-style lounge chair', s:'midmod.finds', c:'Home', p:'420', v:true, g:'linear-gradient(150deg,#5a4332,#2f231a)', img:'/showcase/chair.jpg' },
  { n:'Full-grain leather tote', s:'hideandgrain', c:'Fashion', p:'150', v:false, g:'linear-gradient(150deg,#8a5a2b,#4e3015)', img:'/showcase/tote.jpg' },
];
const CHIPS = ['All','Sneakers','Watches','Cameras','Fashion','Collectibles','Home'];
const TXNS = [
  { ic:'👟', t1:'Air Jordan 1 Retro', t2:'Sold · escrow released', amt:'+182.00' },
  { ic:'📷', t1:'Contax T2 film camera', t2:'Sold · escrow released', amt:'+560.00' },
  { ic:'⌚', t1:'Seiko SKX007', t2:'Sold · escrow released', amt:'+240.00' },
];

export default function Home() {
  const { isConnected } = useVendraWallet();
  const router = useRouter();
  const [activeChip, setActiveChip] = useState('All');
  const [featured, setFeatured] = useState<any[]>([]);
  const globeRef = useRef<HTMLCanvasElement>(null);

  const handleGetStarted = () => {
    // Delegate to the /welcome hub: it handles web3 + Circle, decides
    // join / onboarding / chooser, and rides out the wallet reconnect.
    if (isConnected) router.push('/welcome');
    else router.push('/join');
  };

  useEffect(() => {
    getStores().then((stores:any[]) => {
      const feat:any[] = [];
      for (const s of (stores || [])) {
        const pr = (s.products || [])[0];
        if (pr) feat.push({ key: s.slug + '-' + pr.id, href: '/store/' + s.slug + '/' + pr.id, cat: s.category || 'Other', v: true, image: pr.image_url || '', name: pr.name, seller: s.name, price: pr.price, g: 'linear-gradient(150deg,#2c2c34,#16161a)', buy: 'View' });
        if (feat.length >= 8) break;
      }
      setFeatured(feat);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.16 });
    document.querySelectorAll('.v4home [data-reveal], .v4home .stg').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [featured]);

  useEffect(() => {
    const cv = globeRef.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    const W = cv.width, H = cv.height, R = W * 0.40, cx = W / 2, cy = H / 2;
    const pts: { x:number; y:number; z:number }[] = []; const N = 900;
    for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2; const r = Math.sqrt(1 - y * y); const th = i * 2.399963; pts.push({ x: Math.cos(th) * r, y: y, z: Math.sin(th) * r }); }
    let a = 0; let raf = 0;
    const frame = () => {
      ctx.clearRect(0, 0, W, H); a += 0.0032; const ca = Math.cos(a), sa = Math.sin(a);
      for (const p of pts) {
        const x = p.x * ca - p.z * sa, z = p.x * sa + p.z * ca, y = p.y;
        const persp = 0.65 + 0.35 * ((z + 1) / 2); const sx = cx + x * R, sy = cy + y * R; const depth = (z + 1) / 2; const size = (0.6 + depth * 2.0) * persp;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + Math.round(226 - depth * 40) + ',' + Math.round(164 - depth * 20) + ',' + Math.round(28 + depth * 8) + ',' + (0.18 + depth * 0.72) + ')';
        ctx.arc(sx, sy, size, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    frame();
    return () => cancelAnimationFrame(raf);
  }, []);

  const cards = featured.length > 0
    ? featured
    : PRODUCTS.map((p) => ({ key: p.n, href: '/marketplace', cat: p.c, v: p.v, image: p.img, name: p.n, seller: '@' + p.s, price: p.p, g: p.g, buy: 'Buy now' }));

  return (
    <main className='v4home'>
      <Nav theme='v4' />

      <header className='hero'>
        <div className='hero-bg fallback'>
          <img src='/showcase/hero.jpg' alt='' onLoad={(e)=>e.currentTarget.parentElement?.classList.remove('fallback')} onError={(e)=>{e.currentTarget.style.display='none';}} />
        </div>
        <div className='hero-scrim' />
        <div className='hero-inner'>
          <p className='eyebrow hl d1'>Commerce, Unchained</p>
          <h1 className='hl d2'>Sell anything.<br/><span className='v4amber'>Keep all of it.</span></h1>
          <p className='hero-sub hl d3'>The peer-to-peer marketplace with <strong>0% platform fees</strong>, instant USDC payouts, and fraud protection written into the protocol — not the fine print.</p>
          <div className='hero-actions hl d4'>
            <button className='v4btn v4btn-amber' onClick={handleGetStarted}>Start selling <span className='arr'>→</span></button>
            <Link href='/marketplace' className='v4btn v4btn-ghost' style={{ color:'#fff', borderColor:'rgba(255,255,255,.32)' }}>Explore the market</Link>
          </div>
        </div>
        <div className='statbar hl d4'>
          <div className='stat'><div className='num'><em>0%</em></div><div className='lbl'>Platform fees</div></div>
          <div className='stat'><div className='num'>{'<'}2<em>s</em></div><div className='lbl'>USDC settlement</div></div>
          <div className='stat'><div className='num'>USDC</div><div className='lbl'>Native currency</div></div>
          <div className='stat'><div className='num'><em>∞</em></div><div className='lbl'>Global reach</div></div>
        </div>
      </header>

      <section className='beat'>
        <div className='wrap beat-grid'>
          <div data-reveal>
            <p className='eyebrow'>For sellers</p>
            <h2>List it.<span className='v4seq'> Sell it.</span><br/>Get paid <span className='v4seq'>instantly.</span></h2>
            <p className='lede'>No payout holds. No 20% commission. The moment a buyer confirms, USDC lands in your wallet — settled on Arc in under two seconds.</p>
            <div className='beat-points'>
              <div className='bp'><div className='idx'>01</div><div><h3>Snap and list in minutes</h3><p>Photograph your item, set a price, publish. No store approval, no listing fees.</p></div></div>
              <div className='bp'><div className='idx'>02</div><div><h3>Funds held safely in escrow</h3><p>Buyer pays into an on-chain escrow contract. Nobody can stiff you — and nobody can scam them.</p></div></div>
              <div className='bp'><div className='idx'>03</div><div><h3>Paid the second it clears</h3><p>Delivery confirmed, escrow releases, USDC is yours. Keep 100% of every sale.</p></div></div>
            </div>
          </div>
          <div data-reveal>
            <div className='phone'>
              <div className='notch' />
              <div className='screen'>
                <div className='scr-top'><span className='b'>Vendra Wallet</span><span className='b'>•••</span></div>
                <div className='scr-bal'>
                  <div className='l'>Available balance</div>
                  <div className='v'>$4,182<sup>.40</sup></div>
                  <div className='scr-pill'>Last sale settled in 1.4s</div>
                </div>
                <div className='scr-rows'>
                  {TXNS.map((t) => (
                    <div className='scr-row' key={t.t1}><div className='ic'>{t.ic}</div><div><div className='t1'>{t.t1}</div><div className='t2'>{t.t2}</div></div><div className='amt'>{t.amt}</div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className='wrap'>
          <div className='mkt-top'>
            <div className='sec-head' data-reveal>
              <p className='eyebrow'>Live on the market</p>
              <h2>Real goods. Real people.<br/>Zero middlemen.</h2>
            </div>
            <Link href='/marketplace' className='link-arrow' data-reveal>View all listings <span className='arr'>→</span></Link>
          </div>
          <div className='chips' data-reveal>
            {CHIPS.map((c) => (
              <span key={c} className={'chip' + (activeChip === c ? ' active' : '')} onClick={() => setActiveChip(c)}>{c}</span>
            ))}
          </div>
          <div className='v4grid stg'>
            {cards.map((p:any) => (
              <Link href={p.href} key={p.key} className='pcard'>
                <div className='pc-img'>
                  <span className='pc-badge'>{p.cat}</span>
                  {p.v && <span className='pc-verif'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3'><path d='m5 12 4 4 10-10'/></svg> Verified</span>}
                  <img src={p.image} alt={p.name} loading='lazy' onError={(e) => { const d = e.currentTarget.parentElement; if (d) { d.classList.add('grad'); d.style.background = p.g; } }} />
                  <span className='ph-name'>{p.name}</span>
                </div>
                <div className='pc-body'>
                  <div className='pc-name'>{p.name}</div>
                  <div className='pc-seller'>{p.seller}</div>
                  <div className='pc-foot'>
                    <div className='pc-price'>{p.price}<span className='u'>USDC</span></div>
                    <span className='pc-buy'>{p.buy}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className='dark'>
        <div className='wrap'>
          <div className='sec-head' data-reveal>
            <p className='eyebrow on-dark'>Why it’s different</p>
            <h2>Trust that lives on-chain,<br/>not in a support ticket.</h2>
          </div>
          <div className='feat-grid stg'>
            <div className='fcard'>
              <div className='fi'><svg viewBox='0 0 24 24'><path d='M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4Z'/><path d='m9 12 2 2 4-4'/></svg></div>
              <h3>Protected by code</h3>
              <p>Every purchase is locked in an on-chain escrow contract. Payment only releases when the buyer confirms delivery — so item-never-arrived scams simply can’t happen.</p>
              <span className='stat-mini'>100%</span>
              <p style={{ marginTop: 6 }}>of orders escrow-backed</p>
            </div>
            <div className='fcard'>
              <div className='fi'><svg viewBox='0 0 24 24'><path d='M12 2v20M2 12h20'/><circle cx='12' cy='12' r='9'/></svg></div>
              <h3>A reputation you own</h3>
              <p>Your seller reputation is tied to your wallet and built from real, escrow-settled sales — not a number a platform can quietly edit. It moves with you.</p>
              <span className='stat-mini'>Wallet-tied</span>
              <p style={{ marginTop: 6 }}>reputation from real sales</p>
            </div>
            <div className='fcard'>
              <div className='fi'><svg viewBox='0 0 24 24'><path d='M3 12h18M3 6h18M3 18h18'/></svg></div>
              <h3>Paid in seconds, anywhere</h3>
              <p>USDC settles on Arc with sub-2-second finality. No currency conversion, no wire fees, no waiting five business days for your own money.</p>
              <span className='stat-mini'>{'<'}2s</span>
              <p style={{ marginTop: 6 }}>average payout time</p>
            </div>
          </div>
        </div>
      </section>

      <section className='trust'>
        <div className='trust-wrap'>
          <span className='t'>Built on Arc — Circle’s USDC-native blockchain</span>
          <div className='trust-logos'><span>USDC native</span><span>Built on Arc</span><span>Circle wallets</span><span>On-chain escrow</span></div>
        </div>
      </section>

      <section className='cta'>
        <div className='wrap'>
          <canvas id='v4globe' ref={globeRef} width={840} height={840} data-reveal />
          <div className='rule'>Commerce Unchained</div>
          <h2 data-reveal>Open your store<br/>in <span className='v4amber'>minutes.</span></h2>
          <p className='lede' data-reveal>Join the marketplace where sellers keep everything they earn and buyers never get scammed.</p>
          <div className='cta-actions' data-reveal>
            <button className='v4btn v4btn-amber' onClick={handleGetStarted}>{isConnected ? 'Launch my store' : 'Start selling'} <span className='arr'>→</span></button>
            <Link href='/marketplace' className='v4btn v4btn-ghost'>Browse the market</Link>
          </div>
        </div>
      </section>

      <footer className='v4foot'>
        <div className='foot-wrap'>
          <div className='foot-brand'>
            <div className='v4brandrow'><span className='v4emblem'><span>V</span></span><span className='fb-name'>Vendra</span></div>
            <p>The Web3-native marketplace. Sell anything, keep everything, get paid instantly in USDC. Powered by Arc.</p>
          </div>
          <div className='foot-col'><h4>Marketplace</h4><Link href='/marketplace'>Browse</Link><Link href='/marketplace'>Categories</Link><Link href='/marketplace'>Top sellers</Link></div>
          <div className='foot-col'><h4>Sell</h4><Link href='/store/create'>Open a store</Link><Link href='/store/create'>Escrow and payouts</Link><Link href='/profile'>Reputation</Link></div>
          <div className='foot-col'><h4>Company</h4><Link href='/docs'>Documentation</Link><a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer'>Faucet</a><a href='https://docs.arc.io/' target='_blank' rel='noopener noreferrer'>Arc docs</a></div>
        </div>
        <div className='foot-bot'>
          <span>© 2026 Vendra · Commerce Unchained</span>
          <span>Live on Arc Testnet · USDC native</span>
        </div>
      </footer>
    </main>
  );
}
