-- Seed Standard Operating Procedures and Contamination Identification Guides
-- Based on Michael Crowe's 20+ years of professional cultivation experience

-- Clear existing data (optional)
TRUNCATE TABLE sops CASCADE;
TRUNCATE TABLE contamination_guide CASCADE;

-- Insert comprehensive SOPs
INSERT INTO sops (
  id, title, category, difficulty_level, estimated_time,
  content, equipment_needed, safety_warnings, success_rate,
  is_premium, view_count, created_at, updated_at
) VALUES
-- Sterile Technique SOP
(
  gen_random_uuid(),
  'Sterile Technique for Inoculation',
  'Sterile Technique',
  'Beginner',
  '30-45 minutes',
  E'# Sterile Technique for Inoculation\n\n## Overview\nProper sterile technique is the foundation of successful mushroom cultivation. This SOP covers the essential steps to maintain contamination-free inoculation.\n\n## Pre-Inoculation Preparation\n\n### Workspace Setup\n1. Clean work surface with 70% isopropyl alcohol\n2. Set up still air box (SAB) or flow hood\n3. Organize all materials within reach\n4. Minimize air movement in the room\n\n### Personal Preparation\n1. Wash hands thoroughly with antibacterial soap\n2. Wear clean clothes or lab coat\n3. Tie back long hair\n4. Wear face mask to prevent breath contamination\n5. Put on nitrile gloves and spray with alcohol\n\n## Inoculation Process\n\n### Step 1: Flame Sterilization\n- Heat inoculation needle/syringe tip until red hot\n- Allow to cool for 10 seconds (do not blow on it)\n- Repeat between each inoculation point\n\n### Step 2: Substrate Inoculation\n1. Wipe injection port with alcohol swab\n2. Insert needle at 45-degree angle\n3. Inject 1-2cc of culture per injection point\n4. Use 4-6 injection points per 5lb bag\n5. Seal injection ports with micropore tape\n\n### Step 3: Post-Inoculation\n1. Label bags with species, date, and batch number\n2. Move to incubation area immediately\n3. Dispose of used materials properly\n4. Clean workspace with alcohol\n\n## Common Mistakes to Avoid\n- Not flaming between injections\n- Injecting too much culture (causes wet rot)\n- Working in drafty areas\n- Touching sterile surfaces\n- Rushing the process\n\n## Success Indicators\n- White mycelial growth within 3-7 days\n- No off colors (green, black, pink)\n- No foul odors\n- Even colonization pattern\n\n## Troubleshooting\n**Slow colonization**: Check temperature, may need more inoculation points\n**Contamination at injection sites**: Improve flame sterilization technique\n**Wet spots**: Reduce inoculation volume',
  ARRAY['Still air box or flow hood', 'Isopropyl alcohol 70%', 'Alcohol lamp or torch', 'Nitrile gloves', 'Face mask', 'Micropore tape', 'Alcohol swabs'],
  ARRAY['Always work in well-ventilated area when using alcohol', 'Keep flame away from flammable materials', 'Never touch hot needle', 'Dispose of contaminated materials in sealed bags'],
  95.0,
  false,
  0,
  NOW(),
  NOW()
),

-- Substrate Preparation SOP
(
  gen_random_uuid(),
  'Substrate Preparation and Pasteurization',
  'Substrate Preparation',
  'Intermediate',
  '2-3 hours',
  E'# Substrate Preparation and Pasteurization\n\n## Overview\nProper substrate preparation is critical for healthy mycelial growth and high yields. This SOP covers pasteurization methods for bulk substrates.\n\n## Materials Needed\n- Base substrate (straw, coco coir, etc.)\n- Supplements (wheat bran, gypsum)\n- Large pot or drum for pasteurization\n- Thermometer\n- pH meter\n- Mixing container\n\n## Substrate Formulation\n\n### Standard Oyster Substrate\n- 5 lbs straw (chopped to 2-4 inches)\n- 1.25 lbs wheat bran (25% supplement)\n- 0.25 lbs gypsum (5%)\n- Water to field capacity (65-70% moisture)\n\n### Moisture Testing\n1. Squeeze handful of mixed substrate\n2. Should drip 1-3 drops of water\n3. Should hold shape when released\n4. Adjust water as needed\n\n## Pasteurization Methods\n\n### Hot Water Bath Method\n1. Heat water to 160-180°F (71-82°C)\n2. Submerge substrate in mesh bag\n3. Maintain temperature for 90 minutes\n4. Stir occasionally for even heating\n5. Remove and drain excess water\n6. Cool to below 80°F before inoculation\n\n### Cold Water Lime Bath (Alternative)\n1. Mix hydrated lime to pH 12-13\n2. Submerge substrate for 12-18 hours\n3. Drain and rinse until pH 7-8\n4. Squeeze to field capacity\n5. Ready for immediate inoculation\n\n## Quality Control\n\n### pH Testing\n- Target pH: 6.5-7.5\n- Too high: Add gypsum\n- Too low: Add hydrated lime\n\n### Moisture Content\n- Target: 65-70%\n- Too wet: Causes anaerobic conditions\n- Too dry: Slow colonization\n\n## Post-Pasteurization\n1. Cool substrate in clean area\n2. Check for off odors (should smell earthy)\n3. Inoculate within 24 hours\n4. Mix spawn thoroughly (10-20% spawn rate)\n\n## Troubleshooting\n**Sour smell**: Over-pasteurized or anaerobic conditions\n**Dry patches**: Uneven moisture distribution\n**Slow colonization**: Temperature too low or insufficient spawn',
  ARRAY['Large pot or drum', 'Thermometer', 'pH meter', 'Mesh bags', 'Mixing container', 'Gloves', 'Gypsum', 'Hydrated lime (optional)'],
  ARRAY['Hot water can cause severe burns - use caution', 'Hydrated lime is caustic - wear protective equipment', 'Work in ventilated area', 'Do not inhale steam'],
  90.0,
  false,
  0,
  NOW(),
  NOW()
),

-- Environmental Control SOP
(
  gen_random_uuid(),
  'Environmental Control for Fruiting',
  'Environmental Control',
  'Intermediate',
  '15-20 minutes per day',
  E'# Environmental Control for Fruiting\n\n## Overview\nPrecise environmental control is essential for triggering fruiting and maximizing yields. This SOP covers the key parameters and how to maintain them.\n\n## Key Environmental Parameters\n\n### Temperature\n- **Colonization**: 70-75°F (21-24°C)\n- **Fruiting**: 55-65°F (13-18°C) for most species\n- **Monitoring**: Check 3x daily minimum\n\n### Humidity\n- **Colonization**: 60-70% RH\n- **Pinning**: 90-95% RH\n- **Fruiting**: 85-90% RH\n- **Critical**: Never let humidity drop below 80% during fruiting\n\n### Fresh Air Exchange (FAE)\n- **Colonization**: Minimal (high CO2 promotes mycelial growth)\n- **Pinning**: 4-6 air exchanges per hour\n- **Fruiting**: 6-8 air exchanges per hour\n- **CO2 levels**: Keep below 1000 ppm during fruiting\n\n### Light\n- **Colonization**: Complete darkness\n- **Fruiting**: 12 hours indirect light per day\n- **Intensity**: 500-1000 lux (indirect sunlight or LED)\n\n## Daily Monitoring Routine\n\n### Morning Check (8 AM)\n1. Record temperature and humidity\n2. Check for condensation on walls\n3. Inspect for contamination\n4. Mist if humidity below 85%\n5. Fan for 30 seconds if CO2 high\n\n### Afternoon Check (2 PM)\n1. Record temperature and humidity\n2. Adjust heater/cooler as needed\n3. Check substrate moisture\n4. Mist if needed\n\n### Evening Check (8 PM)\n1. Final temperature/humidity reading\n2. Ensure humidifier has water\n3. Set timer for overnight misting\n4. Check air circulation\n\n## Humidity Management\n\n### Increasing Humidity\n- Ultrasonic humidifier (most effective)\n- Manual misting 3-4x daily\n- Wet towels in chamber\n- Reduce air exchange temporarily\n\n### Decreasing Humidity\n- Increase air exchange\n- Add small fan\n- Reduce misting frequency\n- Check for water pooling\n\n## Temperature Management\n\n### Cooling Methods\n- Air conditioning\n- Evaporative cooling\n- Ice bottles in chamber\n- Basement or cool room location\n\n### Heating Methods\n- Space heater with thermostat\n- Heat mat under chamber\n- Insulation to retain heat\n\n## Troubleshooting\n**Dry mushrooms**: Increase humidity, mist more frequently\n**Fuzzy feet**: Increase FAE, reduce CO2\n**Slow pinning**: Check temperature, increase FAE\n**Aborted pins**: Humidity dropped, increase misting',
  ARRAY['Thermometer/hygrometer', 'Humidifier', 'Fan for FAE', 'Spray bottle', 'Timer', 'Heater/cooler (optional)', 'CO2 monitor (optional)'],
  ARRAY['Keep electrical equipment away from water', 'Ensure proper ventilation', 'Monitor for mold growth in humid conditions'],
  88.0,
  false,
  0,
  NOW(),
  NOW()
);

-- Insert Contamination Identification Guide
INSERT INTO contamination_guide (
  id, contaminant_name, visual_description, color_indicators,
  smell_indicators, growth_pattern, severity_level,
  common_causes, prevention_methods, treatment_options,
  affected_stages, image_url, created_at
) VALUES
-- Trichoderma (Green Mold)
(
  gen_random_uuid(),
  'Trichoderma (Green Mold)',
  'Fast-growing mold that starts white and fluffy, quickly turning dark green. Forms concentric circles. Produces visible spores.',
  ARRAY['White (early)', 'Light green', 'Dark green', 'Blue-green'],
  'Musty, moldy smell. Sometimes coconut-like odor in early stages.',
  'Circular patches that expand rapidly. Starts as white mycelium, sporulates to green within 24-48 hours.',
  'High',
  ARRAY['Insufficient sterilization', 'Contaminated spawn', 'Poor air quality', 'High humidity with poor air flow', 'Substrate pH too high'],
  ARRAY['Proper sterilization (15 PSI for 90+ minutes)', 'Use quality spawn from reliable source', 'Maintain substrate pH 6.5-7.5', 'Good air circulation', 'Clean work environment', 'Proper pasteurization temperatures'],
  ARRAY['Isolate immediately', 'If small patch: cut out with 2-inch margin', 'If widespread: dispose of entire block', 'Do not open in grow room', 'Sterilize tools after contact', 'Review sterile technique'],
  ARRAY['Colonization', 'Early fruiting'],
  '/placeholder.svg?height=400&width=600',
  NOW()
),

-- Cobweb Mold
(
  gen_random_uuid(),
  'Cobweb Mold (Dactylium)',
  'Wispy, gray mold that grows extremely fast. Looks like spider webs. Much faster growing than mushroom mycelium.',
  ARRAY['Light gray', 'White-gray', 'Translucent'],
  'Mild musty odor, less pronounced than other molds.',
  'Spreads in thin, wispy strands across surface. Can cover entire substrate in 24 hours.',
  'Medium',
  ARRAY['Excessive humidity', 'Poor air circulation', 'Contaminated casing layer', 'Stagnant air'],
  ARRAY['Maintain humidity 85-90% (not higher)', 'Ensure adequate FAE', 'Use clean casing materials', 'Avoid water pooling on substrate'],
  ARRAY['Spray affected area with 3% hydrogen peroxide', 'Increase air exchange immediately', 'Reduce humidity slightly', 'If spreads: dispose of block', 'Isolate from other grows'],
  ARRAY['Fruiting', 'Post-pinning'],
  '/placeholder.svg?height=400&width=600',
  NOW()
),

-- Bacterial Blotch
(
  gen_random_uuid(),
  'Bacterial Blotch',
  'Wet, slimy patches on mushroom caps or substrate. Causes brown discoloration and tissue breakdown.',
  ARRAY['Brown', 'Yellow-brown', 'Dark brown spots'],
  'Foul, rotten smell. Sour or putrid odor.',
  'Starts as small wet spots, spreads to form larger slimy patches. Tissue becomes soft and breaks down.',
  'Medium',
  ARRAY['Excess moisture', 'Poor ventilation', 'Water droplets on mushrooms', 'Contaminated water source', 'High temperature'],
  ARRAY['Avoid misting directly on mushrooms', 'Ensure good air circulation', 'Use clean water for misting', 'Maintain proper temperature', 'Remove standing water'],
  ARRAY['Remove affected mushrooms immediately', 'Improve air circulation', 'Reduce misting frequency', 'Spray with diluted hydrogen peroxide', 'Ensure water drains properly'],
  ARRAY['Fruiting', 'Harvest'],
  '/placeholder.svg?height=400&width=600',
  NOW()
),

-- Aspergillus (Black Mold)
(
  gen_random_uuid(),
  'Aspergillus (Black Mold)',
  'Black or dark brown mold that forms powdery spore masses. Can appear yellow-green before turning black.',
  ARRAY['Yellow-green (early)', 'Dark brown', 'Black'],
  'Strong musty, earthy smell.',
  'Forms dense colonies with powdery texture. Produces abundant dark spores.',
  'High',
  ARRAY['Inadequate sterilization', 'Contaminated grain spawn', 'Poor air quality', 'Excessive moisture'],
  ARRAY['Proper sterilization procedures', 'Quality control on spawn', 'HEPA filtration in work area', 'Maintain proper moisture levels', 'Clean environment'],
  ARRAY['Dispose of contaminated material immediately', 'Do not open in grow space', 'Deep clean work area', 'Check air filtration', 'Review sterilization process'],
  ARRAY['Colonization', 'Grain spawn'],
  '/placeholder.svg?height=400&width=600',
  NOW()
),

-- Lipstick Mold
(
  gen_random_uuid(),
  'Lipstick Mold (Geotrichum)',
  'Pink to red mold that appears as small dots or patches. Looks like lipstick marks on substrate.',
  ARRAY['Pink', 'Red', 'Coral'],
  'Yeasty, fermented smell.',
  'Starts as small pink dots, can spread to form larger patches. Often appears at injection sites.',
  'Low to Medium',
  ARRAY['Contaminated injection sites', 'Excess moisture at inoculation points', 'Poor sterile technique', 'Overheating during colonization'],
  ARRAY['Proper flame sterilization', 'Avoid over-injecting culture', 'Seal injection ports properly', 'Maintain proper incubation temperature'],
  ARRAY['If isolated: cut out with margin', 'Improve air circulation', 'Reduce moisture', 'Monitor closely for spread', 'If widespread: dispose'],
  ARRAY['Colonization', 'Inoculation'],
  '/placeholder.svg?height=400&width=600',
  NOW()
);

-- Insert substrate recipes
INSERT INTO substrate_recipes (
  id, recipe_name, species_compatibility, difficulty_level,
  ingredients, preparation_steps, sterilization_method,
  sterilization_duration, moisture_content_target, ph_target,
  success_rate, notes, created_at, updated_at
) VALUES
(
  gen_random_uuid(),
  'Master''s Mix (Hardwood Sawdust)',
  ARRAY['Shiitake', 'Lion''s Mane', 'Reishi', 'Chestnut'],
  'Intermediate',
  '{"hardwood_sawdust": "5 lbs", "wheat_bran": "1.25 lbs", "gypsum": "0.25 lbs", "water": "to field capacity"}'::jsonb,
  ARRAY[
    'Mix dry ingredients thoroughly',
    'Add water gradually while mixing',
    'Test moisture content (squeeze test)',
    'Fill bags or containers',
    'Sterilize immediately'
  ],
  'Pressure sterilization',
  90,
  68.0,
  6.8,
  92.0,
  'Michael Crowe''s proven formula for gourmet species. Excellent for supplemented blocks.',
  NOW(),
  NOW()
);
