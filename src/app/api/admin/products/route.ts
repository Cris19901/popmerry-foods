import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { products as staticProducts } from '@/lib/products-data';

const createSchema = z.object({
  id: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).default(''),
  price: z.number().int().positive(),
  category: z.enum(['banana-cake', 'croissant', 'bundle']),
  imageId: z.string().default(''),
  tag: z.string().max(50).optional(),
  isAvailable: z.boolean().default(true),
  gradientFrom: z.string().default('#5C1E00'),
  gradientTo: z.string().default('#C27A1A'),
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Handle seed action
  if (body.action === 'seed') {
    const db = getSupabaseAdmin();
    const rows = staticProducts.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      image_id: p.imageId,
      tag: p.tag ?? null,
      is_available: p.isAvailable,
      gradient_from: p.gradientFrom,
      gradient_to: p.gradientTo,
    }));

    const { error } = await db.from('products').upsert(rows, { onConflict: 'id' });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, seeded: rows.length });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid product data', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const p = parsed.data;
  const db = getSupabaseAdmin();
  const { error } = await db.from('products').insert({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    image_id: p.imageId,
    tag: p.tag ?? null,
    is_available: p.isAvailable,
    gradient_from: p.gradientFrom,
    gradient_to: p.gradientTo,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
