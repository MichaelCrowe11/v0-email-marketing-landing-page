"use client"

import { motion } from "framer-motion"

export function CLMonogram({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`relative flex size-8 items-center justify-center rounded-lg bg-black/40 border border-[#C4A05C]/30 ${className}`}
      whileHover={{ scale: 1.05, borderColor: "#C4A05C" }}
      transition={{ duration: 0.2 }}
    >
      {/* Grid dots background */}
      <div className="absolute inset-0 grid grid-cols-3 gap-0.5 p-1 opacity-20">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-full bg-blue-400" />
        ))}
      </div>

      {/* CL Letters */}
      <div className="relative z-10 font-mono text-sm font-black tracking-tighter">
        <span className="text-[#C4A05C]">C</span>
        <span className="text-white">L</span>
      </div>

      {/* Subtle glow */}
      <div className="absolute inset-0 rounded-lg bg-[#C4A05C]/5 blur-sm" />
    </motion.div>
  )
}
