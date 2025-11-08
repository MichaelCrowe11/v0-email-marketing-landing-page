"use client"

import { useState } from "react"
import { Code, Terminal, FileText, Database, Brain, Zap, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeEditor } from "@/components/research-ide/code-editor"
import { ResearchTerminal } from "@/components/research-ide/research-terminal"
import { FileExplorer } from "@/components/research-ide/file-explorer"
import { DataViewer } from "@/components/research-ide/data-viewer"
import { CroweCodeAssistant } from "@/components/crowe-code-assistant"
import Link from "next/link"
import Image from "next/image"

interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  extension?: string
}

export default function WorkbenchPage() {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
  const [activeTab, setActiveTab] = useState("assistant")
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
      return `# Research IDE - Data Analysis Environment

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

print("Research Environment Ready")
print("Dataset Available: 30GB")

# Load your cultivation dataset
# df = pd.read_csv('cultivation_data.csv')
# print(f"Dataset loaded: {df.shape}")
`
    }

    if (selectedFile.extension === "py") {
      return `# Analysis: ${selectedFile.name}

import pandas as pd
import numpy as np

df = pd.read_csv('cultivation_data.csv')
print(f"Loaded {len(df):,} records")
`
    } else if (selectedFile.extension === "csv") {
      return `# Data exploration: ${selectedFile.name}

import pandas as pd

df = pd.read_csv('${selectedFile.name}')
print(f"Shape: {df.shape}")
print(df.info())
print(df.head())
print(df.describe())
`
    }

    return `# File: ${selectedFile.name}

print("File selected: ${selectedFile.name}")`
  }

  return (
    <div className="flex h-screen flex-col bg-black">
      <div className="flex items-center justify-between border-b border-[#485063] bg-[#1a1f2e] px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/chat" className="flex items-center gap-2">
            <Image src="/crowe-code-avatar.png" alt="Crowe Code" width={32} height={32} className="rounded-full" />
            {/* </CHANGE> */}
            <div>
              <h1 className="text-xl font-bold text-white">Research IDE</h1>
              <p className="text-xs text-[#a0a4a8]">Powered by Crowe Code</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-[#a0a4a8]">
            <Database className="h-3 w-3" />
            <span>30GB Dataset</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#4a90e2]">
            <div className="w-2 h-2 rounded-full bg-[#4a90e2]" />
            <span>Ready</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#4a90e2]">
            <Zap className="h-3 w-3" />
            <span>GPU</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-[#a0a4a8] hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          <Link href="/chat">
            <Button size="sm" className="bg-[#4a90e2] hover:bg-[#61afef] text-white">
              <Brain className="mr-2 h-4 w-4" />
              Assistant
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r border-[#485063] bg-[#0a0e14]">
          <FileExplorer onFileSelect={handleFileSelect} selectedFile={selectedFile?.id} />
        </div>

        <div className="flex flex-1 flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b border-[#485063] bg-[#1a1f2e] px-4">
              <TabsList className="bg-transparent border-b-0">
                <TabsTrigger
                  value="assistant"
                  className="gap-2 data-[state=active]:bg-[#2d3648] data-[state=active]:text-white text-[#a0a4a8]"
                >
                  <Brain className="h-4 w-4" />
                  Crowe Code
                </TabsTrigger>
                <TabsTrigger
                  value="editor"
                  className="gap-2 data-[state=active]:bg-[#2d3648] data-[state=active]:text-white text-[#a0a4a8]"
                >
                  <Code className="h-4 w-4" />
                  Editor
                </TabsTrigger>
                <TabsTrigger
                  value="terminal"
                  className="gap-2 data-[state=active]:bg-[#2d3648] data-[state=active]:text-white text-[#a0a4a8]"
                >
                  <Terminal className="h-4 w-4" />
                  Terminal
                </TabsTrigger>
                <TabsTrigger
                  value="data"
                  className="gap-2 data-[state=active]:bg-[#2d3648] data-[state=active]:text-white text-[#a0a4a8]"
                >
                  <Database className="h-4 w-4" />
                  Data
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                {selectedFile && (
                  <div className="flex items-center gap-2 text-sm text-[#a0a4a8]">
                    <FileText className="h-4 w-4" />
                    <span>{selectedFile.name}</span>
                  </div>
                )}
              </div>
            </div>

            <TabsContent value="assistant" className="flex-1 m-0 p-4">
              <CroweCodeAssistant />
            </TabsContent>

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
                    <Database className="mx-auto h-12 w-12 text-[#a0a4a8]/50" />
                    <h3 className="mt-4 text-lg font-semibold text-white">Data Viewer</h3>
                    <p className="mt-2 text-sm text-[#a0a4a8]">Select a dataset file to view and explore</p>
                    <p className="text-xs text-[#a0a4a8]">Supports CSV, JSON, Excel</p>
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
