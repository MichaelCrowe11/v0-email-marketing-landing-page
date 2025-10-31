"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { AIAvatarSwirl } from "@/components/chat/ai-avatar-swirl"
import { ChatCanvas } from "@/components/chat/chat-canvas"
import { ConversationHistory } from "@/components/chat/conversation-history"
import { CodeEditor } from "@/components/chat/code-editor"
import { Button } from "@/components/ui/button"
import { FileText, Code, Download, Copy, Check, Maximize2, Menu, X } from "lucide-react"

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

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isEmpty = messages.length === 0

  useEffect(() => {
    if (messages.length > 0 && currentConversationId) {
      const lastMessage = messages[messages.length - 1]
      saveMessage(lastMessage)
    }
  }, [messages, currentConversationId])

  // No longer needed - avatar is now inline with text

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
          {/* Enhanced Header */}
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between border-b border-border bg-card shadow-sm">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setShowSidebar(!showSidebar)} className="hover:bg-accent">
                {showSidebar ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
              <AIAvatarSwirl state="idle" size={40} />
              <div>
                <h1 className="text-lg font-bold text-foreground tracking-tight">
                  Crowe Logic Interface
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block font-medium">Neural Mycology Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isEmpty && (
                <>
                  <Button variant="ghost" size="sm" onClick={handleCopyConversation} className="gap-2 hidden sm:flex">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-xs">Copy</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleExportMarkdown} className="gap-2 hidden sm:flex">
                    <Download className="w-4 h-4" />
                    <span className="text-xs">Export</span>
                  </Button>
                </>
              )}

              <Link
                href="/"
                className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
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
                  <path d="m3 9 9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Home
              </Link>
            </div>
          </div>

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
                        className="group relative p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/20 hover:border-red-500/50 transition-all text-left shadow-lg hover:shadow-red-500/20 hover:scale-105 transform duration-200"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <div className="text-sm font-bold text-foreground mb-1">Contamination Triage</div>
                          <div className="text-xs text-muted-foreground">Vision-powered analysis</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSuggestionClick("Optimize substrate formula for Pleurotus ostreatus with yield predictions")}
                        className="group relative p-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/20 hover:border-green-500/50 transition-all text-left shadow-lg hover:shadow-green-500/20 hover:scale-105 transform duration-200"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <div className="text-sm font-bold text-foreground mb-1">Substrate Optimization</div>
                          <div className="text-xs text-muted-foreground">Formula engineering</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSuggestionClick("Generate production SOP for commercial oyster cultivation with safety protocols")}
                        className="group relative p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/20 hover:border-blue-500/50 transition-all text-left shadow-lg hover:shadow-blue-500/20 hover:scale-105 transform duration-200"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5 text-blue-400" />
                          </div>
                          <div className="text-sm font-bold text-foreground mb-1">SOP Generation</div>
                          <div className="text-xs text-muted-foreground">Production protocols</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSuggestionClick("Write Python code to analyze growth data and predict harvest timing")}
                        className="group relative p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/20 hover:border-purple-500/50 transition-all text-left shadow-lg hover:shadow-purple-500/20 hover:scale-105 transform duration-200"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Code className="w-5 h-5 text-purple-400" />
                          </div>
                          <div className="text-sm font-bold text-foreground mb-1">Code Generation</div>
                          <div className="text-xs text-muted-foreground">Analysis automation</div>
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

                              <div className="text-base text-foreground leading-relaxed whitespace-pre-wrap relative z-10 font-medium">
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
                                
                                {/* EPIC INLINE AVATAR - flows with text naturally */}
                                {isAssistant && isStreaming && hasContent && (
                                  <span className="inline-block align-middle ml-3 relative" style={{ width: '72px', height: '72px', verticalAlign: 'middle' }}>
                                    <div className="relative w-full h-full">
                                      {/* Quantum field glow */}
                                      <div
                                        className="absolute inset-0 rounded-full will-change-transform"
                                        style={{
                                          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.5) 0%, rgba(168, 85, 247, 0.3) 50%, transparent 70%)',
                                          filter: 'blur(30px)',
                                          transform: 'scale(2.8)',
                                          animation: 'quantumPulse 1.2s ease-in-out infinite',
                                        }}
                                      />

                                      {/* Energy rings */}
                                      <div className="absolute inset-0 -m-8 rounded-full border-2 border-cyan-400/80 will-change-transform" style={{ animation: 'ringRotate 0.8s linear infinite' }} />
                                      <div className="absolute inset-0 -m-12 rounded-full border border-purple-400/60 will-change-transform" style={{ animation: 'ringRotate 0.6s linear infinite reverse' }} />

                                      {/* Spinning avatar */}
                                      <div className="will-change-transform" style={{ animation: 'metamorphosis 0.35s linear infinite' }}>
                                        <AIAvatarSwirl state="responding" size={64} />
                                      </div>

                                      {/* CODE STORM */}
                                      {['const', 'fn', '=>', 'async', 'let', '[]', '<>', '&&', 'new', '{}'].map((code, i) => {
                                        const angle = (i * 360 / 10)
                                        return (
                                          <div
                                            key={`code-${i}`}
                                            className="absolute font-mono font-black pointer-events-none will-change-transform"
                                            style={{
                                              left: '50%',
                                              top: '50%',
                                              fontSize: '15px',
                                              color: `hsl(${angle}, 100%, 70%)`,
                                              animation: `codeStorm${i % 3} ${0.45 + (i % 3) * 0.1}s ease-in-out infinite`,
                                              animationDelay: `${i * 0.04}s`,
                                              textShadow: '0 0 25px currentColor, 0 0 50px currentColor',
                                              filter: 'blur(0.3px)',
                                              fontWeight: 900,
                                            }}
                                          >
                                            {code}
                                          </div>
                                        )
                                      })}

                                      {/* Particles */}
                                      {[...Array(8)].map((_, i) => {
                                        const hue = (i * 45) % 360
                                        return (
                                          <div
                                            key={`particle-${i}`}
                                            className="absolute rounded-full will-change-transform"
                                            style={{
                                              width: '5px',
                                              height: '5px',
                                              background: `hsl(${hue}, 100%, 70%)`,
                                              left: '50%',
                                              top: '50%',
                                              animation: `particleExplosion${i % 3} ${0.5 + (i % 3) * 0.1}s ease-out infinite`,
                                              animationDelay: `${i * 0.06}s`,
                                              boxShadow: `0 0 25px hsl(${hue}, 100%, 70%)`,
                                            }}
                                          />
                                        )
                                      })}

                                      {/* Lightning */}
                                      {[...Array(4)].map((_, i) => (
                                        <div
                                          key={`lightning-${i}`}
                                          className="absolute w-1 rounded-full will-change-transform"
                                          style={{
                                            left: '50%',
                                            top: '50%',
                                            height: '45px',
                                            background: `linear-gradient(180deg, hsl(${i * 90}, 100%, 75%), transparent)`,
                                            transformOrigin: 'top',
                                            animation: `lightning ${0.55 + i * 0.1}s ease-in-out infinite`,
                                            animationDelay: `${i * 0.12}s`,
                                            boxShadow: '0 0 15px currentColor',
                                            transform: `rotate(${i * 90}deg)`,
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
                                  filter: blur(0px) brightness(1);
                                }
                                25% {
                                  transform: rotate(90deg) scale(1.1);
                                  filter: blur(0.5px) brightness(1.2);
                                }
                                50% {
                                  transform: rotate(180deg) scale(1.15);
                                  filter: blur(1px) brightness(1.4);
                                }
                                75% {
                                  transform: rotate(270deg) scale(1.1);
                                  filter: blur(0.5px) brightness(1.2);
                                }
                                100% {
                                  transform: rotate(360deg) scale(1);
                                  filter: blur(0px) brightness(1);
                                }
                              }

                              @keyframes quantumPulse {
                                0%, 100% {
                                  transform: scale(2.5);
                                  opacity: 0.4;
                                }
                                50% {
                                  transform: scale(3);
                                  opacity: 0.6;
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

          {/* Enhanced Input with Upload & Quick Actions */}
          <div className="border-t border-border bg-card">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue("Analyze this contamination image and identify the contaminant type")}
                  className="gap-2 whitespace-nowrap text-xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Contamination Analysis
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue("Generate a Python script for ")}
                  className="gap-2 whitespace-nowrap text-xs"
                >
                  <Code className="w-3.5 h-3.5" />
                  Generate Code
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue("Create an SOP for ")}
                  className="gap-2 whitespace-nowrap text-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Create SOP
                </Button>
              </div>

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
