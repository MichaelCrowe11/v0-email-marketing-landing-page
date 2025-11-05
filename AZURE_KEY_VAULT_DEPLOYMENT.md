# Azure Key Vault Integration for Vercel Deployment

**Last Updated:** 2025-11-05
**Status:** Production Ready

---

## 🔐 Overview

Since your environment variables are stored in **Azure Key Vault**, you have two main options for deploying to Vercel:

1. **Option A:** Manually sync secrets from Key Vault to Vercel (one-time setup)
2. **Option B:** Use Azure Key Vault references in runtime (advanced)

**Recommended:** Option A (simpler, works with Vercel's edge network)

---

## 📋 Option A: Sync Secrets to Vercel (Recommended)

This approach retrieves secrets from Azure Key Vault once and adds them to Vercel's environment variables.

### Step 1: Retrieve Secrets from Azure Key Vault

#### Using Azure CLI

```bash
# Login to Azure
az login

# Set your Key Vault name
KEY_VAULT_NAME="your-key-vault-name"

# Retrieve individual secrets
az keyvault secret show --vault-name $KEY_VAULT_NAME --name AZURE-OPENAI-ENDPOINT --query value -o tsv
az keyvault secret show --vault-name $KEY_VAULT_NAME --name AZURE-OPENAI-API-KEY --query value -o tsv
az keyvault secret show --vault-name $KEY_VAULT_NAME --name NEXT-PUBLIC-SUPABASE-URL --query value -o tsv
# ... repeat for all secrets
```

#### Using Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Key Vault
3. Select **Secrets** from left menu
4. Click each secret name
5. Click **Show Secret Value**
6. Copy the value

### Step 2: Add Secrets to Vercel

#### Method 1: Vercel Dashboard (Easiest)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. For each secret:
   - Click **Add New**
   - Name: Use the environment variable name (e.g., `AZURE_OPENAI_ENDPOINT`)
   - Value: Paste the secret from Key Vault
   - Environment: Select **Production** (and Preview/Development if needed)
   - Click **Save**

#### Method 2: Vercel CLI

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Add each environment variable
vercel env add AZURE_OPENAI_ENDPOINT production
# Paste the value when prompted

vercel env add AZURE_OPENAI_API_KEY production
# Paste the value when prompted

# Repeat for all variables...
```

### Step 3: Required Environment Variables

Add these secrets from your Key Vault to Vercel:

```bash
# Azure OpenAI - Primary Resource
AZURE_OPENAI_ENDPOINT
AZURE_OPENAI_API_KEY
AZURE_OPENAI_DEPLOYMENT_NAME
AZURE_OPENAI_API_VERSION

# Azure OpenAI - Nova Resource
AZURE_OPENAI_NOVA_ENDPOINT
AZURE_OPENAI_NOVA_API_KEY
AZURE_OPENAI_NOVA_DEPLOYMENT_NAME
AZURE_OPENAI_NOVA_API_VERSION

# Azure OpenAI - Michael Resource
AZURE_OPENAI_MICHAEL_ENDPOINT
AZURE_OPENAI_MICHAEL_API_KEY
AZURE_OPENAI_MICHAEL_DEEPSEEK_DEPLOYMENT
AZURE_OPENAI_MICHAEL_GPT4O_DEPLOYMENT
AZURE_OPENAI_MICHAEL_API_VERSION

# Azure AI Foundry (if accessible)
AZURE_AI_FOUNDRY_ENDPOINT
AZURE_AI_FOUNDRY_GPT5_DEPLOYMENT

# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN
```

### Step 4: Deploy

```bash
# Deploy to production
vercel --prod

# OR if you have GitHub integration, just push:
git push origin main
```

---

## 🔄 Option B: Script to Sync All Secrets

Create a script to automate syncing from Key Vault to Vercel.

### Create `sync-secrets.sh`

```bash
#!/bin/bash

# Configuration
KEY_VAULT_NAME="your-key-vault-name"
VERCEL_PROJECT_ID="your-vercel-project-id"

# Login to Azure
az login

# List of secrets to sync
secrets=(
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
    "NEXT-PUBLIC-SUPABASE-URL"
    "NEXT-PUBLIC-SUPABASE-ANON-KEY"
    "SUPABASE-SERVICE-ROLE-KEY"
    "BLOB-READ-WRITE-TOKEN"
)

echo "🔐 Syncing secrets from Azure Key Vault to Vercel..."

for secret in "${secrets[@]}"; do
    echo "Processing $secret..."

    # Get secret from Key Vault (convert hyphens to underscores for env var)
    value=$(az keyvault secret show \
        --vault-name $KEY_VAULT_NAME \
        --name $secret \
        --query value -o tsv)

    # Convert name to env var format (AZURE-OPENAI-KEY → AZURE_OPENAI_KEY)
    env_name=$(echo $secret | tr '-' '_')

    # Add to Vercel (requires vercel CLI and login)
    echo "$value" | vercel env add $env_name production --force

    echo "✅ $env_name synced"
done

echo "🎉 All secrets synced successfully!"
```

### Make it executable and run:

```bash
chmod +x sync-secrets.sh
./sync-secrets.sh
```

---

## 🔧 Option C: Runtime Key Vault Integration (Advanced)

For applications that need to fetch secrets at runtime from Key Vault.

### Install Azure SDK

```bash
npm install @azure/keyvault-secrets @azure/identity
```

### Create Key Vault Client (`lib/azure-keyvault.ts`)

```typescript
import { SecretClient } from "@azure/keyvault-secrets"
import { DefaultAzureCredential } from "@azure/identity"

const keyVaultName = process.env.KEY_VAULT_NAME
const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`

const credential = new DefaultAzureCredential()
const client = new SecretClient(keyVaultUrl, credential)

export async function getSecret(secretName: string): Promise<string> {
  try {
    const secret = await client.getSecret(secretName)
    return secret.value || ""
  } catch (error) {
    console.error(`Error fetching secret ${secretName}:`, error)
    throw error
  }
}

export async function getSecrets(secretNames: string[]): Promise<Record<string, string>> {
  const secrets: Record<string, string> = {}

  await Promise.all(
    secretNames.map(async (name) => {
      secrets[name] = await getSecret(name)
    })
  )

  return secrets
}
```

### Use in API Routes

```typescript
// app/api/ai/stream/route.ts
import { getSecret } from "@/lib/azure-keyvault"

export async function POST(req: Request) {
  // Fetch secrets at runtime
  const apiKey = await getSecret("AZURE-OPENAI-API-KEY")
  const endpoint = await getSecret("AZURE-OPENAI-ENDPOINT")

  // Use secrets...
}
```

### Add to Vercel Environment

```bash
# Only need to add Key Vault name and authentication
vercel env add KEY_VAULT_NAME production
vercel env add AZURE_CLIENT_ID production
vercel env add AZURE_CLIENT_SECRET production
vercel env add AZURE_TENANT_ID production
```

**Note:** This approach has higher latency and requires Azure authentication setup in Vercel.

---

## 🔐 Secret Naming Convention

### Azure Key Vault Format
Key Vault uses **hyphens** for secret names:
```
AZURE-OPENAI-API-KEY
NEXT-PUBLIC-SUPABASE-URL
```

### Environment Variable Format
Code expects **underscores**:
```
AZURE_OPENAI_API_KEY
NEXT_PUBLIC_SUPABASE_URL
```

### Conversion

When syncing, convert hyphens to underscores:

```bash
# From Key Vault
AZURE-OPENAI-API-KEY

# To Vercel
AZURE_OPENAI_API_KEY
```

The sync script handles this automatically.

---

## 📋 Deployment Checklist with Key Vault

### Pre-Deployment

- [ ] Azure CLI installed (`az --version`)
- [ ] Logged into Azure (`az login`)
- [ ] Key Vault name identified
- [ ] Vercel CLI installed (`vercel --version`)
- [ ] Vercel project linked (`vercel link`)

### Sync Secrets

- [ ] Retrieve all secrets from Key Vault
- [ ] Convert hyphenated names to underscores
- [ ] Add each secret to Vercel (Production environment)
- [ ] Verify secrets in Vercel Dashboard

### Deploy

- [ ] Run `vercel --prod` or push to main branch
- [ ] Monitor deployment logs
- [ ] Verify no "missing environment variable" errors

### Post-Deployment

- [ ] Test API endpoints
- [ ] Verify Azure OpenAI connections work
- [ ] Check Supabase connection
- [ ] Test file uploads (Blob storage)

---

## 🚀 Quick Deploy with Key Vault

### One-Line Secret Retrieval

```bash
# Set your Key Vault name
export KEY_VAULT_NAME="your-key-vault-name"

# Get all secrets and format for Vercel
az keyvault secret list --vault-name $KEY_VAULT_NAME --query "[].name" -o tsv | while read secret; do
    value=$(az keyvault secret show --vault-name $KEY_VAULT_NAME --name $secret --query value -o tsv)
    env_name=$(echo $secret | tr '-' '_')
    echo "export $env_name=\"$value\""
done > .env.production.local
```

Then copy values from `.env.production.local` to Vercel Dashboard.

---

## 🔒 Security Best Practices

### DO

✅ **Use Azure RBAC** - Grant minimal permissions to access Key Vault
✅ **Enable Key Vault logging** - Monitor secret access
✅ **Rotate secrets regularly** - Update both Key Vault and Vercel
✅ **Use Managed Identity** - For runtime Key Vault access (Option C)
✅ **Keep Key Vault name secret** - Don't commit in code

### DON'T

❌ **Don't commit secrets** - Even temporarily
❌ **Don't share Key Vault access widely** - Use RBAC
❌ **Don't store secrets in plain text** - Even locally
❌ **Don't reuse secrets** - Different environments = different secrets

---

## 🔄 Secret Rotation

When you rotate secrets in Key Vault:

### Manual Update

1. Update secret in Azure Key Vault
2. Retrieve new value: `az keyvault secret show --vault-name $KEY_VAULT_NAME --name SECRET-NAME`
3. Update in Vercel Dashboard: Settings → Environment Variables → Edit
4. Redeploy: `vercel --prod` or trigger via git push

### Automated Update

Use the sync script:

```bash
# Re-run sync script after rotation
./sync-secrets.sh

# Redeploy
vercel --prod
```

---

## 🐛 Troubleshooting

### "Secret not found" error

**Cause:** Secret name mismatch between Key Vault and code

**Solution:**
```bash
# List all secrets in Key Vault
az keyvault secret list --vault-name $KEY_VAULT_NAME --query "[].name" -o table

# Verify secret name matches exactly
```

### "Access denied" error

**Cause:** Insufficient permissions to Key Vault

**Solution:**
```bash
# Check your access
az keyvault check-permission --vault-name $KEY_VAULT_NAME

# Request access from Key Vault admin
```

### Secrets work locally but not in Vercel

**Cause:** Secrets not added to Vercel production environment

**Solution:**
1. Check Vercel Dashboard → Settings → Environment Variables
2. Ensure "Production" checkbox is selected
3. Redeploy after adding secrets

### Wrong secret values in production

**Cause:** Cached old values or wrong environment

**Solution:**
```bash
# Clear deployment cache
vercel --prod --force

# Or delete and re-add environment variable in Vercel
```

---

## 📊 Secret Inventory

Track which secrets you've synced:

| Secret Name (Key Vault) | Env Var Name (Vercel) | Status | Last Updated |
|-------------------------|----------------------|--------|--------------|
| AZURE-OPENAI-API-KEY | AZURE_OPENAI_API_KEY | ✅ | 2025-11-05 |
| AZURE-OPENAI-ENDPOINT | AZURE_OPENAI_ENDPOINT | ✅ | 2025-11-05 |
| ... | ... | ... | ... |

---

## ✅ Recommended Approach

**For your deployment, I recommend:**

1. **Use the manual sync (Option A)** - Simple and reliable
2. **Use the script above** - To automate retrieval from Key Vault
3. **Copy to Vercel Dashboard** - One-time setup
4. **Keep Key Vault as source of truth** - Update there first, then sync to Vercel

### Quick Steps:

```bash
# 1. Get your Key Vault name
export KEY_VAULT_NAME="your-key-vault-name"

# 2. Login to Azure
az login

# 3. For each secret, get value and add to Vercel
az keyvault secret show --vault-name $KEY_VAULT_NAME --name AZURE-OPENAI-API-KEY --query value -o tsv
# Copy this value to Vercel Dashboard

# 4. Deploy
vercel --prod
```

---

## 📞 Need Help?

**Azure Key Vault Docs:** https://learn.microsoft.com/en-us/azure/key-vault/
**Vercel Env Vars:** https://vercel.com/docs/environment-variables

---

**Last Updated:** 2025-11-05
**Version:** 1.0.0
