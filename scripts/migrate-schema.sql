-- Migration: Align Supabase schema with frontend page expectations
-- Run in Supabase SQL Editor

-- ============================================================
-- 1. SPECIES LIBRARY - Add missing columns for frontend
-- ============================================================
ALTER TABLE species_library ADD COLUMN IF NOT EXISTS optimal_temp_min INTEGER;
ALTER TABLE species_library ADD COLUMN IF NOT EXISTS optimal_temp_max INTEGER;
ALTER TABLE species_library ADD COLUMN IF NOT EXISTS optimal_humidity_min INTEGER;
ALTER TABLE species_library ADD COLUMN IF NOT EXISTS optimal_humidity_max INTEGER;
ALTER TABLE species_library ADD COLUMN IF NOT EXISTS growth_characteristics JSONB;
ALTER TABLE species_library ADD COLUMN IF NOT EXISTS market_value TEXT;
ALTER TABLE species_library ADD COLUMN IF NOT EXISTS yield_expectations JSONB;
ALTER TABLE species_library ADD COLUMN IF NOT EXISTS culinary_notes TEXT;

-- Fix difficulty_level CHECK to accept lowercase (frontend uses lowercase)
ALTER TABLE species_library DROP CONSTRAINT IF EXISTS species_library_difficulty_level_check;
ALTER TABLE species_library ADD CONSTRAINT species_library_difficulty_level_check
  CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert', 'Beginner', 'Intermediate', 'Advanced', 'Expert'));

-- ============================================================
-- 2. CONTAMINATION LIBRARY - Rename 'name' to 'contaminant_name'
-- ============================================================
ALTER TABLE contamination_library RENAME COLUMN name TO contaminant_name;

-- Fix severity_level CHECK to accept lowercase
ALTER TABLE contamination_library DROP CONSTRAINT IF EXISTS contamination_library_severity_level_check;
ALTER TABLE contamination_library ADD CONSTRAINT contamination_library_severity_level_check
  CHECK (severity_level IN ('low', 'medium', 'high', 'critical', 'Low', 'Medium', 'High', 'Critical'));

-- ============================================================
-- 3. SOP TEMPLATES - Add missing columns
-- ============================================================
ALTER TABLE sop_templates ADD COLUMN IF NOT EXISTS success_metrics JSONB;
ALTER TABLE sop_templates ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Fix difficulty_level CHECK to accept lowercase
ALTER TABLE sop_templates DROP CONSTRAINT IF EXISTS sop_templates_difficulty_level_check;
ALTER TABLE sop_templates ADD CONSTRAINT sop_templates_difficulty_level_check
  CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert', 'Beginner', 'Intermediate', 'Advanced', 'Expert'));
