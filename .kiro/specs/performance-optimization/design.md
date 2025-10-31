# Performance Optimization Design

## Overview

This design document outlines a comprehensive performance optimization strategy for the Crowe Logic AI platform. The optimization focuses on reducing bundle sizes, improving load times, enhancing runtime performance, and ensuring excellent user experience across all devices and network conditions.

The design follows a multi-layered approach:
1. **Build-time optimizations** - Bundle analysis, code splitting, tree shaking
2. **Load-time optimizations** - Resource prioritization, lazy loading, caching
3. **Runtime optimizations** - Efficient rendering, event handling, memory management
4. **Monitoring and measurement** - Continuous performance tracking and alerting

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                             │
├─────────────────────────────────────────────────────────────┤
│  Service Worker (Cache-First Strategy)                      │
│  ├─ Static Assets Cache (1 year)                           │
│  ├─ API Response Cache (5 min TTL)                         │
│  └─ Dynamic Content Cache (Stale-While-Revalidate)         │
├─────────────────────────────────────────────────────────────┤
│  React Application Layer                                    │
│  ├─ Critical Components (Immediate Load)                   │
│  ├─ Lazy-Loaded Components (On-Demand)                     │
│  ├─ Performance Monitor (Web Vitals)                       │
│  └─ Resource Hints (Preload, Prefetch, Preconnect)        │
├─────────────────────────────────────────────────────────────┤
│  Next.js Framework Layer                                    │
│  ├─ Static Generation (Build Time)                         │
│  ├─ Server Components (Streaming SSR)                      │
│  ├─ Incremental Static Regeneration (ISR)                  │
│  └─ Edge Runtime (Fast Response)                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Vercel Edge Network                        │
│  ├─ CDN (Global Distribution)                              │
│  ├─ Image Optimization (AVIF/WebP)                         │
│  ├─ Compression (Brotli/Gzip)                              │
│  └─ Smart Caching (Stale-While-Revalidate)                 │
└─────────────────────────────────────────────────────────────┘
```

### Component Loading Strategy

```
Page Load Timeline:
0ms     ├─ HTML Document (Inline Critical CSS)
        ├─ Preload Critical Fonts
        ├─ Preconnect to APIs
        │
100ms   ├─ Critical JavaScript Bundle (<100KB)
        ├─ Above-the-Fold Components
        │
500ms   ├─ First Contentful Paint (FCP)
        ├─ Hero Section Visible
        │
1000ms  ├─ Lazy Load Below-Fold Components
        ├─ Prefetch Next Route
        │
1500ms  ├─ Largest Contentful Paint (LCP)
        ├─ Main Content Visible
        │
2000ms  ├─ Load Non-Critical Features
        ├─ Analytics, Chat Widget
        │
3000ms  ├─ Time to Interactive (TTI)
        └─ Fully Interactive
```

## Components and Interfaces

### 1. Bundle Optimization Module

**Purpose**: Analyze and optimize JavaScript bundles

**Implementation**:
```typescript
// lib/performance/bundle-analyzer.ts
interface BundleAnalysis {
  totalSize: number
  gzippedSize: number
  chunks: ChunkInfo[]
  recommendations: string[]
}

interface ChunkInfo {
  name: string
  size: number
  modules: ModuleInfo[]
}

interface ModuleInfo {
  path: string
  size: number
  isUnused: boolean
}

// Webpack Bundle Analyzer integration
export function analyzeBundles(): BundleAnalysis
export function identifyUnusedCode(): ModuleInfo[]
export function suggestCodeSplitting(): string[]
```

**Configuration**:
```javascript
// next.config.mjs additions
const nextConfig = {
  // Enable SWC minification (faster than Terser)
  swcMinify: true,
  
  // Optimize bundle splitting
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Split vendor chunks
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk for react/next
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Separate chunk for large libraries
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1]
              return `npm.${packageName.replace('@', '')}`
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          // Common components chunk
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
        },
      }
    }
    
    // Analyze bundles in production
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      )
    }
    
    return config
  },
}
```

### 2. Image Optimization System

**Purpose**: Deliver optimized images in modern formats

**Implementation**:
```typescript
// components/optimized-image.tsx
interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  quality?: number
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 85,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={quality}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      placeholder="blur"
      blurDataURL={generateBlurDataURL(width, height)}
      formats={['image/avif', 'image/webp']}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}

// Generate blur placeholder
function generateBlurDataURL(width: number, height: number): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f0f0f0"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}
```

**Next.js Image Configuration**:
```javascript
// next.config.mjs
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 31536000, // 1 year
  dangerouslyAllowSVG: false,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
}
```

### 3. Font Loading Optimization

**Purpose**: Load fonts efficiently without layout shifts

**Implementation**:
```typescript
// app/layout.tsx - Optimized font loading
import { Inter, Fira_Code } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap', // Show fallback immediately
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  adjustFontFallback: true, // Reduce CLS
  weight: ['400', '600', '700'], // Only essential weights
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-code',
  display: 'swap',
  preload: false, // Not critical, load later
  fallback: ['Courier New', 'monospace'],
  weight: ['400', '600'],
})

// Preload critical fonts in head
export function FontPreload() {
  return (
    <>
      <link
        rel="preload"
        href="/fonts/inter-var.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    </>
  )
}
```

### 4. CSS Optimization System

**Purpose**: Minimize CSS size and eliminate unused styles

**Implementation**:
```typescript
// lib/performance/critical-css.ts
interface CriticalCSSConfig {
  pages: string[]
  dimensions: { width: number; height: number }[]
}

export async function extractCriticalCSS(
  config: CriticalCSSConfig
): Promise<string> {
  // Use critical package to extract above-the-fold CSS
  const critical = require('critical')
  
  const criticalCSS = await critical.generate({
    inline: true,
    base: 'out/',
    src: 'index.html',
    target: {
      html: 'index-critical.html',
      css: 'critical.css',
    },
    dimensions: [
      { width: 375, height: 667 },  // Mobile
      { width: 1920, height: 1080 }, // Desktop
    ],
    penthouse: {
      blockJSRequests: false,
    },
  })
  
  return criticalCSS
}
```

**Tailwind Configuration**:
```javascript
// postcss.config.mjs
export default {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    ...(process.env.NODE_ENV === 'production' && {
      'cssnano': {
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
          minifyFontValues: true,
          minifyGradients: true,
        }],
      },
    }),
  },
}
```

### 5. Component Lazy Loading System

**Purpose**: Load components on-demand to reduce initial bundle

**Implementation**:
```typescript
// lib/performance/lazy-loader.ts
import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

interface LazyLoadOptions {
  loading?: ComponentType
  ssr?: boolean
  suspense?: boolean
}

export function createLazyComponent<P = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyLoadOptions = {}
) {
  return dynamic(importFn, {
    loading: options.loading || (() => <LoadingSkeleton />),
    ssr: options.ssr ?? false,
    suspense: options.suspense ?? true,
  })
}

// Usage in components
const HeavyChart = createLazyComponent(
  () => import('@/components/heavy-chart'),
  { ssr: false }
)

const Modal = createLazyComponent(
  () => import('@/components/modal'),
  { ssr: false, loading: () => null }
)
```

**Intersection Observer for Viewport-Based Loading**:
```typescript
// hooks/use-lazy-load.ts
import { useEffect, useRef, useState } from 'react'

export function useLazyLoad<T extends HTMLElement>(
  options: IntersectionObserverInit = {}
) {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px', // Load 50px before entering viewport
        threshold: 0.01,
        ...options,
      }
    )
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }, [options])
  
  return { ref, isVisible }
}

// Usage
function LazySection() {
  const { ref, isVisible } = useLazyLoad<HTMLDivElement>()
  
  return (
    <div ref={ref}>
      {isVisible && <HeavyComponent />}
    </div>
  )
}
```

### 6. API Optimization Layer

**Purpose**: Optimize data fetching and caching

**Implementation**:
```typescript
// lib/api/optimized-fetch.ts
interface FetchOptions extends RequestInit {
  dedupe?: boolean
  revalidate?: number
  tags?: string[]
}

// Request deduplication cache
const requestCache = new Map<string, Promise<any>>()

export async function optimizedFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const cacheKey = `${url}-${JSON.stringify(options)}`
  
  // Deduplicate concurrent requests
  if (options.dedupe && requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)!
  }
  
  const fetchPromise = fetch(url, {
    ...options,
    next: {
      revalidate: options.revalidate ?? 300, // 5 min default
      tags: options.tags,
    },
  }).then(res => res.json())
  
  if (options.dedupe) {
    requestCache.set(cacheKey, fetchPromise)
    
    // Clean up cache after request completes
    fetchPromise.finally(() => {
      setTimeout(() => requestCache.delete(cacheKey), 1000)
    })
  }
  
  return fetchPromise
}

// Batch multiple requests
export async function batchFetch<T>(
  requests: Array<{ url: string; options?: FetchOptions }>
): Promise<T[]> {
  return Promise.all(
    requests.map(({ url, options }) => optimizedFetch<T>(url, options))
  )
}

// Pagination helper
export async function fetchPaginated<T>(
  url: string,
  page: number = 1,
  pageSize: number = 20
): Promise<{ data: T[]; hasMore: boolean; total: number }> {
  const response = await optimizedFetch<any>(
    `${url}?page=${page}&pageSize=${pageSize}`,
    { dedupe: true, revalidate: 60 }
  )
  
  return {
    data: response.data,
    hasMore: response.page < response.totalPages,
    total: response.total,
  }
}
```

### 7. Caching Strategy Implementation

**Purpose**: Implement multi-layer caching for optimal performance

**Implementation**:
```typescript
// lib/cache/cache-manager.ts
interface CacheConfig {
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate'
  ttl: number
  maxSize?: number
}

class CacheManager {
  private memoryCache = new Map<string, { data: any; expires: number }>()
  
  async get<T>(key: string, config: CacheConfig): Promise<T | null> {
    // Check memory cache first
    const cached = this.memoryCache.get(key)
    if (cached && cached.expires > Date.now()) {
      return cached.data
    }
    
    // Check IndexedDB for larger data
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      const dbData = await this.getFromIndexedDB<T>(key)
      if (dbData) return dbData
    }
    
    return null
  }
  
  async set<T>(key: string, data: T, ttl: number): Promise<void> {
    const expires = Date.now() + ttl * 1000
    
    // Store in memory cache
    this.memoryCache.set(key, { data, expires })
    
    // Store in IndexedDB for persistence
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      await this.setInIndexedDB(key, data, expires)
    }
    
    // Cleanup old entries
    this.cleanup()
  }
  
  private async getFromIndexedDB<T>(key: string): Promise<T | null> {
    // IndexedDB implementation
    return null
  }
  
  private async setInIndexedDB<T>(
    key: string,
    data: T,
    expires: number
  ): Promise<void> {
    // IndexedDB implementation
  }
  
  private cleanup(): void {
    const now = Date.now()
    for (const [key, value] of this.memoryCache.entries()) {
      if (value.expires < now) {
        this.memoryCache.delete(key)
      }
    }
  }
}

export const cacheManager = new CacheManager()
```

**Service Worker for Offline Caching**:
```typescript
// public/sw.js
const CACHE_NAME = 'crowe-logic-v1'
const STATIC_CACHE = [
  '/',
  '/offline',
  '/manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE)
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache-first strategy for static assets
      if (response) {
        return response
      }
      
      // Network-first for API calls
      return fetch(event.request).then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return response
      })
    })
  )
})
```

### 8. Performance Monitoring System

**Purpose**: Track and report performance metrics

**Implementation**:
```typescript
// lib/performance/monitor.ts
interface PerformanceMetrics {
  lcp: number
  fid: number
  cls: number
  fcp: number
  ttfb: number
  tti: number
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {}
  
  init() {
    if (typeof window === 'undefined') return
    
    // Measure LCP
    this.measureLCP()
    
    // Measure FID
    this.measureFID()
    
    // Measure CLS
    this.measureCLS()
    
    // Measure FCP
    this.measureFCP()
    
    // Measure TTFB
    this.measureTTFB()
    
    // Report metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => this.report(), 0)
    })
  }
  
  private measureLCP() {
    if (!('PerformanceObserver' in window)) return
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as any
      this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime
    })
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  }
  
  private measureFID() {
    if (!('PerformanceObserver' in window)) return
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const firstInput = entries[0] as any
      this.metrics.fid = firstInput.processingStart - firstInput.startTime
    })
    
    observer.observe({ entryTypes: ['first-input'] })
  }
  
  private measureCLS() {
    if (!('PerformanceObserver' in window)) return
    
    let clsScore = 0
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsScore += (entry as any).value
        }
      }
      this.metrics.cls = clsScore
    })
    
    observer.observe({ entryTypes: ['layout-shift'] })
  }
  
  private measureFCP() {
    const paintEntries = performance.getEntriesByType('paint')
    const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint')
    if (fcp) {
      this.metrics.fcp = fcp.startTime
    }
  }
  
  private measureTTFB() {
    const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navTiming) {
      this.metrics.ttfb = navTiming.responseStart - navTiming.requestStart
    }
  }
  
  private async report() {
    // Send metrics to analytics
    await fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metrics: this.metrics,
        url: window.location.href,
        userAgent: navigator.userAgent,
        connection: (navigator as any).connection?.effectiveType,
      }),
    })
  }
}

export const performanceMonitor = new PerformanceMonitor()
```

## Data Models

### Performance Metrics Model

```typescript
interface PerformanceReport {
  id: string
  timestamp: Date
  url: string
  metrics: {
    lcp: number        // Largest Contentful Paint (ms)
    fid: number        // First Input Delay (ms)
    cls: number        // Cumulative Layout Shift (score)
    fcp: number        // First Contentful Paint (ms)
    ttfb: number       // Time to First Byte (ms)
    tti: number        // Time to Interactive (ms)
  }
  device: {
    type: 'mobile' | 'tablet' | 'desktop'
    userAgent: string
  }
  network: {
    effectiveType: '4g' | '3g' | '2g' | 'slow-2g'
    downlink: number
    rtt: number
  }
  bundleSize: {
    total: number
    javascript: number
    css: number
    images: number
  }
}
```

### Cache Entry Model

```typescript
interface CacheEntry {
  key: string
  data: any
  expires: number
  size: number
  hits: number
  lastAccessed: Date
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate'
}
```

## Error Handling

### Performance Degradation Handling

```typescript
// lib/performance/degradation-handler.ts
interface PerformanceThresholds {
  lcp: number
  fid: number
  cls: number
}

const THRESHOLDS: PerformanceThresholds = {
  lcp: 2500,  // 2.5s
  fid: 100,   // 100ms
  cls: 0.1,   // 0.1 score
}

export function handlePerformanceDegradation(
  metrics: PerformanceMetrics
): void {
  const issues: string[] = []
  
  if (metrics.lcp > THRESHOLDS.lcp) {
    issues.push(`LCP exceeded threshold: ${metrics.lcp}ms`)
    // Disable non-critical animations
    document.body.classList.add('reduce-motion')
  }
  
  if (metrics.fid > THRESHOLDS.fid) {
    issues.push(`FID exceeded threshold: ${metrics.fid}ms`)
    // Reduce JavaScript execution
    disableNonCriticalFeatures()
  }
  
  if (metrics.cls > THRESHOLDS.cls) {
    issues.push(`CLS exceeded threshold: ${metrics.cls}`)
    // Log layout shift sources
    logLayoutShiftSources()
  }
  
  if (issues.length > 0) {
    // Report to monitoring service
    reportPerformanceIssues(issues)
  }
}

function disableNonCriticalFeatures(): void {
  // Disable animations
  document.body.classList.add('reduce-motion')
  
  // Disable auto-playing videos
  document.querySelectorAll('video[autoplay]').forEach((video) => {
    (video as HTMLVideoElement).pause()
  })
  
  // Reduce polling frequency
  window.dispatchEvent(new CustomEvent('performance-degradation'))
}
```

### Network Error Handling

```typescript
// lib/api/error-handler.ts
export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      lastError = error as Error
      
      // Exponential backoff
      if (i < maxRetries - 1) {
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, i) * 1000)
        )
      }
    }
  }
  
  throw lastError!
}
```

## Testing Strategy

### Performance Testing

```typescript
// tests/performance/lighthouse.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Performance Metrics', () => {
  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    await page.goto('/')
    
    // Measure LCP
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          resolve(lastEntry.renderTime || lastEntry.loadTime)
        }).observe({ entryTypes: ['largest-contentful-paint'] })
      })
    })
    
    expect(lcp).toBeLessThan(2500)
  })
  
  test('should have acceptable bundle size', async ({ page }) => {
    const response = await page.goto('/')
    const resources = await page.evaluate(() => 
      performance.getEntriesByType('resource')
    )
    
    const jsSize = resources
      .filter((r: any) => r.name.endsWith('.js'))
      .reduce((sum: number, r: any) => sum + r.transferSize, 0)
    
    // Should be under 300KB gzipped
    expect(jsSize).toBeLessThan(300 * 1024)
  })
})
```

### Load Testing

```typescript
// tests/performance/load-test.ts
import { test } from '@playwright/test'

test('should handle concurrent users', async ({ browser }) => {
  const contexts = await Promise.all(
    Array.from({ length: 50 }, () => browser.newContext())
  )
  
  const pages = await Promise.all(
    contexts.map(context => context.newPage())
  )
  
  const startTime = Date.now()
  
  await Promise.all(
    pages.map(page => page.goto('/'))
  )
  
  const loadTime = Date.now() - startTime
  
  // All pages should load within 5 seconds
  expect(loadTime).toBeLessThan(5000)
  
  // Cleanup
  await Promise.all(contexts.map(context => context.close()))
})
```

## Implementation Phases

### Phase 1: Build Optimization (Week 1)
- Configure webpack bundle splitting
- Set up bundle analyzer
- Implement tree shaking
- Optimize dependencies

### Phase 2: Asset Optimization (Week 1-2)
- Configure Next.js Image optimization
- Implement font loading strategy
- Extract and inline critical CSS
- Set up compression

### Phase 3: Code Splitting (Week 2)
- Implement dynamic imports
- Create lazy loading utilities
- Add intersection observer hooks
- Optimize component loading

### Phase 4: Caching Strategy (Week 2-3)
- Implement service worker
- Set up cache manager
- Configure API caching
- Add IndexedDB support

### Phase 5: Monitoring (Week 3)
- Implement performance monitor
- Set up analytics endpoint
- Create performance dashboard
- Configure alerts

### Phase 6: Testing & Validation (Week 3-4)
- Run Lighthouse audits
- Perform load testing
- Validate Core Web Vitals
- Fix identified issues

## Success Metrics

- **Bundle Size**: < 300KB gzipped total JavaScript
- **LCP**: < 2.5 seconds on mobile
- **FID**: < 100ms
- **CLS**: < 0.1
- **FCP**: < 1.5 seconds
- **TTI**: < 3.5 seconds on mobile
- **Lighthouse Score**: > 90 for Performance
- **Build Time**: < 3 minutes
- **Cache Hit Rate**: > 80% for static assets
