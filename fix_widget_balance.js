const fs = require('fs');

// Fix AppKitWidget balance display alignment
let widget = fs.readFileSync('app/components/AppKitWidget.tsx', 'utf8');

// Fix the balance tab layout - make balance smaller and add faucet below
widget = widget.replace(
  "              {tab==='balance' && (\n                <div style={{ textAlign:'center' }}>\n                  <div style={{ display:'flex', justifyContent:'center', marginBottom:8 }}>\n                    <img src='https://pbs.twimg.com/profile_images/1834254808826806272/1834254808826806272_400x400.jpg' alt='Arc' style={{ width:40, height:40, borderRadius:'50%', border:'1px solid var(--b2)' }} onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />\n                  </div>\n                  <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--w18)', marginBottom:4 }}>Arc Testnet · USDC Balance</div>\n                  <div style={{ fontFamily:\"'Cormorant',serif\", fontSize:52, fontWeight:300, color:'var(--a2)', lineHeight:1, marginBottom:4 }}>${balance}</div>\n                  <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', color:'var(--w18)', marginBottom:20 }}>USDC · Arc Testnet</div>\n                  <div style={{ display:'flex', gap:8, marginBottom:10 }}>\n                    <button onClick={() => setTab('deposit')} className='btn-primary' style={{ flex:1, fontSize:9, padding:'10px' }}>Deposit ↓</button>\n                    <button onClick={() => setTab('bridge')} className='btn-ghost' style={{ flex:1, fontSize:9, padding:'10px' }}>Bridge 🌉</button>\n                  </div>\n                  <a href={`https://testnet.arcscan.app/address/${address}`} target='_blank' rel='noopener noreferrer' style={{ fontSize:9, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.10em', textDecoration:'none' }}>View on Arc Explorer ↗</a>\n                </div>)}",
  "              {tab==='balance' && (\n                <div style={{ textAlign:'center' }}>\n                  <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--w18)', marginBottom:4 }}>Arc Testnet · USDC Balance</div>\n                  <div style={{ fontFamily:\"'Cormorant',serif\", fontSize:38, fontWeight:300, color:'var(--a2)', lineHeight:1, marginBottom:2 }}>${parseFloat(balance).toFixed(2)}</div>\n                  <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', color:'var(--w18)', marginBottom:14 }}>USDC · Arc Testnet</div>\n                  <div style={{ display:'flex', gap:8, marginBottom:8 }}>\n                    <button onClick={() => setTab('deposit')} className='btn-primary' style={{ flex:1, fontSize:9, padding:'9px' }}>Deposit ↓</button>\n                    <button onClick={() => setTab('bridge')} className='btn-ghost' style={{ flex:1, fontSize:9, padding:'9px' }}>Bridge 🌉</button>\n                  </div>\n                  <div style={{ display:'flex', gap:8 }}>\n                    <a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer' style={{ flex:1 }}><button className='btn-ghost' style={{ width:'100%', fontSize:9, padding:'8px' }}>💧 Faucet ↗</button></a>\n                    <a href={`https://testnet.arcscan.app/address/${address}`} target='_blank' rel='noopener noreferrer' style={{ flex:1 }}><button className='btn-ghost' style={{ width:'100%', fontSize:9, padding:'8px' }}>Explorer ↗</button></a>\n                  </div>\n                </div>)}"
);

fs.writeFileSync('app/components/AppKitWidget.tsx', widget, 'utf8');
console.log('AppKitWidget balance fixed');

// Fix CircleBalanceDisplay balance alignment too
let circle = fs.readFileSync('app/components/CircleBalanceDisplay.tsx', 'utf8');
circle = circle.replace(
  "              <div style={{ fontFamily: \"'Cormorant',serif\", fontSize: 44, fontWeight: 300, color: 'var(--sl2)', lineHeight: 1 }}>${balance}</div>",
  "              <div style={{ fontFamily: \"'Cormorant',serif\", fontSize: 36, fontWeight: 300, color: 'var(--sl2)', lineHeight: 1 }}>${parseFloat(balance).toFixed(2)}</div>"
);
fs.writeFileSync('app/components/CircleBalanceDisplay.tsx', circle, 'utf8');
console.log('CircleBalanceDisplay balance fixed');
