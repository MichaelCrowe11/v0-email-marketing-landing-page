-- Function to safely increment usage counters
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_field TEXT
)
RETURNS void AS $$
BEGIN
  EXECUTE format(
    'UPDATE usage_quotas SET %I = %I + 1, updated_at = NOW() WHERE user_id = $1',
    p_field, p_field
  ) USING p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
