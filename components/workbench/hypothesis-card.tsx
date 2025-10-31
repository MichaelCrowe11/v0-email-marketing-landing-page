"use client"

import { useState } from "react"
import { Lightbulb, Play, Eye, Trash2, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HypothesisTest } from "@/lib/types/workbench"

interface HypothesisCardProps {
  hypothesis: HypothesisTest
  onView?: () => void
  onTest?: () => void
  onDelete?: () => void
}

export function HypothesisCard({ hypothesis, onView, onTest, onDelete }: HypothesisCardProps) {
  const getStatusConfig = () => {
    switch (hypothesis.status) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          label: 'Completed'
        }
      case 'running':
        return {
          icon: Clock,
          color: 'text-blue-400',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          label: 'Running'
        }
      case 'failed':
        return {
          icon: AlertCircle,
          color: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          label: 'Failed'
        }
      default:
        return {
          icon: Clock,
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          label: 'Pending'
        }
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  return (
    <div className="glass-card rounded-xl p-6 border border-border hover:border-accent/50 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground mb-1 line-clamp-2">
              {hypothesis.hypothesis.statement}
            </h4>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                <StatusIcon className="w-3 h-3 inline mr-1" />
                {statusConfig.label}
              </span>
              {hypothesis.results && (
                <span className="text-xs text-muted-foreground">
                  {hypothesis.results.evidence.length} evidence items
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expected Outcome */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {hypothesis.hypothesis.expectedOutcome}
      </p>

      {/* Results Preview */}
      {hypothesis.results && (
        <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Confidence Score</span>
            <span className="text-lg font-bold text-foreground">
              {Math.round(hypothesis.results.confidence * 100)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${hypothesis.results.confidence * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Variables */}
      {hypothesis.hypothesis.variables.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Variables</p>
          <div className="flex flex-wrap gap-2">
            {hypothesis.hypothesis.variables.slice(0, 3).map((variable, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted/50 rounded text-xs text-foreground"
              >
                {variable.name}
              </span>
            ))}
            {hypothesis.hypothesis.variables.length > 3 && (
              <span className="px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground">
                +{hypothesis.hypothesis.variables.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-border">
        {hypothesis.status === 'pending' && (
          <Button
            variant="outline"
            size="sm"
            onClick={onTest}
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            Test Hypothesis
          </Button>
        )}
        {hypothesis.status === 'completed' && (
          <Button
            variant="outline"
            size="sm"
            onClick={onView}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Results
          </Button>
        )}
        {hypothesis.status === 'running' && (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="flex-1"
          >
            <Clock className="w-4 h-4 mr-2 animate-spin" />
            Testing...
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
