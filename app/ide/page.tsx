"use client"

import { useState } from "react"
import { IDEToolbar } from "@/components/chat/ide-toolbar"
import { CodeFileBrowser } from "@/components/chat/code-file-browser"
import { CodeUpload } from "@/components/chat/code-upload"
import { CodeEditor } from "@/components/chat/code-editor"
import { Button } from "@/components/ui/button"
import {
  PanelLeft,
  Terminal,
  FileCode2,
  Play,
  Bug,
  GitBranch,
  Settings,
  Maximize2,
  Minimize2,
} from "lucide-react"

interface CodeFile {
  id: string
  name: string
  language: string
  code: string
  size: number
  uploadedAt: Date
}

export default function IDEPage() {
  const [files, setFiles] = useState<CodeFile[]>([])
  const [activeFile, setActiveFile] = useState<CodeFile | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [showTerminal, setShowTerminal] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Crowe Logic Research IDE v1.0.0",
    "Ready for development...",
    "",
  ])
  const [fullscreen, setFullscreen] = useState(false)

  const handleCodeUploaded = async (prompt: string, filename: string, language: string) => {
    // Extract code from prompt (assuming it's in the prompt)
    const codeMatch = prompt.match(/```[\w]*\n([\s\S]*?)```/)
    const code = codeMatch ? codeMatch[1] : ""

    const newFile: CodeFile = {
      id: Date.now().toString(),
      name: filename,
      language: language,
      code: code,
      size: code.length,
      uploadedAt: new Date(),
    }

    setFiles((prev) => [...prev, newFile])
    setActiveFile(newFile)
    setShowUpload(false)
    addTerminalLine(`📁 Loaded ${filename} (${language})`)
  }

  const handleFileSelect = (file: CodeFile) => {
    setActiveFile(file)
    addTerminalLine(`📂 Opened ${file.name}`)
  }

  const handleFileDelete = (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (file) {
      addTerminalLine(`🗑️  Deleted ${file.name}`)
    }
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
    if (activeFile?.id === fileId) {
      setActiveFile(null)
    }
  }

  const handleToolbarAction = (action: string) => {
    switch (action) {
      case "upload":
        setShowUpload(true)
        break
      case "export":
        addTerminalLine("📦 Exporting project...")
        setTimeout(() => addTerminalLine("✓ Export complete"), 1000)
        break
      case "run":
        if (activeFile) {
          addTerminalLine(`▶️  Running ${activeFile.name}...`)
          setTimeout(() => addTerminalLine("✓ Execution complete"), 1500)
        }
        break
      case "refactor":
        if (activeFile) {
          addTerminalLine(`✨ AI refactoring ${activeFile.name}...`)
          setTimeout(() => addTerminalLine("✓ Refactoring suggestions ready"), 2000)
        }
        break
      case "terminal":
        setShowTerminal(!showTerminal)
        break
      case "git":
        addTerminalLine("🌿 Git status: On branch main, nothing to commit")
        break
      case "share":
        addTerminalLine("🔗 Share link copied to clipboard")
        break
      case "settings":
        addTerminalLine("⚙️  Opening settings...")
        break
    }
  }

  const handleSaveFile = (code: string) => {
    if (activeFile) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === activeFile.id ? { ...f, code, size: code.length } : f
        )
      )
      setActiveFile({ ...activeFile, code, size: code.length })
      addTerminalLine(`💾 Saved ${activeFile.name}`)
    }
  }

  const addTerminalLine = (line: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setTerminalOutput((prev) => [...prev, `[${timestamp}] ${line}`])
  }

  return (
    <div className={`flex flex-col h-screen bg-background ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <IDEToolbar onAction={handleToolbarAction} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-80 border-r border-border bg-card flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-border">
              <h2 className="text-sm font-bold text-foreground mb-1">Workspace</h2>
              <p className="text-xs text-muted-foreground">Research IDE</p>
            </div>

            {/* File Browser */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <CodeFileBrowser
                onFileSelect={handleFileSelect}
                onFileDelete={handleFileDelete}
              />

              {/* Quick Actions */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Quick Actions
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUpload(true)}
                  className="w-full justify-start gap-2"
                >
                  <FileCode2 className="w-4 h-4" />
                  Upload Code
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToolbarAction("terminal")}
                  className="w-full justify-start gap-2"
                >
                  <Terminal className="w-4 h-4" />
                  Toggle Terminal
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToolbarAction("run")}
                  className="w-full justify-start gap-2"
                  disabled={!activeFile}
                >
                  <Play className="w-4 h-4" />
                  Run Code
                </Button>
              </div>

              {/* AI Tools */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  AI Tools
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30"
                  disabled={!activeFile}
                  onClick={() => handleToolbarAction("refactor")}
                >
                  <Bug className="w-4 h-4 text-purple-500" />
                  AI Debug & Fix
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Tabs */}
          {activeFile && (
            <div className="border-b border-border bg-muted/20 flex items-center px-2 py-1">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-t border-t border-l border-r border-border">
                <FileCode2 className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs font-medium">{activeFile.name}</span>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="h-7 w-7 p-0"
                >
                  <PanelLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFullscreen(!fullscreen)}
                  className="h-7 w-7 p-0"
                >
                  {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* Editor Content */}
          <div className="flex-1 overflow-hidden">
            {activeFile ? (
              <div className="h-full">
                <textarea
                  value={activeFile.code}
                  onChange={(e) => {
                    const newCode = e.target.value
                    setActiveFile({ ...activeFile, code: newCode })
                  }}
                  className="w-full h-full p-6 bg-muted/5 text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none border-0"
                  spellCheck={false}
                  style={{ tabSize: 2 }}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl" />
                    <FileCode2 className="w-20 h-20 text-muted-foreground/50 relative" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Research IDE
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Professional development environment powered by AI
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => setShowUpload(true)}
                        className="gap-2"
                      >
                        <FileCode2 className="w-4 h-4" />
                        Upload Code
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newFile: CodeFile = {
                            id: Date.now().toString(),
                            name: "untitled.ts",
                            language: "typescript",
                            code: "// Start coding...\n\n",
                            size: 0,
                            uploadedAt: new Date(),
                          }
                          setFiles([newFile])
                          setActiveFile(newFile)
                          addTerminalLine("📄 Created new file: untitled.ts")
                        }}
                      >
                        New File
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terminal */}
          {showTerminal && (
            <div className="h-64 border-t border-border bg-black/90 flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-semibold text-green-500">Terminal</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTerminal(false)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                >
                  ×
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-green-400">
                {terminalOutput.map((line, i) => (
                  <div key={i} className="mb-1">
                    {line}
                  </div>
                ))}
                <div className="flex items-center">
                  <span className="text-cyan-400">$</span>
                  <span className="ml-2 animate-pulse">▋</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Upload Code File</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUpload(false)}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
            <CodeUpload onCodeUploaded={handleCodeUploaded} />
          </div>
        </div>
      )}
    </div>
  )
}
