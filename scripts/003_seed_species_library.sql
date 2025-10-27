-- Seed mushroom species library with cultivation parameters

CREATE TABLE IF NOT EXISTS species (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  scientific_name TEXT,
  description TEXT,
  difficulty TEXT, -- beginner, intermediate, advanced
  growth_time_days INTEGER,
  ideal_temp_min INTEGER,
  ideal_temp_max INTEGER,
  ideal_humidity INTEGER,
  substrate_types TEXT[],
  common_contaminants TEXT[],
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO species (name, scientific_name, description, difficulty, growth_time_days, ideal_temp_min, ideal_temp_max, ideal_humidity, substrate_types, common_contaminants) VALUES
(
  'Oyster Mushroom',
  'Pleurotus ostreatus',
  'Fast-growing, forgiving species perfect for beginners. Grows on a wide variety of substrates.',
  'beginner',
  14,
  65,
  75,
  85,
  ARRAY['straw', 'sawdust', 'coffee grounds', 'cardboard'],
  ARRAY['green mold', 'cobweb mold']
),
(
  'Shiitake',
  'Lentinula edodes',
  'Popular gourmet mushroom with rich umami flavor. Requires hardwood substrate.',
  'intermediate',
  60,
  55,
  75,
  80,
  ARRAY['oak logs', 'hardwood sawdust'],
  ARRAY['green mold', 'bacterial blotch']
),
(
  'Lion''s Mane',
  'Hericium erinaceus',
  'Unique appearance and medicinal properties. Requires high humidity and fresh air exchange.',
  'intermediate',
  21,
  65,
  75,
  90,
  ARRAY['hardwood sawdust', 'supplemented sawdust'],
  ARRAY['green mold', 'dry bubble']
),
(
  'Reishi',
  'Ganoderma lucidum',
  'Medicinal mushroom known for immune support. Slow-growing but rewarding.',
  'advanced',
  90,
  70,
  80,
  85,
  ARRAY['hardwood sawdust', 'supplemented sawdust'],
  ARRAY['green mold', 'bacterial contamination']
),
(
  'King Oyster',
  'Pleurotus eryngii',
  'Thick stems and meaty texture. Requires cooler temperatures for fruiting.',
  'intermediate',
  21,
  55,
  65,
  85,
  ARRAY['hardwood sawdust', 'supplemented sawdust'],
  ARRAY['green mold', 'cobweb mold']
),
(
  'Pink Oyster',
  'Pleurotus djamor',
  'Vibrant pink color and tropical origin. Fast-growing and heat-tolerant.',
  'beginner',
  10,
  75,
  85,
  85,
  ARRAY['straw', 'sawdust', 'coffee grounds'],
  ARRAY['green mold', 'bacterial blotch']
),
(
  'Turkey Tail',
  'Trametes versicolor',
  'Medicinal mushroom with immune-boosting properties. Grows on logs and stumps.',
  'intermediate',
  120,
  65,
  75,
  80,
  ARRAY['hardwood logs', 'hardwood sawdust'],
  ARRAY['green mold', 'competing fungi']
);
