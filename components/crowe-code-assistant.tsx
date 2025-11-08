"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Send, Code2, FileCode, Bug, Sparkles } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  code?: string
  language?: string
}

export function CroweCodeAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsGenerating(true)

    try {
      const response = await fetch("/api/crowe-code/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, context: messages }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        role: "assistant",
        content: data.explanation,
        code: data.code,
        language: data.language,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Code generation error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error generating code. Please try again.",
        },
      ])
    } finally {
      setIsGenerating(false)
    }
  }

  const quickActions = [
    { icon: FileCode, label: "Create Function", prompt: "Create a Python function for" },
    { icon: Bug, label: "Debug Code", prompt: "Debug this code:" },
    { icon: Code2, label: "Refactor", prompt: "Refactor this code to be more efficient:" },
    { icon: Sparkles, label: "Optimize", prompt: "Optimize this algorithm:" },
  ]

  return (
    <div className="flex flex-col h-full bg-black border border-[#485063] rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1f2e] border-b border-[#485063]">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-[#4a90e2]" />
          <h3 className="text-sm font-semibold text-white">Crowe Code</h3>
          <span className="text-xs text-[#a0a4a8]">Autonomous Developer</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#4a90e2] font-mono">READY</span>
          <div className="w-2 h-2 rounded-full bg-[#4a90e2] animate-pulse" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <Code2 className="w-12 h-12 text-[#4a90e2] opacity-50" />
            <div className="space-y-2">
              <p className="text-white font-semibold">Crowe Code Ready</p>
              <p className="text-[#a0a4a8] text-xs max-w-md">
                Autonomous software development powered by 20 years of research data analysis expertise. Generate,
                debug, and optimize code instantly.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(action.prompt + " ")}
                  className="bg-[#1a1f2e] border-[#485063] hover:bg-[#2d3648] hover:border-[#4a90e2] text-white"
                >
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={msg.role === "user" ? "text-[#e5c07b]" : "text-[#4a90e2]"}>
                  {msg.role === "user" ? "user@crowe" : "crowe-code"}$
                </span>
              </div>
              <div className="text-white pl-4">{msg.content}</div>
              {msg.code && (
                <Card className="bg-[#0a0e14] border-[#485063] p-4 overflow-x-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#a0a4a8] font-mono">{msg.language}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigator.clipboard.writeText(msg.code || "")}
                      className="text-[#4a90e2] hover:text-[#61afef]"
                    >
                      Copy
                    </Button>
                  </div>
                  <pre className="text-[#61afef] text-xs">
                    <code>{msg.code}</code>
                  </pre>
                </Card>
              )}
            </div>
          ))
        )}
        {isGenerating && (
          <div className="flex items-center gap-2 text-[#4a90e2]">
            <div className="flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce animation-delay-200">.</span>
              <span className="animate-bounce animation-delay-400">.</span>
            </div>
            <span>Generating code</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-[#1a1f2e] border-t border-[#485063]">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            className="flex-1 bg-black border-[#485063] text-white font-mono text-sm resize-none"
            rows={2}
            disabled={isGenerating}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="bg-[#4a90e2] hover:bg-[#61afef] text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
