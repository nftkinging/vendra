/* ============================================================
   batch25_email.js  —  Vendra v4, Batch 25 (OTP email)
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch25_email.js
   ------------------------------------------------------------
   Rewrites app/api/circle/send-otp/route.ts with a v4 LIGHT
   email template (inline styles, hex colors, no gradients for
   Gmail compatibility). ALL logic kept identical: OTP creation,
   Supabase delete+insert, Resend send, from/to/subject.
   Backs up the route once.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const routePath = path.join(root, 'app', 'api', 'circle', 'send-otp', 'route.ts');
if (!fs.existsSync(routePath)) { console.error('\n  x  app/api/circle/send-otp/route.ts not found. Run from project root.\n'); process.exit(1); }

const ROUTE = [
"import { NextRequest, NextResponse } from 'next/server';",
"import { Resend } from 'resend';",
"import { createClient } from '@supabase/supabase-js';",
"",
"const resend = new Resend(process.env.RESEND_API_KEY);",
"const supabase = createClient(",
"  'https://orqdqhrhqtehxawjpjkr.supabase.co',",
"  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycWRxaHJocXRlaHhhd2pwamtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MTg0NjksImV4cCI6MjA5MTQ5NDQ2OX0.G3ijP8DJ8I35SXsSMZE834Q8x_tqWT1yp-3gi---bQo'",
");",
"",
"export async function POST(req: NextRequest) {",
"  try {",
"    const { email } = await req.json();",
"    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });",
"    const otp = Math.floor(100000 + Math.random() * 900000).toString();",
"    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();",
"    // Delete any existing OTP for this email",
"    await supabase.from('otp_codes').delete().eq('email', email.toLowerCase().trim());",
"    // Store new OTP",
"    await supabase.from('otp_codes').insert({ email: email.toLowerCase().trim(), otp, expires_at: expiresAt });",
"    await resend.emails.send({",
"      from: 'Vendra <noreply@vendramarket.xyz>',",
"      to: email,",
"      subject: 'Your Vendra Login Code \u2014 ' + otp,",
"      html: `<div style='margin:0;padding:32px 16px;background:#EFEADD;font-family:Helvetica,Arial,sans-serif;'><div style='max-width:480px;margin:0 auto;background:#FCFAF4;border:1px solid #E7E0CF;border-radius:18px;padding:40px 36px;'><div style='font-size:20px;font-weight:700;letter-spacing:0.24em;color:#1A1206;'>VENDRA</div><div style='height:1px;background:#E7C97A;margin:18px 0 28px;'></div><div style='font-size:15px;color:#5A5240;line-height:1.7;margin-bottom:24px;'>Your one-time login code for Vendra. It expires in 10 minutes.</div><div style='background:#FBF3DF;border:1px solid #EBD9A8;border-radius:14px;padding:26px;text-align:center;margin-bottom:24px;'><div style='font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#9A8C66;margin-bottom:10px;'>Your login code</div><div style='font-size:46px;font-weight:700;letter-spacing:0.18em;color:#B47E0E;'>${otp}</div></div><div style='font-size:12px;color:#8A8270;line-height:1.7;'>If you didn't request this, you can safely ignore this email. Never share this code with anyone.</div><div style='height:1px;background:#ECE5D6;margin:26px 0 16px;'></div><div style='font-size:11px;color:#A89F89;letter-spacing:0.04em;'>Vendra \u00b7 Arc Testnet \u00b7 USDC</div></div></div>`",
"    });",
"    return NextResponse.json({ success: true });",
"  } catch (e: any) {",
"    return NextResponse.json({ error: e.message }, { status: 500 });",
"  }",
"}",
""
].join("\n");

if (!fs.existsSync(routePath + '.v3bak')) { fs.copyFileSync(routePath, routePath + '.v3bak'); console.log('  .  backup -> app/api/circle/send-otp/route.ts.v3bak'); }
fs.writeFileSync(routePath, ROUTE, 'utf8');
console.log('  +  send-otp/route.ts email template rewritten in v4 light (logic unchanged)');
console.log('\n  Done. npm run build -> request a new code at /join to see the email. Then git push.\n');
