import { SecretClient } from "@azure/keyvault-secrets"
import { DefaultAzureCredential, ClientSecretCredential } from "@azure/identity"

/**
 * Azure Key Vault configuration and secret retrieval
 * 
 * This module provides centralized access to secrets stored in Azure Key Vault.
 * It supports multiple authentication methods and includes caching for performance.
 */

// Cache for secrets to avoid repeated calls to Key Vault
const secretCache = new Map<string, string>()

// Flag to track if Key Vault is enabled
let keyVaultEnabled = false
let secretClient: SecretClient | null = null

/**
 * Initialize the Azure Key Vault client
 * Supports multiple authentication methods:
 * 1. Service Principal (Client ID, Secret, Tenant ID)
 * 2. Default Azure Credential (Managed Identity, Azure CLI, etc.)
 */
function initializeKeyVaultClient(): SecretClient | null {
  try {
    const keyVaultUrl = process.env.AZURE_KEYVAULT_URL

    if (!keyVaultUrl) {
      console.log("Azure Key Vault not configured (AZURE_KEYVAULT_URL not set). Using environment variables.")
      return null
    }

    // Try Service Principal authentication first
    const clientId = process.env.AZURE_CLIENT_ID
    const clientSecret = process.env.AZURE_CLIENT_SECRET
    const tenantId = process.env.AZURE_TENANT_ID

    let credential

    if (clientId && clientSecret && tenantId) {
      console.log("Initializing Azure Key Vault with Service Principal authentication")
      credential = new ClientSecretCredential(tenantId, clientId, clientSecret)
    } else {
      console.log("Initializing Azure Key Vault with Default Azure Credential")
      credential = new DefaultAzureCredential()
    }

    keyVaultEnabled = true
    return new SecretClient(keyVaultUrl, credential)
  } catch (error) {
    console.error("Failed to initialize Azure Key Vault client:", error)
    return null
  }
}

/**
 * Get a secret from Azure Key Vault with fallback to environment variables
 * @param secretName - Name of the secret in Key Vault (or environment variable name)
 * @param options - Configuration options
 * @returns The secret value or undefined if not found
 */
export async function getSecret(
  secretName: string,
  options: {
    required?: boolean
    fallbackEnvVar?: string
    cache?: boolean
  } = {}
): Promise<string | undefined> {
  const { required = false, fallbackEnvVar, cache = true } = options

  // Check cache first
  if (cache && secretCache.has(secretName)) {
    return secretCache.get(secretName)
  }

  let secretValue: string | undefined

  // Initialize client if not already done
  if (secretClient === null) {
    secretClient = initializeKeyVaultClient()
  }

  // Try to get from Key Vault if enabled
  if (secretClient) {
    try {
      const secret = await secretClient.getSecret(secretName)
      secretValue = secret.value
      if (secretValue && cache) {
        secretCache.set(secretName, secretValue)
      }
    } catch (error: any) {
      console.warn(`Failed to retrieve secret '${secretName}' from Key Vault:`, error.message)
    }
  }

  // Fallback to environment variable
  if (!secretValue) {
    const envVarName = fallbackEnvVar || secretName
    secretValue = process.env[envVarName]
  }

  // Handle required secrets
  if (required && !secretValue) {
    throw new Error(`Required secret '${secretName}' not found in Key Vault or environment variables`)
  }

  return secretValue
}

/**
 * Get multiple secrets at once
 * @param secretNames - Array of secret names to retrieve
 * @returns Object with secret names as keys and values
 */
export async function getSecrets(
  secretNames: string[]
): Promise<Record<string, string | undefined>> {
  const secrets: Record<string, string | undefined> = {}
  
  await Promise.all(
    secretNames.map(async (name) => {
      secrets[name] = await getSecret(name)
    })
  )
  
  return secrets
}

/**
 * Validate that all required secrets are available
 * Useful for startup checks
 */
export async function validateRequiredSecrets(secretNames: string[]): Promise<void> {
  const missingSecrets: string[] = []

  for (const secretName of secretNames) {
    try {
      const value = await getSecret(secretName, { required: true })
      if (!value) {
        missingSecrets.push(secretName)
      }
    } catch (error) {
      missingSecrets.push(secretName)
    }
  }

  if (missingSecrets.length > 0) {
    throw new Error(
      `Missing required secrets: ${missingSecrets.join(", ")}. ` +
      `Please ensure these are configured in Azure Key Vault or as environment variables.`
    )
  }
}

/**
 * Clear the secret cache
 * Useful for testing or when secrets need to be refreshed
 */
export function clearSecretCache(): void {
  secretCache.clear()
}

/**
 * Check if Azure Key Vault is enabled and configured
 */
export function isKeyVaultEnabled(): boolean {
  return keyVaultEnabled || !!process.env.AZURE_KEYVAULT_URL
}
