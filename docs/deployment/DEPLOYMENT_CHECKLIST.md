# Deployment Checklist

Complete this checklist before deploying to production.

## Pre-Deployment

### Code Quality
- [ ] All tests passing (`npm run test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Code reviewed and approved
- [ ] All merge conflicts resolved
- [ ] Feature branches merged to main

### Performance
- [ ] Lighthouse score > 90 on all pages
- [ ] Core Web Vitals within targets:
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
- [ ] Images optimized (WebP/AVIF)
- [ ] Bundle size analyzed and optimized
- [ ] No console errors or warnings

### Accessibility
- [ ] WCAG 2.1 AA compliance verified
- [ ] Keyboard navigation tested
- [ ] Screen reader tested (NVDA/JAWS/VoiceOver)
- [ ] Color contrast ratios verified
- [ ] Focus indicators visible
- [ ] ARIA labels complete

### Mobile
- [ ] Tested on iOS (iPhone 12, 13, 14)
- [ ] Tested on Android (various devices)
- [ ] Tested on tablets (iPad, Android)
- [ ] Touch targets minimum 44x44px
- [ ] No horizontal scrolling
- [ ] Viewport meta tag correct

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers tested

### Security
- [ ] Environment variables secured
- [ ] API keys not exposed in client code
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] SQL injection prevention verified
- [ ] XSS protection verified
- [ ] CSRF protection enabled

### Database
- [ ] Migrations tested
- [ ] Backup created
- [ ] RLS policies verified
- [ ] Indexes optimized
- [ ] Connection pooling configured

### Third-Party Services
- [ ] Supabase connection verified
- [ ] OpenAI API key valid
- [ ] Anthropic API key valid
- [ ] Stripe webhooks configured
- [ ] Resend email configured
- [ ] All API quotas sufficient

### Content
- [ ] All placeholder content replaced
- [ ] Images have alt text
- [ ] Links verified (no 404s)
- [ ] Copy proofread
- [ ] Legal pages updated (Terms, Privacy)

### Documentation
- [ ] README updated
- [ ] API documentation current
- [ ] User guide complete
- [ ] Technical docs updated
- [ ] Changelog updated

## Staging Deployment

### Deploy to Staging
```bash
# Ensure you're on the correct branch
git checkout main
git pull origin main

# Deploy to staging
vercel --env=preview
```

### Staging Tests
- [ ] Homepage loads correctly
- [ ] Authentication works
- [ ] Chat functionality works
- [ ] Visual analysis works
- [ ] Payment flow works
- [ ] Email notifications work
- [ ] All critical paths tested
- [ ] No console errors
- [ ] Performance acceptable

### Smoke Tests
Run these critical user flows:

#### 1. New User Registration
- [ ] Sign up form works
- [ ] Email verification sent
- [ ] Email verification works
- [ ] Profile creation works
- [ ] Welcome email received

#### 2. Chat Flow
- [ ] Create new chat
- [ ] Send message
- [ ] Receive AI response
- [ ] Upload image
- [ ] Visual analysis works
- [ ] Chat history saved

#### 3. Payment Flow
- [ ] View pricing page
- [ ] Click upgrade button
- [ ] Stripe checkout loads
- [ ] Test payment succeeds
- [ ] Subscription activated
- [ ] Confirmation email sent

#### 4. Project Management
- [ ] Create new project
- [ ] Add observation
- [ ] Upload photos
- [ ] View project timeline
- [ ] Edit project details

#### 5. Knowledge Base
- [ ] Browse articles
- [ ] Search works
- [ ] Article loads correctly
- [ ] Bookmark article
- [ ] Access control works (free vs premium)

### Load Testing
- [ ] Simulate concurrent users
- [ ] Monitor response times
- [ ] Check error rates
- [ ] Verify auto-scaling
- [ ] Database performance acceptable

### Monitoring Setup
- [ ] Vercel Analytics enabled
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured
- [ ] Alert notifications set up

## Production Deployment

### Final Checks
- [ ] All staging tests passed
- [ ] Team approval received
- [ ] Deployment window scheduled
- [ ] Rollback plan prepared
- [ ] Support team notified

### Backup
```bash
# Backup database
# (Supabase handles this automatically, but verify)

# Backup environment variables
# Export from Vercel dashboard

# Tag release in Git
git tag -a v2.0.0 -m "UI/UX Enhancement Release"
git push origin v2.0.0
```

### Deploy to Production
```bash
# Deploy to production
vercel --prod

# Or use Vercel dashboard:
# 1. Go to Vercel dashboard
# 2. Select project
# 3. Go to Deployments
# 4. Click "Promote to Production" on staging deployment
```

### Post-Deployment Verification

#### Immediate Checks (0-5 minutes)
- [ ] Homepage loads
- [ ] No 500 errors
- [ ] Authentication works
- [ ] Database connection works
- [ ] API endpoints responding
- [ ] Static assets loading
- [ ] SSL certificate valid

#### Critical Path Testing (5-15 minutes)
- [ ] User registration works
- [ ] Login works
- [ ] Chat functionality works
- [ ] Payment processing works
- [ ] Email sending works
- [ ] Image uploads work

#### Monitoring (15-60 minutes)
- [ ] Error rate normal (< 1%)
- [ ] Response times acceptable (< 2s)
- [ ] No memory leaks
- [ ] No database connection issues
- [ ] CDN serving correctly
- [ ] Logs show no critical errors

#### Performance Metrics (1-24 hours)
- [ ] Core Web Vitals within targets
- [ ] Lighthouse scores maintained
- [ ] User engagement metrics normal
- [ ] Conversion rates stable or improved
- [ ] No user complaints

### Rollback Procedure

If critical issues are detected:

```bash
# Option 1: Instant rollback via Vercel
# 1. Go to Vercel dashboard
# 2. Select previous deployment
# 3. Click "Promote to Production"

# Option 2: Revert Git commit
git revert HEAD
git push origin main
# Vercel will auto-deploy the revert

# Option 3: Redeploy previous version
vercel --prod --force
```

### Communication

#### Internal Team
- [ ] Notify team of deployment start
- [ ] Share deployment status updates
- [ ] Announce deployment completion
- [ ] Share any issues encountered

#### Users
- [ ] Post announcement (if major changes)
- [ ] Update status page
- [ ] Send email to subscribers (if needed)
- [ ] Update social media (if applicable)

## Post-Deployment

### Monitoring (First 24 Hours)
- [ ] Monitor error rates continuously
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Monitor support tickets
- [ ] Check payment processing
- [ ] Verify email delivery

### Week 1 Tasks
- [ ] Analyze user behavior changes
- [ ] Review Core Web Vitals trends
- [ ] Check conversion rate changes
- [ ] Gather user feedback
- [ ] Address any reported issues
- [ ] Document lessons learned

### Optimization
- [ ] Identify performance bottlenecks
- [ ] Optimize slow queries
- [ ] Adjust caching strategies
- [ ] Fine-tune auto-scaling
- [ ] Update documentation based on issues

## Rollback Triggers

Immediately rollback if:
- [ ] Error rate > 5%
- [ ] Critical functionality broken (auth, payments)
- [ ] Database corruption detected
- [ ] Security vulnerability discovered
- [ ] Performance degradation > 50%
- [ ] Multiple user complaints about same issue

## Success Criteria

Deployment is successful when:
- [ ] All critical paths working
- [ ] Error rate < 1%
- [ ] Performance metrics within targets
- [ ] No critical bugs reported
- [ ] User feedback positive
- [ ] Conversion rates stable or improved
- [ ] 24 hours of stable operation

## Emergency Contacts

- **DevOps Lead**: [contact info]
- **Backend Lead**: [contact info]
- **Frontend Lead**: [contact info]
- **Product Manager**: [contact info]
- **Support Team**: [contact info]

## Tools & Resources

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Error Tracking**: [your error tracking service]
- **Status Page**: [your status page]

---

**Deployment Date**: _____________
**Deployed By**: _____________
**Version**: v2.0.0
**Notes**: _____________
