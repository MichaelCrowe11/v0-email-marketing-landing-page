"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { ModelSelector } from "@/components/chat/model-selector"
import { AIAvatarSwirl } from "@/components/chat/ai-avatar-swirl"
import { ChatCanvas } from "@/components/chat/chat-canvas"
import { ConversationHistory } from "@/components/chat/conversation-history"
import { MarkdownRenderer } from "@/components/chat/markdown-renderer"
import { Button } from "@/components/ui/button"
import { FileText, Code, Download, Copy, Check, Maximize2, Menu, X, Camera, Loader2, Lock, ExternalLink } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  imageUrl?: string
  visionResult?: VisionResult | null
}

interface VisionResult {
  species?: string
  confidence: number
  growthStage?: string
  contamination: {
    detected: boolean
    type?: string
    severity?: "low" | "medium" | "high" | "critical"
    recommendations?: string[]
  }
  healthScore: number
  observations: string[]
  recommendations: string[]
}

interface ChatContainerProps {
  hasUnlimitedAccess?: boolean
  isLicensed?: boolean
  onLicenseActivated?: () => void
}

export function ChatContainer({ hasUnlimitedAccess = false, isLicensed = true, onLicenseActivated }: ChatContainerProps) {
  const [selectedModel, setSelectedModel] = useState("crowelm/v1")
  const [copied, setCopied] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showLicensePrompt, setShowLicensePrompt] = useState(false)
  const [licenseKey, setLicenseKey] = useState("")
  const [licenseError, setLicenseError] = useState("")
  const [licenseLoading, setLicenseLoading] = useState(false)
  const [canvasContent, setCanvasContent] = useState<{
    content: string
    type: "code" | "document"
    language?: string
  } | null>(null)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)

  // Crowe Vision inline state
  const [pendingImage, setPendingImage] = useState<string | null>(null)
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null)
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const isEmpty = messages.length === 0

  // Auto-scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const loadConversation = (conversationId: string) => {
    // Implementation for loading conversation
    setCurrentConversationId(conversationId)
  }

  const handleNewConversation = async (firstMessage?: string) => {
    const conversationId = await createNewConversation(firstMessage)
    if (conversationId) {
      setCurrentConversationId(conversationId)
    }
  }

  useEffect(() => {
    if (messages.length > 0 && currentConversationId) {
      const lastMessage = messages[messages.length - 1]
      saveMessage(lastMessage)
    }
  }, [messages, currentConversationId])

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
      console.error("[CroweLogic] Error saving message:", error)
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

      if (response.status === 401) {
        console.log("[CroweLogic] Chat running in anonymous mode - conversations will not be saved")
        return null
      }

      if (response.ok) {
        const data = await response.json()
        setCurrentConversationId(data.conversation.id)
        return data.conversation.id
      }
    } catch (error) {
      console.log("[CroweLogic] Chat running in anonymous mode - conversations will not be saved")
    }
    return null
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPendingImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPendingImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const clearPendingImage = () => {
    setPendingImage(null)
    setPendingImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const analyzeImageInChat = async (imageDataUrl: string): Promise<VisionResult | null> => {
    try {
      // Upload to get a blob URL
      const blob = await fetch(imageDataUrl).then(r => r.blob())
      const formData = new FormData()
      formData.append("file", blob, "image.jpg")

      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
      if (!uploadRes.ok) return null
      const { url } = await uploadRes.json()

      // Analyze with Crowe Vision
      const analyzeRes = await fetch("/api/crowe-vision/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      })

      if (!analyzeRes.ok) return null
      const data = await analyzeRes.json()
      return data.analysis || null
    } catch {
      return null
    }
  }

  const sendMessage = async (text: string) => {
    if ((!text.trim() && !pendingImage) || isLoading) return

    let conversationId = currentConversationId
    if (!conversationId) {
      conversationId = await createNewConversation(text)
    }

    const hasImage = !!pendingImage
    const imageDataUrl = pendingImage

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text || (hasImage ? "Analyze this image with Crowe Vision" : ""),
      imageUrl: imageDataUrl || undefined,
    }

    // Clear pending image immediately
    clearPendingImage()

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // If there's an image, run Crowe Vision analysis first
    if (hasImage && imageDataUrl) {
      setIsAnalyzingImage(true)
      const visionMessageId = (Date.now() + 1).toString()

      // Add a "analyzing" assistant message
      setMessages((prev) => [
        ...prev,
        {
          id: visionMessageId,
          role: "assistant",
          content: "",
          visionResult: null,
        },
      ])

      const visionResult = await analyzeImageInChat(imageDataUrl)
      setIsAnalyzingImage(false)

      if (visionResult) {
        // Build a rich markdown summary from the vision result
        const visionMarkdown = buildVisionMarkdown(visionResult)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === visionMessageId
              ? { ...m, content: visionMarkdown, visionResult }
              : m,
          ),
        )
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === visionMessageId
              ? { ...m, content: "I wasn't able to analyze that image. Please try again with a clearer photo." }
              : m,
          ),
        )
      }

      // Now also send the text + vision context to the chat API for follow-up discussion
      if (text.trim()) {
        const contextMessage = visionResult
          ? `${text}\n\n[Context: Crowe Vision just analyzed an image and found: ${visionResult.species || "unknown species"}, health score ${visionResult.healthScore}%, contamination: ${visionResult.contamination.detected ? visionResult.contamination.type : "none detected"}]`
          : text

        await streamChatResponse(contextMessage, [...messages, userMessage])
      }

      setIsLoading(false)
      return
    }

    // Normal text-only message
    await streamChatResponse(text, [...messages, userMessage])
    setIsLoading(false)
  }

  const buildVisionMarkdown = (result: VisionResult): string => {
    const lines: string[] = []
    lines.push("## Crowe Vision Analysis\n")

    if (result.species && result.species !== "Unknown") {
      lines.push(`**Species:** ${result.species} (${result.confidence}% confidence)\n`)
    }
    if (result.growthStage) {
      lines.push(`**Growth Stage:** ${result.growthStage}\n`)
    }

    // Health score with emoji indicator
    const healthEmoji = result.healthScore >= 80 ? "🟢" : result.healthScore >= 60 ? "🟡" : result.healthScore >= 40 ? "🟠" : "🔴"
    lines.push(`**Health Score:** ${healthEmoji} ${result.healthScore}/100\n`)

    // Contamination
    if (result.contamination.detected) {
      lines.push(`\n### ⚠️ Contamination Detected\n`)
      lines.push(`- **Type:** ${result.contamination.type}`)
      lines.push(`- **Severity:** ${result.contamination.severity}\n`)
      if (result.contamination.recommendations?.length) {
        lines.push(`**Remediation Steps:**`)
        result.contamination.recommendations.forEach((rec) => lines.push(`- ${rec}`))
      }
    } else {
      lines.push(`\n### ✅ No Contamination Detected\n`)
    }

    // Observations
    if (result.observations.length > 0) {
      lines.push(`\n### Observations\n`)
      result.observations.forEach((obs) => lines.push(`- ${obs}`))
    }

    // Recommendations
    if (result.recommendations.length > 0) {
      lines.push(`\n### Recommendations\n`)
      result.recommendations.forEach((rec) => lines.push(`- ${rec}`))
    }

    return lines.join("\n")
  }

  const streamChatResponse = async (text: string, contextMessages: Message[]) => {
    const assistantMessageId = (Date.now() + 2).toString()
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
      },
    ])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: contextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
        }),
      })

      if (!response.ok) {
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
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

    } catch (error) {
      console.error("[CroweLogic] Chat error:", error)
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
    const text = messages.map((m) => `${m.role === "user" ? "You" : "Crowe Logic AI"}: ${m.content}`).join("\n\n")
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportMarkdown = () => {
    const markdown = messages
      .map((m) => `### ${m.role === "user" ? "You" : "Crowe Logic AI"}\n\n${m.content}\n`)
      .join("\n")

    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `crowe-logic-conversation-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleActivateLicense = async (e: React.FormEvent) => {
    e.preventDefault()
    setLicenseError("")
    setLicenseLoading(true)

    try {
      const res = await fetch("/api/license/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: licenseKey.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setLicenseError(data.error || "Invalid license key")
        setLicenseLoading(false)
        return
      }

      setShowLicensePrompt(false)
      setLicenseKey("")
      onLicenseActivated?.()
    } catch {
      setLicenseError("Connection error. Please try again.")
    } finally {
      setLicenseLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if ((!inputValue.trim() && !pendingImage) || isLoading) return

    // Check license before sending
    if (!isLicensed) {
      setShowLicensePrompt(true)
      return
    }

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
          {/* Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-primary/20" style={{ backgroundColor: "#252420" }}>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="icon-sm" onClick={() => setShowSidebar(!showSidebar)} className="h-8 w-8">
                {showSidebar ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
              <AIAvatarSwirl state="idle" size={40} />
              <div>
                <h1 className="text-sm sm:text-base font-semibold text-foreground">Crowe Logic AI V 1.0</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">by Michael Crowe — Mycology Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {!isEmpty && (
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={handleCopyConversation} className="h-8 w-8">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={handleExportMarkdown} className="h-8 w-8">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
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
          <div className="flex-1 overflow-y-auto" ref={messagesContainerRef}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
              {isEmpty && (
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] space-y-6 sm:space-y-8 px-4">
                  <AIAvatarSwirl state="idle" size={128} />

                  <div className="text-center space-y-2 sm:space-y-3 max-w-2xl">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-foreground">
                      Welcome to <span className="font-semibold">Crowe Logic AI</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground/70 font-medium">V 1.0 — by Michael Crowe</p>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light px-4">
                      Your personal mycology AI coach, powered by 18+ years of professional cultivation expertise
                      and The Mushroom Grower book series by Michael Crowe.
                    </p>
                  </div>

                  <div className="w-full max-w-3xl mt-6 sm:mt-8 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSuggestionClick("How do I identify contamination in my grain spawn jars?")}
                        className="p-4 rounded-xl bg-card border border-border hover:bg-accent hover:border-accent-foreground/20 transition-all text-left shadow-sm group"
                      >
                        <FileText className="w-5 h-5 mb-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <div className="text-sm font-medium text-foreground">Contamination ID</div>
                        <div className="text-xs text-muted-foreground mt-1">Identify and prevent common contaminants</div>
                      </button>

                      <button
                        onClick={() => handleSuggestionClick("What are the optimal fruiting conditions for blue oyster mushrooms?")}
                        className="p-4 rounded-xl bg-card border border-border hover:bg-accent hover:border-accent-foreground/20 transition-all text-left shadow-sm group"
                      >
                        <Code className="w-5 h-5 mb-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <div className="text-sm font-medium text-foreground">Fruiting Conditions</div>
                        <div className="text-xs text-muted-foreground mt-1">Species-specific growing parameters</div>
                      </button>

                      <button
                        onClick={() => handleSuggestionClick("How do I prepare hardwood substrate for shiitake cultivation?")}
                        className="p-4 rounded-xl bg-card border border-border hover:bg-accent hover:border-accent-foreground/20 transition-all text-left shadow-sm group"
                      >
                        <FileText className="w-5 h-5 mb-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <div className="text-sm font-medium text-foreground">Substrate Prep</div>
                        <div className="text-xs text-muted-foreground mt-1">Recipes and sterilization techniques</div>
                      </button>

                      <button
                        onClick={() => handleSuggestionClick("What's the best way to scale up from hobby to commercial mushroom production?")}
                        className="p-4 rounded-xl bg-card border border-border hover:bg-accent hover:border-accent-foreground/20 transition-all text-left shadow-sm group"
                      >
                        <Camera className="w-5 h-5 mb-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <div className="text-sm font-medium text-foreground">Farm Scaling</div>
                        <div className="text-xs text-muted-foreground mt-1">Grow your operation efficiently</div>
                      </button>
                    </div>

                    {/* Crowe Vision hint */}
                    <div className="text-center mt-4">
                      <p className="text-xs text-muted-foreground">
                        <Camera className="w-3 h-3 inline mr-1" />
                        Attach a photo to analyze with <span className="font-semibold text-primary">Crowe Vision</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!isEmpty && (
                <div className="space-y-6">
                  {messages.map((message, index) => {
                    const isAssistant = message.role === "assistant"
                    const isLastMessage = index === messages.length - 1
                    const isStreaming = isLastMessage && isLoading && isAssistant
                    const isVisionAnalyzing = isAssistant && !message.content && isAnalyzingImage && isLastMessage

                    // Detect if message contains code or document
                    const hasCode = message.content.includes("```")
                    const isDocument = message.content.length > 500 && !hasCode

                    return (
                      <div key={message.id} className="flex gap-3 sm:gap-4 animate-fade-in">
                        {/* Avatar column */}
                        <div className="flex-shrink-0 pt-1">
                          {isAssistant ? (
                            <AIAvatarSwirl state={isStreaming || isVisionAnalyzing ? "thinking" : "idle"} size={36} />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/30 flex items-center justify-center text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-700/50">
                              You
                            </div>
                          )}
                        </div>

                        {/* Message content */}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold mb-1 text-muted-foreground">
                            {isAssistant ? "Crowe Logic AI" : "You"}
                          </div>
                          <div
                            className={`rounded-2xl px-4 sm:px-5 py-3 sm:py-4 shadow-sm ${
                              isAssistant
                                ? "bg-card border border-border"
                                : "bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200/50 dark:border-amber-800/50"
                            }`}
                          >
                            {/* User image preview */}
                            {!isAssistant && message.imageUrl && (
                              <div className="mb-3">
                                <img
                                  src={message.imageUrl}
                                  alt="Uploaded for analysis"
                                  className="rounded-lg max-h-48 object-contain border border-border/30"
                                />
                              </div>
                            )}

                            {/* Vision analyzing state */}
                            {isVisionAnalyzing && (
                              <div className="flex items-center gap-3 py-2">
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                <span className="text-sm text-muted-foreground">Crowe Vision is analyzing your image...</span>
                              </div>
                            )}

                            {/* Message content with markdown */}
                            {message.content && (
                              <div className="text-sm text-foreground">
                                {isAssistant ? (
                                  <MarkdownRenderer content={message.content} />
                                ) : (
                                  <div className="leading-relaxed whitespace-pre-wrap">{message.content}</div>
                                )}
                              </div>
                            )}

                            {/* Streaming cursor */}
                            {isStreaming && (
                              <span className="inline-block w-1.5 h-4 bg-primary animate-pulse rounded-sm ml-0.5" />
                            )}

                            {/* Canvas buttons for code/documents */}
                            {isAssistant && !isStreaming && (hasCode || isDocument) && (
                              <div className="mt-3 flex gap-2">
                                {hasCode && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const codeMatch = message.content.match(/```(\w+)?\n([\s\S]*?)```/)
                                      const code = codeMatch ? codeMatch[2] : message.content
                                      const lang = codeMatch ? codeMatch[1] || "typescript" : "typescript"
                                      handleOpenCanvas(code, "code", lang)
                                    }}
                                    className="gap-2 text-xs"
                                  >
                                    <Maximize2 className="w-3 h-3" />
                                    Open in Canvas
                                  </Button>
                                )}
                                {isDocument && !hasCode && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenCanvas(message.content, "document")}
                                    className="gap-2 text-xs"
                                  >
                                    <Maximize2 className="w-3 h-3" />
                                    Open in Canvas
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border glass-panel">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
              {/* Pending image preview */}
              {pendingImage && (
                <div className="mb-3 flex items-start gap-2">
                  <div className="relative inline-block">
                    <img
                      src={pendingImage}
                      alt="Pending upload"
                      className="h-20 rounded-lg border border-border/50 object-cover"
                    />
                    <button
                      onClick={clearPendingImage}
                      className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors shadow-sm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-primary font-medium mt-1">
                    <Camera className="w-3.5 h-3.5" />
                    Crowe Vision will analyze this image
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="relative">
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
                  placeholder={pendingImage ? "Add a question about this image, or just send to analyze..." : "Ask about cultivation, substrates, contamination, species..."}
                  className="w-full min-h-[56px] sm:min-h-[60px] max-h-[200px] pl-12 sm:pl-14 pr-14 sm:pr-16 py-3 sm:py-4 glass-input rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 resize-none shadow-sm"
                  rows={2}
                  disabled={isLoading}
                />

                {/* Image upload button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute left-2 sm:left-3 bottom-2 sm:bottom-3 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all disabled:opacity-50"
                  disabled={isLoading}
                  title="Upload image for Crowe Vision analysis"
                >
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button
                  type="submit"
                  className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  disabled={isLoading || (!inputValue?.trim() && !pendingImage)}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    >
                      <path d="m5 12 7-7 7 7" />
                      <path d="M12 19V5" />
                    </svg>
                  )}
                </button>
              </form>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Enter to send · Shift+Enter for new line · <Camera className="w-3 h-3 inline" /> for Crowe Vision
              </p>
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

      {/* Inline License Activation Prompt */}
      {showLicensePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card shadow-2xl p-6 animate-scale-in">
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Activate CroweLM</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Enter your license key from The Mushroom Grower to unlock the AI assistant.
              </p>
            </div>

            <form onSubmit={handleActivateLicense} className="space-y-3">
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => {
                  setLicenseKey(e.target.value.toUpperCase())
                  setLicenseError("")
                }}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className="w-full px-4 py-3 rounded-xl font-mono text-sm tracking-wider text-center bg-muted border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                autoFocus
                disabled={licenseLoading}
              />
              {licenseError && (
                <p className="text-xs text-destructive text-center">{licenseError}</p>
              )}
              <button
                type="submit"
                disabled={licenseLoading || !licenseKey.trim()}
                className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50"
              >
                {licenseLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "Activate"
                )}
              </button>
            </form>

            <div className="mt-4 text-center space-y-2">
              <a
                href="https://shop.southwestmushrooms.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                Get The Mushroom Grower
              </a>
              <button
                onClick={() => setShowLicensePrompt(false)}
                className="block w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
