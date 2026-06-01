import { NextRequest, NextResponse } from 'next/server';
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

export async function POST(req: NextRequest) {
  try {
    const { walletId } = await req.json();
    if (!walletId) return NextResponse.json({ error: 'walletId required' }, { status: 400 });
    const client = initiateDeveloperControlledWalletsClient({
      apiKey: process.env.CIRCLE_API_KEY!,
      entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
    });
    const balances = (await client.getWalletTokenBalance({ id: walletId })).data?.tokenBalances || [];
    // Arc USDC is the native token — find it
    const usdc = balances.find((b: any) =>
      b.token?.symbol === 'USDC' ||
      b.token?.symbol === 'ARC' ||
      b.token?.isNative === true
    );
    const bal = usdc?.amount || '0';
    return NextResponse.json({ balance: bal, balances, raw: balances });
  } catch (e: any) {
    console.error('Balance error:', e.message);
    return NextResponse.json({ error: e.message, balance: '0' }, { status: 500 });
  }
}