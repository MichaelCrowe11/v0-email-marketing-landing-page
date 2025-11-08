"use client"

import Image from "next/image"

interface CLMonogramAnimatedProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function CLMonogramAnimated({ size = "md", className = "" }: CLMonogramAnimatedProps) {
  const sizes = {
    sm: { container: "w-10 h-10" },
    md: { container: "w-14 h-14" },
    lg: { container: "w-16 h-16" },
  }

  const currentSize = sizes[size]

  return (
    <div className={`${className} flex items-center justify-center`}>
      <div className={`relative ${currentSize.container}`}>
        <Image
          src="/crowe-logic-logo.png"
          alt="Crowe Logic"
          fill
          className="object-contain rounded-full border-2 border-border/50"
          priority
        />
      </div>
    </div>
  )
}
