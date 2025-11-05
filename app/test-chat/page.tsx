"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function TestChatPage() {
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const testChat = async () => {
    setLoading(true)
    setError("")
    setResponse("")

    try {
      console.log("Sending test message:", message)

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: message }],
          agent: "deepparallel",
        }),
      })

      console.log("Response status:", res.status)

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`API Error: ${res.status} - ${errorText}`)
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n").filter(line => line.trim())

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content
              if (content) {
                accumulated += content
                setResponse(accumulated)
              }
            } catch (e) {
              console.error("Parse error:", e)
            }
          }
        }
      }

      console.log("Final response:", accumulated)
    } catch (err) {
      console.error("Chat error:", err)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Chat API Test</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border rounded-lg bg-muted"
              placeholder="Type your message..."
            />
          </div>

          <Button
            onClick={testChat}
            disabled={loading || !message}
            className="w-full"
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <h3 className="font-bold text-red-500">Error</h3>
            <pre className="text-sm mt-2 text-red-400">{error}</pre>
          </div>
        )}

        {response && (
          <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg">
            <h3 className="font-bold text-green-500">Response</h3>
            <div className="mt-2 whitespace-pre-wrap">{response}</div>
          </div>
        )}
      </div>
    </div>
  )
}
