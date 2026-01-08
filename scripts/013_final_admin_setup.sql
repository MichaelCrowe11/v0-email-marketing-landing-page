-- Final Admin Setup for Crowe Mycology
-- Run this script after deploying to set up Michael Crowe as admin

-- Step 1: Ensure the users table has admin columns
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(50) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP;

-- Step 2: Create or update admin user
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
VALUES (
  gen_random_uuid(),
  'michael@crowelogic.com',
  'Michael Crowe',
  true,
  'master',
  'active',
  '2099-12-31 23:59:59'::timestamp,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  is_admin = true,
  full_name = COALESCE(EXCLUDED.full_name, public.users.full_name, 'Michael Crowe'),
  subscription_tier = 'master',
  subscription_status = 'active',
  subscription_expires_at = '2099-12-31 23:59:59'::timestamp,
  updated_at = NOW();

-- Step 3: Create usage_quotas table if not exists
CREATE TABLE IF NOT EXISTS public.usage_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  subscription_tier VARCHAR(50) DEFAULT 'free',
  chat_messages_quota INTEGER DEFAULT 50,
  chat_messages_used INTEGER DEFAULT 0,
  crowe_vision_quota INTEGER DEFAULT 5,
  crowe_vision_used INTEGER DEFAULT 0,
  video_studio_quota INTEGER DEFAULT 0,
  video_studio_used INTEGER DEFAULT 0,
  gpt_modules_quota INTEGER DEFAULT 0,
  gpt_modules_used INTEGER DEFAULT 0,
  quota_reset_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Step 4: Set unlimited quotas for admin
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
  'master',
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
ON CONFLICT (user_id) DO UPDATE SET
  subscription_tier = 'master',
  chat_messages_quota = 999999,
  crowe_vision_quota = 999999,
  video_studio_quota = 999999,
  gpt_modules_quota = 999999,
  quota_reset_at = '2099-12-31 23:59:59'::timestamp,
  updated_at = NOW();

-- Step 5: Verify setup
SELECT 
  u.email,
  u.full_name,
  u.is_admin,
  u.subscription_tier,
  u.subscription_status,
  q.chat_messages_quota,
  q.crowe_vision_quota
FROM public.users u
LEFT JOIN public.usage_quotas q ON u.id = q.user_id
WHERE u.email = 'michael@crowelogic.com';
