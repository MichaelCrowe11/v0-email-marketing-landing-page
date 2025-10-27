#!/bin/bash

# Add Stripe Price IDs to Vercel Environment Variables
# This script adds all 14 new product Price IDs to your Vercel project

echo "=============================================="
echo "Adding Stripe Price IDs to Vercel"
echo "=============================================="
echo ""

# Check if logged in to Vercel
echo "Checking Vercel authentication..."
vercel whoami 2>&1
if [ $? -ne 0 ]; then
    echo ""
    echo "Not logged in to Vercel. Logging in..."
    vercel login
fi

echo ""
echo "Adding environment variables..."
echo ""

# Master Grower Tier
echo "1/14: Master Grower Monthly..."
vercel env add NEXT_PUBLIC_MASTER_GROWER_MONTHLY_PRICE_ID production development preview <<EOF
price_1SMFVEDSZPCbVOig8H6e8QqG
EOF

echo "2/14: Master Grower Yearly..."
vercel env add NEXT_PUBLIC_MASTER_GROWER_YEARLY_PRICE_ID production development preview <<EOF
price_1SMFVNDSZPCbVOigV1c2Ev1I
EOF

# Consultations
echo "3/14: 1-Hour Consultation..."
vercel env add NEXT_PUBLIC_CONSULTATION_1HR_PRICE_ID production development preview <<EOF
price_1SMFUjDSZPCbVOigXlva52cw
EOF

echo "4/14: 3-Hour Consultation..."
vercel env add NEXT_PUBLIC_CONSULTATION_3HR_PRICE_ID production development preview <<EOF
price_1SMFUjDSZPCbVOigPJoFrkFK
EOF

echo "5/14: Full Day Consultation..."
vercel env add NEXT_PUBLIC_CONSULTATION_FULLDAY_PRICE_ID production development preview <<EOF
price_1SMFUkDSZPCbVOigD5FvOgAw
EOF

echo "6/14: Premium Retainer..."
vercel env add NEXT_PUBLIC_CONSULTATION_RETAINER_PRICE_ID production development preview <<EOF
price_1SMFVQDSZPCbVOig98Q0FyjP
EOF

# Crowe Vision Credits
echo "7/14: Crowe Vision 10 Pack..."
vercel env add NEXT_PUBLIC_VISION_10_PRICE_ID production development preview <<EOF
price_1SMFUlDSZPCbVOigCLirCeGk
EOF

echo "8/14: Crowe Vision 50 Pack..."
vercel env add NEXT_PUBLIC_VISION_50_PRICE_ID production development preview <<EOF
price_1SMFUmDSZPCbVOighhmKAUsg
EOF

echo "9/14: Crowe Vision 100 Pack..."
vercel env add NEXT_PUBLIC_VISION_100_PRICE_ID production development preview <<EOF
price_1SMFUmDSZPCbVOig9KRAfLDp
EOF

# Video Studio Credits
echo "10/14: Video Studio 5 Credits..."
vercel env add NEXT_PUBLIC_VIDEO_5_PRICE_ID production development preview <<EOF
price_1SMFUnDSZPCbVOigehqfs4VD
EOF

echo "11/14: Video Studio 20 Credits..."
vercel env add NEXT_PUBLIC_VIDEO_20_PRICE_ID production development preview <<EOF
price_1SMFUoDSZPCbVOigoTNsvZY7
EOF

# Premium Courses
echo "12/14: Master Course..."
vercel env add NEXT_PUBLIC_MASTER_COURSE_PRICE_ID production development preview <<EOF
price_1SMFUoDSZPCbVOigC0nL8thv
EOF

echo "13/14: Facility Setup..."
vercel env add NEXT_PUBLIC_FACILITY_SETUP_PRICE_ID production development preview <<EOF
price_1SMFUpDSZPCbVOiglt8jsQbO
EOF

echo "14/14: Custom AI Training..."
vercel env add NEXT_PUBLIC_CUSTOM_AI_TRAINING_PRICE_ID production development preview <<EOF
price_1SMFUqDSZPCbVOigQE2YQ036
EOF

echo ""
echo "=============================================="
echo "✅ All 14 environment variables added!"
echo "=============================================="
echo ""
echo "Next steps:"
echo "1. Redeploy your Vercel project to use the new env vars"
echo "2. Test the checkout flows"
echo ""
echo "Done! 🎉"
