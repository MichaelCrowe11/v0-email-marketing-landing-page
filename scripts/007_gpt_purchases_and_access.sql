-- GPT Purchases and Access Tracking

-- User GPT purchases
CREATE TABLE IF NOT EXISTS gpt_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  gpt_id TEXT NOT NULL,
  purchase_date TIMESTAMPTZ DEFAULT NOW(),
  amount_paid DECIMAL(10,2) NOT NULL,
  stripe_payment_id TEXT,
  access_type TEXT CHECK (access_type IN ('openai', 'platform', 'both')) DEFAULT 'both',
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GPT usage tracking
CREATE TABLE IF NOT EXISTS gpt_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  gpt_id TEXT NOT NULL,
  session_id TEXT,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_tokens INTEGER,
  cost DECIMAL(10,4),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User saved conversations with GPTs
CREATE TABLE IF NOT EXISTS gpt_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  gpt_id TEXT NOT NULL,
  title TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_gpt_purchases_user ON gpt_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_gpt_purchases_gpt ON gpt_purchases(gpt_id);
CREATE INDEX IF NOT EXISTS idx_gpt_usage_user ON gpt_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_gpt_conversations_user ON gpt_conversations(user_id);
