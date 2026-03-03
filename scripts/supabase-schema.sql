-- Supabase Schema for Crowe Logic AI Platform
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- Tables: species_library, contamination_library, sop_templates, knowledge_base
-- License-gated: is_premium flag controls access via RLS

-- ============================================================
-- 1. SPECIES LIBRARY
-- ============================================================
CREATE TABLE IF NOT EXISTS species_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  common_name TEXT NOT NULL,
  scientific_name TEXT NOT NULL,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  growth_time TEXT,
  substrate_types TEXT[],
  optimal_temp_fruiting TEXT,
  optimal_temp_incubation TEXT,
  humidity_range TEXT,
  market_value_per_lb TEXT,
  description TEXT,
  medicinal_properties TEXT,
  image_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. CONTAMINATION LIBRARY
-- ============================================================
CREATE TABLE IF NOT EXISTS contamination_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  scientific_name TEXT,
  category TEXT NOT NULL DEFAULT 'Mold',
  visual_description TEXT,
  color_indicators TEXT[],
  smell_indicators TEXT,
  growth_pattern TEXT,
  severity_level TEXT NOT NULL CHECK (severity_level IN ('Low', 'Medium', 'High', 'Critical')),
  common_causes TEXT[],
  prevention_methods TEXT[],
  treatment_options TEXT[],
  affected_stages TEXT[],
  image_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. SOP TEMPLATES
-- ============================================================
CREATE TABLE IF NOT EXISTS sop_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  estimated_time TEXT,
  content TEXT NOT NULL,
  equipment_needed TEXT[],
  safety_warnings TEXT[],
  success_rate DECIMAL(5,2),
  is_premium BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. KNOWLEDGE BASE
-- ============================================================
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  tags TEXT[],
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  is_premium BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_species_common_name ON species_library(common_name);
CREATE INDEX IF NOT EXISTS idx_species_difficulty ON species_library(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_contamination_severity ON contamination_library(severity_level);
CREATE INDEX IF NOT EXISTS idx_contamination_category ON contamination_library(category);
CREATE INDEX IF NOT EXISTS idx_sop_category ON sop_templates(category);
CREATE INDEX IF NOT EXISTS idx_sop_difficulty ON sop_templates(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_knowledge_slug ON knowledge_base(slug);
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_tags ON knowledge_base USING GIN(tags);

-- Full text search
CREATE INDEX IF NOT EXISTS idx_species_search ON species_library
  USING GIN(to_tsvector('english', common_name || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_knowledge_search ON knowledge_base
  USING GIN(to_tsvector('english', title || ' ' || content));
CREATE INDEX IF NOT EXISTS idx_sop_search ON sop_templates
  USING GIN(to_tsvector('english', title || ' ' || content));

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
-- Anon key: can only read non-premium (free) content
-- Service role key: bypasses RLS entirely (used in API routes after license check)

ALTER TABLE species_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE contamination_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE sop_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Species
CREATE POLICY "anon_read_free_species" ON species_library
  FOR SELECT TO anon USING (is_premium = false);

-- Contamination
CREATE POLICY "anon_read_free_contamination" ON contamination_library
  FOR SELECT TO anon USING (is_premium = false);

-- SOPs
CREATE POLICY "anon_read_free_sops" ON sop_templates
  FOR SELECT TO anon USING (is_premium = false);

-- Knowledge Base
CREATE POLICY "anon_read_free_knowledge" ON knowledge_base
  FOR SELECT TO anon USING (is_premium = false);
