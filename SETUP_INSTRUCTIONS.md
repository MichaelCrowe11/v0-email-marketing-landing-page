# Quick Setup Instructions

## Prerequisites

- Node.js 18+ installed
- Azure account with OpenAI and Storage access
- Supabase account
- Stripe account
- Git installed

## 5-Minute Quick Start

### 1. Install Dependencies

```bash
cd v0-email-marketing-landing-page
npm install
npm install @azure/storage-blob
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

Required minimum variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_API_KEY`
- `AZURE_STORAGE_CONNECTION_STRING`
- `STRIPE_SECRET_KEY`

### 3. Setup Database

1. Go to [Supabase](https://supabase.com)
2. Open SQL Editor
3. Copy and run: `lib/supabase/schema.sql`

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## New Features Added

### Dataset Marketplace (`/datasets`)
- 3 dataset tiers: Research ($997), Professional ($9,997), Enterprise ($49,997)
- Azure Blob Storage integration for secure downloads
- Stripe checkout with webhook processing
- Download tracking and access control

### AI Model Access (`/ai-models`)
- Monthly subscriptions for Azure OpenAI models
- API key management
- Usage tracking and rate limiting
- Multiple model tiers (GPT-4o, GPT-4o-mini, etc.)

### Azure AI Foundry Integration
- Multi-agent orchestration
- Tool calling and function execution
- RAG (Retrieval Augmented Generation)
- Computer Vision integration

## File Structure

```
v0-email-marketing-landing-page/
├── app/
│   ├── datasets/                 # Dataset marketplace
│   │   ├── page.tsx             # Browse datasets
│   │   └── success/page.tsx     # Purchase confirmation
│   ├── ai-models/               # AI model subscriptions
│   │   ├── page.tsx             # Browse AI models
│   │   └── success/page.tsx     # Subscription confirmation
│   └── api/
│       ├── datasets/
│       │   ├── purchase/route.ts    # Purchase dataset
│       │   └── download/route.ts    # Download dataset
│       └── ai-models/
│           ├── subscribe/route.ts   # Subscribe to model
│           └── keys/route.ts        # Manage API keys
├── lib/
│   ├── datasets.ts                  # Dataset configuration
│   ├── ai-models-marketplace.ts     # AI models configuration
│   ├── azure-ai-config.ts           # Azure AI settings
│   ├── azure-ai-foundry-client.ts   # AI Foundry client
│   └── supabase/
│       └── schema.sql               # Database schema
└── PRODUCTION_DEPLOYMENT_GUIDE.md   # Full deployment guide
```

## Testing

### Test Dataset Purchase

```bash
# 1. Navigate to /datasets
# 2. Click "Purchase Dataset"
# 3. Use test card: 4242 4242 4242 4242
# 4. Verify success page appears
# 5. Check Supabase for purchase record
```

### Test AI Model Subscription

```bash
# 1. Navigate to /ai-models
# 2. Click "Subscribe Now"
# 3. Use test card: 4242 4242 4242 4242
# 4. Verify success page with API instructions
# 5. Check Supabase for subscription record
```

## Azure Storage Setup

Create storage containers:

```bash
az storage container create --name datasets-research --account-name YOUR_ACCOUNT
az storage container create --name datasets-professional --account-name YOUR_ACCOUNT
az storage container create --name datasets-enterprise --account-name YOUR_ACCOUNT
```

Upload your dataset packages:

```bash
az storage blob upload-batch \
  --source ./commercial_dataset_packages/research_edition \
  --destination datasets-research \
  --account-name YOUR_ACCOUNT
```

## Deployment to Vercel

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option 2: GitHub Integration

1. Push to GitHub
2. Import in Vercel dashboard
3. Add environment variables
4. Deploy

### Environment Variables in Vercel

Add all variables from `.env.example` to Vercel:
1. Go to Project Settings → Environment Variables
2. Add each variable
3. Redeploy

## Stripe Webhook Setup

### Development

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy webhook secret to STRIPE_WEBHOOK_SECRET
```

### Production

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy signing secret to Vercel

## Support

Questions? Email: michael@crowelogic.com

For detailed deployment: See `PRODUCTION_DEPLOYMENT_GUIDE.md`
