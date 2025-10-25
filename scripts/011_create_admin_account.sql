-- Create Administrator Account for michael@crowelogic.com
-- This script sets up a full admin account with Expert tier access

-- First, we need to ensure the user exists in Supabase Auth
-- You'll need to sign up at the login page first, then run this script

-- Update the user to admin status with Expert subscription
UPDATE public.users
SET 
  is_admin = true,
  subscription_tier = 'expert',
  subscription_status = 'active',
  subscription_expires_at = '2099-12-31'::timestamp,
  full_name = 'Michael Crowe',
  updated_at = NOW()
WHERE email = 'michael@crowelogic.com';

-- If the user doesn't exist yet, insert them
-- Note: This assumes the auth.users entry already exists from signup
INSERT INTO public.users (
  id,
  email,
  full_name,
  is_admin,
  subscription_tier,
  subscription_status,
  subscription_expires_at,
  created_at,
  updated_at
)
SELECT 
  id,
  'michael@crowelogic.com',
  'Michael Crowe',
  true,
  'expert',
  'active',
  '2099-12-31'::timestamp,
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'michael@crowelogic.com'
ON CONFLICT (id) DO NOTHING;

-- Create or update usage quotas with unlimited access
INSERT INTO public.usage_quotas (
  user_id,
  subscription_tier,
  chat_messages_quota,
  chat_messages_used,
  crowe_vision_quota,
  crowe_vision_used,
  video_studio_quota,
  video_studio_used,
  gpt_modules_quota,
  gpt_modules_used,
  quota_reset_at,
  created_at,
  updated_at
)
SELECT 
  u.id,
  'expert',
  999999, -- Unlimited chat messages
  0,
  999999, -- Unlimited Crowe Vision
  0,
  999999, -- Unlimited video studio
  0,
  999999, -- Unlimited GPT modules
  0,
  '2099-12-31'::timestamp,
  NOW(),
  NOW()
FROM public.users u
WHERE u.email = 'michael@crowelogic.com'
ON CONFLICT (user_id) 
DO UPDATE SET
  subscription_tier = 'expert',
  chat_messages_quota = 999999,
  crowe_vision_quota = 999999,
  video_studio_quota = 999999,
  gpt_modules_quota = 999999,
  quota_reset_at = '2099-12-31'::timestamp,
  updated_at = NOW();

-- Create a subscription record (optional, for tracking)
INSERT INTO public.user_subscriptions (
  user_id,
  plan_id,
  status,
  current_period_start,
  current_period_end,
  cancel_at_period_end,
  created_at,
  updated_at
)
SELECT 
  u.id,
  (SELECT id FROM subscription_plans WHERE plan_name = 'Expert Access' LIMIT 1),
  'active',
  NOW(),
  '2099-12-31'::timestamp,
  false,
  NOW(),
  NOW()
FROM public.users u
WHERE u.email = 'michael@crowelogic.com'
ON CONFLICT (user_id)
DO UPDATE SET
  status = 'active',
  current_period_end = '2099-12-31'::timestamp,
  cancel_at_period_end = false,
  updated_at = NOW();

-- Verify the admin account was created
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.is_admin,
  u.subscription_tier,
  u.subscription_status,
  uq.chat_messages_quota,
  uq.crowe_vision_quota,
  uq.video_studio_quota,
  uq.gpt_modules_quota
FROM public.users u
LEFT JOIN public.usage_quotas uq ON u.id = uq.user_id
WHERE u.email = 'michael@crowelogic.com';
