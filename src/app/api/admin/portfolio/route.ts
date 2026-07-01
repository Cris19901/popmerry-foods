import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { uploadImage } from '@/lib/upload';

// Protected by proxy (/api/admin/*). Accepts multipart form-data.
export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid upload' }, { status: 400 });
  }

  const file = formData.get('file');
  const title = (formData.get('title') as string | null)?.slice(0, 120) ?? '';
  const event_type = (formData.get('event_type') as string | null)?.slice(0, 40) || 'Other';

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  const uploaded = await uploadImage(file, 'portfolio');
  if ('error' in uploaded) {
    return NextResponse.json({ error: uploaded.error }, { status: 400 });
  }

  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from('portfolio')
    .insert({ image_url: uploaded.url, image_path: uploaded.path, title, event_type })
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
