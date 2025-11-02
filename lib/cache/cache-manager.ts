interface CacheConfig {
  strategy: "cache-first" | "network-first" | "stale-while-revalidate"
  ttl: number
  maxSize?: number
}

interface CacheEntry {
  data: any
  expires: number
  size: number
}

class CacheManager {
  private memoryCache = new Map<string, CacheEntry>()
  private maxMemorySize = 50 * 1024 * 1024 // 50MB
  private currentSize = 0

  async get<T>(key: string): Promise<T | null> {
    const cached = this.memoryCache.get(key)
    if (cached && cached.expires > Date.now()) {
      return cached.data
    }

    if (cached) {
      this.delete(key)
    }

    if (typeof window !== "undefined" && "caches" in window) {
      try {
        const cache = await caches.open("crowe-logic-v1")
        const response = await cache.match(key)
        if (response) {
          return await response.json()
        }
      } catch (e) {
        console.error("[v0] Cache read error:", e)
      }
    }

    return null
  }

  async set<T>(key: string, data: T, ttl: number): Promise<void> {
    const expires = Date.now() + ttl * 1000
    const dataStr = JSON.stringify(data)
    const size = new Blob([dataStr]).size

    if (this.currentSize + size > this.maxMemorySize) {
      this.evictOldest()
    }

    this.memoryCache.set(key, { data, expires, size })
    this.currentSize += size

    if (typeof window !== "undefined" && "caches" in window) {
      try {
        const cache = await caches.open("crowe-logic-v1")
        const response = new Response(dataStr, {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": `max-age=${ttl}`,
          },
        })
        await cache.put(key, response)
      } catch (e) {
        console.error("[v0] Cache write error:", e)
      }
    }
  }

  delete(key: string): void {
    const entry = this.memoryCache.get(key)
    if (entry) {
      this.currentSize -= entry.size
      this.memoryCache.delete(key)
    }
  }

  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestTime = Number.POSITIVE_INFINITY

    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.expires < oldestTime) {
        oldestTime = entry.expires
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.delete(oldestKey)
    }
  }

  clear(): void {
    this.memoryCache.clear()
    this.currentSize = 0

    if (typeof window !== "undefined" && "caches" in window) {
      caches.delete("crowe-logic-v1").catch(() => {})
    }
  }

  getStats() {
    return {
      entries: this.memoryCache.size,
      size: this.currentSize,
      maxSize: this.maxMemorySize,
      utilization: (this.currentSize / this.maxMemorySize) * 100,
    }
  }
}

export const cacheManager = new CacheManager()
