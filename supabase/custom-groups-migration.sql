-- Stepped custom-cake builder: single/multi-select groups + option descriptions.
-- Run this in your Supabase SQL editor. Safe to re-run.

-- 1. Group metadata — controls how each step behaves in the builder
CREATE TABLE IF NOT EXISTS custom_option_groups (
  name           TEXT PRIMARY KEY,                    -- matches custom_options.group_name
  selection_type TEXT NOT NULL DEFAULT 'multi'
                 CHECK (selection_type IN ('single', 'multi')),
  required       BOOLEAN NOT NULL DEFAULT FALSE,      -- must the customer choose one? (single only)
  sort_order     INTEGER NOT NULL DEFAULT 100
);
ALTER TABLE custom_option_groups ENABLE ROW LEVEL SECURITY;

-- 2. Short marketing description per option ("Melty, rich & irresistible")
ALTER TABLE custom_options ADD COLUMN IF NOT EXISTS description TEXT;

-- Prevent duplicate options and enable clean re-seeding
CREATE UNIQUE INDEX IF NOT EXISTS custom_options_group_name_uniq
  ON custom_options (group_name, name);

-- 3. Seed the banana-cake builder groups
INSERT INTO custom_option_groups (name, selection_type, required, sort_order) VALUES
  ('Base',      'single', TRUE,  1),
  ('Flavor',    'multi',  FALSE, 2),
  ('Sweetness', 'single', TRUE,  3)
ON CONFLICT (name) DO UPDATE
  SET selection_type = EXCLUDED.selection_type,
      required       = EXCLUDED.required,
      sort_order     = EXCLUDED.sort_order;

-- 4. Seed the options with descriptions (prices default to 0 — set them in Admin → Custom Cake)
INSERT INTO custom_options (group_name, name, description, price_delta, sort_order) VALUES
  ('Base',      'Classic',        'Soft, moist & timelessly delicious', 0, 1),
  ('Base',      'Whole Wheat',    'Hearty, wholesome & fiber-rich',     0, 2),
  ('Base',      'Zero Sugar',     'All the flavor, no added sugar',     0, 3),
  ('Flavor',    'Chocolate Chips','Melty, rich & irresistible',         0, 1),
  ('Flavor',    'Raisins',        'Naturally sweet & chewy',            0, 2),
  ('Flavor',    'Coconut Flakes', 'Tropical, nutty & oh-so-good',       0, 3),
  ('Flavor',    'Caramel Swirl',  'Buttery, sweet & perfectly swirled', 0, 4),
  ('Sweetness', 'Regular',        'Classic sweetness you know & love',  0, 1),
  ('Sweetness', 'Reduced Sugar',  'Just the right amount of sweetness', 0, 2),
  ('Sweetness', 'No Added Sugar', 'Naturally sweet & guilt-free',       0, 3)
ON CONFLICT (group_name, name) DO UPDATE
  SET description = EXCLUDED.description;
