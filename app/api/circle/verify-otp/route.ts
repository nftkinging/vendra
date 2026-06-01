import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '../../../lib/otp';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ error: 'Email and code required' }, { status: 400 });
    const result = verifyOtp(email, otp);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true, verified: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}