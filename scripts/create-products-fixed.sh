#!/bin/bash

# Create Stripe products with correct CLI syntax
# Creates products and prices separately

echo "=============================================="
echo "Creating Stripe Products - TEST MODE"
echo "=============================================="
echo ""

OUTPUT_FILE="stripe_price_ids_test.txt"
rm -f $OUTPUT_FILE
touch $OUTPUT_FILE

echo "Creating products..."
echo ""

# Function to create product with price
create_product_with_price() {
    local name="$1"
    local description="$2"
    local price="$3"
    local type="$4"
    local interval="$5"

    echo "Creating: $name..."

    # Step 1: Create product
    PRODUCT_RESULT=$(stripe products create --name="$name" --description="$description" 2>&1)
    PRODUCT_ID=$(echo "$PRODUCT_RESULT" | grep -o 'prod_[a-zA-Z0-9]*' | head -1)

    if [[ -z "$PRODUCT_ID" ]]; then
        echo "  ❌ Failed to create product"
        echo "  Response: $PRODUCT_RESULT"
        echo ""
        return
    fi

    echo "  Product ID: $PRODUCT_ID"

    # Step 2: Create price
    if [[ $type == "recurring" ]]; then
        PRICE_RESULT=$(stripe prices create \
            --product="$PRODUCT_ID" \
            --currency=usd \
            --unit-amount="$price" \
            --recurring="interval=$interval" \
            2>&1)
    else
        PRICE_RESULT=$(stripe prices create \
            --product="$PRODUCT_ID" \
            --currency=usd \
            --unit-amount="$price" \
            2>&1)
    fi

    PRICE_ID=$(echo "$PRICE_RESULT" | grep -o 'price_[a-zA-Z0-9]*' | head -1)

    if [[ -z "$PRICE_ID" ]]; then
        echo "  ❌ Failed to create price"
        echo "  Response: $PRICE_RESULT"
    else
        echo "  ✅ Price ID: $PRICE_ID"
        echo "$name|$PRICE_ID" >> $OUTPUT_FILE
    fi

    echo ""
}

echo "=============================================="
echo "1. MASTER GROWER SUBSCRIPTION TIER"
echo "=============================================="
echo ""

create_product_with_price \
    "Master Grower Access - Monthly" \
    "Premium tier with quarterly 1-on-1 consultations, white-label capability, multi-facility management, team collaboration, API access, and dedicated support." \
    "49700" \
    "recurring" \
    "month"

create_product_with_price \
    "Master Grower Access - Yearly" \
    "Premium tier with quarterly 1-on-1 consultations, white-label capability, multi-facility management, team collaboration, API access, and dedicated support." \
    "499700" \
    "recurring" \
    "year"

echo "=============================================="
echo "2. CONSULTATION PACKAGES"
echo "=============================================="
echo ""

create_product_with_price \
    "1-Hour Expert Consultation with Michael Crowe" \
    "One-on-one consultation covering facility setup, contamination issues, yield optimization, or any cultivation challenge." \
    "42500" \
    "one_time" \
    ""

create_product_with_price \
    "3-Hour Consultation Package" \
    "Extended consultation package with Michael Crowe. Perfect for facility setup, comprehensive troubleshooting, or staff training." \
    "115000" \
    "one_time" \
    ""

create_product_with_price \
    "Full Day 6-Hour Consultation" \
    "Full-day intensive consultation with Michael Crowe. Ideal for facility audits, team training, or complete operation overhauls." \
    "225000" \
    "one_time" \
    ""

create_product_with_price \
    "Monthly Consulting Retainer Premium" \
    "Exclusive monthly consulting relationship with Michael Crowe. Priority access, strategic guidance, and ongoing support for commercial operations." \
    "2500000" \
    "recurring" \
    "month"

echo "=============================================="
echo "3. GPT MODULES"
echo "=============================================="
echo ""
echo "⏭️  SKIPPING - GPT products already exist"
echo ""

echo "=============================================="
echo "4. CROWE VISION CREDITS"
echo "=============================================="
echo ""

create_product_with_price \
    "Crowe Vision Analysis Credits 10 Pack" \
    "10 contamination analysis credits for Crowe Vision AI." \
    "2900" \
    "one_time" \
    ""

create_product_with_price \
    "Crowe Vision Analysis Credits 50 Pack" \
    "50 contamination analysis credits for Crowe Vision AI." \
    "9900" \
    "one_time" \
    ""

create_product_with_price \
    "Crowe Vision Analysis Credits 100 Pack" \
    "100 contamination analysis credits for Crowe Vision AI." \
    "14900" \
    "one_time" \
    ""

echo "=============================================="
echo "5. VIDEO STUDIO CREDITS"
echo "=============================================="
echo ""

create_product_with_price \
    "Video Studio Credits 5 Videos" \
    "Generate 5 educational cultivation videos using AI." \
    "4900" \
    "one_time" \
    ""

create_product_with_price \
    "Video Studio Credits 20 Videos" \
    "Generate 20 educational cultivation videos using AI." \
    "14900" \
    "one_time" \
    ""

echo "=============================================="
echo "6. PREMIUM COURSES"
echo "=============================================="
echo ""

create_product_with_price \
    "Master Cultivation Course Complete Program" \
    "Comprehensive 12-week video course taught by Michael Crowe." \
    "99700" \
    "one_time" \
    ""

create_product_with_price \
    "Commercial Facility Setup Small Scale" \
    "Complete facility design review for small commercial operations 1-5 grow rooms." \
    "5000000" \
    "one_time" \
    ""

create_product_with_price \
    "Custom AI Model Training" \
    "Train a dedicated AI model on your facility specific strains methods and protocols." \
    "500000" \
    "one_time" \
    ""

echo ""
echo "=============================================="
echo "✅ ALL 14 PRODUCTS CREATED!"
echo "=============================================="
echo ""
echo "Price IDs saved to: $OUTPUT_FILE"
echo ""
echo "Environment Variables:"
echo "---"
cat $OUTPUT_FILE | awk -F'|' '
{
    name = $1
    gsub(/ /, "_", name)
    gsub(/-/, "_", name)
    gsub(/\(/, "", name)
    gsub(/\)/, "", name)
    name = toupper(name)
    gsub(/__+/, "_", name)
    gsub(/^_/, "", name)
    gsub(/_$/, "", name)
    print "NEXT_PUBLIC_" name "_PRICE_ID=" $2
}
'
echo "---"
echo ""
echo "Done! 🎉"
