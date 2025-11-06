#!/usr/bin/env node

/**
 * Launch Readiness Validation Script
 * 
 * This script validates that all required configuration is present
 * and the application is ready for production deployment.
 */

const https = require('https');
const http = require('http');

const REQUIRED_SECRETS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'AZURE_AI_ENDPOINT',
  'AZURE_AI_API_KEY',
];

const OPTIONAL_SECRETS = [
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'RESEND_API_KEY',
  'BLOB_READ_WRITE_TOKEN',
];

const STRIPE_PRICE_IDS = [
  'NEXT_PUBLIC_MASTER_GROWER_MONTHLY_PRICE_ID',
  'NEXT_PUBLIC_MASTER_GROWER_YEARLY_PRICE_ID',
  'NEXT_PUBLIC_CONSULTATION_1HR_PRICE_ID',
  'NEXT_PUBLIC_CONSULTATION_3HR_PRICE_ID',
  'NEXT_PUBLIC_CONSULTATION_FULLDAY_PRICE_ID',
  'NEXT_PUBLIC_CONSULTATION_RETAINER_PRICE_ID',
  'NEXT_PUBLIC_FACILITY_SETUP_PRICE_ID',
  'NEXT_PUBLIC_CUSTOM_AI_TRAINING_PRICE_ID',
  'NEXT_PUBLIC_MASTER_COURSE_PRICE_ID',
  'NEXT_PUBLIC_VISION_10_PRICE_ID',
  'NEXT_PUBLIC_VISION_50_PRICE_ID',
  'NEXT_PUBLIC_VISION_100_PRICE_ID',
  'NEXT_PUBLIC_VIDEO_5_PRICE_ID',
  'NEXT_PUBLIC_VIDEO_20_PRICE_ID',
];

function checkEnvironmentVariables() {
  console.log('\n🔍 Checking Environment Variables...\n');
  
  let missingRequired = [];
  let missingOptional = [];
  let missingPriceIds = [];
  
  // Check required secrets
  REQUIRED_SECRETS.forEach(secret => {
    if (process.env[secret]) {
      console.log(`  ✅ ${secret}`);
    } else {
      console.log(`  ❌ ${secret} - MISSING`);
      missingRequired.push(secret);
    }
  });
  
  // Check Stripe Price IDs
  console.log('\n📊 Checking Stripe Price IDs...\n');
  STRIPE_PRICE_IDS.forEach(priceId => {
    if (process.env[priceId]) {
      console.log(`  ✅ ${priceId}`);
    } else {
      console.log(`  ⚠️  ${priceId} - MISSING`);
      missingPriceIds.push(priceId);
    }
  });
  
  // Check optional secrets
  console.log('\n🔧 Checking Optional Configuration...\n');
  OPTIONAL_SECRETS.forEach(secret => {
    if (process.env[secret]) {
      console.log(`  ✅ ${secret}`);
    } else {
      console.log(`  ℹ️  ${secret} - Not configured (some features may be limited)`);
      missingOptional.push(secret);
    }
  });
  
  return { missingRequired, missingOptional, missingPriceIds };
}

function checkKeyVaultConfiguration() {
  console.log('\n🔐 Checking Azure Key Vault Configuration...\n');
  
  const keyVaultUrl = process.env.AZURE_KEYVAULT_URL;
  
  if (keyVaultUrl) {
    console.log(`  ✅ AZURE_KEYVAULT_URL: ${keyVaultUrl}`);
    
    const hasClientId = !!process.env.AZURE_CLIENT_ID;
    const hasClientSecret = !!process.env.AZURE_CLIENT_SECRET;
    const hasTenantId = !!process.env.AZURE_TENANT_ID;
    
    if (hasClientId && hasClientSecret && hasTenantId) {
      console.log('  ✅ Service Principal authentication configured');
    } else if (hasClientId || hasClientSecret || hasTenantId) {
      console.log('  ⚠️  Partial Service Principal configuration detected');
      console.log('     Some credentials are missing. Will attempt DefaultAzureCredential.');
    } else {
      console.log('  ℹ️  Using DefaultAzureCredential (Managed Identity or Azure CLI)');
    }
    
    return true;
  } else {
    console.log('  ℹ️  Azure Key Vault not configured');
    console.log('     Application will use environment variables directly');
    return false;
  }
}

function checkDeploymentConfiguration() {
  console.log('\n🌍 Checking Deployment Configuration...\n');
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  console.log(`  Site URL: ${siteUrl}`);
  console.log(`  Environment: ${nodeEnv}`);
  
  if (nodeEnv === 'production' && siteUrl.includes('localhost')) {
    console.log('  ⚠️  Warning: Production mode but site URL is localhost');
  }
  
  // Check if Stripe is in live mode
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey) {
    const isLiveMode = stripeKey.startsWith('sk_live_');
    const isTestMode = stripeKey.startsWith('sk_test_');
    
    if (nodeEnv === 'production' && !isLiveMode) {
      console.log('  ⚠️  Warning: Production mode but Stripe is in TEST mode');
    } else if (isLiveMode) {
      console.log('  ✅ Stripe configured in LIVE mode');
    } else if (isTestMode) {
      console.log('  ℹ️  Stripe configured in TEST mode');
    }
  }
}

async function checkHealthEndpoint(url) {
  return new Promise((resolve) => {
    console.log('\n🏥 Checking Health Endpoint...\n');
    console.log(`  Checking: ${url}/api/health`);
    
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(`${url}/api/health`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const health = JSON.parse(data);
          console.log(`\n  Status: ${health.status.toUpperCase()}`);
          console.log(`  Message: ${health.message}`);
          
          if (health.checks) {
            console.log('\n  Health Checks:');
            health.checks.forEach(check => {
              const icon = check.status === 'pass' ? '✅' : 
                          check.status === 'warn' ? '⚠️' : '❌';
              console.log(`    ${icon} ${check.name}: ${check.status.toUpperCase()}`);
              if (check.message) {
                console.log(`       ${check.message}`);
              }
            });
          }
          
          resolve(health.status === 'healthy');
        } catch (error) {
          console.log(`  ❌ Failed to parse health check response`);
          resolve(false);
        }
      });
    }).on('error', (error) => {
      console.log(`  ❌ Failed to connect to health endpoint`);
      console.log(`     ${error.message}`);
      resolve(false);
    });
  });
}

function generateReport(results) {
  console.log('\n' + '='.repeat(60));
  console.log('                   VALIDATION REPORT');
  console.log('='.repeat(60) + '\n');
  
  const { missingRequired, missingOptional, missingPriceIds } = results;
  
  if (missingRequired.length === 0) {
    console.log('✅ All required configuration is present');
  } else {
    console.log(`❌ Missing ${missingRequired.length} required configuration items:`);
    missingRequired.forEach(item => console.log(`   - ${item}`));
  }
  
  if (missingPriceIds.length > 0) {
    console.log(`\n⚠️  Missing ${missingPriceIds.length} Stripe Price IDs`);
    console.log('   Some payment features may not work correctly');
  }
  
  if (missingOptional.length > 0) {
    console.log(`\nℹ️  ${missingOptional.length} optional features not configured:`);
    missingOptional.forEach(item => console.log(`   - ${item}`));
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (missingRequired.length === 0 && missingPriceIds.length === 0) {
    console.log('\n🎉 APPLICATION IS READY FOR LAUNCH! 🎉\n');
    return 0;
  } else if (missingRequired.length === 0) {
    console.log('\n⚠️  APPLICATION IS MOSTLY READY (some price IDs missing)\n');
    return 1;
  } else {
    console.log('\n❌ APPLICATION IS NOT READY FOR LAUNCH\n');
    console.log('Please configure the missing required items and try again.\n');
    console.log('See documentation:');
    console.log('  - Quick Start: ./QUICK_START_KEYVAULT.md');
    console.log('  - Azure Key Vault Setup: ./AZURE_KEYVAULT_SETUP.md');
    console.log('  - Environment Variables: ./.env.example\n');
    return 2;
  }
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('           LAUNCH READINESS VALIDATION SCRIPT');
  console.log('='.repeat(60));
  
  // Check environment variables
  const results = checkEnvironmentVariables();
  
  // Check Key Vault configuration
  checkKeyVaultConfiguration();
  
  // Check deployment configuration
  checkDeploymentConfiguration();
  
  // Try to check health endpoint if URL is provided
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl && !siteUrl.includes('localhost')) {
    await checkHealthEndpoint(siteUrl);
  } else {
    console.log('\n🏥 Health Endpoint Check...\n');
    console.log('  ℹ️  Skipped (no production URL configured)');
    console.log('     Run this after deployment to validate health endpoint');
  }
  
  // Generate final report
  const exitCode = generateReport(results);
  
  process.exit(exitCode);
}

// Run the script
main().catch((error) => {
  console.error('\n❌ Validation script failed:', error);
  process.exit(3);
});
