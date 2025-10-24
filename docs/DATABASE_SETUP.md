# Database Setup Guide

This guide will help you execute all SQL migration scripts to populate your Crowe Logic AI database.

## Prerequisites

- Supabase project connected to your v0 workspace
- Access to Supabase SQL Editor or psql command line

## Migration Scripts Overview

We have 10 migration scripts that need to be executed in order:

1. `001_verify_schema.sql` - Adds missing columns and indexes
2. `002_seed_species_library.sql` - Populates mushroom species data
3. `003_seed_sample_projects.sql` - Creates sample cultivation projects
4. `004_seed_sops_and_contamination.sql` - Adds SOPs and contamination guides
5. `005_create_knowledge_base.sql` - Creates knowledge base tables
6. `006_seed_knowledge_base.sql` - Populates knowledge base articles
7. `007_gpt_purchases_and_access.sql` - Creates GPT purchase tracking
8. `008_advanced_cultivation_data.sql` - Adds strain library and recipes
9. `009_seed_advanced_data.sql` - Seeds advanced cultivation data
10. `010_setup_subscriptions_v2.sql` - Creates subscription tables

## Option 1: Using Supabase SQL Editor (Recommended)

### Step 1: Access SQL Editor

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your Crowe Logic AI project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Execute Scripts in Order

For each script (001 through 010):

1. Open the script file from the `scripts/` folder in your v0 project
2. Copy the entire SQL content
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. Wait for "Success. No rows returned" message
6. Move to the next script

**Important:** Execute scripts in numerical order (001, 002, 003, etc.)

### Step 3: Verify Installation

After running all scripts, verify the data:

\`\`\`sql
-- Check species count
SELECT COUNT(*) FROM species_library;
-- Should return: 7

-- Check knowledge base articles
SELECT COUNT(*) FROM kb_articles;
-- Should return: 61

-- Check subscription plans
SELECT * FROM subscription_plans;
-- Should return: 6 plans (Pro/Expert monthly/yearly + free trial)

-- Check sample projects
SELECT COUNT(*) FROM cultivation_projects;
-- Should return: 5
\`\`\`

## Option 2: Using psql Command Line

If you prefer command line:

\`\`\`bash
# Get your database connection string from Supabase
# Settings → Database → Connection string (Direct connection)

# Execute each script
psql "your-connection-string" -f scripts/001_verify_schema.sql
psql "your-connection-string" -f scripts/002_seed_species_library.sql
psql "your-connection-string" -f scripts/003_seed_sample_projects.sql
psql "your-connection-string" -f scripts/004_seed_sops_and_contamination.sql
psql "your-connection-string" -f scripts/005_create_knowledge_base.sql
psql "your-connection-string" -f scripts/006_seed_knowledge_base.sql
psql "your-connection-string" -f scripts/007_gpt_purchases_and_access.sql
psql "your-connection-string" -f scripts/008_advanced_cultivation_data.sql
psql "your-connection-string" -f scripts/009_seed_advanced_data.sql
psql "your-connection-string" -f scripts/010_setup_subscriptions_v2.sql
\`\`\`

## Option 3: Using Docker (Advanced)

If you have the scaffold from the attachment:

\`\`\`bash
cd crowe_sql_scaffold
cp .env.example .env
# Edit .env with your Supabase credentials
make up
pip install psycopg2-binary
export $(grep -v '^#' .env | xargs)
make migrate
make verify
\`\`\`

## Troubleshooting

### Error: "relation already exists"

This means the table was already created. You can either:
- Skip that script
- Or add `DROP TABLE IF EXISTS table_name CASCADE;` before the CREATE TABLE statement

### Error: "column already exists"

The script uses `IF NOT EXISTS` clauses, but if you still get this error:
- The column was added in a previous run
- Safe to ignore and continue

### Error: "null value in column violates not-null constraint"

This happened with `stripe_price_id`. The fix is in `010_setup_subscriptions_v2.sql` which:
- Drops and recreates tables cleanly
- Makes `stripe_price_id` nullable
- You'll add real Stripe price IDs later (see STRIPE_SETUP.md)

## What Gets Created

After running all scripts, your database will have:

**Species Library:**
- 7 mushroom species (Oyster, Shiitake, Lion's Mane, Reishi, etc.)
- Complete growing parameters, medicinal properties, yield data

**Sample Projects:**
- 5 cultivation projects at different stages
- Environmental monitoring data (temperature, humidity, CO2)
- Growth observations and harvest records

**Knowledge Base:**
- 61 articles across 8 categories
- Beginner guides, advanced techniques, troubleshooting
- AI training data for the chat assistant

**SOPs & Contamination:**
- 3 detailed Standard Operating Procedures
- 5 contamination identification guides
- Prevention and treatment protocols

**Subscription System:**
- 6 subscription plans (Free Trial, Pro, Expert - monthly/yearly)
- User subscription tracking tables
- Usage logging infrastructure

**Advanced Data:**
- Strain library with genetic variations
- Cultivation recipes and protocols
- Equipment inventory system
- Supplier directory

## Next Steps

After database setup is complete:

1. **Set up Stripe products** - See `STRIPE_SETUP.md`
2. **Test the platform** - Try creating a project, using chat, analyzing images
3. **Customize data** - Add your own species, SOPs, or knowledge base articles

## Support

If you encounter issues:
1. Check the Supabase logs for detailed error messages
2. Verify your database connection is active
3. Ensure you have proper permissions (you should be the project owner)
4. Contact Supabase support if database-level issues persist
