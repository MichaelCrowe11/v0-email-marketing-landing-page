-- Enhanced SOPs Library with Michael Crowe's Proven Techniques
-- Comprehensive standard operating procedures for professional cultivation

-- Add more detailed columns to existing SOPs table
ALTER TABLE sops ADD COLUMN IF NOT EXISTS equipment_needed JSONB;
ALTER TABLE sops ADD COLUMN IF NOT EXISTS safety_precautions TEXT[];
ALTER TABLE sops ADD COLUMN IF NOT EXISTS success_metrics JSONB;
ALTER TABLE sops ADD COLUMN IF NOT EXISTS common_mistakes TEXT[];
ALTER TABLE sops ADD COLUMN IF NOT EXISTS pro_tips TEXT[];
ALTER TABLE sops ADD COLUMN IF NOT EXISTS related_sops UUID[];

-- Insert comprehensive SOPs based on Michael Crowe's expertise
INSERT INTO sops (
  title, category, difficulty_level, estimated_time,
  content, equipment_needed, safety_precautions,
  success_metrics, common_mistakes, pro_tips, is_premium
) VALUES
(
  'Sterile Technique Mastery',
  'Fundamentals',
  'beginner',
  '30 minutes',
  E'# Sterile Technique Mastery\n\n## Overview\nProper sterile technique is the foundation of successful mushroom cultivation. This SOP covers the essential practices that prevent contamination.\n\n## Workspace Preparation\n1. Clean all surfaces with 70% isopropyl alcohol\n2. Allow alcohol to evaporate completely\n3. Set up still air box or flow hood\n4. Organize all materials within reach\n5. Minimize air movement in the room\n\n## Personal Preparation\n1. Wash hands thoroughly with antibacterial soap\n2. Wear clean clothes or lab coat\n3. Tie back long hair\n4. Wear face mask to prevent breath contamination\n5. Spray gloves with 70% alcohol\n\n## During Inoculation\n1. Work quickly but carefully\n2. Flame sterilize tools between uses\n3. Keep lids/covers on when not actively working\n4. Never reach over open containers\n5. Minimize talking and movement\n\n## Post-Inoculation\n1. Seal all containers immediately\n2. Label with date and species\n3. Clean workspace thoroughly\n4. Dispose of waste properly\n5. Monitor for contamination daily\n\n## Key Success Factors\n- Speed matters: work efficiently to minimize exposure\n- Consistency: follow the same routine every time\n- Environment: control air movement and cleanliness\n- Tools: keep everything sterile and organized',
  '{"required": ["70% isopropyl alcohol", "still air box or flow hood", "alcohol lamp or torch", "sterile gloves", "face mask"], "optional": ["UV light", "HEPA filter", "pressure cooker"]}'::jsonb,
  ARRAY['Use 70% alcohol, not higher concentrations', 'Allow flame-sterilized tools to cool before use', 'Never spray alcohol near open flames', 'Work in well-ventilated area'],
  '{"contamination_rate": "< 5%", "colonization_speed": "normal for species", "success_rate": "> 90%"}'::jsonb,
  ARRAY['Using 90%+ alcohol (less effective)', 'Not allowing tools to cool after flaming', 'Reaching over open containers', 'Working too slowly', 'Inadequate workspace cleaning'],
  ARRAY['Practice with agar plates first', 'Keep a contamination log to identify patterns', 'Batch your inoculations to maintain rhythm', 'Use a checklist until technique becomes automatic'],
  false
),
(
  'Substrate Preparation: Master''s Mix',
  'Substrate',
  'intermediate',
  '3-4 hours',
  E'# Master''s Mix Substrate Preparation\n\n## Overview\nMaster''s Mix is a high-performance substrate combining hardwood sawdust and soy hulls. Developed through years of commercial cultivation experience.\n\n## Ingredients (for 5 lb block)\n- 2.5 lbs hardwood sawdust (oak, maple, or beech)\n- 2.5 lbs soy hulls\n- 0.1 lbs gypsum (2% by weight)\n- Water to achieve 60-65% moisture\n\n## Preparation Steps\n\n### 1. Dry Mixing (15 minutes)\n- Combine sawdust and soy hulls in large container\n- Add gypsum and mix thoroughly\n- Break up any clumps\n- Ensure even distribution\n\n### 2. Hydration (30 minutes)\n- Add water gradually while mixing\n- Target: 60-65% moisture content\n- Test: squeeze handful - few drops, holds shape\n- Let sit 15 minutes, recheck moisture\n\n### 3. Bagging (30 minutes)\n- Use filter patch bags (0.5 micron)\n- Pack substrate firmly but not too tight\n- Fill to 80% capacity\n- Fold and seal bags\n\n### 4. Sterilization (2.5 hours)\n- Load into pressure cooker\n- Sterilize at 15 PSI for 2.5 hours\n- Allow natural pressure release\n- Cool to room temperature (8-12 hours)\n\n### 5. Inoculation\n- Work in sterile environment\n- Use 5-10% spawn rate\n- Mix spawn throughout or layer\n- Seal immediately\n\n## Quality Checks\n- Moisture: 60-65% (critical)\n- pH: 6.0-6.5 (optimal)\n- Texture: firm but not compacted\n- Color: natural wood color\n- Smell: fresh, earthy (no sour smell)\n\n## Troubleshooting\n- Too wet: add more dry ingredients\n- Too dry: add water gradually\n- Clumpy: mix more thoroughly\n- Sour smell: ingredients may be old',
  '{"required": ["large mixing container", "scale", "filter patch bags", "pressure cooker", "moisture meter (optional)"], "measuring": ["measuring cups", "scale accurate to 0.1 lb"]}'::jsonb,
  ARRAY['Pressure cooker can be dangerous - follow manufacturer instructions', 'Allow complete cooling before opening', 'Wear heat-resistant gloves when handling', 'Ensure proper ventilation during sterilization'],
  '{"colonization_time": "10-14 days", "contamination_rate": "< 3%", "biological_efficiency": "75-125%", "flush_count": "3-4"}'::jsonb,
  ARRAY['Incorrect moisture content (most common)', 'Insufficient sterilization time', 'Packing bags too tightly', 'Using old or moldy ingredients', 'Not cooling completely before inoculation'],
  ARRAY['Buy sawdust from hardwood mills, not construction sites', 'Soy hulls should be fresh and smell sweet', 'Gypsum helps with pH and structure', 'Consistent packing pressure = consistent results', 'Label bags with date and substrate batch number'],
  false
),
(
  'Environmental Control: Fruiting Chamber Setup',
  'Environment',
  'intermediate',
  '2-3 hours',
  E'# Fruiting Chamber Setup and Management\n\n## Overview\nA properly configured fruiting chamber is essential for consistent, high-quality yields. This SOP covers setup and daily management.\n\n## Chamber Types\n\n### Shotgun Fruiting Chamber (SGFC) - Beginner\n- Clear plastic tote with holes\n- Perlite humidity layer\n- Manual misting\n- Best for: small scale, learning\n\n### Martha Tent - Intermediate\n- Wire shelving with plastic cover\n- Ultrasonic humidifier\n- Fan for air exchange\n- Best for: home cultivation, multiple species\n\n### Commercial Chamber - Advanced\n- Insulated room\n- HVAC system\n- Automated controls\n- Best for: production scale\n\n## Setup: Martha Tent (Most Popular)\n\n### Materials Needed\n- Wire shelving unit (4-5 shelves)\n- Clear plastic sheeting or tent\n- Ultrasonic humidifier\n- Small fan (computer fan works)\n- Hygrometer/thermometer\n- Timer (for fan)\n- LED grow lights\n\n### Assembly Steps\n\n1. **Structure**\n   - Assemble wire shelving\n   - Cover with plastic sheeting\n   - Ensure bottom is sealed\n   - Leave access door\n\n2. **Humidity System**\n   - Place humidifier at bottom\n   - Direct mist upward\n   - Use distilled water\n   - Set to maintain 85-95% RH\n\n3. **Air Exchange**\n   - Mount fan near top\n   - Set timer: 5 min on, 25 min off\n   - Ensure gentle air movement\n   - Add passive air holes if needed\n\n4. **Lighting**\n   - Install LED strips on each shelf\n   - 6500K color temperature\n   - Timer: 12 hours on, 12 hours off\n   - 1000-1500 lux intensity\n\n5. **Monitoring**\n   - Place hygrometer at mid-height\n   - Check readings daily\n   - Keep log of conditions\n   - Adjust as needed\n\n## Daily Management\n\n### Morning Routine (10 minutes)\n- Check temperature (60-70°F target)\n- Check humidity (85-95% target)\n- Refill humidifier if needed\n- Inspect for contamination\n- Note any changes\n\n### Evening Routine (5 minutes)\n- Check humidity again\n- Adjust humidifier if needed\n- Check for harvest-ready mushrooms\n- Ensure lights are on schedule\n\n## Troubleshooting\n\n### Humidity Too Low\n- Run humidifier more frequently\n- Reduce air exchange\n- Check for leaks in chamber\n- Use larger humidifier\n\n### Humidity Too High\n- Increase air exchange\n- Reduce humidifier output\n- Check for standing water\n- Improve drainage\n\n### Temperature Issues\n- Move chamber to cooler/warmer location\n- Use heating mat or cooling fan\n- Insulate chamber if needed\n- Monitor ambient room temperature\n\n### Poor Mushroom Quality\n- Leggy stems: increase FAE\n- Small caps: check humidity\n- Slow growth: check temperature\n- Discoloration: check for contamination',
  '{"required": ["wire shelving", "plastic sheeting", "humidifier", "fan", "hygrometer", "thermometer", "timer", "LED lights"], "optional": ["heating mat", "dehumidifier", "CO2 monitor", "automated controller"]}'::jsonb,
  ARRAY['Keep electrical components away from water', 'Use GFCI outlets near water', 'Ensure proper ventilation to prevent CO2 buildup', 'Clean humidifier weekly to prevent bacteria'],
  '{"humidity_stability": "85-95% RH", "temperature_stability": "±3°F", "contamination_rate": "< 2%", "yield_consistency": "> 90%"}'::jsonb,
  ARRAY['Not monitoring conditions daily', 'Inconsistent air exchange', 'Using tap water in humidifier', 'Overcrowding the chamber', 'Neglecting cleaning and maintenance'],
  ARRAY['Keep a detailed log - patterns emerge over time', 'Start with fewer blocks until you dial in conditions', 'Each species may need slight adjustments', 'Invest in quality hygrometer - cheap ones are inaccurate', 'Clean and sanitize chamber between grows'],
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
