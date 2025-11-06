/**
 * Startup Validation
 * 
 * This module validates that all required configuration and secrets are available
 * before the application starts serving requests.
 */

import { getConfig } from "./config"
import { isKeyVaultEnabled } from "./azure-keyvault"

/**
 * Validate all required configuration is present
 * Throws an error if any required configuration is missing
 */
export async function validateStartupConfiguration(): Promise<void> {
  console.log("🔍 Validating application configuration...")
  
  // Check if Key Vault is enabled
  const keyVaultEnabled = isKeyVaultEnabled()
  if (keyVaultEnabled) {
    console.log("✅ Azure Key Vault is enabled")
  } else {
    console.log("ℹ️  Azure Key Vault not configured, using environment variables")
  }

  try {
    // Load configuration - this will throw if any required secrets are missing
    const config = await getConfig()
    
    // Validate critical configuration
    const validations = [
      { name: "Supabase URL", value: config.supabase.url },
      { name: "Supabase Anon Key", value: config.supabase.anonKey },
      { name: "Supabase Service Role Key", value: config.supabase.serviceRoleKey },
      { name: "Stripe Secret Key", value: config.stripe.secretKey },
      { name: "Stripe Publishable Key", value: config.stripe.publishableKey },
      { name: "Stripe Webhook Secret", value: config.stripe.webhookSecret },
      { name: "Azure AI Endpoint", value: config.ai.azureEndpoint },
      { name: "Azure AI API Key", value: config.ai.azureApiKey },
    ]

    const missing = validations.filter(v => !v.value)
    
    if (missing.length > 0) {
      console.error("❌ Missing required configuration:")
      missing.forEach(v => console.error(`   - ${v.name}`))
      throw new Error(
        `Missing required configuration: ${missing.map(v => v.name).join(", ")}`
      )
    }

    // Validate Stripe Price IDs
    const priceIds = Object.entries(config.stripe.priceIds)
    const missingPriceIds = priceIds.filter(([_, value]) => !value)
    
    if (missingPriceIds.length > 0) {
      console.warn("⚠️  Warning: Some Stripe Price IDs are not configured:")
      missingPriceIds.forEach(([key, _]) => console.warn(`   - ${key}`))
      console.warn("   Some features may not work correctly")
    }

    // Validate optional but recommended configuration
    const optional = [
      { name: "OpenAI API Key", value: config.ai.openaiApiKey },
      { name: "Anthropic API Key", value: config.ai.anthropicApiKey },
      { name: "Resend API Key", value: config.services.resendApiKey },
      { name: "Blob Storage Token", value: config.services.blobReadWriteToken },
    ]

    const missingOptional = optional.filter(v => !v.value)
    if (missingOptional.length > 0) {
      console.log("ℹ️  Optional configuration not set (some features may be limited):")
      missingOptional.forEach(v => console.log(`   - ${v.name}`))
    }

    console.log("✅ All required configuration is present")
    console.log(`🌍 Site URL: ${config.app.siteUrl}`)
    console.log(`🔧 Environment: ${config.app.nodeEnv}`)
    
  } catch (error) {
    console.error("❌ Configuration validation failed:", error)
    throw error
  }
}

/**
 * Check if the application is ready to serve requests
 * Returns true if all critical configuration is present
 */
export async function isApplicationReady(): Promise<boolean> {
  try {
    await validateStartupConfiguration()
    return true
  } catch (error) {
    return false
  }
}

/**
 * Get a health check status for the application
 */
export async function getHealthStatus(): Promise<{
  status: "healthy" | "degraded" | "unhealthy"
  message: string
  checks: Array<{ name: string; status: "pass" | "fail" | "warn"; message?: string }>
}> {
  const checks: Array<{ name: string; status: "pass" | "fail" | "warn"; message?: string }> = []

  try {
    const config = await getConfig()

    // Critical checks
    checks.push({
      name: "Database Connection",
      status: config.supabase.url ? "pass" : "fail",
      message: config.supabase.url ? undefined : "Supabase URL not configured",
    })

    checks.push({
      name: "Payment Processing",
      status: config.stripe.secretKey ? "pass" : "fail",
      message: config.stripe.secretKey ? undefined : "Stripe not configured",
    })

    checks.push({
      name: "AI Services",
      status: config.ai.azureApiKey ? "pass" : "fail",
      message: config.ai.azureApiKey ? undefined : "Azure AI not configured",
    })

    // Optional checks
    checks.push({
      name: "Email Service",
      status: config.services.resendApiKey ? "pass" : "warn",
      message: config.services.resendApiKey ? undefined : "Email service not configured",
    })

    checks.push({
      name: "File Storage",
      status: config.services.blobReadWriteToken ? "pass" : "warn",
      message: config.services.blobReadWriteToken ? undefined : "Blob storage not configured",
    })

    const failedChecks = checks.filter(c => c.status === "fail")
    const warnChecks = checks.filter(c => c.status === "warn")

    if (failedChecks.length > 0) {
      return {
        status: "unhealthy",
        message: `${failedChecks.length} critical checks failed`,
        checks,
      }
    }

    if (warnChecks.length > 0) {
      return {
        status: "degraded",
        message: `${warnChecks.length} optional features unavailable`,
        checks,
      }
    }

    return {
      status: "healthy",
      message: "All systems operational",
      checks,
    }
  } catch (error) {
    return {
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Unknown error",
      checks,
    }
  }
}
