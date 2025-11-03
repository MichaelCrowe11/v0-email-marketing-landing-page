"use client"

import { useState } from "react"
import {
  Code, Terminal, FileText, Database, Brain, Zap, Play,
  Settings, Maximize2, Minimize2, RotateCcw, Save
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeEditor } from "@/components/research-ide/code-editor"
import { ResearchTerminal } from "@/components/research-ide/research-terminal"
import { FileExplorer } from "@/components/research-ide/file-explorer"
import { DataViewer } from "@/components/research-ide/data-viewer"
import { AIAvatarSwirl } from "@/components/chat/ai-avatar-swirl"
import Link from "next/link"

interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  extension?: string
}

export default function WorkbenchPage() {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
  const [activeTab, setActiveTab] = useState("editor")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [code, setCode] = useState("")

  const handleFileSelect = (file: FileNode) => {
    setSelectedFile(file)
    setActiveTab("editor")
  }

  const executeCode = async (code: string) => {
    // This will use the API endpoint we enhanced
    const response = await fetch('/api/execute-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language: "python"
      })
    })

    const result = await response.json()
    return {
      output: result.output || result.error || "Execution completed"
    }
  }

  const handleGenerateCode = (generatedCode: string) => {
    setCode(generatedCode)
    setActiveTab("editor")
  }

  const getInitialCode = () => {
    if (code) return code

    if (!selectedFile) {
      return `# 🍄 CROWE LOGIC Research IDE
# Advanced Mushroom Data Analysis Environment

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

print("🚀 CROWE LOGIC Research Environment Ready")
print("📊 30GB Mushroom Dataset Available")
print("🧠 AI-Powered Analysis Tools Loaded")

# Load your mushroom cultivation dataset
# df = pd.read_csv('mushroom_cultivation_data.csv')
# print(f"Dataset loaded: {df.shape} rows x columns")

# Start your research here!
`
    }

    if (selectedFile.extension === "py") {
      return `# Analysis script: ${selectedFile.name}
# 🍄 Mushroom Research Analysis

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load mushroom cultivation data
df = pd.read_csv('mushroom_cultivation_data.csv')
print(f"Loaded {len(df):,} cultivation records")

# Your analysis code here
`
    } else if (selectedFile.extension === "csv") {
      return `# Data exploration for: ${selectedFile.name}

import pandas as pd
import numpy as np

# Load and explore the dataset
df = pd.read_csv('${selectedFile.name}')
print(f"Dataset shape: {df.shape}")
print("\\nColumn info:")
print(df.info())
print("\\nFirst 5 rows:")
print(df.head())
print("\\nStatistical summary:")
print(df.describe())
`
    }

    return `# Working with: ${selectedFile.name}
# File type: ${selectedFile.extension}

print("File selected: ${selectedFile.name}")`
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gradient-to-b from-background via-background to-muted/5`}>
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-full mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <AIAvatarSwirl state="idle" size={40} />
                <div>
                  <h1 className="text-lg font-bold text-foreground">
                    🧬 CROWE LOGIC Research IDE
                  </h1>
                  <p className="text-xs text-muted-foreground">Advanced Mushroom Data Analysis Environment</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">30GB Dataset Connected</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Brain className="w-3 h-3 text-purple-400" />
                <span className="text-muted-foreground">AI Ready</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-muted-foreground">GPU Active</span>
              </div>

              <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>

              <Link href="/chat">
                <Button variant="outline" size="sm">
                  🧠 Chat Assistant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* IDE Interface */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* File Explorer Sidebar */}
        <div className="w-80 border-r border-border">
          <FileExplorer
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile?.id}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="border-b border-border bg-card/30">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between px-4 py-2">
                <TabsList className="grid w-96 grid-cols-3">
                  <TabsTrigger value="editor" className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Code Editor
                  </TabsTrigger>
                  <TabsTrigger value="terminal" className="flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    Terminal
                  </TabsTrigger>
                  <TabsTrigger value="data" className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Data Viewer
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  {selectedFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      <span>{selectedFile.name}</span>
                    </div>
                  )}
                  <Button variant="ghost" size="sm">
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1">
                <TabsContent value="editor" className="h-[calc(100vh-140px)] m-0">
                  <CodeEditor
                    sessionId="mushroom-research"
                    initialCode={getInitialCode()}
                    language="python"
                    onExecute={executeCode}
                  />
                </TabsContent>

                <TabsContent value="terminal" className="h-[calc(100vh-140px)] m-0">
                  <ResearchTerminal />
                </TabsContent>

                <TabsContent value="data" className="h-[calc(100vh-140px)] m-0 p-4">
                  {selectedFile?.extension === "csv" || !selectedFile ? (
                    <DataViewer
                      fileName={selectedFile?.name || "mushroom_cultivation_data.csv"}
                      onGenerateCode={handleGenerateCode}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-center">
                      <div>
                        <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Data Viewer</h3>
                        <p className="text-muted-foreground mb-4">Select a dataset file to view and explore data</p>
                        <p className="text-sm text-muted-foreground">Supports CSV, JSON, Excel, and database connections</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}