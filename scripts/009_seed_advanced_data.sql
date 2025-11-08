-- Seed Advanced Cultivation Data

-- Insert strains for popular species
WITH oyster_species AS (
  SELECT id FROM species WHERE common_name = 'Oyster Mushroom' LIMIT 1
),
lions_mane_species AS (
  SELECT id FROM species WHERE common_name = 'Lion''s Mane' LIMIT 1
),
shiitake_species AS (
  SELECT id FROM species WHERE common_name = 'Shiitake' LIMIT 1
)
INSERT INTO strains (species_id, name, code, origin, characteristics, growth_speed, yield_potential, contamination_resistance, notes) VALUES
-- Oyster strains
((SELECT id FROM oyster_species), 'Blue Oyster', 'PO-BLUE-01', 'Europe', 'Beautiful blue-gray caps, cold-tolerant, excellent for beginners', 'fast', 'high', 'high', 'Best strain for beginners, very forgiving'),
((SELECT id FROM oyster_species), 'Pearl Oyster', 'PO-PEARL-01', 'Asia', 'White to cream colored, heat-tolerant, consistent yields', 'fast', 'very high', 'high', 'Great for warm climates'),
((SELECT id FROM oyster_species), 'Golden Oyster', 'PO-GOLD-01', 'Asia', 'Bright yellow caps, delicate flavor, requires higher temps', 'very fast', 'high', 'medium', 'Fastest growing oyster variety'),
((SELECT id FROM oyster_species), 'Pink Oyster', 'PO-PINK-01', 'Tropical', 'Vibrant pink color, tropical species, fast growing', 'very fast', 'high', 'medium', 'Requires 75-85°F, stunning appearance'),

-- Lion's Mane strains
((SELECT id FROM lions_mane_species), 'Standard Lion''s Mane', 'HE-STD-01', 'North America', 'Classic white pom-pom appearance, reliable producer', 'medium', 'medium', 'medium', 'Most common commercial strain'),
((SELECT id FROM lions_mane_species), 'Coral Tooth', 'HE-CORAL-01', 'Asia', 'More branched structure, slightly faster growth', 'medium', 'high', 'medium', 'Alternative morphology, same species'),

-- Shiitake strains
((SELECT id FROM shiitake_species), 'WR46', 'LE-WR46-01', 'Japan', 'Wide range strain, 45-80°F fruiting, reliable', 'medium', 'high', 'high', 'Industry standard for beginners'),
((SELECT id FROM shiitake_species), '3782', 'LE-3782-01', 'Japan', 'Warm weather strain, 55-75°F, fast colonization', 'fast', 'high', 'high', 'Best for warmer climates'),
((SELECT id FROM shiitake_species), 'Cold Weather', 'LE-COLD-01', 'Japan', 'Cold-tolerant, 45-65°F fruiting, winter production', 'slow', 'medium', 'very high', 'Excellent for outdoor logs')
ON CONFLICT DO NOTHING;

-- Insert sample cultivation recipes
WITH oyster_species AS (
  SELECT id FROM species WHERE common_name = 'Oyster Mushroom' LIMIT 1
),
blue_oyster_strain AS (
  SELECT id FROM strains WHERE code = 'PO-BLUE-01' LIMIT 1
)
INSERT INTO cultivation_recipes (name, species_id, strain_id, difficulty_level, substrate_recipe, environmental_params, timeline, expected_yield, success_rate, is_public) VALUES
(
  'Beginner Blue Oyster on Straw',
  (SELECT id FROM oyster_species),
  (SELECT id FROM blue_oyster_strain),
  'beginner',
  '{"substrate": "wheat straw", "supplementation": "none", "spawn_rate": "5%", "moisture": "60-65%", "preparation": "pasteurization at 160-180F for 90 minutes"}'::jsonb,
  '{"colonization": {"temp": "70-75F", "humidity": "60-70%", "light": "none", "fae": "minimal"}, "fruiting": {"temp": "55-65F", "humidity": "85-95%", "light": "indirect 12h/day", "fae": "4-8 exchanges/hour"}}'::jsonb,
  '{"inoculation": "day 0", "full_colonization": "10-14 days", "pinning": "14-17 days", "first_harvest": "21-28 days", "second_flush": "35-42 days"}'::jsonb,
  '20-25% biological efficiency per flush, 2-3 flushes total',
  92.5,
  true
),
(
  'Advanced Shiitake on Supplemented Sawdust',
  (SELECT id FROM species WHERE common_name = 'Shiitake' LIMIT 1),
  (SELECT id FROM strains WHERE code = 'LE-WR46-01' LIMIT 1),
  'advanced',
  '{"substrate": "hardwood sawdust", "supplementation": "10% wheat bran", "spawn_rate": "10%", "moisture": "55-60%", "preparation": "sterilization at 15 PSI for 2.5 hours"}'::jsonb,
  '{"colonization": {"temp": "70-75F", "humidity": "60-70%", "light": "none", "fae": "minimal"}, "fruiting": {"temp": "55-65F", "humidity": "80-90%", "light": "indirect 12h/day", "fae": "moderate"}}'::jsonb,
  '{"inoculation": "day 0", "full_colonization": "45-60 days", "cold_shock": "60-65 days", "pinning": "70-75 days", "first_harvest": "80-90 days"}'::jsonb,
  '15-20% biological efficiency per flush, 3-4 flushes over 6 months',
  85.0,
  true
);

-- Insert sample suppliers
INSERT INTO suppliers (name, category, contact_email, website, products_offered, rating, is_verified, notes) VALUES
('Mushroom Mountain', 'Spawn & Cultures', 'info@mushroommountain.com', 'https://mushroommountain.com', ARRAY['spawn', 'cultures', 'growing supplies'], 4.8, true, 'Excellent quality spawn, fast shipping'),
('Field & Forest Products', 'Equipment & Supplies', 'info@fieldforest.net', 'https://fieldforest.net', ARRAY['equipment', 'spawn', 'tools', 'books'], 4.7, true, 'Comprehensive product line, great for commercial growers'),
('Out-Grow', 'Spawn & Cultures', 'info@out-grow.com', 'https://out-grow.com', ARRAY['spawn', 'cultures', 'kits'], 4.6, true, 'Organic certified spawn, specialty strains'),
('Fungi Perfecti', 'Spawn & Education', 'myco@fungi.com', 'https://fungi.com', ARRAY['spawn', 'cultures', 'books', 'supplements'], 4.9, true, 'Paul Stamets company, premium quality'),
('North Spore', 'Complete Supplies', 'hello@northspore.com', 'https://northspore.com', ARRAY['spawn', 'kits', 'equipment', 'education'], 4.7, true, 'Great for beginners, excellent customer service')
ON CONFLICT DO NOTHING;
