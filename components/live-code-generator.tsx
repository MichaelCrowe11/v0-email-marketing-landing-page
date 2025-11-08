"use client"

import { useEffect, useState } from "react"

interface CodeBlock {
  id: string
  title: string
  code: string
  status: "pending" | "generating" | "complete"
  progress: number
}

export function LiveCodeGenerator() {
  const [blocks, setBlocks] = useState<CodeBlock[]>([
    {
      id: "1",
      title: "Hero Component Structure",
      code: `export function Hero() {\n  return (\n    <section className="hero">\n      <h1>Your Mycology AI Partner</h1>\n    </section>\n  )\n}`,
      status: "pending",
      progress: 0,
    },
    {
      id: "2",
      title: "AI Processing Pipeline",
      code: `const pipeline = {\n  dnaAnalysis: await analyzeDNA(),\n  speciesMatch: await matchSpecies(),\n  confidence: 98.47\n}`,
      status: "pending",
      progress: 0,
    },
    {
      id: "3",
      title: "Neural Network Integration",
      code: `const model = await tf.loadModel({\n  species: 10847,\n  accuracy: 0.9847\n})`,
      status: "pending",
      progress: 0,
    },
    {
      id: "4",
      title: "Real-time Data Sync",
      code: `useEffect(() => {\n  const sync = subscribeToUpdates()\n  return () => sync.unsubscribe()\n}, [])`,
      status: "pending",
      progress: 0,
    },
  ])

  useEffect(() => {
    let currentBlock = 0
    const interval = setInterval(() => {
      setBlocks((prev) => {
        const updated = [...prev]
        if (currentBlock < updated.length) {
          if (updated[currentBlock].status === "pending") {
            updated[currentBlock].status = "generating"
          } else if (updated[currentBlock].status === "generating") {
            updated[currentBlock].progress += 10
            if (updated[currentBlock].progress >= 100) {
              updated[currentBlock].status = "complete"
              currentBlock++
            }
          }
        } else {
          // Reset after all complete
          setTimeout(() => {
            currentBlock = 0
            updated.forEach((block) => {
              block.status = "pending"
              block.progress = 0
            })
          }, 2000)
        }
        return updated
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
        <h3 className="text-lg font-bold text-foreground">Crowe Logic Generating Code...</h3>
      </div>
      <div className="grid gap-3">
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`relative overflow-hidden rounded-lg border-2 transition-all duration-500 ${
              block.status === "complete"
                ? "border-green-500/60 bg-green-500/10"
                : block.status === "generating"
                  ? "border-accent/60 bg-accent/10"
                  : "border-foreground/20 bg-background/50"
            }`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">{block.title}</span>
                <span className="text-xs font-mono text-foreground/70">
                  {block.status === "complete"
                    ? "✓ Complete"
                    : block.status === "generating"
                      ? "⚡ Generating..."
                      : "⏳ Pending"}
                </span>
              </div>
              <pre className="text-xs font-mono text-foreground/80 overflow-x-auto">
                <code>{block.code}</code>
              </pre>
              {block.status === "generating" && (
                <div className="mt-3 h-1 bg-foreground/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-200"
                    style={{ width: `${block.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
