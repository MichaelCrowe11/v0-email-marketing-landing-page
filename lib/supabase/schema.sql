-- Dataset Purchases Table
CREATE TABLE IF NOT EXISTS dataset_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dataset_id TEXT NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  amount_paid INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  download_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  download_count INTEGER DEFAULT 0,
  max_downloads INTEGER DEFAULT 5,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year'),
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,

  CONSTRAINT valid_amount CHECK (amount_paid > 0),
  CONSTRAINT valid_downloads CHECK (download_count <= max_downloads)
);

-- AI Model Subscriptions Table
CREATE TABLE IF NOT EXISTS ai_model_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active, cancelled, past_due, etc.
  api_key TEXT UNIQUE NOT NULL DEFAULT 'sk_' || encode(gen_random_bytes(32), 'hex'),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,

  CONSTRAINT valid_status CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid', 'incomplete'))
);

-- AI Model Usage Tracking
CREATE TABLE IF NOT EXISTS ai_model_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES ai_model_subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model_id TEXT NOT NULL,
  request_count INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(subscription_id, period_start)
);

-- Dataset Download Logs
CREATE TABLE IF NOT EXISTS dataset_download_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID NOT NULL REFERENCES dataset_purchases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dataset_id TEXT NOT NULL,
  download_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  download_completed_at TIMESTAMP WITH TIME ZONE,
  file_size_bytes BIGINT,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN DEFAULT FALSE
);

-- Admin Users Table (for dashboard access)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer', -- viewer, editor, admin
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_role CHECK (role IN ('viewer', 'editor', 'admin'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_dataset_purchases_user_id ON dataset_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_dataset_purchases_dataset_id ON dataset_purchases(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_purchases_download_token ON dataset_purchases(download_token);

CREATE INDEX IF NOT EXISTS idx_ai_model_subs_user_id ON ai_model_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_model_subs_model_id ON ai_model_subscriptions(model_id);
CREATE INDEX IF NOT EXISTS idx_ai_model_subs_api_key ON ai_model_subscriptions(api_key);
CREATE INDEX IF NOT EXISTS idx_ai_model_subs_status ON ai_model_subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_ai_model_usage_sub_id ON ai_model_usage(subscription_id);
CREATE INDEX IF NOT EXISTS idx_ai_model_usage_user_id ON ai_model_usage(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE dataset_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataset_download_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Dataset Purchases Policies
CREATE POLICY "Users can view their own dataset purchases"
  ON dataset_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dataset purchases"
  ON dataset_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- AI Model Subscriptions Policies
CREATE POLICY "Users can view their own AI model subscriptions"
  ON ai_model_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI model subscriptions"
  ON ai_model_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- AI Model Usage Policies
CREATE POLICY "Users can view their own AI model usage"
  ON ai_model_usage FOR SELECT
  USING (auth.uid() = user_id);

-- Dataset Download Logs Policies
CREATE POLICY "Users can view their own download logs"
  ON dataset_download_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Admin Users Policies
CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND role IN ('editor', 'admin')
    )
  );

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_model_subscriptions_updated_at
    BEFORE UPDATE ON ai_model_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
