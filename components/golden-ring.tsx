"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"

interface GoldenRingProps {
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl"
  glow?: boolean
  pulse?: boolean
  className?: string
}

const sizes = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
}

export function GoldenRing({
  children,
  size = "md",
  glow = true,
  pulse = true,
  className = "",
}: GoldenRingProps) {
  const glowAnimation = pulse
    ? {
        boxShadow: [
          "0 0 20px rgba(201, 169, 97, 0.3)",
          "0 0 40px rgba(201, 169, 97, 0.5)",
          "0 0 20px rgba(201, 169, 97, 0.3)",
        ],
      }
    : {}

  return (
    <motion.div
      animate={pulse ? glowAnimation : {}}
      transition={pulse ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
      className={`relative ${sizes[size]} ${className}`}
    >
      {/* Outer Golden Ring */}
      <div
        className="absolute inset-0 rounded-full p-[3px] bg-gradient-to-br from-[#C9A961] to-[#8B7355]"
        style={{
          boxShadow: glow
            ? "0 0 30px rgba(201, 169, 97, 0.4)"
            : "none",
        }}
      >
        {/* Inner Ring */}
        <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#A0895C] to-[#6D5D48]" />

        {/* Content Container */}
        <div className="relative w-full h-full rounded-full overflow-hidden bg-black">
          {children}
        </div>
      </div>
    </motion.div>
  )
}
