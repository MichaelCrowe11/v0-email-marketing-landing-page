"use client"

import { useState } from "react"
import { FileCode2, Folder, ChevronRight, ChevronDown, File, Trash2, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CodeFile {
  id: string
  name: string
  language: string
  code: string
  size: number
  uploadedAt: Date
}

interface CodeFileBrowserProps {
  onFileSelect?: (file: CodeFile) => void
  onFileDelete?: (fileId: string) => void
  className?: string
}

export function CodeFileBrowser({ onFileSelect, onFileDelete, className }: CodeFileBrowserProps) {
  const [files, setFiles] = useState<CodeFile[]>([])
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  const handleFileClick = (file: CodeFile) => {
    setSelectedFileId(file.id)
    onFileSelect?.(file)
  }

  const handleDownload = (file: CodeFile, e: React.MouseEvent) => {
    e.stopPropagation()

    const blob = new Blob([file.code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDelete = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFiles(prev => prev.filter(f => f.id !== fileId))
    if (selectedFileId === fileId) {
      setSelectedFileId(null)
    }
    onFileDelete?.(fileId)
  }

  const getLanguageIcon = (language: string) => {
    const colors: Record<string, string> = {
      typescript: "text-blue-500",
      javascript: "text-yellow-500",
      python: "text-green-500",
      go: "text-cyan-500",
      rust: "text-orange-500",
      java: "text-red-500",
    }
    return colors[language.toLowerCase()] || "text-gray-500"
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className={cn("border border-border rounded-lg bg-card overflow-hidden", className)}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 border-b border-border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <Folder className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold">Code Files</span>
          <span className="text-xs text-muted-foreground">({files.length})</span>
        </div>
      </div>

      {/* File List */}
      {isExpanded && (
        <div className="max-h-96 overflow-y-auto">
          {files.length === 0 ? (
            <div className="p-8 text-center">
              <FileCode2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No code files uploaded yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload files to analyze, refactor, or debug
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    "flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors group",
                    selectedFileId === file.id && "bg-muted/70",
                  )}
                  onClick={() => handleFileClick(file)}
                >
                  {/* File Icon */}
                  <FileCode2 className={cn("w-4 h-4 flex-shrink-0", getLanguageIcon(file.language))} />

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-muted/50">
                        {file.language}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {file.uploadedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDownload(file, e)}
                      className="h-7 w-7 p-0"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDelete(file.id, e)}
                      className="h-7 w-7 p-0 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
