# Production Deployment Guide

## Required Environment Variables

Before deploying to production, ensure all environment variables are set in your Vercel project:

### Critical Variables to Add

1. **NEXT_PUBLIC_SITE_URL** (Required)
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com` (your actual domain)
   - Used for: Stripe checkout redirects, OAuth callbacks

2. **STRIPE_WEBHOOK_SECRET** (Required for Production)
   - Get from Stripe Dashboard → Developers → Webhooks
   - Used to verify webhook signatures from Stripe
   - Critical for secure payment processing

### Already Configured (Verify in Vercel Dashboard)

✅ **Stripe Integration**
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_MCP_KEY`

✅ **Supabase Authentication & Database**
- `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`

✅ **Database (Postgres via Supabase)**
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`
- `POSTGRES_HOST`

✅ **Vercel Services**
- `BLOB_READ_WRITE_TOKEN`
- `CDP_WEBSOCKET_URL`

✅ **AI & API Services**
- `ONKERNEL_API_KEY`
- `OPENWEATHER_API_KEY`
- `AZURE_AI_ENDPOINT`
- `AZURE_AI_API_KEY`
- `AI_GATEWAY_API_KEY`
- `OPENAI_API_KEY`

## How to Add Environment Variables

### Option 1: Via v0 Interface (Recommended)
1. Click the sidebar icon on the left
2. Select "Vars" section
3. Add the missing variable:
   - `STRIPE_WEBHOOK_SECRET`
4. Save changes

### Option 2: Via Vercel Dashboard
1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with appropriate values
4. Select environments (Production, Preview, Development)
5. Save and redeploy

## Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Add `STRIPE_WEBHOOK_SECRET` in Vercel
- [ ] Verify `NEXT_PUBLIC_SITE_URL` is set to production domain
- [ ] Verify all Stripe keys are production keys (not test keys)
- [ ] Confirm Supabase URLs point to production database
- [ ] Test all API integrations with production credentials

### 2. Authentication Setup
- [ ] Run SQL scripts to set up admin user (michael@crowelogic.com)
- [ ] Test Supabase sign-up and sign-in flows
- [ ] Verify protected routes redirect correctly
- [ ] Test password reset flow

### 3. Database Setup
- [ ] Run all SQL migration scripts in production Supabase:
  - `001-add-admin-role.sql` - Adds admin functionality
  - `002-add-usage-tracking.sql` - Sets up usage tracking
  - `003-add-increment-usage-function.sql` - Adds usage functions
- [ ] Verify Row Level Security (RLS) policies are enabled
- [ ] Test authentication flow end-to-end
- [ ] Backup production database before deployment

### 4. Stripe Configuration
- [ ] Switch from Stripe test mode to live mode
- [ ] Create webhook endpoint in Stripe dashboard:
  - URL: `https://yourdomain.com/api/webhooks/stripe`
  - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
- [ ] Copy webhook secret to `STRIPE_WEBHOOK_SECRET` env var
- [ ] Test checkout flow with real payment methods
- [ ] Verify subscription webhooks are working

### 5. Usage Tracking & Metering
- [ ] Verify usage tracking tables are created
- [ ] Test quota enforcement for different subscription tiers
- [ ] Monitor Stripe metering for usage-based billing
- [ ] Set up alerts for quota violations

### 6. Code Quality
- [ ] Run `pnpm run lint` and fix all errors
- [ ] Run TypeScript type checking
- [ ] Test all critical user flows
- [ ] Review console for any errors or warnings

### 7. Performance & Security
- [ ] Enable image optimization (already configured)
- [ ] Verify security headers are set (already configured)
- [ ] Test site performance with Lighthouse
- [ ] Enable Vercel Analytics (already installed)

## Deployment Steps

1. **Add Missing Environment Variables**
   - Add `STRIPE_WEBHOOK_SECRET` via v0 Vars section or Vercel Dashboard
   - Verify all other variables are present

2. **Run Database Migrations**
   - Execute SQL scripts in Supabase SQL Editor or via v0 interface
   - Verify tables and functions are created successfully

3. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   \`\`\`

4. **Deploy via Vercel**
   - Click "Publish" button in v0 interface, or
   - Deploy automatically via GitHub integration

5. **Post-Deployment Verification**
   - [ ] Test Supabase authentication (sign up, login, logout)
   - [ ] Test admin access with michael@crowelogic.com
   - [ ] Test Stripe checkout flow
   - [ ] Verify usage tracking is working
   - [ ] Verify all protected routes work correctly
   - [ ] Check API routes are responding
   - [ ] Test on mobile devices
   - [ ] Monitor error logs in Vercel dashboard

## Monitoring

After deployment, monitor:
- **Vercel Analytics** - Traffic and performance metrics
- **Supabase Dashboard** - Database queries, authentication, and performance
- **Stripe Dashboard** - Payment and subscription activity, usage metering
- **Vercel Logs** - Runtime errors and warnings
- **Usage Tracking** - Monitor API usage and quota enforcement

## Troubleshooting

### Supabase Authentication Issues
- Verify Supabase URL and anon key are correct
- Check RLS policies aren't blocking authentication
- Ensure redirect URLs are configured in Supabase dashboard
- Test with email confirmation disabled for development

### Stripe Payment Issues
- Verify you're using live keys (not test keys)
- Check webhook endpoint is configured correctly
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Test with Stripe test cards first
- Check webhook logs in Stripe dashboard

### Database Connection Issues
- Verify Supabase connection strings are correct
- Check RLS policies aren't blocking queries
- Monitor connection pool usage
- Verify SQL migrations ran successfully

### Usage Tracking Issues
- Check if usage tracking tables exist
- Verify increment_usage function is working
- Monitor quota enforcement logic
- Check Stripe metering API calls

## Rollback Plan

If issues occur:
1. Revert to previous deployment in Vercel dashboard
2. Check error logs to identify the issue
3. Fix in development and redeploy
4. Restore database backup if needed

## Support

- **Vercel Support**: https://vercel.com/help
- **Stripe Support**: https://support.stripe.com
- **Supabase Support**: https://supabase.com/support
