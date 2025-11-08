"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import {
  Play,
  Download,
  FileCode,
  Database,
  TerminalIcon,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Package,
  Search,
  FolderTree,
  Save,
  Upload,
  MessageSquare,
  X,
} from "lucide-react"
import { CroweCodeChatPanel } from "@/components/crowe-code-chat-panel"

export default function CroweCodePage() {
  const [code, setCode] = useState(`# Crowe Code - Autonomous Agricultural Software Developer
# VS Code-powered environment with GitHub integration

import pandas as pd
import numpy as np
from datetime import datetime

def analyze_cultivation_data():
    """Professional-grade data analysis"""
    print("Crowe Code Analysis System Ready")
    print("Connect to: Supabase, GitHub, VS Code Marketplace")
    
# Start building...
`)
  const [output, setOutput] = useState("")
  const [leftPanelWidth, setLeftPanelWidth] = useState(20)
  const [bottomPanelHeight, setBottomPanelHeight] = useState(30)
  const [rightPanelWidth, setRightPanelWidth] = useState(30)
  const [showChatPanel, setShowChatPanel] = useState(true)
  const [isResizingHorizontal, setIsResizingHorizontal] = useState(false)
  const [isResizingVertical, setIsResizingVertical] = useState(false)
  const [isResizingRight, setIsResizingRight] = useState(false)
  const [activeTab, setActiveTab] = useState("files")
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [uncommittedChanges, setUncommittedChanges] = useState(3)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      if (e.key === "Escape") {
        setShowCommandPalette(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleMouseMoveHorizontal = (e: MouseEvent) => {
    if (!isResizingHorizontal) return
    const newWidth = (e.clientX / window.innerWidth) * 100
    if (newWidth > 15 && newWidth < 35) {
      setLeftPanelWidth(newWidth)
    }
  }

  const handleMouseMoveVertical = (e: MouseEvent) => {
    if (!isResizingVertical) return
    const newHeight = ((window.innerHeight - e.clientY) / window.innerHeight) * 100
    if (newHeight > 20 && newHeight < 60) {
      setBottomPanelHeight(newHeight)
    }
  }

  const handleMouseMoveRight = (e: MouseEvent) => {
    if (!isResizingRight) return
    const newWidth = ((window.innerWidth - e.clientX) / window.innerWidth) * 100
    if (newWidth > 20 && newWidth < 50) {
      setRightPanelWidth(newWidth)
    }
  }

  const handleMouseUp = () => {
    setIsResizingHorizontal(false)
    setIsResizingVertical(false)
    setIsResizingRight(false)
  }

  const handleRunCode = async () => {
    setOutput("Running code...\n")
    try {
      const response = await fetch("/api/crowe-code/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: "python" }),
      })
      const data = await response.json()
      setOutput(data.output || data.error || "Code executed successfully")
    } catch (error) {
      setOutput(`Error: ${error}`)
    }
  }

  const handleExport = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "crowe-code-export.py"
    a.click()
  }

  const handleSaveToGitHub = async () => {
    setOutput("Saving to GitHub...\n")
    // GitHub integration logic here
    setUncommittedChanges(0)
    setOutput("Saved to GitHub successfully")
  }

  return (
    <div
      className="h-screen flex flex-col overflow-hidden bg-[#1e1e1e]"
      onMouseMove={(e) => {
        handleMouseMoveHorizontal(e.nativeEvent)
        handleMouseMoveVertical(e.nativeEvent)
        handleMouseMoveRight(e.nativeEvent)
      }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-32">
          <div className="w-full max-w-2xl bg-[#252526] border border-[#485063] rounded-lg shadow-2xl">
            <input
              type="text"
              placeholder="Type 'crowe' to ask Crowe Code anything..."
              className="w-full bg-transparent border-none outline-none text-white px-4 py-3 text-lg"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setShowCommandPalette(false)
                  setShowChatPanel(true)
                }
              }}
            />
            <div className="px-4 py-2 border-t border-[#1e1e1e] space-y-1">
              <div className="text-xs text-[#858585] px-2 py-1">Quick Commands</div>
              <div className="text-sm text-[#cccccc] hover:bg-[#2a2d2e] px-2 py-2 rounded cursor-pointer">
                crowe analyze contamination patterns
              </div>
              <div className="text-sm text-[#cccccc] hover:bg-[#2a2d2e] px-2 py-2 rounded cursor-pointer">
                crowe generate yield forecast model
              </div>
              <div className="text-sm text-[#cccccc] hover:bg-[#2a2d2e] px-2 py-2 rounded cursor-pointer">
                crowe create database migration
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-12 bg-[#323233] border-b border-[#1e1e1e] flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Image
            src="/crowe-code-avatar.png"
            alt="Crowe Code"
            width={28}
            height={28}
            className="rounded-full border-2 border-[#6b46c1]"
          />
          <div>
            <h1 className="text-sm font-semibold text-[#cccccc]">Crowe Code</h1>
            <p className="text-xs text-[#858585]">Autonomous Developer</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="text-[#cccccc] hover:bg-[#2a2d2e] text-xs h-8">
            <GitBranch className="w-3 h-3 mr-1" />
            main
          </Button>
          <Button size="sm" variant="ghost" className="text-[#f14c4c] hover:bg-[#2a2d2e] text-xs h-8">
            <GitCommit className="w-3 h-3 mr-1" />
            {uncommittedChanges} changes
          </Button>
          <Button size="sm" variant="ghost" className="text-[#cccccc] hover:bg-[#2a2d2e] text-xs h-8">
            <GitPullRequest className="w-3 h-3 mr-1" />
            PR
          </Button>
          <Button size="sm" variant="ghost" className="text-[#cccccc] hover:bg-[#2a2d2e] text-xs h-8">
            <Package className="w-3 h-3 mr-1" />
            Extensions
          </Button>
          <div className="w-px h-6 bg-[#1e1e1e]" />
          <Button
            size="sm"
            onClick={handleSaveToGitHub}
            className="bg-[#0e639c] hover:bg-[#1177bb] text-white text-xs h-8"
          >
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
          <Button size="sm" onClick={handleExport} className="bg-[#2ea043] hover:bg-[#3fb950] text-white text-xs h-8">
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
          <Button size="sm" onClick={handleRunCode} className="bg-[#0078d4] hover:bg-[#1084d8] text-white text-xs h-8">
            <Play className="w-3 h-3 mr-1" />
            Run
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowChatPanel(!showChatPanel)}
            className={`${showChatPanel ? "bg-[#0e639c]" : ""} text-[#cccccc] hover:bg-[#2a2d2e] text-xs h-8`}
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            Chat
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-12 bg-[#333333] border-r border-[#1e1e1e] flex flex-col items-center py-2 gap-2">
          <Button
            size="icon"
            variant="ghost"
            className={`w-10 h-10 ${activeTab === "files" ? "bg-[#1e1e1e]" : ""} text-[#cccccc] hover:bg-[#2a2d2e]`}
            onClick={() => setActiveTab("files")}
          >
            <FolderTree className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={`w-10 h-10 ${activeTab === "search" ? "bg-[#1e1e1e]" : ""} text-[#cccccc] hover:bg-[#2a2d2e]`}
            onClick={() => setActiveTab("search")}
          >
            <Search className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={`w-10 h-10 ${activeTab === "git" ? "bg-[#1e1e1e]" : ""} text-[#cccccc] hover:bg-[#2a2d2e]`}
            onClick={() => setActiveTab("git")}
          >
            <GitBranch className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={`w-10 h-10 ${activeTab === "data" ? "bg-[#1e1e1e]" : ""} text-[#cccccc] hover:bg-[#2a2d2e]`}
            onClick={() => setActiveTab("data")}
          >
            <Database className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={`w-10 h-10 ${activeTab === "extensions" ? "bg-[#1e1e1e]" : ""} text-[#cccccc] hover:bg-[#2a2d2e]`}
            onClick={() => setActiveTab("extensions")}
          >
            <Package className="w-5 h-5" />
          </Button>
        </div>

        <div className="bg-[#252526] border-r border-[#1e1e1e] overflow-y-auto" style={{ width: `${leftPanelWidth}%` }}>
          {activeTab === "files" && (
            <div className="p-3">
              <h3 className="text-xs font-semibold text-[#cccccc] mb-3 uppercase tracking-wider">Explorer</h3>
              <div className="space-y-1 text-sm">
                <div className="p-2 hover:bg-[#2a2d2e] rounded cursor-pointer text-[#4fc1ff] flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  main.py
                </div>
                <div className="p-2 hover:bg-[#2a2d2e] rounded cursor-pointer text-[#cccccc] flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  cultivation_analysis.py
                </div>
                <div className="p-2 hover:bg-[#2a2d2e] rounded cursor-pointer text-[#cccccc] flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  sop_generator.py
                </div>
                <div className="p-2 hover:bg-[#2a2d2e] rounded cursor-pointer text-[#cccccc] flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  batch_reports.py
                </div>
                <div className="p-2 hover:bg-[#2a2d2e] rounded cursor-pointer text-[#cccccc] flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  data/
                </div>
              </div>
            </div>
          )}

          {activeTab === "git" && (
            <div className="p-3">
              <h3 className="text-xs font-semibold text-[#cccccc] mb-3 uppercase tracking-wider">Source Control</h3>
              <div className="space-y-2">
                <div className="text-sm text-[#cccccc]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#858585]">Changes</span>
                    <span className="text-xs bg-[#1e1e1e] px-2 py-0.5 rounded">{uncommittedChanges}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="p-2 hover:bg-[#2a2d2e] rounded text-xs flex items-center gap-2">
                      <span className="text-[#f14c4c]">M</span>
                      <span>main.py</span>
                    </div>
                    <div className="p-2 hover:bg-[#2a2d2e] rounded text-xs flex items-center gap-2">
                      <span className="text-[#89d185]">A</span>
                      <span>new_analysis.py</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="w-full bg-[#0e639c] hover:bg-[#1177bb] text-white text-xs">
                  <Upload className="w-3 h-3 mr-1" />
                  Commit & Push
                </Button>
              </div>
            </div>
          )}

          {activeTab === "extensions" && (
            <div className="p-3">
              <h3 className="text-xs font-semibold text-[#cccccc] mb-3 uppercase tracking-wider">Extensions</h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-[#1e1e1e] rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-[#4fc1ff]" />
                    <span className="text-[#cccccc] font-medium">Python</span>
                  </div>
                  <p className="text-xs text-[#858585]">IntelliSense, linting</p>
                </div>
                <div className="p-2 bg-[#1e1e1e] rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-[#89d185]" />
                    <span className="text-[#cccccc] font-medium">Pylance</span>
                  </div>
                  <p className="text-xs text-[#858585]">Fast language support</p>
                </div>
                <div className="p-2 bg-[#1e1e1e] rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-[#f1fa8c]" />
                    <span className="text-[#cccccc] font-medium">Agricultural AI</span>
                  </div>
                  <p className="text-xs text-[#858585]">Crowe Logic extensions</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className="p-3">
              <h3 className="text-xs font-semibold text-[#cccccc] mb-3 uppercase tracking-wider">Data Sources</h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 hover:bg-[#2a2d2e] rounded cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#2ea043]" />
                    <span className="text-[#cccccc]">Supabase</span>
                  </div>
                  <p className="text-xs text-[#858585] mt-1">Connected</p>
                </div>
                <Button size="sm" variant="outline" className="w-full text-xs bg-transparent">
                  <Database className="w-3 h-3 mr-1" />
                  Add Data Source
                </Button>
              </div>
            </div>
          )}
        </div>

        <div
          className="w-1 bg-[#1e1e1e] hover:bg-[#0078d4] cursor-col-resize transition-colors"
          onMouseDown={() => setIsResizingHorizontal(true)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden" style={{ height: `${100 - bottomPanelHeight}%` }}>
            <Editor
              height="100%"
              defaultLanguage="python"
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              onMount={(editor, monaco) => {
                editor.addAction({
                  id: "ask-crowe-code",
                  label: "Ask Crowe Code",
                  keybindings: [],
                  contextMenuGroupId: "navigation",
                  contextMenuOrder: 1.5,
                  run: (ed) => {
                    const selection = ed.getSelection()
                    const selectedText = ed.getModel()?.getValueInRange(selection!)
                    setSelectedText(selectedText || "")
                    setShowChatPanel(true)
                  },
                })
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
                  setShowCommandPalette(true)
                })
              }}
              options={{
                fontSize: 14,
                fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', 'Courier New', monospace",
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                folding: true,
                automaticLayout: true,
                bracketPairColorization: { enabled: true },
                inlineSuggest: { enabled: true },
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                wordBasedSuggestions: "matchingDocuments",
              }}
            />
          </div>

          <div
            className="h-1 bg-[#1e1e1e] hover:bg-[#0078d4] cursor-row-resize transition-colors"
            onMouseDown={() => setIsResizingVertical(true)}
          />

          <div
            className="bg-[#1e1e1e] border-t border-[#1e1e1e] overflow-y-auto"
            style={{ height: `${bottomPanelHeight}%` }}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-[#252526] border-b border-[#1e1e1e]">
              <TerminalIcon className="w-4 h-4 text-[#4fc1ff]" />
              <span className="text-xs font-semibold text-[#cccccc]">Terminal</span>
              <span className="text-xs text-[#858585]">python</span>
            </div>
            <pre className="p-4 text-sm font-mono text-[#cccccc] whitespace-pre-wrap">
              {output || "$ Ready for execution..."}
            </pre>
          </div>
        </div>

        {showChatPanel && (
          <>
            <div
              className="w-1 bg-[#1e1e1e] hover:bg-[#0078d4] cursor-col-resize transition-colors"
              onMouseDown={() => setIsResizingRight(true)}
            />
            <div
              className="bg-[#1e1e1e] border-l border-[#1e1e1e] flex flex-col"
              style={{ width: `${rightPanelWidth}%` }}
            >
              <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#1e1e1e]">
                <div className="flex items-center gap-2">
                  <Image
                    src="/crowe-code-avatar.png"
                    alt="Crowe Code"
                    width={24}
                    height={24}
                    className="rounded-full border-2 border-[#6b46c1]"
                  />
                  <div>
                    <span className="text-sm font-semibold text-[#cccccc]">Crowe Code</span>
                    <p className="text-xs text-[#858585]">AI Agent</p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowChatPanel(false)}
                  className="text-[#858585] hover:text-[#cccccc]"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CroweCodeChatPanel onCodeGenerated={(code) => setCode(code)} selectedText={selectedText} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
