/**
 * Application configuration
 * Centralizes environment variables and configuration settings
 */

export const config = {
  // Site configuration
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    name: "Crowe Logic AI",
    description: "Advanced mycology platform powered by 20 years of expertise",
  },

  // Supabase configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },

  // Stripe configuration
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  },

  // Feature flags
  features: {
    enableAnalytics: true,
    enableSubscriptions: true,
    enableAIResearch: true,
  },

  // Environment
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const

// Validate required environment variables
if (!config.supabase.url) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!config.supabase.anonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

if (!config.stripe.publishableKey) {
  throw new Error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable")
}
