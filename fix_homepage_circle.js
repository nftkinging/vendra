const fs = require('fs');

// Fix homepage - Get Started should work same for Circle wallet users
let home = fs.readFileSync('app/page.tsx', 'utf8');

// Replace handleGetStarted to check Circle wallet session too
const oldGetStarted = `  const handleGetStarted = async () => {
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
  };`;

const newGetStarted = `  const handleGetStarted = async () => {
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
  };`;

home = home.replace(oldGetStarted, newGetStarted);
fs.writeFileSync('app/page.tsx', home, 'utf8');
console.log('Homepage Get Started fixed');
