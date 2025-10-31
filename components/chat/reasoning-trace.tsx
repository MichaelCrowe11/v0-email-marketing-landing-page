"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Brain, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface ReasoningStep {
  id: string
  agent: string
  action: string
  input: string
  output: string
  reasoning: string
  confidence: number
  status: "pending" | "running" | "complete" | "error"
  duration?: number
}

interface ReasoningTraceProps {
  steps: ReasoningStep[]
  isStreaming?: boolean
}

export function ReasoningTrace({ steps, isStreaming }: ReasoningTraceProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => {
      const next = new Set(prev)
      if (next.has(stepId)) {
        next.delete(stepId)
      } else {
        next.add(stepId)
      }
      return next
    })
  }

  if (steps.length === 0 && !isStreaming) {
    return null
  }

  return (
    <div className="mt-4 border border-border rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-b border-border flex items-center gap-2">
        <Brain className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-semibold">Reasoning Trace</span>
        {isStreaming && (
          <Loader2 className="w-3 h-3 animate-spin text-cyan-400 ml-auto" />
        )}
      </div>

      {/* Steps */}
      <div className="divide-y divide-border">
        {steps.map((step, index) => {
          const isExpanded = expandedSteps.has(step.id)
          const StatusIcon = 
            step.status === "complete" ? CheckCircle :
            step.status === "error" ? AlertCircle :
            step.status === "running" ? Loader2 : 
            CheckCircle

          return (
            <div key={step.id} className="group">
              {/* Step Header */}
              <button
                onClick={() => toggleStep(step.id)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-accent/50 transition-colors text-left"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <StatusIcon 
                    className={`w-4 h-4 ${
                      step.status === "complete" ? "text-green-500" :
                      step.status === "error" ? "text-red-500" :
                      step.status === "running" ? "text-cyan-500 animate-spin" :
                      "text-gray-400"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate">{step.action}</span>
                    <span className="text-xs text-muted-foreground">by {step.agent}</span>
                  </div>
                  {!isExpanded && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {step.reasoning}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {step.duration && (
                    <span className="text-xs text-muted-foreground">
                      {step.duration}ms
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all"
                        style={{ width: `${step.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground w-8 text-right">
                      {Math.round(step.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </button>

              {/* Step Details */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 bg-muted/30">
                  <div className="pl-11 space-y-2">
                    {/* Reasoning */}
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Reasoning:</div>
                      <p className="text-sm text-foreground leading-relaxed">{step.reasoning}</p>
                    </div>

                    {/* Input */}
                    {step.input && (
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">Input:</div>
                        <div className="text-xs font-mono bg-black/20 p-2 rounded border border-border">
                          {step.input}
                        </div>
                      </div>
                    )}

                    {/* Output */}
                    {step.output && (
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">Output:</div>
                        <div className="text-xs font-mono bg-black/20 p-2 rounded border border-border">
                          {step.output}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      {steps.length > 0 && !isStreaming && (
        <div className="px-4 py-2 bg-muted/30 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>{steps.length} reasoning steps</span>
          <span>
            Avg confidence: {Math.round((steps.reduce((acc, s) => acc + s.confidence, 0) / steps.length) * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}
