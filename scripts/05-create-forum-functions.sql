-- Create function to increment post view count
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.forum_posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$;
