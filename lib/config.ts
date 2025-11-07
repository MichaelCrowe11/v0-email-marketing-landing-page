/**
 * Application Configuration
 * 
 * This module provides centralized access to all configuration values.
 * It automatically fetches secrets from Azure Key Vault when configured,
 * with fallback to environment variables.
 */

import { getSecret } from "./azure-keyvault"

/**
 * Configuration object with all application settings
 * Lazy-loaded on first access
 */
let configCache: AppConfig | null = null

export interface AppConfig {
  // Supabase
  supabase: {
    url: string
    anonKey: string
    serviceRoleKey: string
    redirectUrl?: string
  }
  
  // Stripe
  stripe: {
    secretKey: string
    publishableKey: string
    webhookSecret: string
    priceIds: {
      masterGrowerMonthly: string
      masterGrowerYearly: string
      consultation1hr: string
      consultation3hr: string
      consultationFullday: string
      consultationRetainer: string
      facilitySetup: string
      customAiTraining: string
      masterCourse: string
      vision10: string
      vision50: string
      vision100: string
      video5: string
      video20: string
    }
  }
  
  // AI Services
  ai: {
    azureEndpoint: string
    azureApiKey: string
    openaiApiKey?: string
    anthropicApiKey?: string
  }
  
  // Other Services
  services: {
    resendApiKey?: string
    blobReadWriteToken?: string
    cdpWebsocketUrl?: string
    onkernelApiKey?: string
  }
  
  // Application
  app: {
    siteUrl: string
    nodeEnv: string
  }
}

/**
 * Load configuration from Azure Key Vault or environment variables
 */
async function loadConfig(): Promise<AppConfig> {
  // If already loaded, return cached config
  if (configCache) {
    return configCache
  }

  // Load all secrets
  const config: AppConfig = {
    supabase: {
      url: await getSecret("NEXT-PUBLIC-SUPABASE-URL", { 
        fallbackEnvVar: "NEXT_PUBLIC_SUPABASE_URL",
        required: true 
      }) || "",
      anonKey: await getSecret("NEXT-PUBLIC-SUPABASE-ANON-KEY", { 
        fallbackEnvVar: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        required: true 
      }) || "",
      serviceRoleKey: await getSecret("SUPABASE-SERVICE-ROLE-KEY", { 
        fallbackEnvVar: "SUPABASE_SERVICE_ROLE_KEY",
        required: true 
      }) || "",
      redirectUrl: await getSecret("NEXT-PUBLIC-DEV-SUPABASE-REDIRECT-URL", { 
        fallbackEnvVar: "NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL" 
      }),
    },
    
    stripe: {
      secretKey: await getSecret("STRIPE-SECRET-KEY", { 
        fallbackEnvVar: "STRIPE_SECRET_KEY",
        required: true 
      }) || "",
      publishableKey: await getSecret("NEXT-PUBLIC-STRIPE-PUBLISHABLE-KEY", { 
        fallbackEnvVar: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
        required: true 
      }) || "",
      webhookSecret: await getSecret("STRIPE-WEBHOOK-SECRET", { 
        fallbackEnvVar: "STRIPE_WEBHOOK_SECRET",
        required: true 
      }) || "",
      priceIds: {
        masterGrowerMonthly: await getSecret("NEXT-PUBLIC-MASTER-GROWER-MONTHLY-PRICE-ID", { 
          fallbackEnvVar: "NEXT_PUBLIC_MASTER_GROWER_MONTHLY_PRICE_ID",
          required: true 
        }) || "",
        masterGrowerYearly: await getSecret("NEXT-PUBLIC-MASTER-GROWER-YEARLY-PRICE-ID", { 
          fallbackEnvVar: "NEXT_PUBLIC_MASTER_GROWER_YEARLY_PRICE_ID",
          required: true 
        }) || "",
        consultation1hr: await getSecret("NEXT-PUBLIC-CONSULTATION-1HR-PRICE-ID", { 
          fallbackEnvVar: "NEXT_PUBLIC_CONSULTATION_1HR_PRICE_ID",
          required: true 
        }) || "",
        consultation3hr: await getSecret("NEXT-PUBLIC-CONSULTATION-3HR-PRICE-ID", { 
          fallbackEnvVar: "NEXT_PUBLIC_CONSULTATION_3HR_PRICE_ID",
          required: true 
        }) || "",
        consultationFullday: await getSecret("NEXT-PUBLIC-CONSULTATION-FULLDAY-PRICE-ID", { 
          fallbackEnvVar: "NEXT_PUBLIC_CONSULTATION_FULLDAY_PRICE_ID",
          required: true 
        }) || "",
        consultationRetainer: await getSecret("NEXT-PUBLIC-CONSULTATION-RETAINER-PRICE-ID", { 
          fallbackEnvVar: "NEXT_PUBLIC_CONSULTATION_RETAINER_PRICE_ID",
          required: true 
        }) || "",
        facilitySetup: await getSecret("NEXT-PUBLIC-FACILITY-SETUP-PRICE-ID", { 
          fallbackEnvVar: "NEXT_PUBLIC_FACILITY_SETUP_PRICE_ID",
          required: true 
        }) || "",
        customAiTraining: await getSecret("NEXT-PUBLIC-CUSTOM-AI-TRAINING-PRICE-ID", { 
          fallbackEnvVar: "NEXT_PUBLIC_CUSTOM_AI_TRAINING_PRICE_ID",
          required: true 
        }) || "",
        masterCourse: await getSecret("NEXT-PUBLIC-MASTER-COURSE-PRICE-ID", { 
          fallbackEnvVar: "NEXT_PUBLIC_MASTER_COURSE_PRICE_ID",
          required: true 
        }) || "",
        vision10: await getSecret("NEXT-PUBLIC-VISION-10-PRICE-ID", { 
          fallbackEnvVar: "NEXT_PUBLIC_VISION_10_PRICE_ID",
          required: true 
        }) || "",
        vision50: await getSecret("NEXT-PUBLIC-VISION-50-PRICE-ID", { 
          fallbackEnvVar: "NEXT_PUBLIC_VISION_50_PRICE_ID",
          required: true 
        }) || "",
        vision100: await getSecret("NEXT-PUBLIC-VISION-100-PRICE-ID", { 
          fallbackEnvVar: "NEXT_PUBLIC_VISION_100_PRICE_ID",
          required: true 
        }) || "",
        video5: await getSecret("NEXT-PUBLIC-VIDEO-5-PRICE-ID", { 
          fallbackEnvVar: "NEXT_PUBLIC_VIDEO_5_PRICE_ID",
          required: true 
        }) || "",
        video20: await getSecret("NEXT-PUBLIC-VIDEO-20-PRICE-ID", { 
          fallbackEnvVar: "NEXT_PUBLIC_VIDEO_20_PRICE_ID",
          required: true 
        }) || "",
      },
    },
    
    ai: {
      azureEndpoint: await getSecret("AZURE-AI-ENDPOINT", { 
        fallbackEnvVar: "AZURE_AI_ENDPOINT",
        required: true 
      }) || "",
      azureApiKey: await getSecret("AZURE-AI-API-KEY", { 
        fallbackEnvVar: "AZURE_AI_API_KEY",
        required: true 
      }) || "",
      openaiApiKey: await getSecret("OPENAI-API-KEY", { 
        fallbackEnvVar: "OPENAI_API_KEY" 
      }),
      anthropicApiKey: await getSecret("ANTHROPIC-API-KEY", { 
        fallbackEnvVar: "ANTHROPIC_API_KEY" 
      }),
    },
    
    services: {
      resendApiKey: await getSecret("RESEND-API-KEY", { 
        fallbackEnvVar: "RESEND_API_KEY" 
      }),
      blobReadWriteToken: await getSecret("BLOB-READ-WRITE-TOKEN", { 
        fallbackEnvVar: "BLOB_READ_WRITE_TOKEN" 
      }),
      cdpWebsocketUrl: await getSecret("CDP-WEBSOCKET-URL", { 
        fallbackEnvVar: "CDP_WEBSOCKET_URL" 
      }),
      onkernelApiKey: await getSecret("ONKERNEL-API-KEY", { 
        fallbackEnvVar: "ONKERNEL_API_KEY" 
      }),
    },
    
    app: {
      siteUrl: await getSecret("NEXT-PUBLIC-SITE-URL", { 
        fallbackEnvVar: "NEXT_PUBLIC_SITE_URL" 
      }) || "http://localhost:3000",
      nodeEnv: process.env.NODE_ENV || "development",
    },
  }

  // Cache the config
  configCache = config

  return config
}

/**
 * Get the application configuration
 * This function is async because it needs to fetch secrets from Key Vault
 */
export async function getConfig(): Promise<AppConfig> {
  return await loadConfig()
}

/**
 * Clear the configuration cache
 * Useful for testing or when configuration needs to be reloaded
 */
export function clearConfigCache(): void {
  configCache = null
}

/**
 * Helper function to get a specific config value
 * For backwards compatibility with existing code
 */
export async function getConfigValue<T>(path: string): Promise<T | undefined> {
  const config = await getConfig()
  const keys = path.split(".")
  let value: AppConfig | unknown = config

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }

  return value as T | undefined
}
