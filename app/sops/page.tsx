"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, TrendingUp, AlertTriangle, CheckCircle2, Eye, BookOpen, Play } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"

export default function SOPsPage() {
  const [sops, setSops] = useState<any[]>([])
  const [filteredSops, setFilteredSops] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    loadSOPs()
  }, [])

  useEffect(() => {
    filterSOPs()
  }, [searchQuery, selectedCategory, selectedDifficulty, sops])

  async function loadSOPs() {
    try {
      const { data, error } = await supabase
        .from("sops")
        .select("*")
        .order("category", { ascending: true })
        .order("title", { ascending: true })

      if (error) throw error
      setSops(data || [])
      setFilteredSops(data || [])
    } catch (error) {
      console.error("[v0] Error loading SOPs:", error)
    } finally {
      setLoading(false)
    }
  }

  function filterSOPs() {
    let filtered = sops

    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((s) => s.category === selectedCategory)
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((s) => s.difficulty_level === selectedDifficulty)
    }

    setFilteredSops(filtered)
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "intermediate":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "advanced":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "expert":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-accent/10 text-accent border-accent/20"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "fundamentals":
        return BookOpen
      case "substrate":
        return TrendingUp
      case "environment":
        return AlertTriangle
      default:
        return CheckCircle2
    }
  }

  const categories = Array.from(new Set(sops.map((s) => s.category)))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading SOPs library...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-foreground">Professional Cultivation Protocols</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Standard Operating Procedures</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Battle-tested SOPs from Southwest Mushrooms. Proven protocols for sterile technique, substrate prep,
            environmental control, and quality assurance.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-accent/20 bg-gradient-to-br from-card to-accent/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total SOPs</p>
                  <p className="text-3xl font-bold text-foreground">{sops.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/20 bg-gradient-to-br from-card to-green-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Beginner Friendly</p>
                  <p className="text-3xl font-bold text-foreground">
                    {sops.filter((s) => s.difficulty_level === "beginner").length}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-3xl font-bold text-foreground">{categories.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Premium Content</p>
                  <p className="text-3xl font-bold text-foreground">{sops.filter((s) => s.is_premium).length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search SOPs by title, category, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {categories.slice(0, 3).map((cat) => (
                    <TabsTrigger key={cat} value={cat}>
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <Tabs value={selectedDifficulty} onValueChange={setSelectedDifficulty} className="flex-1">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Levels</TabsTrigger>
                  <TabsTrigger value="beginner">Beginner</TabsTrigger>
                  <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* SOPs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSops.map((sop) => {
            const CategoryIcon = getCategoryIcon(sop.category)
            return (
              <Card
                key={sop.id}
                className="border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <CategoryIcon className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge variant="outline" className="mb-2">
                          {sop.category}
                        </Badge>
                      </div>
                    </div>
                    {sop.is_premium && (
                      <Badge className="bg-gradient-to-r from-accent to-purple-500 text-white border-0">Premium</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight">{sop.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getDifficultyColor(sop.difficulty_level)} variant="outline">
                      {sop.difficulty_level}
                    </Badge>
                    {sop.estimated_time && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {sop.estimated_time}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {sop.content.split("\n\n")[1] || sop.content.substring(0, 150)}...
                  </p>

                  {/* Success Metrics */}
                  {sop.success_metrics && (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Success Metrics</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(sop.success_metrics)
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <span key={key} className="text-xs text-muted-foreground">
                              {key}: {String(value)}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* View Stats */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      {sop.view_count || 0} views
                    </div>
                    {sop.video_url && (
                      <Badge variant="outline" className="gap-1">
                        <Play className="w-3 h-3" />
                        Video
                      </Badge>
                    )}
                  </div>

                  <Button variant="outline" className="w-full gap-2 bg-transparent" asChild>
                    <Link href={`/sops/${sop.id}`}>
                      <BookOpen className="w-4 h-4" />
                      View Full SOP
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredSops.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No SOPs found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}

        {/* Bottom CTA */}
        <Card className="border-accent/20 bg-gradient-to-br from-card to-accent/5">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">Need Custom SOPs?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Work with Michael Crowe to develop tailored standard operating procedures for your specific facility,
              species, and production goals.
            </p>
            <Button size="lg" className="gap-2" asChild>
              <a href="mailto:michael@crowelogic.com">Contact for Custom SOPs</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
