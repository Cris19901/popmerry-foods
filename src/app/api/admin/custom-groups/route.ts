import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { isAdmin } from '@/lib/admin-auth';

const schema = z.object({
  name: z.string().min(1).max(40),
  selection_type: z.enum(['single', 'multi']),
  required: z.boolean().default(false),
  sort_order: z.number().int().min(0).max(1000).default(100),
});

// Upsert group metadata (create or update by name)
export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 });
  }

  const db = getSupabaseAdmin();
  const { error } = await db.from('custom_option_groups').upsert(parsed.data, { onConflict: 'name' });
  if (error) return NextResponse.json({ error: 'Failed to save group' }, { status: 500 });

  return NextResponse.json({ ok: true });
}
