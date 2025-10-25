-- Direct admin access grant for michael@crowelogic.com
-- This script can be run multiple times safely

DO $$
DECLARE
    v_user_id uuid;
BEGIN
    -- Get or create user ID
    SELECT id INTO v_user_id FROM users WHERE email = 'michael@crowelogic.com';
    
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'User michael@crowelogic.com not found. Please sign up first.';
    ELSE
        -- Grant admin access
        UPDATE users 
        SET 
            is_admin = TRUE,
            subscription_tier = 'expert',
            subscription_status = 'active',
            subscription_expires_at = NOW() + INTERVAL '100 years',
            updated_at = NOW()
        WHERE id = v_user_id;
        
        -- Ensure unlimited quotas
        INSERT INTO usage_quotas (
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
        ) VALUES (
            v_user_id,
            'expert',
            999999,
            0,
            999999,
            0,
            999999,
            0,
            999999,
            0,
            NOW() + INTERVAL '100 years'
        )
        ON CONFLICT (user_id) DO UPDATE SET
            subscription_tier = 'expert',
            chat_messages_quota = 999999,
            crowe_vision_quota = 999999,
            video_studio_quota = 999999,
            gpt_modules_quota = 999999,
            quota_reset_at = NOW() + INTERVAL '100 years',
            updated_at = NOW();
        
        RAISE NOTICE 'Admin access granted successfully to michael@crowelogic.com';
    END IF;
END $$;

-- Verify the setup
SELECT 
    email,
    is_admin,
    subscription_tier,
    subscription_status,
    subscription_expires_at
FROM users 
WHERE email = 'michael@crowelogic.com';
