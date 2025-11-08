# AI Usage Tracking & Monetization System

## Overview

Your platform now has a comprehensive AI usage tracking and monetization system with 30+ models from 10 providers.

## Features Implemented

### 1. Full AI Gateway Catalog (30+ Models)

**Providers:**
- **Azure** - Your custom Crowe Logic Assistant
- **OpenAI** - GPT-4o, GPT-4o Mini, GPT-4 Turbo, o1, o3 Mini
- **Anthropic** - Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus
- **xAI** - Grok Beta, Grok 2
- **Google** - Gemini 2.0 Flash, Gemini 1.5 Pro, Gemini 1.5 Flash
- **Meta** - Llama 3.3 70B, Llama 3.1 405B/70B, Llama 3.2 90B Vision
- **Mistral** - Mistral Large, Medium, Small
- **Cohere** - Command R+, Command R
- **DeepSeek** - DeepSeek V3, DeepSeek Coder
- **Groq** - Ultra-fast inference for Llama and Mixtral models

### 2. Automatic Cost Tracking

Every AI request is tracked with:
- Input tokens used
- Output tokens used
- Provider cost (what you pay)
- Markup (your profit)
- User charge (what they pay)
- Model used
- Timestamp

### 3. Profit Margin System

**Current Configuration:**
- 25% markup on all models
- Minimum charge: $0.001 per request
- Free trial: 100,000 tokens for new users

**Example Pricing:**
- GPT-4o Mini: $0.15-$0.60 per 1M tokens → You charge $0.19-$0.75
- Claude 3.5 Sonnet: $3.00-$15.00 per 1M tokens → You charge $3.75-$18.75
- Your profit: 25% on every request

### 4. Usage Analytics

**Database Tables:**
- `ai_usage_analytics` - Detailed per-request tracking
- `user_ai_usage_summary` - Daily summaries by user
- `model_popularity` - Most used models
- `ai_revenue_analytics` - Revenue and profit tracking

**Analytics Views:**
\`\`\`sql
-- See which models are most popular
SELECT * FROM model_popularity;

-- See daily revenue and profit
SELECT * FROM ai_revenue_analytics;

-- See user usage patterns
SELECT * FROM user_ai_usage_summary WHERE user_id = 'xxx';
\`\`\`

### 5. Model Routing

The system automatically routes to the correct provider:
- `azure/*` → Your Azure AI endpoint
- Everything else → AI Gateway (OpenAI, Anthropic, etc.)

## Revenue Projections

**Conservative Estimates (100 active users):**
- Average 1,000 messages/day across platform
- Average cost per message: $0.002
- Daily revenue: $2.00
- Monthly revenue: $60
- **Your profit (25%): $15/month**

**Growth Scenario (1,000 active users):**
- Average 10,000 messages/day
- Daily revenue: $20.00
- Monthly revenue: $600
- **Your profit (25%): $150/month**

**Scale Scenario (10,000 active users from YouTube):**
- Average 100,000 messages/day
- Daily revenue: $200.00
- Monthly revenue: $6,000
- **Your profit (25%): $1,500/month**

## How to Monitor Usage

### 1. Check Total Usage
\`\`\`sql
SELECT 
  COUNT(*) as total_requests,
  SUM(total_tokens) as total_tokens,
  SUM(user_charge_usd) as total_revenue,
  SUM(markup_usd) as total_profit
FROM ai_usage_analytics;
\`\`\`

### 2. Check by Model
\`\`\`sql
SELECT * FROM model_popularity LIMIT 10;
\`\`\`

### 3. Check Daily Revenue
\`\`\`sql
SELECT * FROM ai_revenue_analytics 
WHERE date >= NOW() - INTERVAL '7 days'
ORDER BY date DESC;
\`\`\`

### 4. Check User Usage
\`\`\`sql
SELECT 
  u.email,
  COUNT(*) as requests,
  SUM(a.total_tokens) as tokens,
  SUM(a.user_charge_usd) as spent
FROM ai_usage_analytics a
JOIN users u ON a.user_id = u.id
GROUP BY u.email
ORDER BY spent DESC
LIMIT 20;
\`\`\`

## Adjusting Pricing

To change the markup percentage, edit `/lib/ai-models.ts`:

\`\`\`typescript
export const PRICING_CONFIG = {
  markupPercentage: 25, // Change this (e.g., 30 for 30% profit)
  minimumCharge: 0.001,
  freeTrialTokens: 100000,
}
\`\`\`

## Next Steps

1. **Run the SQL script** to create analytics tables
2. **Test different models** to see costs
3. **Monitor usage** for the first week
4. **Adjust pricing** based on actual usage patterns
5. **Create usage dashboard** for users to see their spending
6. **Add billing alerts** when users exceed quotas

## Model Recommendations

**For Most Users:**
- GPT-4o Mini - Best balance of cost and quality
- Claude 3.5 Haiku - Fast and affordable
- Gemini 1.5 Flash - Very cheap, good quality

**For Power Users:**
- GPT-4o - Best overall quality
- Claude 3.5 Sonnet - Best for long context
- o1 - Best for complex reasoning

**For Speed:**
- Groq models - Ultra-fast inference
- Gemini 2.0 Flash - Fast and free (currently)

Your platform is now set up to generate passive income from AI usage while providing users with access to the best models available.
