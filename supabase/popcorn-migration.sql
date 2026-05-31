-- Run this in your Supabase SQL editor to add popcorn support.

-- 1. Allow 'popcorn' as a product category
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE products ADD CONSTRAINT products_category_check
  CHECK (category IN ('banana-cake', 'croissant', 'bundle', 'popcorn'));

-- 2. Add popcorn quantity field to custom order requests
ALTER TABLE custom_order_requests
  ADD COLUMN IF NOT EXISTS popcorn_quantity TEXT;
