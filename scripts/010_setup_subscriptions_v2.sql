-- Drop existing tables to start fresh
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;

-- Create subscription_plans table with nullable stripe_price_id
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT NOT NULL UNIQUE,
  stripe_price_id TEXT, -- Nullable - will be updated with real Stripe price IDs
  price_monthly NUMERIC NOT NULL,
  price_yearly NUMERIC NOT NULL,
  features JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add subscription fields to users table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='subscription_tier') THEN
    ALTER TABLE users ADD COLUMN subscription_tier TEXT DEFAULT 'free';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='subscription_status') THEN
    ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT 'inactive';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='stripe_customer_id') THEN
    ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='stripe_subscription_id') THEN
    ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='subscription_expires_at') THEN
    ALTER TABLE users ADD COLUMN subscription_expires_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Create user_subscriptions table for tracking subscription history
CREATE TABLE user_subscriptions (
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

-- Insert subscription plans without stripe_price_id (to be added later)
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
}'::jsonb);

-- Create indexes for performance
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);

-- Add comment explaining Stripe setup
COMMENT ON COLUMN subscription_plans.stripe_price_id IS 'Update with real Stripe Price IDs from your Stripe Dashboard after creating products';
