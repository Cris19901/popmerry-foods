import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  code: z.string().min(1).max(50),
  subtotal: z.number().int().min(0),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(ip, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { code, subtotal } = parsed.data;
  const db = getSupabaseAdmin();

  const { data: promo } = await db
    .from('promo_codes')
    .select('*')
    .ilike('code', code)
    .single();

  // If it's not a promo code, check if it's a referral code
  if (!promo) {
    const { data: referral } = await db
      .from('referrals')
      .select('code, referee_discount')
      .ilike('code', code)
      .single();

    if (referral) {
      const discount = Math.min(referral.referee_discount, subtotal);
      return NextResponse.json({
        valid: true,
        kind: 'referral',
        code: referral.code,
        discount,
        description: `Referral reward — ₦${referral.referee_discount.toLocaleString()} off`,
      });
    }

    return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
  }

  if (!promo.is_active) {
    return NextResponse.json({ error: 'This promo code is no longer active' }, { status: 404 });
  }

  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return NextResponse.json({ error: 'This promo code has expired' }, { status: 400 });
  }

  if (promo.max_uses !== null && promo.used_count >= promo.max_uses) {
    return NextResponse.json({ error: 'This promo code has reached its usage limit' }, { status: 400 });
  }

  if (subtotal < promo.min_order) {
    return NextResponse.json({
      error: `Minimum order of ₦${(promo.min_order / 100).toLocaleString()} required for this code`,
    }, { status: 400 });
  }

  const discount = promo.discount_type === 'percent'
    ? Math.floor(subtotal * promo.discount_value / 100)
    : Math.min(promo.discount_value, subtotal);

  return NextResponse.json({
    valid: true,
    kind: 'promo',
    code: promo.code,
    discountType: promo.discount_type,
    discountValue: promo.discount_value,
    discount,
    description: promo.description,
  });
}
