-- Create function to increment document view count
CREATE OR REPLACE FUNCTION increment_document_views(document_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.documents
  SET view_count = view_count + 1
  WHERE id = document_id;
END;
$$;
