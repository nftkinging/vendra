import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
declare global { var vendraOtpStore: Map<string, { otp: string; expires: number }> }
if (!global.vendraOtpStore) global.vendraOtpStore = new Map();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;
    global.vendraOtpStore.set(email.toLowerCase(), { otp, expires });
    await resend.emails.send({
      from: 'Vendra <onboarding@resend.dev>',
      to: email,
      subject: 'Your Vendra Login Code — ' + otp,
      html: `<div style='font-family:Georgia,serif;max-width:480px;margin:0 auto;background:#0C0E1A;color:#fff8eb;padding:40px;'><div style='font-size:24px;font-weight:300;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:8px;'>Vendra</div><div style='height:1px;background:linear-gradient(90deg,transparent,rgba(212,176,90,0.4),transparent);margin-bottom:32px;'></div><div style='font-size:14px;font-weight:300;font-style:italic;color:rgba(255,248,235,0.55);margin-bottom:24px;line-height:1.7;'>Your one-time login code for Vendra. Expires in 10 minutes.</div><div style='background:rgba(212,176,90,0.08);border:1px solid rgba(212,176,90,0.3);padding:24px;text-align:center;margin-bottom:24px;'><div style='font-size:11px;font-weight:300;font-style:italic;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,248,235,0.42);margin-bottom:8px;'>Your Login Code</div><div style='font-size:48px;font-weight:300;letter-spacing:0.2em;color:#EAC96E;'>${otp}</div></div><div style='font-size:11px;font-weight:300;font-style:italic;color:rgba(255,248,235,0.35);line-height:1.7;'>If you didn't request this, ignore this email. Never share this code.</div><div style='height:1px;background:rgba(255,255,255,0.06);margin:24px 0;'></div><div style='font-size:10px;color:rgba(255,248,235,0.25);'>Vendra · Arc Testnet · USDC</div></div>`
    });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}