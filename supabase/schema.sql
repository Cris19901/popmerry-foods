-- Run this in your Supabase SQL editor

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
  special_requirements TEXT,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'confirmed', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_order_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert orders (customers)
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create custom requests" ON custom_order_requests FOR INSERT WITH CHECK (true);

-- Only service role can read/update (your backend)
CREATE POLICY "Service role full access to orders" ON orders
  USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to custom requests" ON custom_order_requests
  USING (auth.role() = 'service_role');
