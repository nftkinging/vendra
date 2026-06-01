const fs = require('fs');
let nav = fs.readFileSync('app/Nav.tsx', 'utf8');

// Add import
nav = nav.replace(
  "import AppKitWidget from './components/AppKitWidget';",
  "import AppKitWidget from './components/AppKitWidget';\nimport CircleBalanceDisplay from './components/CircleBalanceDisplay';"
);

// Add CircleBalanceDisplay before the circle wallet button in nav right
nav = nav.replace(
  "          {isConnected\n            ?<ConnectButton accountStatus='address' chainStatus='none' showBalance={false}/>",
  "          <CircleBalanceDisplay />\n          {isConnected\n            ?<ConnectButton accountStatus='address' chainStatus='none' showBalance={false}/>"
);

// Remove the old circleWallet button that was showing shortAddr 
// since CircleBalanceDisplay handles that now
nav = nav.replace(
  "              ?<button onClick={()=>{setShowDashboard(true);fetchBalance(circleWallet.walletId);}} className='btn-nav-amber' style={{display:'flex',alignItems:'center',gap:8}}><span>⭕</span><span>{shortAddr(circleWallet.address)}</span></button>",
  "              ?null"
);

fs.writeFileSync('app/Nav.tsx', nav, 'utf8');
console.log('Nav wired with CircleBalanceDisplay');
