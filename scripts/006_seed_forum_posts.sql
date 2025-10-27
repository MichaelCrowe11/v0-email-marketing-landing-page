-- Seed Forum with Starter Posts
-- This creates engaging starter content to avoid empty forum state

-- First, ensure we have forum categories
INSERT INTO forum_categories (id, name, description, icon, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Getting Started', 'New to mushroom cultivation? Start here!', '🌱', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Troubleshooting', 'Get help with contamination, growth issues, and more', '🔧', NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Advanced Techniques', 'Commercial scaling, genetics, and optimization', '🚀', NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Species Discussion', 'Share experiences with different mushroom varieties', '🍄', NOW()),
  ('55555555-5555-5555-5555-555555555555', 'Show & Tell', 'Share your grows, harvests, and success stories', '📸', NOW())
ON CONFLICT (id) DO NOTHING;

-- Create a system user for seeded posts (Michael Crowe)
INSERT INTO users (id, email, full_name, is_admin, subscription_tier, subscription_status, created_at)
VALUES ('99999999-9999-9999-9999-999999999999', 'michael@crowelogic.com', 'Michael Crowe', true, 'expert', 'active', NOW())
ON CONFLICT (id) DO UPDATE SET is_admin = true, subscription_tier = 'expert';

-- Seed forum posts with realistic content
INSERT INTO forum_posts (id, title, content, category_id, author_id, tags, is_pinned, view_count, created_at)
VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'Welcome to the CROWELOGIC Community!',
    E'Hey everyone! 👋\n\nWelcome to the CROWELOGIC AI community forum. This is your space to:\n\n- Ask questions about cultivation\n- Share your growing experiences\n- Troubleshoot issues with the community\n- Learn from commercial growers\n- Connect with fellow cultivators\n\n**Getting Started:**\n1. Introduce yourself in this thread\n2. Check out the Getting Started category for beginner guides\n3. Use the search function - your question might already be answered\n4. Be respectful and help others learn\n\nLet''s grow together! 🍄',
    '11111111-1111-1111-1111-111111111111',
    '99999999-9999-9999-9999-999999999999',
    ARRAY['welcome', 'community', 'introduction'],
    true,
    247,
    NOW() - INTERVAL '7 days'
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'Green mold on my substrate - is it salvageable?',
    E'I''m on day 12 of colonization and noticed some green patches appearing on my grain spawn. It''s about 70% colonized with white mycelium, but there are 2-3 spots of green mold (looks like Trichoderma).\n\n**Setup details:**\n- Species: Oyster mushrooms\n- Substrate: Rye grain\n- Sterilization: PC at 15 PSI for 90 minutes\n- Inoculation: LC syringe\n\nShould I:\n1. Isolate and remove the contaminated grains?\n2. Toss the whole bag?\n3. Try to outcompete it by lowering temp?\n\nAny advice appreciated!',
    '22222222-2222-2222-2222-222222222222',
    '99999999-9999-9999-9999-999999999999',
    ARRAY['contamination', 'trichoderma', 'troubleshooting', 'oyster'],
    false,
    156,
    NOW() - INTERVAL '5 days'
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'Scaling from 100 to 1000 lbs/month - lessons learned',
    E'After 18 months of commercial growing, here are the key lessons from scaling our operation:\n\n**Infrastructure:**\n- Automated climate control is non-negotiable at scale\n- Invest in proper HVAC before you think you need it\n- Batch tracking systems save countless hours\n\n**Labor:**\n- One person can handle ~200 lbs/week comfortably\n- Training SOPs are critical for consistency\n- Harvest timing is the hardest skill to teach\n\n**Yields:**\n- Went from 0.8 BE to 1.4 BE with better genetics\n- Substrate supplementation added 30% to yields\n- Multiple flushes are only worth it for certain species\n\n**Biggest mistakes:**\n1. Underestimating cooling costs in summer\n2. Not having backup equipment\n3. Scaling too fast without dialing in processes\n\nHappy to answer questions!',
    '33333333-3333-3333-3333-333333333333',
    '99999999-9999-9999-9999-999999999999',
    ARRAY['commercial', 'scaling', 'business', 'yields'],
    true,
    423,
    NOW() - INTERVAL '3 days'
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    'Lion''s Mane vs Oysters - which is more profitable?',
    E'I''m planning my first commercial grow and trying to decide between Lion''s Mane and Oyster mushrooms. Here''s what I''ve researched:\n\n**Lion''s Mane:**\n- Higher market price ($12-16/lb)\n- Slower growth (21-28 days)\n- More finicky with conditions\n- Strong demand in health food stores\n\n**Oyster Mushrooms:**\n- Lower price ($6-10/lb)\n- Fast growth (7-14 days)\n- Very forgiving\n- Easier to sell to restaurants\n\n**My situation:**\n- 500 sq ft grow space\n- Climate controlled\n- Access to local restaurants and farmers markets\n- Limited startup capital\n\nWhat would you recommend for a beginner looking to turn profitable quickly?',
    '44444444-4444-4444-4444-444444444444',
    '99999999-9999-9999-9999-999999999999',
    ARRAY['lions-mane', 'oyster', 'business', 'profitability'],
    false,
    189,
    NOW() - INTERVAL '2 days'
  ),
  (
    'a5555555-5555-5555-5555-555555555555',
    'First successful flush! 3.2 lbs from 5 lb block',
    E'Just harvested my first flush and I''m so excited! 🎉\n\n**Stats:**\n- Species: Blue Oyster\n- Substrate: Masters Mix (50/50 hardwood/soy hulls)\n- Block weight: 5 lbs\n- First flush yield: 3.2 lbs wet\n- Biological efficiency: 64%\n\n**What worked:**\n- Maintained 85-90% humidity\n- 4-5 FAE cycles per day\n- Kept temps at 65-70°F\n- Harvested right before spore drop\n\n**Challenges:**\n- Almost lost it to dry bubble early on\n- Had to dial in FAE timing\n- Learning when to harvest was tricky\n\nThanks to everyone in this community for the advice! Already have pins forming for flush #2.\n\n[Photo would be here in real post]',
    '55555555-5555-5555-5555-555555555555',
    '99999999-9999-9999-9999-999999999999',
    ARRAY['success', 'oyster', 'harvest', 'first-grow'],
    false,
    312,
    NOW() - INTERVAL '1 day'
  ),
  (
    'a6666666-6666-6666-6666-666666666666',
    'Best substrate for beginners? Coco coir vs hardwood',
    E'I''ve seen conflicting advice about substrate choices for beginners. Some say coco coir is easiest, others recommend hardwood sawdust.\n\n**Coco Coir:**\n- Pros: Easy to find, no sterilization needed for some species\n- Cons: Lower yields, limited species compatibility\n\n**Hardwood Sawdust:**\n- Pros: Better yields, works for most species\n- Cons: Requires sterilization, harder to source\n\nI''m planning to grow oysters and lion''s mane. Which substrate would you recommend for someone just starting out?\n\nAlso, is supplementation worth the extra complexity for a first grow?',
    '11111111-1111-1111-1111-111111111111',
    '99999999-9999-9999-9999-999999999999',
    ARRAY['substrate', 'beginner', 'coco-coir', 'hardwood'],
    false,
    134,
    NOW() - INTERVAL '12 hours'
  ),
  (
    'a7777777-7777-7777-7777-777777777777',
    'Automated monitoring setup - sensors and software',
    E'For those interested in automation, here''s my current monitoring setup:\n\n**Hardware:**\n- SHT31 temp/humidity sensors ($15 each)\n- MH-Z19B CO2 sensor ($25)\n- Raspberry Pi 4 as controller ($75)\n- Relay board for equipment control ($12)\n\n**Software:**\n- Custom Python scripts for data logging\n- Grafana for visualization\n- Alerts via Telegram\n- Integration with CROWELOGIC AI for analysis\n\n**Total cost:** ~$150 per grow room\n\n**Benefits:**\n- Catch issues before they become problems\n- Historical data for optimization\n- Remote monitoring from phone\n- Automated responses to conditions\n\nHappy to share code/schematics if anyone is interested in building their own!',
    '33333333-3333-3333-3333-333333333333',
    '99999999-9999-9999-9999-999999999999',
    ARRAY['automation', 'monitoring', 'sensors', 'technology'],
    false,
    267,
    NOW() - INTERVAL '6 hours'
  ),
  (
    'a8888888-8888-8888-8888-888888888888',
    'Reishi cultivation - worth the wait?',
    E'I''m considering adding Reishi to my grow list but the long cultivation time (45-60 days) has me hesitant.\n\n**Questions:**\n1. Is the premium price worth the longer grow cycle?\n2. How does it compare to faster species in terms of profit per square foot?\n3. Any tips for reducing colonization time?\n4. Best markets for selling Reishi?\n\nI''ve heard the medicinal market is strong, but I''m curious about real-world experiences from commercial growers.\n\nCurrently growing oysters and lion''s mane with good success, looking to diversify.',
    '44444444-4444-4444-4444-444444444444',
    '99999999-9999-9999-9999-999999999999',
    ARRAY['reishi', 'medicinal', 'cultivation-time', 'profitability'],
    false,
    98,
    NOW() - INTERVAL '3 hours'
  );

-- Add some replies to make posts feel active
INSERT INTO forum_replies (id, post_id, author_id, content, created_at)
VALUES
  (
    'r1111111-1111-1111-1111-111111111111',
    'a2222222-2222-2222-2222-222222222222',
    '99999999-9999-9999-9999-999999999999',
    E'Unfortunately, once Trich shows green it''s already sporulating. I''d recommend:\n\n1. Isolate immediately - don''t open it near other grows\n2. If it''s less than 10% of the bag, you could try removing that section\n3. More likely, it''s best to toss and start fresh\n\nFor prevention next time:\n- Double check your sterilization times\n- Work in a still air box or flow hood\n- Use a spore syringe from a reliable source\n\nTrichoderma is aggressive - better safe than sorry!',
    NOW() - INTERVAL '4 days'
  ),
  (
    'r2222222-2222-2222-2222-222222222222',
    'a4444444-4444-4444-4444-444444444444',
    '99999999-9999-9999-9999-999999999999',
    E'For quick profitability, I''d go with oysters:\n\n- 2-3x faster turnover means more crops per year\n- Much more forgiving for beginners\n- Easier to establish restaurant relationships\n- Lower risk if something goes wrong\n\nOnce you''re profitable and have systems dialed in, add Lion''s Mane as a premium offering. The higher price point is nice, but the longer grow time and pickier conditions can hurt cash flow when you''re starting out.\n\nMy 2 cents: Master oysters first, then diversify.',
    NOW() - INTERVAL '1 day'
  ),
  (
    'r3333333-3333-3333-3333-333333333333',
    'a5555555-5555-5555-5555-555555555555',
    '99999999-9999-9999-9999-999999999999',
    E'Congrats on the harvest! 64% BE on your first flush is excellent. 🎉\n\nFor flush #2, make sure to:\n- Rehydrate the block (dunk or heavy misting)\n- Give it a few days rest\n- Watch for pins in 3-5 days\n\nYou should get another 40-50% of your first flush weight. Keep us updated!',
    NOW() - INTERVAL '18 hours'
  );

-- Add some likes to make posts feel engaged
INSERT INTO forum_likes (id, post_id, user_id, created_at)
VALUES
  ('l1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999999', NOW() - INTERVAL '6 days'),
  ('l2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', '99999999-9999-9999-9999-999999999999', NOW() - INTERVAL '2 days'),
  ('l3333333-3333-3333-3333-333333333333', 'a5555555-5555-5555-5555-555555555555', '99999999-9999-9999-9999-999999999999', NOW() - INTERVAL '1 day');

-- Update view counts to make posts look active
UPDATE forum_posts SET view_count = view_count + FLOOR(RANDOM() * 50 + 20) WHERE id IN (
  'a1111111-1111-1111-1111-111111111111',
  'a2222222-2222-2222-2222-222222222222',
  'a3333333-3333-3333-3333-333333333333',
  'a4444444-4444-4444-4444-444444444444',
  'a5555555-5555-5555-5555-555555555555',
  'a6666666-6666-6666-6666-666666666666',
  'a7777777-7777-7777-7777-777777777777',
  'a8888888-8888-8888-8888-888888888888'
);
