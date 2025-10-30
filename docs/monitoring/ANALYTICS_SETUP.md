# Analytics and Monitoring Setup

Comprehensive guide for setting up analytics tracking, monitoring Core Web Vitals, and gathering user feedback.

## Overview

This document covers:
1. Analytics tracking setup
2. Core Web Vitals monitoring
3. Conversion rate tracking
4. User feedback collection
5. Iteration planning based on data

## Analytics Tracking

### Vercel Analytics

**Setup**:
```typescript
// app/layout.tsx
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
```

**What It Tracks**:
- Page views
- Unique visitors
- Traffic sources
- Geographic distribution
- Device types
- Browser types

**Dashboard Access**:
- Visit: https://vercel.com/[your-team]/[project]/analytics
- View real-time and historical data
- Export data for analysis

### Custom Event Tracking

**Implementation**:
```typescript
// lib/analytics.ts
import { track } from '@vercel/analytics'

export const analytics = {
  // Page views
  pageView: (page: string) => {
    track('page_view', { page })
  },

  // User actions
  chatMessageSent: (messageLength: number, hasImage: boolean) => {
    track('chat_message_sent', {
      message_length: messageLength,
      has_image: hasImage,
    })
  },

  visualAnalysisStarted: (imageSize: number) => {
    track('visual_analysis_started', {
      image_size: imageSize,
    })
  },

  visualAnalysisCompleted: (duration: number, success: boolean) => {
    track('visual_analysis_completed', {
      duration,
      success,
    })
  },

  // Conversion events
  signUpStarted: () => {
    track('sign_up_started')
  },

  signUpCompleted: (method: string) => {
    track('sign_up_completed', { method })
  },

  upgradeClicked: (tier: string) => {
    track('upgrade_clicked', { tier })
  },

  subscriptionCreated: (tier: string, price: number) => {
    track('subscription_created', {
      tier,
      price,
    })
  },

  // Engagement events
  articleViewed: (articleId: string, category: string) => {
    track('article_viewed', {
      article_id: articleId,
      category,
    })
  },

  projectCreated: (species: string, substrate: string) => {
    track('project_created', {
      species,
      substrate,
    })
  },

  forumPostCreated: (category: string) => {
    track('forum_post_created', { category })
  },

  searchPerformed: (query: string, resultsCount: number) => {
    track('search_performed', {
      query,
      results_count: resultsCount,
    })
  },

  // Feature usage
  keyboardShortcutUsed: (shortcut: string) => {
    track('keyboard_shortcut_used', { shortcut })
  },

  themeToggled: (theme: string) => {
    track('theme_toggled', { theme })
  },

  accessibilitySettingChanged: (setting: string, value: any) => {
    track('accessibility_setting_changed', {
      setting,
      value,
    })
  },
}
```

**Usage in Components**:
```typescript
// components/chat/message-input.tsx
import { analytics } from '@/lib/analytics'

function MessageInput() {
  const handleSend = (message: string, image?: File) => {
    // Track event
    analytics.chatMessageSent(message.length, !!image)
    
    // Send message
    sendMessage(message, image)
  }
  
  return <input onSubmit={handleSend} />
}
```

### Key Metrics to Track

#### User Acquisition
- **New Users**: Daily/weekly/monthly new sign-ups
- **Traffic Sources**: Organic, direct, referral, social
- **Landing Pages**: Which pages convert best
- **Bounce Rate**: Percentage leaving without interaction

#### User Engagement
- **Active Users**: DAU (Daily Active Users), MAU (Monthly Active Users)
- **Session Duration**: Average time spent on platform
- **Pages per Session**: How many pages users visit
- **Return Rate**: Percentage of users who return

#### Feature Usage
- **Chat Messages**: Number of messages sent per user
- **Visual Analysis**: Number of images analyzed
- **Projects Created**: Number of cultivation projects
- **Articles Read**: Knowledge base engagement
- **Forum Activity**: Posts and replies created

#### Conversion Metrics
- **Sign-up Conversion**: Visitors → Sign-ups
- **Upgrade Conversion**: Free → Premium
- **Payment Success Rate**: Checkout completions
- **Churn Rate**: Subscription cancellations

## Core Web Vitals Monitoring

### Vercel Speed Insights

**Setup**:
```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

**Metrics Tracked**:
- **LCP (Largest Contentful Paint)**: Loading performance
- **FID (First Input Delay)**: Interactivity
- **CLS (Cumulative Layout Shift)**: Visual stability
- **TTFB (Time to First Byte)**: Server response time
- **FCP (First Contentful Paint)**: Initial render

### Custom Web Vitals Tracking

**Implementation** (already in place):
```typescript
// components/web-vitals.tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to analytics
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    })

    // Send to your analytics endpoint
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
  })

  return null
}
```

### Performance Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| FID | ≤ 100ms | 100ms - 300ms | > 300ms |
| CLS | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| TTFB | ≤ 800ms | 800ms - 1800ms | > 1800ms |
| FCP | ≤ 1.8s | 1.8s - 3.0s | > 3.0s |

### Monitoring Dashboard

**Access**:
- Vercel Dashboard → Speed Insights
- View real-time metrics
- Historical trends
- Per-page breakdown
- Device/browser breakdown

**Alerts**:
Set up alerts for:
- LCP > 3.0s
- FID > 200ms
- CLS > 0.15
- Error rate > 2%

## Conversion Rate Tracking

### Conversion Funnels

#### Sign-up Funnel
```
Homepage Visit
    ↓ (track: page_view)
Sign Up Button Click
    ↓ (track: sign_up_started)
Form Submission
    ↓ (track: sign_up_submitted)
Email Verification
    ↓ (track: email_verified)
Account Created
    ↓ (track: sign_up_completed)
```

**Tracking Code**:
```typescript
// Track funnel steps
analytics.pageView('homepage')
analytics.signUpStarted()
analytics.signUpCompleted('email')

// Calculate conversion rate
const conversionRate = (completions / starts) * 100
```

#### Upgrade Funnel
```
Free User Active
    ↓
Pricing Page Visit
    ↓ (track: pricing_page_viewed)
Upgrade Button Click
    ↓ (track: upgrade_clicked)
Stripe Checkout
    ↓ (track: checkout_started)
Payment Submitted
    ↓ (track: payment_submitted)
Subscription Active
    ↓ (track: subscription_created)
```

#### Feature Adoption Funnel
```
User Logged In
    ↓
Feature Discovered
    ↓ (track: feature_viewed)
Feature Tried
    ↓ (track: feature_used)
Feature Adopted
    ↓ (track: feature_adopted)
```

### A/B Testing

**Setup with Vercel Edge Config**:
```typescript
// lib/ab-testing.ts
import { get } from '@vercel/edge-config'

export async function getVariant(experimentId: string, userId: string) {
  const experiment = await get(experimentId)
  
  if (!experiment) return 'control'
  
  // Consistent hashing for user assignment
  const hash = hashUserId(userId)
  const variant = hash % 2 === 0 ? 'control' : 'variant'
  
  // Track assignment
  analytics.experimentAssigned(experimentId, variant)
  
  return variant
}
```

**Usage**:
```typescript
// Test pricing page variations
const variant = await getVariant('pricing-layout', userId)

if (variant === 'variant') {
  return <PricingVariantB />
} else {
  return <PricingVariantA />
}
```

### Conversion Optimization Metrics

Track these for optimization:
- **Conversion Rate**: Percentage completing desired action
- **Average Order Value**: For subscriptions
- **Customer Lifetime Value (CLV)**: Total revenue per customer
- **Cost Per Acquisition (CPA)**: Marketing cost per customer
- **Return on Ad Spend (ROAS)**: Revenue / Ad spend

## User Feedback Collection

### In-App Feedback Widget

**Implementation**:
```typescript
// components/feedback-widget.tsx
'use client'

import { useState } from 'react'

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState(0)

  const handleSubmit = async () => {
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        feedback,
        rating,
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
      }),
    })

    // Track submission
    analytics.feedbackSubmitted(rating)
    
    setIsOpen(false)
    setFeedback('')
    setRating(0)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="glass-button"
          aria-label="Send feedback"
        >
          💬 Feedback
        </button>
      ) : (
        <div className="glass-card p-4 w-80">
          <h3 className="font-bold mb-2">Send Feedback</h3>
          
          {/* Star rating */}
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={rating >= star ? 'text-yellow-500' : 'text-gray-400'}
              >
                ★
              </button>
            ))}
          </div>
          
          {/* Feedback text */}
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what you think..."
            className="w-full p-2 rounded mb-2"
            rows={4}
          />
          
          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="btn-primary">
              Send
            </button>
            <button onClick={() => setIsOpen(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

### NPS (Net Promoter Score) Survey

**Implementation**:
```typescript
// Show NPS survey after 7 days of usage
useEffect(() => {
  const accountAge = Date.now() - user.createdAt
  const sevenDays = 7 * 24 * 60 * 60 * 1000
  
  if (accountAge > sevenDays && !user.npsSubmitted) {
    showNPSSurvey()
  }
}, [user])

function showNPSSurvey() {
  // Show modal with NPS question
  // "How likely are you to recommend Crowe Logic AI to a friend?"
  // 0-10 scale
}
```

### User Interviews

**Recruitment**:
```typescript
// Invite engaged users for interviews
if (user.messageCount > 50 && !user.interviewInvited) {
  showInterviewInvitation()
}
```

**Interview Guide**:
1. How did you discover Crowe Logic AI?
2. What problem were you trying to solve?
3. How has the platform helped you?
4. What features do you use most?
5. What features are missing?
6. What would make you recommend us?
7. Any frustrations or pain points?

### Feedback Channels

- **In-app widget**: Quick feedback on any page
- **Email surveys**: Periodic satisfaction surveys
- **User interviews**: Deep qualitative insights
- **Support tickets**: Issues and feature requests
- **Forum discussions**: Community feedback
- **Social media**: Public feedback and sentiment

## Data Analysis

### Weekly Review

**Metrics to Review**:
- New users vs. previous week
- Active users (DAU/MAU)
- Conversion rates (sign-up, upgrade)
- Core Web Vitals trends
- Top pages by traffic
- Feature usage statistics
- Error rates and types
- User feedback themes

**Action Items**:
- Identify performance regressions
- Address user complaints
- Prioritize feature requests
- Optimize low-converting pages

### Monthly Review

**Deep Dive Analysis**:
- User cohort analysis
- Retention rates by cohort
- Revenue metrics (MRR, ARR, churn)
- Feature adoption rates
- A/B test results
- Competitive analysis
- Market trends

**Strategic Planning**:
- Roadmap adjustments
- Resource allocation
- Marketing strategy
- Product priorities

### Quarterly Review

**Business Metrics**:
- Revenue growth
- User growth
- Market share
- Customer satisfaction (NPS)
- Team productivity
- Technical debt

**Strategic Decisions**:
- Major feature investments
- Platform improvements
- Team expansion
- Market expansion

## Iteration Planning

### Data-Driven Iteration Process

1. **Collect Data**
   - Gather quantitative metrics
   - Collect qualitative feedback
   - Identify patterns and trends

2. **Analyze**
   - What's working well?
   - What's not working?
   - Where are users struggling?
   - What opportunities exist?

3. **Prioritize**
   - Impact vs. effort matrix
   - User value vs. business value
   - Quick wins vs. long-term investments

4. **Plan**
   - Define specific improvements
   - Set measurable goals
   - Assign resources
   - Set timeline

5. **Execute**
   - Implement changes
   - Test thoroughly
   - Deploy incrementally

6. **Measure**
   - Track impact metrics
   - Compare to baseline
   - Gather feedback
   - Iterate further

### Example Iteration

**Problem Identified**:
- Chat response time averaging 8 seconds
- Users abandoning before response

**Data**:
- 30% of users close chat within 5 seconds
- Conversion rate 15% lower for slow responses

**Solution**:
- Implement streaming responses
- Show typing indicator immediately
- Add "thinking" animation

**Implementation**:
- Week 1: Build streaming infrastructure
- Week 2: Update UI components
- Week 3: Test and deploy

**Results**:
- Response time perceived as 2 seconds
- Abandonment rate reduced to 10%
- Conversion rate improved 20%

### Continuous Improvement

**Weekly Improvements**:
- Bug fixes
- Minor UI tweaks
- Performance optimizations
- Content updates

**Monthly Improvements**:
- Feature enhancements
- New capabilities
- Major bug fixes
- Design refinements

**Quarterly Improvements**:
- Major features
- Platform upgrades
- Architecture improvements
- Strategic initiatives

## Monitoring Tools

### Recommended Stack

1. **Vercel Analytics**: Page views, traffic sources
2. **Vercel Speed Insights**: Core Web Vitals
3. **Sentry** (optional): Error tracking
4. **LogRocket** (optional): Session replay
5. **Hotjar** (optional): Heatmaps, recordings
6. **Google Analytics** (optional): Advanced analytics

### Dashboard Setup

Create a monitoring dashboard with:
- Real-time user count
- Today's sign-ups
- Active subscriptions
- Revenue (MRR)
- Error rate
- Average response time
- Core Web Vitals
- Top pages
- Recent feedback

## Alerts and Notifications

### Critical Alerts (Immediate)
- Error rate > 5%
- Payment processing failures
- Database connection issues
- API downtime

### Warning Alerts (Within 1 hour)
- Error rate > 2%
- LCP > 4.0s
- Response time > 10s
- Conversion rate drop > 20%

### Info Alerts (Daily digest)
- New user milestones
- Revenue milestones
- Feature usage trends
- Feedback summary

---

**Remember**: Data is only valuable if you act on it. Review regularly, identify opportunities, and iterate continuously.
