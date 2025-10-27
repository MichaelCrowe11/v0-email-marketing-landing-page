# AI Model Configuration

## Overview

The platform now supports 30+ AI models across 10 providers with intelligent routing and subscription-based access control.

## Default Model

**Default:** `openai/gpt-4o-mini` (Free AI Gateway model)
- Fast and efficient
- No subscription required
- $0.15/$0.60 per 1M tokens (with 25% markup)

## Azure AI Custom Assistant

**Model:** `azure/crowelogic`
**Access:** Expert and Master tiers only
**Features:**
- Custom trained on cultivation data
- Specialized knowledge base
- Premium support

### Subscription Requirements

| Tier | Azure AI Access | AI Gateway Models |
|------|----------------|-------------------|
| Free | ❌ No | ✅ Limited (rate-limited) |
| Pro | ❌ No | ✅ Unlimited |
| Expert | ✅ Yes | ✅ Unlimited |
| Master | ✅ Yes | ✅ Unlimited |

## AI Gateway Models (All Tiers)

All users can access these models through the AI Gateway:

### OpenAI
- GPT-4o (smartest)
- GPT-4o Mini (fastest)
- GPT-4 Turbo
- o1 (reasoning)
- o3 Mini (new)

### Anthropic
- Claude 3.5 Sonnet (smartest)
- Claude 3.5 Haiku (fastest)
- Claude 3 Opus

### xAI
- Grok Beta
- Grok 2 (new)

### Google
- Gemini 2.0 Flash (new, free)
- Gemini 1.5 Pro
- Gemini 1.5 Flash (fastest)

### Meta Llama
- Llama 3.3 70B (new)
- Llama 3.1 405B
- Llama 3.1 70B (balanced)
- Llama 3.2 90B Vision

### Mistral
- Mistral Large
- Mistral Medium (balanced)
- Mistral Small (fastest)

### Cohere
- Command R+
- Command R (balanced)

### DeepSeek
- DeepSeek V3 (new)
- DeepSeek Coder

### Groq (Ultra-Fast)
- Llama 3.3 70B (fastest)
- Llama 3.1 70B (fastest)
- Mixtral 8x7B (fastest)

## Usage Tracking

All AI requests are tracked with:
- Input/output token counts
- Provider costs
- 25% markup
- User charges
- Model metadata

View analytics in the dashboard to monitor:
- Total tokens used
- Cost per model
- Revenue generated
- Profit margins

## Pricing Strategy

**Markup:** 25% on all models
**Minimum Charge:** $0.001 per request
**Free Trial:** 100k tokens for new users

### Example Costs (with markup)

| Model | Input (1M tokens) | Output (1M tokens) |
|-------|------------------|-------------------|
| GPT-4o Mini | $0.19 | $0.75 |
| GPT-4o | $3.13 | $12.50 |
| Claude 3.5 Sonnet | $3.75 | $18.75 |
| Gemini 2.0 Flash | FREE | FREE |
| Azure Custom | $6.25 | $18.75 |

## Configuration

### Environment Variables

\`\`\`env
# Azure AI (Optional - for custom assistant)
AZURE_AI_API_KEY=your_azure_key
AZURE_AI_ENDPOINT=your_azure_endpoint

# AI Gateway (Recommended)
AI_GATEWAY_API_KEY=your_gateway_key

# Direct OpenAI (Fallback)
OPENAI_API_KEY=your_openai_key
\`\`\`

### Subscription Tiers

Configure in `lib/subscription.ts`:
- Free: AI Gateway models (rate-limited)
- Pro: Unlimited AI Gateway access
- Expert: Azure AI + Unlimited AI Gateway
- Master: Azure AI + Unlimited AI Gateway + Priority

## Testing

1. **Free User:** Should see all AI Gateway models, Azure hidden
2. **Pro User:** Should see all AI Gateway models, Azure hidden
3. **Expert User:** Should see all models including Azure
4. **Master User:** Should see all models including Azure

Test with different subscription tiers to verify access control.
