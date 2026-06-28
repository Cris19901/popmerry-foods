-- Growth features: influencer tracking + referral program.
-- Run this in your Supabase SQL editor. Safe to re-run.

-- 1. Record which code drove each order (attribution)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS promo_code    TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- 2. Mark promo codes that belong to an influencer/affiliate
ALTER TABLE promo_codes ADD COLUMN IF NOT EXISTS is_influencer   BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE promo_codes ADD COLUMN IF NOT EXISTS influencer_name TEXT;

-- 3. Referral program — one row per customer who generates a code
CREATE TABLE IF NOT EXISTS referrals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                TEXT NOT NULL UNIQUE,
  referrer_name       TEXT NOT NULL,
  referrer_email      TEXT NOT NULL UNIQUE,
  referrer_phone      TEXT,
  uses                INTEGER NOT NULL DEFAULT 0,   -- successful referred orders
  reward_per_referral INTEGER NOT NULL DEFAULT 500, -- ₦ the referrer earns per use
  referee_discount    INTEGER NOT NULL DEFAULT 500, -- ₦ off for the new customer
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- 4. Atomic increment helpers (avoids race conditions on counters)
CREATE OR REPLACE FUNCTION increment_promo_usage(p_code TEXT)
RETURNS void LANGUAGE sql AS $$
  UPDATE promo_codes SET used_count = used_count + 1 WHERE UPPER(code) = UPPER(p_code);
$$;

CREATE OR REPLACE FUNCTION increment_referral_usage(p_code TEXT)
RETURNS void LANGUAGE sql AS $$
  UPDATE referrals SET uses = uses + 1 WHERE UPPER(code) = UPPER(p_code);
$$;
