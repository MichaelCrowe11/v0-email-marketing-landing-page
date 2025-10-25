-- Create the AI user for @CroweLogic mentions
-- Changed UUID from 'ai-crowe-logic' to proper UUID format
INSERT INTO users (id, email, full_name, avatar_url, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  'ai@crowelogic.com',
  'CroweLogic AI',
  '/ai-avatar.png',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
