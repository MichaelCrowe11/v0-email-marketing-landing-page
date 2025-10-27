-- Seed knowledge base with cultivation articles

CREATE TABLE IF NOT EXISTS knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT DEFAULT 'Michael Crowe',
  views INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO knowledge_articles (title, slug, category, content, excerpt) VALUES
(
  'Getting Started with Mushroom Cultivation',
  'getting-started-mushroom-cultivation',
  'Beginner Guides',
  'Mushroom cultivation is an rewarding hobby that can be started with minimal equipment. This guide covers the basics of mushroom growing, from understanding the lifecycle to your first harvest...',
  'Learn the fundamentals of mushroom cultivation and start your growing journey.'
),
(
  'Understanding Sterile Technique',
  'understanding-sterile-technique',
  'Techniques',
  'Sterile technique is the foundation of successful mushroom cultivation. Contamination is the #1 cause of failed grows. This comprehensive guide covers proper sterilization methods, working in a still air box, and maintaining cleanliness throughout your process...',
  'Master sterile technique to prevent contamination and ensure successful grows.'
),
(
  'Substrate Preparation Guide',
  'substrate-preparation-guide',
  'Substrates',
  'The substrate is the nutritional foundation for your mushrooms. Different species require different substrate compositions. This guide covers substrate selection, preparation, pasteurization, and sterilization techniques...',
  'Learn how to prepare the perfect substrate for your mushroom species.'
),
(
  'Identifying Common Contaminants',
  'identifying-common-contaminants',
  'Troubleshooting',
  'Contamination happens to every cultivator. The key is early identification and proper response. This guide helps you identify green mold, cobweb mold, bacterial contamination, and other common issues...',
  'Quickly identify and address contamination issues in your grows.'
),
(
  'Optimizing Environmental Conditions',
  'optimizing-environmental-conditions',
  'Environment',
  'Temperature, humidity, fresh air exchange, and light all play crucial roles in mushroom development. This guide covers how to create and maintain optimal conditions for each growth stage...',
  'Create the perfect environment for healthy mushroom growth.'
);
