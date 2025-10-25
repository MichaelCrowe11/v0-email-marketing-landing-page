-- Advanced Cultivation Data

-- Strain library (genetic variations within species)
CREATE TABLE IF NOT EXISTS strains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id UUID REFERENCES mushroom_species_library(id),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  origin TEXT,
  characteristics TEXT,
  growth_speed TEXT CHECK (growth_speed IN ('slow', 'medium', 'fast')),
  yield_potential TEXT CHECK (yield_potential IN ('low', 'medium', 'high', 'very high')),
  contamination_resistance TEXT CHECK (contamination_resistance IN ('low', 'medium', 'high')),
  notes TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cultivation recipes (complete grow protocols)
CREATE TABLE IF NOT EXISTS cultivation_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  species_id UUID REFERENCES mushroom_species_library(id),
  strain_id UUID REFERENCES strains(id),
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  substrate_recipe JSONB NOT NULL,
  environmental_params JSONB NOT NULL,
  timeline JSONB NOT NULL,
  expected_yield TEXT,
  success_rate DECIMAL(5,2),
  created_by UUID REFERENCES users(id),
  is_public BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  clone_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User grow logs (detailed cultivation journals)
CREATE TABLE IF NOT EXISTS grow_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  user_id UUID REFERENCES users(id),
  log_date DATE NOT NULL,
  growth_stage TEXT,
  observations TEXT,
  actions_taken TEXT,
  environmental_readings JSONB,
  photos TEXT[],
  issues_noted TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment inventory
CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  category TEXT,
  manufacturer TEXT,
  model TEXT,
  purchase_date DATE,
  purchase_price DECIMAL(10,2),
  maintenance_schedule TEXT,
  last_maintenance DATE,
  status TEXT CHECK (status IN ('active', 'maintenance', 'retired')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Supplier directory
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  address TEXT,
  products_offered TEXT[],
  rating DECIMAL(3,2),
  notes TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_strains_species ON strains(species_id);
CREATE INDEX IF NOT EXISTS idx_cultivation_recipes_species ON cultivation_recipes(species_id);
CREATE INDEX IF NOT EXISTS idx_grow_logs_project ON grow_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_grow_logs_date ON grow_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_equipment_user ON equipment(user_id);
