"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { AIAvatarSwirl } from "@/components/chat/ai-avatar-swirl"
import { ChatCanvas } from "@/components/chat/chat-canvas"
import { ConversationHistory } from "@/components/chat/conversation-history"
import { CodeEditor } from "@/components/chat/code-editor"
import { VoiceInput } from "@/components/chat/voice-input"
import { AgentSwitcher, type AgentType } from "@/components/chat/agent-switcher"
import { MultimodalInput } from "@/components/chat/multimodal-input"
import { ReasoningTrace } from "@/components/chat/reasoning-trace"
import { MarkdownRenderer } from "@/components/chat/markdown-renderer"
import { CodeUpload } from "@/components/chat/code-upload"
import { Button } from "@/components/ui/button"
import { FileText, Code, Download, Copy, Check, Maximize2, Menu, X, FileCode2 } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export function ChatContainer({ hasUnlimitedAccess = false }: { hasUnlimitedAccess?: boolean }) {
  const [copied, setCopied] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [canvasContent, setCanvasContent] = useState<{
    content: string
    type: "code" | "document"
    language?: string
  } | null>(null)
  const [codeEditorContent, setCodeEditorContent] = useState<{
    code: string
    language: string
  } | null>(null)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [avatarPosition, setAvatarPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false)
  const [isCompletingStream, setIsCompletingStream] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<AgentType>("deepparallel")
  const [attachedImages, setAttachedImages] = useState<File[]>([])
  const [showReasoningTrace, setShowReasoningTrace] = useState(false)
  const [reasoningSteps, setReasoningSteps] = useState<any[]>([])
  const [showFileUpload, setShowFileUpload] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isEmpty = messages.length === 0

  useEffect(() => {
    if (messages.length > 0 && currentConversationId) {
      const lastMessage = messages[messages.length - 1]
      saveMessage(lastMessage)
    }
  }, [messages, currentConversationId])

  // Gentle auto-scroll only when new content appears - no jumbling
  useEffect(() => {
    if (!isLoading) return

    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content) {
      const messageEl = document.getElementById(`message-${lastMessage.id}`)
      if (messageEl) {
        // Only scroll if avatar is out of view
        const rect = messageEl.getBoundingClientRect()
        const isOutOfView = rect.bottom > window.innerHeight - 100 || rect.top < 100
        
        if (isOutOfView) {
          messageEl.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
        }
      }
    }
  }, [isLoading, messages.length, messages[messages.length - 1]?.content.length])

  const saveMessage = async (message: Message) => {
    if (!currentConversationId) return

    try {
      await fetch(`/api/conversations/${currentConversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: message.role,
          content: message.content,
        }),
      })
    } catch (error) {
      console.error("[v0] Error saving message:", error)
    }
  }

  const createNewConversation = async (firstMessage?: string) => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: firstMessage ? firstMessage.slice(0, 50) + "..." : "New Conversation",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentConversationId(data.conversation.id)
        return data.conversation.id
      }
    } catch (error) {
      console.error("[v0] Error creating conversation:", error)
    }
    return null
  }

  const loadConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(
          data.messages.map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content,
          })),
        )
        setCurrentConversationId(id)
        setShowSidebar(false)
      }
    } catch (error) {
      console.error("[v0] Error loading conversation:", error)
    }
  }

  const handleNewConversation = () => {
    setMessages([])
    setCurrentConversationId(null)
    setShowSidebar(false)
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    let conversationId = currentConversationId
    if (!conversationId) {
      conversationId = await createNewConversation(text)
      if (!conversationId) {
        console.error("[v0] Failed to create conversation")
        return
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    const assistantMessageId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
      },
    ])

    try {
      console.log("[v0] Sending chat request")

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          agent: currentAgent,
          images: attachedImages.map(img => img.name), // Send image metadata
          includeReasoning: showReasoningTrace,
        }),
      })

      console.log("[v0] Response status:", response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] API error response:", errorText)
        throw new Error(`Chat request failed: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error("No response body")
      }

      let accumulatedText = ""

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n").filter((line) => line.trim() !== "")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)

            if (data === "[DONE]") continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content

              if (content) {
                accumulatedText += content

                // Parse reasoning steps if present
                if (showReasoningTrace && content.includes("[REASONING_STEP:")) {
                  const stepMatch = content.match(/\[REASONING_STEP: ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^\]]+)\]/)
                  if (stepMatch) {
                    const [, agent, action, reasoning, confidence] = stepMatch
                    setReasoningSteps(prev => [...prev, {
                      id: Date.now().toString(),
                      agent: agent.trim(),
                      action: action.trim(),
                      input: "",
                      output: "",
                      reasoning: reasoning.trim(),
                      confidence: parseFloat(confidence.trim()),
                      status: "complete",
                      duration: Math.random() * 500 + 200,
                    }])
                  }
                }

                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantMessageId ? { ...m, content: accumulatedText } : m)),
                )
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      console.log("[v0] Streaming complete, total length:", accumulatedText.length)
      
      // Trigger completion animation
      setIsCompletingStream(true)
      setTimeout(() => {
        setIsCompletingStream(false)
      }, 1500)
    } catch (error) {
      console.error("[v0] Chat error:", error)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
              ...m,
              content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
            }
            : m,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    setTimeout(() => {
      sendMessage(suggestion)
      setInputValue("")
    }, 50)
  }

  const handleCopyConversation = async () => {
    const text = messages.map((m) => `${m.role === "user" ? "You" : "Crowe Logic Interface"}: ${m.content}`).join("\n\n")
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportMarkdown = () => {
    const markdown = messages
      .map((m) => `### ${m.role === "user" ? "You" : "Crowe Logic Interface"}\n\n${m.content}\n`)
      .join("\n")

    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `crowe-logic-conversation-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    sendMessage(inputValue)
    setInputValue("")
  }

  const handleOpenCanvas = (content: string, type: "code" | "document", language?: string) => {
    setCanvasContent({ content, type, language })
  }

  const handleCodeUploaded = (prompt: string, filename: string, language: string) => {
    // Send the generated prompt to the chat
    sendMessage(prompt)
    setShowFileUpload(false)
  }

  return (
    <>
      <div className="h-full flex">
        {showSidebar && (
          <div className="w-64 lg:w-80 flex-shrink-0">
            <ConversationHistory
              currentConversationId={currentConversationId}
              onSelectConversation={loadConversation}
              onNewConversation={handleNewConversation}
            />
          </div>
        )}

        <div className="flex-1 flex flex-col">
          {/* Minimal floating actions */}
          {!isEmpty && (
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopyConversation} className="gap-2 bg-card/80 backdrop-blur-sm border border-border shadow-sm">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-xs hidden sm:inline">Copy</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleExportMarkdown} className="gap-2 bg-card/80 backdrop-blur-sm border border-border shadow-sm">
                <Download className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">Export</span>
              </Button>
            </div>
          )}
          
          {/* Sidebar toggle button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowSidebar(!showSidebar)} 
            className="absolute top-4 left-4 z-10 bg-card/80 backdrop-blur-sm border border-border shadow-sm hover:bg-accent"
          >
            {showSidebar ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-12">
              {isEmpty && (
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] space-y-6 sm:space-y-8 px-4">
                  <div className="relative">
                    {/* Dramatic glow rings */}
                    <div className="absolute inset-0 -m-16">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-3xl animate-pulse" />
                      <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" style={{ animationDuration: "3s" }} />
                      <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" style={{ animationDuration: "4s", animationDelay: "0.5s" }} />
                    </div>
                    <AIAvatarSwirl state="idle" size={120} />
                  </div>

                  <div className="text-center space-y-3 sm:space-y-4 max-w-3xl">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                      <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                        Crowe Logic Interface
                      </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-light px-4">
                      Neural mycology intelligence powered by 20+ years of cultivation mastery
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/80">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span>Deep Reasoning</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span>Vision Analysis</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        <span>Code Generation</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-4xl mt-8 sm:mt-10 space-y-4">
                    <p className="text-center text-sm text-muted-foreground font-medium mb-4">
                      Choose your path to mycological mastery
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <button
                        onClick={() => handleSuggestionClick("Analyze this contamination and provide triage protocol with confidence levels")}
                        className="group relative p-5 rounded-2xl bg-zinc-800/90 border border-zinc-700 hover:border-zinc-600 transition-all text-left shadow-lg hover:shadow-zinc-900/50 hover:scale-105 transform duration-200 backdrop-blur-sm"
                      >
                        <div className="absolute inset-0 bg-zinc-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-zinc-700/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <div className="text-sm font-bold text-white mb-1">Contamination Triage</div>
                          <div className="text-xs text-zinc-300">Vision-powered analysis</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSuggestionClick("Optimize substrate formula for Pleurotus ostreatus with yield predictions")}
                        className="group relative p-5 rounded-2xl bg-zinc-800/90 border border-zinc-700 hover:border-zinc-600 transition-all text-left shadow-lg hover:shadow-zinc-900/50 hover:scale-105 transform duration-200 backdrop-blur-sm"
                      >
                        <div className="absolute inset-0 bg-zinc-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-zinc-700/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <div className="text-sm font-bold text-white mb-1">Substrate Optimization</div>
                          <div className="text-xs text-zinc-300">Formula engineering</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSuggestionClick("Generate production SOP for commercial oyster cultivation with safety protocols")}
                        className="group relative p-5 rounded-2xl bg-zinc-800/90 border border-zinc-700 hover:border-zinc-600 transition-all text-left shadow-lg hover:shadow-zinc-900/50 hover:scale-105 transform duration-200 backdrop-blur-sm"
                      >
                        <div className="absolute inset-0 bg-zinc-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-zinc-700/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-sm font-bold text-white mb-1">SOP Generation</div>
                          <div className="text-xs text-zinc-300">Production protocols</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSuggestionClick("Write Python code to analyze growth data and predict harvest timing")}
                        className="group relative p-5 rounded-2xl bg-zinc-800/90 border border-zinc-700 hover:border-zinc-600 transition-all text-left shadow-lg hover:shadow-zinc-900/50 hover:scale-105 transform duration-200 backdrop-blur-sm"
                      >
                        <div className="absolute inset-0 bg-zinc-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-zinc-700/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Code className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-sm font-bold text-white mb-1">Code Generation</div>
                          <div className="text-xs text-zinc-300">Analysis automation</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!isEmpty && (
                <div className="space-y-8">
                  {messages.map((message, index) => {
                    const isAssistant = message.role === "assistant"
                    const isLastMessage = index === messages.length - 1
                    const isStreaming = isLastMessage && isLoading && isAssistant

                    // Determine avatar state based on streaming status
                    const hasContent = message.content.length > 0
                    const avatarState = isStreaming
                      ? (hasContent ? "responding" : "thinking")  // "responding" when streaming content, "thinking" when waiting
                      : "idle"  // "idle" when message is complete

                    // Detect if message contains code or document
                    const hasCode = message.content.includes("```")
                    const isDocument = message.content.length > 500 && !hasCode

                    return (
                      <div key={message.id} className="flex gap-4">
                        {!isAssistant && (
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                              You
                            </div>
                          </div>
                        )}
                        <div className="flex-1">
                          <div
                            className={`rounded-2xl px-5 py-4 shadow-sm ${isAssistant
                              ? "bg-card border border-border"
                              : "bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200/50 dark:border-amber-800/50"
                              }`}
                          >
                            <div className="relative min-h-[80px]" id={`message-${message.id}`}>

                              <div className="text-base text-foreground leading-relaxed relative z-10 font-medium">
                                {/* Use MarkdownRenderer for code blocks, fallback to animated text for plain content */}
                                {hasCode ? (
                                  <MarkdownRenderer content={message.content} />
                                ) : (
                                  <div className="whitespace-pre-wrap">
                                    {/* Each character materializes with color flash */}
                                    {message.content.split('').map((char, i) => {
                                      const isNew = isStreaming && i >= message.content.length - 25
                                      return (
                                        <span
                                          key={`char-${i}`}
                                          className={isNew ? "inline-block" : ""}
                                          style={isNew ? {
                                            animation: 'charSparkle 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                                            animationDelay: `${(i - (message.content.length - 25)) * 0.03}s`,
                                            opacity: 0,
                                          } : {}}
                                        >
                                          {char}
                                        </span>
                                      )
                                    })}
                                  </div>
                                )}
                                
                                {/* COMPACT STABLE AVATAR - small and precise */}
                                {isAssistant && isStreaming && hasContent && (
                                  <span className="inline-block align-middle ml-2 relative group" style={{ width: '36px', height: '36px', verticalAlign: 'middle', display: 'inline-block' }}>
                                    {/* Enhanced reasoning tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500/95 to-purple-500/95 text-white text-xs rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 backdrop-blur-md border-2 border-white/30 shadow-2xl shadow-cyan-500/50">
                                      <div className="font-black text-white mb-1 flex items-center gap-2">
                                        <span className="animate-pulse">⚡</span>
                                        <span className="bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">Deep Reasoning Active</span>
                                      </div>
                                      <div className="text-[10px] text-cyan-50 font-semibold">Analyzing patterns • Synthesizing knowledge • Generating insights</div>
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-cyan-500"></div>
                                    </div>

                                    <div className="relative w-full h-full">
                                      {/* INTENSE quantum field with multiple layers */}
                                      <div
                                        className="absolute inset-0 rounded-full will-change-transform"
                                        style={{
                                          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.9) 0%, rgba(168, 85, 247, 0.6) 40%, rgba(236, 72, 153, 0.4) 70%, transparent 85%)',
                                          filter: 'blur(25px)',
                                          transform: 'scale(2.5)',
                                          animation: 'quantumPulse 0.7s ease-in-out infinite',
                                        }}
                                      />
                                      {/* Secondary glow layer */}
                                      <div
                                        className="absolute inset-0 rounded-full will-change-transform"
                                        style={{
                                          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.7) 0%, transparent 60%)',
                                          filter: 'blur(15px)',
                                          transform: 'scale(1.8)',
                                          animation: 'quantumPulse 0.5s ease-in-out infinite reverse',
                                        }}
                                      />

                                      {/* BLAZING energy rings - 3 layers */}
                                      <div className="absolute inset-0 -m-4 rounded-full border-[3px] border-cyan-300 will-change-transform shadow-[0_0_20px_rgba(34,211,238,0.8)]" style={{ animation: 'ringRotate 0.4s linear infinite' }} />
                                      <div className="absolute inset-0 -m-6 rounded-full border-2 border-purple-300 will-change-transform shadow-[0_0_15px_rgba(168,85,247,0.7)]" style={{ animation: 'ringRotate 0.3s linear infinite reverse' }} />
                                      <div className="absolute inset-0 -m-8 rounded-full border border-pink-300 will-change-transform shadow-[0_0_10px_rgba(236,72,153,0.6)]" style={{ animation: 'ringRotate 0.25s linear infinite' }} />

                                      {/* COMPACT spinning avatar */}
                                      <div className="will-change-transform" style={{ animation: 'metamorphosis 0.2s linear infinite' }}>
                                        <AIAvatarSwirl state="responding" size={28} />
                                      </div>

                                      {/* COMPACT CODE STORM - 18 elements */}
                                      {['const', 'fn', '=>', 'async', 'let', 'if', 'map', 'filter', '[]', '{}', '()', '<>', '&&', '||', '!', '==', 'new', 'return'].map((code, i) => {
                                        const angle = (i * 360 / 18)
                                        return (
                                          <div
                                            key={`code-${i}`}
                                            className="absolute font-mono font-black pointer-events-none will-change-transform"
                                            style={{
                                              left: '50%',
                                              top: '50%',
                                              fontSize: `${10 + (i % 2)}px`,
                                              color: `hsl(${angle}, 100%, ${72 + (i % 3) * 4}%)`,
                                              animation: `codeStorm${i % 3} ${0.32 + (i % 3) * 0.06}s ease-in-out infinite`,
                                              animationDelay: `${i * 0.02}s`,
                                              textShadow: '0 0 20px currentColor, 0 0 40px currentColor',
                                              filter: 'blur(0.2px) brightness(1.3)',
                                              fontWeight: 900,
                                            }}
                                          >
                                            {code}
                                          </div>
                                        )
                                      })}

                                      {/* COMPACT particles - 10 elements */}
                                      {[...Array(10)].map((_, i) => {
                                        const hue = (i * 36) % 360
                                        return (
                                          <div
                                            key={`particle-${i}`}
                                            className="absolute rounded-full will-change-transform"
                                            style={{
                                              width: `${3 + (i % 2)}px`,
                                              height: `${3 + (i % 2)}px`,
                                              background: `hsl(${hue}, 100%, 75%)`,
                                              left: '50%',
                                              top: '50%',
                                              animation: `particleExplosion${i % 3} ${0.36 + (i % 3) * 0.06}s ease-out infinite`,
                                              animationDelay: `${i * 0.04}s`,
                                              boxShadow: `0 0 20px hsl(${hue}, 100%, 75%)`,
                                              filter: 'brightness(1.4)',
                                            }}
                                          />
                                        )
                                      })}

                                      {/* COMPACT lightning - 6 bolts */}
                                      {[...Array(6)].map((_, i) => (
                                        <div
                                          key={`lightning-${i}`}
                                          className="absolute w-0.5 rounded-full will-change-transform"
                                          style={{
                                            left: '50%',
                                            top: '50%',
                                            height: `${28 + i * 2}px`,
                                            background: `linear-gradient(180deg, hsl(${i * 60}, 100%, 80%), transparent)`,
                                            transformOrigin: 'top',
                                            animation: `lightning ${0.35 + i * 0.06}s ease-in-out infinite`,
                                            animationDelay: `${i * 0.07}s`,
                                            boxShadow: '0 0 12px currentColor',
                                            transform: `rotate(${i * 60}deg)`,
                                            filter: 'brightness(1.5)',
                                          }}
                                        />
                                      ))}

                                      {/* COMPACT star burst - 8 rays */}
                                      {[...Array(8)].map((_, i) => (
                                        <div
                                          key={`star-${i}`}
                                          className="absolute w-0.5 h-2 will-change-transform"
                                          style={{
                                            left: '50%',
                                            top: '50%',
                                            background: `linear-gradient(180deg, hsl(${i * 45}, 100%, 85%), transparent)`,
                                            transformOrigin: 'center',
                                            animation: `starBurst 0.65s ease-in-out infinite`,
                                            animationDelay: `${i * 0.06}s`,
                                            transform: `rotate(${i * 45}deg) translateY(-15px)`,
                                            boxShadow: '0 0 8px currentColor',
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </span>
                                )}
                                
                                {isAssistant && !isStreaming && (
                                  <span className="inline-block align-middle ml-3">
                                    <AIAvatarSwirl state="idle" size={40} />
                                  </span>
                                )}
                                {isStreaming && (
                                  <span
                                    className="inline-block w-2 h-5 ml-1 align-middle streaming-cursor"
                                    style={{
                                      background: 'linear-gradient(90deg, #22d3ee, #a855f7, #ec4899)',
                                      animation: 'cursorPulse 0.8s ease-in-out infinite',
                                      boxShadow: '0 0 15px rgba(34, 211, 238, 0.8)',
                                    }}
                                  />
                                )}
                              </div>
                            </div>

                            <style jsx>{`
                              @keyframes metamorphosis {
                                0% {
                                  transform: rotate(0deg) scale(1);
                                  filter: blur(0px) brightness(1.1);
                                }
                                50% {
                                  transform: rotate(180deg) scale(1.08);
                                  filter: blur(0.3px) brightness(1.3);
                                }
                                100% {
                                  transform: rotate(360deg) scale(1);
                                  filter: blur(0px) brightness(1.1);
                                }
                              }

                              @keyframes quantumPulse {
                                0%, 100% {
                                  transform: scale(2.2);
                                  opacity: 0.5;
                                }
                                50% {
                                  transform: scale(2.6);
                                  opacity: 0.7;
                                }
                              }

                              @keyframes ringRotate {
                                from {
                                  transform: rotate(0deg);
                                }
                                to {
                                  transform: rotate(360deg);
                                }
                              }

                              @keyframes starBurst {
                                0%, 100% {
                                  opacity: 0;
                                  transform: rotate(var(--rotation, 0deg)) translateY(-15px) scale(0);
                                }
                                50% {
                                  opacity: 1;
                                  transform: rotate(var(--rotation, 0deg)) translateY(-30px) scale(1.5);
                                }
                              }

                              @keyframes slowdownTransform {
                                0% {
                                  transform: rotate(0deg) scale(1);
                                  filter: blur(1px) brightness(1.4);
                                }
                                30% {
                                  transform: rotate(180deg) scale(1.1);
                                  filter: blur(0.8px) brightness(1.3);
                                }
                                60% {
                                  transform: rotate(300deg) scale(1.05);
                                  filter: blur(0.4px) brightness(1.1);
                                }
                                85% {
                                  transform: rotate(350deg) scale(1.02);
                                  filter: blur(0.1px) brightness(1.05);
                                }
                                100% {
                                  transform: rotate(360deg) scale(1);
                                  filter: blur(0px) brightness(1);
                                }
                              }

                              @keyframes codeStorm0 {
                                0% {
                                  transform: translate(-50%, -50%) translateX(0) translateY(0) scale(0.5) rotate(0deg);
                                  opacity: 0;
                                }
                                15% {
                                  opacity: 1;
                                }
                                50% {
                                  transform: translate(-50%, -50%) translateX(120px) translateY(-80px) scale(1.5) rotate(540deg);
                                  opacity: 1;
                                }
                                85% {
                                  opacity: 0.3;
                                }
                                100% {
                                  transform: translate(-50%, -50%) translateX(160px) translateY(60px) scale(0.3) rotate(1080deg);
                                  opacity: 0;
                                }
                              }

                              @keyframes codeStorm1 {
                                0% {
                                  transform: translate(-50%, -50%) translateX(0) translateY(0) scale(0.6) rotate(0deg);
                                  opacity: 0;
                                }
                                20% {
                                  opacity: 1;
                                }
                                50% {
                                  transform: translate(-50%, -50%) translateX(-100px) translateY(90px) scale(1.6) rotate(-720deg);
                                  opacity: 1;
                                }
                                80% {
                                  opacity: 0.4;
                                }
                                100% {
                                  transform: translate(-50%, -50%) translateX(-140px) translateY(-50px) scale(0.4) rotate(-1440deg);
                                  opacity: 0;
                                }
                              }

                              @keyframes codeStorm2 {
                                0% {
                                  transform: translate(-50%, -50%) translateX(0) translateY(0) scale(0.7) rotate(0deg);
                                  opacity: 0;
                                }
                                25% {
                                  opacity: 1;
                                }
                                50% {
                                  transform: translate(-50%, -50%) translateX(90px) translateY(110px) scale(1.4) rotate(900deg);
                                  opacity: 1;
                                }
                                75% {
                                  opacity: 0.5;
                                }
                                100% {
                                  transform: translate(-50%, -50%) translateX(-120px) translateY(-80px) scale(0.5) rotate(1800deg);
                                  opacity: 0;
                                }
                              }

                              @keyframes particleExplosion0 {
                                0% {
                                  transform: translate(-50%, -50%) scale(0);
                                  opacity: 1;
                                }
                                40% {
                                  transform: translate(-50%, -50%) translateX(80px) translateY(-40px) scale(2);
                                  opacity: 1;
                                }
                                100% {
                                  transform: translate(-50%, -50%) translateX(130px) translateY(-70px) scale(0);
                                  opacity: 0;
                                }
                              }

                              @keyframes particleExplosion1 {
                                0% {
                                  transform: translate(-50%, -50%) scale(0) rotate(0deg);
                                  opacity: 1;
                                }
                                40% {
                                  transform: translate(-50%, -50%) translateX(-70px) translateY(60px) scale(1.8) rotate(180deg);
                                  opacity: 1;
                                }
                                100% {
                                  transform: translate(-50%, -50%) translateX(-120px) translateY(100px) scale(0) rotate(360deg);
                                  opacity: 0;
                                }
                              }

                              @keyframes particleExplosion2 {
                                0% {
                                  transform: translate(-50%, -50%) scale(0);
                                  opacity: 1;
                                }
                                40% {
                                  transform: translate(-50%, -50%) translateX(50px) translateY(80px) scale(2.2);
                                  opacity: 1;
                                }
                                100% {
                                  transform: translate(-50%, -50%) translateX(90px) translateY(140px) scale(0);
                                  opacity: 0;
                                }
                              }

                              @keyframes lightning {
                                0%, 100% {
                                  opacity: 0;
                                  transform: translateX(-50%) translateY(-50%) scaleY(0);
                                }
                                5% {
                                  opacity: 1;
                                  transform: translateX(-50%) translateY(-50%) scaleY(1.5);
                                }
                                10% {
                                  opacity: 0;
                                  transform: translateX(-50%) translateY(-50%) scaleY(0.5);
                                }
                                15% {
                                  opacity: 1;
                                  transform: translateX(-50%) translateY(-50%) scaleY(1.2);
                                }
                                20%, 100% {
                                  opacity: 0;
                                  transform: translateX(-50%) translateY(-50%) scaleY(0);
                                }
                              }

                              @keyframes charSparkle {
                                0% {
                                  opacity: 0;
                                  transform: translateY(-15px) scale(2);
                                  filter: blur(8px) brightness(3);
                                  color: #22d3ee;
                                }
                                40% {
                                  color: #a855f7;
                                  filter: blur(4px) brightness(2);
                                }
                                70% {
                                  color: #ec4899;
                                  filter: blur(2px) brightness(1.5);
                                }
                                100% {
                                  opacity: 1;
                                  transform: translateY(0) scale(1);
                                  filter: blur(0) brightness(1);
                                  color: inherit;
                                }
                              }

                              @keyframes cursorPulse {
                                0%, 100% {
                                  opacity: 1;
                                  transform: scaleY(1);
                                  box-shadow: 0 0 15px rgba(34, 211, 238, 0.8);
                                }
                                50% {
                                  opacity: 0.4;
                                  transform: scaleY(0.8);
                                  box-shadow: 0 0 25px rgba(168, 85, 247, 1);
                                }
                              }
                            `}</style>

                            {/* Reasoning Trace */}
                            {isAssistant && showReasoningTrace && reasoningSteps.length > 0 && isLastMessage && (
                              <ReasoningTrace steps={reasoningSteps} isStreaming={isStreaming} />
                            )}

                            {/* Canvas buttons for code/documents */}
                            {isAssistant && !isStreaming && (hasCode || isDocument) && (
                              <div className="mt-4 flex gap-2">
                                {hasCode && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const codeMatch = message.content.match(/```(\w+)?\n([\s\S]*?)```/)
                                        const code = codeMatch ? codeMatch[2] : message.content
                                        const lang = codeMatch ? codeMatch[1] || "python" : "python"
                                        setCodeEditorContent({ code, language: lang })
                                      }}
                                      className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                                    >
                                      <Code className="w-3 h-3" />
                                      Open in IDE
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const codeMatch = message.content.match(/```(\w+)?\n([\s\S]*?)```/)
                                        const code = codeMatch ? codeMatch[2] : message.content
                                        const lang = codeMatch ? codeMatch[1] || "typescript" : "typescript"
                                        handleOpenCanvas(code, "code", lang)
                                      }}
                                      className="gap-2"
                                    >
                                      <Maximize2 className="w-3 h-3" />
                                      View Full Screen
                                    </Button>
                                  </>
                                )}
                                {isDocument && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenCanvas(message.content, "document")}
                                    className="gap-2"
                                  >
                                    <Maximize2 className="w-3 h-3" />
                                    Open in Document Canvas
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Input with AI Features */}
          <div className="border-t border-border bg-card">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
              {/* AI Controls Bar */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  <AgentSwitcher
                    currentAgent={currentAgent}
                    onAgentChange={setCurrentAgent}
                    disabled={isLoading}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReasoningTrace(!showReasoningTrace)}
                    className="gap-2 whitespace-nowrap text-xs"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {showReasoningTrace ? "Hide" : "Show"} Reasoning
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFileUpload(!showFileUpload)}
                    className="gap-2 whitespace-nowrap text-xs bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border-blue-500/30"
                  >
                    <FileCode2 className="w-3.5 h-3.5" />
                    {showFileUpload ? "Hide" : "Upload"} Code File
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <VoiceInput
                    onTranscript={(text) => setInputValue(prev => prev + " " + text)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Multimodal Input */}
              <MultimodalInput
                onImagesChange={setAttachedImages}
                disabled={isLoading}
              />

              {/* File Upload Component */}
              {showFileUpload && (
                <div className="mb-4">
                  <CodeUpload
                    onCodeUploaded={handleCodeUploaded}
                    disabled={isLoading}
                  />
                </div>
              )}

              <form onSubmit={handleSubmit} className="relative">
                {/* Upload Button */}
                <label className="absolute left-3 bottom-3 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file && file.type.startsWith("image/")) {
                        setUploadedImage(file)
                        setIsAnalyzingImage(true)
                        
                        try {
                          const formData = new FormData()
                          formData.append("image", file)
                          formData.append("prompt", inputValue || "Analyze this image for contamination")
                          
                          const response = await fetch("/api/analyze-image", {
                            method: "POST",
                            body: formData,
                          })
                          
                          const data = await response.json()
                          
                          if (data.success) {
                            // Add user message with image
                            const userMessage: Message = {
                              id: Date.now().toString(),
                              role: "user",
                              content: `[Image: ${file.name}]\n${inputValue || "Analyze this image"}`,
                            }
                            
                            // Add AI analysis response
                            const aiMessage: Message = {
                              id: (Date.now() + 1).toString(),
                              role: "assistant",
                              content: data.analysis,
                            }
                            
                            setMessages(prev => [...prev, userMessage, aiMessage])
                            setInputValue("")
                          }
                        } catch (error) {
                          console.error("Image analysis error:", error)
                        } finally {
                          setIsAnalyzingImage(false)
                          setUploadedImage(null)
                          e.target.value = ""
                        }
                      }
                    }}
                  />
                  <div className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors">
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </div>
                </label>

                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                  placeholder="Ask about contamination, generate code, create SOPs, analyze data..."
                  className="w-full min-h-[56px] max-h-[200px] pl-14 pr-14 py-3 bg-muted/50 border border-border rounded-xl text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none font-medium"
                  rows={2}
                  disabled={isLoading}
                />

                <button
                  type="submit"
                  className="absolute right-2 bottom-2 h-10 w-10 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  disabled={isLoading || !inputValue?.trim()}
                >
                  {isLoading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="m5 12 7-7 7 7" />
                      <path d="M12 19V5" />
                    </svg>
                  )}
                </button>
              </form>
              
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Press Enter to send • Shift+Enter for new line</span>
                <span className="hidden sm:inline">Upload images for analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Modal */}
      {canvasContent && (
        <ChatCanvas
          content={canvasContent.content}
          type={canvasContent.type}
          language={canvasContent.language}
          onClose={() => setCanvasContent(null)}
        />
      )}

      {/* Code IDE Modal */}
      {codeEditorContent && (
        <CodeEditor
          initialCode={codeEditorContent.code}
          language={codeEditorContent.language}
          onClose={() => setCodeEditorContent(null)}
        />
      )}
    </>
  )
}
