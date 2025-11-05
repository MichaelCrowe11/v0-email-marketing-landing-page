# Railway Deployment Guide

This guide will help you deploy your Crowe Logic AI platform to Railway with automatic environment variable management.

## Why Railway Over Vercel?

Railway is better suited for this application because:
- **Better support for server-side operations**: Railway provides a full Node.js environment
- **More flexible deployment options**: Better control over build and runtime configuration
- **Cost-effective for compute-heavy applications**: More suitable for AI/ML workloads
- **WebSocket support**: Better real-time communication capabilities
- **No serverless cold starts**: Always-on deployments for better performance

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Railway CLI**: Will be installed automatically by the deployment script
3. **Azure Key Vault Access**: For fetching additional secrets (optional)

## Quick Start

### Option 1: Automated Deployment (Recommended)

#### Windows (PowerShell):
```powershell
./deploy-railway.ps1
```

#### Linux/macOS:
```bash
./deploy-railway.sh
```

This automated script will:
1. Install Railway CLI if needed
2. Authenticate with Railway
3. Link your project (or help you create one)
4. Upload all environment variables from `.env.railway`
5. Optionally fetch additional secrets from Azure Key Vault
6. Deploy your application

### Option 2: Manual Deployment

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

2. **Login to Railway**:
```bash
railway login
```

3. **Link or Create Project**:
```bash
# Link existing project
railway link

# Or create a new project
railway init
```

4. **Upload Environment Variables**:
```bash
# Upload all variables from .env.railway
railway variables --set NEXT_PUBLIC_SUPABASE_URL=https://xsakpzcdkhinawfkxxpk.supabase.co
railway variables --set NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
railway variables --set SUPABASE_SERVICE_ROLE_KEY=<your-key>
railway variables --set STRIPE_SECRET_KEY=<your-key>
railway variables --set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-key>
railway variables --set AZURE_OPENAI_ENDPOINT=<your-endpoint>
railway variables --set AZURE_OPENAI_API_KEY=<your-key>
railway variables --set AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini
# ... add other variables as needed
```

5. **Deploy**:
```bash
railway up
```

## Environment Variables

All environment variables are automatically configured from your Azure Key Vault. The deployment includes:

### Required Variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side)
- `STRIPE_SECRET_KEY` - Stripe secret key for payments
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (client-side)
- `AZURE_OPENAI_ENDPOINT` - Azure OpenAI endpoint URL
- `AZURE_OPENAI_API_KEY` - Azure OpenAI API key
- `AZURE_OPENAI_DEPLOYMENT_NAME` - Azure OpenAI deployment name

### Optional Variables:
- `OPENAI_API_KEY` - OpenAI API key (fallback if not using Azure)
- `ANTHROPIC_API_KEY` - Anthropic Claude API key
- `GOOGLE_AI_API_KEY` - Google AI API key
- `RESEND_API_KEY` - Resend email service API key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `XAI_API_KEY` - xAI API key

### Dynamic Variables:
- `NEXT_PUBLIC_SITE_URL` - Automatically set to `${{RAILWAY_PUBLIC_DOMAIN}}`

## Configuration Files

### `railway.json`
Defines Railway-specific deployment configuration:
- Build settings
- Start command
- Health check configuration
- Restart policy

### `nixpacks.toml`
Defines the build environment:
- Node.js version (20)
- Build commands
- Start command

### `.env.railway`
Template file containing all environment variables for Railway deployment.

### `.env.local`
Local development environment variables (git-ignored).

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Railway Platform                │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │     Next.js Application           │  │
│  │  (Always-On, No Cold Starts)      │  │
│  └───────────────────────────────────┘  │
│              │                           │
│              ├─── Supabase (External)    │
│              ├─── Stripe (External)      │
│              ├─── Azure OpenAI (External)│
│              └─── Resend (External)      │
└─────────────────────────────────────────┘
```

## Post-Deployment Steps

1. **Get Your Railway Domain**:
```bash
railway domain
```

2. **Set Up Custom Domain** (Optional):
```bash
railway domain add yourdomain.com
```

3. **Configure Stripe Webhooks**:
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-railway-domain.railway.app/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, etc.
   - Copy webhook signing secret
   - Update Railway variable:
     ```bash
     railway variables --set STRIPE_WEBHOOK_SECRET=<webhook-secret>
     ```

4. **Update Supabase Redirect URLs**:
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add Railway domain to allowed redirect URLs:
     - `https://your-railway-domain.railway.app/auth/callback`
     - `https://your-railway-domain.railway.app/auth/sign-in`

5. **Update Resend Domain** (if using):
   - Go to Resend Dashboard → Domains
   - Verify your domain
   - Update `.env.railway` with your verified domain

## Monitoring & Logs

### View Logs:
```bash
railway logs
```

### View Deployments:
```bash
railway status
```

### Open Railway Dashboard:
```bash
railway open
```

## Troubleshooting

### Build Failures

**Issue**: Build fails with "Module not found"
**Solution**: Ensure all dependencies are in `package.json`:
```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
railway up
```

### Environment Variable Issues

**Issue**: Application can't access environment variables
**Solution**: Verify variables are set:
```bash
railway variables
```

Re-upload if needed:
```bash
./deploy-railway.ps1  # or ./deploy-railway.sh
```

### Database Connection Issues

**Issue**: Can't connect to Supabase
**Solution**:
1. Verify Supabase credentials in Railway:
   ```bash
   railway variables | grep SUPABASE
   ```
2. Check Supabase connection pooling mode
3. Ensure Railway IP is not blocked by Supabase

### Stripe Webhook Failures

**Issue**: Stripe webhooks not working
**Solution**:
1. Verify webhook secret is set in Railway
2. Check webhook endpoint is accessible: `https://your-domain/api/webhooks/stripe`
3. Review webhook logs in Stripe Dashboard

## Rollback

If you need to rollback to a previous deployment:

```bash
railway status  # Get deployment ID
railway rollback <deployment-id>
```

## Cost Estimation

Railway pricing is usage-based. For this application:
- **Starter Plan**: $5/month (500 hours execution time)
- **Developer Plan**: $10/month (1000 hours + more resources)
- **Team Plan**: $20/month per member

Estimated monthly cost: **$10-20** for moderate usage.

Compare to Vercel:
- Hobby: Free (limited)
- Pro: $20/month
- Enterprise: Custom

Railway is more cost-effective for compute-intensive applications with server-side logic.

## CI/CD Integration

Railway automatically deploys on git push when connected to GitHub:

1. Connect your GitHub repository in Railway Dashboard
2. Enable auto-deploy on main branch
3. Push to main:
   ```bash
   git push origin main
   ```

Railway will automatically build and deploy!

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway CLI Reference](https://docs.railway.app/develop/cli)
- [Next.js on Railway](https://docs.railway.app/guides/nextjs)
- [Railway Discord Community](https://discord.gg/railway)

## Support

If you encounter issues:
1. Check Railway logs: `railway logs`
2. Review this documentation
3. Contact Railway support via Discord
4. Check Railway status page: [status.railway.app](https://status.railway.app)
