import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';

const createSchema = z.object({
  code: z.string().min(2).max(30).toUpperCase(),
  description: z.string().max(200).default(''),
  discount_type: z.enum(['percent', 'fixed']),
  discount_value: z.number().int().min(1),
  min_order: z.number().int().min(0).default(0),
  max_uses: z.number().int().min(1).nullable().default(null),
  expires_at: z.string().nullable().default(null),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 });
  }

  const db = getSupabaseAdmin();
  const { error, data } = await db.from('promo_codes').insert(parsed.data).select().single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A promo code with that name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create promo code' }, { status: 500 });
  }

  return NextResponse.json({ promo: data }, { status: 201 });
}
