interface PerformanceThresholds {
  lcp: number
  fid: number
  cls: number
}

const THRESHOLDS: PerformanceThresholds = {
  lcp: 2500, // 2.5s
  fid: 100, // 100ms
  cls: 0.1, // 0.1 score
}

interface PerformanceMetrics {
  lcp?: number
  fid?: number
  cls?: number
}

export function handlePerformanceDegradation(metrics: PerformanceMetrics): void {
  const issues: string[] = []

  if (metrics.lcp && metrics.lcp > THRESHOLDS.lcp) {
    issues.push(`LCP exceeded threshold: ${metrics.lcp}ms`)
    disableHeavyAnimations()
  }

  if (metrics.fid && metrics.fid > THRESHOLDS.fid) {
    issues.push(`FID exceeded threshold: ${metrics.fid}ms`)
    reduceJavaScriptExecution()
  }

  if (metrics.cls && metrics.cls > THRESHOLDS.cls) {
    issues.push(`CLS exceeded threshold: ${metrics.cls}`)
    logLayoutShiftSources()
  }

  if (issues.length > 0) {
    console.warn("[Performance Degradation]", issues)
    reportPerformanceIssues(issues)
  }
}

function disableHeavyAnimations(): void {
  if (typeof document === "undefined") return

  document.body.classList.add("reduce-motion")

  const style = document.createElement("style")
  style.textContent = `
    .reduce-motion * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  `
  document.head.appendChild(style)
}

function reduceJavaScriptExecution(): void {
  if (typeof window === "undefined") return

  window.dispatchEvent(
    new CustomEvent("performance-degradation", {
      detail: { type: "high-fid" },
    }),
  )

  const videos = document.querySelectorAll("video[autoplay]")
  videos.forEach((video) => {
    ;(video as HTMLVideoElement).pause()
  })
}

function logLayoutShiftSources(): void {
  console.warn("[CLS] Layout shifts detected. Check for:")
  console.warn("- Images without dimensions")
  console.warn("- Dynamically injected content")
  console.warn("- Web fonts causing FOIT/FOUT")
  console.warn("- Animations that trigger layout")
}

function reportPerformanceIssues(issues: string[]): void {
  if (typeof window === "undefined") return

  fetch("/api/analytics/performance-issues", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      issues,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    }),
    keepalive: true,
  }).catch(() => {
    // Silently fail
  })
}

export function checkPerformanceThresholds(metrics: PerformanceMetrics): {
  passed: boolean
  failures: string[]
} {
  const failures: string[] = []

  if (metrics.lcp && metrics.lcp > THRESHOLDS.lcp) {
    failures.push("LCP")
  }

  if (metrics.fid && metrics.fid > THRESHOLDS.fid) {
    failures.push("FID")
  }

  if (metrics.cls && metrics.cls > THRESHOLDS.cls) {
    failures.push("CLS")
  }

  return {
    passed: failures.length === 0,
    failures,
  }
}
