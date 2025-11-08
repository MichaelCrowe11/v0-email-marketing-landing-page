# Launch Preparation Guide

## Pre-Launch Checklist (1 Week Before)

### 1. Environment Configuration

#### Production Environment Variables
Ensure all of these are set in Vercel/your hosting platform:

**Supabase**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (for development)

**Stripe (LIVE MODE)**
- `STRIPE_SECRET_KEY` (starts with sk_live_)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (starts with pk_live_)
- `STRIPE_WEBHOOK_SECRET` (for production webhook endpoint)

**All Stripe Price IDs (LIVE MODE)**
- `NEXT_PUBLIC_MASTER_GROWER_MONTHLY_PRICE_ID`
- `NEXT_PUBLIC_MASTER_GROWER_YEARLY_PRICE_ID`
- `NEXT_PUBLIC_CONSULTATION_1HR_PRICE_ID`
- `NEXT_PUBLIC_CONSULTATION_3HR_PRICE_ID`
- `NEXT_PUBLIC_CONSULTATION_FULLDAY_PRICE_ID`
- `NEXT_PUBLIC_CONSULTATION_RETAINER_PRICE_ID`
- `NEXT_PUBLIC_FACILITY_SETUP_PRICE_ID`
- `NEXT_PUBLIC_CUSTOM_AI_TRAINING_PRICE_ID`
- `NEXT_PUBLIC_MASTER_COURSE_PRICE_ID`
- `NEXT_PUBLIC_VISION_10_PRICE_ID`
- `NEXT_PUBLIC_VISION_50_PRICE_ID`
- `NEXT_PUBLIC_VISION_100_PRICE_ID`
- `NEXT_PUBLIC_VIDEO_5_PRICE_ID`
- `NEXT_PUBLIC_VIDEO_20_PRICE_ID`

**Azure AI**
- `AZURE_AI_ENDPOINT`
- `AZURE_AI_API_KEY`

**OpenAI / AI Gateway**
- `AI_GATEWAY_API_KEY`
- `OPENAI_API_KEY`

**Other Services**
- `BLOB_READ_WRITE_TOKEN` (Vercel Blob)
- `OPENWEATHER_API_KEY` (for weather widget)
- `NEXT_PUBLIC_SITE_URL` (your production domain)

### 2. Stripe Configuration

#### Switch to Live Mode
1. Go to Stripe Dashboard
2. Toggle from "Test mode" to "Live mode"
3. Create all products and prices in live mode
4. Update all price IDs in environment variables
5. Configure webhook endpoint for production URL

#### Webhook Setup
1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook signing secret
5. Add to environment variables as `STRIPE_WEBHOOK_SECRET`

### 3. Email Service Setup

#### Option A: Resend (Recommended)
1. Sign up at resend.com
2. Verify your domain
3. Get API key
4. Add to environment: `RESEND_API_KEY`
5. Create email templates for:
   - Contact form submissions
   - Consultation bookings
   - Payment confirmations
   - Welcome emails

#### Option B: SendGrid
1. Sign up at sendgrid.com
2. Verify sender identity
3. Get API key
4. Add to environment: `SENDGRID_API_KEY`
5. Create email templates

#### Implementation
Create `/app/api/send-email/route.ts`:
\`\`\`typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { to, subject, html } = await request.json()
  
  const { data, error } = await resend.emails.send({
    from: 'Crowe Logic <noreply@crowelogic.com>',
    to,
    subject,
    html,
  })
  
  if (error) {
    return Response.json({ error }, { status: 500 })
  }
  
  return Response.json(data)
}
\`\`\`

### 4. Domain Configuration

#### Custom Domain Setup
1. Purchase domain (if not already owned)
2. Add domain to Vercel project
3. Configure DNS records:
   - A record: points to Vercel IP
   - CNAME record: www subdomain
4. Wait for SSL certificate provisioning (automatic)
5. Test HTTPS access

#### Email Domain Setup (for Resend/SendGrid)
1. Add DNS records for email verification
2. SPF record
3. DKIM record
4. DMARC record
5. Wait for verification (can take 24-48 hours)

### 5. Database Preparation

#### Run All Migrations
\`\`\`bash
# Connect to production Supabase
# Run all SQL scripts in /scripts folder in order
\`\`\`

#### Verify Tables
- [ ] users
- [ ] user_subscriptions
- [ ] subscription_plans
- [ ] cultivation_projects
- [ ] environmental_readings
- [ ] harvest_records
- [ ] forum_posts
- [ ] forum_categories
- [ ] documents
- [ ] contact_submissions
- [ ] chat_messages
- [ ] consultation_bookings (if exists)

#### Set Up Row Level Security
Verify RLS policies are enabled on all tables

### 6. Error Monitoring

#### Sentry Setup (Recommended)
1. Sign up at sentry.io
2. Create new project
3. Get DSN
4. Install: `npm install @sentry/nextjs`
5. Run: `npx @sentry/wizard@latest -i nextjs`
6. Add DSN to environment: `SENTRY_DSN`

### 7. Analytics Setup (Optional)

#### Vercel Analytics
1. Enable in Vercel dashboard
2. Add to layout.tsx:
\`\`\`typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
\`\`\`

### 8. Legal Pages

Create these pages before launch:
- [ ] /terms - Terms of Service
- [ ] /privacy - Privacy Policy
- [ ] /refund-policy - Refund Policy
- [ ] /contact - Contact page (already exists)

### 9. Final Testing

Run through TESTING_CHECKLIST.md completely:
- [ ] All authentication flows
- [ ] All payment flows (with real test cards)
- [ ] All protected routes
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### 10. Backup Strategy

#### Database Backups
- Supabase automatically backs up daily
- Consider additional backup strategy for critical data
- Document restore procedure

#### Code Backups
- Ensure GitHub repository is up to date
- Tag release version: `git tag v1.0.0`
- Push tags: `git push --tags`

## Launch Day Checklist

### Morning of Launch

1. **Final Environment Check**
   - [ ] All production env vars set
   - [ ] Stripe in live mode
   - [ ] Email service tested
   - [ ] Domain SSL active

2. **Deploy to Production**
   - [ ] Merge to main branch
   - [ ] Verify Vercel deployment successful
   - [ ] Check deployment logs for errors
   - [ ] Test production URL

3. **Smoke Test**
   - [ ] Sign up with real email
   - [ ] Complete a test purchase (then refund)
   - [ ] Test contact form
   - [ ] Verify emails received

4. **Monitoring Setup**
   - [ ] Open Sentry dashboard
   - [ ] Open Vercel analytics
   - [ ] Open Stripe dashboard
   - [ ] Open Supabase dashboard

### Launch Announcement

1. **YouTube Video**
   - Michael announces platform to 500K+ subscribers
   - Demo key features
   - Special launch pricing for first 100 users
   - Clear call-to-action

2. **Email Campaign**
   - Email existing GPT customers
   - Offer migration discount
   - Highlight new features

3. **Social Media**
   - Twitter/X announcement
   - Instagram post
   - LinkedIn post
   - Facebook group announcement

### First 24 Hours

**Monitor Closely:**
- [ ] Error logs every 2 hours
- [ ] Payment webhooks working
- [ ] Email notifications sending
- [ ] User sign-ups tracking
- [ ] Server performance stable
- [ ] Database connections healthy

**Be Ready to:**
- Fix critical bugs immediately
- Respond to user questions
- Adjust pricing if needed
- Scale infrastructure if traffic spikes

## Post-Launch (Week 1)

### Daily Tasks
- Check error logs
- Monitor user feedback
- Respond to support requests
- Track key metrics

### Key Metrics to Track
- Daily active users (DAU)
- Sign-up conversion rate
- Free to paid conversion rate
- Monthly recurring revenue (MRR)
- Churn rate
- Average revenue per user (ARPU)
- Customer acquisition cost (CAC)

### Week 1 Goals
- 50+ paid subscribers
- 5+ consultation bookings
- 1,000+ active users
- < 5% error rate
- < 2 second average page load

## Troubleshooting Common Issues

### Users Can't Sign Up
- Check Supabase auth settings
- Verify email confirmation settings
- Check for email delivery issues

### Payments Failing
- Verify Stripe live mode active
- Check webhook endpoint responding
- Verify price IDs correct
- Check for Stripe API errors

### Emails Not Sending
- Verify email service API key
- Check domain verification status
- Look for rate limiting
- Check spam folders

### Performance Issues
- Check database query performance
- Verify image optimization
- Check for memory leaks
- Scale Vercel plan if needed

## Emergency Contacts

**Technical Issues:**
- Vercel Support: support@vercel.com
- Supabase Support: support@supabase.com
- Stripe Support: support@stripe.com

**Rollback Procedure:**
1. Go to Vercel dashboard
2. Find previous deployment
3. Click "Promote to Production"
4. Verify rollback successful
5. Investigate issue offline

## Success Criteria

Launch is considered successful when:
- [ ] 100+ users signed up
- [ ] 10+ paid subscriptions
- [ ] 2+ consultation bookings
- [ ] < 1% error rate
- [ ] No critical bugs reported
- [ ] Positive user feedback
- [ ] All payment flows working
- [ ] Email notifications working
