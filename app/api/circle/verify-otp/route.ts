import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ error: 'Email and code required' }, { status: 400 });
    const key = email.toLowerCase().trim();
    const { data, error } = await supabase.from('otp_codes').select('*').eq('email', key).order('created_at', { ascending: false }).limit(1).single();
    if (error || !data) return NextResponse.json({ error: 'No code found. Please request a new one.' }, { status: 400 });
    if (new Date(data.expires_at) < new Date()) {
      await supabase.from('otp_codes').delete().eq('email', key);
      return NextResponse.json({ error: 'Code expired. Please request a new one.' }, { status: 400 });
    }
    if (data.otp !== otp.trim()) return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 400 });
    await supabase.from('otp_codes').delete().eq('email', key);
    return NextResponse.json({ success: true, verified: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}