"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, FileText, Microscope, BookOpen, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SearchResult {
  id: string
  title: string
  description: string
  type: "doc" | "species" | "sop" | "forum"
  url: string
  relevance: number
}

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (query) {
      // Simulate search - in production this would call a real search API
      setTimeout(() => {
        const mockResults: SearchResult[] = [
          {
            id: "1",
            title: "Contamination Identification Guide",
            description: "Complete guide to identifying and treating common mushroom cultivation contaminations",
            type: "doc",
            url: "/docs/contamination-guide",
            relevance: 95,
          },
          {
            id: "2",
            title: "Pleurotus ostreatus (Oyster Mushroom)",
            description: "Species profile, cultivation parameters, and growth characteristics",
            type: "species",
            url: "/species/pleurotus-ostreatus",
            relevance: 88,
          },
          {
            id: "3",
            title: "Substrate Sterilization SOP",
            description: "Standard operating procedure for pressure cooking and sterilizing substrates",
            type: "sop",
            url: "/sops/substrate-sterilization",
            relevance: 82,
          },
        ]
        setResults(mockResults)
        setLoading(false)
      }, 500)
    }
  }, [query])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "doc":
        return <FileText className="w-4 h-4" />
      case "species":
        return <Microscope className="w-4 h-4" />
      case "sop":
        return <BookOpen className="w-4 h-4" />
      case "forum":
        return <MessageSquare className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      doc: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      species: "bg-green-500/10 text-green-600 border-green-500/20",
      sop: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      forum: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    }
    return colors[type as keyof typeof colors] || colors.doc
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Search Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Search className="w-8 h-8" />
            <h1 className="text-3xl font-black">Search Results</h1>
          </div>
          <p className="text-muted-foreground">
            Found {results.length} results for <span className="font-semibold text-foreground">"{query}"</span>
          </p>
        </div>

        {/* Results */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass-card animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full mt-2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result) => (
              <a key={result.id} href={result.url} className="block group">
                <Card className="glass-card hover:shadow-glass-strong transition-all hover:-translate-y-0.5">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getTypeBadge(result.type)}>
                            {getTypeIcon(result.type)}
                            <span className="ml-1 capitalize">{result.type}</span>
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {result.relevance}% match
                          </Badge>
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors">{result.title}</CardTitle>
                        <CardDescription>{result.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </a>
            ))}
          </div>
        ) : (
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="w-12 h-12 mb-4 text-muted-foreground" />
              <p className="text-lg font-semibold mb-2">No results found</p>
              <p className="text-muted-foreground">Try adjusting your search terms</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
