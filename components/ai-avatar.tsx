"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sparkles } from "lucide-react"

interface AIAvatarProps {
  status?: "idle" | "thinking" | "streaming" | "done"
  size?: "sm" | "md" | "lg"
}

export default function AIAvatar({ status = "idle", size = "md" }: AIAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  return (
    <motion.div
      animate={{
        scale: status === "thinking" || status === "streaming" ? [1, 1.1, 1] : 1,
      }}
      transition={{
        duration: 1.5,
        repeat: status === "thinking" || status === "streaming" ? Number.POSITIVE_INFINITY : 0,
        ease: "easeInOut",
      }}
    >
      <Avatar className={`${sizeClasses[size]} ring-2 ring-purple-500/50 relative overflow-visible`}>
        <AvatarFallback className="bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 text-white relative">
          <motion.div
            animate={{
              rotate: status === "streaming" ? 360 : 0,
            }}
            transition={{
              duration: 2,
              repeat: status === "streaming" ? Number.POSITIVE_INFINITY : 0,
              ease: "linear",
            }}
          >
            <Sparkles className={iconSizes[size]} />
          </motion.div>
        </AvatarFallback>

        {/* Animated ring for thinking/streaming states */}
        {(status === "thinking" || status === "streaming") && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-purple-400"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        )}
      </Avatar>
    </motion.div>
  )
}
