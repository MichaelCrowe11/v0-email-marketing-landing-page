"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export function ConversionTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    fetch("/api/analytics/conversion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        utm_source: searchParams.get("utm_source"),
        utm_medium: searchParams.get("utm_medium"),
        utm_campaign: searchParams.get("utm_campaign"),
        referrer: document.referrer,
        page: window.location.pathname,
      }),
    }).catch(() => {})
  }, [searchParams])

  return null
}
