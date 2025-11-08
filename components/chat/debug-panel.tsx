"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface DebugPanelProps {
  messages: any[]
  status: string
  lastRequest?: any
  lastResponse?: any
}

export function DebugPanel({ messages, status, lastRequest, lastResponse }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"messages" | "request" | "response" | "system">("messages")

  const systemInfo = {
    model: "anthropic/claude-sonnet-4.5",
    status: status,
    messageCount: messages.length,
    timestamp: new Date().toISOString(),
  }

  return (
    <div className="fixed bottom-0 right-0 left-0 md:left-64 z-50">
      <div
        className={`bg-card border-t border-border transition-all duration-300 ${
          isOpen ? "h-96" : "h-12"
        } flex flex-col`}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="h-8 px-2 text-xs font-mono">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-4 h-4 mr-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
              Debug Console
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span
                className={`w-2 h-2 rounded-full ${status === "in_progress" ? "bg-amber-500 animate-pulse" : "bg-green-500"}`}
              />
              {status}
            </div>
          </div>
          {isOpen && (
            <div className="flex gap-1">
              {(["messages", "request", "response", "system"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        {isOpen && (
          <div className="flex-1 overflow-y-auto p-4 bg-muted/10">
            <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
              {activeTab === "messages" && JSON.stringify(messages, null, 2)}
              {activeTab === "request" && JSON.stringify(lastRequest || { note: "No request data yet" }, null, 2)}
              {activeTab === "response" && JSON.stringify(lastResponse || { note: "No response data yet" }, null, 2)}
              {activeTab === "system" && JSON.stringify(systemInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
