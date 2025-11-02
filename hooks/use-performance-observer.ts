"use client"

import { useEffect, useState } from "react"

interface PerformanceMetrics {
  lcp?: number
  fid?: number
  cls?: number
  fcp?: number
}

export function usePerformanceObserver() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})

  useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
      return
    }

    // Observe LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as any
      setMetrics((prev) => ({
        ...prev,
        lcp: lastEntry.renderTime || lastEntry.loadTime,
      }))
    })
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] })

    // Observe FID
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const firstInput = entries[0] as any
      setMetrics((prev) => ({
        ...prev,
        fid: firstInput.processingStart - firstInput.startTime,
      }))
    })
    fidObserver.observe({ entryTypes: ["first-input"] })

    // Observe CLS
    let clsScore = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsScore += (entry as any).value
        }
      }
      setMetrics((prev) => ({ ...prev, cls: clsScore }))
    })
    clsObserver.observe({ entryTypes: ["layout-shift"] })

    return () => {
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
    }
  }, [])

  return metrics
}
