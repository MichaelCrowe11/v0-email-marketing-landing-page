"use client"

import { useState } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { Settings, Play, Save, Share2, Code2 } from "lucide-react"
import { MonacoEditor } from "@/components/ide/monaco-editor"
import { DatasetBrowser } from "@/components/ide/dataset-browser"
import { ModelSelector } from "@/components/ide/model-selector"
import { TerminalOutput } from "@/components/ide/terminal-output"

export function IDEShell() {
  const [activeSidebar, setActiveSidebar] = useState<"files" | "data" | "models">("files")

  return (
    <div className="flex h-full flex-col">
      {/* Top Bar */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-muted/30 px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <Code2 className="h-5 w-5 text-primary" />
            <span>Biotech IDE</span>
          </div>
          <div className="h-4 w-[1px] bg-border" />
          <span className="text-sm text-muted-foreground">Untitled Project</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
            <Play className="mr-2 h-4 w-4" />
            Run
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Sidebar */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-muted/10">
            <div className="flex h-full flex-col">
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveSidebar("files")}
                  className={`flex-1 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeSidebar === "files"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Files
                </button>
                <button
                  onClick={() => setActiveSidebar("data")}
                  className={`flex-1 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeSidebar === "data"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Data
                </button>
                <button
                  onClick={() => setActiveSidebar("models")}
                  className={`flex-1 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeSidebar === "models"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Models
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {activeSidebar === "files" && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground">PROJECT FILES</div>
                    {/* File tree placeholder */}
                    <div className="rounded-md bg-muted/50 p-2 text-sm">main.py</div>
                    <div className="rounded-md p-2 text-sm hover:bg-muted/50">utils.py</div>
                    <div className="rounded-md p-2 text-sm hover:bg-muted/50">requirements.txt</div>
                  </div>
                )}
                {activeSidebar === "data" && <DatasetBrowser />}
                {activeSidebar === "models" && <ModelSelector />}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Editor Area */}
          <ResizablePanel defaultSize={50}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={70}>
                <MonacoEditor />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={30}>
                <TerminalOutput />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle />

          {/* Preview / Visualization */}
          <ResizablePanel defaultSize={30} minSize={20}>
            <div className="flex h-full flex-col border-l border-border bg-muted/5">
              <div className="border-b border-border px-4 py-2 text-sm font-medium">Visualization</div>
              <div className="flex-1 p-4">
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground">
                  No output generated
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
