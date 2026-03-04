-- License keys table for Stripe one-time purchases
-- Run this in Supabase SQL Editor before launch

CREATE TABLE IF NOT EXISTS license_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  license_key TEXT UNIQUE NOT NULL,
  buyer_email TEXT NOT NULL,
  product_name TEXT NOT NULL,
  stripe_session_id TEXT,
  amount_paid NUMERIC(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  created_at TIMESTAMPTZ DEFAULT now(),
  activated_at TIMESTAMPTZ,
  notes TEXT
);

-- Index for fast license key lookups
CREATE INDEX IF NOT EXISTS idx_license_keys_key ON license_keys (license_key);
CREATE INDEX IF NOT EXISTS idx_license_keys_email ON license_keys (buyer_email);

-- RLS: Only service role can insert/update, anon can read with key match
ALTER TABLE license_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON license_keys
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anon can verify keys" ON license_keys
  FOR SELECT USING (true);
