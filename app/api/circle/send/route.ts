import { NextRequest, NextResponse } from 'next/server';
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

export async function POST(req: NextRequest) {
  try {
    const { walletId, walletAddress, toAddress, amount } = await req.json();
    if (!walletId || !toAddress || !amount) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    if (!toAddress.startsWith('0x') || toAddress.length !== 42) return NextResponse.json({ error: 'Invalid recipient address' }, { status: 400 });
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    const client = initiateDeveloperControlledWalletsClient({
      apiKey: process.env.CIRCLE_API_KEY!,
      entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
    });
    const tx = (await client.createTransaction({
      walletId,
      blockchain: 'ARC-TESTNET' as any,
      destinationAddress: toAddress,
      amount: [numAmount.toFixed(6)],
      tokenAddress: '0x3600000000000000000000000000000000000000',
      fee: { type: 'level', config: { feeLevel: 'MEDIUM' } },
    } as any)).data;
    return NextResponse.json({ txId: tx?.id, state: tx?.state, success: true });
  } catch (e: any) {
    console.error('Send error:', e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}