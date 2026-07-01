import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { isAdmin } from '@/lib/admin-auth';

const schema = z.object({
  base_price: z.number().int().min(0).max(10_000_000).optional(),
  base_label: z.string().min(1).max(120).optional(),
  lead_time_days: z.number().int().min(0).max(365).optional(),
});

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  const db = getSupabaseAdmin();
  const { error } = await db.from('custom_config').update(parsed.data).eq('id', 1);
  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
