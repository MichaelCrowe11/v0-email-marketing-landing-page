interface FetchOptions extends RequestInit {
  dedupe?: boolean
  revalidate?: number
  tags?: string[]
}

const requestCache = new Map<string, Promise<any>>()

export async function optimizedFetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const cacheKey = `${url}-${JSON.stringify(options)}`

  if (options.dedupe && requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)!
  }

  const fetchPromise = fetch(url, {
    ...options,
    next: {
      revalidate: options.revalidate ?? 300,
      tags: options.tags,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }
    return res.json()
  })

  if (options.dedupe) {
    requestCache.set(cacheKey, fetchPromise)

    fetchPromise.finally(() => {
      setTimeout(() => requestCache.delete(cacheKey), 1000)
    })
  }

  return fetchPromise
}

export async function batchFetch<T>(requests: Array<{ url: string; options?: FetchOptions }>): Promise<T[]> {
  return Promise.all(requests.map(({ url, options }) => optimizedFetch<T>(url, options)))
}

export async function fetchWithRetry<T>(url: string, options: RequestInit = {}, maxRetries = 3): Promise<T> {
  let lastError: Error = new Error("Unknown error")

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      lastError = error as Error

      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000))
      }
    }
  }

  throw lastError
}
