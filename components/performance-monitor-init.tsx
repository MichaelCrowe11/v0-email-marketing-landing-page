"use client"

import { useEffect } from "react"
import { performanceMonitor } from "@/lib/performance/monitor"

export function PerformanceMonitorInit() {
  useEffect(() => {
    performanceMonitor.init()
  }, [])

  return null
}
