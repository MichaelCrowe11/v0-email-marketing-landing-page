-- Enhanced SOPs Library with Michael Crowe's Proven Techniques
-- Comprehensive standard operating procedures for professional cultivation

-- Add more detailed columns to existing SOPs table
ALTER TABLE sops ADD COLUMN IF NOT EXISTS equipment_needed TEXT[];
ALTER TABLE sops ADD COLUMN IF NOT EXISTS safety_precautions TEXT[];
ALTER TABLE sops ADD COLUMN IF NOT EXISTS success_metrics JSONB;
ALTER TABLE sops ADD COLUMN IF NOT EXISTS common_mistakes TEXT[];
ALTER TABLE sops ADD COLUMN IF NOT EXISTS pro_tips TEXT[];
ALTER TABLE sops ADD COLUMN IF NOT EXISTS related_sops UUID[];

-- Insert comprehensive SOPs based on Michael Crowe's expertise
INSERT INTO sops (
  title, category, difficulty_level, estimated_time,
  content, equipment_needed, safety_precautions,
  success_rate, is_premium
) VALUES
(
  'Sterile Technique Mastery',
  'fundamentals',
  'beginner',
  '30 minutes',
  E'# Sterile Technique Mastery\n\n## Overview\nProper sterile technique is the foundation of successful mushroom cultivation. This SOP covers the essential practices that prevent contamination.\n\n## Workspace Preparation\n1. Clean all surfaces with 70% isopropyl alcohol\n2. Allow alcohol to evaporate completely\n3. Set up still air box or flow hood\n4. Organize all materials within reach\n5. Minimize air movement in the room\n\n## Personal Preparation\n1. Wash hands thoroughly with antibacterial soap\n2. Wear clean clothes or lab coat\n3. Tie back long hair\n4. Wear face mask to prevent breath contamination\n5. Spray gloves with 70% alcohol\n\n## During Inoculation\n1. Work quickly but carefully\n2. Flame sterilize tools between uses\n3. Keep lids/covers on when not actively working\n4. Never reach over open containers\n5. Minimize talking and movement\n\n## Post-Inoculation\n1. Seal all containers immediately\n2. Label with date and species\n3. Clean workspace thoroughly\n4. Dispose of waste properly\n5. Monitor for contamination daily\n\n## Key Success Factors\n- Speed matters: work efficiently to minimize exposure\n- Consistency: follow the same routine every time\n- Environment: control air movement and cleanliness\n- Tools: keep everything sterile and organized',
  ARRAY['70% isopropyl alcohol', 'still air box or flow hood', 'alcohol lamp or torch', 'sterile gloves', 'face mask'],
  ARRAY['Use 70% alcohol, not higher concentrations', 'Allow flame-sterilized tools to cool before use', 'Never spray alcohol near open flames', 'Work in well-ventilated area'],
  95.0,
  false
),
(
  E'Substrate Preparation: Master\'s Mix',
  'substrate',
  'intermediate',
  '3-4 hours',
  E'# Master\'s Mix Substrate Preparation\n\n## Overview\nMaster\'s Mix is a high-performance substrate combining hardwood sawdust and soy hulls. Developed through years of commercial cultivation experience.\n\n## Ingredients (for 5 lb block)\n- 2.5 lbs hardwood sawdust (oak, maple, or beech)\n- 2.5 lbs soy hulls\n- 0.1 lbs gypsum (2% by weight)\n- Water to achieve 60-65% moisture\n\n## Preparation Steps\n\n### 1. Dry Mixing (15 minutes)\n- Combine sawdust and soy hulls in large container\n- Add gypsum and mix thoroughly\n- Break up any clumps\n- Ensure even distribution\n\n### 2. Hydration (30 minutes)\n- Add water gradually while mixing\n- Target: 60-65% moisture content\n- Test: squeeze handful - few drops, holds shape\n- Let sit 15 minutes, recheck moisture\n\n### 3. Bagging (30 minutes)\n- Use filter patch bags (0.5 micron)\n- Pack substrate firmly but not too tight\n- Fill to 80% capacity\n- Fold and seal bags\n\n### 4. Sterilization (2.5 hours)\n- Load into pressure cooker\n- Sterilize at 15 PSI for 2.5 hours\n- Allow natural pressure release\n- Cool to room temperature (8-12 hours)\n\n### 5. Inoculation\n- Work in sterile environment\n- Use 5-10% spawn rate\n- Mix spawn throughout or layer\n- Seal immediately',
  ARRAY['large mixing container', 'scale', 'filter patch bags', 'pressure cooker', 'moisture meter (optional)'],
  ARRAY['Pressure cooker can be dangerous - follow manufacturer instructions', 'Allow complete cooling before opening', 'Wear heat-resistant gloves when handling', 'Ensure proper ventilation during sterilization'],
  90.0,
  false
),
(
  'Environmental Control: Fruiting Chamber Setup',
  'environment',
  'intermediate',
  '2-3 hours',
  E'# Fruiting Chamber Setup and Management\n\n## Overview\nA properly configured fruiting chamber is essential for consistent, high-quality yields. This SOP covers setup and daily management.\n\n## Chamber Types\n\n### Shotgun Fruiting Chamber (SGFC) - Beginner\n- Clear plastic tote with holes\n- Perlite humidity layer\n- Manual misting\n- Best for: small scale, learning\n\n### Martha Tent - Intermediate\n- Wire shelving with plastic cover\n- Ultrasonic humidifier\n- Fan for air exchange\n- Best for: home cultivation, multiple species\n\n### Commercial Chamber - Advanced\n- Insulated room\n- HVAC system\n- Automated controls\n- Best for: production scale',
  ARRAY['wire shelving', 'plastic sheeting', 'humidifier', 'fan', 'hygrometer', 'thermometer', 'timer', 'LED lights'],
  ARRAY['Keep electrical components away from water', 'Use GFCI outlets near water', 'Ensure proper ventilation to prevent CO2 buildup', 'Clean humidifier weekly to prevent bacteria'],
  88.0,
  false
);

-- Create SOP categories view
CREATE OR REPLACE VIEW sop_categories_summary AS
SELECT 
  category,
  COUNT(*) as sop_count,
  COUNT(*) FILTER (WHERE difficulty_level = 'beginner') as beginner_count,
  COUNT(*) FILTER (WHERE difficulty_level = 'intermediate') as intermediate_count,
  COUNT(*) FILTER (WHERE difficulty_level = 'advanced') as advanced_count,
  COUNT(*) FILTER (WHERE is_premium = true) as premium_count,
  AVG(view_count) as avg_views
FROM sops
GROUP BY category
ORDER BY sop_count DESC;
