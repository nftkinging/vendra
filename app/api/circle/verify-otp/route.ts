import { NextRequest, NextResponse } from 'next/server';

// In-memory OTP store (shared via module cache)
const otpStore = new Map<string, { otp: string; expires: number }>();

// Make store accessible globally on this server instance
declare global { var vendraOtpStore: Map<string, { otp: string; expires: number }> }
if (!global.vendraOtpStore) global.vendraOtpStore = new Map();

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ error: 'Email and OTP required' }, { status: 400 });
    const key = email.toLowerCase();
    const stored = global.vendraOtpStore.get(key);
    if (!stored) return NextResponse.json({ error: 'No OTP found. Please request a new code.' }, { status: 400 });
    if (Date.now() > stored.expires) {
      global.vendraOtpStore.delete(key);
      return NextResponse.json({ error: 'Code expired. Please request a new one.' }, { status: 400 });
    }
    if (stored.otp !== otp.trim()) return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 400 });
    global.vendraOtpStore.delete(key);
    return NextResponse.json({ success: true, verified: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}