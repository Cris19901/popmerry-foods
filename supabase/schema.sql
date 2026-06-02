-- Base schema — safe to re-run (idempotent).
-- Run this ONLY when setting up a fresh database.
-- If your DB is already live, run only the migration files instead.

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  delivery_note TEXT,
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER NOT NULL DEFAULT 1000,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'preparing', 'delivered')),
  paystack_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS custom_order_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  cake_quantity TEXT,
  croissant_quantity TEXT,
  popcorn_quantity TEXT,
  special_requirements TEXT,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'confirmed', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_order_requests ENABLE ROW LEVEL SECURITY;

-- Policies (drop first so this is safe to re-run)
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Service role full access to orders" ON orders;
DROP POLICY IF EXISTS "Anyone can create custom requests" ON custom_order_requests;
DROP POLICY IF EXISTS "Service role full access to custom requests" ON custom_order_requests;

CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create custom requests" ON custom_order_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role full access to orders" ON orders
  USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to custom requests" ON custom_order_requests
  USING (auth.role() = 'service_role');
