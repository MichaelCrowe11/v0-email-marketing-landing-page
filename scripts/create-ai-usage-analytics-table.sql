-- Create table for detailed AI usage analytics
CREATE TABLE IF NOT EXISTS ai_usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  model_id TEXT NOT NULL,
  model_provider TEXT NOT NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  provider_cost_usd NUMERIC(10, 6) NOT NULL DEFAULT 0,
  markup_usd NUMERIC(10, 6) NOT NULL DEFAULT 0,
  user_charge_usd NUMERIC(10, 6) NOT NULL DEFAULT 0,
  feature_type TEXT NOT NULL, -- 'chat', 'vision', 'video'
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_ai_usage_analytics_user_id ON ai_usage_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_analytics_model_id ON ai_usage_analytics(model_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_analytics_created_at ON ai_usage_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_analytics_feature_type ON ai_usage_analytics(feature_type);

-- Create view for usage summary by user
CREATE OR REPLACE VIEW user_ai_usage_summary AS
SELECT 
  user_id,
  model_id,
  model_provider,
  feature_type,
  COUNT(*) as request_count,
  SUM(total_tokens) as total_tokens,
  SUM(provider_cost_usd) as total_provider_cost,
  SUM(markup_usd) as total_markup,
  SUM(user_charge_usd) as total_user_charge,
  DATE_TRUNC('day', created_at) as usage_date
FROM ai_usage_analytics
GROUP BY user_id, model_id, model_provider, feature_type, DATE_TRUNC('day', created_at);

-- Create view for model popularity
CREATE OR REPLACE VIEW model_popularity AS
SELECT 
  model_id,
  model_provider,
  COUNT(*) as usage_count,
  COUNT(DISTINCT user_id) as unique_users,
  SUM(total_tokens) as total_tokens,
  SUM(user_charge_usd) as total_revenue,
  AVG(user_charge_usd) as avg_cost_per_request
FROM ai_usage_analytics
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY model_id, model_provider
ORDER BY usage_count DESC;

-- Create view for revenue analytics
CREATE OR REPLACE VIEW ai_revenue_analytics AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  model_provider,
  COUNT(*) as requests,
  SUM(provider_cost_usd) as provider_costs,
  SUM(markup_usd) as profit,
  SUM(user_charge_usd) as revenue,
  ROUND((SUM(markup_usd) / NULLIF(SUM(provider_cost_usd), 0) * 100)::numeric, 2) as profit_margin_percent
FROM ai_usage_analytics
GROUP BY DATE_TRUNC('day', created_at), model_provider
ORDER BY date DESC, revenue DESC;
