-- Verify all required tables exist and add any missing columns
-- This script ensures the database is ready for seed data

-- Add any missing columns to existing tables
ALTER TABLE mushroom_species_library 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS fruiting_temp_min NUMERIC,
ADD COLUMN IF NOT EXISTS fruiting_temp_max NUMERIC,
ADD COLUMN IF NOT EXISTS colonization_days INTEGER,
ADD COLUMN IF NOT EXISTS fruiting_days INTEGER;

ALTER TABLE sops
ADD COLUMN IF NOT EXISTS success_rate NUMERIC,
ADD COLUMN IF NOT EXISTS equipment_needed TEXT[],
ADD COLUMN IF NOT EXISTS safety_warnings TEXT[];

ALTER TABLE contamination_guide
ADD COLUMN IF NOT EXISTS affected_stages TEXT[];

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cultivation_projects_user_id ON cultivation_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_cultivation_projects_status ON cultivation_projects(status);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category_id ON forum_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author_id ON forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post_id ON forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_environmental_readings_project_id ON environmental_readings(project_id);
CREATE INDEX IF NOT EXISTS idx_growth_observations_project_id ON growth_observations(project_id);
CREATE INDEX IF NOT EXISTS idx_harvest_records_project_id ON harvest_records(project_id);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_forum_posts_search ON forum_posts USING gin(to_tsvector('english', title || ' ' || content));
CREATE INDEX IF NOT EXISTS idx_sops_search ON sops USING gin(to_tsvector('english', title || ' ' || content));
CREATE INDEX IF NOT EXISTS idx_species_search ON mushroom_species_library USING gin(to_tsvector('english', common_name || ' ' || scientific_name));
