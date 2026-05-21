import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';

const patchSchema = z.object({
  status: z.enum(['pending', 'paid', 'preparing', 'delivered']),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = patchSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const db = getSupabaseAdmin();
  const { error } = await db.from('orders').update({ status: parsed.data.status }).eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
