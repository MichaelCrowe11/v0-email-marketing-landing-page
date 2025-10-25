-- Seed sample cultivation projects with realistic environmental data
-- Demonstrates various stages of cultivation with monitoring data

-- Create a demo user if not exists (for sample data)
INSERT INTO users (id, email, full_name, subscription_tier, subscription_status, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'demo@crowelogic.ai',
  'Demo Cultivator',
  'premium',
  'active',
  NOW() - INTERVAL '6 months',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Sample Project 1: Blue Oyster - Active/Fruiting
INSERT INTO cultivation_projects (
  id, user_id, project_name, mushroom_species, substrate_type,
  status, inoculation_date, expected_harvest_date,
  location, container_type, notes, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Blue Oyster Batch #12',
  'Blue Oyster Mushroom',
  'Straw with wheat bran supplement',
  'fruiting',
  CURRENT_DATE - INTERVAL '14 days',
  CURRENT_DATE + INTERVAL '3 days',
  'Fruiting Chamber A',
  '5lb grow bag',
  'Excellent colonization. First flush showing great promise. Maintaining 90% humidity.',
  NOW() - INTERVAL '14 days',
  NOW()
) RETURNING id AS project_id_1 \gset

-- Environmental readings for Blue Oyster project (last 7 days)
INSERT INTO environmental_readings (project_id, temperature, humidity, co2_level, light_level, recorded_at, created_at)
SELECT 
  :'project_id_1'::uuid,
  62 + (random() * 6)::numeric, -- 62-68°F
  88 + (random() * 7)::numeric, -- 88-95%
  600 + (random() * 400)::numeric, -- 600-1000 ppm
  300 + (random() * 200)::numeric, -- 300-500 lux
  NOW() - (interval '1 hour' * generate_series),
  NOW() - (interval '1 hour' * generate_series)
FROM generate_series(0, 168, 2); -- Every 2 hours for 7 days

-- Growth observations for Blue Oyster
INSERT INTO growth_observations (project_id, observation_date, growth_stage, observation_notes, created_at, updated_at)
VALUES
  (:'project_id_1'::uuid, CURRENT_DATE - 14, 'inoculation', 'Inoculated 5lb bag with liquid culture. Clean injection points.', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),
  (:'project_id_1'::uuid, CURRENT_DATE - 10, 'colonization', '30% colonization visible. Mycelium looks healthy and white.', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  (:'project_id_1'::uuid, CURRENT_DATE - 7, 'colonization', '75% colonized. Strong mycelial growth. No contamination detected.', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
  (:'project_id_1'::uuid, CURRENT_DATE - 3, 'pinning', 'First pins forming! Moved to fruiting chamber. Increased FAE.', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  (:'project_id_1'::uuid, CURRENT_DATE - 1, 'fruiting', 'Pins developing into small clusters. Beautiful blue color emerging.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- Sample Project 2: Shiitake - Colonizing
INSERT INTO cultivation_projects (
  id, user_id, project_name, mushroom_species, substrate_type,
  status, inoculation_date, expected_harvest_date,
  location, container_type, notes, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Shiitake Log Cultivation',
  'Shiitake',
  'Oak sawdust with wheat bran',
  'colonizing',
  CURRENT_DATE - INTERVAL '21 days',
  CURRENT_DATE + INTERVAL '14 days',
  'Incubation Room B',
  'Supplemented sawdust block',
  'Slow but steady colonization. Typical for shiitake. Will cold shock when fully colonized.',
  NOW() - INTERVAL '21 days',
  NOW()
) RETURNING id AS project_id_2 \gset

-- Environmental readings for Shiitake
INSERT INTO environmental_readings (project_id, temperature, humidity, co2_level, recorded_at, created_at)
SELECT 
  :'project_id_2'::uuid,
  68 + (random() * 5)::numeric, -- 68-73°F
  75 + (random() * 10)::numeric, -- 75-85%
  800 + (random() * 400)::numeric, -- 800-1200 ppm
  NOW() - (interval '3 hours' * generate_series),
  NOW() - (interval '3 hours' * generate_series)
FROM generate_series(0, 168, 3);

-- Growth observations for Shiitake
INSERT INTO growth_observations (project_id, observation_date, growth_stage, observation_notes, created_at, updated_at)
VALUES
  (:'project_id_2'::uuid, CURRENT_DATE - 21, 'inoculation', 'Inoculated supplemented sawdust block. Sterile technique maintained.', NOW() - INTERVAL '21 days', NOW() - INTERVAL '21 days'),
  (:'project_id_2'::uuid, CURRENT_DATE - 14, 'colonization', '40% colonized. Mycelium spreading steadily from inoculation points.', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),
  (:'project_id_2'::uuid, CURRENT_DATE - 7, 'colonization', '70% colonized. Dense white mycelium. Preparing for cold shock soon.', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

-- Sample Project 3: Lion's Mane - Completed with Harvest
INSERT INTO cultivation_projects (
  id, user_id, project_name, mushroom_species, substrate_type,
  status, inoculation_date, expected_harvest_date, actual_harvest_date,
  location, container_type, notes, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001'::uuid,
  E'Lion\'s Mane Premium Batch', -- Fixed escaping for single quote
  E'Lion\'s Mane',
  'Supplemented hardwood sawdust',
  'completed',
  CURRENT_DATE - INTERVAL '45 days',
  CURRENT_DATE - INTERVAL '10 days',
  CURRENT_DATE - INTERVAL '8 days',
  'Fruiting Chamber C',
  '5lb supplemented block',
  'Excellent results! Two flushes with great quality. Total yield exceeded expectations.',
  NOW() - INTERVAL '45 days',
  NOW()
) RETURNING id AS project_id_3 \gset

-- Harvest records for Lion's Mane
INSERT INTO harvest_records (project_id, harvest_date, flush_number, wet_weight, dry_weight, quality_rating, notes, created_at, updated_at)
VALUES
  (:'project_id_3'::uuid, CURRENT_DATE - 8, 1, 1.2, 0.12, 5, 'Beautiful large fruit body. Perfect white color. Harvested at optimal size.', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
  (:'project_id_3'::uuid, CURRENT_DATE - 2, 2, 0.8, 0.08, 4, 'Second flush smaller but still high quality. Excellent spines.', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

-- Sample Project 4: Pink Oyster - Contaminated (learning example)
INSERT INTO cultivation_projects (
  id, user_id, project_name, mushroom_species, substrate_type,
  status, inoculation_date,
  location, container_type, notes, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Pink Oyster Test Batch',
  'Pink Oyster',
  'Straw pasteurized',
  'contaminated',
  CURRENT_DATE - INTERVAL '10 days',
  'Incubation Room A',
  'Bucket grow',
  'Green mold detected at day 7. Likely insufficient pasteurization. Disposed of properly.',
  NOW() - INTERVAL '10 days',
  NOW()
);

-- Sample Project 5: King Oyster - Planning
INSERT INTO cultivation_projects (
  id, user_id, project_name, mushroom_species, substrate_type,
  status, inoculation_date, expected_harvest_date,
  location, container_type, notes, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001'::uuid,
  'King Oyster Spring Batch',
  'King Oyster',
  'Hardwood sawdust with soy hulls',
  'planning',
  CURRENT_DATE + INTERVAL '5 days',
  CURRENT_DATE + INTERVAL '28 days',
  'Fruiting Chamber B',
  '3lb grow bag',
  'Preparing substrate this week. Will inoculate with grain spawn on schedule.',
  NOW(),
  NOW()
);
