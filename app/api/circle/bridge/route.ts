import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { fromChain, toChain, amount, walletAddress } = await req.json();
    if (!fromChain || !toChain || !amount || !walletAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Bridge is initiated client-side via Circle CCTP
    // This endpoint validates and logs the bridge request
    // The actual bridge transaction happens in the user's wallet
    return NextResponse.json({
      success: true,
      message: `Bridge of ${amount} USDC from ${fromChain} to ${toChain} initiated`,
      fromChain,
      toChain,
      amount,
      walletAddress,
      cctpDocs: 'https://docs.arc.io/app-kit/bridge',
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}