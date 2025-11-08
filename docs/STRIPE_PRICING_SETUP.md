# Stripe Pricing Configuration

## Current Pricing Structure

### Pro Access - $97/month or $997/year
**Features:**
- Unlimited AI chat with 11 models
- Crowe Vision contamination analysis
- Forum with AI assistance
- Complete knowledge base (61+ articles)
- Environmental monitoring tools
- Species library & SOPs
- Cultivation project tracking
- Email support

**Stripe Products to Create:**
1. **Product Name:** Crowe Logic Pro Access
2. **Monthly Price:** $97/month (recurring)
3. **Yearly Price:** $997/year (recurring) - Save $167

### Expert Access - $197/month or $1,997/year
**Features:**
- Everything in Pro Access
- All GPT modules included ($391 value)
- Priority support
- Monthly group consulting calls
- Early access to new features
- Advanced analytics dashboard
- Custom cultivation templates
- Direct expert consultation

**Stripe Products to Create:**
1. **Product Name:** Crowe Logic Expert Access
2. **Monthly Price:** $197/month (recurring)
3. **Yearly Price:** $1,997/year (recurring) - Save $367

## Setup Instructions

### 1. Create Stripe Products

Go to your Stripe Dashboard → Products → Create Product

**For Pro Access Monthly:**
\`\`\`
Product Name: Crowe Logic Pro Access (Monthly)
Description: Complete platform access with AI-powered cultivation tools
Price: $97/month (recurring)
\`\`\`

**For Pro Access Yearly:**
\`\`\`
Product Name: Crowe Logic Pro Access (Yearly)
Description: Complete platform access with AI-powered cultivation tools
Price: $997/year (recurring)
\`\`\`

**For Expert Access Monthly:**
\`\`\`
Product Name: Crowe Logic Expert Access (Monthly)
Description: Everything in Pro plus all GPT modules and priority support
Price: $197/month (recurring)
\`\`\`

**For Expert Access Yearly:**
\`\`\`
Product Name: Crowe Logic Expert Access (Yearly)
Description: Everything in Pro plus all GPT modules and priority support
Price: $1,997/year (recurring)
\`\`\`

### 2. Get Price IDs

After creating each product, copy the Price ID (starts with `price_`):
- Pro Monthly: `price_xxxxxxxxxxxxx`
- Pro Yearly: `price_xxxxxxxxxxxxx`
- Expert Monthly: `price_xxxxxxxxxxxxx`
- Expert Yearly: `price_xxxxxxxxxxxxx`

### 3. Update Database

Run this SQL in your Supabase SQL Editor:

\`\`\`sql
-- Update Pro Access plan
UPDATE subscription_plans
SET stripe_price_id = 'price_YOUR_PRO_MONTHLY_ID'
WHERE plan_name = 'Pro Access' AND price_monthly = 97;

-- Update Expert Access plan
UPDATE subscription_plans
SET stripe_price_id = 'price_YOUR_EXPERT_MONTHLY_ID'
WHERE plan_name = 'Expert Access' AND price_monthly = 197;
\`\`\`

### 4. Configure Checkout

The checkout page at `/checkout` will automatically use these price IDs when users select a plan.

### 5. Test the Flow

1. Go to `/pricing`
2. Select a plan (Pro or Expert)
3. Choose billing cycle (monthly or yearly)
4. Click "Start [Plan] Access"
5. Complete Stripe checkout
6. Verify subscription is created in database

## Webhook Configuration

Set up a webhook endpoint in Stripe Dashboard:
- URL: `https://your-domain.com/api/webhooks/stripe`
- Events to listen for:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

## Verification

After setup, verify:
1. Stripe products are created with correct prices
2. Database has price IDs updated
3. Checkout flow works end-to-end
4. Webhooks are receiving events
5. User subscriptions are being created/updated correctly
