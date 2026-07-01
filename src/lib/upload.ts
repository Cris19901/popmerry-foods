import { getSupabaseAdmin } from './supabase';

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

type UploadResult = { url: string; path: string } | { error: string };

export async function uploadImage(file: File, folder: string): Promise<UploadResult> {
  if (!ALLOWED.includes(file.type)) return { error: 'Only JPG, PNG, WebP or GIF images are allowed' };
  if (file.size > MAX_BYTES) return { error: 'Image must be under 5MB' };

  const db = getSupabaseAdmin();
  const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await db.storage.from('uploads').upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return { error: 'Upload failed. Please try again.' };

  const { data } = db.storage.from('uploads').getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteImage(path: string): Promise<void> {
  try {
    const db = getSupabaseAdmin();
    await db.storage.from('uploads').remove([path]);
  } catch {
    // best-effort
  }
}
