-- Setup admin account for michael@crowelogic.com
-- Run this AFTER signing up through the UI

-- Update user to admin with Expert tier access
UPDATE users 
SET 
  is_admin = TRUE,
  subscription_tier = 'expert',
  subscription_status = 'active',
  subscription_start_date = NOW(),
  subscription_end_date = NOW() + INTERVAL '100 years' -- Lifetime access
WHERE email = 'michael@crowelogic.com';

-- Create or update usage quotas with unlimited access
INSERT INTO usage_quotas (
  user_id,
  ai_messages_limit,
  crowe_vision_limit,
  video_generations_limit,
  reset_date
)
SELECT 
  id,
  999999, -- Unlimited messages
  999999, -- Unlimited Crowe Vision
  999999, -- Unlimited video generations
  NOW() + INTERVAL '100 years'
FROM users 
WHERE email = 'michael@crowelogic.com'
ON CONFLICT (user_id) DO UPDATE SET
  ai_messages_limit = 999999,
  crowe_vision_limit = 999999,
  video_generations_limit = 999999,
  reset_date = NOW() + INTERVAL '100 years',
  updated_at = NOW();

-- Verify admin setup
SELECT 
  email,
  is_admin,
  subscription_tier,
  subscription_status,
  subscription_start_date
FROM users 
WHERE email = 'michael@crowelogic.com';
