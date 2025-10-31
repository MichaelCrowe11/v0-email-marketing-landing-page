"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Download, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dataset } from "@/lib/types/workbench"

interface DataPreviewProps {
  dataset: Dataset
  onDelete?: () => void
}

export function DataPreview({ dataset, onDelete }: DataPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [showFullView, setShowFullView] = useState(false)
  const recordsPerPage = 10

  const totalPages = Math.ceil(dataset.records.length / recordsPerPage)
  const startIndex = currentPage * recordsPerPage
  const endIndex = Math.min(startIndex + recordsPerPage, dataset.records.length)
  const currentRecords = dataset.records.slice(startIndex, endIndex)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFormatBadge = (format: Dataset['format']) => {
    const colors = {
      csv: 'bg-green-500/10 text-green-400 border-green-500/30',
      json: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      fasta: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      genbank: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
      excel: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    }

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${colors[format]}`}>
        {format.toUpperCase()}
      </span>
    )
  }

  const renderTableView = () => {
    if (currentRecords.length === 0) return null

    // Get all unique keys from records
    const allKeys = Array.from(
      new Set(currentRecords.flatMap(record => Object.keys(record.data)))
    )

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 text-muted-foreground font-medium">#</th>
              {allKeys.map(key => (
                <th key={key} className="text-left p-3 text-muted-foreground font-medium">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((record, index) => (
              <tr key={record.id} className="border-b border-border/50 hover:bg-accent/5">
                <td className="p-3 text-muted-foreground">
                  {startIndex + index + 1}
                </td>
                {allKeys.map(key => (
                  <td key={key} className="p-3 text-foreground">
                    {typeof record.data[key] === 'string' && record.data[key].length > 50
                      ? `${record.data[key].substring(0, 50)}...`
                      : String(record.data[key] ?? '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderSequenceView = () => {
    return (
      <div className="space-y-4">
        {currentRecords.map((record, index) => (
          <div key={record.id} className="p-4 glass-card rounded-lg border border-border">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {record.data.header || `Sequence ${startIndex + index + 1}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Length: {record.data.length || record.data.sequence?.length || 0} bp
                </p>
              </div>
            </div>
            <div className="mt-2 p-3 bg-muted/30 rounded font-mono text-xs text-foreground overflow-x-auto">
              {record.data.sequence?.substring(0, 200) || 'No sequence data'}
              {record.data.sequence?.length > 200 && '...'}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {dataset.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{formatFileSize(dataset.size)}</span>
              <span>•</span>
              <span>{dataset.records.length} records</span>
              <span>•</span>
              <span>Uploaded {formatDate(dataset.uploaded)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getFormatBadge(dataset.format)}
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            {onDelete && (
              <Button variant="outline" size="sm" onClick={onDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Metadata */}
        {dataset.metadata && Object.keys(dataset.metadata).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(dataset.metadata).map(([key, value]) => (
              <div key={key} className="px-3 py-1 bg-muted/50 rounded text-xs">
                <span className="text-muted-foreground">{key}:</span>{' '}
                <span className="text-foreground font-medium">{String(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data View */}
      <div className="p-6">
        {dataset.format === 'fasta' || dataset.format === 'genbank'
          ? renderSequenceView()
          : renderTableView()}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{endIndex} of {dataset.records.length} records
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
