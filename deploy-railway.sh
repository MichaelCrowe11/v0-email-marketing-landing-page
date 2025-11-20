#!/bin/bash

# Railway Deployment Script with Environment Variable Upload
# This script deploys your app to Railway and automatically uploads secrets from Azure Key Vault

echo "🚂 Railway Deployment Script"
echo "================================"

# Check if Railway CLI is installed
echo ""
echo "📦 Checking Railway CLI..."
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Railway CLI. Please install manually: npm install -g @railway/cli"
        exit 1
    fi
fi

echo "✅ Railway CLI is ready"

# Check if logged in to Railway
echo ""
echo "🔐 Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway. Please log in..."
    railway login
    if [ $? -ne 0 ]; then
        echo "❌ Railway login failed"
        exit 1
    fi
fi

echo "✅ Authenticated with Railway"

# Link to Railway project (if not already linked)
echo ""
echo "🔗 Linking to Railway project..."
if [ ! -d ".railway" ]; then
    echo "No Railway project linked. Please link or create a project..."
    railway link
    if [ $? -ne 0 ]; then
        echo "❌ Failed to link Railway project"
        exit 1
    fi
fi

echo "✅ Railway project linked"

# Upload environment variables from .env.railway
echo ""
echo "⬆️ Uploading environment variables to Railway..."

if [ -f ".env.railway" ]; then
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        if [[ "$key" =~ ^#.*$ ]] || [ -z "$key" ]; then
            continue
        fi

        # Skip empty values
        if [ -z "$value" ]; then
            echo "⚠️ Skipping empty variable: $key"
            continue
        fi

        # Skip Railway template variables
        if [[ "$value" =~ \$\{\{.*\}\} ]]; then
            echo "  ℹ️ Skipping template variable: $key (will be set by Railway)"
            continue
        fi

        echo "  Setting $key..."
        railway variables --set "$key=$value" &> /dev/null

        if [ $? -eq 0 ]; then
            echo "  ✅ $key"
        else
            echo "  ⚠️ Failed to set $key"
        fi
    done < .env.railway

    echo ""
    echo "✅ Environment variables uploaded"
else
    echo "❌ .env.railway file not found!"
    echo ""
    echo "📋 To create your .env.railway file:"
    echo "   1. Copy the example file:"
    echo "      cp .env.railway.example .env.railway"
    echo "   2. Edit .env.railway and add your actual values"
    echo "   3. Run this script again"
    echo ""
    echo "ℹ️ You can also set variables manually in the Railway dashboard"
    echo "   or skip this step if you've already configured them."
    echo ""
    read -p "Continue deployment without uploading variables? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

# Optional: Fetch additional secrets from Azure Key Vault
echo ""
echo "🔑 Checking for additional Azure Key Vault secrets..."

VAULT_NAME="kv-michael9832340755092"

# Check if Azure CLI is available
if command -v az &> /dev/null; then
    echo "  Fetching OPENAI_API_KEY from Azure Key Vault..."
    OPENAI_KEY=$(az keyvault secret show --vault-name "$VAULT_NAME" --name "gpt-5-codex-api-key" --query "value" -o tsv 2>/dev/null)
    if [ -n "$OPENAI_KEY" ]; then
        railway variables --set "OPENAI_API_KEY=$OPENAI_KEY" &> /dev/null
        echo "  ✅ OPENAI_API_KEY set from Azure Key Vault"
    else
        echo "  ℹ️ No OpenAI key found in Key Vault (this is optional)"
    fi

    echo "  Fetching ANTHROPIC_API_KEY from Azure Key Vault..."
    ANTHROPIC_KEY=$(az keyvault secret show --vault-name "$VAULT_NAME" --name "ANTHROPIC-API-KEY" --query "value" -o tsv 2>/dev/null)
    if [ -n "$ANTHROPIC_KEY" ]; then
        railway variables --set "ANTHROPIC_API_KEY=$ANTHROPIC_KEY" &> /dev/null
        echo "  ✅ ANTHROPIC_API_KEY set from Azure Key Vault"
    else
        echo "  ℹ️ No Anthropic key found in Key Vault (this is optional)"
    fi
else
    echo "  ℹ️ Azure CLI not found, skipping additional Key Vault secrets"
fi

# Deploy to Railway
echo ""
echo "🚀 Deploying to Railway..."
railway up

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📊 View your deployment:"
    railway open
else
    echo ""
    echo "❌ Deployment failed"
    exit 1
fi

echo ""
echo "🎉 Done!"
