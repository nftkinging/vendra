import { NextRequest, NextResponse } from 'next/server';
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

export async function POST(req: NextRequest) {
  try {
    const { walletId } = await req.json();
    const client = initiateDeveloperControlledWalletsClient({
      apiKey: process.env.CIRCLE_API_KEY!,
      entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
    });
    const balances = (await client.getWalletTokenBalance({ id: walletId })).data?.tokenBalances;
    const usdc = balances?.find((b: any) => b.token?.symbol === 'USDC');
    return NextResponse.json({ balance: usdc?.amount || '0' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}