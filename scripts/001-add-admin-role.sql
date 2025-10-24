-- Add is_admin column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create index for faster admin checks
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);

-- Set michael@crowelogic.com as admin
UPDATE users 
SET is_admin = TRUE 
WHERE email = 'michael@crowelogic.com';

-- If the user doesn't exist yet, this will be set when they sign up
-- You can also manually insert the user if needed:
-- INSERT INTO users (id, email, is_admin, created_at, updated_at)
-- VALUES (gen_random_uuid(), 'michael@crowelogic.com', TRUE, NOW(), NOW())
-- ON CONFLICT (email) DO UPDATE SET is_admin = TRUE;
