-- Run this in your Supabase SQL editor to enable product management from the admin panel.
-- After running, visit Admin > Products and click "Seed from code" to populate the table.

CREATE TABLE IF NOT EXISTS products (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  price        INTEGER NOT NULL,
  category     TEXT NOT NULL CHECK (category IN ('banana-cake', 'croissant', 'bundle')),
  image_id     TEXT NOT NULL DEFAULT '',
  tag          TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  gradient_from TEXT NOT NULL DEFAULT '#5C1E00',
  gradient_to   TEXT NOT NULL DEFAULT '#C27A1A',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (keep all access server-side via service key)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
