import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { isAdmin } from '@/lib/admin-auth';

const createSchema = z.object({
  group_name: z.string().min(1).max(40),
  name: z.string().min(1).max(60),
  price_delta: z.number().int().min(0).max(1_000_000).default(0),
  sort_order: z.number().int().min(0).default(0),
});

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 });
  }

  const db = getSupabaseAdmin();
  const { data, error } = await db.from('custom_options').insert(parsed.data).select().single();
  if (error) return NextResponse.json({ error: 'Failed to create option' }, { status: 500 });

  return NextResponse.json({ option: data }, { status: 201 });
}
