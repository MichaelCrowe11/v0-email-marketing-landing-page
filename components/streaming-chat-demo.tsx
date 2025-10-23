"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp?: string
  image?: string
}

export function StreamingChatDemo() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const formatTime = useCallback(() => {
    const now = new Date()
    return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
  }, [])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const sendMessage = useCallback(async () => {
    if (!input.trim() && !uploadedImage) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: formatTime(),
      image: uploadedImage || undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setUploadedImage(null)
    setIsStreaming(true)
    setStreamingText("")

    // Add assistant message placeholder
    const assistantMessage: Message = {
      role: "assistant",
      content: "",
      timestamp: formatTime(),
    }
    setMessages((prev) => [...prev, assistantMessage])

    try {
      console.log("[v0] Sending message to API...")
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: currentInput },
          ],
        }),
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] API error:", errorData)
        throw new Error(errorData.error || "Failed to get response")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ""

      if (reader) {
        console.log("[v0] Starting to read stream...")
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            console.log("[v0] Stream complete")
            break
          }

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim()
              if (data === "[DONE]") {
                console.log("[v0] Received [DONE] signal")
                continue
              }

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content || ""
                if (content) {
                  accumulatedText += content
                  setStreamingText(accumulatedText)
                  setMessages((prev) => {
                    const newMessages = [...prev]
                    newMessages[newMessages.length - 1] = {
                      ...newMessages[newMessages.length - 1],
                      content: accumulatedText,
                    }
                    return newMessages
                  })
                }
              } catch (e) {
                // Skip invalid JSON or non-JSON lines
                console.log("[v0] Skipping line:", line)
              }
            }
          }
        }
      }

      if (!accumulatedText) {
        console.log("[v0] No content received, using fallback")
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            content: "I'm ready to help! Please make sure your Azure AI agent is properly configured.",
          }
          return newMessages
        })
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = {
          ...newMessages[newMessages.length - 1],
          content: `Error: ${error instanceof Error ? error.message : "Unknown error"}. Please check your Azure AI configuration.`,
        }
        return newMessages
      })
    } finally {
      setIsStreaming(false)
    }
  }, [input, uploadedImage, messages, formatTime])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    },
    [sendMessage],
  )

  return (
    <section className="relative px-4 py-16 bg-gradient-to-b from-background via-muted/10 to-background overflow-hidden">
      {/* Animated particle background */}
      <div className="particle-bg opacity-50" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-blob animation-delay-3000" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center animate-fade-in">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
            Chat with Crowe Logic <span className="text-gradient-purple">AI</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ask questions and get expert cultivation advice powered by your Azure AI agent
          </p>
        </div>

        <div className="mx-auto max-w-md md:max-w-lg">
          <div className="glass-ultra rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden bg-black transition-shadow duration-300 hover:shadow-3xl">
            {/* Phone notch and status bar */}
            <div className="relative bg-black h-8 flex items-center justify-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl" />
              <div className="absolute top-2 left-4 flex items-center gap-1 text-white text-xs">
                <span>9:41</span>
              </div>
              <div className="absolute top-2 right-4 flex items-center gap-1 text-white text-xs">
                <span>📶</span>
                <span>📡</span>
                <span>🔋</span>
              </div>
            </div>

            {/* Chat Header - iOS style */}
            <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
              <div className="relative">
                <img
                  src="/crowe-logic-mushroom-logo.jpg"
                  alt="Crowe Logic"
                  className="w-10 h-10 rounded-full ring-2 ring-primary/30 shadow-md"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">Crowe Logic AI</h3>
                <p className="text-xs text-green-600">Active now</p>
              </div>
            </div>

            <div className="p-4 space-y-3 min-h-[600px] max-h-[600px] overflow-y-auto bg-white">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🍄</div>
                    <div className="text-gray-500 text-sm">
                      <p className="font-semibold mb-2">Welcome to Crowe Logic AI</p>
                      <p className="text-xs">Ask me anything about mushroom cultivation</p>
                    </div>
                  </div>
                </div>
              )}

              <AnimatePresence mode="sync">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.3, type: "spring" }}
                    className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <img
                        src="/crowe-logic-mushroom-logo.jpg"
                        alt="Crowe Logic"
                        className="w-8 h-8 rounded-full flex-shrink-0 shadow-sm mt-1"
                      />
                    )}

                    <div className={`max-w-[75%] ${message.role === "user" ? "order-first" : ""}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm ${
                          message.role === "user"
                            ? "bg-primary text-white rounded-br-md"
                            : "bg-gray-100 text-gray-900 rounded-bl-md"
                        }`}
                      >
                        {message.image && (
                          <img
                            src={message.image || "/placeholder.svg"}
                            alt="Uploaded"
                            className="rounded-lg mb-2 w-full max-w-xs"
                          />
                        )}

                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                          {isStreaming && index === messages.length - 1 && (
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8 }}
                              className="inline-block w-0.5 h-4 ml-1 bg-current"
                            />
                          )}
                        </p>
                      </div>

                      <div
                        className={`mt-1 text-[10px] text-gray-400 ${message.role === "user" ? "text-right" : "text-left"}`}
                      >
                        {message.timestamp}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 flex items-center gap-2">
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 text-xl hover:text-primary transition-colors"
                aria-label="Upload image"
                disabled={isStreaming}
              >
                📷
              </button>
              {uploadedImage && (
                <div className="relative">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Preview"
                    className="w-8 h-8 rounded object-cover"
                  />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isStreaming}
                placeholder="Message Crowe Logic..."
                className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={sendMessage}
                disabled={isStreaming || (!input.trim() && !uploadedImage)}
                className="text-primary text-xl hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                ⬆️
              </button>
            </div>

            {/* Home indicator */}
            <div className="bg-black h-6 flex items-center justify-center">
              <div className="w-32 h-1 bg-white/30 rounded-full" />
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="glass-card rounded-2xl p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-glass">
              <div className="mb-2 text-success font-semibold text-sm">✓ Real-Time AI</div>
              <p className="text-xs text-muted-foreground">Powered by your Azure AI agent with streaming responses</p>
            </div>
            <div className="glass-card rounded-2xl p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-glass">
              <div className="mb-2 text-success font-semibold text-sm">✓ Image Support</div>
              <p className="text-xs text-muted-foreground">Upload photos for visual analysis and expert guidance</p>
            </div>
            <div className="glass-card rounded-2xl p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-glass">
              <div className="mb-2 text-success font-semibold text-sm">✓ Expert Knowledge</div>
              <p className="text-xs text-muted-foreground">20 years of cultivation expertise in every response</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
