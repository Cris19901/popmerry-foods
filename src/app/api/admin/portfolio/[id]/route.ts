import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { deleteImage } from '@/lib/upload';

const patchSchema = z.object({
  title: z.string().max(120).optional(),
  event_type: z.string().max(40).optional(),
  is_visible: z.boolean().optional(),
  sort_order: z.number().int().min(0).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  const db = getSupabaseAdmin();
  const { error } = await db.from('portfolio').update(parsed.data).eq('id', id);
  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getSupabaseAdmin();

  // Remove the storage object too
  const { data: row } = await db.from('portfolio').select('image_path').eq('id', id).single();
  if (row?.image_path) await deleteImage(row.image_path);

  const { error } = await db.from('portfolio').delete().eq('id', id);
  if (error) return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
