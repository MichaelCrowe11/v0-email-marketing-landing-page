# Production Deployment Guide

## Required Environment Variables

Before deploying to production, ensure all environment variables are set in your Vercel project:

### Critical Variables to Add/Update

1. **NEXT_PUBLIC_SITE_URL** (Required)
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com` (your actual domain)
   - Used for: Stripe checkout redirects, OAuth callbacks

### Already Configured (Verify in Vercel Dashboard)

✅ **Stripe Integration**
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_MCP_KEY`

✅ **Supabase Integration**
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

✅ **Other Services**
- `ONKERNEL_API_KEY`
- `BLOB_READ_WRITE_TOKEN`
- `OPENWEATHER_API_KEY`
- `AZURE_AI_ENDPOINT`
- `AZURE_AI_API_KEY`
- `AI_GATEWAY_API_KEY`
- `OPENAI_API_KEY`

## Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Add `NEXT_PUBLIC_SITE_URL` in Vercel project settings
- [ ] Verify all Stripe keys are production keys (not test keys)
- [ ] Confirm Supabase URLs point to production database
- [ ] Test all API integrations with production credentials

### 2. Database Setup
- [ ] Run all SQL migration scripts in production Supabase
- [ ] Verify Row Level Security (RLS) policies are enabled
- [ ] Test authentication flow end-to-end
- [ ] Backup production database before deployment

### 3. Stripe Configuration
- [ ] Switch from Stripe test mode to live mode
- [ ] Update webhook endpoints in Stripe dashboard
- [ ] Test checkout flow with real payment methods
- [ ] Verify subscription webhooks are working

### 4. Code Quality
- [ ] Run `npm run lint` and fix all errors
- [ ] Run TypeScript type checking
- [ ] Test all critical user flows
- [ ] Review console for any errors or warnings

### 5. Performance & Security
- [ ] Enable image optimization (already configured)
- [ ] Verify security headers are set (already configured)
- [ ] Test site performance with Lighthouse
- [ ] Enable Vercel Analytics (already installed)

## Deployment Steps

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   \`\`\`

2. **Deploy via Vercel**
   - Click "Publish" button in v0 interface, or
   - Deploy automatically via GitHub integration

3. **Post-Deployment Verification**
   - [ ] Test authentication (sign up, login, logout)
   - [ ] Test Stripe checkout flow
   - [ ] Verify all pages load correctly
   - [ ] Check API routes are responding
   - [ ] Test on mobile devices
   - [ ] Monitor error logs in Vercel dashboard

## Monitoring

After deployment, monitor:
- Vercel Analytics for traffic and performance
- Stripe Dashboard for payment activity
- Supabase Dashboard for database queries
- Vercel Logs for runtime errors

## Rollback Plan

If issues occur:
1. Revert to previous deployment in Vercel dashboard
2. Check error logs to identify the issue
3. Fix in development and redeploy

## Support

- Vercel Support: https://vercel.com/help
- Stripe Support: https://support.stripe.com
- Supabase Support: https://supabase.com/support
