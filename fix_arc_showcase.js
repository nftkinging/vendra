const fs = require('fs');

// Add Arc integrations section to homepage
let content = fs.readFileSync('app/page.tsx', 'utf8');

// Find the CTA section and insert Arc showcase before it
const arcSection = `
      {/* ARC INTEGRATIONS SHOWCASE */}
      <div style={{ background:'var(--bg)', borderTop:'1px solid var(--b1)', borderBottom:'1px solid var(--b1)' }}>
        <div className='v-section'>
          <div className='v-eyebrow'><div className='v-eyebrow-rule'/><span className='v-eyebrow-label'>Arc Protocol Integrations</span></div>
          <div className='v-section-head'>
            <h2 className='v-section-title'>Built on <em>Arc</em></h2>
            <a href='https://docs.arc.io/llms.txt' target='_blank' rel='noopener noreferrer' className='v-view-all'>Arc Docs <span>↗</span></a>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:'var(--b1)', marginBottom:1 }}>
            {[
              { num:'01', icon:'💳', title:'USDC Native Payments', body:'All transactions settled in USDC on Arc. Gas fees paid in USDC — no volatile tokens. Sellers receive payment in under 2 seconds via Arc Malachite consensus.', tag:'Live · Arc Testnet', link:'https://docs.arc.io/arc/references/gas-and-fees.md' },
              { num:'02', icon:'🔒', title:'ERC-8183 Escrow', body:'Every purchase locks funds in a smart contract escrow. Released to seller only after buyer confirms delivery. 48-hour dispute window built in.', tag:'Live · All Purchases', link:'https://docs.arc.io/arc/tutorials/create-your-first-erc-8183-job.md' },
              { num:'03', icon:'🪪', title:'ERC-8004 Identity', body:'Every seller earns a permanent onchain reputation score from their transaction history. Cannot be faked, deleted, or transferred between platforms.', tag:'Live · Seller Profiles', link:'https://docs.arc.io/arc/references/contract-addresses.md' },
              { num:'04', icon:'🌉', title:'App Kit · Unified Balance', body:'Hold USDC on Ethereum, Solana, or any supported chain. Spend directly on Vendra without manually bridging first. Powered by CCTP.', tag:'Integrated · @circle-fin/app-kit', link:'https://docs.arc.io/app-kit/unified-balance.md' },
              { num:'05', icon:'⚡', title:'App Kit · Bridge', body:'Bridge USDC from any supported chain into Vendra via CCTP. Reduces onboarding friction for non-Arc-native users. One click, instant.', tag:'Integrated · CCTP', link:'https://docs.arc.io/app-kit/bridge.md' },
              { num:'06', icon:'🤖', title:'Agentic Economy', body:"Vendra is a flagship proof-of-concept for Arc's agentic economy thesis — a marketplace purpose-built for machine-speed, AI-driven commerce at internet scale.", tag:'Arc Blueprint · May 2026', link:'https://www.arc.io/blog/how-arc-supports-the-agentic-economy-arc-blueprints' },
            ].map(item => (
              <a key={item.num} href={item.link} target='_blank' rel='noopener noreferrer' style={{ textDecoration:'none', color:'inherit' }}>
                <div className='v-bcard' style={{ cursor:'pointer', transition:'background 0.35s' }} onMouseEnter={e=>(e.currentTarget.style.background='rgba(212,176,90,0.04)')} onMouseLeave={e=>(e.currentTarget.style.background='var(--bg3)')}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                    <div className='v-bcard-num'>{item.num}</div>
                    <div style={{ fontSize:10, fontWeight:300, fontStyle:'italic', letterSpacing:'0.10em', color:'var(--gr)', border:'1px solid var(--gr3)', padding:'3px 8px', whiteSpace:'nowrap', flexShrink:0 }}>{item.tag}</div>
                  </div>
                  <div style={{ fontSize:'1.4rem', marginBottom:12 }}>{item.icon}</div>
                  <div className='v-bcard-title' style={{ fontSize:18 }}>{item.title}</div>
                  <div className='v-bcard-body'>{item.body}</div>
                  <div style={{ marginTop:16, fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--a)', letterSpacing:'0.10em' }}>Read docs ↗</div>
                </div>
              </a>
            ))}
          </div>
          {/* Arc Chain Config */}
          <div style={{ border:'1px solid rgba(212,176,90,0.15)', background:'linear-gradient(145deg,rgba(212,176,90,0.04),var(--bg2))', padding:'24px 32px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:1, background:'linear-gradient(90deg,transparent,rgba(212,176,90,0.4),transparent)' }} />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }}>
              {[
                { label:'Chain ID', val:'5042002' },
                { label:'Network', val:'Arc Testnet' },
                { label:'Native Token', val:'USDC' },
                { label:'RPC', val:'rpc.testnet.arc.network' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--w18)', marginBottom:4 }}>{item.label}</div>
                  <div style={{ fontFamily:"'Cormorant',serif", fontSize:18, fontWeight:300, color:'var(--a2)' }}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

`;

// Insert before the CTA section
content = content.replace(
  "      {/* CTA */}",
  arcSection + "      {/* CTA */}"
);

fs.writeFileSync('app/page.tsx', content, 'utf8');
console.log('Arc showcase added to homepage:', fs.existsSync('app/page.tsx'));
