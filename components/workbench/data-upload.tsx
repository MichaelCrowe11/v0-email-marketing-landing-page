"use client"

import { useState, useCallback } from "react"
import { Upload, X, FileText, Database, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDataStore } from "@/lib/stores/data-store"

interface DataUploadProps {
  sessionId: string
  onComplete?: () => void
}

export function DataUpload({ sessionId, onComplete }: DataUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const { uploadDataset, uploadProgress, loading, error } = useDataStore()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles(prev => [...prev, ...droppedFiles])
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...selectedFiles])
    }
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleUpload = async () => {
    for (const file of files) {
      try {
        await uploadDataset(file, sessionId)
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error)
      }
    }
    
    setFiles([])
    onComplete?.()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    
    switch (ext) {
      case 'csv':
      case 'tsv':
      case 'xlsx':
      case 'xls':
        return <Database className="w-5 h-5 text-green-400" />
      case 'json':
        return <FileText className="w-5 h-5 text-blue-400" />
      case 'fasta':
      case 'fa':
      case 'fna':
      case 'gb':
      case 'gbk':
        return <FileText className="w-5 h-5 text-purple-400" />
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
          isDragging
            ? 'border-accent bg-accent/10 scale-[1.02]'
            : 'border-border hover:border-accent/50'
        }`}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${
          isDragging ? 'text-accent' : 'text-muted-foreground'
        }`} />
        
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {isDragging ? 'Drop files here' : 'Upload Dataset'}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop files or click to browse
        </p>

        <input
          type="file"
          id="file-upload"
          multiple
          accept=".csv,.tsv,.json,.fasta,.fa,.fna,.gb,.gbk,.xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <label htmlFor="file-upload">
          <Button asChild className="cursor-pointer">
            <span>
              <Upload className="w-4 h-4 mr-2" />
              Browse Files
            </span>
          </Button>
        </label>

        <p className="text-xs text-muted-foreground mt-4">
          Supported formats: CSV, TSV, JSON, FASTA, GenBank, Excel
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Selected Files ({files.length})</h4>
          
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 glass-card rounded-lg border border-border"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getFileIcon(file.name)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Upload Progress */}
          {loading && (
            <div className="p-4 glass-card rounded-lg border border-accent/30 bg-accent/5">
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="w-4 h-4 text-accent animate-spin" />
                <span className="text-sm font-medium text-foreground">
                  Uploading and parsing...
                </span>
                <span className="text-sm text-muted-foreground ml-auto">
                  {uploadProgress}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 glass-card rounded-lg border border-red-500/30 bg-red-500/5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-500 mb-1">Upload Failed</p>
                  <p className="text-xs text-muted-foreground">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={loading || files.length === 0}
            className="w-full bg-primary"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
