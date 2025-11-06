# 🚀 Deploy to Railway - Quick Guide

Your code is pushed to GitHub! Now let's deploy to Railway.

## Step 1: Install Railway CLI (if needed)

```bash
npm install -g @railway/cli
```

## Step 2: Login to Railway

Run this command and it will open your browser to authenticate:

```bash
railway login
```

This will:
1. Open your browser
2. Ask you to authorize the CLI
3. Automatically authenticate your terminal

## Step 3: Link or Create Project

### Option A: Link Existing Project
```bash
cd v0-email-marketing-landing-page
railway link
```

### Option B: Create New Project
```bash
cd v0-email-marketing-landing-page
railway init
```

## Step 4: Upload Environment Variables

Run this to set all your secrets from Azure Key Vault:

```bash
# Supabase
railway variables set NEXT_PUBLIC_SUPABASE_URL="https://xsakpzcdkhinawfkxxpk.supabase.co"
railway variables set NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzYWtwemNka2hpbmF3Zmt4eHBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTgwNTksImV4cCI6MjA3NTc5NDA1OX0.j3y9RGIJf50NL5HiMko1WaZO7gKHdR7t1zG8C_zwnZY"
railway variables set SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzYWtwemNka2hpbmF3Zmt4eHBrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDIxODA1OSwiZXhwIjoyMDc1Nzk0MDU5fQ.UJ3Jou9Bd89g93tiaK3ewrq-fyOR-s2fvJzXAgk9Uuo"

# Stripe
railway variables set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51SH6YPA4cYiyFizwFGaJZcHUBdXvCE1mJmI1OIadXEOFJPtGi22CuBuigla5QtmxXty79rscGSA4UGo2qs9FQiK700Zanf4Ldu"
railway variables set STRIPE_SECRET_KEY="sk_test_51SH6YPA4cYiyFizwSglPvwAW5733lhNReQzDC5Epp0jCwAJcQ6QcmaDO38CyK2UE6CbVVdY7hmHzeydUWz10Uv6V00lmefk2rB"

# Azure OpenAI
railway variables set AZURE_OPENAI_ENDPOINT="https://micha-mhk6wbcy-eastus2.cognitiveservices.azure.com/"
railway variables set AZURE_OPENAI_API_KEY="BIMjS3AGjvrTfM2tBOGQkrZ12XH8efLI34RxPStqLaK2kjfkxuO3JQQJ99BKACHYHv6XJ3w3AAAAACOGLcfr"
railway variables set AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o-mini"
```

## Step 5: Deploy!

```bash
railway up
```

This will:
- Build your Next.js application
- Deploy it to Railway
- Give you a live URL

## Step 6: Get Your URL

```bash
railway domain
```

Or open the Railway dashboard:

```bash
railway open
```

---

## 🎯 One-Command Version (After Login)

If you're already logged in and linked to a project, just run:

```bash
# Upload all variables at once
railway variables set NEXT_PUBLIC_SUPABASE_URL="https://xsakpzcdkhinawfkxxpk.supabase.co" \
  NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzYWtwemNka2hpbmF3Zmt4eHBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTgwNTksImV4cCI6MjA3NTc5NDA1OX0.j3y9RGIJf50NL5HiMko1WaZO7gKHdR7t1zG8C_zwnZY" \
  SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzYWtwemNka2hpbmF3Zmt4eHBrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDIxODA1OSwiZXhwIjoyMDc1Nzk0MDU5fQ.UJ3Jou9Bd89g93tiaK3ewrq-fyOR-s2fvJzXAgk9Uuo" \
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51SH6YPA4cYiyFizwFGaJZcHUBdXvCE1mJmI1OIadXEOFJPtGi22CuBuigla5QtmxXty79rscGSA4UGo2qs9FQiK700Zanf4Ldu" \
  STRIPE_SECRET_KEY="sk_test_51SH6YPA4cYiyFizwSglPvwAW5733lhNReQzDC5Epp0jCwAJcQ6QcmaDO38CyK2UE6CbVVdY7hmHzeydUWz10Uv6V00lmefk2rB" \
  AZURE_OPENAI_ENDPOINT="https://micha-mhk6wbcy-eastus2.cognitiveservices.azure.com/" \
  AZURE_OPENAI_API_KEY="BIMjS3AGjvrTfM2tBOGQkrZ12XH8efLI34RxPStqLaK2kjfkxuO3JQQJ99BKACHYHv6XJ3w3AAAAACOGLcfr" \
  AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o-mini"

# Then deploy
railway up
```

---

## 📝 Next Steps After Deployment

1. **Get your Railway URL**: `railway domain`
2. **Set up Stripe Webhook**: Add webhook endpoint at `https://your-railway-url.railway.app/api/webhooks/stripe`
3. **Update Supabase Redirects**: Add Railway URL to allowed redirects in Supabase dashboard
4. **Add Custom Domain** (optional): `railway domain add yourdomain.com`

---

## 🆘 Need Help?

- Check logs: `railway logs`
- Check status: `railway status`
- Open dashboard: `railway open`
- Full guide: See `RAILWAY_DEPLOYMENT.md`
