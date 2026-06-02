import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  productId: z.string().min(1),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  const db = getSupabaseAdmin();
  const { error } = await db.from('waitlist').upsert(
    { product_id: parsed.data.productId, email: parsed.data.email, phone: parsed.data.phone ?? null },
    { onConflict: 'product_id,email' }
  );

  if (error) {
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
