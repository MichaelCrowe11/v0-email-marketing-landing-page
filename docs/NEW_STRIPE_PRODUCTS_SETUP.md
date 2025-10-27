# New Stripe Products Setup Guide

## Products to Create in Stripe

### 1. Master Grower Subscription Tier

**Product 1: Master Grower - Monthly**
- Name: `Master Grower Access - Monthly`
- Description: `Premium tier with quarterly 1-on-1 consultations, white-label capability, multi-facility management, team collaboration, API access, and dedicated support.`
- Price: `$497/month` (recurring)
- Billing Period: Monthly
- Features to list:
  - Everything in Expert Access
  - Quarterly 30-min 1-on-1 consultation with Michael Crowe
  - White-label capability
  - Multi-facility management (up to 5 locations)
  - Team collaboration (up to 10 users)
  - API access for custom integrations
  - Dedicated account manager
  - Custom SOP creation service

**Product 2: Master Grower - Yearly**
- Name: `Master Grower Access - Yearly`
- Description: Same as above
- Price: `$4,997/year` (recurring) - saves $967 vs monthly
- Billing Period: Yearly

---

### 2. Consultation Packages (One-Time Payments)

**Product 3: 1-Hour Consultation**
- Name: `1-Hour Expert Consultation with Michael Crowe`
- Description: `One-on-one consultation covering facility setup, contamination issues, yield optimization, or any cultivation challenge. Includes pre-call questionnaire, custom recommendations, follow-up summary, and 2 weeks of email support.`
- Price: `$425` (one-time)
- Type: One-time payment

**Product 4: 3-Hour Consultation Package**
- Name: `3-Hour Consultation Package`
- Description: `Extended consultation package with Michael Crowe. Perfect for facility setup, comprehensive troubleshooting, or staff training. Includes all materials from 1-hour session plus extended follow-up support.`
- Price: `$1,150` (one-time)
- Savings: $125 vs individual hours

**Product 5: Full Day Consultation**
- Name: `Full Day (6-Hour) Consultation`
- Description: `Full-day intensive consultation with Michael Crowe. Ideal for facility audits, team training, or complete operation overhauls. Includes on-site or virtual session, detailed report, and 30 days of follow-up support.`
- Price: `$2,250` (one-time)
- Savings: $300 vs individual hours

**Product 6: Monthly Consulting Retainer - Premium**
- Name: `Monthly Consulting Retainer - Premium`
- Description: `Exclusive monthly consulting relationship with Michael Crowe. Priority access, strategic guidance, and ongoing support for commercial operations. For serious cultivators and businesses only.`
- Price: `$25,000/month` (recurring)
- Billing Period: Monthly
- Note: Premium positioning for commercial operations only

---

### 3. GPT Modules (One-Time Purchases)

**Product 7: Core AI Assistant GPT**
- Name: `Core AI Assistant - Specialized GPT Module`
- Description: `Advanced AI assistant trained specifically on Michael Crowe's 20+ years of cultivation expertise. Covers general cultivation questions, best practices, and troubleshooting.`
- Price: `$49` (one-time)

**Product 8: Spawn Master GPT**
- Name: `Spawn Master - Specialized GPT Module`
- Description: `Expert AI trained specifically on spawn production, grain preparation, liquid culture, and inoculation techniques. Your personal spawn production consultant.`
- Price: `$49` (one-time)

**Product 9: Substrate Tech GPT**
- Name: `Substrate Tech - Specialized GPT Module`
- Description: `Specialized AI for substrate formulation, preparation, and optimization. Master bulk substrate recipes and troubleshoot substrate issues.`
- Price: `$49` (one-time)

**Product 10: Inoculation AI GPT**
- Name: `Inoculation AI - Specialized GPT Module`
- Description: `Focused AI assistant for sterile technique, inoculation procedures, and contamination prevention during transfer procedures.`
- Price: `$49` (one-time)

**Product 11: Complete GPT Bundle**
- Name: `Complete GPT Module Bundle (All 4)`
- Description: `Get all four specialized GPT modules in one package. Core AI Assistant, Spawn Master, Substrate Tech, and Inoculation AI. Save $47 vs buying individually.`
- Price: `$149` (one-time)
- Savings: $47 (normally $196)

---

### 4. Crowe Vision Credits (One-Time Purchases)

**Product 12: Crowe Vision - 10 Analysis Credits**
- Name: `Crowe Vision Analysis Credits - 10 Pack`
- Description: `10 contamination analysis credits for Crowe Vision AI. Upload images of your cultivation for instant contamination identification and remediation recommendations.`
- Price: `$29` (one-time)
- Unit Price: $2.90 per analysis

**Product 13: Crowe Vision - 50 Analysis Credits**
- Name: `Crowe Vision Analysis Credits - 50 Pack`
- Description: `50 contamination analysis credits for Crowe Vision AI. Best value for active growers monitoring multiple projects.`
- Price: `$99` (one-time)
- Unit Price: $1.98 per analysis
- Savings: $46 vs 10-pack rate

**Product 14: Crowe Vision - 100 Analysis Credits**
- Name: `Crowe Vision Analysis Credits - 100 Pack`
- Description: `100 contamination analysis credits for Crowe Vision AI. Perfect for commercial operations or cultivation facilities.`
- Price: `$149` (one-time)
- Unit Price: $1.49 per analysis
- Savings: $141 vs 10-pack rate

---

### 5. Video Studio Credits (One-Time Purchases)

**Product 15: Video Studio - 5 Credits**
- Name: `Video Studio Credits - 5 Videos`
- Description: `Generate 5 educational cultivation videos using AI. Perfect for documentation, training, or content creation.`
- Price: `$49` (one-time)

**Product 16: Video Studio - 20 Credits**
- Name: `Video Studio Credits - 20 Videos`
- Description: `Generate 20 educational cultivation videos using AI. Best value for content creators and educators.`
- Price: `$149` (one-time)
- Savings: $47 vs 5-pack rate

---

### 6. Premium Courses (One-Time Purchases)

**Product 17: Master Cultivation Course**
- Name: `Master Cultivation Course - Complete Program`
- Description: `Comprehensive 12-week video course taught by Michael Crowe. Includes live Q&A sessions, certification upon completion, lifetime access to materials, and private student community. Transform your cultivation knowledge.`
- Price: `$997` (one-time)

**Product 18: Facility Setup Consultation**
- Name: `Commercial Facility Setup Consultation`
- Description: `Complete facility design review and setup consultation for commercial operations. Includes equipment recommendations, workflow optimization, compliance guidance, and 90 days of email support.`
- Price: `$2,500` (one-time)
- Note: Can be customized for larger facilities

**Product 19: Custom AI Training Service**
- Name: `Custom AI Model Training`
- Description: `Train a dedicated AI model on your facility's specific strains, methods, and protocols. Includes knowledge base integration and dedicated model deployment. Perfect for research institutions and large-scale operations.`
- Price: `$5,000` (one-time)

---

## Step-by-Step Stripe Setup

### Access Stripe Dashboard

1. Go to https://dashboard.stripe.com
2. Make sure you're in the correct mode (Test vs Live)
3. For testing, use Test mode first
4. For production, switch to Live mode

### Create Each Product

For each product above:

1. **Navigate to Products**
   - Click "Products" in the left sidebar
   - Click "+ Add product" button

2. **Fill in Product Details**
   - Name: [Use exact name from above]
   - Description: [Copy from above]
   - Image: Upload product image (recommended)

3. **Set Pricing**
   - For Subscriptions: Select "Recurring"
     - Billing period: Monthly or Yearly
     - Price: [Amount from above]
   - For One-Time: Select "One time"
     - Price: [Amount from above]

4. **Save the Product**
   - Click "Add product"
   - **COPY THE PRICE ID** (starts with `price_`)
   - Save this Price ID - you'll need it for integration

5. **Repeat for all 19 products**

### Organize Products with Metadata

For better tracking, add metadata to each product:

- `tier`: master, consultation, gpt, credits, course
- `category`: subscription, consultation, module, analysis, video, course
- `access_level`: master_grower, expert, pro, free

---

## After Creating Products in Stripe

Once you have all Price IDs, come back and I'll help you:

1. Create a products configuration file
2. Update the pricing page with new tiers
3. Build the GPT marketplace
4. Create the consultation booking page
5. Implement the checkout flows
6. Update the database schema for new products
7. Add access control for premium features

---

## Price IDs to Collect

Create this document as you go:

\`\`\`
MASTER_GROWER_MONTHLY_PRICE_ID=price_xxxxx
MASTER_GROWER_YEARLY_PRICE_ID=price_xxxxx
CONSULTATION_1HR_PRICE_ID=price_xxxxx
CONSULTATION_3HR_PRICE_ID=price_xxxxx
CONSULTATION_FULLDAY_PRICE_ID=price_xxxxx
CONSULTATION_RETAINER_PRICE_ID=price_xxxxx
GPT_CORE_PRICE_ID=price_xxxxx
GPT_SPAWN_PRICE_ID=price_xxxxx
GPT_SUBSTRATE_PRICE_ID=price_xxxxx
GPT_INOCULATION_PRICE_ID=price_xxxxx
GPT_BUNDLE_PRICE_ID=price_xxxxx
VISION_10_PRICE_ID=price_xxxxx
VISION_50_PRICE_ID=price_xxxxx
VISION_100_PRICE_ID=price_xxxxx
VIDEO_5_PRICE_ID=price_xxxxx
VIDEO_20_PRICE_ID=price_xxxxx
MASTER_COURSE_PRICE_ID=price_xxxxx
FACILITY_SETUP_PRICE_ID=price_xxxxx
CUSTOM_AI_TRAINING_PRICE_ID=price_xxxxx
\`\`\`

Add these to your Vercel environment variables once created.

---

## Questions to Consider

1. **Tax Settings**: Do you want to collect sales tax? (Stripe Tax can handle this)
2. **Trial Periods**: Do you want to offer trials for Master Grower tier?
3. **Proration**: How should upgrades/downgrades be handled?
4. **Refund Policy**: What's your refund policy for one-time purchases?
5. **Booking Integration**: Do you use Calendly or want a custom booking system?

---

## Next Steps

1. ✅ Create all 19 products in Stripe (do this now)
2. Collect all Price IDs
3. Let me know when ready, and I'll integrate them into the application
4. Test in Stripe Test mode first
5. Deploy to production with Live mode Price IDs

**Estimated time to create all products: 30-45 minutes**

Let me know when you've created the products and have the Price IDs ready!
