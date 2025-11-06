# Azure Key Vault Setup Guide

This guide will help you set up Azure Key Vault to securely store and manage your application's API keys and secrets.

## Why Azure Key Vault?

Azure Key Vault provides:
- **Centralized Secret Management**: All secrets in one secure location
- **Access Control**: Fine-grained permissions and audit logging
- **Automatic Rotation**: Support for automatic secret rotation
- **High Availability**: Enterprise-grade reliability
- **Compliance**: Meets various security and compliance standards

## Prerequisites

- Azure subscription
- Azure CLI installed (optional but recommended)
- Owner or Contributor access to your Azure subscription

## Step 1: Create an Azure Key Vault

### Using Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Key Vault" and click "Create"
4. Fill in the details:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or use existing
   - **Key Vault Name**: Choose a unique name (e.g., `crowelogic-keyvault`)
   - **Region**: Select your preferred region
   - **Pricing Tier**: Standard (sufficient for most use cases)
5. Click "Review + Create" then "Create"

### Using Azure CLI

```bash
# Login to Azure
az login

# Create a resource group (if needed)
az group create --name crowelogic-rg --location eastus

# Create the Key Vault
az keyvault create \
  --name crowelogic-keyvault \
  --resource-group crowelogic-rg \
  --location eastus
```

## Step 2: Configure Access Policies

### For Local Development (Service Principal)

1. Create a Service Principal:
```bash
az ad sp create-for-rbac \
  --name crowelogic-app \
  --role "Key Vault Secrets User" \
  --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.KeyVault/vaults/{keyvault-name}
```

2. Note the output values:
   - `appId` → `AZURE_CLIENT_ID`
   - `password` → `AZURE_CLIENT_SECRET`
   - `tenant` → `AZURE_TENANT_ID`

3. Grant the Service Principal access to your Key Vault:
```bash
az keyvault set-policy \
  --name crowelogic-keyvault \
  --spn {appId} \
  --secret-permissions get list
```

### For Production (Managed Identity)

If deploying to Azure App Service, Container Apps, or similar:

1. Enable Managed Identity on your Azure resource
2. Grant the Managed Identity access to Key Vault:
```bash
az keyvault set-policy \
  --name crowelogic-keyvault \
  --object-id {managed-identity-principal-id} \
  --secret-permissions get list
```

## Step 3: Add Secrets to Key Vault

### Important: Secret Naming Convention

Azure Key Vault secret names can only contain alphanumeric characters and hyphens.
Use hyphens instead of underscores:
- `NEXT_PUBLIC_SUPABASE_URL` → `NEXT-PUBLIC-SUPABASE-URL`
- `STRIPE_SECRET_KEY` → `STRIPE-SECRET-KEY`

### Using Azure Portal

1. Go to your Key Vault in Azure Portal
2. Click "Secrets" in the left menu
3. Click "+ Generate/Import"
4. For each secret:
   - **Name**: Use the secret name with hyphens (e.g., `STRIPE-SECRET-KEY`)
   - **Value**: Paste the secret value
   - Click "Create"

### Using Azure CLI

```bash
# Set the Key Vault name
KEYVAULT_NAME="crowelogic-keyvault"

# Add Supabase secrets
az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "NEXT-PUBLIC-SUPABASE-URL" \
  --value "https://your-project.supabase.co"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "NEXT-PUBLIC-SUPABASE-ANON-KEY" \
  --value "your_supabase_anon_key"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "SUPABASE-SERVICE-ROLE-KEY" \
  --value "your_supabase_service_role_key"

# Add Stripe secrets
az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "STRIPE-SECRET-KEY" \
  --value "sk_live_your_stripe_secret_key"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "NEXT-PUBLIC-STRIPE-PUBLISHABLE-KEY" \
  --value "pk_live_your_stripe_publishable_key"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "STRIPE-WEBHOOK-SECRET" \
  --value "whsec_your_webhook_secret"

# Add Stripe Price IDs
az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "NEXT-PUBLIC-MASTER-GROWER-MONTHLY-PRICE-ID" \
  --value "price_xxxxxxxxxxxxx"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "NEXT-PUBLIC-MASTER-GROWER-YEARLY-PRICE-ID" \
  --value "price_xxxxxxxxxxxxx"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "NEXT-PUBLIC-CONSULTATION-1HR-PRICE-ID" \
  --value "price_xxxxxxxxxxxxx"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "NEXT-PUBLIC-CONSULTATION-3HR-PRICE-ID" \
  --value "price_xxxxxxxxxxxxx"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "NEXT-PUBLIC-CONSULTATION-FULLDAY-PRICE-ID" \
  --value "price_xxxxxxxxxxxxx"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "NEXT-PUBLIC-CONSULTATION-RETAINER-PRICE-ID" \
  --value "price_xxxxxxxxxxxxx"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "NEXT-PUBLIC-FACILITY-SETUP-PRICE-ID" \
  --value "price_xxxxxxxxxxxxx"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "NEXT-PUBLIC-CUSTOM-AI-TRAINING-PRICE-ID" \
  --value "price_xxxxxxxxxxxxx"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "NEXT-PUBLIC-MASTER-COURSE-PRICE-ID" \
  --value "price_xxxxxxxxxxxxx"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "NEXT-PUBLIC-VISION-10-PRICE-ID" \
  --value "price_xxxxxxxxxxxxx"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "NEXT-PUBLIC-VISION-50-PRICE-ID" \
  --value "price_xxxxxxxxxxxxx"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "NEXT-PUBLIC-VISION-100-PRICE-ID" \
  --value "price_xxxxxxxxxxxxx"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "NEXT-PUBLIC-VIDEO-5-PRICE-ID" \
  --value "price_xxxxxxxxxxxxx"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "NEXT-PUBLIC-VIDEO-20-PRICE-ID" \
  --value "price_xxxxxxxxxxxxx"

# Add AI service secrets
az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "AZURE-AI-ENDPOINT" \
  --value "https://your-resource-name.openai.azure.com"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "AZURE-AI-API-KEY" \
  --value "your_azure_openai_api_key"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "OPENAI-API-KEY" \
  --value "sk-your_openai_api_key"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "ANTHROPIC-API-KEY" \
  --value "sk-ant-your_anthropic_api_key"

# Add other service secrets
az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "RESEND-API-KEY" \
  --value "re_your_resend_api_key"

az keyvault secret set --vault-name $KEYVAULT_NAME \
  --name "BLOB-READ-WRITE-TOKEN" \
  --value "vercel_blob_your_token"
```

### Using the Batch Upload Script

Save all your secrets in a file named `secrets.txt` (one per line):
```
NEXT-PUBLIC-SUPABASE-URL=https://your-project.supabase.co
STRIPE-SECRET-KEY=sk_live_your_key
AZURE-AI-API-KEY=your_azure_key
```

Then upload them all at once:
```bash
while IFS='=' read -r key value; do
  az keyvault secret set --vault-name crowelogic-keyvault --name "$key" --value "$value"
done < secrets.txt
```

## Step 4: Configure Your Application

### Local Development

Create a `.env.local` file in your project root:

```bash
# Azure Key Vault Configuration
AZURE_KEYVAULT_URL=https://crowelogic-keyvault.vault.azure.net/

# Service Principal credentials (for local development)
AZURE_CLIENT_ID=your_client_id
AZURE_CLIENT_SECRET=your_client_secret
AZURE_TENANT_ID=your_tenant_id
```

### Production Deployment

#### Vercel

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add:
   - `AZURE_KEYVAULT_URL`: Your Key Vault URL
   
If using Service Principal:
   - `AZURE_CLIENT_ID`: Your client ID
   - `AZURE_CLIENT_SECRET`: Your client secret
   - `AZURE_TENANT_ID`: Your tenant ID

#### Azure App Service / Container Apps

1. Enable Managed Identity on your service
2. Set environment variable:
   - `AZURE_KEYVAULT_URL`: Your Key Vault URL
3. No need for client credentials - Managed Identity is used automatically

#### Railway

```bash
railway variables set AZURE_KEYVAULT_URL="https://crowelogic-keyvault.vault.azure.net/"
railway variables set AZURE_CLIENT_ID="your_client_id"
railway variables set AZURE_CLIENT_SECRET="your_client_secret"
railway variables set AZURE_TENANT_ID="your_tenant_id"
```

## Step 5: Test the Integration

1. Start your application:
```bash
npm run dev
```

2. Check the console for Key Vault initialization messages
3. Try accessing a page that uses secrets (e.g., checkout page)
4. Verify no errors related to missing secrets

## Fallback Mode

The application is designed with fallback support:
- If Key Vault is not configured (`AZURE_KEYVAULT_URL` not set), it will use environment variables directly
- This allows for gradual migration and local development without Key Vault

## Security Best Practices

1. **Never commit secrets**: Keep `.env.local` in `.gitignore`
2. **Rotate secrets regularly**: Use Key Vault's rotation features
3. **Use Managed Identity in production**: Avoid hardcoded credentials
4. **Limit access**: Grant minimum required permissions
5. **Monitor access**: Enable Key Vault logging and monitoring
6. **Use separate Key Vaults**: Different vaults for dev/staging/production

## Troubleshooting

### "Failed to initialize Azure Key Vault client"

- Verify `AZURE_KEYVAULT_URL` is correct
- Check authentication credentials (client ID, secret, tenant ID)
- Ensure the Service Principal has access to the Key Vault

### "Failed to retrieve secret from Key Vault"

- Verify the secret exists in Key Vault
- Check the secret name format (use hyphens, not underscores)
- Ensure your identity has "Get" permission on secrets

### "AADSTS700016: Application not found"

- The client ID is incorrect
- The Service Principal may have been deleted
- Create a new Service Principal

### Local development works but production fails

- Verify Managed Identity is enabled in production
- Check that Managed Identity has Key Vault access
- Ensure `AZURE_KEYVAULT_URL` is set in production environment

## Migration Checklist

- [ ] Create Azure Key Vault
- [ ] Configure access policies
- [ ] Add all secrets to Key Vault (use hyphens in names)
- [ ] Set `AZURE_KEYVAULT_URL` in production environment
- [ ] Configure authentication (Service Principal or Managed Identity)
- [ ] Test in development environment
- [ ] Deploy to staging and test
- [ ] Deploy to production
- [ ] Remove old secret environment variables (optional, can keep as backup)
- [ ] Enable Key Vault monitoring and alerts

## Support

For issues or questions:
- Azure Key Vault Documentation: https://docs.microsoft.com/azure/key-vault/
- Azure CLI Reference: https://docs.microsoft.com/cli/azure/keyvault
