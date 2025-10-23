"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"

export interface ReasoningStep {
  type: "research" | "analysis" | "synthesis" | "verification"
  content: string
}

interface ChainOfThoughtProps {
  steps: ReasoningStep[]
}

const stepIcons = {
  research: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  analysis: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  ),
  synthesis: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M12 2v20M2 12h20" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  verification: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
}

const stepLabels = {
  research: "Research",
  analysis: "Analysis",
  synthesis: "Synthesis",
  verification: "Verification",
}

export function ChainOfThought({ steps }: ChainOfThoughtProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [revealedSteps, setRevealedSteps] = useState<number[]>([])

  useEffect(() => {
    if (isExpanded && revealedSteps.length < steps.length) {
      const timer = setTimeout(() => {
        setRevealedSteps((prev) => [...prev, prev.length])
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [isExpanded, revealedSteps.length, steps.length])

  useEffect(() => {
    if (!isExpanded) {
      setRevealedSteps([])
    }
  }, [isExpanded])

  if (steps.length === 0) return null

  return (
    <div className="mb-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
        <span className="relative font-medium">
          Reasoning process ({steps.length} steps)
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent animate-wisdom-shimmer" />
        </span>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-4 pl-6 border-l-2 border-amber-500/40 shadow-[0_0_20px_rgba(251,191,36,0.1)] animate-consciousness-glow">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex gap-3 text-xs transition-all duration-500 ${
                revealedSteps.includes(index) ? "animate-thought-emerge" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div
                className={`flex-shrink-0 mt-0.5 text-amber-600 transition-all duration-300 ${
                  index === revealedSteps.length - 1 ? "animate-thought-pulse scale-125" : ""
                }`}
              >
                {stepIcons[step.type]}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground mb-1.5 flex items-center gap-2">
                  {stepLabels[step.type]}
                  {index === revealedSteps.length - 1 && (
                    <svg width="30" height="3" className="animate-neural-connection">
                      <line
                        x1="0"
                        y1="1.5"
                        x2="30"
                        y2="1.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="100"
                        className="text-amber-500 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]"
                      />
                    </svg>
                  )}
                </div>
                <div className="text-muted-foreground leading-relaxed">{step.content}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
