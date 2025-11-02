"use client"

import { useEffect, useRef, useState } from "react"

export function useLazyLoad<T extends HTMLElement>(options: IntersectionObserverInit = {}) {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.01,
        ...options,
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [options])

  return { ref, isVisible }
}
