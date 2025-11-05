#!/bin/bash

# ========================================
# Azure Key Vault to Vercel Sync Script
# ========================================
#
# This script retrieves secrets from Azure Key Vault
# and helps you add them to Vercel environment variables
#
# Prerequisites:
# - Azure CLI installed (az)
# - Vercel CLI installed (vercel)
# - Logged into both: az login && vercel login
# ========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Azure Key Vault to Vercel Sync${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI not found. Please install: https://learn.microsoft.com/cli/azure/install-azure-cli${NC}"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found. Installing...${NC}"
    npm i -g vercel
fi

# Prompt for Key Vault name if not set
if [ -z "$KEY_VAULT_NAME" ]; then
    echo -e "${YELLOW}Enter your Azure Key Vault name:${NC}"
    read KEY_VAULT_NAME
fi

echo -e "${GREEN}✓ Using Key Vault: $KEY_VAULT_NAME${NC}"
echo ""

# Check Azure login
echo -e "${BLUE}Checking Azure login...${NC}"
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Not logged into Azure. Logging in...${NC}"
    az login
fi

AZURE_ACCOUNT=$(az account show --query name -o tsv)
echo -e "${GREEN}✓ Logged into Azure as: $AZURE_ACCOUNT${NC}"
echo ""

# List of secrets to sync
declare -a SECRETS=(
    "AZURE-OPENAI-ENDPOINT"
    "AZURE-OPENAI-API-KEY"
    "AZURE-OPENAI-DEPLOYMENT-NAME"
    "AZURE-OPENAI-API-VERSION"
    "AZURE-OPENAI-NOVA-ENDPOINT"
    "AZURE-OPENAI-NOVA-API-KEY"
    "AZURE-OPENAI-NOVA-DEPLOYMENT-NAME"
    "AZURE-OPENAI-NOVA-API-VERSION"
    "AZURE-OPENAI-MICHAEL-ENDPOINT"
    "AZURE-OPENAI-MICHAEL-API-KEY"
    "AZURE-OPENAI-MICHAEL-DEEPSEEK-DEPLOYMENT"
    "AZURE-OPENAI-MICHAEL-GPT4O-DEPLOYMENT"
    "AZURE-OPENAI-MICHAEL-API-VERSION"
    "AZURE-AI-FOUNDRY-ENDPOINT"
    "AZURE-AI-FOUNDRY-GPT5-DEPLOYMENT"
    "NEXT-PUBLIC-SUPABASE-URL"
    "NEXT-PUBLIC-SUPABASE-ANON-KEY"
    "SUPABASE-SERVICE-ROLE-KEY"
    "BLOB-READ-WRITE-TOKEN"
)

# Choose sync method
echo -e "${YELLOW}Choose sync method:${NC}"
echo "1) Generate .env file (for manual copy to Vercel Dashboard)"
echo "2) Add directly to Vercel via CLI (requires vercel login)"
echo ""
read -p "Enter choice [1-2]: " SYNC_METHOD

case $SYNC_METHOD in
    1)
        # Generate .env file
        ENV_FILE=".env.vercel"
        echo -e "${BLUE}Generating $ENV_FILE...${NC}"
        echo "# Generated from Azure Key Vault: $KEY_VAULT_NAME" > $ENV_FILE
        echo "# Date: $(date)" >> $ENV_FILE
        echo "# DO NOT COMMIT THIS FILE" >> $ENV_FILE
        echo "" >> $ENV_FILE

        for SECRET in "${SECRETS[@]}"; do
            echo -e "${YELLOW}Fetching $SECRET...${NC}"

            # Get secret value from Key Vault
            VALUE=$(az keyvault secret show \
                --vault-name "$KEY_VAULT_NAME" \
                --name "$SECRET" \
                --query value -o tsv 2>/dev/null || echo "")

            if [ -z "$VALUE" ]; then
                echo -e "${RED}⚠️  Secret $SECRET not found in Key Vault - skipping${NC}"
                continue
            fi

            # Convert hyphenated name to underscored (AZURE-OPENAI-KEY → AZURE_OPENAI_KEY)
            ENV_NAME=$(echo "$SECRET" | tr '-' '_')

            # Add to .env file
            echo "${ENV_NAME}=\"${VALUE}\"" >> $ENV_FILE

            echo -e "${GREEN}✓ $ENV_NAME${NC}"
        done

        echo ""
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}✓ Success! Secrets saved to: $ENV_FILE${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${YELLOW}Next steps:${NC}"
        echo "1. Open Vercel Dashboard: https://vercel.com/dashboard"
        echo "2. Go to your project → Settings → Environment Variables"
        echo "3. Copy each variable from $ENV_FILE to Vercel"
        echo "4. Select 'Production' environment"
        echo "5. Delete $ENV_FILE after copying (don't commit it!)"
        echo ""
        echo -e "${RED}⚠️  IMPORTANT: Add $ENV_FILE to .gitignore and delete after use!${NC}"
        ;;

    2)
        # Add directly to Vercel
        echo -e "${BLUE}Checking Vercel login...${NC}"

        if ! vercel whoami &> /dev/null; then
            echo -e "${YELLOW}Not logged into Vercel. Logging in...${NC}"
            vercel login
        fi

        VERCEL_USER=$(vercel whoami)
        echo -e "${GREEN}✓ Logged into Vercel as: $VERCEL_USER${NC}"
        echo ""

        # Link project if not linked
        if [ ! -f ".vercel/project.json" ]; then
            echo -e "${YELLOW}Project not linked. Linking now...${NC}"
            vercel link
        fi

        echo -e "${BLUE}Adding secrets to Vercel...${NC}"
        echo ""

        for SECRET in "${SECRETS[@]}"; do
            echo -e "${YELLOW}Processing $SECRET...${NC}"

            # Get secret value from Key Vault
            VALUE=$(az keyvault secret show \
                --vault-name "$KEY_VAULT_NAME" \
                --name "$SECRET" \
                --query value -o tsv 2>/dev/null || echo "")

            if [ -z "$VALUE" ]; then
                echo -e "${RED}⚠️  Secret $SECRET not found in Key Vault - skipping${NC}"
                continue
            fi

            # Convert hyphenated name to underscored
            ENV_NAME=$(echo "$SECRET" | tr '-' '_')

            # Add to Vercel (production environment)
            echo "$VALUE" | vercel env add "$ENV_NAME" production --force 2>/dev/null

            echo -e "${GREEN}✓ $ENV_NAME added to Vercel${NC}"
        done

        echo ""
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}✓ Success! All secrets synced to Vercel${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${YELLOW}Next steps:${NC}"
        echo "1. Deploy to production: ${BLUE}vercel --prod${NC}"
        echo "2. Verify deployment: Check Vercel Dashboard"
        echo ""
        ;;

    *)
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}🎉 Script complete!${NC}"
