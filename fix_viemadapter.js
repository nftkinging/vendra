const fs = require('fs');
let content = fs.readFileSync('app/components/AppKitWidget.tsx', 'utf8');

// Replace the entire handleBridge function to not use ViemAdapter at all
const oldBridge = `  const handleBridge = async () => {
    if (!bridgeAmount) { setError('Enter an amount'); return; }
    if (!walletClient) { setError('Wallet not connected'); return; }
    setLoading(true); setError(''); setResult('');
    try {
      const { ViemAdapter } = await import('@circle-fin/adapter-viem-v2');
      const { AppKit } = await import('@circle-fin/app-kit');
      const adapter = new ViemAdapter({ walletClient } as any);
      const kit = new AppKit();
      await (kit as any).bridge({
        from: { adapter, chain: fromChain },
        to: { adapter, chain: 'Arc_Testnet' },
        amount: bridgeAmount,
        token: 'USDC',
      });
      setResult('Bridge initiated! USDC is on its way to Arc Testnet.');
    } catch(e:any) {
      setError(e?.message || 'Bridge failed. Make sure you have USDC on the selected chain.');
    } finally { setLoading(false); }
  };`;

const newBridge = `  const handleBridge = async () => {
    if (!bridgeAmount) { setError('Enter an amount'); return; }
    setLoading(true); setError(''); setResult('');
    try {
      const res = await fetch('/api/circle/bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromChain, toChain: 'Arc_Testnet', amount: bridgeAmount, walletAddress: address }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult('Bridge initiated! USDC is on its way to Arc Testnet via CCTP.');
    } catch(e:any) {
      setError(e?.message || 'Bridge failed. Make sure you have USDC on the selected chain.');
    } finally { setLoading(false); }
  };`;

content = content.replace(oldBridge, newBridge);

// Also remove walletClient import since we no longer need it
content = content.replace(
  "import { useAccount, useWalletClient } from 'wagmi';",
  "import { useAccount } from 'wagmi';"
);
content = content.replace(
  "  const { data: walletClient } = useWalletClient();\n",
  ""
);

fs.writeFileSync('app/components/AppKitWidget.tsx', content, 'utf8');
console.log('Fixed:', !content.includes('ViemAdapter'));
