# Phase 1: Database Schema Analysis

## Overview

The database schema consists of 40+ SQL migration files covering authentication, subscriptions, content management, AI features, and analytics. This analysis identifies all tables, relationships, RLS policies, and indexes.

## Core Tables Identified

### Authentication & User Management

#### users (Supabase Auth)
- Core user authentication table
- Extended with custom columns:
  - `subscription_tier` (TEXT) - 'free', 'pro', 'expert'
  - `subscription_status` (TEXT) - 'active', 'inactive'
  - `stripe_customer_id` (TEXT)
  - `stripe_subscription_id` (TEXT)
  - `subscription_start_date` (TIMESTAMPTZ)
  - `subscription_end_date` (TIMESTAMPTZ)
  - `is_admin` (BOOLEAN)

### Subscription Management

#### subscription_plans
- `id` (UUID, PK)
- `name` (TEXT) - Plan name
- `tier` (TEXT, UNIQUE) - 'pro' or 'expert'
- `price_monthly` (DECIMAL)
- `price_yearly` (DECIMAL)
- `stripe_price_id_monthly` (TEXT)
- `stripe_price_id_yearly` (TEXT)
- `features` (JSONB)
- `created_at`, `updated_at` (TIMESTAMPTZ)

**Data**: Pre-populated with Pro ($97/mo, $997/yr) and Expert ($197/mo, $1997/yr) plans

#### user_subscriptions
- `id` (UUID, PK)
- `user_id` (UUID, FK → users)
- `plan_id` (UUID, FK → subscription_plans)
- `status` (TEXT) - 'active', 'cancelled', 'expired'
- `billing_cycle` (TEXT) - 'monthly', 'yearly'
- `stripe_subscription_id` (TEXT)
- `current_period_start`, `current_period_end` (TIMESTAMPTZ)
- `cancel_at_period_end` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMPTZ)

**Indexes**:
- `idx_user_subscriptions_user_id`
- `idx_user_subscriptions_status`

#### usage_quotas
- `id` (UUID, PK)
- `user_id` (UUID, FK → users, UNIQUE)
- `ai_messages_used`, `ai_messages_limit` (INTEGER)
- `crowe_vision_used`, `crowe_vision_limit` (INTEGER)
- `video_generations_used`, `video_generations_limit` (INTEGER)
- `reset_date` (TIMESTAMPTZ)
- `created_at`, `updated_at` (TIMESTAMPTZ)

**Default Limits**: Free tier gets 20 AI messages/day, 0 vision/video

**Index**: `idx_usage_quotas_user_id`

### AI & Chat System

#### ai_conversations
- `id` (UUID, PK)
- `user_id` (UUID, FK → users)
- `title` (TEXT)
- `created_at`, `updated_at` (TIMESTAMPTZ)

**RLS Policies**:
- ✅ Users can view their own conversations
- ✅ Users can create their own conversations
- ✅ Users can update their own conversations
- ✅ Users can delete their own conversations

#### ai_messages
- `id` (UUID, PK)
- `conversation_id` (UUID, FK → ai_conversations)
- `role` (TEXT) - 'user', 'assistant', 'system'
- `content` (TEXT)
- `created_at` (TIMESTAMPTZ)

**RLS Policies**:
- ✅ Users can view messages from their conversations
- ✅ Users can create messages in their conversations
- ✅ Users can delete messages from their conversations

#### ai_usage_analytics
- `id` (UUID, PK)
- `user_id` (UUID, FK → users)
- `model_id` (TEXT)
- `model_provider` (TEXT)
- `input_tokens`, `output_tokens`, `total_tokens` (INTEGER)
- `provider_cost_usd`, `markup_usd`, `user_charge_usd` (NUMERIC)
- `feature_type` (TEXT) - 'chat', 'vision', 'video'
- `conversation_id` (UUID, FK → ai_conversations)
- `metadata` (JSONB)
- `created_at` (TIMESTAMPTZ)

**Indexes**:
- `idx_ai_usage_analytics_user_id`
- `idx_ai_usage_analytics_model_id`
- `idx_ai_usage_analytics_created_at`
- `idx_ai_usage_analytics_feature_type`

**Views**:
- `user_ai_usage_summary` - Usage aggregated by user/model/day
- `model_popularity` - Model usage statistics (30 days)
- `ai_revenue_analytics` - Revenue and profit margins by day/provider

### Knowledge Base System

#### knowledge_categories
- `id` (UUID, PK)
- `name`, `description`, `icon` (TEXT)
- `parent_id` (UUID, FK → knowledge_categories) - Hierarchical structure
- `created_at`, `updated_at` (TIMESTAMPTZ)

#### knowledge_articles
- `id` (UUID, PK)
- `category_id` (UUID, FK → knowledge_categories)
- `title`, `slug` (TEXT, slug is UNIQUE)
- `content`, `summary` (TEXT)
- `author_id` (UUID, FK → users)
- `tags` (TEXT[])
- `difficulty_level` (TEXT) - 'beginner', 'intermediate', 'advanced', 'expert'
- `is_published` (BOOLEAN)
- `view_count`, `helpful_count` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMPTZ)

**Indexes**:
- `idx_knowledge_articles_category`
- `idx_knowledge_articles_slug`
- `idx_knowledge_articles_tags` (GIN)
- `idx_knowledge_articles_search` (GIN, full-text)

#### knowledge_attachments
- `id` (UUID, PK)
- `article_id` (UUID, FK → knowledge_articles, CASCADE)
- `file_name`, `file_url`, `file_type` (TEXT)
- `file_size` (INTEGER)
- `created_at` (TIMESTAMPTZ)

#### ai_training_data
- `id` (UUID, PK)
- `category`, `question`, `answer`, `context` (TEXT)
- `source_article_id` (UUID, FK → knowledge_articles)
- `confidence_score` (DECIMAL)
- `is_verified` (BOOLEAN)
- `verified_by` (UUID, FK → users)
- `created_at`, `updated_at` (TIMESTAMPTZ)

**Indexes**:
- `idx_ai_training_data_category`
- `idx_ai_training_data_verified`
- `idx_ai_training_data_search` (GIN, full-text)

### Forum System

#### forum_categories
- `id` (UUID, PK)
- `name` (TEXT, UNIQUE)
- `description`, `icon` (TEXT)
- `created_at` (TIMESTAMPTZ)

**Default Categories**: General Discussion, Troubleshooting, Species Specific, Equipment & Setup, Success Stories, Recipes & Cooking

**RLS**: ✅ Anyone can view categories

#### forum_posts
- `id` (UUID, PK)
- `title`, `content` (TEXT)
- `author_id` (UUID, FK → users, CASCADE)
- `category_id` (UUID, FK → forum_categories, SET NULL)
- `created_at`, `updated_at` (TIMESTAMPTZ)
- `view_count` (INTEGER)
- `is_pinned`, `is_locked` (BOOLEAN)
- `tags` (TEXT[])

**Indexes**:
- `idx_forum_posts_category`
- `idx_forum_posts_author`
- `idx_forum_posts_created`
- `idx_forum_posts_search` (GIN, full-text)

**RLS Policies**:
- ✅ Anyone can view posts
- ✅ Authenticated users can create posts
- ✅ Users can update own posts
- ✅ Users can delete own posts

#### forum_replies
- `id` (UUID, PK)
- `post_id` (UUID, FK → forum_posts, CASCADE)
- `author_id` (UUID, FK → users, CASCADE)
- `content` (TEXT)
- `parent_reply_id` (UUID, FK → forum_replies, CASCADE) - Nested replies
- `created_at`, `updated_at` (TIMESTAMPTZ)
- `is_solution` (BOOLEAN)

**Indexes**:
- `idx_forum_replies_post`
- `idx_forum_replies_author`

**RLS Policies**:
- ✅ Anyone can view replies
- ✅ Authenticated users can create replies
- ✅ Users can update own replies
- ✅ Users can delete own replies

#### forum_likes
- `id` (UUID, PK)
- `user_id` (UUID, FK → users, CASCADE)
- `post_id` (UUID, FK → forum_posts, CASCADE)
- `reply_id` (UUID, FK → forum_replies, CASCADE)
- `created_at` (TIMESTAMPTZ)

**Constraints**:
- CHECK: Either post_id OR reply_id (not both)
- UNIQUE: (user_id, post_id)
- UNIQUE: (user_id, reply_id)

**Indexes**:
- `idx_forum_likes_post`
- `idx_forum_likes_reply`

**RLS Policies**:
- ✅ Anyone can view likes
- ✅ Authenticated users can like
- ✅ Users can unlike

### Document Library

#### documents
- `id` (UUID, PK)
- `title`, `content` (TEXT)
- `category` (TEXT)
- `author_id` (UUID, FK → users, CASCADE)
- `created_at`, `updated_at` (TIMESTAMPTZ)
- `view_count` (INTEGER)
- `is_published` (BOOLEAN)
- `tags` (TEXT[])
- `file_url`, `thumbnail_url` (TEXT)

**Indexes**:
- `idx_documents_category`
- `idx_documents_author`
- `idx_documents_created`

**RLS Policies**:
- ✅ Anyone can view published documents
- ✅ Authenticated users can create documents
- ✅ Users can update own documents
- ✅ Users can delete own documents

### Contact & Submissions

#### contact_submissions
- `id` (UUID, PK)
- `user_id` (UUID, FK → users, SET NULL)
- `name`, `email`, `phone`, `company`, `location` (TEXT)
- `facility_type` (TEXT)
- `room_count` (INTEGER)
- `timeline`, `budget`, `message` (TEXT)
- `submission_type` (TEXT) - Default: 'enterprise_quote'
- `status` (TEXT) - Default: 'new'
- `created_at`, `updated_at` (TIMESTAMPTZ)

**Indexes**:
- `idx_contact_submissions_status`
- `idx_contact_submissions_created_at`
- `idx_contact_submissions_user_id`

**RLS Policies**:
- ✅ Users can view own submissions
- ✅ Anyone can submit contact form

### Cultivation Management

#### mushroom_species_library
- Species information with cultivation parameters
- Extended columns: `image_url`, `fruiting_temp_min/max`, `colonization_days`, `fruiting_days`

**Index**: `idx_species_search` (GIN, full-text)

#### sops (Standard Operating Procedures)
- SOPs with success rates and equipment
- Extended columns: `success_rate`, `equipment_needed[]`, `safety_warnings[]`

**Index**: `idx_sops_search` (GIN, full-text)

#### contamination_guide
- Contamination identification guide
- Extended column: `affected_stages[]`

#### cultivation_projects
- User cultivation projects

**Indexes**:
- `idx_cultivation_projects_user_id`
- `idx_cultivation_projects_status`

#### environmental_readings
- Environmental monitoring data

**Index**: `idx_environmental_readings_project_id`

#### growth_observations
- Growth tracking data

**Index**: `idx_growth_observations_project_id`

#### harvest_records
- Harvest tracking data

**Index**: `idx_harvest_records_project_id`

## Database Schema Assessment

### Strengths ✅

1. **Comprehensive RLS Policies**: All user-facing tables have proper Row Level Security
2. **Good Indexing Strategy**: Performance indexes on foreign keys and search columns
3. **Full-Text Search**: GIN indexes for content search on forums, SOPs, species, knowledge base
4. **Proper Relationships**: Foreign keys with appropriate CASCADE/SET NULL actions
5. **Analytics Infrastructure**: Detailed AI usage tracking with views for reporting
6. **Subscription System**: Complete subscription and quota management
7. **Hierarchical Data**: Support for nested categories and replies
8. **Audit Trails**: created_at/updated_at timestamps on all tables

### Issues & Gaps ⚠️

#### 1. Missing Tables (Referenced in Code)
Based on the codebase inventory, these tables may be missing or not documented:
- **workbench_sessions** - For ML workbench feature
- **video_generations** - For video studio tracking
- **gpt_purchases** - For GPT module purchases (mentioned in script 007)
- **stripe_events** - For webhook event logging

#### 2. Incomplete RLS Policies
Several tables are missing RLS policies:
- ❌ `subscription_plans` - No RLS (should be read-only for users)
- ❌ `user_subscriptions` - No RLS (users should view own subscriptions)
- ❌ `usage_quotas` - No RLS (users should view own quotas)
- ❌ `ai_usage_analytics` - No RLS (users should view own analytics)
- ❌ `knowledge_categories` - No RLS
- ❌ `knowledge_articles` - No RLS (should check is_published)
- ❌ `knowledge_attachments` - No RLS
- ❌ `ai_training_data` - No RLS
- ❌ `mushroom_species_library` - No RLS
- ❌ `sops` - No RLS (premium content protection needed)
- ❌ `contamination_guide` - No RLS (premium content protection needed)
- ❌ `cultivation_projects` - No RLS
- ❌ `environmental_readings` - No RLS
- ❌ `growth_observations` - No RLS
- ❌ `harvest_records` - No RLS

#### 3. Missing Subscription Tier Enforcement
- RLS policies don't check subscription tier
- Premium content (SOPs, knowledge base, contamination guide) not protected by subscription level
- No database-level enforcement of feature access by tier

#### 4. Missing Indexes
Potential performance issues:
- No index on `users.subscription_tier`
- No index on `users.stripe_customer_id`
- No composite index on `user_subscriptions(user_id, status)`
- No index on `ai_usage_analytics.conversation_id`

#### 5. Data Integrity Concerns
- No CHECK constraints on subscription_tier values
- No CHECK constraints on subscription_status values
- No CHECK constraints on usage_quotas limits (should be >= 0)
- No validation on email formats in contact_submissions

#### 6. Missing Audit Tables
- No table for tracking admin actions
- No table for tracking subscription changes
- No table for tracking payment failures
- No table for tracking RLS policy violations

#### 7. Backup & Recovery
- No documented backup strategy
- No point-in-time recovery configuration
- No documented restore procedures

### Security Concerns 🔒

1. **Premium Content Exposure**: SOPs, knowledge base, and contamination guide lack subscription-based RLS
2. **User Data Exposure**: Usage quotas and analytics accessible without RLS
3. **Subscription Data**: User subscriptions not protected by RLS
4. **Admin Privileges**: No separate admin table or role-based access control

### Performance Concerns ⚡

1. **Missing Composite Indexes**: Some common query patterns not optimized
2. **Large JSONB Columns**: `features` in subscription_plans, `metadata` in ai_usage_analytics
3. **No Partitioning**: ai_usage_analytics will grow large over time
4. **No Archival Strategy**: Old data not archived

## Required Indexes Summary

### Existing Indexes ✅
- User ID indexes on all user-related tables
- Foreign key indexes
- Full-text search indexes (GIN)
- Created_at indexes for time-based queries

### Missing Indexes ⚠️
```sql
-- User subscription lookups
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);

-- Composite indexes for common queries
CREATE INDEX idx_user_subscriptions_user_status ON user_subscriptions(user_id, status);
CREATE INDEX idx_ai_usage_analytics_user_date ON ai_usage_analytics(user_id, created_at DESC);

-- Premium content access
CREATE INDEX idx_knowledge_articles_published ON knowledge_articles(is_published) WHERE is_published = true;
CREATE INDEX idx_sops_category ON sops(category);
```

## RLS Policy Recommendations

### Critical (Launch Blockers)
1. Add RLS to `usage_quotas` - users can only view/update own quotas
2. Add RLS to `user_subscriptions` - users can only view own subscriptions
3. Add RLS to `ai_usage_analytics` - users can only view own analytics
4. Add subscription tier checks to `sops`, `knowledge_articles`, `contamination_guide`

### High Priority
1. Add RLS to `cultivation_projects` and related tables
2. Add RLS to `knowledge_categories` and `knowledge_attachments`
3. Add admin-only policies for `subscription_plans`

### Medium Priority
1. Add RLS to `ai_training_data` (admin-only)
2. Add RLS to `mushroom_species_library` (read-only for all)

## Database Schema Score: 70/100

### Scoring Breakdown
- **Table Design**: 85/100 - Well-structured, good relationships
- **RLS Policies**: 50/100 - Many tables missing policies
- **Indexing**: 75/100 - Good coverage, some gaps
- **Data Integrity**: 65/100 - Missing constraints
- **Security**: 60/100 - Premium content not protected
- **Performance**: 70/100 - Good foundation, needs optimization
- **Documentation**: 60/100 - Scripts exist but no schema docs

### Launch Blockers
1. ❌ Premium content (SOPs, knowledge base) not protected by RLS
2. ❌ User subscription data not protected by RLS
3. ❌ Usage quotas not protected by RLS
4. ❌ No subscription tier enforcement in database

### Recommendations

#### Immediate (Pre-Launch)
1. Add RLS policies to all user-facing tables
2. Implement subscription tier checking in RLS policies
3. Add missing indexes for performance
4. Add CHECK constraints for data integrity
5. Create admin role and policies

#### Short-Term (Post-Launch)
1. Implement audit logging
2. Set up automated backups
3. Add partitioning to analytics tables
4. Create data archival strategy
5. Document schema and relationships

#### Long-Term
1. Implement database monitoring
2. Set up query performance tracking
3. Create data retention policies
4. Implement database versioning
5. Add database testing suite
