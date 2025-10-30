/**
 * Performance optimization utilities
 */

/**
 * Debounce function to limit how often a function can be called
 * @param func - The function to debounce
 * @param wait - The delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function to ensure a function is called at most once per interval
 * @param func - The function to throttle
 * @param limit - The minimum time between calls in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Request animation frame throttle for smooth 60fps animations
 * @param func - The function to throttle
 * @returns RAF-throttled function
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null

  return function executedFunction(...args: Parameters<T>) {
    if (rafId !== null) {
      return
    }

    rafId = requestAnimationFrame(() => {
      func(...args)
      rafId = null
    })
  }
}

/**
 * Lazy load an image with intersection observer
 * @param imgElement - The image element to lazy load
 * @param options - Intersection observer options
 */
export function lazyLoadImage(
  imgElement: HTMLImageElement,
  options?: IntersectionObserverInit
): void {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        const src = img.dataset.src

        if (src) {
          img.src = src
          img.removeAttribute('data-src')
        }

        observer.unobserve(img)
      }
    })
  }, options)

  observer.observe(imgElement)
}

/**
 * Preload critical resources
 * @param urls - Array of resource URLs to preload
 * @param type - Resource type (image, script, style, font)
 */
export function preloadResources(
  urls: string[],
  type: 'image' | 'script' | 'style' | 'font' = 'image'
): void {
  urls.forEach((url) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = url

    switch (type) {
      case 'image':
        link.as = 'image'
        break
      case 'script':
        link.as = 'script'
        break
      case 'style':
        link.as = 'style'
        break
      case 'font':
        link.as = 'font'
        link.crossOrigin = 'anonymous'
        break
    }

    document.head.appendChild(link)
  })
}

/**
 * Check if user prefers reduced motion
 * @returns boolean indicating reduced motion preference
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get optimal image format support
 * @returns Promise resolving to supported format
 */
export async function getOptimalImageFormat(): Promise<'avif' | 'webp' | 'jpg'> {
  if (typeof window === 'undefined') return 'jpg'

  // Check AVIF support
  const avifSupport = await checkImageSupport(
    'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A='
  )
  if (avifSupport) return 'avif'

  // Check WebP support
  const webpSupport = await checkImageSupport(
    'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='
  )
  if (webpSupport) return 'webp'

  return 'jpg'
}

/**
 * Check if browser supports an image format
 * @param dataUrl - Data URL to test
 * @returns Promise resolving to support status
 */
function checkImageSupport(dataUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = dataUrl
  })
}

/**
 * Measure Core Web Vitals
 */
export function measureWebVitals(): void {
  if (typeof window === 'undefined') return

  // Measure FCP (First Contentful Paint)
  const paintEntries = performance.getEntriesByType('paint')
  const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint')
  if (fcp) {
    console.log('FCP:', fcp.startTime, 'ms')
  }

  // Measure LCP (Largest Contentful Paint)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.startTime, 'ms')
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      // LCP not supported
    }
  }

  // Measure CLS (Cumulative Layout Shift)
  if ('PerformanceObserver' in window) {
    try {
      let clsScore = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsScore += (entry as any).value
          }
        }
        console.log('CLS:', clsScore)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      // CLS not supported
    }
  }

  // Measure FID (First Input Delay)
  if ('PerformanceObserver' in window) {
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const firstInput = entries[0]
        const fid = (firstInput as any).processingStart - firstInput.startTime
        console.log('FID:', fid, 'ms')
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch (e) {
      // FID not supported
    }
  }

  // Measure TTFB (Time to First Byte)
  const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  if (navigationTiming) {
    const ttfb = navigationTiming.responseStart - navigationTiming.requestStart
    console.log('TTFB:', ttfb, 'ms')
  }
}
