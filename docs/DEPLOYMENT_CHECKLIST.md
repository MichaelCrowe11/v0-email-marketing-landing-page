# Deployment Checklist - Deep Parallel Workbench

## ✅ Pre-Deployment Verification

### 1. Environment Variables in Vercel

Verify these secrets are set in your Vercel project:

```bash
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
```

**To check in Vercel:**
1. Go to your project in Vercel Dashboard
2. Settings → Environment Variables
3. Verify all three variables are present

### 2. Local Testing (Optional)

If testing locally, create `.env.local`:

```bash
# Copy from Vercel secrets
AZURE_OPENAI_ENDPOINT=...
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_DEPLOYMENT_NAME=...
```

**Test locally:**
```bash
npm run dev
# Navigate to http://localhost:3000/workbench
# Create session → Upload data → Test hypothesis
```

## 🚀 Deployment Steps

### Option 1: Deploy via Git Push

```bash
git add .
git commit -m "Add AI-powered hypothesis testing"
git push origin main
```

Vercel will automatically deploy.

### Option 2: Deploy via Vercel CLI

```bash
vercel --prod
```

## ✅ Post-Deployment Verification

### 1. Check Deployment Status

Visit your Vercel deployment URL and verify:
- [ ] Site loads successfully
- [ ] No console errors
- [ ] Workbench page accessible

### 2. Test Core Features

**Session Management:**
- [ ] Create new session
- [ ] View session list
- [ ] Open session workspace
- [ ] Pause/resume session

**Data Upload:**
- [ ] Upload CSV file
- [ ] View dataset preview
- [ ] See dataset statistics

**AI Hypothesis Testing:**
- [ ] Create hypothesis
- [ ] System shows "Running" status
- [ ] Results appear with confidence score
- [ ] View reasoning trace
- [ ] See evidence items

### 3. Test AI Integration

Create a test hypothesis:

```
Statement: "Higher moisture content leads to increased contamination"
Variables: moisture_content (numeric), contamination_rate (numeric)
Expected: "Positive correlation"
```

**Verify:**
- [ ] Status changes to "Running"
- [ ] Takes 5-15 seconds to complete
- [ ] Returns confidence score (0-100%)
- [ ] Shows 3 reasoning steps (Retrieval, Analysis, Synthesis)
- [ ] Displays evidence items
- [ ] No errors in browser console

### 4. Check Azure OpenAI Usage

**In Azure Portal:**
1. Go to your Azure OpenAI resource
2. Click "Metrics"
3. Verify API calls are being made
4. Check token usage

**Expected per hypothesis test:**
- 3 API calls (one per agent)
- ~3,700 tokens total
- ~5-15 seconds latency

## 🐛 Troubleshooting

### Issue: "Azure OpenAI is not configured"

**Check:**
1. Environment variables are set in Vercel
2. Variable names match exactly:
   - `AZURE_OPENAI_ENDPOINT`
   - `AZURE_OPENAI_API_KEY`
   - `AZURE_OPENAI_DEPLOYMENT_NAME`
3. Redeploy after adding variables

**Fix:**
```bash
# In Vercel Dashboard
Settings → Environment Variables → Add/Edit
# Then redeploy
```

### Issue: "Failed to test hypothesis"

**Check:**
1. Azure OpenAI deployment is active
2. Model supports JSON mode (GPT-4 or GPT-3.5-turbo)
3. API key has not expired
4. No rate limits exceeded

**Debug:**
```bash
# Check Vercel logs
vercel logs --follow

# Look for Azure OpenAI errors
```

### Issue: Slow response times

**Possible causes:**
- Cold start (first request after idle)
- Large datasets
- Azure OpenAI latency

**Solutions:**
- Wait for warm-up
- Limit dataset size
- Use GPT-3.5-turbo for faster responses

### Issue: High costs

**Monitor:**
- Azure Portal → Cost Management
- Check token usage per request

**Optimize:**
- Limit dataset records to 100
- Use GPT-3.5-turbo instead of GPT-4
- Implement result caching

## 📊 Monitoring

### Vercel Analytics

Enable in Vercel Dashboard:
- [ ] Analytics
- [ ] Speed Insights
- [ ] Web Vitals

### Azure OpenAI Metrics

Monitor in Azure Portal:
- [ ] Total calls
- [ ] Token usage
- [ ] Latency
- [ ] Error rate
- [ ] Cost

### Application Logs

Check Vercel logs for:
```bash
vercel logs --follow
```

Look for:
- API call timing
- Error messages
- Token usage
- Agent reasoning

## 🔒 Security Checklist

- [ ] API keys are in Vercel secrets (not in code)
- [ ] `.env.local` is in `.gitignore`
- [ ] No sensitive data in client-side code
- [ ] CORS configured properly
- [ ] Rate limiting considered

## 📈 Performance Targets

### Response Times
- Session creation: <500ms
- Data upload: <2s for typical files
- Hypothesis testing: 5-15s (AI processing)
- Results display: <100ms

### Reliability
- Uptime: 99.9%
- Error rate: <1%
- Successful AI tests: >95%

## 🎯 Success Criteria

Deployment is successful when:
- [x] All pages load without errors
- [x] Sessions can be created and managed
- [x] Data can be uploaded and viewed
- [x] Hypotheses can be created
- [x] AI testing completes successfully
- [x] Results display with confidence scores
- [x] Reasoning traces are visible
- [x] No console errors
- [x] Azure OpenAI calls are working

## 📞 Support

### If Issues Persist

1. **Check Vercel Logs:**
   ```bash
   vercel logs --follow
   ```

2. **Check Azure OpenAI Status:**
   - Azure Portal → Service Health

3. **Verify Environment Variables:**
   ```bash
   vercel env ls
   ```

4. **Test API Endpoint Directly:**
   ```bash
   curl https://your-app.vercel.app/api/workbench/sessions
   ```

## 🎉 Post-Deployment

Once verified:
1. Share the URL with your team
2. Create sample sessions for demos
3. Monitor usage and costs
4. Gather user feedback
5. Plan next features

---

**Deployment Status:** Ready for Production ✅

**Next Steps:**
1. Deploy to Vercel
2. Run verification tests
3. Monitor for 24 hours
4. Gather feedback
5. Iterate based on usage
