-- Mark specific SOPs and Species as free preview content
-- This allows non-subscribers to see sample content

-- Add is_free_preview column to SOPs if it doesn't exist
ALTER TABLE sops ADD COLUMN IF NOT EXISTS is_free_preview BOOLEAN DEFAULT false;

-- Mark one beginner SOP as free preview
UPDATE sops
SET is_free_preview = true
WHERE difficulty_level = 'beginner'
  AND category = 'fundamentals'
LIMIT 1;

-- If no beginner fundamental SOP exists, create one
INSERT INTO sops (
  id,
  title,
  content,
  category,
  difficulty_level,
  estimated_time,
  equipment_needed,
  safety_warnings,
  is_premium,
  is_free_preview,
  success_rate,
  view_count,
  created_at
)
SELECT
  '00000000-0000-0000-0000-000000000001',
  'Sterile Technique Basics',
  E'# Sterile Technique Basics\n\n## Overview\nSterile technique is the foundation of successful mushroom cultivation. This SOP covers essential practices for maintaining contamination-free environments.\n\n## Equipment Needed\n- Still air box or flow hood\n- 70% isopropyl alcohol\n- Gloves (nitrile recommended)\n- Face mask\n- Flame source (alcohol lamp or torch)\n\n## Procedure\n\n### 1. Workspace Preparation\n- Clean all surfaces with 70% isopropyl alcohol\n- Allow alcohol to evaporate completely\n- Minimize air movement in the room\n- Close windows and turn off fans\n\n### 2. Personal Preparation\n- Wash hands thoroughly with antibacterial soap\n- Put on clean gloves\n- Wear face mask to prevent breath contamination\n- Tie back long hair\n\n### 3. Tool Sterilization\n- Flame sterilize metal tools until red hot\n- Allow to cool for 10-15 seconds\n- Never touch sterile tools to non-sterile surfaces\n- Re-sterilize between each use\n\n### 4. Working in Still Air Box\n- Spray interior with alcohol and wipe down\n- Wait 5 minutes for alcohol to evaporate\n- Work slowly and deliberately\n- Keep hands inside box at all times\n- Minimize arm movements to reduce air turbulence\n\n### 5. Common Mistakes to Avoid\n- Talking or breathing directly over open cultures\n- Touching sterile surfaces with contaminated gloves\n- Working too quickly and creating air currents\n- Not allowing alcohol to fully evaporate\n- Reusing contaminated materials\n\n## Success Metrics\n- Contamination rate: <5% for experienced practitioners\n- Typical learning curve: 10-20 attempts to master\n- Success rate improves dramatically with practice\n\n## Safety Warnings\n- Isopropyl alcohol is flammable - keep away from flames\n- Work in well-ventilated area\n- Never spray alcohol near open flames\n- Dispose of contaminated materials properly\n\n## Next Steps\nOnce you''ve mastered sterile technique, you''re ready to move on to:\n- Agar work and culture isolation\n- Grain spawn preparation\n- Substrate inoculation\n\nFor advanced sterile technique training and troubleshooting, upgrade to Pro access.',
  'fundamentals',
  'beginner',
  '30-45 minutes',
  ARRAY['Still air box', 'Isopropyl alcohol', 'Gloves', 'Face mask', 'Flame source'],
  ARRAY['Isopropyl alcohol is flammable', 'Work in ventilated area', 'Keep alcohol away from flames'],
  false,
  true,
  95.0,
  1247,
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM sops WHERE id = '00000000-0000-0000-0000-000000000001');

-- Add is_free_preview column to mushroom_species_library if it doesn't exist
ALTER TABLE mushroom_species_library ADD COLUMN IF NOT EXISTS is_free_preview BOOLEAN DEFAULT false;

-- Mark Blue Oyster as free preview (most beginner-friendly)
UPDATE mushroom_species_library
SET is_free_preview = true
WHERE common_name = 'Blue Oyster'
  OR common_name ILIKE '%oyster%'
LIMIT 1;

-- If no oyster species exists, create Blue Oyster as free preview
INSERT INTO mushroom_species_library (
  id,
  common_name,
  scientific_name,
  difficulty_level,
  optimal_temp_min,
  optimal_temp_max,
  optimal_humidity_min,
  optimal_humidity_max,
  optimal_co2_ppm,
  light_requirements,
  colonization_days,
  fruiting_days,
  fruiting_temp_min,
  fruiting_temp_max,
  substrate_preferences,
  growth_characteristics,
  yield_expectations,
  harvest_indicators,
  market_value,
  culinary_notes,
  medicinal_properties,
  common_contaminants,
  is_free_preview,
  created_at
)
SELECT
  '00000000-0000-0000-0000-000000000002',
  'Blue Oyster',
  'Pleurotus ostreatus var. columbinus',
  'beginner',
  65,
  75,
  85,
  95,
  800,
  'Indirect light, 500-1000 lux',
  14,
  7,
  55,
  65,
  '{"primary": ["hardwood sawdust", "straw", "coffee grounds"], "supplementation": "5-10% wheat bran or soy hulls"}'::jsonb,
  '{"colonization_days": 14, "fruiting_days": 7, "flush_cycle": "7-10 days between flushes", "total_flushes": "3-4 productive flushes"}'::jsonb,
  '{"biological_efficiency": "100-150%", "yield_per_block": "1-1.5 lbs per 5 lb block", "commercial_yield": "25-35 lbs per 100 lbs substrate"}'::jsonb,
  ARRAY['Caps begin to flatten', 'Edges start to curl upward', 'Before heavy spore drop', 'Firm texture when squeezed'],
  'medium',
  'Mild, slightly sweet flavor. Excellent for stir-fries, soups, and grilling. Meaty texture holds up well to cooking. Popular in Asian and European cuisine.',
  '{"immune_support": "Beta-glucans support immune function", "antioxidants": "High in ergothioneine", "cardiovascular": "May help reduce cholesterol"}'::jsonb,
  '{"trichoderma": "Green mold - most common", "bacterial_blotch": "Brown spots on caps", "cobweb_mold": "Fast-growing white mold"}'::jsonb,
  true,
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM mushroom_species_library WHERE id = '00000000-0000-0000-0000-000000000002');

-- Create a view for free preview content
CREATE OR REPLACE VIEW free_preview_content AS
SELECT 
  'sop' as content_type,
  id,
  title,
  category as type,
  difficulty_level,
  view_count,
  created_at
FROM sops
WHERE is_free_preview = true

UNION ALL

SELECT
  'species' as content_type,
  id,
  common_name as title,
  difficulty_level as type,
  difficulty_level,
  0 as view_count,
  created_at
FROM mushroom_species_library
WHERE is_free_preview = true;
