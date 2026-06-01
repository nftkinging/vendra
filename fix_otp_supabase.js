const fs = require('fs');

// ── Fix 1: Store OTPs in Supabase instead of memory ──────────────────────────
// First run this SQL in Supabase:
// create table if not exists otp_codes (
//   id uuid default gen_random_uuid() primary key,
//   email text not null,
//   otp text not null,
//   expires_at timestamptz not null,
//   created_at timestamptz default now()
// );
// alter table otp_codes enable row level security;
// create policy "public_otp" on otp_codes for all using (true) with check (true);

const sendOtp = [];
sendOtp.push("import { NextRequest, NextResponse } from 'next/server';");
sendOtp.push("import { Resend } from 'resend';");
sendOtp.push("import { createClient } from '@supabase/supabase-js';");
sendOtp.push("");
sendOtp.push("const resend = new Resend(process.env.RESEND_API_KEY);");
sendOtp.push("const supabase = createClient(");
sendOtp.push("  'https://orqdqhrhqtehxawjpjkr.supabase.co',");
sendOtp.push("  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycWRxaHJocXRlaHhhd2pwamtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MTg0NjksImV4cCI6MjA5MTQ5NDQ2OX0.G3ijP8DJ8I35SXsSMZE834Q8x_tqWT1yp-3gi---bQo'");
sendOtp.push(");");
sendOtp.push("");
sendOtp.push("export async function POST(req: NextRequest) {");
sendOtp.push("  try {");
sendOtp.push("    const { email } = await req.json();");
sendOtp.push("    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });");
sendOtp.push("    const otp = Math.floor(100000 + Math.random() * 900000).toString();");
sendOtp.push("    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();");
sendOtp.push("    // Delete any existing OTP for this email");
sendOtp.push("    await supabase.from('otp_codes').delete().eq('email', email.toLowerCase().trim());");
sendOtp.push("    // Store new OTP");
sendOtp.push("    await supabase.from('otp_codes').insert({ email: email.toLowerCase().trim(), otp, expires_at: expiresAt });");
sendOtp.push("    await resend.emails.send({");
sendOtp.push("      from: 'Vendra <noreply@vendramarket.xyz>',");
sendOtp.push("      to: email,");
sendOtp.push("      subject: 'Your Vendra Login Code — ' + otp,");
sendOtp.push("      html: `<div style='font-family:Georgia,serif;max-width:480px;margin:0 auto;background:#0C0E1A;color:#fff8eb;padding:40px;'><div style='font-size:24px;font-weight:300;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:8px;'>Vendra</div><div style='height:1px;background:linear-gradient(90deg,transparent,rgba(212,176,90,0.4),transparent);margin-bottom:32px;'></div><div style='font-size:14px;font-weight:300;font-style:italic;color:rgba(255,248,235,0.55);margin-bottom:24px;line-height:1.7;'>Your one-time login code for Vendra. Expires in 10 minutes.</div><div style='background:rgba(212,176,90,0.08);border:1px solid rgba(212,176,90,0.3);padding:24px;text-align:center;margin-bottom:24px;'><div style='font-size:11px;font-weight:300;font-style:italic;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,248,235,0.42);margin-bottom:8px;'>Your Login Code</div><div style='font-size:48px;font-weight:300;letter-spacing:0.2em;color:#EAC96E;'>${otp}</div></div><div style='font-size:11px;font-weight:300;font-style:italic;color:rgba(255,248,235,0.35);line-height:1.7;'>If you didn't request this, ignore this email. Never share this code.</div><div style='height:1px;background:rgba(255,255,255,0.06);margin:24px 0;'></div><div style='font-size:10px;color:rgba(255,248,235,0.25);'>Vendra · Arc Testnet · USDC</div></div>`");
sendOtp.push("    });");
sendOtp.push("    return NextResponse.json({ success: true });");
sendOtp.push("  } catch (e: any) {");
sendOtp.push("    return NextResponse.json({ error: e.message }, { status: 500 });");
sendOtp.push("  }");
sendOtp.push("}");
fs.writeFileSync('app/api/circle/send-otp/route.ts', sendOtp.join('\n'), 'utf8');
console.log('send-otp done');

const verifyOtp = [];
verifyOtp.push("import { NextRequest, NextResponse } from 'next/server';");
verifyOtp.push("import { createClient } from '@supabase/supabase-js';");
verifyOtp.push("");
verifyOtp.push("const supabase = createClient(");
verifyOtp.push("  'https://orqdqhrhqtehxawjpjkr.supabase.co',");
verifyOtp.push("  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycWRxaHJocXRlaHhhd2pwamtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MTg0NjksImV4cCI6MjA5MTQ5NDQ2OX0.G3ijP8DJ8I35SXsSMZE834Q8x_tqWT1yp-3gi---bQo'");
verifyOtp.push(");");
verifyOtp.push("");
verifyOtp.push("export async function POST(req: NextRequest) {");
verifyOtp.push("  try {");
verifyOtp.push("    const { email, otp } = await req.json();");
verifyOtp.push("    if (!email || !otp) return NextResponse.json({ error: 'Email and code required' }, { status: 400 });");
verifyOtp.push("    const key = email.toLowerCase().trim();");
verifyOtp.push("    const { data, error } = await supabase.from('otp_codes').select('*').eq('email', key).order('created_at', { ascending: false }).limit(1).single();");
verifyOtp.push("    if (error || !data) return NextResponse.json({ error: 'No code found. Please request a new one.' }, { status: 400 });");
verifyOtp.push("    if (new Date(data.expires_at) < new Date()) {");
verifyOtp.push("      await supabase.from('otp_codes').delete().eq('email', key);");
verifyOtp.push("      return NextResponse.json({ error: 'Code expired. Please request a new one.' }, { status: 400 });");
verifyOtp.push("    }");
verifyOtp.push("    if (data.otp !== otp.trim()) return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 400 });");
verifyOtp.push("    await supabase.from('otp_codes').delete().eq('email', key);");
verifyOtp.push("    return NextResponse.json({ success: true, verified: true });");
verifyOtp.push("  } catch (e: any) {");
verifyOtp.push("    return NextResponse.json({ error: e.message }, { status: 500 });");
verifyOtp.push("  }");
verifyOtp.push("}");
fs.writeFileSync('app/api/circle/verify-otp/route.ts', verifyOtp.join('\n'), 'utf8');
console.log('verify-otp done');
console.log('\nOTP routes fixed — now using Supabase!');
console.log('\n⚠️  IMPORTANT: Run this SQL in Supabase before deploying:');
console.log('create table if not exists otp_codes (');
console.log('  id uuid default gen_random_uuid() primary key,');
console.log('  email text not null,');
console.log('  otp text not null,');
console.log('  expires_at timestamptz not null,');
console.log('  created_at timestamptz default now()');
console.log(');');
console.log('alter table otp_codes enable row level security;');
console.log('create policy "public_otp" on otp_codes for all using (true) with check (true);');
