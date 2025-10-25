-- Seed mushroom species library with Michael Crowe's 20+ years of cultivation expertise
-- Comprehensive data for beginner to advanced cultivators

-- Clear existing data (optional - remove if you want to keep existing data)
TRUNCATE TABLE mushroom_species_library CASCADE;

-- Insert comprehensive species data
INSERT INTO mushroom_species_library (
  id, scientific_name, common_name, difficulty_level, 
  optimal_temp_min, optimal_temp_max, fruiting_temp_min, fruiting_temp_max,
  optimal_humidity_min, optimal_humidity_max, optimal_co2_ppm,
  colonization_days, fruiting_days, light_requirements,
  substrate_preferences, growth_characteristics, common_contaminants,
  medicinal_properties, yield_expectations, harvest_indicators,
  market_value, culinary_notes, image_url
) VALUES
-- Oyster Mushrooms (Pleurotus ostreatus) - Beginner Friendly
(
  gen_random_uuid(),
  'Pleurotus ostreatus',
  'Blue Oyster Mushroom',
  'beginner', -- Changed from 'Beginner' to 'beginner'
  55, 75, 50, 65,
  85, 95, 800,
  7, 5, 'Indirect light 12h/day',
  '{"primary": ["Straw", "Hardwood sawdust", "Coffee grounds"], "supplemented": ["Soy hulls", "Wheat bran"]}'::jsonb,
  '{"growth_rate": "Fast", "flush_count": "3-4", "cluster_size": "Large", "stem_length": "Short"}'::jsonb,
  '{"common": ["Trichoderma", "Green mold"], "prevention": "Proper pasteurization, good air flow"}'::jsonb,
  '{"compounds": ["Beta-glucans", "Lovastatin"], "benefits": ["Immune support", "Cholesterol reduction"]}'::jsonb,
  '{"biological_efficiency": "75-125%", "yield_per_block": "1-2 lbs", "flushes": "3-4 over 6 weeks"}'::jsonb,
  ARRAY['Caps flatten and curl upward', 'Gills fully developed', 'Before spore drop'],
  '$8-12/lb wholesale, $15-20/lb retail',
  'Mild, slightly sweet flavor. Excellent sautéed or in stir-fries. Tender texture.',
  '/placeholder.svg?height=400&width=600'
),

-- Shiitake (Lentinula edodes) - Intermediate
(
  gen_random_uuid(),
  'Lentinula edodes',
  'Shiitake',
  'intermediate', -- Changed from 'Intermediate' to 'intermediate'
  55, 75, 50, 60,
  80, 90, 1000,
  14, 7, 'Indirect light 12h/day',
  '{"primary": ["Oak sawdust", "Hardwood logs"], "supplemented": ["Wheat bran", "Rice bran"]}'::jsonb,
  '{"growth_rate": "Medium", "flush_count": "2-3", "cluster_size": "Medium", "requires_cold_shock": true}'::jsonb,
  '{"common": ["Trichoderma", "Cobweb mold"], "prevention": "Proper sterilization, pH control"}'::jsonb,
  '{"compounds": ["Lentinan", "Eritadenine"], "benefits": ["Anti-tumor", "Cardiovascular health"]}'::jsonb,
  '{"biological_efficiency": "60-80%", "yield_per_block": "0.75-1.5 lbs", "flushes": "2-3 over 8 weeks"}'::jsonb,
  ARRAY['Caps 50-70% open', 'Veil just breaking', 'Firm texture'],
  '$12-16/lb wholesale, $18-25/lb retail',
  'Rich umami flavor. Meaty texture. Excellent dried or fresh.',
  '/placeholder.svg?height=400&width=600'
),

-- Lion's Mane (Hericium erinaceus) - Intermediate
(
  gen_random_uuid(),
  'Hericium erinaceus',
  E'Lion\'s Mane', -- Fixed escaping for single quote
  'intermediate',
  65, 75, 55, 65,
  85, 95, 500,
  10, 7, 'Low light preferred',
  '{"primary": ["Hardwood sawdust", "Supplemented sawdust"], "supplemented": ["Wheat bran", "Soy hulls"]}'::jsonb,
  '{"growth_rate": "Medium", "flush_count": "2-3", "cluster_size": "Single large fruit", "sensitive_to_co2": true}'::jsonb,
  '{"common": ["Bacterial blotch", "Trichoderma"], "prevention": "High humidity, good FAE"}'::jsonb,
  '{"compounds": ["Hericenones", "Erinacines"], "benefits": ["Cognitive function", "Nerve regeneration"]}'::jsonb,
  '{"biological_efficiency": "50-75%", "yield_per_block": "0.5-1 lb", "flushes": "2-3 over 6 weeks"}'::jsonb,
  ARRAY['Spines 1-2 inches long', 'Pure white color', 'Before yellowing'],
  '$15-20/lb wholesale, $25-35/lb retail',
  'Seafood-like flavor, similar to crab or lobster. Tender, stringy texture.',
  '/placeholder.svg?height=400&width=600'
),

-- Reishi (Ganoderma lucidum) - Advanced
(
  gen_random_uuid(),
  'Ganoderma lucidum',
  'Reishi',
  'advanced', -- Changed from 'Advanced' to 'advanced'
  70, 80, 65, 75,
  85, 95, 5000,
  21, 14, 'Indirect light 12h/day',
  '{"primary": ["Hardwood sawdust", "Supplemented sawdust"], "supplemented": ["Wheat bran", "Gypsum"]}'::jsonb,
  '{"growth_rate": "Slow", "flush_count": "1-2", "cluster_size": "Single or small clusters", "requires_high_co2": true}'::jsonb,
  '{"common": ["Trichoderma", "Bacterial contamination"], "prevention": "Sterile technique, proper humidity"}'::jsonb,
  '{"compounds": ["Triterpenes", "Polysaccharides"], "benefits": ["Immune modulation", "Anti-inflammatory", "Adaptogenic"]}'::jsonb,
  '{"biological_efficiency": "40-60%", "yield_per_block": "0.3-0.8 lbs", "flushes": "1-2 over 8 weeks"}'::jsonb,
  ARRAY['Cap fully formed', 'White growth edge stops', 'Glossy surface develops'],
  '$20-30/lb wholesale, $40-60/lb retail',
  'Not culinary - medicinal only. Bitter, woody taste. Used in teas and extracts.',
  '/placeholder.svg?height=400&width=600'
),

-- King Oyster (Pleurotus eryngii) - Intermediate
(
  gen_random_uuid(),
  'Pleurotus eryngii',
  'King Oyster',
  'intermediate',
  55, 65, 50, 60,
  85, 95, 800,
  10, 7, 'Indirect light 12h/day',
  '{"primary": ["Hardwood sawdust", "Straw"], "supplemented": ["Wheat bran", "Soy hulls"]}'::jsonb,
  '{"growth_rate": "Medium", "flush_count": "2-3", "cluster_size": "Individual large stems", "prefers_cooler_temps": true}'::jsonb,
  '{"common": ["Trichoderma", "Bacterial blotch"], "prevention": "Good air exchange, proper humidity"}'::jsonb,
  '{"compounds": ["Ergothioneine", "Beta-glucans"], "benefits": ["Antioxidant", "Immune support"]}'::jsonb,
  '{"biological_efficiency": "70-100%", "yield_per_block": "1-1.5 lbs", "flushes": "2-3 over 6 weeks"}'::jsonb,
  ARRAY['Thick white stems', 'Small tan caps', 'Firm texture'],
  '$10-14/lb wholesale, $16-22/lb retail',
  'Meaty texture, mild flavor. Excellent grilled or roasted. Holds shape well.',
  '/placeholder.svg?height=400&width=600'
),

-- Pink Oyster (Pleurotus djamor) - Beginner
(
  gen_random_uuid(),
  'Pleurotus djamor',
  'Pink Oyster',
  'beginner',
  65, 85, 65, 80,
  85, 95, 800,
  5, 3, 'Indirect light 12h/day',
  '{"primary": ["Straw", "Hardwood sawdust"], "supplemented": ["Soy hulls", "Wheat bran"]}'::jsonb,
  '{"growth_rate": "Very fast", "flush_count": "2-3", "cluster_size": "Large", "heat_tolerant": true}'::jsonb,
  '{"common": ["Trichoderma", "Bacterial blotch"], "prevention": "Good air flow, proper pasteurization"}'::jsonb,
  '{"compounds": ["Beta-glucans", "Antioxidants"], "benefits": ["Immune support", "Anti-inflammatory"]}'::jsonb,
  '{"biological_efficiency": "80-120%", "yield_per_block": "1-2 lbs", "flushes": "2-3 over 4 weeks"}'::jsonb,
  ARRAY['Bright pink color', 'Caps flatten', 'Before color fades'],
  '$12-16/lb wholesale, $20-28/lb retail',
  'Delicate flavor, slightly woody. Best cooked immediately. Vibrant color.',
  '/placeholder.svg?height=400&width=600'
),

-- Chestnut (Pholiota adiposa) - Intermediate
(
  gen_random_uuid(),
  'Pholiota adiposa',
  'Chestnut Mushroom',
  'intermediate',
  55, 65, 45, 55,
  85, 90, 1000,
  12, 7, 'Low light preferred',
  '{"primary": ["Hardwood sawdust", "Supplemented sawdust"], "supplemented": ["Wheat bran", "Rice bran"]}'::jsonb,
  '{"growth_rate": "Medium", "flush_count": "2-3", "cluster_size": "Clusters", "prefers_cooler_temps": true}'::jsonb,
  '{"common": ["Trichoderma", "Cobweb mold"], "prevention": "Proper sterilization, cool temperatures"}'::jsonb,
  '{"compounds": ["Beta-glucans", "Polysaccharides"], "benefits": ["Immune support", "Antioxidant"]}'::jsonb,
  '{"biological_efficiency": "60-80%", "yield_per_block": "0.8-1.2 lbs", "flushes": "2-3 over 6 weeks"}'::jsonb,
  ARRAY['Brown caps fully formed', 'Veil intact', 'Firm texture'],
  '$10-14/lb wholesale, $16-24/lb retail',
  'Nutty, earthy flavor. Firm texture. Excellent in soups and stews.',
  '/placeholder.svg?height=400&width=600'
);

-- Update beginner_friendly_species view data
INSERT INTO beginner_friendly_species (
  scientific_name, common_name, substrates, 
  colonization_time, optimal_temp_min, optimal_temp_max,
  optimal_humidity_min, optimal_humidity_max,
  expected_yield, culinary_notes
)
SELECT 
  scientific_name, common_name,
  substrate_preferences->>'primary' as substrates,
  colonization_days || ' days' as colonization_time,
  optimal_temp_min, optimal_temp_max,
  optimal_humidity_min, optimal_humidity_max,
  yield_expectations->>'yield_per_block' as expected_yield,
  culinary_notes
FROM mushroom_species_library
WHERE difficulty_level = 'beginner' -- Changed from 'Beginner' to 'beginner'
ON CONFLICT DO NOTHING;

-- Update high_value_species view data
INSERT INTO high_value_species (
  scientific_name, common_name, difficulty_level,
  market_value, price_per_lb, medicinal_properties, culinary_notes
)
SELECT 
  scientific_name, common_name, difficulty_level,
  market_value,
  SPLIT_PART(market_value, ',', 2) as price_per_lb,
  medicinal_properties,
  culinary_notes
FROM mushroom_species_library
WHERE market_value LIKE '%$15%' OR market_value LIKE '%$20%' OR market_value LIKE '%$25%'
ON CONFLICT DO NOTHING;
