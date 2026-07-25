-- Record which payment method customers chose, and let admin manually
-- confirm bank-transfer payments that Paystack never sees.
-- Run this in your Supabase SQL editor. Safe to re-run.

-- 1. Checkout orders: which method was used, and any reference the
--    customer typed for a bank transfer
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'paystack'
  CHECK (payment_method IN ('paystack', 'transfer'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS transfer_reference TEXT;

-- 2. Custom-cake quote deposits: how the deposit was actually paid
--    (deposit_reference already exists from quote-migration.sql — reused
--    here to hold either the Paystack reference or an admin's note)
ALTER TABLE custom_order_requests ADD COLUMN IF NOT EXISTS deposit_method TEXT
  CHECK (deposit_method IN ('paystack', 'transfer'));
