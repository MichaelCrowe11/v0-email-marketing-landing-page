"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function StickyBar() {
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    heroRef.current = document.querySelector("section")

    if (!heroRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(!entry.isIntersecting)
        })
      },
      { threshold: 0.15 },
    )

    observer.observe(heroRef.current)

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current)
      }
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 z-50 mx-auto max-w-7xl rounded-xl border border-border bg-card/90 p-2 md:p-3 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-3">
        <div className="text-center sm:text-left text-sm md:text-base">
          <strong className="text-foreground">Crowe Logic AI</strong> · Professional mycology intelligence powered by
          20+ years of expertise
        </div>
        <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
          <Button
            className="h-9 md:h-10 rounded-lg md:rounded-xl bg-accent px-3 md:px-4 text-xs md:text-sm font-bold text-accent-foreground shadow-lg shadow-accent/30 hover:bg-accent/90 flex-1 sm:flex-none"
            asChild
          >
            <Link href="/pricing">View Pricing</Link>
          </Button>
          <Button
            variant="outline"
            className="h-9 md:h-10 rounded-lg md:rounded-xl border-border bg-transparent px-3 md:px-4 text-xs md:text-sm font-bold text-foreground hover:bg-secondary flex-1 sm:flex-none"
            asChild
          >
            <Link href="/chat">Try Free Demo</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
