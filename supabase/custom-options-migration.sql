-- Custom cake configurator: base price + admin-managed add-on options.
-- Run this in your Supabase SQL editor. Safe to re-run.

-- 1. Single-row config for the base custom cake
CREATE TABLE IF NOT EXISTS custom_config (
  id             INT PRIMARY KEY DEFAULT 1,
  base_price     INTEGER NOT NULL DEFAULT 15000,          -- ₦ starting price
  base_label     TEXT NOT NULL DEFAULT 'Standard custom cake (serves ~12)',
  lead_time_days INTEGER NOT NULL DEFAULT 5,
  CONSTRAINT custom_config_single_row CHECK (id = 1)
);
INSERT INTO custom_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 2. Admin-managed add-on options
CREATE TABLE IF NOT EXISTS custom_options (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name   TEXT NOT NULL,                    -- e.g. 'Flavour', 'Topping', 'Dietary', 'Size'
  name         TEXT NOT NULL,                    -- e.g. 'Chocolate', 'Coconut', 'Sugar-free'
  price_delta  INTEGER NOT NULL DEFAULT 0,       -- ₦ added to base when selected (can be 0)
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE custom_config  ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_options ENABLE ROW LEVEL SECURITY;

-- 3. Store what the customer configured on their request
ALTER TABLE custom_order_requests ADD COLUMN IF NOT EXISTS cake_size        TEXT;
ALTER TABLE custom_order_requests ADD COLUMN IF NOT EXISTS selected_options JSONB;
ALTER TABLE custom_order_requests ADD COLUMN IF NOT EXISTS estimated_price  INTEGER;

-- 4. Starter options (edit or delete these in Admin → Custom Cake)
INSERT INTO custom_options (group_name, name, price_delta, sort_order) VALUES
  ('Flavour',  'Vanilla',      0,    1),
  ('Flavour',  'Chocolate',    2000, 2),
  ('Flavour',  'Red Velvet',   3000, 3),
  ('Flavour',  'Coconut',      1500, 4),
  ('Topping',  'Fresh Fruit',  2500, 1),
  ('Topping',  'Chocolate Drip', 2000, 2),
  ('Topping',  'Edible Flowers', 3500, 3),
  ('Dietary',  'Sugar-free',   2000, 1),
  ('Dietary',  'Gluten-free',  3000, 2),
  ('Size',     'Extra tier (serves +12)', 8000, 1)
ON CONFLICT DO NOTHING;
