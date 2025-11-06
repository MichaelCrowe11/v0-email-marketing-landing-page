# Railway Deployment Script with Environment Variable Upload
# This script deploys your app to Railway and automatically uploads secrets from Azure Key Vault

Write-Host "🚂 Railway Deployment Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if Railway CLI is installed
Write-Host "`n📦 Checking Railway CLI..." -ForegroundColor Yellow
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
if (-not $railwayInstalled) {
    Write-Host "❌ Railway CLI not found. Installing..." -ForegroundColor Red
    npm install -g @railway/cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Railway CLI. Please install manually: npm install -g @railway/cli" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Railway CLI is ready" -ForegroundColor Green

# Check if logged in to Railway
Write-Host "`n🔐 Checking Railway authentication..." -ForegroundColor Yellow
$loginCheck = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Railway. Please log in..." -ForegroundColor Red
    railway login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Railway login failed" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Authenticated with Railway" -ForegroundColor Green

# Link to Railway project (if not already linked)
Write-Host "`n🔗 Linking to Railway project..." -ForegroundColor Yellow
$projectLinked = Test-Path ".railway"
if (-not $projectLinked) {
    Write-Host "No Railway project linked. Please link or create a project..." -ForegroundColor Yellow
    railway link
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to link Railway project" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Railway project linked" -ForegroundColor Green

# Upload environment variables from .env.railway
Write-Host "`n⬆️ Uploading environment variables to Railway..." -ForegroundColor Yellow

if (Test-Path ".env.railway") {
    $envVars = Get-Content ".env.railway" | Where-Object { $_ -match "^[^#]" -and $_ -match "=" }

    foreach ($line in $envVars) {
        if ($line -match '^([^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()

            # Skip empty values
            if ([string]::IsNullOrWhiteSpace($value)) {
                Write-Host "⚠️ Skipping empty variable: $key" -ForegroundColor Yellow
                continue
            }

            Write-Host "  Setting $key..." -ForegroundColor Gray
            railway variables --set "$key=$value" 2>&1 | Out-Null

            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ $key" -ForegroundColor Green
            } else {
                Write-Host "  ⚠️ Failed to set $key" -ForegroundColor Yellow
            }
        }
    }

    Write-Host "`n✅ Environment variables uploaded" -ForegroundColor Green
} else {
    Write-Host "⚠️ .env.railway file not found. Skipping environment variables upload." -ForegroundColor Yellow
}

# Optional: Fetch additional secrets from Azure Key Vault
Write-Host "`n🔑 Checking for additional Azure Key Vault secrets..." -ForegroundColor Yellow

$vaultName = "kv-michael9832340755092"

# Check if Azure CLI is available
$azInstalled = Get-Command az -ErrorAction SilentlyContinue
if ($azInstalled) {
    Write-Host "  Fetching OPENAI_API_KEY from Azure Key Vault..." -ForegroundColor Gray
    try {
        # Try to get OpenAI API key (if it exists with different name)
        $openaiKey = az keyvault secret show --vault-name $vaultName --name "gpt-5-codex-api-key" --query "value" -o tsv 2>$null
        if ($openaiKey -and $openaiKey -ne "") {
            railway variables --set "OPENAI_API_KEY=$openaiKey" 2>&1 | Out-Null
            Write-Host "  ✅ OPENAI_API_KEY set from Azure Key Vault" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ℹ️ No OpenAI key found in Key Vault (this is optional)" -ForegroundColor Gray
    }

    Write-Host "  Fetching ANTHROPIC_API_KEY from Azure Key Vault..." -ForegroundColor Gray
    try {
        # Try to get Anthropic API key (if it exists)
        $anthropicKey = az keyvault secret show --vault-name $vaultName --name "ANTHROPIC-API-KEY" --query "value" -o tsv 2>$null
        if ($anthropicKey -and $anthropicKey -ne "") {
            railway variables --set "ANTHROPIC_API_KEY=$anthropicKey" 2>&1 | Out-Null
            Write-Host "  ✅ ANTHROPIC_API_KEY set from Azure Key Vault" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ℹ️ No Anthropic key found in Key Vault (this is optional)" -ForegroundColor Gray
    }
} else {
    Write-Host "  ℹ️ Azure CLI not found, skipping additional Key Vault secrets" -ForegroundColor Gray
}

# Deploy to Railway
Write-Host "`n🚀 Deploying to Railway..." -ForegroundColor Yellow
railway up

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
    Write-Host "`n📊 View your deployment:" -ForegroundColor Cyan
    railway open
} else {
    Write-Host "`n❌ Deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Done!" -ForegroundColor Green
