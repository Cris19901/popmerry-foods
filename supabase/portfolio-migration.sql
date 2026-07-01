-- Portfolio gallery + customer reference-image uploads.
-- Run this in your Supabase SQL editor. Safe to re-run.

-- 1. Public storage bucket for all uploaded images
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read of objects in the bucket (public URLs)
DROP POLICY IF EXISTS "Public read uploads" ON storage.objects;
CREATE POLICY "Public read uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');
-- Uploads are performed server-side with the service-role key (bypasses RLS),
-- so no INSERT policy is needed here.

-- 2. Portfolio of past custom work (admin-managed)
CREATE TABLE IF NOT EXISTS portfolio (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url   TEXT NOT NULL,
  image_path  TEXT NOT NULL,              -- storage path, for deletion
  title       TEXT NOT NULL DEFAULT '',
  event_type  TEXT NOT NULL DEFAULT 'Other',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- 3. Reference images a customer attaches to a custom order
ALTER TABLE custom_order_requests ADD COLUMN IF NOT EXISTS reference_images JSONB;
