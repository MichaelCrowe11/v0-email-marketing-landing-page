# Deployment Guide - Crowe Logic Platform

**Last Updated:** 2025-11-05
**Build Status:** ✅ Production build successful
**Branch:** feature/workbench-enhancements
**Commit:** 4d5546e

---

## ✅ Pre-Deployment Checklist

### Security (CRITICAL!)

- [x] **.env files NOT in git** - Verified with `.gitignore`
- [x] **No API keys in code** - All in `.env.local`
- [ ] **Environment variables set in Vercel** (see below)
- [ ] **Verify no secrets in git history**

### Build

- [x] **Production build successful** - `npm run build` completed
- [x] **No critical errors** - Only warnings about Edge Runtime (expected)
- [x] **All routes generated** - 57 pages built successfully

---

## 🚀 Deployment Options

### Option 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Push to Main Branch (if ready)

```bash
# If you want to deploy from main:
git checkout main
git merge feature/workbench-enhancements
git push origin main
```

**OR** deploy the feature branch directly (Vercel supports this).

#### Step 2: Configure Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables

**Add these variables:**

```env
# Azure OpenAI - Primary Resource (westus)
AZURE_OPENAI_ENDPOINT=https://westus.api.cognitive.microsoft.com/
AZURE_OPENAI_API_KEY=[Your Key from .env.local]
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-chat
AZURE_OPENAI_API_VERSION=2024-08-01-preview

# Azure OpenAI - Nova Resource (westus)
AZURE_OPENAI_NOVA_ENDPOINT=https://criosnova.cognitiveservices.azure.com/
AZURE_OPENAI_NOVA_API_KEY=[Your Key from .env.local]
AZURE_OPENAI_NOVA_DEPLOYMENT_NAME=o1
AZURE_OPENAI_NOVA_API_VERSION=2024-12-01-preview

# Azure OpenAI - Michael Resource (eastus2)
AZURE_OPENAI_MICHAEL_ENDPOINT=https://ai-michael9466ai832340755092.cognitiveservices.azure.com/
AZURE_OPENAI_MICHAEL_API_KEY=[Your Key from .env.local]
AZURE_OPENAI_MICHAEL_DEEPSEEK_DEPLOYMENT=CroweDeepSeek
AZURE_OPENAI_MICHAEL_GPT4O_DEPLOYMENT=gpt-4o
AZURE_OPENAI_MICHAEL_API_VERSION=2024-08-01-preview

# Azure AI Foundry (if accessible)
AZURE_AI_FOUNDRY_ENDPOINT=https://crowelogicinc.services.ai.azure.com/api/projects/crowelogicinc-project
AZURE_AI_FOUNDRY_GPT5_DEPLOYMENT=gpt-5-pro

# Supabase
NEXT_PUBLIC_SUPABASE_URL=[Your URL from .env.local]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Your Key from .env.local]
SUPABASE_SERVICE_ROLE_KEY=[Your Key from .env.local]

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=[Your Token from .env.local]
```

**Important:** Copy values from your `.env.local` file - DO NOT use the values from the spec you shared (those are examples).

#### Step 3: Deploy

1. Go to Vercel Dashboard → your project
2. Click **"Deploy"** or **"Redeploy"**
3. Wait for deployment to complete (~2-5 minutes)

---

### Option 2: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Link Project (first time only)

```bash
vercel link
```

#### Step 4: Set Environment Variables

```bash
# Production environment variables
vercel env add AZURE_OPENAI_ENDPOINT production
# Paste your value when prompted

# Repeat for all other env vars...
```

**OR** use environment variables file:

```bash
# Upload .env.local to Vercel (it will be excluded from git)
vercel env pull .env.production
# Then manually add your production values to Vercel dashboard
```

#### Step 5: Deploy to Production

```bash
# Deploy current branch
vercel --prod

# OR deploy specific branch
git checkout feature/workbench-enhancements
vercel --prod
```

---

### Option 3: GitHub Integration (Automatic Deployments)

If you have Vercel connected to your GitHub:

1. **Push to main branch**:
   ```bash
   git checkout main
   git merge feature/workbench-enhancements
   git push origin main
   ```

2. **Vercel will auto-deploy** when it detects the push

3. **Check deployment**:
   - Go to Vercel Dashboard
   - See deployment progress
   - Click deployment to view logs

---

## 🔧 Post-Deployment Verification

### 1. Test Big Bang Intro

Visit your deployed URL:
```
https://your-project.vercel.app/
```

**Expected behavior:**
- First visit: Big Bang intro plays (8 seconds)
- Particles expand from center
- Avatar appears with golden ring
- Skip button works
- Auto-advances to landing page

**To reset intro:**
```
https://your-project.vercel.app/?reset-intro=true
```

### 2. Test Workbench/IDE

```
https://your-project.vercel.app/workbench
```

**Expected behavior:**
- First visit: Code Generation intro plays
- Shows simulated code generation
- Transitions to IDE interface

### 3. Test API Endpoints

```bash
# Test Azure OpenAI connection
curl https://your-project.vercel.app/api/ai/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, test connection"}'

# Should return streaming response
```

### 4. Test Particle Components

Visit pages using particle backgrounds:
```
https://your-project.vercel.app/chat
https://your-project.vercel.app/dashboard
```

### 5. Check Console for Errors

Open browser DevTools → Console
- No critical errors
- Three.js loads correctly
- Particle systems initialize

---

## 📊 Build Information

### Build Stats

```
Route (app)                    Size     First Load JS
├ ○ /                         11.3 kB   122 kB
├ ○ /chat                     22.7 kB   216 kB
├ ○ /workbench                12.6 kB   120 kB
├ ○ /diagnostic                3.86 kB  106 kB
...
Total: 57 routes built successfully
```

### New Files in This Deploy

```
Components:
- components/big-bang-intro.tsx
- components/particle-background.tsx
- components/golden-ring.tsx

Documentation:
- DESIGN_LANGUAGE.md
- INTRO_INTEGRATION_GUIDE.md
- BIG_BANG_PROJECT_SUMMARY.md
- SECURITY.md

Standalone Intro:
- crowe-logic-intro/ (complete package)
```

### Build Warnings (Non-Critical)

```
⚠ Using edge runtime on a page disables static generation
⚠ Node.js API in Edge Runtime (Supabase realtime)
```

These are **expected warnings** and don't affect functionality.

---

## 🐛 Troubleshooting

### Issue: Environment Variables Not Working

**Symptom:** API calls fail in production

**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Verify all variables are set for **Production** environment
3. Redeploy after adding variables

### Issue: Big Bang Intro Not Showing

**Symptom:** Landing page loads directly without intro

**Possible causes:**
1. localStorage already has intro flag set
2. Three.js CDN blocked

**Solution:**
1. Test with `?reset-intro=true`
2. Check browser console for errors
3. Verify CDN accessibility: `https://cdnjs.cloudflare.com/ajax/libs/three.js/r158/three.min.js`

### Issue: Build Fails on Vercel

**Symptom:** Deployment fails during build

**Solution:**
1. Check Vercel build logs
2. Verify `package.json` dependencies
3. Ensure Node.js version is compatible (18.x or 20.x)
4. Try building locally first: `npm run build`

### Issue: Images Not Loading

**Symptom:** Avatar or other images return 404

**Solution:**
1. Verify images are in `/public` directory
2. Check Next.js Image paths are correct
3. Ensure proper image optimization settings

---

## 🔒 Security Best Practices

### DO

✅ **Store all secrets in Vercel Environment Variables**
✅ **Use `.env.local` for local development only**
✅ **Add `.env*` to `.gitignore`**
✅ **Rotate API keys if exposed**
✅ **Use HTTPS for all API calls**

### DON'T

❌ **Never commit `.env` files to git**
❌ **Never hardcode API keys in code**
❌ **Never share `.env.local` file**
❌ **Never use production keys in development**

---

## 📈 Performance Monitoring

### After Deployment

1. **Check Vercel Analytics:**
   - Go to Vercel Dashboard → Analytics
   - Monitor Core Web Vitals
   - Check loading times

2. **Test Performance:**
   ```bash
   # Run Lighthouse audit
   npx lighthouse https://your-project.vercel.app/ --view
   ```

3. **Monitor Errors:**
   - Vercel → Logs tab
   - Check for runtime errors
   - Monitor API response times

---

## 🔄 Rollback Plan

If deployment has issues:

### Option 1: Rollback via Dashboard

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Option 2: Rollback via Git

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard [previous-commit-hash]
git push --force origin main
```

### Option 3: Redeploy Previous Build

```bash
# Checkout previous commit
git checkout [previous-commit-hash]

# Deploy
vercel --prod
```

---

## 📋 Deployment Checklist

Before deploying to production:

### Pre-Deploy
- [x] Local build successful (`npm run build`)
- [x] No sensitive data in git
- [x] All changes committed and pushed
- [ ] Environment variables documented
- [ ] Team notified of deployment

### During Deploy
- [ ] Environment variables set in Vercel
- [ ] Deployment initiated
- [ ] Build logs monitored
- [ ] No critical errors in logs

### Post-Deploy
- [ ] Big Bang intro works
- [ ] Code Generation intro works (workbench)
- [ ] API endpoints responding
- [ ] No console errors
- [ ] Images loading correctly
- [ ] Particle effects working
- [ ] Mobile responsive
- [ ] Performance acceptable (Lighthouse > 80)

---

## 🎯 Quick Deploy Commands

### For Production (Main Branch)

```bash
# Ensure you're on main
git checkout main

# Merge feature branch
git merge feature/workbench-enhancements

# Push to trigger auto-deploy (if GitHub integration enabled)
git push origin main

# OR deploy manually
vercel --prod
```

### For Preview (Feature Branch)

```bash
# Deploy feature branch for testing
git checkout feature/workbench-enhancements
vercel

# Get preview URL to share with team
```

---

## 📞 Support

### Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **Project Documentation:** See `DESIGN_LANGUAGE.md`, `BIG_BANG_PROJECT_SUMMARY.md`

### Deployment Issues

1. Check Vercel build logs
2. Review error messages
3. Test locally with `npm run build`
4. Verify environment variables

---

## 🚀 Ready to Deploy!

**Current Status:**
- ✅ Code committed and pushed
- ✅ Production build successful
- ✅ Documentation complete
- ⏳ Awaiting environment variable configuration
- ⏳ Awaiting production deployment

**Next Steps:**

1. **Set environment variables in Vercel Dashboard**
2. **Deploy via Vercel (dashboard or CLI)**
3. **Verify deployment** using checklist above
4. **Test Big Bang intro** on production URL

---

**Deployment Guide Version:** 1.0.0
**Last Updated:** 2025-11-05
**Build ID:** Check `.next/BUILD_ID`
**Branch:** feature/workbench-enhancements
**Commit:** 4d5546e
