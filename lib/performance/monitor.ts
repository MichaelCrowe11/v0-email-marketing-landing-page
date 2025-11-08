"use client"

interface PerformanceMetrics {
  lcp?: number
  fid?: number
  cls?: number
  fcp?: number
  ttfb?: number
  tti?: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {}
  private reported = false

  init() {
    if (typeof window === "undefined") return

    this.measureLCP()
    this.measureFID()
    this.measureCLS()
    this.measureFCP()
    this.measureTTFB()

    // Report metrics after page load
    if (document.readyState === "complete") {
      this.scheduleReport()
    } else {
      window.addEventListener("load", () => this.scheduleReport())
    }
  }

  private measureLCP() {
    if (!("PerformanceObserver" in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime
      })

      observer.observe({ entryTypes: ["largest-contentful-paint"] })
    } catch (e) {
      console.error("[v0] LCP measurement failed:", e)
    }
  }

  private measureFID() {
    if (!("PerformanceObserver" in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const firstInput = entries[0] as any
        this.metrics.fid = firstInput.processingStart - firstInput.startTime
      })

      observer.observe({ entryTypes: ["first-input"] })
    } catch (e) {
      console.error("[v0] FID measurement failed:", e)
    }
  }

  private measureCLS() {
    if (!("PerformanceObserver" in window)) return

    try {
      let clsScore = 0
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsScore += (entry as any).value
          }
        }
        this.metrics.cls = clsScore
      })

      observer.observe({ entryTypes: ["layout-shift"] })
    } catch (e) {
      console.error("[v0] CLS measurement failed:", e)
    }
  }

  private measureFCP() {
    try {
      const paintEntries = performance.getEntriesByType("paint")
      const fcp = paintEntries.find((entry) => entry.name === "first-contentful-paint")
      if (fcp) {
        this.metrics.fcp = fcp.startTime
      }
    } catch (e) {
      console.error("[v0] FCP measurement failed:", e)
    }
  }

  private measureTTFB() {
    try {
      const navTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      if (navTiming) {
        this.metrics.ttfb = navTiming.responseStart - navTiming.requestStart
      }
    } catch (e) {
      console.error("[v0] TTFB measurement failed:", e)
    }
  }

  private scheduleReport() {
    setTimeout(() => this.report(), 0)
  }

  private async report() {
    if (this.reported) return
    this.reported = true

    try {
      const connection = (navigator as any).connection

      await fetch("/api/analytics/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metrics: this.metrics,
          url: window.location.href,
          userAgent: navigator.userAgent,
          connection: {
            effectiveType: connection?.effectiveType,
            downlink: connection?.downlink,
            rtt: connection?.rtt,
          },
        }),
        keepalive: true,
      }).catch(() => {
        // Silently fail - analytics shouldn't break the app
      })
    } catch (e) {
      // Silently fail
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }
}

export const performanceMonitor = new PerformanceMonitor()
