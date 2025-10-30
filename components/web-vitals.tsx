"use client"

import { useEffect } from 'react'
import { useReportWebVitals } from 'next/web-vitals'

/**
 * Component to track and report Core Web Vitals
 * Logs metrics in development, sends to analytics in production
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}:`, metric.value, 'ms')
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // You can send to your analytics service here
      // Example: analytics.track('web-vital', metric)
      
      // Check if metrics meet targets
      const targets = {
        FCP: 1500, // First Contentful Paint < 1.5s
        LCP: 2500, // Largest Contentful Paint < 2.5s
        FID: 100,  // First Input Delay < 100ms
        CLS: 0.1,  // Cumulative Layout Shift < 0.1
        TTFB: 800, // Time to First Byte < 800ms
        INP: 200,  // Interaction to Next Paint < 200ms
      }

      const target = targets[metric.name as keyof typeof targets]
      if (target) {
        const status = metric.value <= target ? '✓ PASS' : '✗ FAIL'
        console.log(`[Web Vitals] ${metric.name}: ${metric.value} ${status} (target: ${target})`)
      }
    }
  })

  // Preload critical resources
  useEffect(() => {
    // Preload critical images
    const criticalImages = [
      '/crowe-avatar.png',
      '/crowe-logic-logo.png',
    ]

    criticalImages.forEach((src) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })

    // Preconnect to external domains
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ]

    preconnectDomains.forEach((domain) => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }, [])

  return null
}
