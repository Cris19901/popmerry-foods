import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  phone: z.string().min(7).max(20).optional(),
});

function makeCode(name: string) {
  const first = name.trim().split(/\s+/)[0].replace(/[^a-zA-Z]/g, '').slice(0, 8).toUpperCase() || 'FRIEND';
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${first}${rand}`;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please enter a valid name and email' }, { status: 400 });
  }

  const { name, email, phone } = parsed.data;
  const db = getSupabaseAdmin();

  // Return existing code if this email already has one
  const { data: existing } = await db
    .from('referrals')
    .select('code, uses, reward_per_referral')
    .ilike('referrer_email', email)
    .single();

  if (existing) {
    return NextResponse.json({ code: existing.code, uses: existing.uses, reward: existing.reward_per_referral, returning: true });
  }

  // Create a new referral code (retry once on rare collision)
  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = makeCode(name);
    const { data, error } = await db
      .from('referrals')
      .insert({ code, referrer_name: name, referrer_email: email, referrer_phone: phone ?? null })
      .select('code, uses, reward_per_referral')
      .single();

    if (!error && data) {
      return NextResponse.json({ code: data.code, uses: data.uses, reward: data.reward_per_referral, returning: false });
    }
    lastErr = error;
    // 23505 = unique violation (duplicate code) → retry; duplicate email → fetch existing
    if (error?.code === '23505' && error.message?.includes('referrer_email')) {
      const { data: row } = await db.from('referrals').select('code, uses, reward_per_referral').ilike('referrer_email', email).single();
      if (row) return NextResponse.json({ code: row.code, uses: row.uses, reward: row.reward_per_referral, returning: true });
    }
  }

  console.error('Referral create failed:', lastErr);
  return NextResponse.json({ error: 'Could not create referral code. Please try again.' }, { status: 500 });
}
