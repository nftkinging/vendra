import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, formatUnits } from 'viem';

const arcTestnet = {
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: { name: 'USD Coin', symbol: 'USDC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.testnet.arc.network'] } },
};

const ARC_USDC = '0x3600000000000000000000000000000000000000' as `0x${string}`;

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
    const client = createPublicClient({ chain: arcTestnet as any, transport: http() });
    // Try native balance first (USDC is native on Arc)
    const native = await client.getBalance({ address: address as `0x${string}` });
    const nativeBalance = formatUnits(native, 18);
    if (parseFloat(nativeBalance) > 0) return NextResponse.json({ balance: parseFloat(nativeBalance).toFixed(4) });
    // Try ERC20 balance
    const erc20 = await client.readContract({ address: ARC_USDC, abi: ERC20_ABI, functionName: 'balanceOf', args: [address as `0x${string}`] });
    const erc20Balance = formatUnits(erc20 as bigint, 18);
    return NextResponse.json({ balance: parseFloat(erc20Balance).toFixed(4) });
  } catch (e: any) {
    return NextResponse.json({ balance: '0', error: e.message });
  }
}