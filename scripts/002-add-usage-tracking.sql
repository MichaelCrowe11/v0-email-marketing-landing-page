-- Add usage tracking tables for metering and billing

-- Create API usage logs table
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_type TEXT NOT NULL, -- 'chat', 'crowe_vision', 'video_studio', 'gpt_module', 'api_call'
  tokens_used INTEGER DEFAULT 0,
  cost_usd NUMERIC(10, 6) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usage quotas table
CREATE TABLE IF NOT EXISTS usage_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_tier TEXT NOT NULL DEFAULT 'free',
  
  -- Monthly quotas
  chat_messages_quota INTEGER DEFAULT 5,
  chat_messages_used INTEGER DEFAULT 0,
  
  crowe_vision_quota INTEGER DEFAULT 0,
  crowe_vision_used INTEGER DEFAULT 0,
  
  video_studio_quota INTEGER DEFAULT 0,
  video_studio_used INTEGER DEFAULT 0,
  
  gpt_modules_quota INTEGER DEFAULT 0,
  gpt_modules_used INTEGER DEFAULT 0,
  
  -- Reset tracking
  quota_reset_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON api_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_feature_type ON api_usage_logs(feature_type);
CREATE INDEX IF NOT EXISTS idx_usage_quotas_user_id ON usage_quotas(user_id);

-- Function to reset quotas monthly
CREATE OR REPLACE FUNCTION reset_monthly_quotas()
RETURNS void AS $$
BEGIN
  UPDATE usage_quotas
  SET 
    chat_messages_used = 0,
    crowe_vision_used = 0,
    video_studio_used = 0,
    gpt_modules_used = 0,
    quota_reset_at = NOW() + INTERVAL '1 month',
    updated_at = NOW()
  WHERE quota_reset_at <= NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to initialize quotas for new users
CREATE OR REPLACE FUNCTION initialize_user_quota()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO usage_quotas (user_id, subscription_tier)
  VALUES (NEW.id, COALESCE(NEW.subscription_tier, 'free'))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create quota when user is created
DROP TRIGGER IF EXISTS trigger_initialize_user_quota ON users;
CREATE TRIGGER trigger_initialize_user_quota
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_quota();

-- Function to update quotas when subscription changes
CREATE OR REPLACE FUNCTION update_user_quota_on_subscription_change()
RETURNS TRIGGER AS $$
DECLARE
  new_chat_quota INTEGER;
  new_vision_quota INTEGER;
  new_video_quota INTEGER;
  new_gpt_quota INTEGER;
BEGIN
  -- Set quotas based on tier
  CASE NEW.subscription_tier
    WHEN 'free' THEN
      new_chat_quota := 5;
      new_vision_quota := 0;
      new_video_quota := 0;
      new_gpt_quota := 0;
    WHEN 'pro' THEN
      new_chat_quota := -1; -- unlimited
      new_vision_quota := -1;
      new_video_quota := 5;
      new_gpt_quota := 10;
    WHEN 'expert' THEN
      new_chat_quota := -1;
      new_vision_quota := -1;
      new_video_quota := -1;
      new_gpt_quota := -1;
    ELSE
      new_chat_quota := 5;
      new_vision_quota := 0;
      new_video_quota := 0;
      new_gpt_quota := 0;
  END CASE;

  -- Update quotas
  UPDATE usage_quotas
  SET 
    subscription_tier = NEW.subscription_tier,
    chat_messages_quota = new_chat_quota,
    crowe_vision_quota = new_vision_quota,
    video_studio_quota = new_video_quota,
    gpt_modules_quota = new_gpt_quota,
    updated_at = NOW()
  WHERE user_id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update quotas when subscription tier changes
DROP TRIGGER IF EXISTS trigger_update_quota_on_subscription ON users;
CREATE TRIGGER trigger_update_quota_on_subscription
  AFTER UPDATE OF subscription_tier ON users
  FOR EACH ROW
  WHEN (OLD.subscription_tier IS DISTINCT FROM NEW.subscription_tier)
  EXECUTE FUNCTION update_user_quota_on_subscription_change();

-- Enable RLS
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_quotas ENABLE ROW LEVEL SECURITY;

-- RLS Policies for api_usage_logs
CREATE POLICY "Users can view their own usage logs"
  ON api_usage_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert usage logs"
  ON api_usage_logs FOR INSERT
  WITH CHECK (true);

-- RLS Policies for usage_quotas
CREATE POLICY "Users can view their own quotas"
  ON usage_quotas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage quotas"
  ON usage_quotas FOR ALL
  USING (true);

-- Initialize quotas for existing users
INSERT INTO usage_quotas (user_id, subscription_tier, chat_messages_quota, crowe_vision_quota, video_studio_quota, gpt_modules_quota)
SELECT 
  id,
  COALESCE(subscription_tier, 'free'),
  CASE 
    WHEN subscription_tier = 'free' THEN 5
    ELSE -1
  END,
  CASE 
    WHEN subscription_tier = 'free' THEN 0
    ELSE -1
  END,
  CASE 
    WHEN subscription_tier IN ('free', 'pro') THEN 5
    ELSE -1
  END,
  CASE 
    WHEN subscription_tier = 'free' THEN 0
    WHEN subscription_tier = 'pro' THEN 10
    ELSE -1
  END
FROM users
ON CONFLICT (user_id) DO NOTHING;
