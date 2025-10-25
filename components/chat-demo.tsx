"use client"

import { useState } from "react"
import { AIAvatarSwirl } from "@/components/chat/ai-avatar-swirl"
import Link from "next/link"

const SAMPLE_CONVERSATIONS = [
  {
    id: 1,
    query: "How do I identify contamination in my grow?",
    response:
      "I'll help you identify contamination. Look for these key signs:\n\n1. **Green/Blue Mold** - Trichoderma appears as green patches\n2. **Black Spots** - Aspergillus shows as black dots\n3. **Sour Smell** - Bacterial contamination has distinct odor\n4. **Unusual Colors** - Pink, orange, or yellow growth\n\nFor detailed contamination guides and prevention strategies, upgrade to Pro access.",
  },
  {
    id: 2,
    query: "What are optimal conditions for lion's mane?",
    response:
      "Lion's Mane (Hericium erinaceus) thrives in these conditions:\n\n**Temperature:** 65-75°F (18-24°C)\n**Humidity:** 85-95% RH\n**Fresh Air Exchange:** High (5-8 exchanges/hour)\n**Light:** Indirect, 500-1000 lux\n**CO2:** <1000 ppm\n\nPro members get access to strain-specific cultivation protocols and real-time environment monitoring.",
  },
  {
    id: 3,
    query: "How can I increase my yields by 40%?",
    response:
      "Here are proven strategies to boost yields:\n\n1. **Optimize Substrate** - Use supplemented hardwood (5-10% bran)\n2. **Perfect Colonization** - Full colonization before fruiting\n3. **Environment Control** - Maintain precise humidity/temp\n4. **Multiple Flushes** - Proper rehydration between flushes\n5. **Genetics** - Select high-yielding strains\n\nExpert tier includes advanced yield optimization tools and commercial scaling strategies.",
  },
]

export function ChatDemo() {
  const [selectedQuery, setSelectedQuery] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleQuerySelect = (index: number) => {
    if (index === selectedQuery) return
    setIsAnimating(true)
    setTimeout(() => {
      setSelectedQuery(index)
      setIsAnimating(false)
    }, 300)
  }

  const currentConversation = SAMPLE_CONVERSATIONS[selectedQuery]

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-foreground mb-2">Try CROWELOGIC AI</h3>
        <p className="text-muted-foreground">See how our AI assistant helps with cultivation questions</p>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-6">
        {SAMPLE_CONVERSATIONS.map((conv, index) => (
          <button
            key={conv.id}
            onClick={() => handleQuerySelect(index)}
            className={`p-4 rounded-xl text-left text-sm transition-all ${
              selectedQuery === index
                ? "bg-accent text-accent-foreground shadow-lg scale-105"
                : "bg-card border border-border hover:border-accent/50 hover:shadow-md"
            }`}
          >
            {conv.query}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-sm font-medium text-foreground">CROWELOGIC AI Chat</span>
            <span className="ml-auto text-xs text-muted-foreground">Read-only Demo</span>
          </div>
        </div>

        <div className="p-6 space-y-6 min-h-[400px]">
          <div className={`flex gap-4 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                You
              </div>
            </div>
            <div className="flex-1">
              <div className="rounded-2xl px-5 py-4 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200/50 dark:border-amber-800/50 shadow-sm">
                <p className="text-sm text-foreground leading-relaxed">{currentConversation.query}</p>
              </div>
            </div>
          </div>

          <div className={`flex gap-4 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
            <div className="flex-shrink-0">
              <AIAvatarSwirl state="idle" size={40} />
            </div>
            <div className="flex-1">
              <div className="rounded-2xl px-5 py-4 bg-card border border-border shadow-sm">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {currentConversation.response}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Want to ask your own questions?</p>
            <Link
              href="/auth/sign-up"
              className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium shadow-sm"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
