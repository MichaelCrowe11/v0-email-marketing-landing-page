-- Advanced Mushroom Species Database with Michael Crowe's Expertise
-- Comprehensive species information for cultivation optimization

CREATE TABLE IF NOT EXISTS mushroom_species_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  common_name TEXT NOT NULL,
  scientific_name TEXT NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  optimal_temp_min NUMERIC(4,1),
  optimal_temp_max NUMERIC(4,1),
  optimal_humidity_min NUMERIC(4,1),
  optimal_humidity_max NUMERIC(4,1),
  optimal_co2_ppm INTEGER,
  light_requirements TEXT,
  substrate_preferences JSONB,
  growth_characteristics JSONB,
  common_contaminants JSONB,
  harvest_indicators TEXT[],
  medicinal_properties JSONB,
  culinary_notes TEXT,
  market_value TEXT,
  yield_expectations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert comprehensive species data based on Michael Crowe's 20+ years expertise
INSERT INTO mushroom_species_library (
  common_name, scientific_name, difficulty_level,
  optimal_temp_min, optimal_temp_max,
  optimal_humidity_min, optimal_humidity_max,
  optimal_co2_ppm, light_requirements,
  substrate_preferences, growth_characteristics,
  common_contaminants, harvest_indicators,
  medicinal_properties, culinary_notes, market_value, yield_expectations
) VALUES
(
  'Oyster Mushroom',
  'Pleurotus ostreatus',
  'beginner',
  55.0, 75.0,
  85.0, 95.0,
  800,
  'Low to moderate indirect light (500-1000 lux)',
  '{"primary": ["straw", "hardwood sawdust", "coffee grounds"], "supplementation": ["wheat bran", "soy hulls"], "spawn_rate": "5-10%"}'::jsonb,
  '{"colonization_days": "10-14", "pinning_days": "3-5", "fruiting_days": "5-7", "flush_count": "3-4", "growth_rate": "fast"}'::jsonb,
  '{"common": ["trichoderma", "cobweb mold"], "prevention": "proper pasteurization, good air exchange"}'::jsonb,
  ARRAY['caps flatten and curl upward', 'gills fully developed', 'spore drop begins', 'stems firm but not woody'],
  '{"compounds": ["beta-glucans", "lovastatin"], "benefits": ["immune support", "cholesterol reduction", "antioxidant"]}'::jsonb,
  'Mild, slightly sweet flavor. Excellent sautéed, grilled, or in soups. Tender texture.',
  'high',
  '{"biological_efficiency": "75-125%", "yield_per_lb": "0.75-1.25 lbs", "market_price_per_lb": "$8-12"}'::jsonb
),
(
  'Shiitake',
  'Lentinula edodes',
  'intermediate',
  55.0, 75.0,
  80.0, 90.0,
  1000,
  'Moderate indirect light (1000-1500 lux) for quality caps',
  '{"primary": ["oak logs", "hardwood sawdust blocks"], "supplementation": ["wheat bran", "rice bran"], "spawn_rate": "10-15%"}'::jsonb,
  '{"colonization_days": "60-90", "pinning_days": "7-14", "fruiting_days": "7-10", "flush_count": "2-3", "growth_rate": "slow to moderate"}'::jsonb,
  '{"common": ["trichoderma", "bacterial blotch"], "prevention": "proper sterilization, controlled humidity"}'::jsonb,
  ARRAY['caps 50-80% open', 'veil just breaking', 'edges still curled under', 'firm texture'],
  '{"compounds": ["lentinan", "eritadenine", "vitamin D"], "benefits": ["immune modulation", "cardiovascular health", "anti-tumor"]}'::jsonb,
  'Rich umami flavor, meaty texture. Excellent dried or fresh. Popular in Asian cuisine.',
  'very high',
  '{"biological_efficiency": "60-100%", "yield_per_lb": "0.6-1.0 lbs", "market_price_per_lb": "$12-18"}'::jsonb
),
(
  'Lion''s Mane',
  'Hericium erinaceus',
  'intermediate',
  65.0, 75.0,
  85.0, 95.0,
  600,
  'Low light (300-500 lux) prevents yellowing',
  '{"primary": ["hardwood sawdust", "supplemented sawdust"], "supplementation": ["wheat bran", "oat bran"], "spawn_rate": "10-15%"}'::jsonb,
  '{"colonization_days": "14-21", "pinning_days": "5-7", "fruiting_days": "7-10", "flush_count": "2-3", "growth_rate": "moderate"}'::jsonb,
  '{"common": ["bacterial contamination", "yellowing from light"], "prevention": "low light, high humidity, good FAE"}'::jsonb,
  ARRAY['spines 1-2 cm long', 'pure white color', 'firm texture', 'before yellowing begins'],
  '{"compounds": ["hericenones", "erinacines"], "benefits": ["cognitive support", "nerve regeneration", "neuroprotective"]}'::jsonb,
  'Seafood-like flavor, often compared to lobster or crab. Tender, stringy texture.',
  'very high',
  '{"biological_efficiency": "50-75%", "yield_per_lb": "0.5-0.75 lbs", "market_price_per_lb": "$15-25"}'::jsonb
),
(
  'Reishi',
  'Ganoderma lucidum',
  'advanced',
  75.0, 85.0,
  90.0, 95.0,
  1500,
  'Low to moderate light for antler formation',
  '{"primary": ["hardwood sawdust", "supplemented blocks"], "supplementation": ["wheat bran", "gypsum"], "spawn_rate": "15-20%"}'::jsonb,
  '{"colonization_days": "21-30", "pinning_days": "7-14", "fruiting_days": "30-60", "flush_count": "1-2", "growth_rate": "slow"}'::jsonb,
  '{"common": ["trichoderma", "bacterial soft rot"], "prevention": "sterile technique, proper air exchange"}'::jsonb,
  ARRAY['caps fully formed', 'white growth edge stops', 'glossy surface develops', 'spore release begins'],
  '{"compounds": ["triterpenes", "polysaccharides", "ganoderic acids"], "benefits": ["immune modulation", "stress adaptation", "liver support"]}'::jsonb,
  'Not culinary - medicinal only. Bitter taste. Used for teas, tinctures, and extracts.',
  'high',
  '{"biological_efficiency": "40-60%", "yield_per_lb": "0.4-0.6 lbs", "market_price_per_lb": "$20-40"}'::jsonb
),
(
  'King Oyster',
  'Pleurotus eryngii',
  'intermediate',
  50.0, 65.0,
  85.0, 90.0,
  1000,
  'Moderate light (1000-1500 lux) for thick stems',
  '{"primary": ["hardwood sawdust", "supplemented sawdust"], "supplementation": ["wheat bran", "soy hulls"], "spawn_rate": "10-15%"}'::jsonb,
  '{"colonization_days": "14-21", "pinning_days": "5-7", "fruiting_days": "10-14", "flush_count": "2-3", "growth_rate": "moderate"}'::jsonb,
  '{"common": ["overlay", "bacterial blotch"], "prevention": "proper FAE, humidity control"}'::jsonb,
  ARRAY['stems thick and firm', 'caps 2-4 inches', 'before spore drop', 'stems still white'],
  '{"compounds": ["ergothioneine", "beta-glucans"], "benefits": ["antioxidant", "immune support", "anti-inflammatory"]}'::jsonb,
  'Meaty texture, mild flavor. Excellent grilled or roasted. Holds shape well in cooking.',
  'very high',
  '{"biological_efficiency": "70-100%", "yield_per_lb": "0.7-1.0 lbs", "market_price_per_lb": "$10-16"}'::jsonb
),
(
  'Turkey Tail',
  'Trametes versicolor',
  'beginner',
  65.0, 75.0,
  80.0, 90.0,
  1200,
  'Moderate to high light for color development',
  '{"primary": ["hardwood logs", "hardwood sawdust"], "supplementation": ["wheat bran"], "spawn_rate": "10-15%"}'::jsonb,
  '{"colonization_days": "21-30", "pinning_days": "7-10", "fruiting_days": "14-21", "flush_count": "multiple", "growth_rate": "moderate"}'::jsonb,
  '{"common": ["competing fungi"], "prevention": "proper substrate preparation"}'::jsonb,
  ARRAY['multiple color zones visible', 'leathery texture', 'white growing edge', 'before hardening'],
  '{"compounds": ["PSK", "PSP", "polysaccharides"], "benefits": ["immune support", "anti-cancer research", "gut health"]}'::jsonb,
  'Not culinary - medicinal only. Used for teas, tinctures, and extracts.',
  'high',
  '{"biological_efficiency": "50-80%", "yield_per_lb": "0.5-0.8 lbs", "market_price_per_lb": "$15-30"}'::jsonb
),
(
  'Chestnut Mushroom',
  'Pholiota adiposa',
  'intermediate',
  55.0, 65.0,
  85.0, 90.0,
  900,
  'Low to moderate light',
  '{"primary": ["hardwood sawdust", "supplemented blocks"], "supplementation": ["wheat bran", "gypsum"], "spawn_rate": "10-15%"}'::jsonb,
  '{"colonization_days": "14-21", "pinning_days": "5-7", "fruiting_days": "7-10", "flush_count": "2-3", "growth_rate": "moderate"}'::jsonb,
  '{"common": ["trichoderma", "overlay"], "prevention": "proper FAE, temperature control"}'::jsonb,
  ARRAY['caps 1-2 inches', 'golden brown color', 'firm texture', 'before veil breaks'],
  '{"compounds": ["beta-glucans", "antioxidants"], "benefits": ["immune support", "antioxidant"]}'::jsonb,
  'Nutty, earthy flavor. Firm texture. Excellent in stir-fries and soups.',
  'medium',
  '{"biological_efficiency": "60-80%", "yield_per_lb": "0.6-0.8 lbs", "market_price_per_lb": "$8-14"}'::jsonb
);

-- Create substrate recipes table
CREATE TABLE IF NOT EXISTS substrate_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_name TEXT NOT NULL,
  species_compatibility TEXT[],
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  ingredients JSONB NOT NULL,
  preparation_steps TEXT[],
  sterilization_method TEXT,
  sterilization_duration INTEGER,
  moisture_content_target NUMERIC(4,1),
  ph_target NUMERIC(3,1),
  notes TEXT,
  success_rate NUMERIC(4,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert proven substrate recipes
INSERT INTO substrate_recipes (
  recipe_name, species_compatibility, difficulty_level,
  ingredients, preparation_steps, sterilization_method,
  sterilization_duration, moisture_content_target, ph_target,
  notes, success_rate
) VALUES
(
  'Master''s Mix (Hardwood Sawdust)',
  ARRAY['Oyster Mushroom', 'Lion''s Mane', 'Shiitake', 'King Oyster'],
  'intermediate',
  '{"hardwood_sawdust": "50%", "soy_hulls": "50%", "gypsum": "1-2%", "water": "to field capacity"}'::jsonb,
  ARRAY[
    'Mix dry ingredients thoroughly',
    'Add water gradually to achieve 60-65% moisture',
    'Fill bags and seal',
    'Sterilize at 15 PSI for 2.5 hours',
    'Cool to room temperature before inoculation'
  ],
  'pressure cooker',
  150,
  62.5,
  6.5,
  'Michael Crowe''s go-to recipe. Excellent for most gourmet species. High nutrition supports multiple flushes.',
  95.0
),
(
  'Straw Substrate (Pasteurized)',
  ARRAY['Oyster Mushroom', 'King Oyster'],
  'beginner',
  '{"chopped_straw": "100%", "hydrated_lime": "optional 1%", "water": "to saturation"}'::jsonb,
  ARRAY[
    'Chop straw to 2-4 inch pieces',
    'Submerge in 160-170°F water for 1-2 hours',
    'Drain and cool to 75°F',
    'Squeeze to 65-70% moisture',
    'Inoculate immediately'
  ],
  'hot water pasteurization',
  90,
  67.5,
  7.0,
  'Simple and effective for oyster mushrooms. Lower cost, faster colonization. Best for 1-2 flushes.',
  90.0
),
(
  'Supplemented Sawdust Block',
  ARRAY['Shiitake', 'Lion''s Mane', 'Reishi', 'Chestnut Mushroom'],
  'advanced',
  '{"hardwood_sawdust": "78%", "wheat_bran": "20%", "gypsum": "2%", "water": "to field capacity"}'::jsonb,
  ARRAY[
    'Mix all dry ingredients',
    'Add water to 58-62% moisture',
    'Pack tightly into bags',
    'Sterilize at 15 PSI for 3 hours',
    'Cool completely before inoculation'
  ],
  'pressure cooker',
  180,
  60.0,
  6.0,
  'High-nutrition formula for demanding species. Requires sterile technique. Excellent yields.',
  92.0
),
(
  'Coffee Grounds Substrate',
  ARRAY['Oyster Mushroom'],
  'beginner',
  '{"spent_coffee_grounds": "100%", "spawn": "10-20%"}'::jsonb,
  ARRAY[
    'Collect fresh spent coffee grounds (within 24 hours)',
    'No pasteurization needed if fresh',
    'Mix with spawn immediately',
    'Pack into containers',
    'Colonize at room temperature'
  ],
  'none (pre-sterilized)',
  0,
  65.0,
  6.5,
  'Beginner-friendly, no sterilization needed. Use fresh grounds only. Fast colonization.',
  85.0
);

-- Create contamination troubleshooting table
CREATE TABLE IF NOT EXISTS contamination_guide (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contaminant_name TEXT NOT NULL,
  visual_description TEXT,
  color_indicators TEXT[],
  smell_indicators TEXT,
  growth_pattern TEXT,
  common_causes TEXT[],
  prevention_methods TEXT[],
  treatment_options TEXT[],
  severity_level TEXT CHECK (severity_level IN ('low', 'moderate', 'high', 'critical')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert contamination identification guide
INSERT INTO contamination_guide (
  contaminant_name, visual_description, color_indicators,
  smell_indicators, growth_pattern, common_causes,
  prevention_methods, treatment_options, severity_level
) VALUES
(
  'Trichoderma (Green Mold)',
  'Fast-growing mold that starts white then turns green',
  ARRAY['white initially', 'bright green', 'dark green when sporulating'],
  'Musty, moldy smell',
  'Circular patches, spreads rapidly, overtakes mycelium',
  ARRAY['incomplete sterilization', 'contaminated spawn', 'poor air quality', 'high humidity'],
  ARRAY['proper sterilization (15 PSI, 2.5+ hours)', 'clean workspace', 'quality spawn', 'good air filtration'],
  ARRAY['remove immediately', 'isolate from other cultures', 'increase sterilization time', 'check spawn quality'],
  'critical'
),
(
  'Cobweb Mold',
  'Wispy, gray mold that grows very fast',
  ARRAY['light gray', 'white-gray', 'fluffy appearance'],
  'Musty smell',
  'Spreads in wispy strands, very fast growth (visible in hours)',
  ARRAY['poor air exchange', 'high humidity', 'stagnant air', 'contaminated casing'],
  ARRAY['increase FAE', 'maintain proper humidity', 'use clean casing materials'],
  ARRAY['spray with hydrogen peroxide 3%', 'increase air exchange', 'remove affected areas'],
  'high'
),
(
  'Bacterial Blotch',
  'Wet, slimy spots on mushrooms or substrate',
  ARRAY['yellow-brown', 'dark brown', 'wet appearance'],
  'Sour, rotten smell',
  'Wet spots that spread, causes mushroom discoloration',
  ARRAY['excess moisture', 'poor ventilation', 'contaminated water', 'high temperature'],
  ARRAY['proper humidity control', 'good air circulation', 'clean water source', 'temperature management'],
  ARRAY['reduce humidity', 'increase FAE', 'remove affected mushrooms', 'improve air circulation'],
  'moderate'
),
(
  'Lipstick Mold',
  'Pink to red mold, often on grain spawn',
  ARRAY['pink', 'red', 'salmon colored'],
  'Sweet, fruity smell',
  'Circular colonies, often on grain',
  ARRAY['incomplete sterilization', 'contaminated grain', 'moisture issues'],
  ARRAY['proper sterilization', 'quality grain preparation', 'moisture control'],
  ARRAY['discard contaminated spawn', 'increase sterilization time', 'check grain moisture'],
  'high'
),
(
  'Aspergillus (Black Mold)',
  'Black or dark colored mold',
  ARRAY['black', 'dark gray', 'dark green'],
  'Strong musty smell',
  'Powdery appearance, spreads in patches',
  ARRAY['poor sterilization', 'contaminated air', 'old substrate materials'],
  ARRAY['proper sterilization', 'air filtration', 'fresh materials', 'clean environment'],
  ARRAY['discard immediately', 'do not open indoors', 'improve sterilization', 'check air quality'],
  'critical'
);

-- Create growth stage tracking table
CREATE TABLE IF NOT EXISTS growth_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_name TEXT NOT NULL,
  stage_order INTEGER NOT NULL,
  typical_duration_days INTEGER,
  temperature_range TEXT,
  humidity_range TEXT,
  light_requirements TEXT,
  co2_requirements TEXT,
  key_indicators TEXT[],
  common_issues TEXT[],
  success_tips TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert growth stage information
INSERT INTO growth_stages (
  stage_name, stage_order, typical_duration_days,
  temperature_range, humidity_range, light_requirements,
  co2_requirements, key_indicators, common_issues, success_tips
) VALUES
(
  'Inoculation',
  1,
  1,
  '70-75°F',
  '60-70%',
  'None required',
  'Normal air',
  ARRAY['clean workspace', 'sterile technique', 'proper spawn distribution'],
  ARRAY['contamination from poor technique', 'too much or too little spawn'],
  ARRAY['work quickly but carefully', 'use 5-10% spawn rate', 'seal bags immediately']
),
(
  'Colonization',
  2,
  14,
  '70-75°F',
  '60-70%',
  'None required (darkness preferred)',
  'Normal air (5000+ ppm OK)',
  ARRAY['white mycelium growth', 'substrate warming', 'consolidation'],
  ARRAY['slow colonization', 'contamination', 'stalled growth'],
  ARRAY['maintain consistent temperature', 'avoid disturbing bags', 'check for contamination daily']
),
(
  'Pinning Initiation',
  3,
  7,
  '55-65°F',
  '90-95%',
  'Introduce light (12 hours/day)',
  'Reduce to 800-1200 ppm',
  ARRAY['tiny pin formation', 'hyphal knots', 'primordia development'],
  ARRAY['no pins forming', 'overlay', 'uneven pinning'],
  ARRAY['drop temperature 5-10°F', 'increase FAE', 'increase humidity', 'introduce light']
),
(
  'Fruiting',
  4,
  7,
  '60-70°F',
  '85-95%',
  'Moderate light (12 hours/day)',
  'Maintain 800-1200 ppm',
  ARRAY['rapid mushroom growth', 'cap development', 'stem elongation'],
  ARRAY['leggy mushrooms', 'small caps', 'premature opening'],
  ARRAY['maintain high humidity', 'ensure good FAE', 'monitor CO2 levels', 'avoid temperature swings']
),
(
  'Harvest',
  5,
  1,
  '60-70°F',
  '85-90%',
  'Maintain light cycle',
  'Maintain 800-1200 ppm',
  ARRAY['caps opening', 'veil breaking', 'spore drop imminent'],
  ARRAY['harvesting too early or late', 'damage during harvest'],
  ARRAY['harvest before spore drop', 'twist and pull gently', 'harvest entire cluster', 'clean substrate surface']
),
(
  'Rest Period',
  6,
  7,
  '65-70°F',
  '70-80%',
  'Reduced light',
  'Normal air',
  ARRAY['mycelium recovery', 'substrate consolidation'],
  ARRAY['contamination during rest', 'drying out'],
  ARRAY['reduce humidity slightly', 'maintain air exchange', 'allow mycelium to recover', 'prepare for next flush']
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_species_difficulty ON mushroom_species_library(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_species_common_name ON mushroom_species_library(common_name);
CREATE INDEX IF NOT EXISTS idx_substrate_compatibility ON substrate_recipes USING GIN(species_compatibility);
CREATE INDEX IF NOT EXISTS idx_contamination_severity ON contamination_guide(severity_level);
CREATE INDEX IF NOT EXISTS idx_growth_stage_order ON growth_stages(stage_order);

-- Add helpful views
CREATE OR REPLACE VIEW beginner_friendly_species AS
SELECT 
  common_name,
  scientific_name,
  optimal_temp_min,
  optimal_temp_max,
  optimal_humidity_min,
  optimal_humidity_max,
  substrate_preferences->>'primary' as substrates,
  growth_characteristics->>'colonization_days' as colonization_time,
  culinary_notes,
  yield_expectations->>'biological_efficiency' as expected_yield
FROM mushroom_species_library
WHERE difficulty_level = 'beginner'
ORDER BY common_name;

CREATE OR REPLACE VIEW high_value_species AS
SELECT 
  common_name,
  scientific_name,
  difficulty_level,
  market_value,
  yield_expectations->>'market_price_per_lb' as price_per_lb,
  medicinal_properties,
  culinary_notes
FROM mushroom_species_library
WHERE market_value IN ('high', 'very high')
ORDER BY market_value DESC, common_name;
