"use client"

import { memo, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

interface PerformanceOptimizedCardProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
  delay?: number
  hover?: boolean
}

export const PerformanceOptimizedCard = memo(function PerformanceOptimizedCard({
  children,
  className = "",
  animate = true,
  delay = 0,
  hover = true,
}: PerformanceOptimizedCardProps) {
  const animationConfig = useMemo(
    () => ({
      initial: animate ? { opacity: 0, y: 20 } : {},
      animate: animate ? { opacity: 1, y: 0 } : {},
      transition: animate ? { delay, duration: 0.5, ease: "easeOut" } : {},
      whileHover: hover ? { scale: 1.02, y: -4 } : {},
      whileTap: hover ? { scale: 0.98 } : {},
    }),
    [animate, delay, hover]
  )

  if (!animate) {
    return (
      <Card className={`${className} bg-card/50 backdrop-blur-sm border-border/50`}>
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    )
  }

  return (
    <motion.div {...animationConfig}>
      <Card className={`${className} bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-colors`}>
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </motion.div>
  )
})

PerformanceOptimizedCard.displayName = "PerformanceOptimizedCard"