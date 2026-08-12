import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, formatUnits } from 'viem';

const RPC_URL = 'https://rpc.testnet.arc.network';

const arcTestnet = {
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: { name: 'USD Coin', symbol: 'USDC', decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
};

// On Arc, USDC is the native gas token (18 decimals) AND a standard ERC-20
// exposed at this system precompile with 6 decimals.
const ARC_USDC = '0x3600000000000000000000000000000000000000' as `0x${string}`;
const USDC_ERC20_DECIMALS = 6;

const ERC20_ABI = [{
  name: 'balanceOf',
  type: 'function',
  stateMutability: 'view',
  inputs: [{ name: 'account', type: 'address' }],
  outputs: [{ name: '', type: 'uint256' }],
}] as const;

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    if (!address) return NextResponse.json({ balance: '0' });

    const client = createPublicClient({ chain: arcTestnet as any, transport: http(RPC_URL) });
    const acct = address as `0x${string}`;

    // Read both representations; use whichever is non-zero. Native is 18dp,
    // the ERC-20 view is 6dp — formatting with the wrong decimals is what made
    // real balances show as 0.00.
    let nativeStr = '0';
    let erc20Str = '0';
    try {
      const native = await client.getBalance({ address: acct });
      nativeStr = formatUnits(native, 18);
    } catch {}
    try {
      const erc20 = await client.readContract({ address: ARC_USDC, abi: ERC20_ABI, functionName: 'balanceOf', args: [acct] }) as bigint;
      erc20Str = formatUnits(erc20, USDC_ERC20_DECIMALS);
    } catch {}

    const native = parseFloat(nativeStr);
    const erc20 = parseFloat(erc20Str);
    const balance = (native > 0 ? native : erc20).toFixed(4);
    return NextResponse.json({ balance });
  } catch (e: any) {
    return NextResponse.json({ balance: '0', error: e?.message || 'balance read failed' });
  }
}
