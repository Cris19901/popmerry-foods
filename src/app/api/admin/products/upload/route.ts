import { NextRequest, NextResponse } from 'next/server';
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
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  const uploaded = await uploadImage(file, 'products');
  if ('error' in uploaded) {
    return NextResponse.json({ error: uploaded.error }, { status: 400 });
  }

  return NextResponse.json({ url: uploaded.url });
}
