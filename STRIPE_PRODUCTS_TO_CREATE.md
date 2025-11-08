# Stripe Products - Manual Creation Guide

## ✅ Updated Pricing (Per Your Requests)

- **GPT Modules**: EXCLUDED - keeping your existing pricing (Core $97, others $67, bundles $159/$197/$149)
- **Monthly Retainer**: Updated to **$25,000/month** (premium positioning)
- **Consultations**: $425/hr as specified

---

## 📋 14 Products to Create in Stripe

### Option 1: Create via Stripe Dashboard (Recommended)

Go to: https://dashboard.stripe.com/products

---

### 1. MASTER GROWER SUBSCRIPTION

#### Product 1: Master Grower - Monthly
\`\`\`
Name: Master Grower Access - Monthly
Description: Premium tier with quarterly 1-on-1 consultations, white-label capability, multi-facility management, team collaboration, API access, and dedicated support.
Type: Recurring
Price: $497/month
Billing: Monthly
\`\`\`

#### Product 2: Master Grower - Yearly
\`\`\`
Name: Master Grower Access - Yearly
Description: Premium tier with quarterly 1-on-1 consultations, white-label capability, multi-facility management, team collaboration, API access, and dedicated support.
Type: Recurring
Price: $4,997/year
Billing: Yearly
\`\`\`

---

### 2. CONSULTATION PACKAGES

#### Product 3: 1-Hour Consultation
\`\`\`
Name: 1-Hour Expert Consultation with Michael Crowe
Description: One-on-one consultation covering facility setup, contamination issues, yield optimization, or any cultivation challenge. Includes pre-call questionnaire, custom recommendations, follow-up summary, and 2 weeks of email support.
Type: One-time
Price: $425
\`\`\`

#### Product 4: 3-Hour Consultation
\`\`\`
Name: 3-Hour Consultation Package
Description: Extended consultation package with Michael Crowe. Perfect for facility setup, comprehensive troubleshooting, or staff training. Includes all materials from 1-hour session plus extended follow-up support.
Type: One-time
Price: $1,150
\`\`\`

#### Product 5: Full Day Consultation
\`\`\`
Name: Full Day (6-Hour) Consultation
Description: Full-day intensive consultation with Michael Crowe. Ideal for facility audits, team training, or complete operation overhauls. Includes on-site or virtual session, detailed report, and 30 days of follow-up support.
Type: One-time
Price: $2,250
\`\`\`

#### Product 6: Monthly Retainer (PREMIUM)
\`\`\`
Name: Monthly Consulting Retainer - Premium
Description: Exclusive monthly consulting relationship with Michael Crowe. Priority access, strategic guidance, and ongoing support for commercial operations. For serious cultivators and businesses only.
Type: Recurring
Price: $25,000/month
Billing: Monthly
\`\`\`

---

### 3. CROWE VISION CREDITS

#### Product 7: Crowe Vision - 10 Credits
\`\`\`
Name: Crowe Vision Analysis Credits - 10 Pack
Description: 10 contamination analysis credits for Crowe Vision AI. Upload images of your cultivation for instant contamination identification and remediation recommendations.
Type: One-time
Price: $29
\`\`\`

#### Product 8: Crowe Vision - 50 Credits
\`\`\`
Name: Crowe Vision Analysis Credits - 50 Pack
Description: 50 contamination analysis credits for Crowe Vision AI. Best value for active growers monitoring multiple projects.
Type: One-time
Price: $99
\`\`\`

#### Product 9: Crowe Vision - 100 Credits
\`\`\`
Name: Crowe Vision Analysis Credits - 100 Pack
Description: 100 contamination analysis credits for Crowe Vision AI. Perfect for commercial operations or cultivation facilities.
Type: One-time
Price: $149
\`\`\`

---

### 4. VIDEO STUDIO CREDITS

#### Product 10: Video Studio - 5 Credits
\`\`\`
Name: Video Studio Credits - 5 Videos
Description: Generate 5 educational cultivation videos using AI. Perfect for documentation, training, or content creation.
Type: One-time
Price: $49
\`\`\`

#### Product 11: Video Studio - 20 Credits
\`\`\`
Name: Video Studio Credits - 20 Videos
Description: Generate 20 educational cultivation videos using AI. Best value for content creators and educators.
Type: One-time
Price: $149
\`\`\`

---

### 5. PREMIUM COURSES

#### Product 12: Master Cultivation Course
\`\`\`
Name: Master Cultivation Course - Complete Program
Description: Comprehensive 12-week video course taught by Michael Crowe. Includes live Q&A sessions, certification upon completion, lifetime access to materials, and private student community.
Type: One-time
Price: $997
\`\`\`

#### Product 13: Facility Setup Consultation - Starting Tier
\`\`\`
Name: Commercial Facility Setup Consultation - Small Scale
Description: Complete facility design review for small commercial operations (1-5 grow rooms). Includes equipment recommendations, workflow optimization, compliance guidance, and 90 days of email support. For larger operations, contact for enterprise pricing.
Type: One-time
Price: $50,000
Note: This is the ENTRY-LEVEL tier for small facilities only.
Large-scale operations (10+ rooms) require custom enterprise quotes.
\`\`\`

#### Product 14: Custom AI Training
\`\`\`
Name: Custom AI Model Training
Description: Train a dedicated AI model on your facility's specific strains, methods, and protocols. Includes knowledge base integration and dedicated model deployment. Perfect for research institutions and large-scale operations.
Type: One-time
Price: $5,000
\`\`\`

---

## 📝 After Creating Each Product

1. Click "Add product"
2. **COPY THE PRICE ID** (looks like `price_xxxxxxxxxx`)
3. Paste it into the list below:

\`\`\`env
# Master Grower Tier
NEXT_PUBLIC_MASTER_GROWER_MONTHLY_PRICE_ID=price_
NEXT_PUBLIC_MASTER_GROWER_YEARLY_PRICE_ID=price_

# Consultations
NEXT_PUBLIC_CONSULTATION_1HR_PRICE_ID=price_
NEXT_PUBLIC_CONSULTATION_3HR_PRICE_ID=price_
NEXT_PUBLIC_CONSULTATION_FULLDAY_PRICE_ID=price_
NEXT_PUBLIC_CONSULTATION_RETAINER_PRICE_ID=price_

# Crowe Vision Credits
NEXT_PUBLIC_VISION_10_PRICE_ID=price_
NEXT_PUBLIC_VISION_50_PRICE_ID=price_
NEXT_PUBLIC_VISION_100_PRICE_ID=price_

# Video Studio Credits
NEXT_PUBLIC_VIDEO_5_PRICE_ID=price_
NEXT_PUBLIC_VIDEO_20_PRICE_ID=price_

# Premium Courses
NEXT_PUBLIC_MASTER_COURSE_PRICE_ID=price_
NEXT_PUBLIC_FACILITY_SETUP_PRICE_ID=price_
NEXT_PUBLIC_CUSTOM_AI_TRAINING_PRICE_ID=price_
\`\`\`

---

## 🚀 Next Steps

Once you have all 14 Price IDs:

1. Add them to your Vercel project environment variables
2. Let me know they're ready
3. I'll integrate them into the application
4. Build checkout pages for each product
5. Test the complete flow

---

## 💰 Revenue Summary

### New Products (14 total)
- **Master Grower**: $497/mo or $4,997/yr
- **Consultations**: $425 - $2,250 (one-time) + $25,000/mo (retainer)
- **Credits**: $29 - $149 (one-time packs)
- **Courses**: $997 - $5,000 (one-time)

### Existing Products (Protected)
- **Pro Access**: $97/mo (unchanged)
- **Expert Access**: $197/mo (unchanged)
- **GPT Modules**: $67-$97 each, bundles $149-$197 (unchanged)

**Your platform is positioned for premium clients!** 🎯
