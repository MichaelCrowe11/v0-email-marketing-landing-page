import dynamic from "next/dynamic"
import type { ComponentType } from "react"

interface LazyLoadOptions {
  loading?: ComponentType
  ssr?: boolean
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
      <div className="h-4 bg-muted rounded w-1/2" />
    </div>
  )
}

export function createLazyComponent<P = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyLoadOptions = {},
) {
  return dynamic(importFn, {
    loading: options.loading || LoadingSkeleton,
    ssr: options.ssr ?? false,
  })
}
