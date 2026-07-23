-- Custom order quotes + deposits.
-- Run this in your Supabase SQL editor. Safe to re-run.

-- 1. Fix the status constraint.
--    The original schema only allowed ('new','contacted','confirmed','completed'),
--    but the admin panel already uses 'quoted' and 'cancelled' — those would be
--    rejected on a fresh database. This widens it and adds 'deposit_paid'.
ALTER TABLE custom_order_requests DROP CONSTRAINT IF EXISTS custom_order_requests_status_check;
ALTER TABLE custom_order_requests ADD CONSTRAINT custom_order_requests_status_check
  CHECK (status IN ('new','contacted','quoted','deposit_paid','confirmed','completed','cancelled'));

-- 2. Quote + deposit fields
ALTER TABLE custom_order_requests ADD COLUMN IF NOT EXISTS quote_token       TEXT UNIQUE;
ALTER TABLE custom_order_requests ADD COLUMN IF NOT EXISTS quoted_price      INTEGER;   -- final agreed price (₦)
ALTER TABLE custom_order_requests ADD COLUMN IF NOT EXISTS deposit_amount    INTEGER;   -- amount due now (₦)
ALTER TABLE custom_order_requests ADD COLUMN IF NOT EXISTS deposit_paid      BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE custom_order_requests ADD COLUMN IF NOT EXISTS deposit_reference TEXT;      -- Paystack reference
ALTER TABLE custom_order_requests ADD COLUMN IF NOT EXISTS quote_note        TEXT;      -- message shown to the customer
ALTER TABLE custom_order_requests ADD COLUMN IF NOT EXISTS quoted_at         TIMESTAMPTZ;

-- Fast lookup for the public /quote/[token] page
CREATE INDEX IF NOT EXISTS custom_order_requests_quote_token_idx
  ON custom_order_requests (quote_token);
