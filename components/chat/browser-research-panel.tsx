"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Search, FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react"

interface BrowserAction {
  step: number
  total: number
  action?: string
  url?: string
  query?: string
  count?: number
  sources?: number
  liveViewUrl?: string
}

interface ResearchPanelProps {
  isActive: boolean
  query: string
  onComplete?: (result: string) => void
}

export function BrowserResearchPanel({ isActive, query, onComplete }: ResearchPanelProps) {
  const [status, setStatus] = useState<string>("idle")
  const [currentAction, setCurrentAction] = useState<BrowserAction | null>(null)
  const [researchContent, setResearchContent] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [liveViewUrl, setLiveViewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!isActive || !query) return

    const eventSource = new EventSource(`/api/research/browser?query=${encodeURIComponent(query)}`)

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      switch (data.type) {
        case "status":
          setStatus(data.message)
          break
        case "browser_action":
          setCurrentAction(data)
          if (data.liveViewUrl) {
            setLiveViewUrl(data.liveViewUrl)
          }
          break
        case "content":
          setResearchContent((prev) => prev + data.content)
          break
        case "complete":
          setStatus("complete")
          if (onComplete) onComplete(researchContent)
          eventSource.close()
          break
        case "error":
          setError(data.message)
          eventSource.close()
          break
      }
    }

    eventSource.onerror = () => {
      setError("Connection lost")
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [isActive, query])

  if (!isActive) return null

  return (
    <Card className="p-4 bg-black/40 border-amber-500/20 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-amber-500" />
        <h3 className="font-semibold text-white">Browser Research</h3>
        {status !== "complete" && status !== "idle" && (
          <Loader2 className="w-4 h-4 text-amber-500 animate-spin ml-auto" />
        )}
        {status === "complete" && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}

      {liveViewUrl && status !== "complete" && (
        <div className="mb-4 rounded-lg overflow-hidden border border-amber-500/20">
          <div className="bg-gray-900/50 px-3 py-2 border-b border-gray-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-400">Live Browser View</span>
            <Badge variant="outline" className="text-amber-500 border-amber-500/30 ml-auto text-xs">
              Real-time
            </Badge>
          </div>
          <iframe
            src={`${liveViewUrl}?readOnly=true`}
            className="w-full h-96 bg-gray-950"
            title="Browser Live View"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      )}

      {currentAction && (
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Step {currentAction.step} of {currentAction.total}
            </span>
            <Badge variant="outline" className="text-amber-500 border-amber-500/30">
              {Math.round((currentAction.step / currentAction.total) * 100)}%
            </Badge>
          </div>

          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
              style={{ width: `${(currentAction.step / currentAction.total) * 100}%` }}
            />
          </div>

          {currentAction.action && (
            <div className="flex items-start gap-2 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
              {currentAction.url && <Globe className="w-4 h-4 text-amber-500 mt-0.5" />}
              {currentAction.query && <Search className="w-4 h-4 text-amber-500 mt-0.5" />}
              {currentAction.sources && <FileText className="w-4 h-4 text-amber-500 mt-0.5" />}
              <div className="flex-1">
                <p className="text-sm text-white font-medium">{currentAction.action}</p>
                {currentAction.url && <p className="text-xs text-gray-500 mt-1">{currentAction.url}</p>}
                {currentAction.query && <p className="text-xs text-gray-500 mt-1">Query: {currentAction.query}</p>}
                {currentAction.count && (
                  <p className="text-xs text-gray-500 mt-1">{currentAction.count} results found</p>
                )}
                {currentAction.sources && (
                  <p className="text-xs text-gray-500 mt-1">{currentAction.sources} sources analyzed</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {researchContent && (
        <div className="mt-4 p-4 bg-gray-900/30 rounded-lg border border-gray-800 max-h-96 overflow-y-auto">
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="text-sm text-gray-300 whitespace-pre-wrap">{researchContent}</div>
          </div>
        </div>
      )}

      {status === "idle" && (
        <div className="text-center py-8 text-gray-500">
          <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Waiting to start research...</p>
        </div>
      )}
    </Card>
  )
}
