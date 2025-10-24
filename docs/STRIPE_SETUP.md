# Stripe Setup Guide

This guide will help you set up Stripe products for your subscription plans and connect them to your database.

## Overview

You need to create 6 subscription products in Stripe:

1. **Free Trial** - 7-day trial (no charge)
2. **Pro Monthly** - $97/month
3. **Pro Yearly** - $997/year (save $167)
4. **Expert Monthly** - $197/month
5. **Expert Yearly** - $1,997/year (save $367)
6. **Lifetime Access** - $2,997 one-time

## Step 1: Access Stripe Dashboard

1. Go to https://dashboard.stripe.com
2. Make sure you're in **Test Mode** (toggle in top right)
3. Navigate to **Products** in the left sidebar

## Step 2: Create Subscription Products

### Product 1: Pro Access (Monthly)

1. Click **+ Add product**
2. Fill in details:
   - **Name:** Crowe Logic AI - Pro Access (Monthly)
   - **Description:** Unlimited AI chat, Crowe Vision, forum access, knowledge base, environmental monitoring tools, species library & SOPs
   - **Pricing model:** Standard pricing
   - **Price:** $97.00 USD
   - **Billing period:** Monthly
   - **Payment type:** Recurring
3. Click **Save product**
4. **Copy the Price ID** (starts with `price_...`) - you'll need this later

### Product 2: Pro Access (Yearly)

1. Click **+ Add product**
2. Fill in details:
   - **Name:** Crowe Logic AI - Pro Access (Yearly)
   - **Description:** Same as monthly, billed annually. Save $167/year!
   - **Pricing model:** Standard pricing
   - **Price:** $997.00 USD
   - **Billing period:** Yearly
   - **Payment type:** Recurring
3. Click **Save product**
4. **Copy the Price ID**

### Product 3: Expert Access (Monthly)

1. Click **+ Add product**
2. Fill in details:
   - **Name:** Crowe Logic AI - Expert Access (Monthly)
   - **Description:** Everything in Pro + All GPT modules included ($391 value), priority support, monthly group consulting calls, early access to new features
   - **Pricing model:** Standard pricing
   - **Price:** $197.00 USD
   - **Billing period:** Monthly
   - **Payment type:** Recurring
3. Click **Save product**
4. **Copy the Price ID**

### Product 4: Expert Access (Yearly)

1. Click **+ Add product**
2. Fill in details:
   - **Name:** Crowe Logic AI - Expert Access (Yearly)
   - **Description:** Same as monthly, billed annually. Save $367/year!
   - **Pricing model:** Standard pricing
   - **Price:** $1,997.00 USD
   - **Billing period:** Yearly
   - **Payment type:** Recurring
3. Click **Save product**
4. **Copy the Price ID**

### Product 5: Free Trial

1. Click **+ Add product**
2. Fill in details:
   - **Name:** Crowe Logic AI - Free Trial
   - **Description:** 7-day free trial with full platform access
   - **Pricing model:** Standard pricing
   - **Price:** $0.00 USD
   - **Billing period:** Weekly
   - **Payment type:** Recurring
   - **Trial period:** 7 days
3. Click **Save product**
4. **Copy the Price ID**

### Product 6: Lifetime Access (Optional)

1. Click **+ Add product**
2. Fill in details:
   - **Name:** Crowe Logic AI - Lifetime Access
   - **Description:** One-time payment for lifetime platform access
   - **Pricing model:** Standard pricing
   - **Price:** $2,997.00 USD
   - **Payment type:** One-time
3. Click **Save product**
4. **Copy the Price ID**

## Step 3: Update Database with Price IDs

Now you need to add the Stripe Price IDs to your database.

### Option A: Using Supabase SQL Editor

1. Go to Supabase SQL Editor
2. Run this SQL (replace the `price_xxx` values with your actual Price IDs):

\`\`\`sql
-- Update subscription plans with Stripe Price IDs
UPDATE subscription_plans 
SET stripe_price_id = 'price_xxxxxxxxxxxxx'  -- Your Pro Monthly Price ID
WHERE plan_id = 'pro_monthly';

UPDATE subscription_plans 
SET stripe_price_id = 'price_xxxxxxxxxxxxx'  -- Your Pro Yearly Price ID
WHERE plan_id = 'pro_yearly';

UPDATE subscription_plans 
SET stripe_price_id = 'price_xxxxxxxxxxxxx'  -- Your Expert Monthly Price ID
WHERE plan_id = 'expert_monthly';

UPDATE subscription_plans 
SET stripe_price_id = 'price_xxxxxxxxxxxxx'  -- Your Expert Yearly Price ID
WHERE plan_id = 'expert_yearly';

UPDATE subscription_plans 
SET stripe_price_id = 'price_xxxxxxxxxxxxx'  -- Your Free Trial Price ID
WHERE plan_id = 'free_trial';

UPDATE subscription_plans 
SET stripe_price_id = 'price_xxxxxxxxxxxxx'  -- Your Lifetime Price ID (if created)
WHERE plan_id = 'lifetime';

-- Verify the updates
SELECT plan_id, name, price, stripe_price_id 
FROM subscription_plans 
ORDER BY price;
\`\`\`

### Option B: Using Supabase Table Editor

1. Go to **Table Editor** in Supabase
2. Select the `subscription_plans` table
3. For each row, click to edit and paste the corresponding Stripe Price ID
4. Save each row

## Step 4: Configure Stripe Webhooks

Webhooks allow Stripe to notify your app about subscription events.

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **+ Add endpoint**
3. Enter your endpoint URL:
   \`\`\`
   https://your-vercel-app.vercel.app/api/webhooks/stripe
   \`\`\`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. **Copy the Signing Secret** (starts with `whsec_...`)

## Step 5: Add Webhook Secret to Environment Variables

1. In v0, go to the **Vars** section in the sidebar
2. Add a new environment variable:
   - **Key:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** `whsec_xxxxxxxxxxxxx` (your webhook signing secret)
3. Save

## Step 6: Test the Integration

### Test in Stripe Test Mode

1. Go to your pricing page: `https://your-app.vercel.app/pricing`
2. Click **Get Started** on Pro Access
3. Use Stripe test card: `4242 4242 4242 4242`
4. Expiry: Any future date
5. CVC: Any 3 digits
6. Complete the checkout

### Verify in Database

After test checkout, check your database:

\`\`\`sql
-- Check if subscription was created
SELECT * FROM user_subscriptions 
ORDER BY created_at DESC 
LIMIT 1;

-- Check user's subscription status
SELECT u.email, us.plan_id, us.status, us.current_period_end
FROM users u
JOIN user_subscriptions us ON u.id = us.user_id
ORDER BY us.created_at DESC;
\`\`\`

## Step 7: Go Live (When Ready)

When you're ready to accept real payments:

1. Complete Stripe account verification
2. Switch to **Live Mode** in Stripe Dashboard
3. Recreate all products in Live Mode (repeat Step 2)
4. Update database with Live Mode Price IDs (repeat Step 3)
5. Create new webhook endpoint for Live Mode (repeat Step 4)
6. Update `STRIPE_WEBHOOK_SECRET` with Live Mode secret
7. Update `STRIPE_SECRET_KEY` with Live Mode key in v0 Vars

## Troubleshooting

### Checkout redirects but no subscription created

- Check webhook is configured correctly
- Verify webhook secret is in environment variables
- Check Stripe webhook logs for errors

### "Invalid price ID" error

- Ensure you copied the Price ID correctly (starts with `price_`)
- Verify you're using Test Mode price IDs in Test Mode
- Check the price ID exists in your Stripe dashboard

### Subscription shows as "incomplete"

- Payment may have failed
- Check Stripe dashboard for payment status
- User may need to update payment method

## Price ID Reference Template

Keep this for your records:

\`\`\`
Pro Monthly:    price_xxxxxxxxxxxxx
Pro Yearly:     price_xxxxxxxxxxxxx
Expert Monthly: price_xxxxxxxxxxxxx
Expert Yearly:  price_xxxxxxxxxxxxx
Free Trial:     price_xxxxxxxxxxxxx
Lifetime:       price_xxxxxxxxxxxxx
\`\`\`

## Next Steps

After Stripe setup:

1. **Test the full flow** - Sign up, subscribe, access features
2. **Test cancellation** - Make sure users can cancel subscriptions
3. **Test upgrades** - Verify users can upgrade from Pro to Expert
4. **Monitor webhooks** - Check Stripe webhook logs regularly
5. **Set up billing portal** - Allow users to manage their subscriptions

## Support

For Stripe-specific issues:
- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com

For integration issues:
- Check v0 debug logs
- Verify environment variables are set correctly
- Test webhook endpoint is accessible
