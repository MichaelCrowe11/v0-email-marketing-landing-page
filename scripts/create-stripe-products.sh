#!/bin/bash

# Stripe Products Creation Script
# This script creates all premium products in Stripe using the Stripe CLI

echo "=============================================="
echo "Crowe Logic AI - Stripe Products Setup"
echo "=============================================="
echo ""
echo "This script will create 19 new products in Stripe."
echo ""
echo "IMPORTANT: Make sure you're logged in to Stripe CLI first!"
echo "Run: stripe login"
echo ""
read -p "Are you logged in to Stripe? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Please run 'stripe login' first, then run this script again."
    exit 1
fi

echo ""
read -p "Are you in TEST mode or LIVE mode? (test/live) " MODE
echo ""

if [[ $MODE != "test" && $MODE != "live" ]]; then
    echo "Invalid mode. Please enter 'test' or 'live'"
    exit 1
fi

# Create output file for Price IDs
OUTPUT_FILE="stripe_price_ids_${MODE}.txt"
rm -f $OUTPUT_FILE
touch $OUTPUT_FILE

echo "Creating products in $MODE mode..."
echo "Price IDs will be saved to: $OUTPUT_FILE"
echo ""

# Function to create product and extract price ID
create_product() {
    local name="$1"
    local description="$2"
    local price="$3"
    local type="$4"
    local interval="$5"

    echo "Creating: $name..."

    if [[ $type == "recurring" ]]; then
        RESULT=$(stripe products create \
            --name="$name" \
            --description="$description" \
            --default-price-data="{\"currency\":\"usd\",\"unit_amount\":$price,\"recurring\":{\"interval\":\"$interval\"}}" \
            --format=json)
    else
        RESULT=$(stripe products create \
            --name="$name" \
            --description="$description" \
            --default-price-data="{\"currency\":\"usd\",\"unit_amount\":$price}" \
            --format=json)
    fi

    PRICE_ID=$(echo $RESULT | grep -o '"default_price": "[^"]*"' | cut -d'"' -f4)

    if [[ -z "$PRICE_ID" ]]; then
        echo "  ❌ Failed to create product"
        echo "  Response: $RESULT"
    else
        echo "  ✅ Created - Price ID: $PRICE_ID"
        echo "$name|$PRICE_ID" >> $OUTPUT_FILE
    fi

    echo ""
}

echo "=============================================="
echo "1. MASTER GROWER SUBSCRIPTION TIER"
echo "=============================================="
echo ""

create_product \
    "Master Grower Access - Monthly" \
    "Premium tier with quarterly 1-on-1 consultations, white-label capability, multi-facility management, team collaboration, API access, and dedicated support." \
    "49700" \
    "recurring" \
    "month"

create_product \
    "Master Grower Access - Yearly" \
    "Premium tier with quarterly 1-on-1 consultations, white-label capability, multi-facility management, team collaboration, API access, and dedicated support." \
    "499700" \
    "recurring" \
    "year"

echo "=============================================="
echo "2. CONSULTATION PACKAGES"
echo "=============================================="
echo ""

create_product \
    "1-Hour Expert Consultation with Michael Crowe" \
    "One-on-one consultation covering facility setup, contamination issues, yield optimization, or any cultivation challenge. Includes pre-call questionnaire, custom recommendations, follow-up summary, and 2 weeks of email support." \
    "42500" \
    "one_time" \
    ""

create_product \
    "3-Hour Consultation Package" \
    "Extended consultation package with Michael Crowe. Perfect for facility setup, comprehensive troubleshooting, or staff training. Includes all materials from 1-hour session plus extended follow-up support." \
    "115000" \
    "one_time" \
    ""

create_product \
    "Full Day (6-Hour) Consultation" \
    "Full-day intensive consultation with Michael Crowe. Ideal for facility audits, team training, or complete operation overhauls. Includes on-site or virtual session, detailed report, and 30 days of follow-up support." \
    "225000" \
    "one_time" \
    ""

create_product \
    "Monthly Consulting Retainer - Premium" \
    "Exclusive monthly consulting relationship with Michael Crowe. Priority access, strategic guidance, and ongoing support for commercial operations. For serious cultivators and businesses only." \
    "2500000" \
    "recurring" \
    "month"

echo "=============================================="
echo "3. GPT MODULES"
echo "=============================================="
echo ""
echo "⏭️  SKIPPING - GPT products already exist with current pricing"
echo "   Existing GPTs will NOT be modified:"
echo "   - Core: \$97"
echo "   - Spawn Master: \$67"
echo "   - Substrate Tech: \$67"
echo "   - Inoculation AI: \$67"
echo "   - Bundles: \$159, \$197, \$149"
echo ""

echo "=============================================="
echo "4. CROWE VISION CREDITS"
echo "=============================================="
echo ""

create_product \
    "Crowe Vision Analysis Credits - 10 Pack" \
    "10 contamination analysis credits for Crowe Vision AI. Upload images of your cultivation for instant contamination identification and remediation recommendations." \
    "2900" \
    "one_time" \
    ""

create_product \
    "Crowe Vision Analysis Credits - 50 Pack" \
    "50 contamination analysis credits for Crowe Vision AI. Best value for active growers monitoring multiple projects." \
    "9900" \
    "one_time" \
    ""

create_product \
    "Crowe Vision Analysis Credits - 100 Pack" \
    "100 contamination analysis credits for Crowe Vision AI. Perfect for commercial operations or cultivation facilities." \
    "14900" \
    "one_time" \
    ""

echo "=============================================="
echo "5. VIDEO STUDIO CREDITS"
echo "=============================================="
echo ""

create_product \
    "Video Studio Credits - 5 Videos" \
    "Generate 5 educational cultivation videos using AI. Perfect for documentation, training, or content creation." \
    "4900" \
    "one_time" \
    ""

create_product \
    "Video Studio Credits - 20 Videos" \
    "Generate 20 educational cultivation videos using AI. Best value for content creators and educators." \
    "14900" \
    "one_time" \
    ""

echo "=============================================="
echo "6. PREMIUM COURSES"
echo "=============================================="
echo ""

create_product \
    "Master Cultivation Course - Complete Program" \
    "Comprehensive 12-week video course taught by Michael Crowe. Includes live Q&A sessions, certification upon completion, lifetime access to materials, and private student community. Transform your cultivation knowledge." \
    "99700" \
    "one_time" \
    ""

create_product \
    "Commercial Facility Setup Consultation - Small Scale" \
    "Complete facility design review for small commercial operations (1-5 grow rooms). Includes equipment recommendations, workflow optimization, compliance guidance, and 90 days of email support. For larger operations (10+ rooms), contact for enterprise pricing." \
    "5000000" \
    "one_time" \
    ""

create_product \
    "Custom AI Model Training" \
    "Train a dedicated AI model on your facility's specific strains, methods, and protocols. Includes knowledge base integration and dedicated model deployment. Perfect for research institutions and large-scale operations." \
    "500000" \
    "one_time" \
    ""

echo ""
echo "=============================================="
echo "✅ ALL PRODUCTS CREATED!"
echo "=============================================="
echo ""
echo "Price IDs have been saved to: $OUTPUT_FILE"
echo ""
echo "Next steps:"
echo "1. Review the file: cat $OUTPUT_FILE"
echo "2. Copy these Price IDs to your Vercel environment variables"
echo "3. Update your .env file with these values"
echo ""
echo "Format for .env:"
echo "---"
cat $OUTPUT_FILE | awk -F'|' '{
    gsub(/[^a-zA-Z0-9]/, "_", $1)
    gsub(/ /, "_", $1)
    gsub(/-/, "_", $1)
    print toupper($1) "_PRICE_ID=" $2
}'
echo "---"
echo ""
echo "Done! 🎉"
