import dynamic from 'next/dynamic'
import React, { type ComponentType } from 'react'

export interface DynamicImportOptions {
  loading?: ComponentType
  ssr?: boolean
  preload?: 'hover' | 'visible' | 'idle'
}

export function createDynamicImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: DynamicImportOptions = {}
) {
  const { loading, ssr = false, preload } = options

  const DynamicComponent = dynamic(importFn, {
    loading: loading ? () => React.createElement(loading) : undefined,
    ssr,
  })

  if (preload === 'hover') {
    // Preload on hover
    const PreloadOnHover = (props: any) => (
      <div onMouseEnter={() => importFn()}>
        <DynamicComponent {...props} />
      </div>
    )
    return PreloadOnHover as T
  }

  if (preload === 'visible') {
    // Preload when visible
    const PreloadOnVisible = (props: any) => {
      const ref = (node: HTMLDivElement | null) => {
        if (node && 'IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
              importFn()
              observer.disconnect()
            }
          })
          observer.observe(node)
        }
      }
      return (
        <div ref={ref}>
          <DynamicComponent {...props} />
        </div>
      )
    }
    return PreloadOnVisible as T
  }

  if (preload === 'idle') {
    // Preload when browser is idle
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(() => importFn())
    }
  }

  return DynamicComponent
}

export const LoadingSkeleton = () => (
  <div className="h-96 bg-muted/10 animate-pulse rounded-lg" />
)

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-96">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
)
