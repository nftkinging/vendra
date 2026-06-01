const fs = require('fs');
let nav = fs.readFileSync('app/Nav.tsx', 'utf8');

// Add CircleBalanceWidget import
nav = nav.replace(
  "import CircleWalletDashboard from './components/CircleWalletDashboard';",
  "import CircleWalletDashboard from './components/CircleWalletDashboard';\nimport CircleBalanceWidget from './components/CircleBalanceWidget';"
);

// Show CircleBalanceWidget in nav when Circle wallet is logged in
nav = nav.replace(
  "          {isConnected && <AppKitWidget />}",
  "          {isConnected && <AppKitWidget />}\n          {!isConnected && mounted && circleWallet && <CircleBalanceWidget wallet={circleWallet} />}"
);

fs.writeFileSync('app/Nav.tsx', nav, 'utf8');
console.log('Nav updated with CircleBalanceWidget');
