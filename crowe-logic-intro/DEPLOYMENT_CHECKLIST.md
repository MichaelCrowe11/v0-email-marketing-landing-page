# Deployment Checklist

Use this checklist before deploying the Crowe Logic Intro to production.

## Pre-Deployment

### Security (CRITICAL - DO FIRST!)
- [ ] **VERIFY .env.local is NOT in git**: `git ls-files | grep .env` should return nothing
- [ ] **VERIFY .gitignore includes**: `.env*`, `*.key`, `*.pem`, `credentials.json`
- [ ] **VERIFY no API keys in code**: Search codebase for `AZURE_OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] **SET environment variables in Vercel**:
  - [ ] All Azure OpenAI keys (3 resources)
  - [ ] Supabase keys (anon + service role)
  - [ ] Vercel Blob storage token
  - [ ] Never use git for secrets!
- [ ] **ROTATE keys if exposed**: Check Azure Portal, Supabase dashboard
- [ ] **USE .env.example as template**: Copy to .env.local, never commit real keys
- [ ] **VERIFY git history clean**: `git log --all --full-history -- .env.local` should be empty

### Assets
- [ ] Avatar image optimized (WebP + PNG fallback)
  - [ ] Original PNG: `assets/images/crowe-logic-avatar.png`
  - [ ] WebP version created for modern browsers
  - [ ] Image dimensions verified (512x512 minimum)
  - [ ] Transparency preserved

### Code Optimization
- [ ] JavaScript minified
  - [ ] `src/main.js`
  - [ ] `src/components/BigBangParticles.js`
  - [ ] `src/components/BrandAvatar.js`
- [ ] CSS minified
  - [ ] `src/styles/intro.css`
- [ ] Remove console.log statements
- [ ] Update CDN links to specific Three.js version

### Configuration
- [ ] Update redirect target in `src/main.js` → `advance()` method
- [ ] Set correct auto-advance timing (currently 8 seconds)
- [ ] Verify brand colors match corporate guidelines
- [ ] Test particle counts on target devices

### Performance
- [ ] Test on low-end mobile device
- [ ] Verify 60fps on desktop
- [ ] Verify 30fps on mobile
- [ ] Check memory usage (should be < 100MB)
- [ ] Test WebGL fallback works correctly

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (desktop)
- [ ] Safari (iOS)
- [ ] Edge (latest)
- [ ] Chrome (Android)

### Accessibility
- [ ] Verify skip button is keyboard accessible
- [ ] Test with reduced motion preference enabled
- [ ] Check color contrast ratios
- [ ] Verify screen reader compatibility
- [ ] Test keyboard navigation

### SEO & Meta
- [ ] Update page title in `index.html`
- [ ] Update meta description
- [ ] Add Open Graph tags (optional)
- [ ] Add favicon
- [ ] Configure robots.txt

## Deployment Setup

### Server Configuration
- [ ] Enable gzip/brotli compression
- [ ] Set cache headers for static assets
- [ ] Configure MIME types for `.js` and `.css`
- [ ] Enable HTTPS
- [ ] Configure CSP headers (if needed)

### CDN Setup (Optional)
- [ ] Upload assets to CDN
- [ ] Update asset URLs in code
- [ ] Configure CDN cache rules
- [ ] Test CDN asset loading

### Analytics (Optional)
- [ ] Add Google Analytics tracking code
- [ ] Add event tracking for intro completion
- [ ] Add event tracking for skip button
- [ ] Test analytics in preview mode

### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure performance monitoring
- [ ] Add uptime monitoring
- [ ] Set up alerts for errors

## Post-Deployment

### Verification
- [ ] Test production URL loads correctly
- [ ] Verify all assets load (no 404s)
- [ ] Check console for JavaScript errors
- [ ] Verify redirect works after intro
- [ ] Test skip button functionality
- [ ] Verify mobile responsiveness

### Performance Testing
- [ ] Run Lighthouse audit (target: 90+ performance)
- [ ] Check Core Web Vitals
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
- [ ] Test load time on slow 3G
- [ ] Verify GPU usage is reasonable

### Cross-Browser Verification
- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Desktop Safari
- [ ] Desktop Edge
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Final Checks
- [ ] Backup original files
- [ ] Document any production-specific changes
- [ ] Update README with production URL
- [ ] Tag release in version control
- [ ] Notify stakeholders of deployment

## Rollback Plan

If issues are detected post-deployment:

1. **Immediate**: Replace with static fallback page
2. **Short-term**: Revert to previous version
3. **Debug**: Check browser console and network tab
4. **Fix**: Address issues in development environment
5. **Redeploy**: After thorough testing

## Production URLs

- **Staging**: `[Add staging URL]`
- **Production**: `[Add production URL]`

## Contact

- **Technical Lead**: [Name/Email]
- **Project Manager**: [Name/Email]
- **DevOps**: [Name/Email]

---

**Last Updated**: 2025-11-05
**Version**: 1.0.0
