"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Terminal, Minimize2, Maximize2 } from "lucide-react"

interface WorkflowTerminalProps {
  isOpen: boolean
  onClose: () => void
  logs: string[]
}

export function WorkflowTerminal({ isOpen, onClose, logs }: WorkflowTerminalProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([])

  useEffect(() => {
    if (!isOpen) {
      setDisplayedLogs([])
      return
    }

    // Simulate streaming logs
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < logs.length) {
        setDisplayedLogs((prev) => [...prev, logs[currentIndex]])
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 300)

    return () => clearInterval(interval)
  }, [isOpen, logs])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          height: isMinimized ? "auto" : "400px",
        }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-6 right-6 w-[600px] bg-black/95 backdrop-blur-xl border border-green-500/30 rounded-lg shadow-2xl shadow-green-500/20 overflow-hidden z-50"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-b border-green-500/30">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="text-sm font-mono font-semibold text-green-400">CROWE LOGIC WORKFLOW</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-green-500/20 rounded transition-colors"
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4 text-green-400" />
              ) : (
                <Minimize2 className="w-4 h-4 text-green-400" />
              )}
            </button>
            <button onClick={onClose} className="p-1 hover:bg-red-500/20 rounded transition-colors">
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        {!isMinimized && (
          <div className="p-4 font-mono text-sm overflow-y-auto h-[calc(400px-48px)] bg-black/50">
            <div className="space-y-1">
              {displayedLogs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-green-500 flex-shrink-0">$</span>
                  <span className="text-green-300/90">{log}</span>
                </motion.div>
              ))}
              {displayedLogs.length > 0 && (
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  className="inline-block w-2 h-4 bg-green-400 ml-2"
                />
              )}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
