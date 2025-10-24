import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search, BookOpen, TrendingUp, Clock, Eye } from "lucide-react"

export default function KnowledgeBasePage() {
  const categories = [
    {
      id: "species-cultivation",
      name: "Species Cultivation",
      icon: "🍄",
      description: "Complete guides for growing specific mushroom species",
      articleCount: 12,
      color: "from-green-500/10 to-emerald-500/10 border-green-500/20",
    },
    {
      id: "substrate-preparation",
      name: "Substrate Preparation",
      icon: "🌾",
      description: "Substrate recipes, formulations, and techniques",
      articleCount: 8,
      color: "from-amber-500/10 to-yellow-500/10 border-amber-500/20",
    },
    {
      id: "contamination-management",
      name: "Contamination Management",
      icon: "🔬",
      description: "Identification, prevention, and treatment",
      articleCount: 15,
      color: "from-red-500/10 to-rose-500/10 border-red-500/20",
    },
    {
      id: "environmental-control",
      name: "Environmental Control",
      icon: "🌡️",
      description: "Temperature, humidity, and air management",
      articleCount: 10,
      color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
    },
    {
      id: "business-operations",
      name: "Business Operations",
      icon: "💼",
      description: "Commercial cultivation and scaling strategies",
      articleCount: 7,
      color: "from-purple-500/10 to-violet-500/10 border-purple-500/20",
    },
    {
      id: "equipment-setup",
      name: "Equipment & Setup",
      icon: "🏭",
      description: "Grow room design and equipment selection",
      articleCount: 9,
      color: "from-gray-500/10 to-slate-500/10 border-gray-500/20",
    },
  ]

  const featuredArticles = [
    {
      title: "Complete Guide to Growing Oyster Mushrooms",
      category: "Species Cultivation",
      difficulty: "Beginner",
      views: 2847,
      readTime: "12 min",
      slug: "complete-guide-oyster-mushrooms",
    },
    {
      title: "Identifying and Treating Green Mold (Trichoderma)",
      category: "Contamination Management",
      difficulty: "Intermediate",
      views: 1923,
      readTime: "8 min",
      slug: "identifying-treating-trichoderma",
    },
    {
      title: "Scaling from Home Grow to Commercial Operation",
      category: "Business Operations",
      difficulty: "Advanced",
      views: 1654,
      readTime: "15 min",
      slug: "scaling-home-to-commercial",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">Knowledge Base</h1>
          <p className="text-foreground/70 text-lg max-w-3xl">
            Comprehensive cultivation guides, SOPs, and expert knowledge from 20+ years of professional mushroom farming
            experience.
          </p>
        </div>

        {/* Search */}
        <Card className="bg-card border-border/50 mb-12">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <Input
                type="search"
                placeholder="Search articles, guides, and SOPs..."
                className="pl-10 h-12 bg-background border-border/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Total Articles</p>
                  <p className="text-3xl font-bold text-foreground">61</p>
                </div>
                <BookOpen className="w-10 h-10 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Total Views</p>
                  <p className="text-3xl font-bold text-foreground">24.5K</p>
                </div>
                <Eye className="w-10 h-10 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Updated Weekly</p>
                  <p className="text-3xl font-bold text-foreground">New</p>
                </div>
                <TrendingUp className="w-10 h-10 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/knowledge-base/${category.id}`}>
                <Card
                  className={`bg-gradient-to-br ${category.color} hover:scale-105 transition-transform duration-200 cursor-pointer h-full`}
                >
                  <CardHeader>
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <CardTitle className="text-xl text-foreground">{category.name}</CardTitle>
                    <CardDescription className="text-foreground/60">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <BookOpen className="w-4 h-4" />
                      <span>{category.articleCount} articles</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-8">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <Link key={article.slug} href={`/knowledge-base/article/${article.slug}`}>
                <Card className="bg-card border-border/50 hover:border-accent/50 transition-all duration-200 h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          article.difficulty === "Beginner"
                            ? "border-green-500/50 text-green-500"
                            : article.difficulty === "Intermediate"
                              ? "border-yellow-500/50 text-yellow-500"
                              : "border-red-500/50 text-red-500"
                        }`}
                      >
                        {article.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-foreground leading-tight">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-foreground/60">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{article.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30 mt-16">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-3">Can't Find What You're Looking For?</h3>
            <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
              Ask our AI assistant powered by this knowledge base, or submit a request for new content.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild className="bg-foreground text-background hover:bg-foreground/90">
                <Link href="/chat">Ask AI Assistant</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/forum">Join Community Forum</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
