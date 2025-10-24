"use client"

import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function AIMentionBadge() {
  return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
      <Badge className="bg-gradient-to-r from-purple-600 to-pink-500 text-white border-0 gap-1">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <Sparkles className="w-3 h-3" />
        </motion.div>
        AI Assisted
      </Badge>
    </motion.div>
  )
}
