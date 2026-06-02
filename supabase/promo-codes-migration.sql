-- Run this in your Supabase SQL editor to enable promo/discount codes.

CREATE TABLE IF NOT EXISTS promo_codes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code         TEXT NOT NULL UNIQUE,
  description  TEXT NOT NULL DEFAULT '',
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value INTEGER NOT NULL,        -- percent: 10 = 10%, fixed: 500 = ₦500
  min_order    INTEGER NOT NULL DEFAULT 0, -- minimum subtotal to apply code (kobo)
  max_uses     INTEGER,                   -- NULL = unlimited
  used_count   INTEGER NOT NULL DEFAULT 0,
  expires_at   TIMESTAMPTZ,              -- NULL = never expires
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Waitlist for sold-out products
CREATE TABLE IF NOT EXISTS waitlist (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, email)
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join waitlist" ON waitlist FOR INSERT WITH CHECK (true);
