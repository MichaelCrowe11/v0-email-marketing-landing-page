# Testing Checklist

## Authentication Flow Testing

### Sign Up Flow
- [ ] Navigate to /auth/sign-up
- [ ] Enter valid email and password
- [ ] Verify password confirmation works
- [ ] Submit form
- [ ] Check for confirmation email (if email service configured)
- [ ] Verify redirect to success page
- [ ] Verify user created in Supabase auth.users table
- [ ] Verify user record created in public.users table

### Login Flow
- [ ] Navigate to /auth/login
- [ ] Enter valid credentials
- [ ] Verify successful login
- [ ] Verify redirect to dashboard
- [ ] Check that user session is maintained on page refresh
- [ ] Test "Remember me" functionality

### Logout Flow
- [ ] Click logout button in user menu
- [ ] Verify redirect to home page
- [ ] Verify session is cleared
- [ ] Try accessing protected route - should redirect to login

### Password Reset
- [ ] Click "Forgot Password" link
- [ ] Enter email address
- [ ] Check for reset email (if email service configured)
- [ ] Click reset link
- [ ] Enter new password
- [ ] Verify can login with new password

## Protected Routes Testing

### Middleware Protection
- [ ] Try accessing /dashboard without login - should redirect to /auth/login
- [ ] Try accessing /profile without login - should redirect to /auth/login
- [ ] Try accessing /sops without login - should redirect to /auth/login
- [ ] Try accessing /docs without login - should redirect to /auth/login
- [ ] Try accessing /projects without login - should redirect to /auth/login

### After Login Access
- [ ] Login and verify can access /dashboard
- [ ] Verify can access /profile
- [ ] Verify can access /sops
- [ ] Verify can access /docs
- [ ] Verify can access /projects

## Payment Flow Testing (Stripe Test Mode)

### Subscription Checkout
Test Cards:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- Requires Auth: 4000 0025 0000 3155

#### Pro Subscription
- [ ] Navigate to /pricing
- [ ] Click "Get Started" on Pro plan
- [ ] Verify redirect to /checkout?plan=pro&billing=monthly
- [ ] Enter test card: 4242 4242 4242 4242
- [ ] Enter any future expiry date
- [ ] Enter any 3-digit CVC
- [ ] Enter any ZIP code
- [ ] Complete checkout
- [ ] Verify redirect to dashboard with success message
- [ ] Verify subscription created in Stripe dashboard
- [ ] Verify user_subscriptions table updated
- [ ] Verify users.subscription_tier updated to "pro"

#### Expert Subscription
- [ ] Repeat above steps for Expert plan
- [ ] Verify tier updated to "expert"

#### Master Grower Subscription
- [ ] Repeat above steps for Master Grower plan
- [ ] Verify tier updated to "master"

### Consultation Booking
- [ ] Navigate to /consultations
- [ ] Click "Book 1-Hour Consultation"
- [ ] Verify redirect to /checkout?consultation=1hr
- [ ] Complete checkout with test card
- [ ] Verify payment successful
- [ ] Verify consultation_bookings table updated (if exists)
- [ ] Check for confirmation email (if configured)

### Facility Design Service
- [ ] Navigate to /consultations
- [ ] Click "Book Small-Scale ($50k)"
- [ ] Verify redirect to /checkout?service=facility-setup
- [ ] Complete checkout with test card
- [ ] Verify payment successful

## Feature Access Testing

### Free Tier
- [ ] Create new account (defaults to free)
- [ ] Verify can access forum
- [ ] Verify can access species library
- [ ] Verify can access knowledge base
- [ ] Verify CANNOT access SOPs (should show upgrade prompt)
- [ ] Verify CANNOT access environmental monitoring
- [ ] Verify chat has daily limit message

### Pro Tier
- [ ] Upgrade account to Pro
- [ ] Verify unlimited chat access
- [ ] Verify can access Crowe Vision
- [ ] Verify can access SOPs
- [ ] Verify can access environmental monitoring
- [ ] Verify all Pro features unlocked

### Expert Tier
- [ ] Upgrade account to Expert
- [ ] Verify all Pro features available
- [ ] Verify priority support badge/indicator
- [ ] Verify GPT modules access
- [ ] Verify early access features

### Master Grower Tier
- [ ] Upgrade account to Master Grower
- [ ] Verify all Expert features available
- [ ] Verify white-label options (if implemented)
- [ ] Verify multi-facility management
- [ ] Verify team collaboration features
- [ ] Verify API access documentation

## Dashboard Testing

### Dashboard Load
- [ ] Login and navigate to /dashboard
- [ ] Verify page loads without errors
- [ ] Verify stats cards display correctly
- [ ] Verify subscription info displays
- [ ] Verify projects list loads (if any exist)
- [ ] Verify environmental readings display (if any exist)

### Dashboard Tabs
- [ ] Click "Projects" tab - verify content loads
- [ ] Click "Environment" tab - verify content loads
- [ ] Click "Subscription" tab - verify content loads
- [ ] Click "Insights" tab - verify content loads

### Dashboard Actions
- [ ] Click "New Project" button - verify redirect
- [ ] Click "Upgrade to Pro" button - verify redirect to pricing
- [ ] Click "View Plans" button - verify redirect to pricing
- [ ] Click links to SOPs, species library, etc. - verify navigation

## Profile Testing

### Profile Display
- [ ] Navigate to /profile
- [ ] Verify user info displays correctly
- [ ] Verify subscription status displays
- [ ] Verify recent documents display (if any)
- [ ] Verify recent forum posts display (if any)

### Avatar Upload
- [ ] Click avatar upload area
- [ ] Select image file
- [ ] Verify upload progress
- [ ] Verify avatar updates
- [ ] Refresh page - verify avatar persists

## Contact Form Testing

### Form Submission
- [ ] Navigate to /contact
- [ ] Fill out all required fields
- [ ] Submit form
- [ ] Verify success message displays
- [ ] Check contact_submissions table in database
- [ ] Verify email notification sent (if configured)

### Form Validation
- [ ] Try submitting with empty required fields - should show errors
- [ ] Try submitting with invalid email - should show error
- [ ] Verify all dropdowns work correctly

## AI Features Testing

### AI Chat
- [ ] Navigate to /chat
- [ ] Send a test message
- [ ] Verify response received
- [ ] Verify chat history persists
- [ ] Test model selector dropdown
- [ ] Verify different models work

### Crowe Vision
- [ ] Navigate to /crowe-vision
- [ ] Upload test image
- [ ] Verify analysis runs
- [ ] Verify results display
- [ ] Check credit deduction (if applicable)

### Video Studio
- [ ] Navigate to /video-studio
- [ ] Enter video prompt
- [ ] Verify video generation starts
- [ ] Verify progress indicator
- [ ] Verify video displays when complete

## Mobile Responsiveness

### Test on Mobile Devices
- [ ] iPhone Safari - test all critical flows
- [ ] Android Chrome - test all critical flows
- [ ] iPad - test all critical flows
- [ ] Verify navigation menu works on mobile
- [ ] Verify forms are usable on mobile
- [ ] Verify checkout works on mobile

## Cross-Browser Testing

### Desktop Browsers
- [ ] Chrome - test critical flows
- [ ] Firefox - test critical flows
- [ ] Safari - test critical flows
- [ ] Edge - test critical flows

## Performance Testing

### Page Load Times
- [ ] Homepage loads in < 2 seconds
- [ ] Dashboard loads in < 3 seconds
- [ ] Chat loads in < 2 seconds
- [ ] All pages load without console errors

### Image Optimization
- [ ] Verify images are optimized
- [ ] Verify lazy loading works
- [ ] Check Lighthouse score > 90

## Error Handling

### Network Errors
- [ ] Disconnect internet during form submission
- [ ] Verify error message displays
- [ ] Verify form data preserved
- [ ] Reconnect and retry - should work

### Invalid Data
- [ ] Try accessing non-existent project ID
- [ ] Verify 404 or error page displays
- [ ] Try invalid query parameters
- [ ] Verify graceful error handling

## Security Testing

### SQL Injection
- [ ] Try SQL injection in form fields
- [ ] Verify properly sanitized

### XSS
- [ ] Try XSS in text inputs
- [ ] Verify properly escaped

### CSRF
- [ ] Verify CSRF tokens on forms
- [ ] Verify protected endpoints require auth

## Final Checks

### Before Launch
- [ ] All environment variables set in production
- [ ] Stripe in live mode (not test mode)
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Error monitoring configured (Sentry)
- [ ] Analytics configured (if using)
- [ ] Backup strategy in place
- [ ] Email service configured and tested
- [ ] Terms of service page exists
- [ ] Privacy policy page exists
- [ ] Contact information correct

### Post-Launch Monitoring
- [ ] Monitor error logs first 24 hours
- [ ] Check payment webhooks working
- [ ] Verify email notifications sending
- [ ] Monitor user sign-ups
- [ ] Check for any console errors
- [ ] Monitor server performance
- [ ] Check database connections stable
