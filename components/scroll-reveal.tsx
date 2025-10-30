"use client"

import { useEffect, useRef, memo, type ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export const ScrollReveal = memo(function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate-slide-up-fade")
              entry.target.classList.remove("opacity-0", "translate-y-12")
            }, delay)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [delay])

  return (
    <div ref={ref} className={`opacity-0 translate-y-12 transition-all duration-1000 ${className}`}>
      {children}
    </div>
  )
})
