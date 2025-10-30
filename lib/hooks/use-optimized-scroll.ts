import { useEffect, useCallback, useRef } from 'react'
import { rafThrottle } from '@/lib/performance'

/**
 * Hook for optimized scroll event handling with RAF throttling
 * @param callback - Function to call on scroll
 * @param deps - Dependencies array
 */
export function useOptimizedScroll(
  callback: (scrollY: number) => void,
  deps: React.DependencyList = []
) {
  const callbackRef = useRef(callback)

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const handleScroll = useCallback(
    rafThrottle(() => {
      callbackRef.current(window.scrollY)
    }),
    []
  )

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll, ...deps])
}
