import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';

const patchSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  price: z.number().int().positive().optional(),
  category: z.enum(['banana-cake', 'croissant', 'bundle']).optional(),
  imageId: z.string().optional(),
  tag: z.string().max(50).nullable().optional(),
  isAvailable: z.boolean().optional(),
  gradientFrom: z.string().optional(),
  gradientTo: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = patchSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  const { name, description, price, category, imageId, tag, isAvailable, gradientFrom, gradientTo } = parsed.data;

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (price !== undefined) updates.price = price;
  if (category !== undefined) updates.category = category;
  if (imageId !== undefined) updates.image_id = imageId;
  if (tag !== undefined) updates.tag = tag;
  if (isAvailable !== undefined) updates.is_available = isAvailable;
  if (gradientFrom !== undefined) updates.gradient_from = gradientFrom;
  if (gradientTo !== undefined) updates.gradient_to = gradientTo;

  const db = getSupabaseAdmin();
  const { error } = await db.from('products').update(updates).eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getSupabaseAdmin();
  const { error } = await db.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
