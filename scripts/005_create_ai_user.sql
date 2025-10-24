-- Create the AI user for @CroweLogic mentions
INSERT INTO users (id, email, full_name, avatar_url, created_at, updated_at)
VALUES (
  'ai-crowe-logic',
  'ai@crowelogic.com',
  'CroweLogic AI',
  '/ai-avatar.png',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
