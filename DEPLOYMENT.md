# Production Deployment Guide

## Required Environment Variables

Before deploying to production, ensure all environment variables are set in your Vercel project:

### Critical Variables to Add

1. **NEXT_PUBLIC_SITE_URL** (Required)
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com` (your actual domain)
   - Used for: Stripe checkout redirects, OAuth callbacks

2. **Clerk Authentication** (Required)
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Get from Clerk Dashboard
   - `CLERK_SECRET_KEY` - Get from Clerk Dashboard
   - Optional routing variables (see .env.example)

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
3. Add the missing variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. Save changes

### Option 2: Via Vercel Dashboard
1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with appropriate values
4. Select environments (Production, Preview, Development)
5. Save and redeploy

## Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in Vercel
- [ ] Add `CLERK_SECRET_KEY` in Vercel
- [ ] Verify `NEXT_PUBLIC_SITE_URL` is set to production domain
- [ ] Verify all Stripe keys are production keys (not test keys)
- [ ] Confirm Supabase URLs point to production database
- [ ] Test all API integrations with production credentials

### 2. Authentication Setup
- [ ] Create Clerk application at https://clerk.com
- [ ] Configure allowed redirect URLs in Clerk Dashboard
- [ ] Test sign-up and sign-in flows
- [ ] Verify protected routes redirect correctly

### 3. Database Setup
- [ ] Run all SQL migration scripts in production Supabase
- [ ] Verify Row Level Security (RLS) policies are enabled
- [ ] Test authentication flow end-to-end
- [ ] Backup production database before deployment

### 4. Stripe Configuration
- [ ] Switch from Stripe test mode to live mode
- [ ] Update webhook endpoints in Stripe dashboard
- [ ] Test checkout flow with real payment methods
- [ ] Verify subscription webhooks are working

### 5. Code Quality
- [ ] Run `npm run lint` and fix all errors
- [ ] Run TypeScript type checking
- [ ] Test all critical user flows
- [ ] Review console for any errors or warnings

### 6. Performance & Security
- [ ] Enable image optimization (already configured)
- [ ] Verify security headers are set (already configured)
- [ ] Test site performance with Lighthouse
- [ ] Enable Vercel Analytics (already installed)

## Deployment Steps

1. **Add Missing Environment Variables**
   - Add Clerk keys via v0 Vars section or Vercel Dashboard
   - Verify all other variables are present

2. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   \`\`\`

3. **Deploy via Vercel**
   - Click "Publish" button in v0 interface, or
   - Deploy automatically via GitHub integration

4. **Post-Deployment Verification**
   - [ ] Test Clerk authentication (sign up, login, logout)
   - [ ] Test Stripe checkout flow
   - [ ] Verify all protected routes work correctly
   - [ ] Check API routes are responding
   - [ ] Test on mobile devices
   - [ ] Monitor error logs in Vercel dashboard

## Monitoring

After deployment, monitor:
- **Vercel Analytics** - Traffic and performance metrics
- **Clerk Dashboard** - User authentication activity
- **Stripe Dashboard** - Payment and subscription activity
- **Supabase Dashboard** - Database queries and performance
- **Vercel Logs** - Runtime errors and warnings

## Troubleshooting

### Clerk Authentication Issues
- Verify publishable key starts with `pk_`
- Verify secret key starts with `sk_`
- Check allowed redirect URLs in Clerk Dashboard
- Ensure middleware is protecting the correct routes

### Stripe Payment Issues
- Verify you're using live keys (not test keys)
- Check webhook endpoint is configured correctly
- Test with Stripe test cards first

### Database Connection Issues
- Verify Supabase connection strings are correct
- Check RLS policies aren't blocking queries
- Monitor connection pool usage

## Rollback Plan

If issues occur:
1. Revert to previous deployment in Vercel dashboard
2. Check error logs to identify the issue
3. Fix in development and redeploy

## Support

- **Vercel Support**: https://vercel.com/help
- **Clerk Support**: https://clerk.com/support
- **Stripe Support**: https://support.stripe.com
- **Supabase Support**: https://supabase.com/support
