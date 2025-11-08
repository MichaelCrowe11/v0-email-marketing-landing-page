"use client"

import { useState } from "react"
import { AnimatedCroweAvatar } from "@/components/animated-crowe-avatar"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Play, Download, FileCode, Database, Settings, TerminalIcon } from "lucide-react"

export default function CroweCodePage() {
  const [code, setCode] = useState(`# Crowe Code - Autonomous Agricultural Software Developer
# Analyze cultivation data, generate SOPs, and create reports

import pandas as pd
from datetime import datetime

def analyze_batch_performance():
    """Analyze batch performance across all cultivation cycles"""
    # Your analysis code here
    pass

def generate_sop(process_type):
    """Generate Standard Operating Procedure"""
    # SOP generation logic
    pass

# Start coding...
`)
  const [output, setOutput] = useState("")
  const [leftPanelWidth, setLeftPanelWidth] = useState(60)
  const [bottomPanelHeight, setBottomPanelHeight] = useState(30)
  const [isResizingHorizontal, setIsResizingHorizontal] = useState(false)
  const [isResizingVertical, setIsResizingVertical] = useState(false)

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

  const handleMouseMoveHorizontal = (e: MouseEvent) => {
    if (!isResizingHorizontal) return
    const newWidth = (e.clientX / window.innerWidth) * 100
    if (newWidth > 30 && newWidth < 70) {
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

  const handleMouseUp = () => {
    setIsResizingHorizontal(false)
    setIsResizingVertical(false)
  }

  return (
    <div
      className="h-screen flex flex-col overflow-hidden bg-[#0a0e14]"
      onMouseMove={(e) => {
        handleMouseMoveHorizontal(e.nativeEvent)
        handleMouseMoveVertical(e.nativeEvent)
      }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="h-14 bg-[#1a1f2e] border-b border-[#485063] flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <AnimatedCroweAvatar mode="code" size={36} showLabel={false} />
          <div>
            <h1 className="text-lg font-bold text-white">Crowe Code</h1>
            <p className="text-xs text-[#a0a4a8]">Autonomous Software Developer</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="text-white hover:bg-[#2d3648]">
            <FileCode className="w-4 h-4 mr-2" />
            New File
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-[#2d3648]">
            <Database className="w-4 h-4 mr-2" />
            Data
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-[#2d3648]">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button size="sm" onClick={handleExport} className="bg-[#4a90e2] hover:bg-[#357abd] text-white">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={handleRunCode} className="bg-[#98c379] hover:bg-[#7cb668] text-white">
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - File Explorer */}
        <div className="bg-[#1a1f2e] border-r border-[#485063] overflow-y-auto" style={{ width: `${leftPanelWidth}%` }}>
          <div className="p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Project Files</h3>
            <div className="space-y-1 text-sm">
              <div className="p-2 hover:bg-[#2d3648] rounded cursor-pointer text-[#61afef]">main.py</div>
              <div className="p-2 hover:bg-[#2d3648] rounded cursor-pointer text-[#a0a4a8]">analysis.py</div>
              <div className="p-2 hover:bg-[#2d3648] rounded cursor-pointer text-[#a0a4a8]">sop_generator.py</div>
              <div className="p-2 hover:bg-[#2d3648] rounded cursor-pointer text-[#a0a4a8]">reports.py</div>
            </div>
            <h3 className="text-sm font-semibold text-white mt-6 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button size="sm" variant="ghost" className="w-full justify-start text-white hover:bg-[#2d3648]">
                Analyze Batches
              </Button>
              <Button size="sm" variant="ghost" className="w-full justify-start text-white hover:bg-[#2d3648]">
                Generate SOP
              </Button>
              <Button size="sm" variant="ghost" className="w-full justify-start text-white hover:bg-[#2d3648]">
                Create Report
              </Button>
              <Button size="sm" variant="ghost" className="w-full justify-start text-white hover:bg-[#2d3648]">
                Contamination Analysis
              </Button>
            </div>
          </div>
        </div>

        {/* Horizontal Resize Handle */}
        <div
          className="w-1 bg-[#485063] hover:bg-[#4a90e2] cursor-col-resize transition-colors"
          onMouseDown={() => setIsResizingHorizontal(true)}
        />

        {/* Right Panel - Editor and Terminal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 overflow-hidden" style={{ height: `${100 - bottomPanelHeight}%` }}>
            <Editor
              height="100%"
              defaultLanguage="python"
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "IBM Plex Mono, monospace",
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                folding: true,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Vertical Resize Handle */}
          <div
            className="h-1 bg-[#485063] hover:bg-[#4a90e2] cursor-row-resize transition-colors"
            onMouseDown={() => setIsResizingVertical(true)}
          />

          {/* Terminal Output */}
          <div
            className="bg-black border-t border-[#485063] overflow-y-auto"
            style={{ height: `${bottomPanelHeight}%` }}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1f2e] border-b border-[#485063]">
              <TerminalIcon className="w-4 h-4 text-[#4a90e2]" />
              <span className="text-sm font-semibold text-white">Terminal Output</span>
            </div>
            <pre className="p-4 text-sm font-mono text-white whitespace-pre-wrap">
              {output || "Ready to execute..."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
