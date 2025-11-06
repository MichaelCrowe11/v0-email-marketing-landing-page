# Migration Guide: Moving to Azure Key Vault

This guide helps you migrate from environment variables to Azure Key Vault without downtime.

## 🎯 Migration Strategy

The application is designed to support gradual migration with zero downtime:
- **Phase 1:** Deploy with Key Vault enabled alongside existing environment variables
- **Phase 2:** Verify Key Vault is working correctly
- **Phase 3:** (Optional) Remove environment variables from deployment platform

## 📊 Pre-Migration Checklist

- [ ] Document all current environment variables and their values
- [ ] Ensure you have Azure subscription access
- [ ] Back up current deployment configuration
- [ ] Schedule migration during low-traffic period (optional)
- [ ] Notify team members of planned migration

## 🔄 Migration Steps

### Step 1: Export Current Environment Variables

Export your current environment variables to a file:

**For Vercel:**
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.production

# Convert to Key Vault format
cat .env.production | sed 's/_/-/g' > keyvault-secrets.txt
```

**For Railway:**
```bash
# Install Railway CLI if needed
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Export variables
railway variables > railway-vars.txt

# Convert format
cat railway-vars.txt | sed 's/_/-/g' > keyvault-secrets.txt
```

**Manual Export:**
Create a file named `keyvault-secrets.txt` with your current values:
```
NEXT-PUBLIC-SUPABASE-URL=https://your-project.supabase.co
NEXT-PUBLIC-SUPABASE-ANON-KEY=your_value
SUPABASE-SERVICE-ROLE-KEY=your_value
STRIPE-SECRET-KEY=sk_live_your_key
NEXT-PUBLIC-STRIPE-PUBLISHABLE-KEY=pk_live_your_key
STRIPE-WEBHOOK-SECRET=whsec_your_secret
AZURE-AI-ENDPOINT=https://your-resource.openai.azure.com
AZURE-AI-API-KEY=your_key
OPENAI-API-KEY=sk-your_key
ANTHROPIC-API-KEY=sk-ant-your_key
RESEND-API-KEY=re_your_key
BLOB-READ-WRITE-TOKEN=vercel_blob_your_token
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
```

### Step 2: Create Azure Key Vault

```bash
# Set variables
RESOURCE_GROUP="crowelogic-prod-rg"
KEYVAULT_NAME="crowelogic-prod-kv"
LOCATION="eastus"

# Login to Azure
az login

# Create resource group (if not exists)
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Key Vault with soft-delete and purge protection
az keyvault create \
  --name $KEYVAULT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --enable-soft-delete true \
  --enable-purge-protection true

# Save the URL
echo "Key Vault URL: https://${KEYVAULT_NAME}.vault.azure.net/"
```

### Step 3: Create Service Principal

```bash
# Create service principal for the application
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
KEYVAULT_ID="/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.KeyVault/vaults/${KEYVAULT_NAME}"

az ad sp create-for-rbac \
  --name "crowelogic-prod-app" \
  --role "Key Vault Secrets User" \
  --scopes $KEYVAULT_ID \
  > sp-credentials.json

# Display credentials (save these securely)
echo "========================================"
echo "SAVE THESE CREDENTIALS SECURELY:"
echo "========================================"
cat sp-credentials.json
echo "========================================"

# Extract values
CLIENT_ID=$(cat sp-credentials.json | grep appId | cut -d'"' -f4)
CLIENT_SECRET=$(cat sp-credentials.json | grep password | cut -d'"' -f4)
TENANT_ID=$(cat sp-credentials.json | grep tenant | cut -d'"' -f4)

# Grant explicit Key Vault access (if not already granted)
az keyvault set-policy \
  --name $KEYVAULT_NAME \
  --spn $CLIENT_ID \
  --secret-permissions get list

# Securely delete the credentials file
shred -u sp-credentials.json 2>/dev/null || rm sp-credentials.json
```

### Step 4: Upload Secrets to Key Vault

```bash
# Upload all secrets from your file
while IFS='=' read -r key value; do
  # Skip empty lines and comments
  [[ -z "$key" || "$key" =~ ^#.*$ ]] && continue
  
  echo "Uploading secret: $key"
  az keyvault secret set \
    --vault-name $KEYVAULT_NAME \
    --name "$key" \
    --value "$value" \
    --output none
done < keyvault-secrets.txt

# Verify upload
echo ""
echo "Uploaded secrets:"
az keyvault secret list --vault-name $KEYVAULT_NAME --query "[].name" -o tsv | sort

# Securely delete the secrets file
shred -u keyvault-secrets.txt 2>/dev/null || rm keyvault-secrets.txt
```

### Step 5: Add Key Vault Configuration to Deployment

**For Vercel:**
```bash
# Add Key Vault configuration (keep existing env vars for now)
vercel env add AZURE_KEYVAULT_URL production
# Enter: https://crowelogic-prod-kv.vault.azure.net/

vercel env add AZURE_CLIENT_ID production
# Enter: [your-client-id]

vercel env add AZURE_CLIENT_SECRET production
# Enter: [your-client-secret]

vercel env add AZURE_TENANT_ID production
# Enter: [your-tenant-id]
```

**For Railway:**
```bash
# Add Key Vault configuration
railway variables set AZURE_KEYVAULT_URL="https://crowelogic-prod-kv.vault.azure.net/"
railway variables set AZURE_CLIENT_ID="your-client-id"
railway variables set AZURE_CLIENT_SECRET="your-client-secret"
railway variables set AZURE_TENANT_ID="your-tenant-id"
```

**For Azure App Service:**
```bash
# If using Managed Identity (recommended)
az webapp identity assign \
  --name your-app-name \
  --resource-group $RESOURCE_GROUP

# Get the identity
IDENTITY_ID=$(az webapp identity show \
  --name your-app-name \
  --resource-group $RESOURCE_GROUP \
  --query principalId -o tsv)

# Grant Key Vault access
az keyvault set-policy \
  --name $KEYVAULT_NAME \
  --object-id $IDENTITY_ID \
  --secret-permissions get list

# Set only the Key Vault URL
az webapp config appsettings set \
  --name your-app-name \
  --resource-group $RESOURCE_GROUP \
  --settings AZURE_KEYVAULT_URL="https://${KEYVAULT_NAME}.vault.azure.net/"
```

### Step 6: Deploy and Verify

```bash
# Trigger a new deployment
# For Vercel:
vercel --prod

# For Railway:
railway up

# For others, trigger your deployment process
```

**Verify the deployment:**
```bash
# Check health endpoint
curl https://your-domain.com/api/health

# Should return:
# {
#   "status": "healthy",
#   "message": "All systems operational",
#   ...
# }
```

**Check logs for Key Vault initialization:**
- Look for: "✅ Azure Key Vault is enabled"
- Ensure no error messages about missing secrets

### Step 7: Test Critical Functionality

Test these critical flows to ensure everything works:

- [ ] Homepage loads
- [ ] User authentication (sign in/sign up)
- [ ] Payment processing
- [ ] AI chat functionality
- [ ] Email sending (if configured)
- [ ] File uploads (if configured)

### Step 8: Monitor for 24-48 Hours

Monitor your application for 24-48 hours to ensure stability:
- Check error logs
- Monitor Key Vault metrics
- Verify no authentication failures
- Check payment processing success rate

### Step 9: (Optional) Remove Environment Variables

Once you've verified everything works with Key Vault:

```bash
# For Vercel - remove individual secrets (keep Key Vault config)
# Do this through the Vercel dashboard UI

# For Railway - remove secrets one by one
railway variables delete SUPABASE_SERVICE_ROLE_KEY
railway variables delete STRIPE_SECRET_KEY
# etc...

# Keep these:
# - AZURE_KEYVAULT_URL
# - AZURE_CLIENT_ID
# - AZURE_CLIENT_SECRET
# - AZURE_TENANT_ID
```

**⚠️ Warning:** Only do this after confirming Key Vault is working properly for at least 24 hours!

## 🔄 Rollback Procedure

If you encounter issues after migration:

### Quick Rollback (Environment variables still in place)

1. Remove Key Vault environment variables:
   ```bash
   # For Vercel
   vercel env rm AZURE_KEYVAULT_URL production
   
   # For Railway
   railway variables delete AZURE_KEYVAULT_URL
   ```

2. Redeploy the application

3. The app will automatically fall back to environment variables

### Full Rollback (If you removed environment variables)

1. Re-add all environment variables from your backup
2. Remove Key Vault configuration
3. Redeploy

## 🧪 Testing in Staging First

It's highly recommended to test the migration in staging first:

```bash
# Create staging Key Vault
STAGING_KV="crowelogic-staging-kv"
az keyvault create --name $STAGING_KV --resource-group $RESOURCE_GROUP --location $LOCATION

# Upload test secrets
# ... repeat steps above for staging

# Deploy to staging and test thoroughly
```

## 📊 Migration Checklist

**Pre-Migration:**
- [ ] All current environment variables documented
- [ ] Azure Key Vault created and configured
- [ ] Service Principal created with proper permissions
- [ ] All secrets uploaded to Key Vault
- [ ] Secrets verified in Key Vault

**Migration:**
- [ ] Key Vault configuration added to deployment
- [ ] New deployment triggered
- [ ] Health check returns healthy status
- [ ] Key Vault initialization message in logs
- [ ] No error messages about missing secrets

**Post-Migration Testing:**
- [ ] Homepage loads successfully
- [ ] Authentication works
- [ ] Payment processing works
- [ ] AI features work
- [ ] All API endpoints responding
- [ ] No increase in error rates

**Monitoring (24-48 hours):**
- [ ] Error rates stable
- [ ] Performance metrics normal
- [ ] No Key Vault authentication failures
- [ ] Payment success rate unchanged
- [ ] User experience unaffected

**Cleanup (Optional):**
- [ ] Environment variables removed from deployment platform
- [ ] Old credentials rotated/revoked
- [ ] Documentation updated

## 🔐 Security Best Practices

1. **Never commit credentials** to version control
2. **Use Managed Identity** in production (Azure resources)
3. **Enable Key Vault logging** and monitoring
4. **Set up alerts** for unauthorized access attempts
5. **Rotate credentials** regularly (90 days recommended)
6. **Use separate Key Vaults** for different environments
7. **Enable soft-delete** and purge protection
8. **Implement least privilege** access policies

## 🆘 Troubleshooting

### "Failed to retrieve secret from Key Vault"

**Possible causes:**
- Service Principal doesn't have access
- Secret name doesn't match (check for underscore vs hyphen)
- Key Vault firewall blocking requests

**Solution:**
```bash
# Verify access
az keyvault secret show --vault-name $KEYVAULT_NAME --name "STRIPE-SECRET-KEY"

# If access denied, re-grant permissions
az keyvault set-policy --name $KEYVAULT_NAME --spn $CLIENT_ID --secret-permissions get list
```

### Application still using environment variables

**Check:**
- Is `AZURE_KEYVAULT_URL` set in production?
- Are credentials correct?
- Check logs for initialization messages

### Some secrets not found

**Verify secret names:**
```bash
# List all secrets
az keyvault secret list --vault-name $KEYVAULT_NAME --query "[].name" -o tsv

# Compare with required secrets in .env.example
```

## 📚 Additional Resources

- [Azure Key Vault Setup Guide](./AZURE_KEYVAULT_SETUP.md)
- [Quick Start Guide](./QUICK_START_KEYVAULT.md)
- [Deployment Readiness Checklist](./DEPLOYMENT_READINESS.md)

## 💡 Tips

1. **Test in staging first** - Always validate the migration in a staging environment
2. **Keep fallback ready** - Don't remove environment variables immediately
3. **Monitor closely** - Watch error rates and performance for 24-48 hours
4. **Document everything** - Keep records of what was migrated and when
5. **Have rollback plan** - Know how to quickly revert if needed
