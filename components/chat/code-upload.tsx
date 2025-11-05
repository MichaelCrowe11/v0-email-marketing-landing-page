"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, FileCode, X, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CodeUploadProps {
  onCodeUploaded?: (prompt: string, filename: string, language: string) => void
  disabled?: boolean
}

type ActionType = "refactor" | "explain" | "fix" | "modernize" | "optimize"

export function CodeUpload({ onCodeUploaded, disabled }: CodeUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedAction, setSelectedAction] = useState<ActionType>("explain")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      const codeFile = files.find((file) => isCodeFile(file))

      if (codeFile) {
        await processFile(codeFile)
      }
    },
    [selectedAction],
  )

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && isCodeFile(file)) {
      await processFile(file)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const isCodeFile = (file: File): boolean => {
    const codeExtensions = [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".py",
      ".go",
      ".rs",
      ".java",
      ".cpp",
      ".c",
      ".cs",
      ".php",
      ".rb",
      ".swift",
      ".kt",
      ".sql",
      ".html",
      ".css",
      ".scss",
      ".json",
      ".yaml",
      ".yml",
      ".sh",
      ".md",
    ]
    return codeExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
  }

  const processFile = async (file: File) => {
    setUploadedFile(file)
    setIsProcessing(true)

    try {
      const code = await file.text()

      const response = await fetch("/api/code/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          code,
          action: selectedAction,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process code")
      }

      const data = await response.json()

      // Call the callback with the generated prompt
      if (onCodeUploaded && data.prompt) {
        onCodeUploaded(data.prompt, data.filename, data.language)
      }

      // Clear after successful upload
      setTimeout(() => {
        setUploadedFile(null)
      }, 2000)
    } catch (error) {
      console.error("Failed to process file:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  const actions: { value: ActionType; label: string; description: string }[] = [
    { value: "explain", label: "Explain", description: "Get detailed code explanation" },
    { value: "refactor", label: "Refactor", description: "Improve code quality" },
    { value: "fix", label: "Fix Bugs", description: "Find and fix issues" },
    { value: "modernize", label: "Modernize", description: "Update to latest practices" },
    { value: "optimize", label: "Optimize", description: "Improve performance" },
  ]

  return (
    <div className="space-y-3">
      {/* Action Selector */}
      <div className="flex gap-2 flex-wrap">
        {actions.map((action) => (
          <Button
            key={action.value}
            type="button"
            variant={selectedAction === action.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedAction(action.value)}
            disabled={disabled || isProcessing}
            className="h-8 px-3"
            title={action.description}
          >
            {action.label}
          </Button>
        ))}
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-all",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".ts,.tsx,.js,.jsx,.py,.go,.rs,.java,.cpp,.c,.cs,.php,.rb,.swift,.kt,.sql,.html,.css,.scss,.json,.yaml,.yml,.sh,.md"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isProcessing}
        />

        {uploadedFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              ) : (
                <Check className="w-5 h-5 text-green-500" />
              )}
              <div>
                <p className="font-medium text-sm">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {isProcessing ? "Processing..." : "Ready to analyze"}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              disabled={isProcessing}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragging ? "Drop your code file here" : "Upload code to analyze"}
              </p>
              <p className="text-xs text-muted-foreground">
                Drag & drop or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:underline"
                  disabled={disabled}
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: TS, JS, Python, Go, Rust, Java, and more
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
