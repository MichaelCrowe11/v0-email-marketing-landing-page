"use client"

/**
 * Export Reports Component
 *
 * Allows admins to export cost data for external analysis
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, FileText, FileJson } from "lucide-react"

export default function ExportReports() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 30)
    return date.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })
  const [exporting, setExporting] = useState(false)

  const handleExport = async (format: 'csv' | 'json') => {
    setExporting(true)
    try {
      const url = `/api/admin/cost-dashboard/export?startDate=${startDate}&endDate=${endDate}&format=${format}`
      const response = await fetch(url)

      if (!response.ok) throw new Error('Export failed')

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `clai-cost-report-${startDate}-to-${endDate}.${format}`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export report. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selection */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Export Buttons */}
      <div className="grid gap-4 md:grid-cols-2">
        <Button
          onClick={() => handleExport('csv')}
          disabled={exporting}
          className="w-full"
          variant="outline"
        >
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </Button>
        <Button
          onClick={() => handleExport('json')}
          disabled={exporting}
          className="w-full"
          variant="outline"
        >
          <FileJson className="mr-2 h-4 w-4" />
          Export as JSON
        </Button>
      </div>

      {/* Report Description */}
      <div className="p-4 border rounded-lg bg-muted/50">
        <h3 className="font-semibold mb-2">Report Contents</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Module-level cost breakdown</li>
          <li>• Per-researcher usage and costs</li>
          <li>• Token consumption metrics</li>
          <li>• Model usage distribution</li>
          <li>• Average cost per request</li>
          <li>• Time period: {startDate} to {endDate}</li>
        </ul>
      </div>

      {/* Quick Date Presets */}
      <div className="space-y-2">
        <Label>Quick Date Ranges</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const end = new Date()
              const start = new Date()
              start.setDate(start.getDate() - 7)
              setStartDate(start.toISOString().split('T')[0])
              setEndDate(end.toISOString().split('T')[0])
            }}
          >
            Last 7 Days
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const end = new Date()
              const start = new Date()
              start.setDate(start.getDate() - 30)
              setStartDate(start.toISOString().split('T')[0])
              setEndDate(end.toISOString().split('T')[0])
            }}
          >
            Last 30 Days
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const end = new Date()
              const start = new Date()
              start.setDate(start.getDate() - 90)
              setStartDate(start.toISOString().split('T')[0])
              setEndDate(end.toISOString().split('T')[0])
            }}
          >
            Last 90 Days
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const end = new Date()
              const start = new Date(end.getFullYear(), end.getMonth(), 1)
              setStartDate(start.toISOString().split('T')[0])
              setEndDate(end.toISOString().split('T')[0])
            }}
          >
            This Month
          </Button>
        </div>
      </div>

      {/* Usage Notes */}
      <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
        <h4 className="font-semibold text-sm mb-2">Usage Notes</h4>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>
            • <strong>CSV format:</strong> Best for Excel, Google Sheets, or financial
            systems
          </li>
          <li>
            • <strong>JSON format:</strong> Best for programmatic analysis or data
            pipelines
          </li>
          <li>• Reports include all billable AI operations in the selected date range</li>
          <li>• Costs are in USD and match actual API provider charges (plus 25% markup)</li>
        </ul>
      </div>
    </div>
  )
}
