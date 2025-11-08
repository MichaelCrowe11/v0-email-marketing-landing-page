"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Database,
  Download,
  TrendingUp,
  Calendar,
  FileText,
  BarChart3,
  Filter,
  Lock,
  Unlock,
  Star,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const categories = [
  { id: "all", label: "All Datasets", count: 847 },
  { id: "cultivation", label: "Cultivation Data", count: 342 },
  { id: "genomic", label: "Genomic Sequences", count: 156 },
  { id: "environmental", label: "Environmental", count: 198 },
  { id: "microscopy", label: "Microscopy Images", count: 89 },
  { id: "chemical", label: "Chemical Analysis", count: 62 },
]

const datasets = [
  {
    id: "psilocybin-cultivation-master",
    name: "Psilocybin Cultivation Master Dataset",
    description:
      "Comprehensive 18-year dataset covering 2,341 cultivation cycles with environmental parameters, yield data, contamination events, and quality metrics",
    category: "cultivation",
    size: "847 GB",
    records: "2.3M+ records",
    updated: "2025-01-15",
    license: "Commercial",
    access: "Premium",
    featured: true,
    downloads: 423,
    rating: 4.9,
    tags: ["Time Series", "Environmental", "Yield", "Quality Control"],
    includes: ["Temperature logs", "Humidity data", "CO2 levels", "Yield metrics", "Contamination events", "Photos"],
  },
  {
    id: "contamination-image-library",
    name: "Contamination Image Library",
    description:
      "Annotated microscopy and macroscopic images of contamination types with species identification and severity classifications",
    category: "microscopy",
    size: "124 GB",
    records: "89,432 images",
    updated: "2025-01-10",
    license: "Research",
    access: "Free",
    featured: true,
    downloads: 1247,
    rating: 4.8,
    tags: ["Computer Vision", "Classification", "Microscopy"],
    includes: ["Labeled images", "Annotations", "Metadata", "Species IDs"],
  },
  {
    id: "substrate-formulation-experiments",
    name: "Substrate Formulation Experiments",
    description:
      "Multi-year dataset of substrate composition experiments with biological efficiency outcomes across 156 different strains",
    category: "cultivation",
    size: "42 GB",
    records: "15,678 experiments",
    updated: "2024-12-28",
    license: "Open Data",
    access: "Free",
    featured: false,
    downloads: 892,
    rating: 4.7,
    tags: ["Experimental", "Substrates", "Yield Optimization"],
    includes: ["Formulations", "BE data", "Strain info", "Statistical analysis"],
  },
  {
    id: "fungal-genomic-sequences",
    name: "Fungal Genomic Sequences",
    description: "Sequenced genomes of 156 psilocybin-producing strains with annotated genes and metabolic pathways",
    category: "genomic",
    size: "389 GB",
    records: "156 genomes",
    updated: "2024-11-15",
    license: "Research",
    access: "Premium",
    featured: true,
    downloads: 234,
    rating: 4.9,
    tags: ["Genomics", "Sequencing", "Bioinformatics"],
    includes: ["Raw sequences", "Annotations", "Phylogenetic trees", "Gene maps"],
  },
  {
    id: "environmental-monitoring-timeseries",
    name: "Environmental Monitoring Time Series",
    description: "Real-time sensor data from commercial facilities across 7 continents over 5 years of operations",
    category: "environmental",
    size: "1.2 TB",
    records: "500M+ readings",
    updated: "2025-01-18",
    license: "Commercial",
    access: "Enterprise",
    featured: false,
    downloads: 156,
    rating: 4.6,
    tags: ["IoT", "Time Series", "Monitoring"],
    includes: ["Sensor data", "Alerts", "Anomaly flags", "Location data"],
  },
]

export default function DatasetsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")

  const filteredDatasets = datasets
    .filter((dataset) => {
      const matchesSearch =
        dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "all" || dataset.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "featured") return b.featured ? 1 : -1
      if (sortBy === "downloads") return b.downloads - a.downloads
      if (sortBy === "size") return Number.parseFloat(b.size) - Number.parseFloat(a.size)
      return 0
    })

  return (
    <div className="min-h-screen bg-background pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Research Datasets</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Production-grade datasets from 18 years of commercial operations. Real-world data for training, validation,
            and research.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="enterprise-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">Total Datasets</span>
            </div>
            <div className="text-2xl font-bold text-foreground">847</div>
          </div>
          <div className="enterprise-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">Total Records</span>
            </div>
            <div className="text-2xl font-bold text-foreground">2.3M+</div>
          </div>
          <div className="enterprise-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Download className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">Downloads</span>
            </div>
            <div className="text-2xl font-bold text-foreground">12,544</div>
          </div>
          <div className="enterprise-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">Data Quality</span>
            </div>
            <div className="text-2xl font-bold text-foreground">99.2%</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search datasets, tags, categories..."
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
              <SelectItem value="size">Largest Size</SelectItem>
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

          {/* Dataset Grid */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {filteredDatasets.map((dataset) => (
                <div key={dataset.id} className="enterprise-card p-6 hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{dataset.name}</h3>
                        {dataset.featured && (
                          <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{dataset.description}</p>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Database className="w-4 h-4" />
                          {dataset.size}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {dataset.records}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Updated {new Date(dataset.updated).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {dataset.downloads} downloads
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {dataset.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Includes */}
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-2">Includes:</div>
                        <div className="flex flex-wrap gap-2">
                          {dataset.includes.map((item) => (
                            <span key={item} className="text-xs text-foreground">
                              • {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4">
                      <Badge
                        className={`${
                          dataset.access === "Free"
                            ? "bg-secondary/20 text-secondary border-secondary/30"
                            : dataset.access === "Premium"
                              ? "bg-primary/20 text-primary border-primary/30"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {dataset.access === "Free" ? (
                          <Unlock className="w-3 h-3 mr-1" />
                        ) : (
                          <Lock className="w-3 h-3 mr-1" />
                        )}
                        {dataset.access}
                      </Badge>
                      <Badge variant="outline">{dataset.license}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                      <Button size="sm" className="btn-primary">
                        <Download className="w-3 h-3 mr-2" />
                        Access Dataset
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 enterprise-card p-8 md:p-12 text-center bg-gradient-to-br from-primary/5 to-secondary/5">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Need Custom Data Collection?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We can design and execute custom data collection protocols tailored to your research needs.
          </p>
          <Button size="lg" className="btn-primary" asChild>
            <Link href="/consultations">Schedule Consultation</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
