import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

/**
 * Hook for optimized intersection observer
 * @param options - Intersection observer options
 * @returns Ref and isIntersecting state
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<T>, boolean] {
  const { threshold = 0.1, root = null, rootMargin = '0px', freezeOnceVisible = false } = options

  const elementRef = useRef<T>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const frozenRef = useRef(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // If already frozen, don't observe
    if (frozenRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting

        setIsIntersecting(isElementIntersecting)

        if (isElementIntersecting && freezeOnceVisible) {
          frozenRef.current = true
          observer.unobserve(element)
        }
      },
      { threshold, root, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, root, rootMargin, freezeOnceVisible])

  return [elementRef, isIntersecting]
}
