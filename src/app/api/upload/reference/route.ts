import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/upload';
import { rateLimit } from '@/lib/rate-limit';

// Public endpoint for customers to attach inspiration images to a custom order.
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(ip, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many uploads. Please wait a moment.' }, { status: 429 });
  }

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

  const uploaded = await uploadImage(file, 'references');
  if ('error' in uploaded) {
    return NextResponse.json({ error: uploaded.error }, { status: 400 });
  }

  return NextResponse.json({ url: uploaded.url });
}
