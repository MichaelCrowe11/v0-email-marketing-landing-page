// Environment variable validation
// This module validates required environment variables at startup

const requiredServerEnvVars = [
  "AZURE_SQL_SERVER",
  "AZURE_SQL_DATABASE",
  "AZURE_SQL_USER",
  "AZURE_SQL_PASSWORD",
  "AZURE_AUTH_SECRET",
] as const

const requiredClientEnvVars = [
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
] as const

const optionalEnvVars = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "AZURE_AI_ENDPOINT",
  "AZURE_AI_API_KEY",
  "RESEND_API_KEY",
  "BLOB_READ_WRITE_TOKEN",
  "ADMIN_SETUP_KEY",
] as const

type RequiredServerEnv = typeof requiredServerEnvVars[number]
type RequiredClientEnv = typeof requiredClientEnvVars[number]

interface EnvConfig {
  // Required server variables
  AZURE_SQL_SERVER: string
  AZURE_SQL_DATABASE: string
  AZURE_SQL_USER: string
  AZURE_SQL_PASSWORD: string
  AZURE_AUTH_SECRET: string
  // Required client variables
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
  // Optional variables
  STRIPE_SECRET_KEY?: string
  STRIPE_WEBHOOK_SECRET?: string
  OPENAI_API_KEY?: string
  ANTHROPIC_API_KEY?: string
  AZURE_AI_ENDPOINT?: string
  AZURE_AI_API_KEY?: string
  RESEND_API_KEY?: string
  BLOB_READ_WRITE_TOKEN?: string
  ADMIN_SETUP_KEY?: string
}

class EnvValidationError extends Error {
  constructor(missingVars: string[]) {
    super(`Missing required environment variables: ${missingVars.join(", ")}`)
    this.name = "EnvValidationError"
  }
}

export function validateEnv(): EnvConfig {
  const missingVars: string[] = []

  // Check required server env vars
  for (const envVar of requiredServerEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar)
    }
  }

  // Check required client env vars
  for (const envVar of requiredClientEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar)
    }
  }

  if (missingVars.length > 0) {
    throw new EnvValidationError(missingVars)
  }

  // Validate AZURE_AUTH_SECRET length (should be at least 32 chars for security)
  const authSecret = process.env.AZURE_AUTH_SECRET!
  if (authSecret.length < 32) {
    throw new Error("AZURE_AUTH_SECRET must be at least 32 characters for security")
  }

  return {
    AZURE_SQL_SERVER: process.env.AZURE_SQL_SERVER!,
    AZURE_SQL_DATABASE: process.env.AZURE_SQL_DATABASE!,
    AZURE_SQL_USER: process.env.AZURE_SQL_USER!,
    AZURE_SQL_PASSWORD: process.env.AZURE_SQL_PASSWORD!,
    AZURE_AUTH_SECRET: process.env.AZURE_AUTH_SECRET!,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    AZURE_AI_ENDPOINT: process.env.AZURE_AI_ENDPOINT,
    AZURE_AI_API_KEY: process.env.AZURE_AI_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    ADMIN_SETUP_KEY: process.env.ADMIN_SETUP_KEY,
  }
}

// Get a single env var with validation
export function getEnvVar(name: RequiredServerEnv | RequiredClientEnv): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

// Get optional env var (returns undefined if not set)
export function getOptionalEnvVar(name: typeof optionalEnvVars[number]): string | undefined {
  return process.env[name]
}

// Validate Stripe env vars specifically
export function validateStripeEnv(): { secretKey: string; webhookSecret: string } {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is required for payment processing")
  }
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is required for webhook verification")
  }

  return { secretKey, webhookSecret }
}
