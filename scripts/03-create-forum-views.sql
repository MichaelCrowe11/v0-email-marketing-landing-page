-- Create a view for forum posts with reply counts and like counts
CREATE OR REPLACE VIEW public.forum_posts_with_stats AS
SELECT 
  p.*,
  u.full_name as author_name,
  u.avatar_url as author_avatar,
  c.name as category_name,
  c.icon as category_icon,
  COUNT(DISTINCT r.id) as reply_count,
  COUNT(DISTINCT l.id) as like_count,
  MAX(COALESCE(r.created_at, p.created_at)) as last_activity
FROM public.forum_posts p
LEFT JOIN public.users u ON p.author_id = u.id
LEFT JOIN public.forum_categories c ON p.category_id = c.id
LEFT JOIN public.forum_replies r ON p.id = r.post_id
LEFT JOIN public.forum_likes l ON p.id = l.post_id
GROUP BY p.id, u.full_name, u.avatar_url, c.name, c.icon;

-- Create a view for forum replies with like counts
CREATE OR REPLACE VIEW public.forum_replies_with_stats AS
SELECT 
  r.*,
  u.full_name as author_name,
  u.avatar_url as author_avatar,
  COUNT(DISTINCT l.id) as like_count
FROM public.forum_replies r
LEFT JOIN public.users u ON r.author_id = u.id
LEFT JOIN public.forum_likes l ON r.id = l.reply_id
GROUP BY r.id, u.full_name, u.avatar_url;
