/**
 * Retry Configuration
 */
export type RetryConfig = {
  maxRetries: number
  initialDelayMs: number
  maxDelayMs: number
  backoffMultiplier: number
  retryableStatusCodes?: number[]
  retryableErrors?: string[]
  onRetry?: (attempt: number, error: Error, delayMs: number) => void
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000, // 1 second
  maxDelayMs: 30000, // 30 seconds
  backoffMultiplier: 2, // Exponential: 1s, 2s, 4s, 8s...
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  retryableErrors: [
    "ECONNRESET",
    "ETIMEDOUT",
    "ENOTFOUND",
    "ECONNREFUSED",
    "rate_limit_exceeded",
    "context_length_exceeded",
  ],
}

/**
 * Model-specific retry configurations
 */
export const MODEL_RETRY_CONFIGS: Record<string, Partial<RetryConfig>> = {
  // OpenAI models - aggressive retry for reliability
  "openai/gpt-4o": {
    maxRetries: 5,
    initialDelayMs: 2000,
  },
  "openai/o1": {
    maxRetries: 3,
    initialDelayMs: 5000, // Higher initial delay for reasoning models
    maxDelayMs: 60000,
  },

  // Anthropic - moderate retry
  "anthropic/claude-3-5-sonnet-20241022": {
    maxRetries: 4,
    initialDelayMs: 1500,
  },

  // Google - fast retry
  "google/gemini-2.0-flash-exp": {
    maxRetries: 5,
    initialDelayMs: 500,
  },
}

/**
 * Result of a retry operation
 */
export type RetryResult<T> = {
  success: boolean
  data?: T
  error?: Error
  attempts: number
  totalDelayMs: number
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: Error, config: RetryConfig): boolean {
  const errorMessage = error.message.toLowerCase()

  // Check retryable error patterns
  if (config.retryableErrors) {
    for (const pattern of config.retryableErrors) {
      if (errorMessage.includes(pattern.toLowerCase())) {
        return true
      }
    }
  }

  // Check for network errors
  if ("code" in error) {
    const code = (error as any).code
    if (config.retryableErrors?.includes(code)) {
      return true
    }
  }

  // Check for status codes (if present in error)
  if ("status" in error) {
    const status = (error as any).status
    if (config.retryableStatusCodes?.includes(status)) {
      return true
    }
  }

  return false
}

/**
 * Calculate delay with exponential backoff and jitter
 */
export function calculateBackoff(attempt: number, config: RetryConfig): number {
  const exponentialDelay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt)

  // Apply jitter (±25% randomization) to prevent thundering herd
  const jitter = exponentialDelay * 0.25 * (Math.random() * 2 - 1)
  const delayWithJitter = exponentialDelay + jitter

  // Cap at max delay
  return Math.min(delayWithJitter, config.maxDelayMs)
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Retry an async operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {},
): Promise<RetryResult<T>> {
  const finalConfig: RetryConfig = { ...DEFAULT_RETRY_CONFIG, ...config }
  let lastError: Error | undefined
  let totalDelay = 0

  for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
    try {
      const result = await operation()
      return {
        success: true,
        data: result,
        attempts: attempt + 1,
        totalDelayMs: totalDelay,
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Check if we should retry
      if (attempt === finalConfig.maxRetries || !isRetryableError(lastError, finalConfig)) {
        return {
          success: false,
          error: lastError,
          attempts: attempt + 1,
          totalDelayMs: totalDelay,
        }
      }

      // Calculate backoff delay
      const delayMs = calculateBackoff(attempt, finalConfig)
      totalDelay += delayMs

      // Call retry callback if provided
      if (finalConfig.onRetry) {
        finalConfig.onRetry(attempt + 1, lastError, delayMs)
      }

      console.log(`[Retry] Attempt ${attempt + 1}/${finalConfig.maxRetries} failed. Retrying in ${delayMs}ms...`, {
        error: lastError.message,
      })

      // Wait before retrying
      await sleep(delayMs)
    }
  }

  // This should never be reached, but TypeScript needs it
  return {
    success: false,
    error: lastError || new Error("Unknown error"),
    attempts: finalConfig.maxRetries + 1,
    totalDelayMs: totalDelay,
  }
}

/**
 * Retry with fallback to alternative model
 */
export async function retryWithFallback<T>(
  operation: (modelId: string) => Promise<T>,
  primaryModelId: string,
  fallbackModelIds: string[],
  config: Partial<RetryConfig> = {},
): Promise<RetryResult<T> & { modelUsed?: string }> {
  // Try primary model first
  const primaryResult = await retryWithBackoff(() => operation(primaryModelId), config)

  if (primaryResult.success) {
    return { ...primaryResult, modelUsed: primaryModelId }
  }

  console.log(`[Retry] Primary model ${primaryModelId} failed. Trying fallbacks...`)

  // Try each fallback in sequence
  for (const fallbackId of fallbackModelIds) {
    console.log(`[Retry] Attempting fallback model: ${fallbackId}`)

    const fallbackResult = await retryWithBackoff(() => operation(fallbackId), config)

    if (fallbackResult.success) {
      return { ...fallbackResult, modelUsed: fallbackId }
    }
  }

  // All attempts failed
  return {
    success: false,
    error: new Error(`All models failed: ${primaryModelId}, ${fallbackModelIds.join(", ")}`),
    attempts: (fallbackModelIds.length + 1) * (config.maxRetries || DEFAULT_RETRY_CONFIG.maxRetries),
    totalDelayMs: 0,
  }
}

/**
 * Create a retryable fetch wrapper
 */
export function createRetryableFetch(config: Partial<RetryConfig> = {}) {
  return async function retryableFetch(url: string, options?: RequestInit): Promise<Response> {
    const result = await retryWithBackoff(async () => {
      const response = await fetch(url, options)

      // Check if response is retryable
      if (config.retryableStatusCodes?.includes(response.status)) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorBody}`)
      }

      return response
    }, config)

    if (!result.success) {
      throw result.error
    }

    return result.data!
  }
}

/**
 * Retry decorator for class methods
 */
export function Retryable(config: Partial<RetryConfig> = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const result = await retryWithBackoff(() => originalMethod.apply(this, args), config)

      if (!result.success) {
        throw result.error
      }

      return result.data
    }

    return descriptor
  }
}

/**
 * Circuit breaker state for preventing cascading failures
 */
export class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: "closed" | "open" | "half-open" = "closed"

  constructor(
    private threshold = 5,
    private timeoutMs = 60000,
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      const now = Date.now()
      if (now - this.lastFailureTime > this.timeoutMs) {
        this.state = "half-open"
      } else {
        throw new Error("Circuit breaker is OPEN - too many failures")
      }
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failures = 0
    this.state = "closed"
  }

  private onFailure() {
    this.failures++
    this.lastFailureTime = Date.now()

    if (this.failures >= this.threshold) {
      this.state = "open"
      console.error(`[CircuitBreaker] OPEN after ${this.failures} failures`)
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime,
    }
  }

  reset() {
    this.failures = 0
    this.state = "closed"
  }
}
