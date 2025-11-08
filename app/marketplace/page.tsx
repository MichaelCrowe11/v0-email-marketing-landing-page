"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Download, TrendingUp, Shield, ChevronRight, Filter, Sparkles, Activity } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const categories = [
  { id: "all", label: "All Models", count: 150 },
  { id: "drug-discovery", label: "Drug Discovery", count: 42 },
  { id: "agriculture", label: "Agriculture", count: 38 },
  { id: "bioinformatics", label: "Bioinformatics", count: 27 },
  { id: "genomics", label: "Genomics", count: 18 },
  { id: "microscopy", label: "Microscopy", count: 15 },
  { id: "environmental", label: "Environmental", count: 10 },
]

const models = [
  {
    id: "crios-nova",
    name: "CriOS Nova",
    description:
      "Advanced drug discovery agent specialized in psychedelic compound analysis and synthesis pathway optimization",
    category: "drug-discovery",
    version: "2.1.0",
    downloads: 2847,
    rating: 4.9,
    featured: true,
    validated: true,
    price: "Enterprise",
    tags: ["Psilocybin", "Drug Discovery", "Synthesis", "Production"],
    performance: { accuracy: 94, speed: "120ms", tokens: "150K" },
    status: "production",
  },
  {
    id: "substrate-optimizer",
    name: "Substrate Optimizer",
    description:
      "ML model for optimizing growing substrate composition based on species requirements and yield targets",
    category: "agriculture",
    version: "1.8.2",
    downloads: 1523,
    rating: 4.7,
    featured: true,
    validated: true,
    price: "Free",
    tags: ["Cultivation", "Yield", "Substrate", "Optimization"],
    performance: { accuracy: 89, speed: "45ms", tokens: "80K" },
    status: "production",
  },
  {
    id: "contamination-classifier",
    name: "Contamination Classifier",
    description: "Real-time contamination detection and classification trained on 18 years of production data",
    category: "agriculture",
    version: "3.0.1",
    downloads: 3201,
    rating: 4.8,
    featured: true,
    validated: true,
    price: "$299/mo",
    tags: ["Computer Vision", "Classification", "Quality Control"],
    performance: { accuracy: 96, speed: "85ms", tokens: "200K" },
    status: "production",
  },
  {
    id: "yield-predictor",
    name: "Yield Predictor",
    description: "Forecasting model for biological efficiency and harvest timing based on environmental parameters",
    category: "agriculture",
    version: "2.4.0",
    downloads: 1847,
    rating: 4.6,
    featured: false,
    validated: true,
    price: "Free",
    tags: ["Forecasting", "Time Series", "Yield"],
    performance: { accuracy: 87, speed: "30ms", tokens: "60K" },
    status: "production",
  },
  {
    id: "genomic-analyzer",
    name: "Genomic Sequence Analyzer",
    description: "Deep learning model for analyzing fungal genomes and identifying strain characteristics",
    category: "genomics",
    version: "1.5.0",
    downloads: 892,
    rating: 4.5,
    featured: false,
    validated: true,
    price: "$499/mo",
    tags: ["Genomics", "Sequencing", "Analysis"],
    performance: { accuracy: 91, speed: "200ms", tokens: "300K" },
    status: "production",
  },
  {
    id: "microscopy-enhancer",
    name: "Microscopy Image Enhancer",
    description: "AI model for enhancing microscopy images and automated cell counting",
    category: "microscopy",
    version: "2.0.0",
    downloads: 1234,
    rating: 4.7,
    featured: false,
    validated: true,
    price: "$199/mo",
    tags: ["Computer Vision", "Microscopy", "Enhancement"],
    performance: { accuracy: 93, speed: "110ms", tokens: "180K" },
    status: "production",
  },
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")

  const filteredModels = models
    .filter((model) => {
      const matchesSearch =
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "all" || model.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "featured") return b.featured ? 1 : -1
      if (sortBy === "downloads") return b.downloads - a.downloads
      if (sortBy === "rating") return b.rating - a.rating
      return 0
    })

  return (
    <div className="min-h-screen bg-background pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">AI Models Marketplace</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Production-validated AI models trained on 18 years of biological systems data. Deploy specialist agents in
            minutes.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="enterprise-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">Total Models</span>
            </div>
            <div className="text-2xl font-bold text-foreground">150+</div>
          </div>
          <div className="enterprise-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Download className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">Total Downloads</span>
            </div>
            <div className="text-2xl font-bold text-foreground">12,544</div>
          </div>
          <div className="enterprise-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">Production Ready</span>
            </div>
            <div className="text-2xl font-bold text-foreground">100%</div>
          </div>
          <div className="enterprise-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">Avg Accuracy</span>
            </div>
            <div className="text-2xl font-bold text-foreground">92%</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search models, tags, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 h-12">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="downloads">Most Downloads</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="enterprise-card p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Categories</h3>
              </div>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      selectedCategory === cat.id
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{cat.label}</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">{cat.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Model Grid */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-6">
              {filteredModels.map((model) => (
                <div key={model.id} className="enterprise-card p-6 hover:border-primary/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {model.name}
                        </h3>
                        {model.featured && (
                          <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">v{model.version}</p>
                    </div>
                    {model.validated && (
                      <Shield className="w-5 h-5 text-secondary flex-shrink-0" title="Production Validated" />
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{model.description}</p>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
                      <div className="text-sm font-semibold text-foreground">{model.performance.accuracy}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Speed</div>
                      <div className="text-sm font-semibold text-foreground">{model.performance.speed}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Context</div>
                      <div className="text-sm font-semibold text-foreground">{model.performance.tokens}</div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {model.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {model.downloads.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-secondary text-secondary" />
                        {model.rating}
                      </div>
                    </div>
                    <Link href={`/marketplace/${model.id}`}>
                      <Button size="sm" className="btn-primary">
                        View Details
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-6 right-6">
                    <Badge
                      className={`${
                        model.price === "Free"
                          ? "bg-secondary/20 text-secondary border-secondary/30"
                          : "bg-primary/20 text-primary border-primary/30"
                      }`}
                    >
                      {model.price}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {filteredModels.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No models found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 enterprise-card p-8 md:p-12 text-center bg-gradient-to-br from-primary/5 to-secondary/5">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Need a Custom AI Model?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our team can train specialized models on your proprietary data. From hypothesis to production deployment in
            12 weeks.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="btn-primary" asChild>
              <Link href="/consultations">Schedule Consultation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs/custom-models">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
