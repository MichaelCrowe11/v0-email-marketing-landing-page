-- Ensure subscription_plans table has the correct structure
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT NOT NULL,
  stripe_price_id TEXT,
  price_monthly NUMERIC NOT NULL,
  price_yearly NUMERIC NOT NULL,
  features JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add subscription fields to users table if they don't exist
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- Create user_subscriptions table for tracking subscription history
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL, -- active, canceled, past_due, trialing
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the two subscription plans
INSERT INTO subscription_plans (plan_name, price_monthly, price_yearly, features) VALUES
('Pro Access', 97, 997, '{
  "unlimited_chat": true,
  "crowe_vision": true,
  "forum_access": true,
  "knowledge_base": true,
  "environmental_monitoring": true,
  "species_library": true,
  "sops_access": true,
  "priority_support": false,
  "gpt_modules": false,
  "consulting_calls": false
}'::jsonb),
('Expert Access', 197, 1997, '{
  "unlimited_chat": true,
  "crowe_vision": true,
  "forum_access": true,
  "knowledge_base": true,
  "environmental_monitoring": true,
  "species_library": true,
  "sops_access": true,
  "priority_support": true,
  "gpt_modules": true,
  "consulting_calls": true,
  "early_access": true
}'::jsonb)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
