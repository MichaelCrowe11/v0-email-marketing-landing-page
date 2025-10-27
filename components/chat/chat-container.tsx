"use client"
import type { ReasoningStep } from "@/components/chat/chain-of-thought"
import type React from "react"

import { useChat } from "@ai-sdk/react"
import { useState, useEffect, useRef } from "react"
import { ChainOfThought } from "@/components/chat/chain-of-thought"
import { SubstrateCalculator } from "@/components/chat/substrate-calculator"
import { StrainDatabase } from "@/components/chat/strain-database"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import { DebugPanel } from "@/components/chat/debug-panel"
import { Canvas } from "@/components/chat/canvas"
import { EnvironmentMonitor } from "@/components/chat/environment-monitor"
import { YieldCalculator } from "@/components/chat/yield-calculator"
import { IntegrationsPanel } from "@/components/chat/integrations-panel"
import { createClient } from "@/lib/supabase/client"
import { createConversation, saveMessage, getMessages } from "@/lib/supabase/chat-queries"
import { ConversationHistory } from "@/components/chat/conversation-history"
import { ModelSelector } from "@/components/chat/model-selector"
import { AIAvatarSwirl } from "@/components/chat/ai-avatar-swirl"
import { WorkflowTerminal } from "@/components/chat/workflow-terminal"
import { BrowserResearchPanel } from "@/components/chat/browser-research-panel"
import { VoiceChatButton } from "@/components/chat/voice-chat-button"

function parseReasoning(text: string): { reasoning: ReasoningStep[]; content: string } {
  const reasoningMatch = text.match(/<reasoning>([\s\S]*?)<\/reasoning>/)

  if (!reasoningMatch) {
    return { reasoning: [], content: text }
  }

  const reasoningXml = reasoningMatch[1]
  const steps: ReasoningStep[] = []

  const stepRegex = /<step type="(research|analysis|synthesis|verification)">([\s\S]*?)<\/step>/g
  let match

  while ((match = stepRegex.exec(reasoningXml)) !== null) {
    steps.push({
      type: match[1] as ReasoningStep["type"],
      content: match[2] ? match[2].trim() : "",
    })
  }

  const content = text.replace(/<reasoning>[\s\S]*?<\/reasoning>/, "").trim()

  return { reasoning: steps, content }
}

function MagicalStreamingText({ text, isStreaming }: { text: string; isStreaming: boolean }) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(text)
      return
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, 15)

      return () => clearTimeout(timeout)
    }
  }, [text, currentIndex, isStreaming])

  useEffect(() => {
    setCurrentIndex(0)
    setDisplayedText("")
  }, [text])

  return (
    <>
      {displayedText.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block animate-char-appear"
          style={{
            animationDelay: `${i * 15}ms`,
            animationFillMode: "backwards",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      {isStreaming && currentIndex < text.length && (
        <span className="inline-block w-0.5 h-5 bg-amber-500 ml-0.5 animate-magical-cursor shadow-lg shadow-amber-500/70" />
      )}
    </>
  )
}

export function ChatContainer({ hasUnlimitedAccess = false }: { hasUnlimitedAccess?: boolean }) {
  const [selectedModel, setSelectedModel] = useState("crowelogic/mini")
  const [userId, setUserId] = useState<string | null>(null)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

  const { messages, input, handleInputChange, handleSubmit, status, setInput, setMessages } = useChat({
    api: "/api/chat",
    body: {
      model: selectedModel,
    },
    onError: (error) => {
      console.error("[v0] Chat error:", error)
    },
    onFinish: async (message) => {
      console.log("[v0] Message finished:", message)
      // Save message to database after completion
      if (userId && currentConversationId) {
        await saveMessage(currentConversationId, "assistant", String(message.content))
      }
    },
  })

  const [completedMessages, setCompletedMessages] = useState<Set<string>>(new Set())
  const [activeToolDialog, setActiveToolDialog] = useState<"substrate" | "strain" | "environment" | "yield" | null>(
    null,
  )
  const [isCanvasOpen, setIsCanvasOpen] = useState(false)
  const [canvasContent, setCanvasContent] = useState("")
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isWorkflowTerminalOpen, setIsWorkflowTerminalOpen] = useState(false)
  const [workflowLogs, setWorkflowLogs] = useState<string[]>([])
  const [isBrowserResearchActive, setIsBrowserResearchActive] = useState(false)
  const [researchQuery, setResearchQuery] = useState("")

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [uploadedImage, setUploadedImage] = useState<{ url: string; file: File } | null>(null)
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const autoResize = () => {
      textarea.style.height = "auto"
      const newHeight = Math.min(textarea.scrollHeight, 200) // Max 200px
      textarea.style.height = `${newHeight}px`
    }

    textarea.addEventListener("input", autoResize)
    return () => textarea.removeEventListener("input", autoResize)
  }, [])

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId)
  }

  const handleNewConversation = async () => {
    if (!userId) return

    const conversation = await createConversation(userId, "New Chat")
    if (conversation) {
      setCurrentConversationId(conversation.id)
      setMessages([]) // Clear current messages
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB")
      return
    }

    try {
      setIsAnalyzingImage(true)

      // Upload to Vercel Blob
      const formData = new FormData()
      formData.append("file", file)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) throw new Error("Upload failed")

      const { url } = await uploadResponse.json()
      setUploadedImage({ url, file })
      setIsAnalyzingImage(false)
    } catch (error) {
      console.error("Image upload error:", error)
      alert("Failed to upload image")
      setIsAnalyzingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setUploadedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAnalyzeImage = async () => {
    if (!uploadedImage) return

    setIsAnalyzingImage(true)
    try {
      const response = await fetch("/api/crowe-vision/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: uploadedImage.url }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const { analysis } = await response.json()

      // Add analysis result to chat
      const analysisText = `I've analyzed your image:\n\n**Species:** ${analysis.species || "Unknown"} (${analysis.confidence}% confidence)\n**Growth Stage:** ${analysis.growthStage || "N/A"}\n**Health Score:** ${analysis.healthScore}/100\n\n**Contamination:** ${analysis.contamination.detected ? `⚠️ ${analysis.contamination.type} - ${analysis.contamination.severity} severity` : "✓ None detected"}\n\n**Observations:**\n${analysis.observations.map((obs: string) => `• ${obs}`).join("\n")}\n\n**Recommendations:**\n${analysis.recommendations.map((rec: string) => `• ${rec}`).join("\n")}`

      if (textareaRef.current) {
        textareaRef.current.value = `Analyze this image: ${uploadedImage.url}\n\n${analysisText}`
        const event = new Event("input", { bubbles: true })
        textareaRef.current.dispatchEvent(event)
      }

      handleRemoveImage()
    } catch (error) {
      console.error("Analysis error:", error)
      alert("Failed to analyze image")
    } finally {
      setIsAnalyzingImage(false)
    }
  }

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript)

    setTimeout(() => {
      const form = textareaRef.current?.closest("form")
      if (form) form.requestSubmit()
    }, 50)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)

    // Submit after a brief delay
    setTimeout(() => {
      const form = textareaRef.current?.closest("form")
      if (form) form.requestSubmit()
    }, 50)
  }

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        // Create initial conversation if none exists
        if (!currentConversationId) {
          const conversation = await createConversation(user.id, "New Chat")
          if (conversation) {
            setCurrentConversationId(conversation.id)
          }
        }
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    async function loadConversationMessages() {
      if (!currentConversationId) return

      const messages = await getMessages(currentConversationId)
      if (messages.length > 0) {
        // Convert database messages to chat format
        const chatMessages = messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
        }))
        setMessages(chatMessages)
      } else {
        setMessages([])
      }
    }
    loadConversationMessages()
  }, [currentConversationId, setMessages])

  const isLoading = status === "in_progress"
  const isEmpty = messages.length === 0

  // Check if there's a configuration error in the messages
  const hasConfigError = messages.some(
    (msg) => msg.role === "assistant" && msg.content.includes("AI Service Configuration Required"),
  )

  return (
    <div className="h-full flex flex-col">
      {/* Setup Banner */}
      {hasConfigError && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800/50 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1 text-sm">
              <p className="font-medium text-amber-900 dark:text-amber-200 mb-1">
                Setup Required: AI Features Not Configured
              </p>
              <p className="text-amber-800 dark:text-amber-300 text-xs">
                Configure your API keys in{" "}
                <code className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/50 rounded text-amber-900 dark:text-amber-200">
                  .env.local
                </code>{" "}
                to enable chat and vision features. See{" "}
                <a href="/SETUP.md" className="underline hover:no-underline">
                  SETUP.md
                </a>{" "}
                for instructions.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-border glass-panel">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle conversation history"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-semibold text-foreground">Crowe Logic AI</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Expert Cultivation Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
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
              <path d="m5 12 7-7 7 7" />
              <path d="M19 12V5" />
            </svg>
            Back
          </Link>
        </div>
      </div>

      {isHistoryOpen && (
        <div className="absolute left-0 top-[73px] bottom-0 w-64 bg-card border-r border-border z-50 shadow-lg">
          <ConversationHistory
            currentConversationId={currentConversationId}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {isEmpty && (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] space-y-6 sm:space-y-8 px-4">
              <AIAvatarSwirl state="idle" size={typeof window !== "undefined" && window.innerWidth < 640 ? 96 : 128} />

              <div className="text-center space-y-2 sm:space-y-3 max-w-2xl">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-foreground">
                  Welcome to <span className="font-semibold">Crowe Logic AI</span>
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light px-4">
                  Your expert cultivation assistant powered by years of commercial growing experience.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-3xl mt-6 sm:mt-8">
                {[
                  "How do I identify contamination?",
                  "Optimal conditions for lion's mane?",
                  "How to increase yields by 40%?",
                  "Best substrate for oyster mushrooms?",
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-3 sm:p-4 rounded-xl bg-card border border-border hover:bg-accent hover:border-accent-foreground/20 transition-all text-left text-sm text-foreground shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isEmpty && (
            <div className="space-y-8">
              {messages.map((message, index) => {
                const isAssistant = message.role === "assistant"
                const textContent = message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("")

                const { reasoning, content } = isAssistant
                  ? parseReasoning(textContent)
                  : { reasoning: [], content: textContent }

                const isLastMessage = index === messages.length - 1
                const isCompleted = completedMessages.has(message.id)
                const isStreaming = isLastMessage && isLoading

                const avatarState: "idle" | "thinking" | "responding" =
                  isStreaming && reasoning.length > 0 ? "thinking" : isStreaming ? "responding" : "idle"

                if (
                  isStreaming &&
                  (content.toLowerCase().includes("research") ||
                    content.toLowerCase().includes("look up") ||
                    content.toLowerCase().includes("find information") ||
                    content.toLowerCase().includes("search for"))
                ) {
                  if (!isBrowserResearchActive) {
                    const queryMatch = content.match(/research|look up|find information about|search for\s+(.+?)[.,?]/i)
                    if (queryMatch) {
                      setResearchQuery(queryMatch[1] || textContent.slice(0, 100))
                      setIsBrowserResearchActive(true)
                    }
                  }
                }

                if (isStreaming && (content.includes("SOP") || content.includes("batch") || content.includes("log"))) {
                  if (!isWorkflowTerminalOpen) {
                    setIsWorkflowTerminalOpen(true)
                    setWorkflowLogs([
                      "[v0] Initializing workflow engine...",
                      "[v0] Loading cultivation protocols...",
                      "[v0] Analyzing request parameters...",
                    ])
                  }
                }

                return (
                  <div key={message.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      {isAssistant ? (
                        <AIAvatarSwirl state={avatarState} size={40} />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                          You
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      {isAssistant && reasoning.length > 0 && <ChainOfThought steps={reasoning} />}
                      <div
                        className={`rounded-2xl px-5 py-4 shadow-sm ${
                          isAssistant
                            ? "bg-card border border-border"
                            : "bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200/50 dark:border-amber-800/50"
                        }`}
                      >
                        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                          {isStreaming ? (
                            <MagicalStreamingText text={content} isStreaming={true} />
                          ) : (
                            <span>{content}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {isBrowserResearchActive && (
                <BrowserResearchPanel
                  isActive={isBrowserResearchActive}
                  query={researchQuery}
                  onComplete={(result) => {
                    setIsBrowserResearchActive(false)
                    console.log("[v0] Research complete:", result)
                  }}
                />
              )}

              {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <AIAvatarSwirl state="thinking" size={40} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground relative inline-block">
                      <span className="relative z-10 font-medium">Consciousness awakening...</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent animate-wisdom-shimmer blur-sm" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border glass-panel">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {/* Image Preview */}
          {uploadedImage && (
            <div className="mb-4 relative group">
              <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={uploadedImage.url || "/placeholder.svg"}
                    alt="Upload preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{uploadedImage.file.name}</p>
                  <p className="text-xs text-muted-foreground">{(uploadedImage.file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={handleAnalyzeImage}
                  disabled={isAnalyzingImage}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-50"
                >
                  {isAnalyzingImage ? "Analyzing..." : "Analyze"}
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Remove image"
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
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  const form = e.currentTarget.closest("form")
                  if (form) form.requestSubmit()
                }
              }}
              placeholder="Ask about cultivation techniques, contamination, yields..."
              className="w-full min-h-[56px] sm:min-h-[60px] max-h-[200px] px-4 sm:px-5 py-3 sm:py-4 pr-28 sm:pr-32 glass-input rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 resize-none shadow-sm"
              rows={2}
              disabled={isLoading || isAnalyzingImage}
            />

            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

            {/* Image upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isAnalyzingImage || !!uploadedImage}
              className="absolute right-[100px] sm:right-[108px] bottom-2 sm:bottom-3 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Upload image"
              title="Upload image for analysis"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 sm:w-5 sm:h-5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </button>

            {/* Voice chat button */}
            <div className="absolute right-14 sm:right-16 bottom-2 sm:bottom-3">
              <VoiceChatButton onTranscript={handleVoiceTranscript} disabled={isLoading || isAnalyzingImage} />
            </div>

            {/* Send button with loading state */}
            <button
              type="submit"
              className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              disabled={isLoading || isAnalyzingImage || !input || !input.trim()}
            >
              {isLoading ? (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="m5 12 7-7 7 7" />
                  <path d="M19 12V5" />
                </svg>
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
                  <path d="M19 12V5" />
                </svg>
              )}
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 sm:mt-3 text-center">
            Press Enter to send, Shift+Enter for new line • Click 📷 to upload images
          </p>
        </div>
      </div>

      <Dialog open={activeToolDialog === "substrate"} onOpenChange={() => setActiveToolDialog(null)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base text-foreground">Substrate Calculator</DialogTitle>
          </DialogHeader>
          <SubstrateCalculator />
        </DialogContent>
      </Dialog>

      <Dialog open={activeToolDialog === "strain"} onOpenChange={() => setActiveToolDialog(null)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base text-foreground">Strain Database</DialogTitle>
          </DialogHeader>
          <StrainDatabase />
        </DialogContent>
      </Dialog>

      <Dialog open={activeToolDialog === "environment"} onOpenChange={() => setActiveToolDialog(null)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base text-foreground">Environment Monitor</DialogTitle>
          </DialogHeader>
          <EnvironmentMonitor />
        </DialogContent>
      </Dialog>

      <Dialog open={activeToolDialog === "yield"} onOpenChange={() => setActiveToolDialog(null)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base text-foreground">Yield Calculator</DialogTitle>
          </DialogHeader>
          <YieldCalculator />
        </DialogContent>
      </Dialog>

      <DebugPanel messages={messages} status={status} lastRequest={null} lastResponse={null} />
      <Canvas isOpen={isCanvasOpen} onClose={() => setIsCanvasOpen(false)} initialContent={canvasContent} />
      <IntegrationsPanel isOpen={isIntegrationsOpen} onClose={() => setIsIntegrationsOpen(false)} />
      <WorkflowTerminal
        isOpen={isWorkflowTerminalOpen}
        onClose={() => setIsWorkflowTerminalOpen(false)}
        logs={workflowLogs}
      />
    </div>
  )
}
