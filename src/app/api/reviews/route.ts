import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  name: z.string().min(2).max(60),
  location: z.string().min(2).max(60).default('Lagos'),
  rating: z.number().int().min(1).max(5),
  review: z.string().min(10).max(1000),
  product: z.string().max(100).optional(),
});

export async function GET() {
  const db = getSupabaseAdmin();
  const { data } = await db
    .from('reviews')
    .select('id, name, location, rating, review, product, created_at')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(12);
  return NextResponse.json({ reviews: data ?? [] });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(ip, 3, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 });
  }

  const db = getSupabaseAdmin();
  const { error } = await db.from('reviews').insert({ ...parsed.data, approved: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: 'Review submitted for approval' });
}
