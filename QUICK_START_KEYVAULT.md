# Quick Start Guide: Azure Key Vault Integration

This guide provides the fastest path to getting your application running with Azure Key Vault.

## 🚀 Quick Setup (5 minutes)

### Option 1: Use Environment Variables (No Key Vault)

If you want to start quickly without Azure Key Vault:

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your actual values in `.env.local`

3. Start the application:
   ```bash
   npm install
   npm run dev
   ```

**Note:** The application will automatically use environment variables if Key Vault is not configured.

### Option 2: Use Azure Key Vault (Recommended for Production)

#### Prerequisites
- Azure subscription
- Azure CLI installed

#### Step 1: Create Key Vault (2 minutes)

```bash
# Login to Azure
az login

# Set your variables
RESOURCE_GROUP="crowelogic-rg"
KEYVAULT_NAME="crowelogic-kv-$(date +%s)"  # Generates unique name
LOCATION="eastus"

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Key Vault
az keyvault create \
  --name $KEYVAULT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# Save the URL (you'll need it)
echo "Your Key Vault URL: https://${KEYVAULT_NAME}.vault.azure.net/"
```

#### Step 2: Create Service Principal (1 minute)

```bash
# Create service principal
az ad sp create-for-rbac --name "crowelogic-app" --skip-assignment > sp.json

# Get the values
CLIENT_ID=$(cat sp.json | grep appId | cut -d'"' -f4)
CLIENT_SECRET=$(cat sp.json | grep password | cut -d'"' -f4)
TENANT_ID=$(cat sp.json | grep tenant | cut -d'"' -f4)

# Grant access to Key Vault
az keyvault set-policy \
  --name $KEYVAULT_NAME \
  --spn $CLIENT_ID \
  --secret-permissions get list

echo "Save these values:"
echo "AZURE_CLIENT_ID=$CLIENT_ID"
echo "AZURE_CLIENT_SECRET=$CLIENT_SECRET"
echo "AZURE_TENANT_ID=$TENANT_ID"

# Clean up the file
rm sp.json
```

#### Step 3: Add Secrets to Key Vault (2 minutes)

Upload your secrets from a file:

```bash
# Create a secrets file
cat > secrets.txt << 'EOF'
NEXT-PUBLIC-SUPABASE-URL=https://your-project.supabase.co
NEXT-PUBLIC-SUPABASE-ANON-KEY=your_supabase_anon_key
SUPABASE-SERVICE-ROLE-KEY=your_supabase_service_role_key
STRIPE-SECRET-KEY=sk_test_your_key
NEXT-PUBLIC-STRIPE-PUBLISHABLE-KEY=pk_test_your_key
STRIPE-WEBHOOK-SECRET=whsec_your_secret
AZURE-AI-ENDPOINT=https://your-resource.openai.azure.com
AZURE-AI-API-KEY=your_azure_ai_key
EOF

# Upload all secrets
while IFS='=' read -r key value; do
  [[ -z "$key" || "$key" =~ ^#.*$ ]] && continue
  echo "Setting $key..."
  az keyvault secret set --vault-name $KEYVAULT_NAME --name "$key" --value "$value"
done < secrets.txt

# Clean up
rm secrets.txt
```

#### Step 4: Configure Your Application

Create `.env.local` with only the Key Vault configuration:

```bash
cat > .env.local << EOF
AZURE_KEYVAULT_URL=https://${KEYVAULT_NAME}.vault.azure.net/
AZURE_CLIENT_ID=${CLIENT_ID}
AZURE_CLIENT_SECRET=${CLIENT_SECRET}
AZURE_TENANT_ID=${TENANT_ID}
EOF
```

#### Step 5: Start the Application

```bash
npm install
npm run dev
```

Visit http://localhost:3000/api/health to verify all secrets are loaded.

## 📋 Adding Missing Stripe Price IDs

If you see warnings about missing Stripe Price IDs:

```bash
# Set the Stripe Price IDs
az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "NEXT-PUBLIC-MASTER-GROWER-MONTHLY-PRICE-ID" \
  --value "price_xxxxx"

# Repeat for all 14 price IDs (see .env.example for the complete list)
```

Or use a batch script:

```bash
cat > stripe-prices.txt << 'EOF'
NEXT-PUBLIC-MASTER-GROWER-MONTHLY-PRICE-ID=price_xxxxx
NEXT-PUBLIC-MASTER-GROWER-YEARLY-PRICE-ID=price_xxxxx
NEXT-PUBLIC-CONSULTATION-1HR-PRICE-ID=price_xxxxx
NEXT-PUBLIC-CONSULTATION-3HR-PRICE-ID=price_xxxxx
NEXT-PUBLIC-CONSULTATION-FULLDAY-PRICE-ID=price_xxxxx
NEXT-PUBLIC-CONSULTATION-RETAINER-PRICE-ID=price_xxxxx
NEXT-PUBLIC-FACILITY-SETUP-PRICE-ID=price_xxxxx
NEXT-PUBLIC-CUSTOM-AI-TRAINING-PRICE-ID=price_xxxxx
NEXT-PUBLIC-MASTER-COURSE-PRICE-ID=price_xxxxx
NEXT-PUBLIC-VISION-10-PRICE-ID=price_xxxxx
NEXT-PUBLIC-VISION-50-PRICE-ID=price_xxxxx
NEXT-PUBLIC-VISION-100-PRICE-ID=price_xxxxx
NEXT-PUBLIC-VIDEO-5-PRICE-ID=price_xxxxx
NEXT-PUBLIC-VIDEO-20-PRICE-ID=price_xxxxx
EOF

while IFS='=' read -r key value; do
  az keyvault secret set --vault-name $KEYVAULT_NAME --name "$key" --value "$value"
done < stripe-prices.txt
```

## ✅ Verification

1. **Check Health Endpoint:**
   ```bash
   curl http://localhost:3000/api/health
   ```

   Expected output:
   ```json
   {
     "status": "healthy",
     "message": "All systems operational",
     "checks": [...]
   }
   ```

2. **Check Logs:**
   Look for these messages in your console:
   - ✅ Azure Key Vault is enabled
   - ✅ All required configuration is present

3. **Test the Application:**
   - Visit the homepage
   - Try signing in
   - Test a payment flow (if configured)

## 🔧 Troubleshooting

### "Failed to initialize Azure Key Vault client"

**Solution:** Verify your credentials:
```bash
# Test access to Key Vault
az keyvault secret list --vault-name $KEYVAULT_NAME
```

### "Missing required configuration"

**Solution:** Check which secrets are missing:
```bash
# List all secrets in Key Vault
az keyvault secret list --vault-name $KEYVAULT_NAME --query "[].name" -o tsv
```

### "AADSTS700016: Application not found"

**Solution:** Your service principal might be deleted. Create a new one:
```bash
# Recreate service principal
az ad sp create-for-rbac --name "crowelogic-app-new" --skip-assignment
```

## 🌍 Deploying to Production

### Vercel

1. Go to your project settings
2. Add environment variables:
   - `AZURE_KEYVAULT_URL`
   - `AZURE_CLIENT_ID`
   - `AZURE_CLIENT_SECRET`
   - `AZURE_TENANT_ID`
3. Deploy!

### Railway

```bash
railway variables set AZURE_KEYVAULT_URL="https://your-kv.vault.azure.net/"
railway variables set AZURE_CLIENT_ID="your-client-id"
railway variables set AZURE_CLIENT_SECRET="your-client-secret"
railway variables set AZURE_TENANT_ID="your-tenant-id"
railway up
```

### Azure App Service

1. Enable Managed Identity
2. Grant Key Vault access:
   ```bash
   az keyvault set-policy \
     --name $KEYVAULT_NAME \
     --object-id $(az webapp identity show --name your-app --resource-group your-rg --query principalId -o tsv) \
     --secret-permissions get list
   ```
3. Set environment variable:
   ```bash
   az webapp config appsettings set \
     --name your-app \
     --resource-group your-rg \
     --settings AZURE_KEYVAULT_URL="https://your-kv.vault.azure.net/"
   ```

## 📚 Additional Resources

- [Full Azure Key Vault Setup Guide](./AZURE_KEYVAULT_SETUP.md)
- [Deployment Readiness Checklist](./DEPLOYMENT_READINESS.md)
- [Environment Variables Reference](./.env.example)

## 💡 Tips

1. **Use separate Key Vaults** for development, staging, and production
2. **Enable soft delete** on your Key Vault for recovery
3. **Set up monitoring** to track secret access
4. **Rotate secrets regularly** (every 90 days recommended)
5. **Use Managed Identity** in production instead of Service Principal when possible

## 🆘 Need Help?

- Check the [full documentation](./AZURE_KEYVAULT_SETUP.md)
- Review the [deployment checklist](./DEPLOYMENT_READINESS.md)
- Open an issue in the repository
