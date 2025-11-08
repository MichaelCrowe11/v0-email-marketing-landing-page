"use client"

import { useState } from "react"
import { Code, Terminal, FileText, Database, Brain, Zap, Settings, Maximize2, Minimize2 } from "lucide-react"
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
    const response = await fetch("/api/execute-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        language: "python",
      }),
    })

    const result = await response.json()
    return {
      output: result.output || result.error || "Execution completed",
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
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-card/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/chat" className="flex items-center gap-2">
            <div className="h-8 w-8">
              <AIAvatarSwirl size="sm" />
            </div>
            <div>
              <h1 className="text-xl font-bold">🧬 CROWE LOGIC Research IDE</h1>
              <p className="text-xs text-muted-foreground">Advanced Mushroom Data Analysis Environment</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Database className="h-3 w-3" />
            <span>30GB Dataset Connected</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-500">
            <Brain className="h-3 w-3" />
            <span>AI Ready</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-500">
            <Zap className="h-3 w-3" />
            <span>GPU Active</span>
          </div>

          <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          <Link href="/chat">
            <Button size="sm">
              <Brain className="mr-2 h-4 w-4" />🧠 Chat Assistant
            </Button>
          </Link>
        </div>
      </div>

      {/* IDE Interface */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer Sidebar */}
        <div className="w-64 border-r bg-card/30">
          <FileExplorer onFileSelect={handleFileSelect} selectedFile={selectedFile?.id} />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col">
          {/* Tab Bar */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b bg-muted/20 px-4">
              <TabsList className="bg-transparent">
                <TabsTrigger value="editor" className="gap-2">
                  <Code className="h-4 w-4" />
                  Code Editor
                </TabsTrigger>
                <TabsTrigger value="terminal" className="gap-2">
                  <Terminal className="h-4 w-4" />
                  Terminal
                </TabsTrigger>
                <TabsTrigger value="data" className="gap-2">
                  <Database className="h-4 w-4" />
                  Data Viewer
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                {selectedFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{selectedFile.name}</span>
                  </div>
                )}
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tab Content */}
            <TabsContent value="editor" className="flex-1 m-0">
              <CodeEditor initialCode={getInitialCode()} onExecute={executeCode} />
            </TabsContent>

            <TabsContent value="terminal" className="flex-1 m-0">
              <ResearchTerminal />
            </TabsContent>

            <TabsContent value="data" className="flex-1 m-0">
              {selectedFile?.extension === "csv" || !selectedFile ? (
                <DataViewer fileName={selectedFile?.name} onGenerateCode={handleGenerateCode} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <Database className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">Data Viewer</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Select a dataset file to view and explore data</p>
                    <p className="text-xs text-muted-foreground">Supports CSV, JSON, Excel, and database connections</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
