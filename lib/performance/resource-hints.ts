export function preloadCriticalResources() {
  if (typeof document === "undefined") return

  const criticalResources = [{ href: "/fonts/inter-var.woff2", as: "font", type: "font/woff2" }]

  criticalResources.forEach(({ href, as, type }) => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.href = href
    link.as = as
    if (type) link.type = type
    link.crossOrigin = "anonymous"
    document.head.appendChild(link)
  })
}

export function prefetchNextRoute(href: string) {
  if (typeof document === "undefined") return

  const link = document.createElement("link")
  link.rel = "prefetch"
  link.href = href
  document.head.appendChild(link)
}

export function preconnectToOrigins(origins: string[]) {
  if (typeof document === "undefined") return

  origins.forEach((origin) => {
    const link = document.createElement("link")
    link.rel = "preconnect"
    link.href = origin
    link.crossOrigin = "anonymous"
    document.head.appendChild(link)
  })
}
