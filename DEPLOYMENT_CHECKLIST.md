# Crowe Mycology - Deployment Checklist

## Pre-Deployment

### Environment Variables Required
Add these to your Vercel project (Settings > Environment Variables):

**Database (Choose One):**
- [ ] `AZURE_SQL_CONNECTION_STRING` - For Azure SQL Database
- [ ] `SUPABASE_URL` + `SUPABASE_ANON_KEY` - For Supabase

**Authentication:**
- [ ] `AZURE_AUTH_SECRET` - 32+ character secret for JWT signing (if using Azure)
- [ ] `ADMIN_SETUP_KEY` - One-time key for creating admin account (remove after setup)

**AI Services:**
- [ ] `ANTHROPIC_API_KEY` - For Crowe Vision image analysis
- [ ] OpenAI/other AI keys are optional (uses Vercel AI Gateway by default)

**Payments (Optional):**
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_PUBLISHABLE_KEY`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Admin Account Setup

### Option 1: Via API (Recommended)
1. Set `ADMIN_SETUP_KEY` environment variable to a secure random string
2. Make a POST request to `/api/azure/auth/create-admin`:
   ```json
   {
     "setupKey": "your-admin-setup-key",
     "email": "michael@crowelogic.com",
     "password": "your-secure-password-12chars+",
     "name": "Michael Crowe"
   }
   ```
3. **IMPORTANT:** Remove `ADMIN_SETUP_KEY` from environment variables after setup

### Option 2: Via SQL Script
1. Run `scripts/013_final_admin_setup.sql` against your database
2. This creates/updates the admin account with full access

## Post-Deployment Verification

- [ ] Home page loads with Crowe avatar in hero
- [ ] Sidebar navigation works on desktop and mobile
- [ ] Theme toggle (light/dark) works
- [ ] AI Chat responds (test with simple question)
- [ ] Crowe Vision page loads (test image upload)
- [ ] Species Library shows fallback data
- [ ] Contamination Guide shows reference data
- [ ] Login/Signup flows work
- [ ] Admin can access all features

## Features by Tier

| Feature | Free | Pro | Expert | Master |
|---------|------|-----|--------|--------|
| AI Chat | 50/mo | Unlimited | Unlimited | Unlimited |
| Crowe Vision | 5/mo | Unlimited | Unlimited | Unlimited |
| Species Library | Yes | Yes | Yes | Yes |
| Contamination Guide | Yes | Yes | Yes | Yes |
| Forum Access | Read | Full | Full | Full |
| GPT Modules | No | No | All | All |
| 1-on-1 Consulting | No | No | No | Quarterly |
| API Access | No | No | No | Yes |

## Support

- Technical Issues: Create GitHub issue
- Business Inquiries: michael@crowelogic.com
- Emergency: Contact Michael directly
