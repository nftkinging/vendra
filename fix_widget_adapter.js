const fs = require('fs');
let content = fs.readFileSync('app/components/AppKitWidget.tsx', 'utf8');

// Fix 1: Add usePublicClient import
content = content.replace(
  "import { useAccount, useBalance, useWalletClient } from 'wagmi';",
  "import { useAccount, useBalance, useWalletClient, usePublicClient } from 'wagmi';"
);

// Fix 2: Add publicClient hook
content = content.replace(
  "  const { data: walletClient } = useWalletClient();",
  "  const { data: walletClient } = useWalletClient();\n  const publicClient = usePublicClient();"
);

// Fix 3: Fix ViemAdapter constructor — needs publicClient + walletClient
content = content.replace(
  "      const adapter = new ViemAdapter({ walletClient });",
  "      if (!publicClient) throw new Error('Public client not available');\n      const adapter = new ViemAdapter({ walletClient, publicClient });"
);

fs.writeFileSync('app/components/AppKitWidget.tsx', content, 'utf8');
console.log('Fixed:', content.includes('publicClient'));
