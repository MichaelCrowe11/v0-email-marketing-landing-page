#!/bin/bash

# Add Stripe Price IDs to Vercel - Fixed version
# Adds each variable to production, preview, and development separately

echo "=============================================="
echo "Adding Stripe Price IDs to Vercel"
echo "=============================================="
echo ""

# Function to add env var to all environments
add_env_var() {
    local name=$1
    local value=$2
    local label=$3

    echo "$label"

    # Production
    echo "$value" | vercel env add "$name" production > /dev/null 2>&1

    # Preview
    echo "$value" | vercel env add "$name" preview > /dev/null 2>&1

    # Development
    echo "$value" | vercel env add "$name" development > /dev/null 2>&1

    echo "  ✅ Added to production, preview, and development"
}

# Master Grower Tier
add_env_var "NEXT_PUBLIC_MASTER_GROWER_MONTHLY_PRICE_ID" "price_1SMFVEDSZPCbVOig8H6e8QqG" "1/14: Master Grower Monthly"
add_env_var "NEXT_PUBLIC_MASTER_GROWER_YEARLY_PRICE_ID" "price_1SMFVNDSZPCbVOigV1c2Ev1I" "2/14: Master Grower Yearly"

# Consultations
add_env_var "NEXT_PUBLIC_CONSULTATION_1HR_PRICE_ID" "price_1SMFUjDSZPCbVOigXlva52cw" "3/14: 1-Hour Consultation"
add_env_var "NEXT_PUBLIC_CONSULTATION_3HR_PRICE_ID" "price_1SMFUjDSZPCbVOigPJoFrkFK" "4/14: 3-Hour Consultation"
add_env_var "NEXT_PUBLIC_CONSULTATION_FULLDAY_PRICE_ID" "price_1SMFUkDSZPCbVOigD5FvOgAw" "5/14: Full Day Consultation"
add_env_var "NEXT_PUBLIC_CONSULTATION_RETAINER_PRICE_ID" "price_1SMFVQDSZPCbVOig98Q0FyjP" "6/14: Premium Retainer ($25k/mo)"

# Crowe Vision Credits
add_env_var "NEXT_PUBLIC_VISION_10_PRICE_ID" "price_1SMFUlDSZPCbVOigCLirCeGk" "7/14: Crowe Vision 10 Pack"
add_env_var "NEXT_PUBLIC_VISION_50_PRICE_ID" "price_1SMFUmDSZPCbVOighhmKAUsg" "8/14: Crowe Vision 50 Pack"
add_env_var "NEXT_PUBLIC_VISION_100_PRICE_ID" "price_1SMFUmDSZPCbVOig9KRAfLDp" "9/14: Crowe Vision 100 Pack"

# Video Studio Credits
add_env_var "NEXT_PUBLIC_VIDEO_5_PRICE_ID" "price_1SMFUnDSZPCbVOigehqfs4VD" "10/14: Video Studio 5 Credits"
add_env_var "NEXT_PUBLIC_VIDEO_20_PRICE_ID" "price_1SMFUoDSZPCbVOigoTNsvZY7" "11/14: Video Studio 20 Credits"

# Premium Courses
add_env_var "NEXT_PUBLIC_MASTER_COURSE_PRICE_ID" "price_1SMFUoDSZPCbVOigC0nL8thv" "12/14: Master Course ($997)"
add_env_var "NEXT_PUBLIC_FACILITY_SETUP_PRICE_ID" "price_1SMFUpDSZPCbVOiglt8jsQbO" "13/14: Facility Setup ($50k)"
add_env_var "NEXT_PUBLIC_CUSTOM_AI_TRAINING_PRICE_ID" "price_1SMFUqDSZPCbVOigQE2YQ036" "14/14: Custom AI Training ($5k)"

echo ""
echo "=============================================="
echo "✅ All 14 environment variables added!"
echo "=============================================="
echo ""
echo "Environment variables are now available in:"
echo "  ✅ Production"
echo "  ✅ Preview"
echo "  ✅ Development"
echo ""
echo "Next step: Redeploy your project to use the new env vars"
echo ""
echo "Done! 🎉"
