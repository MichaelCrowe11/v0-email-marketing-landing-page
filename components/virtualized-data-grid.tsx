"use client"

import { memo, useState, useMemo, useCallback } from "react"
import { FixedSizeList as List } from "react-window"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, Eye } from "lucide-react"

interface DataRecord {
  id: string
  name: string
  type: 'genome' | 'species' | 'chemical' | 'cultivation'
  size: number
  records: number
  confidence: number
  status: 'processed' | 'processing' | 'pending'
  lastModified: Date
}

interface VirtualizedDataGridProps {
  data: DataRecord[]
  onViewRecord: (record: DataRecord) => void
  onDownload: (record: DataRecord) => void
  height?: number
}

const ROW_HEIGHT = 80

const DataRow = memo(function DataRow({ index, style, data }: any) {
  const { records, onViewRecord, onDownload } = data
  const record = records[index]

  const typeColors = {
    genome: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    species: "bg-green-500/10 text-green-400 border-green-500/20",
    chemical: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    cultivation: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  }

  const statusColors = {
    processed: "bg-green-500/10 text-green-500",
    processing: "bg-yellow-500/10 text-yellow-500",
    pending: "bg-gray-500/10 text-gray-500",
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div style={style} className="px-4 py-2">
      <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-4 hover:border-primary/30 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-medium truncate">{record.name}</h4>
              <Badge className={typeColors[record.type]}>{record.type}</Badge>
              <Badge className={statusColors[record.status]}>{record.status}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{formatSize(record.size)}</span>
              <span>{record.records.toLocaleString()} records</span>
              <span>{record.confidence}% confidence</span>
              <span>{record.lastModified.toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewRecord(record)}
              className="h-8 w-8 p-0"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDownload(record)}
              className="h-8 w-8 p-0"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
})

export const VirtualizedDataGrid = memo(function VirtualizedDataGrid({
  data,
  onViewRecord,
  onDownload,
  height = 600,
}: VirtualizedDataGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<keyof DataRecord>("lastModified")

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((record) => {
      const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterType === "all" || record.type === filterType
      return matchesSearch && matchesFilter
    })

    return filtered.sort((a, b) => {
      if (sortBy === "lastModified") {
        return b.lastModified.getTime() - a.lastModified.getTime()
      }
      if (sortBy === "confidence") {
        return b.confidence - a.confidence
      }
      if (sortBy === "records") {
        return b.records - a.records
      }
      return a.name.localeCompare(b.name)
    })
  }, [data, searchTerm, filterType, sortBy])

  const listData = useMemo(
    () => ({
      records: filteredAndSortedData,
      onViewRecord,
      onDownload,
    }),
    [filteredAndSortedData, onViewRecord, onDownload]
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Dataset Analysis Results</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search datasets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-md text-sm"
            >
              <option value="all">All Types</option>
              <option value="genome">Genome</option>
              <option value="species">Species</option>
              <option value="chemical">Chemical</option>
              <option value="cultivation">Cultivation</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as keyof DataRecord)}
              className="px-3 py-2 bg-background border border-border rounded-md text-sm"
            >
              <option value="lastModified">Last Modified</option>
              <option value="confidence">Confidence</option>
              <option value="records">Record Count</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border border-border/50 rounded-lg overflow-hidden">
          <List
            height={height}
            itemCount={filteredAndSortedData.length}
            itemSize={ROW_HEIGHT}
            itemData={listData}
            className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-background"
          >
            {DataRow}
          </List>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredAndSortedData.length} of {data.length} datasets
        </div>
      </CardContent>
    </Card>
  )
})

VirtualizedDataGrid.displayName = "VirtualizedDataGrid"