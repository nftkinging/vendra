const fs = require('fs');
let nav = fs.readFileSync('app/Nav.tsx', 'utf8');

// Fix 1: The WalletDashboard input issue — inputs inside a component 
// defined inside another component re-render on every keystroke
// Solution: move send form state to be handled without re-rendering WalletDashboard

// Replace WalletDashboard component definition with direct JSX inline
// The issue is WalletDashboard is defined as a const inside Nav() 
// which means it remounts on every state change, losing focus

// Fix by converting WalletDashboard to not be a nested component
nav = nav.replace(
  "  const WalletDashboard = () => (",
  "  const renderWalletDashboard = () => ("
);

// Fix all WalletDashboard usages
nav = nav.replace(/<WalletDashboard\/>/g, '{renderWalletDashboard()}');

fs.writeFileSync('app/Nav.tsx', nav, 'utf8');
console.log('Nav input focus fix done');
