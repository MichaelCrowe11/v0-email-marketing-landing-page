#!/bin/bash

# Check if stripe is installed
if ! command -v stripe &> /dev/null; then
    echo "Stripe CLI could not be found. Please install it first."
    exit 1
fi

echo "Creating Stripe Products..."

# Function for recurring products
create_recurring() {
    name="$1"
    desc="$2"
    amount="$3"
    interval="$4"
    
    echo "Creating recurring: $name ($amount/$interval)"
    stripe products create \
        --name "$name" \
        --description "$desc" \
        --default-price-data.currency=usd \
        --default-price-data.unit-amount="$amount" \
        --default-price-data.recurring.interval="$interval"
}

# Function for one-time products
create_onetime() {
    name="$1"
    desc="$2"
    amount="$3"
    
    echo "Creating one-time: $name ($amount)"
    stripe products create \
        --name "$name" \
        --description "$desc" \
        --default-price-data.currency=usd \
        --default-price-data.unit-amount="$amount"
}

# 1. Master Grower Subscription
create_recurring "Master Grower Access - Monthly" "Premium tier with quarterly 1-on-1 consultations, white-label capability, multi-facility management, team collaboration, API access, and dedicated support." 49700 "month"
create_recurring "Master Grower Access - Yearly" "Premium tier with quarterly 1-on-1 consultations, white-label capability, multi-facility management, team collaboration, API access, and dedicated support." 499700 "year"

# 2. Consultation Packages
create_onetime "1-Hour Expert Consultation with Michael Crowe" "One-on-one consultation covering facility setup, contamination issues, yield optimization, or any cultivation challenge. Includes pre-call questionnaire, custom recommendations, follow-up summary, and 2 weeks of email support." 42500
create_onetime "3-Hour Consultation Package" "Extended consultation package with Michael Crowe. Perfect for facility setup, comprehensive troubleshooting, or staff training. Includes all materials from 1-hour session plus extended follow-up support." 115000
create_onetime "Full Day (6-Hour) Consultation" "Full-day intensive consultation with Michael Crowe. Ideal for facility audits, team training, or complete operation overhauls. Includes on-site or virtual session, detailed report, and 30 days of follow-up support." 225000
create_recurring "Monthly Consulting Retainer - Premium" "Exclusive monthly consulting relationship with Michael Crowe. Priority access, strategic guidance, and ongoing support for commercial operations. For serious cultivators and businesses only." 2500000 "month"

# 3. Crowe Vision Credits
create_onetime "Crowe Vision Analysis Credits - 10 Pack" "10 contamination analysis credits for Crowe Vision AI. Upload images of your cultivation for instant contamination identification and remediation recommendations." 2900
create_onetime "Crowe Vision Analysis Credits - 50 Pack" "50 contamination analysis credits for Crowe Vision AI. Best value for active growers monitoring multiple projects." 9900
create_onetime "Crowe Vision Analysis Credits - 100 Pack" "100 contamination analysis credits for Crowe Vision AI. Perfect for commercial operations or cultivation facilities." 14900

# 4. Video Studio Credits
create_onetime "Video Studio Credits - 5 Videos" "Generate 5 educational cultivation videos using AI. Perfect for documentation, training, or content creation." 4900
create_onetime "Video Studio Credits - 20 Videos" "Generate 20 educational cultivation videos using AI. Best value for content creators and educators." 14900

# 5. Premium Courses
create_onetime "Master Cultivation Course - Complete Program" "Comprehensive 12-week video course taught by Michael Crowe. Includes live Q&A sessions, certification upon completion, lifetime access to materials, and private student community." 99700
create_onetime "Commercial Facility Setup Consultation - Small Scale" "Complete facility design review for small commercial operations (1-5 grow rooms). Includes equipment recommendations, workflow optimization, compliance guidance, and 90 days of email support. For larger operations, contact for enterprise pricing." 5000000
create_onetime "Custom AI Model Training" "Train a dedicated AI model on your facility's specific strains, methods, and protocols. Includes knowledge base integration and dedicated model deployment. Perfect for research institutions and large-scale operations." 500000

echo "✅ All products created. Please verify in Stripe Dashboard:"
echo "https://dashboard.stripe.com/products"
