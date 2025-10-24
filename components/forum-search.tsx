"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Sparkles, X } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ForumSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [showAISuggestion, setShowAISuggestion] = useState(false)

  useEffect(() => {
    // Show AI suggestion for common questions
    const commonQuestions = ["contamination", "temperature", "humidity", "substrate", "sterilization"]
    const hasCommonQuestion = commonQuestions.some((q) => query.toLowerCase().includes(q))
    setShowAISuggestion(hasCommonQuestion && query.length > 3)
  }, [query])

  const handleAISearch = () => {
    // Navigate to forum with AI assistance
    router.push(`/forum/new?ai-assist=true&query=${encodeURIComponent(query)}`)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search discussions, topics, or species..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 bg-card/50 backdrop-blur-sm border-border/50"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setQuery("")}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {showAISuggestion && (
        <Card className="absolute top-full mt-2 w-full z-50 bg-gradient-to-br from-purple-950/90 to-pink-950/70 border-purple-500/30 backdrop-blur-lg">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-200 mb-1">Get instant AI assistance</p>
                <p className="text-xs text-muted-foreground mb-3">
                  CroweLogic AI can provide expert guidance based on Michael Crowe's 20+ years of cultivation experience
                </p>
                <Button
                  size="sm"
                  onClick={handleAISearch}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ask AI Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
