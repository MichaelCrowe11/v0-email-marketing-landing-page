-- Quick Admin Setup for michael@crowelogic.com
-- Run this after signing up through the UI

-- Step 1: Grant admin privileges and Expert subscription
UPDATE public.users
SET 
  is_admin = true,
  subscription_tier = 'expert',
  subscription_status = 'active',
  subscription_expires_at = '2099-12-31 23:59:59'::timestamp,
  full_name = COALESCE(full_name, 'Michael Crowe'),
  updated_at = NOW()
WHERE email = 'michael@crowelogic.com';

-- Step 2: Set unlimited quotas
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
  quota_reset_at
)
SELECT 
  id,
  'expert',
  999999,
  0,
  999999,
  0,
  999999,
  0,
  999999,
  0,
  '2099-12-31 23:59:59'::timestamp
FROM public.users
WHERE email = 'michael@crowelogic.com'
ON CONFLICT (user_id) 
DO UPDATE SET
  subscription_tier = 'expert',
  chat_messages_quota = 999999,
  crowe_vision_quota = 999999,
  video_studio_quota = 999999,
  gpt_modules_quota = 999999,
  quota_reset_at = '2099-12-31 23:59:59'::timestamp,
  updated_at = NOW();

-- Step 3: Verify admin setup
SELECT 
  email,
  full_name,
  is_admin,
  subscription_tier,
  subscription_status,
  subscription_expires_at
FROM public.users
WHERE email = 'michael@crowelogic.com';
