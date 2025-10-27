# Admin Account Setup for michael@crowelogic.com

## Quick Setup (3 Steps)

### Step 1: Sign Up
1. Go to your Crowe Logic AI platform
2. Navigate to `/auth/sign-up`
3. Sign up with email: `michael@crowelogic.com`
4. Verify your email if required

### Step 2: Run Admin Script
1. Go to Supabase Dashboard → SQL Editor
2. Open the file: `scripts/012_setup_admin_michael.sql`
3. Click "Run" to execute the script

### Step 3: Verify
Refresh your browser and you should now have:
- Admin badge/indicator in the UI
- Expert tier subscription (active until 2099)
- Unlimited quotas for all features
- Full access to all platform capabilities

## What the Script Does

The admin script:
1. Sets `is_admin = true` for your account
2. Grants Expert tier subscription (highest level)
3. Sets subscription to never expire (2099-12-31)
4. Creates unlimited usage quotas:
   - 999,999 chat messages
   - 999,999 Crowe Vision analyses
   - 999,999 video generations
   - 999,999 GPT module uses

## Verification Query

Run this to verify your admin status:

\`\`\`sql
SELECT 
  email,
  full_name,
  is_admin,
  subscription_tier,
  subscription_status,
  subscription_expires_at,
  uq.chat_messages_quota,
  uq.crowe_vision_quota
FROM public.users u
LEFT JOIN public.usage_quotas uq ON u.id = uq.user_id
WHERE email = 'michael@crowelogic.com';
\`\`\`

Expected result:
- `is_admin`: true
- `subscription_tier`: expert
- `subscription_status`: active
- `subscription_expires_at`: 2099-12-31
- All quotas: 999999

## Troubleshooting

**Issue:** Script returns "0 rows updated"
- **Solution:** Make sure you've signed up first at `/auth/sign-up`

**Issue:** Still seeing "Upgrade to Pro" messages
- **Solution:** Clear browser cache and refresh, or log out and log back in

**Issue:** Features still locked
- **Solution:** Check that the `usage_quotas` table has your entry with unlimited quotas
