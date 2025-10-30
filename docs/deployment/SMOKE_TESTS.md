# Smoke Tests

Quick verification tests to run after deployment to ensure critical functionality works.

## Test Environment Setup

### Prerequisites
- [ ] Access to staging/production environment
- [ ] Test user accounts created
- [ ] Test payment methods configured (Stripe test mode)
- [ ] Browser DevTools open (check for console errors)

### Test Data
- **Test User Email**: test+smoke@crowelogic.ai
- **Test Password**: [secure test password]
- **Test Stripe Card**: 4242 4242 4242 4242
- **Test Image**: Use sample contamination image from `/public/contamination-original.jpeg`

## Critical Path Tests

### 1. Homepage Load Test
**Expected Time**: < 30 seconds

**Steps**:
1. Navigate to homepage
2. Wait for full page load
3. Check for visual elements

**Verify**:
- [ ] Page loads without errors
- [ ] Hero section displays with animations
- [ ] Chat demo visible and functional
- [ ] Pricing section displays
- [ ] Footer displays with all links
- [ ] No console errors
- [ ] Images load correctly
- [ ] Theme toggle works

**Pass Criteria**: All elements visible, no errors, page loads in < 3 seconds

---

### 2. Authentication Flow
**Expected Time**: 2-3 minutes

#### 2.1 Sign Up
**Steps**:
1. Click "Sign Up" button
2. Enter test email and password
3. Submit form
4. Check email for verification link
5. Click verification link

**Verify**:
- [ ] Sign up form displays
- [ ] Form validation works
- [ ] Submission succeeds
- [ ] Verification email received (within 1 minute)
- [ ] Email link works
- [ ] Redirected to dashboard after verification

#### 2.2 Sign In
**Steps**:
1. Click "Sign In" button
2. Enter credentials
3. Submit form

**Verify**:
- [ ] Sign in form displays
- [ ] Credentials accepted
- [ ] Redirected to dashboard
- [ ] User menu shows correct email
- [ ] Session persists on page refresh

#### 2.3 Sign Out
**Steps**:
1. Click user menu
2. Click "Sign Out"

**Verify**:
- [ ] Successfully signed out
- [ ] Redirected to homepage
- [ ] Protected routes now require auth
- [ ] Session cleared

**Pass Criteria**: Complete flow works without errors

---

### 3. AI Chat Flow
**Expected Time**: 2-3 minutes

**Steps**:
1. Sign in as test user
2. Navigate to Chat section
3. Click "New Chat"
4. Type message: "What temperature is best for oyster mushrooms?"
5. Press Enter or click Send
6. Wait for AI response
7. Upload test image
8. Request visual analysis

**Verify**:
- [ ] Chat interface loads
- [ ] New chat created
- [ ] Message sent successfully
- [ ] AI response received (within 10 seconds)
- [ ] Response formatted correctly
- [ ] VRS displayed (for Premium users)
- [ ] Image upload works
- [ ] Visual analysis completes
- [ ] Annotated image displayed
- [ ] Evidence ledger shown
- [ ] Chat saved to history

**Pass Criteria**: Complete chat interaction works, AI responds appropriately

---

### 4. Visual Analysis Flow
**Expected Time**: 1-2 minutes

**Steps**:
1. Navigate to Visual Analysis section
2. Click "Upload Image"
3. Select test contamination image
4. Wait for analysis
5. Review results

**Verify**:
- [ ] Upload interface displays
- [ ] Image upload succeeds
- [ ] Analysis starts automatically
- [ ] Progress indicator shown
- [ ] Analysis completes (within 15 seconds)
- [ ] Annotated image displayed
- [ ] Contamination identified
- [ ] Confidence levels shown
- [ ] Evidence ledger displayed
- [ ] Can save to project

**Pass Criteria**: Image analysis completes successfully with results

---

### 5. Payment Flow
**Expected Time**: 3-4 minutes

**Steps**:
1. Sign in as free tier user
2. Navigate to Pricing page
3. Click "Upgrade" on Premium tier
4. Redirected to Stripe checkout
5. Enter test card: 4242 4242 4242 4242
6. Enter test details:
   - Expiry: 12/34
   - CVC: 123
   - ZIP: 12345
7. Complete payment
8. Redirected back to platform

**Verify**:
- [ ] Pricing page displays correctly
- [ ] Upgrade button works
- [ ] Stripe checkout loads
- [ ] Test payment accepted
- [ ] Redirected to success page
- [ ] Subscription activated immediately
- [ ] User tier updated in database
- [ ] Premium features now accessible
- [ ] Confirmation email sent
- [ ] Stripe dashboard shows subscription

**Pass Criteria**: Complete payment flow works, subscription activated

---

### 6. Project Management Flow
**Expected Time**: 2-3 minutes

**Steps**:
1. Navigate to Projects section
2. Click "New Project"
3. Fill in project details:
   - Name: "Smoke Test Project"
   - Species: "Pleurotus ostreatus"
   - Substrate: "Straw"
4. Create project
5. Add observation with photo
6. View project timeline

**Verify**:
- [ ] Projects page loads
- [ ] New project form displays
- [ ] Form validation works
- [ ] Project created successfully
- [ ] Project appears in list
- [ ] Can open project details
- [ ] Can add observation
- [ ] Photo upload works
- [ ] Timeline displays correctly
- [ ] Can edit project details

**Pass Criteria**: Complete project workflow functions

---

### 7. Knowledge Base Access
**Expected Time**: 1-2 minutes

**Steps**:
1. Navigate to Knowledge Base
2. Browse categories
3. Click on an article
4. Use search function
5. Try to access premium content (as free user)

**Verify**:
- [ ] Knowledge base page loads
- [ ] Categories display correctly
- [ ] Articles listed properly
- [ ] Article opens and displays
- [ ] Content formatted correctly
- [ ] Search function works
- [ ] Search results relevant
- [ ] Premium content gated for free users
- [ ] Premium content accessible for premium users
- [ ] Bookmark function works

**Pass Criteria**: Knowledge base accessible and content displays correctly

---

### 8. Forum Interaction
**Expected Time**: 2-3 minutes

**Steps**:
1. Navigate to Forum
2. Browse posts
3. Click on a post
4. Add a reply
5. Create new post

**Verify**:
- [ ] Forum page loads
- [ ] Posts display correctly
- [ ] Can open post details
- [ ] Replies display
- [ ] Can add reply
- [ ] Reply appears immediately
- [ ] Can create new post
- [ ] Post appears in list
- [ ] Markdown formatting works
- [ ] User avatars display

**Pass Criteria**: Forum interaction works smoothly

---

### 9. Search Functionality
**Expected Time**: 1 minute

**Steps**:
1. Press Ctrl/⌘ + K
2. Type search query: "contamination"
3. Review results
4. Click on a result

**Verify**:
- [ ] Search modal opens
- [ ] Keyboard shortcut works
- [ ] Search executes quickly (< 1 second)
- [ ] Results from multiple sources (chat, articles, forum)
- [ ] Results relevant to query
- [ ] Can navigate results with keyboard
- [ ] Clicking result navigates correctly
- [ ] Search history saved

**Pass Criteria**: Search works across all content types

---

### 10. Mobile Responsiveness
**Expected Time**: 2-3 minutes

**Steps**:
1. Open DevTools
2. Toggle device toolbar (mobile view)
3. Test on iPhone 12 viewport
4. Test on iPad viewport
5. Navigate through key pages

**Verify**:
- [ ] Layout adapts to mobile
- [ ] Navigation menu works (hamburger)
- [ ] Touch targets adequate size
- [ ] No horizontal scrolling
- [ ] Images scale correctly
- [ ] Forms usable on mobile
- [ ] Chat interface works on mobile
- [ ] Buttons easily tappable
- [ ] Text readable without zoom

**Pass Criteria**: All functionality works on mobile viewports

---

## Performance Checks

### Page Load Times
Test with DevTools Network tab (throttled to Fast 3G):

- [ ] Homepage: < 3 seconds
- [ ] Chat page: < 2 seconds
- [ ] Dashboard: < 2 seconds
- [ ] Knowledge base: < 2 seconds

### Core Web Vitals
Run Lighthouse audit:

- [ ] Performance score: > 90
- [ ] Accessibility score: > 95
- [ ] Best Practices score: > 90
- [ ] SEO score: > 90
- [ ] LCP: < 2.5s
- [ ] FID: < 100ms
- [ ] CLS: < 0.1

### API Response Times
Check Network tab for API calls:

- [ ] Chat message: < 5 seconds
- [ ] Visual analysis: < 15 seconds
- [ ] Search: < 1 second
- [ ] Page data: < 500ms

## Error Checks

### Console Errors
- [ ] No JavaScript errors
- [ ] No failed network requests
- [ ] No 404s for assets
- [ ] No CORS errors
- [ ] No authentication errors

### Visual Errors
- [ ] No broken images
- [ ] No layout shifts
- [ ] No overlapping elements
- [ ] No cut-off text
- [ ] Animations smooth

## Accessibility Checks

### Keyboard Navigation
- [ ] Can tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Can activate buttons with Enter/Space
- [ ] Can close modals with Escape
- [ ] Skip links work

### Screen Reader
Test with NVDA/JAWS/VoiceOver:
- [ ] Page structure announced correctly
- [ ] Buttons have labels
- [ ] Images have alt text
- [ ] Form fields have labels
- [ ] Dynamic content announced

## Security Checks

### Authentication
- [ ] Protected routes require login
- [ ] Session expires appropriately
- [ ] Can't access other users' data
- [ ] Password requirements enforced

### API Security
- [ ] API keys not exposed in client
- [ ] CORS configured correctly
- [ ] Rate limiting works
- [ ] SQL injection prevented

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Test Results Template

```
Smoke Test Results
==================
Date: _______________
Environment: [ ] Staging [ ] Production
Tester: _______________

Critical Path Tests:
[ ] Homepage Load
[ ] Authentication
[ ] AI Chat
[ ] Visual Analysis
[ ] Payment Flow
[ ] Project Management
[ ] Knowledge Base
[ ] Forum
[ ] Search
[ ] Mobile

Performance: [ ] Pass [ ] Fail
Accessibility: [ ] Pass [ ] Fail
Security: [ ] Pass [ ] Fail
Browser Compatibility: [ ] Pass [ ] Fail

Issues Found:
1. _______________
2. _______________
3. _______________

Overall Status: [ ] PASS [ ] FAIL

Notes:
_______________
_______________
```

## Automated Smoke Tests

For automated testing, use this script:

```bash
# Run automated smoke tests
npm run test:smoke

# Or with Playwright
npx playwright test tests/smoke/
```

## Quick Smoke Test (5 minutes)

If time is limited, run these essential tests:

1. [ ] Homepage loads
2. [ ] Can sign in
3. [ ] Can send chat message
4. [ ] Can upload image for analysis
5. [ ] No console errors

---

**Remember**: Smoke tests are quick checks, not comprehensive testing. They verify critical functionality works before proceeding with full testing.
