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
import { GitHubCloneDialog } from "@/components/github-clone-dialog"

// Force dynamic rendering to avoid SSR issues with browser APIs
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default function CroweCodePage() {
  const [code, setCode] = useState(`# Synapse-lang - Scientific Programming Language
# Express uncertainty, run parallel experiments, deploy directly

uncertain temperature = 300 ± 10  // Uncertainty quantification
uncertain pressure = 1.5 ± 0.1

# Hypothesis-driven code
hypothesis substrate_optimization {
  inputs: [sawdust, coffee_grounds, gypsum]
  outputs: biological_efficiency
  uncertainty: high
  
  # Parallel experiment branches
  experiment_1: ratio(70:30:2)
  experiment_2: ratio(60:40:2)
  
  # AI agent evaluation
  agent CriOS_Substrate_Analyst {
    evaluate: contamination_risk
    optimize_for: yield_per_kg
  }
}

# Quantum computing integration
quantum[2] {
  H(q0)          # Superposition
  CNOT(q0, q1)   # Entanglement
  measure(q0, q1)
}

# Start experimenting with Synapse-lang...
`)
  const [output, setOutput] = useState("")
  const [language, setLanguage] = useState<"python" | "javascript" | "synapse">("synapse")
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
  const [usageQuota, setUsageQuota] = useState({ used: 0, remaining: 10, quota: 10 })
  const [showCloneDialog, setShowCloneDialog] = useState(false)
  const [currentRepository, setCurrentRepository] = useState<any>(null)
  const [githubConnected, setGithubConnected] = useState(false)
  const [editorInstance, setEditorInstance] = useState<any>(null)
  const [generationMode, setGenerationMode] = useState<"plan" | "generate" | "guided">("generate")

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

  useEffect(() => {
    const fetchUsageQuota = async () => {
      try {
        const response = await fetch("/api/usage/quota")
        if (response.ok) {
          const data = await response.json()
          setUsageQuota(data)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch usage quota:", error)
      }
    }
    fetchUsageQuota()
  }, [])

  useEffect(() => {
    const checkGitHubConnection = async () => {
      try {
        const response = await fetch("/api/github/status")
        const data = await response.json()
        setGithubConnected(data.connected)
      } catch (error) {
        console.error("[v0] Failed to check GitHub connection:", error)
      }
    }
    checkGitHubConnection()
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
        body: JSON.stringify({ code, language }),
      })
      const data = await response.json()
      setOutput(data.output || data.error || "Code executed successfully")
      setUncommittedChanges((prev) => prev + 1)
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

  const handleConnectGitHub = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
    const redirectUri = `${window.location.origin}/api/github/auth/callback`
    const scope = "repo,user"
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
  }

  const handleCloneSuccess = (repository: any) => {
    setCurrentRepository(repository)
    setOutput(`✓ Successfully cloned ${repository.repo_full_name}\n${repository.filesCloned} files loaded`)
    setUncommittedChanges(0)
  }

  const handleSaveToGitHub = async () => {
    if (!currentRepository) {
      setOutput("No repository connected. Clone a repository first.")
      return
    }

    const commitMessage = prompt("Enter commit message:")
    if (!commitMessage) return

    setOutput("Pushing to GitHub...\n")

    try {
      const response = await fetch("/api/github/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repositoryId: currentRepository.id,
          commitMessage,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setOutput(`✓ Pushed ${data.filesCommitted} file(s) to GitHub\n${commitMessage}`)
        setUncommittedChanges(0)
      } else {
        setOutput(`✗ Failed to push: ${data.error}`)
      }
    } catch (error) {
      setOutput(`✗ Error: ${error}`)
    }
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

      {/* Header */}
      <div className="h-12 bg-[#1e1e1e] border-b border-[#2d2d30] flex items-center justify-between px-4 flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <Image
            src="/crowe-code-avatar.png"
            alt="Crowe Code"
            width={32}
            height={32}
            className="rounded-full ring-2 ring-[#6b46c1] ring-offset-2 ring-offset-[#1e1e1e]"
          />
          <div>
            <h1 className="text-sm font-semibold text-[#e0e0e0]">Crowe Code</h1>
            <p className="text-[10px] text-[#969696]">Autonomous Developer</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!githubConnected ? (
            <Button
              size="sm"
              onClick={handleConnectGitHub}
              className="bg-[#238636] hover:bg-[#2ea043] text-white text-xs h-8"
            >
              <GitBranch className="w-3 h-3 mr-1" />
              Connect GitHub
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setShowCloneDialog(true)}
              variant="ghost"
              className="text-[#cccccc] hover:bg-[#2a2d2e] text-xs h-8"
            >
              <GitBranch className="w-3 h-3 mr-1" />
              Clone Repo
            </Button>
          )}

          {currentRepository && (
            <div className="text-xs text-[#858585] font-mono">{currentRepository.repo_full_name}</div>
          )}

          <Button size="sm" variant="ghost" className="text-[#cccccc] hover:bg-[#2a2d2e] text-xs h-8">
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
          <div className="flex items-center gap-2 px-3 py-1 bg-[#2d2d30] rounded-md border border-[#3e3e42]">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-[#969696] font-mono tabular-nums">
              {usageQuota.remaining}/{usageQuota.quota} requests
            </span>
          </div>
          <div className="w-px h-6 bg-[#3e3e42]" />
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
          <div className="ml-4 flex items-center gap-1 bg-[#2d2d30] rounded-md p-1">
            <Button
              size="sm"
              variant={generationMode === "plan" ? "default" : "ghost"}
              onClick={() => setGenerationMode("plan")}
              className="text-xs h-6 px-2"
              title="Plan then code - AI explains approach before writing"
            >
              Plan
            </Button>
            <Button
              size="sm"
              variant={generationMode === "generate" ? "default" : "ghost"}
              onClick={() => setGenerationMode("generate")}
              className="text-xs h-6 px-2"
              title="Direct code generation - AI writes code immediately"
            >
              Generate
            </Button>
            <Button
              size="sm"
              variant={generationMode === "guided" ? "default" : "ghost"}
              onClick={() => setGenerationMode("guided")}
              className="text-xs h-6 px-2"
              title="Guided mode - Step-by-step with confirmation"
            >
              Guided
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Icon Sidebar */}
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

        {/* Left Panel */}
        <div className="bg-[#252526] border-r border-[#1e1e1e] overflow-y-auto" style={{ width: `${leftPanelWidth}%` }}>
          {activeTab === "files" && (
            <div className="p-3">
              <h3 className="text-xs font-semibold text-[#cccccc] mb-3 uppercase tracking-wider">Explorer</h3>
              <div className="space-y-1 text-sm">
                <div className="p-2 hover:bg-[#2a2d2e] rounded cursor-pointer text-[#4fc1ff] flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  main.syn
                </div>
                <div className="p-2 hover:bg-[#2a2d2e] rounded cursor-pointer text-[#cccccc] flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  hypothesis.syn
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
                </div>
                <Button size="sm" className="w-full bg-[#0e639c] hover:bg-[#1177bb] text-white text-xs">
                  <Upload className="w-3 h-3 mr-1" />
                  Commit & Push
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Horizontal Resizer */}
        <div
          className="w-1 bg-[#1e1e1e] hover:bg-[#0078d4] cursor-col-resize transition-colors"
          onMouseDown={() => setIsResizingHorizontal(true)}
        />

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden" style={{ height: `${100 - bottomPanelHeight}%` }}>
            <Editor
              height="100%"
              defaultLanguage={language === "synapse" ? "python" : language}
              value={code}
              onChange={(value) => {
                setCode(value || "")
                setUncommittedChanges((prev) => prev + 1)
              }}
              theme="vs-dark"
              onMount={(editor, monaco) => {
                setEditorInstance(editor)
                monaco.languages.register({ id: "synapse" })
                monaco.languages.setMonarchTokensProvider("synapse", {
                  keywords: [
                    "uncertain",
                    "hypothesis",
                    "quantum",
                    "parallel",
                    "agent",
                    "inputs",
                    "outputs",
                    "uncertainty",
                    "experiment",
                    "measure",
                    "H",
                    "CNOT",
                    "evaluate",
                    "optimize_for",
                  ],
                  tokenizer: {
                    root: [
                      [/\b(uncertain|hypothesis|quantum|parallel|agent|measure|evaluate|optimize_for)\b/, "keyword"],
                      [/\d+\s*±\s*\d+/, "number"],
                      [/#.*$/, "comment"],
                      [/H|CNOT/, "function"],
                    ],
                  },
                })

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
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
              }}
            />
          </div>

          {/* Vertical Resizer */}
          <div
            className="h-1 bg-[#1e1e1e] hover:bg-[#0078d4] cursor-row-resize transition-colors"
            onMouseDown={() => setIsResizingVertical(true)}
          />

          {/* Terminal */}
          <div
            className="bg-[#1e1e1e] border-t border-[#1e1e1e] overflow-y-auto"
            style={{ height: `${bottomPanelHeight}%` }}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-[#252526] border-b border-[#1e1e1e]">
              <TerminalIcon className="w-4 h-4 text-[#4fc1ff]" />
              <span className="text-xs font-semibold text-[#cccccc]">Terminal</span>
              <span className="text-xs text-[#858585]">{language}</span>
            </div>
            <pre className="p-4 text-sm font-mono text-[#cccccc] whitespace-pre-wrap">
              {output || "$ Ready for execution..."}
            </pre>
          </div>
        </div>

        {/* Chat Panel */}
        {showChatPanel && (
          <>
            <div
              className="w-1 bg-[#2d2d30] hover:bg-[#007acc] cursor-col-resize transition-colors duration-150"
              onMouseDown={() => setIsResizingRight(true)}
            />
            <div
              className="bg-[#1e1e1e] border-l border-[#2d2d30] flex flex-col shadow-2xl"
              style={{ width: `${rightPanelWidth}%` }}
            >
              <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-[#2d2d30]">
                <div className="flex items-center gap-2">
                  <Image
                    src="/crowe-code-avatar.png"
                    alt="Crowe Code"
                    width={28}
                    height={28}
                    className="rounded-full ring-2 ring-[#6b46c1]"
                  />
                  <div>
                    <span className="text-sm font-semibold text-[#e0e0e0]">Crowe Code</span>
                    <p className="text-[10px] text-[#969696]">
                      {generationMode === "plan" && "Plan Mode • Explains before coding"}
                      {generationMode === "generate" && "Generate Mode • Direct code output"}
                      {generationMode === "guided" && "Guided Mode • Step-by-step assistance"}
                    </p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowChatPanel(false)}
                  className="text-[#969696] hover:text-[#e0e0e0] hover:bg-[#2d2d30]"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CroweCodeChatPanel
                onCodeGenerated={(code) => {
                  if (editorInstance) {
                    const selection = editorInstance.getSelection()
                    editorInstance.executeEdits("", [
                      {
                        range: selection,
                        text: code,
                      },
                    ])
                    editorInstance.focus()
                  } else {
                    setCode((prev) => prev + "\n\n" + code)
                  }
                  setUncommittedChanges((prev) => prev + 1)
                }}
                selectedText={selectedText}
                onUsageUpdate={(newQuota) => setUsageQuota(newQuota)}
                editorInstance={editorInstance}
                generationMode={generationMode}
              />
            </div>
          </>
        )}
      </div>

      {/* GitHub Clone Dialog */}
      <GitHubCloneDialog open={showCloneDialog} onOpenChange={setShowCloneDialog} onCloneSuccess={handleCloneSuccess} />
    </div>
  )
}
