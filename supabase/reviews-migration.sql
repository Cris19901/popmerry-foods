-- Run this in your Supabase SQL editor to enable customer reviews.

CREATE TABLE IF NOT EXISTS reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  location    TEXT NOT NULL DEFAULT 'Lagos',
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review      TEXT NOT NULL,
  product     TEXT,           -- optional: which product they're reviewing
  approved    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a review" ON reviews FOR INSERT WITH CHECK (true);
