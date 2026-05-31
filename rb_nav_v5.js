const fs = require('fs');
let nav = fs.readFileSync('app/Nav.tsx', 'utf8');

// Add AppKitWidget import after CartDrawer import
nav = nav.replace(
  "import CartDrawer from './components/CartDrawer';",
  "import CartDrawer from './components/CartDrawer';\nimport AppKitWidget from './components/AppKitWidget';"
);

// Add AppKitWidget in nav right section before ConnectButton line
nav = nav.replace(
  "          {isConnected\n            ? <ConnectButton accountStatus='address' chainStatus='none' showBalance={false} />",
  "          {isConnected && <AppKitWidget />}\n          {isConnected\n            ? <ConnectButton accountStatus='address' chainStatus='none' showBalance={false} />"
);

fs.writeFileSync('app/Nav.tsx', nav, 'utf8');
console.log('Nav updated with AppKitWidget:', nav.includes('AppKitWidget'));
