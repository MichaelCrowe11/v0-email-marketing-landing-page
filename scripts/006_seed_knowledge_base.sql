-- Seed Knowledge Base with Michael Crowe's Expertise

-- Insert knowledge categories
INSERT INTO knowledge_categories (name, description, icon) VALUES
('Species Cultivation', 'Complete guides for growing specific mushroom species', '🍄'),
('Substrate Preparation', 'Substrate recipes, formulations, and techniques', '🌾'),
('Contamination Management', 'Identification, prevention, and treatment of contaminants', '🔬'),
('Environmental Control', 'Temperature, humidity, CO2, and lighting management', '🌡️'),
('Business Operations', 'Commercial cultivation, scaling, and business strategies', '💼'),
('Equipment & Setup', 'Grow room design, equipment selection, and maintenance', '🏭'),
('Harvesting & Post-Harvest', 'Harvest timing, handling, packaging, and storage', '📦'),
('Troubleshooting', 'Common problems and solutions', '🔧')
ON CONFLICT DO NOTHING;

-- Insert sample knowledge articles
WITH categories AS (
  SELECT id, name FROM knowledge_categories
)
INSERT INTO knowledge_articles (category_id, title, slug, content, summary, difficulty_level, is_published, tags) VALUES
(
  (SELECT id FROM categories WHERE name = 'Species Cultivation'),
  'Complete Guide to Growing Oyster Mushrooms',
  'complete-guide-oyster-mushrooms',
  E'# Growing Oyster Mushrooms: A Complete Guide\n\n## Introduction\nOyster mushrooms (Pleurotus ostreatus) are one of the easiest and most rewarding species for beginners. They grow quickly, tolerate a wide range of conditions, and produce abundant yields.\n\n## Substrate Preparation\n### Recommended Substrates\n- Straw (wheat, barley, oat)\n- Hardwood sawdust\n- Coffee grounds\n- Cardboard\n\n### Pasteurization\nOyster mushrooms require pasteurized substrate, not sterilized. Heat substrate to 160-180°F for 1-2 hours.\n\n## Environmental Parameters\n- **Temperature**: 55-75°F (13-24°C)\n- **Humidity**: 85-95%\n- **Fresh Air Exchange**: 4-8 exchanges per hour\n- **Light**: Indirect natural light or 500-1000 lux\n\n## Growth Timeline\n- Spawn run: 10-14 days\n- Pinning: 3-5 days\n- Fruiting: 5-7 days\n- Total: 18-26 days from inoculation to harvest\n\n## Common Issues\n1. **Slow colonization**: Increase temperature to 70-75°F\n2. **No pinning**: Increase FAE and lower temperature\n3. **Small mushrooms**: Increase humidity and FAE\n\n## Yield Expectations\nExpect 20-25% biological efficiency on first flush, with 2-3 flushes total.',
  'Complete beginner-friendly guide to cultivating oyster mushrooms with substrate recipes, environmental parameters, and troubleshooting tips.',
  'beginner',
  true,
  ARRAY['oyster', 'pleurotus', 'beginner', 'substrate', 'pasteurization']
),
(
  (SELECT id FROM categories WHERE name = 'Contamination Management'),
  'Identifying and Treating Green Mold (Trichoderma)',
  'identifying-treating-trichoderma',
  E'# Green Mold (Trichoderma) Identification and Treatment\n\n## Visual Identification\nTrichoderma appears as:\n- Initially white, fluffy mycelium (looks like mushroom mycelium)\n- Turns green as spores mature (24-48 hours)\n- Spreads rapidly in concentric circles\n- Has a musty, moldy odor\n\n## Causes\n1. **Incomplete sterilization**: Most common cause\n2. **Contaminated spawn**: Poor quality or old spawn\n3. **Poor air quality**: Spores in grow room\n4. **Substrate too wet**: Excess moisture favors Trichoderma\n5. **Low spawn rate**: Slow colonization allows contamination\n\n## Prevention\n### Sterilization\n- Pressure cook at 15 PSI for 90-120 minutes\n- Ensure proper pressure throughout cycle\n- Allow complete cooldown before inoculation\n\n### Spawn Quality\n- Use fresh spawn (< 2 months old)\n- Check for any green coloration before use\n- Store spawn at 35-40°F\n\n### Environmental\n- HEPA filter grow room air\n- Maintain positive pressure\n- Clean surfaces with 10% bleach solution\n\n## Treatment\nIf contamination appears:\n1. **Isolate immediately**: Remove from grow area\n2. **Do not open**: Spores spread when disturbed\n3. **Dispose properly**: Seal in plastic bag, discard\n4. **Clean area**: Wipe down with bleach solution\n5. **Investigate cause**: Review sterilization process\n\n## Recovery\nIf caught early (white stage):\n- Increase spawn rate to 20-30%\n- Lower substrate moisture\n- Improve sterilization protocol\n- Consider using supplemented substrate',
  'Comprehensive guide to identifying, preventing, and treating Trichoderma contamination in mushroom cultivation.',
  'intermediate',
  true,
  ARRAY['contamination', 'trichoderma', 'green mold', 'prevention', 'treatment']
),
(
  (SELECT id FROM categories WHERE name = 'Business Operations'),
  'Scaling from Home Grow to Commercial Operation',
  'scaling-home-to-commercial',
  E'# Scaling from Home Grow to Commercial Operation\n\n## Phase 1: Home Production (0-50 lbs/week)\n### Focus\n- Perfect your technique\n- Establish consistent quality\n- Build local customer base\n- Test market demand\n\n### Equipment\n- Pressure cooker or autoclave\n- Flow hood or still air box\n- Fruiting chamber (Martha tent)\n- Basic environmental controls\n\n### Investment: $2,000-$5,000\n\n## Phase 2: Small Commercial (50-200 lbs/week)\n### Upgrades Needed\n- Dedicated grow space (200-500 sq ft)\n- Commercial autoclave\n- Climate control system\n- Proper ventilation\n- Cold storage\n\n### Business Requirements\n- Business license\n- Food safety certification\n- Liability insurance\n- Wholesale accounts\n\n### Investment: $15,000-$30,000\n\n## Phase 3: Medium Commercial (200-1000 lbs/week)\n### Infrastructure\n- 1,000-2,000 sq ft facility\n- Multiple grow rooms\n- Automated climate control\n- Commercial kitchen (if processing)\n- Delivery vehicle\n\n### Team\n- 2-4 full-time employees\n- Defined roles and SOPs\n- Quality control systems\n\n### Investment: $75,000-$150,000\n\n## Financial Planning\n### Revenue Projections\n- Wholesale: $6-$10/lb\n- Farmers market: $12-$16/lb\n- Restaurant direct: $10-$14/lb\n\n### Operating Costs\n- Substrate: $0.50-$1.00/lb produced\n- Labor: 30-40% of revenue\n- Utilities: 10-15% of revenue\n- Packaging: $0.25-$0.50/lb\n\n## Key Success Factors\n1. **Quality consistency**: Never compromise\n2. **Customer relationships**: Build trust\n3. **Cash flow management**: Critical in early stages\n4. **Efficient systems**: Document everything\n5. **Market diversification**: Multiple revenue streams',
  'Strategic guide to scaling mushroom cultivation from home production to commercial operation with financial projections and key milestones.',
  'advanced',
  true,
  ARRAY['business', 'scaling', 'commercial', 'financial planning', 'operations']
);

-- Insert AI training data
INSERT INTO ai_training_data (category, question, answer, context, is_verified) VALUES
('substrate_preparation', 
 'What is the ideal moisture content for mushroom substrate?',
 'The ideal moisture content for mushroom substrate is 55-65%. To test, squeeze a handful of substrate - it should form a ball and release only a few drops of water when squeezed firmly. Too wet (>70%) increases contamination risk, while too dry (<50%) slows colonization.',
 'General substrate preparation guidelines applicable to most species',
 true),

('environmental_control',
 'Why are my mushrooms growing long and thin with small caps?',
 'Long, thin mushrooms with small caps indicate insufficient fresh air exchange (FAE). This condition is called "leggy" growth. Increase FAE by improving ventilation, adding fans, or opening vents more frequently. Mushrooms need CO2 levels below 1000 ppm for proper cap development.',
 'Common fruiting problem related to CO2 buildup',
 true),

('contamination',
 'How can I tell the difference between mushroom mycelium and mold?',
 'Mushroom mycelium is typically bright white, rope-like, and grows in organized patterns. It has a pleasant, earthy smell. Mold appears fuzzy, can be various colors (green, black, gray, pink), grows in random patterns, and has a musty or sour smell. When in doubt, wait 24-48 hours - mold will show color while mycelium stays white.',
 'Visual identification guide for contamination vs healthy growth',
 true),

('species_cultivation',
 'What temperature should I fruit Lion''s Mane mushrooms?',
 'Lion''s Mane (Hericium erinaceus) fruits best at 55-65°F (13-18°C). Higher temperatures (>70°F) cause the mushroom to grow too quickly, resulting in poor quality and bitter taste. Lower temperatures (<50°F) slow growth significantly. Maintain 85-95% humidity and provide indirect light for best results.',
 'Species-specific cultivation parameters for Lion''s Mane',
 true),

('business',
 'What is a realistic profit margin for a small mushroom farm?',
 'Small mushroom farms (50-200 lbs/week) typically achieve 20-35% net profit margins after reaching operational efficiency. Factors affecting profitability: substrate costs (aim for <$1/lb produced), labor efficiency (should be <40% of revenue), market pricing (wholesale $6-10/lb, retail $12-16/lb), and yield consistency (target 20-25% biological efficiency). First year often breaks even while building systems and markets.',
 'Financial expectations for small commercial operations',
 true);
