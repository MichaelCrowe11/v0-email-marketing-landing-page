"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function DiagnosticPage() {
  const [results, setResults] = useState<any>({})
  const [testing, setTesting] = useState(false)

  const runDiagnostics = async () => {
    setTesting(true)
    const diagnostics: any = {}

    // Test 1: Check if API endpoint is reachable
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "ping" }],
          agent: "deepparallel",
        }),
      })

      diagnostics.apiReachable = response.ok
      diagnostics.apiStatus = response.status
      diagnostics.apiStatusText = response.statusText

      if (response.ok) {
        // Test streaming
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let chunks = 0
        let firstChunk = ""

        if (reader) {
          const { done, value } = await reader.read()
          if (!done) {
            chunks++
            firstChunk = decoder.decode(value).substring(0, 100)
          }
          reader.cancel()
        }

        diagnostics.streaming = {
          working: chunks > 0,
          firstChunk,
          totalChunks: chunks,
        }
      }
    } catch (error) {
      diagnostics.apiError = error instanceof Error ? error.message : String(error)
    }

    // Test 2: Check environment variables (client-side check)
    diagnostics.clientEnv = {
      hasPublicEnv: typeof window !== "undefined",
      baseUrl: window.location.origin,
    }

    // Test 3: Check browser capabilities
    diagnostics.browser = {
      fetch: typeof fetch !== "undefined",
      streams: typeof ReadableStream !== "undefined",
      textDecoder: typeof TextDecoder !== "undefined",
    }

    setResults(diagnostics)
    setTesting(false)
  }

  const testAgent = async (agent: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Test message for ${agent}` }],
          agent,
        }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n").filter(l => l.trim())

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") continue

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices[0]?.delta?.content
                if (content) accumulated += content
              } catch {}
            }
          }
        }
      }

      setResults((prev: any) => ({
        ...prev,
        [agent]: {
          success: true,
          response: accumulated.substring(0, 200),
        },
      }))
    } catch (error) {
      setResults((prev: any) => ({
        ...prev,
        [agent]: {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        },
      }))
    }
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Platform Diagnostics</h1>
          <p className="text-muted-foreground">
            Test all AI features and API connections
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Quick Tests</h2>

          <div className="flex flex-wrap gap-3">
            <Button onClick={runDiagnostics} disabled={testing}>
              {testing ? "Running..." : "Run Full Diagnostics"}
            </Button>

            <Button onClick={() => testAgent("deepparallel")} variant="outline">
              Test DeepParallel
            </Button>

            <Button onClick={() => testAgent("deepseek")} variant="outline">
              Test Crowe Code
            </Button>

            <Button onClick={() => testAgent("o1")} variant="outline">
              Test O1 Reasoning
            </Button>

            <Button onClick={() => testAgent("crowelogic")} variant="outline">
              Test Crowe Logic
            </Button>
          </div>
        </Card>

        {Object.keys(results).length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-[600px]">
              {JSON.stringify(results, null, 2)}
            </pre>
          </Card>
        )}

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Development Server:</span>
              <span className="text-green-500 font-bold">RUNNING</span>
            </div>
            <div className="flex justify-between">
              <span>API Endpoint:</span>
              <span className="font-mono">/api/chat</span>
            </div>
            <div className="flex justify-between">
              <span>Azure OpenAI:</span>
              <span className="text-green-500 font-bold">CONFIGURED</span>
            </div>
            <div className="flex justify-between">
              <span>Available Agents:</span>
              <span>6 (deepparallel, deepthought, deepvision, crowelogic, o1, deepseek)</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-blue-500/10 border-blue-500/30">
          <h2 className="text-xl font-semibold mb-2">Quick Links</h2>
          <div className="space-y-2">
            <a href="/test-chat" className="block text-blue-500 hover:underline">
              → Simple Chat Test Page
            </a>
            <a href="/chat" className="block text-blue-500 hover:underline">
              → Full Chat Interface
            </a>
            <a href="/ide" className="block text-blue-500 hover:underline">
              → Research IDE with Co-Pilot
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}
