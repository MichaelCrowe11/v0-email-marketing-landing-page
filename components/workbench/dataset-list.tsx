"use client"

import { useState } from "react"
import { Database, Search, Filter, SortAsc, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dataset } from "@/lib/types/workbench"
import { DataPreview } from "./data-preview"

interface DatasetListProps {
  datasets: Dataset[]
  onDelete?: (id: string) => void
}

export function DatasetList({ datasets, onDelete }: DatasetListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date')

  const filteredDatasets = datasets
    .filter(dataset =>
      dataset.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
          return new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime()
        case 'size':
          return b.size - a.size
        default:
          return 0
      }
    })

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getFormatColor = (format: Dataset['format']) => {
    const colors = {
      csv: 'text-green-400',
      json: 'text-blue-400',
      fasta: 'text-purple-400',
      genbank: 'text-pink-400',
      excel: 'text-emerald-400',
    }
    return colors[format]
  }

  if (selectedDataset) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setSelectedDataset(null)}
          className="mb-4"
        >
          ← Back to Datasets
        </Button>
        <DataPreview
          dataset={selectedDataset}
          onDelete={() => {
            onDelete?.(selectedDataset.id)
            setSelectedDataset(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="size">Sort by Size</option>
        </select>
      </div>

      {/* Dataset Grid */}
      {filteredDatasets.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery ? 'No datasets found' : 'No datasets uploaded yet'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDatasets.map((dataset) => (
            <div
              key={dataset.id}
              className="glass-card rounded-xl p-4 border border-border hover:border-accent/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <Database className={`w-8 h-8 ${getFormatColor(dataset.format)}`} />
                <span className="text-xs font-medium text-muted-foreground uppercase">
                  {dataset.format}
                </span>
              </div>

              <h4 className="font-semibold text-foreground mb-1 truncate">
                {dataset.name}
              </h4>

              <div className="space-y-1 text-xs text-muted-foreground mb-4">
                <p>{formatFileSize(dataset.size)}</p>
                <p>{dataset.records.length} records</p>
                <p>Uploaded {formatDate(dataset.uploaded)}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDataset(dataset)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete?.(dataset.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
