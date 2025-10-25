-- Create or replace function to handle new user creation from auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, created_at, updated_at, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW(),
    -- Set is_admin to TRUE if email is michael@crowelogic.com
    CASE WHEN NEW.email = 'michael@crowelogic.com' THEN TRUE ELSE FALSE END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    updated_at = NOW(),
    is_admin = CASE WHEN EXCLUDED.email = 'michael@crowelogic.com' THEN TRUE ELSE users.is_admin END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sync any existing auth users that don't have a public.users record
INSERT INTO public.users (id, email, full_name, avatar_url, created_at, updated_at, is_admin)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  au.raw_user_meta_data->>'avatar_url',
  au.created_at,
  NOW(),
  CASE WHEN au.email = 'michael@crowelogic.com' THEN TRUE ELSE FALSE END
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE users.id = au.id)
ON CONFLICT (id) DO NOTHING;
