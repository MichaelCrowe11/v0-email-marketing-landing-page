"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, FileCode, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

type Action = "refactor" | "explain" | "fix" | "modernize" | "optimize"

interface FileUploadProps {
  onFileProcess: (prompt: string, filename: string) => void
  disabled?: boolean
}

export function FileUpload({ onFileProcess, disabled = false }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState<string>("")
  const [action, setAction] = useState<Action>("refactor")
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const actionDescriptions = {
    refactor: "Improve code quality, readability, and performance",
    explain: "Get detailed explanation of how the code works",
    fix: "Analyze and fix bugs or issues in the code",
    modernize: "Update code to use current best practices",
    optimize: "Enhance performance and efficiency",
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = (e) => reject(e)
      reader.readAsText(file)
    })
  }

  const handleFileDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      try {
        const content = await readFileContent(droppedFile)
        setFileContent(content)
      } catch (error) {
        console.error("Error reading file:", error)
      }
    }
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      try {
        const content = await readFileContent(selectedFile)
        setFileContent(content)
      } catch (error) {
        console.error("Error reading file:", error)
      }
    }
  }

  const handleProcess = async () => {
    if (!file || !fileContent) return

    setIsProcessing(true)
    try {
      const response = await fetch("/api/code/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          code: fileContent,
          action,
        }),
      })

      const data = await response.json()

      // Pass the generated prompt to the chat
      onFileProcess(data.prompt, file.name)

      // Reset state
      setFile(null)
      setFileContent("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error processing file:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setFileContent("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleFileDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 transition-all
            ${isDragging
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-700 hover:border-gray-600 bg-gray-900/50"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.go,.rs,.rb,.php,.swift,.kt,.scala,.sql,.html,.css,.json,.yaml,.yml,.md,.txt"
            onChange={handleFileSelect}
            disabled={disabled}
          />

          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="p-3 rounded-full bg-blue-500/20">
              <Upload className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-200">
                Drop your code file here or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports: JavaScript, TypeScript, Python, Java, C++, Go, Rust, and more
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="p-2 rounded bg-blue-500/20 flex-shrink-0">
                  <FileCode className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(file.size / 1024).toFixed(2)} KB • {fileContent.split("\n").length} lines
                  </p>

                  {/* Preview */}
                  <div className="mt-3 p-3 rounded bg-black/30 border border-gray-800">
                    <pre className="text-xs text-gray-400 overflow-x-auto max-h-32 overflow-y-auto">
                      {fileContent.split("\n").slice(0, 10).join("\n")}
                      {fileContent.split("\n").length > 10 && "\n..."}
                    </pre>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                onClick={handleRemoveFile}
                disabled={disabled || isProcessing}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Selector */}
      {file && (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Choose Action
            </label>
            <Select value={action} onValueChange={(v) => setAction(v as Action)} disabled={disabled || isProcessing}>
              <SelectTrigger className="w-full bg-gray-900 border-gray-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="refactor">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Refactor Code</span>
                    <span className="text-xs text-gray-500">
                      {actionDescriptions.refactor}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="explain">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Explain Code</span>
                    <span className="text-xs text-gray-500">
                      {actionDescriptions.explain}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="fix">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Fix Bugs</span>
                    <span className="text-xs text-gray-500">
                      {actionDescriptions.fix}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="modernize">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Modernize Code</span>
                    <span className="text-xs text-gray-500">
                      {actionDescriptions.modernize}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="optimize">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Optimize Performance</span>
                    <span className="text-xs text-gray-500">
                      {actionDescriptions.optimize}
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleProcess}
            disabled={disabled || isProcessing}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileCode className="w-4 h-4 mr-2" />
                Process with Crowe Code
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
