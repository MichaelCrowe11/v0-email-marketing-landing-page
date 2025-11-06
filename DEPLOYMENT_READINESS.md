# Deployment Readiness Checklist

This document provides a comprehensive checklist to ensure your application is ready for production deployment.

## ✅ Pre-Deployment Checklist

### 1. Azure Key Vault Configuration

- [ ] Azure Key Vault created and configured
- [ ] All required secrets added to Key Vault (see [AZURE_KEYVAULT_SETUP.md](./AZURE_KEYVAULT_SETUP.md))
- [ ] Access policies configured (Service Principal or Managed Identity)
- [ ] `AZURE_KEYVAULT_URL` environment variable set in production
- [ ] Authentication credentials configured (if using Service Principal)

**Required Secrets in Key Vault:**
- [ ] `NEXT-PUBLIC-SUPABASE-URL`
- [ ] `NEXT-PUBLIC-SUPABASE-ANON-KEY`
- [ ] `SUPABASE-SERVICE-ROLE-KEY`
- [ ] `STRIPE-SECRET-KEY`
- [ ] `NEXT-PUBLIC-STRIPE-PUBLISHABLE-KEY`
- [ ] `STRIPE-WEBHOOK-SECRET`
- [ ] All 14 Stripe Price IDs
- [ ] `AZURE-AI-ENDPOINT`
- [ ] `AZURE-AI-API-KEY`

**Optional but Recommended:**
- [ ] `OPENAI-API-KEY`
- [ ] `ANTHROPIC-API-KEY`
- [ ] `RESEND-API-KEY`
- [ ] `BLOB-READ-WRITE-TOKEN`

### 2. Database Configuration (Supabase)

- [ ] Supabase project created and configured
- [ ] Database schema migrated/created
- [ ] Row-level security (RLS) policies configured
- [ ] Authentication configured
- [ ] API keys generated and added to Key Vault
- [ ] Database backups enabled
- [ ] Connection pooling configured (if needed)

### 3. Payment Processing (Stripe)

- [ ] Stripe account in **LIVE MODE** (not test mode)
- [ ] All products created in Stripe
- [ ] All prices created and Price IDs added to Key Vault
- [ ] Webhook endpoint configured: `https://yourdomain.com/api/webhooks/stripe`
- [ ] Webhook secret added to Key Vault
- [ ] Required webhook events configured:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.created`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.payment_succeeded`
  - [ ] `invoice.payment_failed`
- [ ] Test payment flow works in production

### 4. AI Services

- [ ] Azure OpenAI resource created and configured
- [ ] Deployment created in Azure OpenAI
- [ ] API keys and endpoint added to Key Vault
- [ ] Rate limits and quotas verified
- [ ] (Optional) Additional AI services configured (OpenAI, Anthropic)

### 5. Email Service (Optional)

- [ ] Email service provider selected (Resend recommended)
- [ ] Domain verified
- [ ] API key added to Key Vault
- [ ] Email templates created
- [ ] Test emails sent successfully

### 6. File Storage (Optional)

- [ ] Vercel Blob Storage or equivalent configured
- [ ] Storage token added to Key Vault
- [ ] Upload limits configured
- [ ] File type restrictions configured

### 7. Security

- [ ] All secrets stored in Azure Key Vault or secure environment variables
- [ ] No secrets committed to Git repository
- [ ] HTTPS enabled in production
- [ ] Security headers configured (already in `next.config.mjs`)
- [ ] CORS policies configured appropriately
- [ ] Rate limiting configured for APIs
- [ ] Input validation implemented
- [ ] SQL injection prevention verified (using ORM/prepared statements)
- [ ] XSS protection enabled

### 8. Performance

- [ ] Image optimization configured
- [ ] Static assets cached appropriately
- [ ] Database queries optimized
- [ ] API response times acceptable
- [ ] Bundle size optimized
- [ ] Lazy loading implemented where appropriate
- [ ] CDN configured for static assets

### 9. Monitoring & Logging

- [ ] Error tracking configured (Sentry, LogRocket, etc.)
- [ ] Application Performance Monitoring (APM) setup
- [ ] Log aggregation configured
- [ ] Uptime monitoring configured
- [ ] Alert rules configured for critical issues
- [ ] Azure Key Vault monitoring enabled
- [ ] Health check endpoint tested: `/api/health`

### 10. Environment Configuration

**Production Environment Variables:**
- [ ] `AZURE_KEYVAULT_URL` set
- [ ] `AZURE_CLIENT_ID` set (if using Service Principal)
- [ ] `AZURE_CLIENT_SECRET` set (if using Service Principal)
- [ ] `AZURE_TENANT_ID` set (if using Service Principal)
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] `NODE_ENV` set to `production`

### 11. Domain & DNS

- [ ] Domain purchased and configured
- [ ] DNS records pointing to production server
- [ ] SSL certificate configured
- [ ] Domain verification completed for email service
- [ ] Redirect from www to non-www (or vice versa) configured

### 12. Testing

- [ ] All critical user flows tested in staging
- [ ] Payment flow tested end-to-end
- [ ] Authentication tested (sign up, sign in, sign out)
- [ ] Password reset tested
- [ ] Email notifications tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing completed
- [ ] Load testing performed
- [ ] Webhook handling tested

### 13. Documentation

- [ ] API documentation up to date
- [ ] Deployment documentation reviewed
- [ ] Runbook created for common issues
- [ ] Team trained on deployment process
- [ ] Emergency contact list updated

### 14. Compliance & Legal

- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] Cookie consent implemented (if required)
- [ ] GDPR compliance verified (if applicable)
- [ ] Accessibility standards met (WCAG 2.1)

### 15. Backup & Recovery

- [ ] Database backup strategy implemented
- [ ] Backup restore procedure tested
- [ ] Disaster recovery plan documented
- [ ] Rollback procedure defined

## 🚀 Deployment Steps

### Step 1: Pre-Deployment Verification

```bash
# Test health check locally
curl http://localhost:3000/api/health

# Build the application
npm run build

# Run the production build locally
npm start
```

### Step 2: Deploy to Staging

1. Deploy to staging environment
2. Run smoke tests
3. Verify health check: `https://staging.yourdomain.com/api/health`
4. Test critical user flows
5. Verify monitoring and logging

### Step 3: Deploy to Production

1. Deploy to production environment
2. Verify health check: `https://yourdomain.com/api/health`
3. Test payment flow with small transaction
4. Monitor error rates and performance
5. Verify webhook delivery from Stripe
6. Send test email

### Step 4: Post-Deployment Verification

- [ ] Health check returns `healthy` status
- [ ] Homepage loads successfully
- [ ] User can sign up/sign in
- [ ] Payment processing works
- [ ] AI chat works
- [ ] Email notifications sent
- [ ] All API endpoints responding
- [ ] No critical errors in logs
- [ ] Monitoring dashboards showing healthy metrics

## 🔍 Health Check Verification

Access your health check endpoint to verify all services are configured:

```bash
curl https://yourdomain.com/api/health
```

Expected response for healthy system:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "message": "All systems operational",
  "checks": [
    { "name": "Database Connection", "status": "pass" },
    { "name": "Payment Processing", "status": "pass" },
    { "name": "AI Services", "status": "pass" },
    { "name": "Email Service", "status": "pass" },
    { "name": "File Storage", "status": "pass" }
  ]
}
```

## 🚨 Rollback Procedure

If issues are detected after deployment:

1. Immediately rollback to previous version
2. Investigate issue in staging environment
3. Fix the issue
4. Re-deploy following full checklist

## 📞 Emergency Contacts

- Technical Lead: [Name/Email/Phone]
- DevOps Engineer: [Name/Email/Phone]
- Azure Support: https://azure.microsoft.com/support/
- Stripe Support: https://support.stripe.com/
- Vercel Support: https://vercel.com/support

## 📊 Key Metrics to Monitor

Post-deployment, monitor these metrics:

- Application uptime (target: 99.9%)
- API response times (target: <500ms p95)
- Error rate (target: <0.1%)
- Payment success rate (target: >98%)
- Database query performance
- Key Vault request latency
- User sign-up rate
- Conversion rate

## 🎉 Launch Day Checklist

- [ ] All team members notified of launch
- [ ] Monitoring dashboards open and being watched
- [ ] Support team ready to respond
- [ ] Social media/marketing ready to announce
- [ ] Press release prepared (if applicable)
- [ ] Welcome email automation tested
- [ ] Analytics tracking verified
- [ ] Customer support chat/email monitored

## 📝 Post-Launch Tasks

Within 24 hours:
- [ ] Review all logs for errors
- [ ] Check analytics for user behavior
- [ ] Verify payment processing working smoothly
- [ ] Check email deliverability
- [ ] Review performance metrics
- [ ] Gather initial user feedback

Within 1 week:
- [ ] Conduct post-launch retrospective
- [ ] Address any non-critical issues discovered
- [ ] Optimize based on real-world usage patterns
- [ ] Update documentation based on learnings

## 📚 Additional Resources

- [Azure Key Vault Setup Guide](./AZURE_KEYVAULT_SETUP.md)
- [Setup Guide](./SETUP.md)
- [Launch Preparation Guide](./LAUNCH_PREPARATION_GUIDE.md)
- [Deploy Now Guide](./DEPLOY_NOW.md)
