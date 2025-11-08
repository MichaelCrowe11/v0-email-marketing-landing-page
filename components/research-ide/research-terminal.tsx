"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Terminal, ChevronRight } from "lucide-react"

interface TerminalCommand {
  id: string
  command: string
  output: string
  timestamp: Date
  type: "success" | "error" | "info"
}

export function ResearchTerminal() {
  const [commands, setCommands] = useState<TerminalCommand[]>([
    {
      id: "1",
      command: "ls -la",
      output: `total 48
drwxr-xr-x 8 researcher staff 256 Nov 2 16:30 .
drwxr-xr-x 5 researcher staff 160 Nov 2 16:29 ..
-rw-r--r-- 1 researcher staff 30GB Nov 2 16:30 mushroom_cultivation_data.csv
drwxr-xr-x 3 researcher staff 96 Nov 2 16:30 analysis_scripts/
drwxr-xr-x 4 researcher staff 128 Nov 2 16:30 models/
-rw-r--r-- 1 researcher staff 2.1M Nov 2 16:30 species_library.json
drwxr-xr-x 2 researcher staff 64 Nov 2 16:30 results/`,
      timestamp: new Date(),
      type: "success",
    },
  ])
  const [currentCommand, setCurrentCommand] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [workingDirectory, setWorkingDirectory] = useState("/home/researcher/mushroom-research")
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [commands])

  // Focus input on mount and click
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }

    const terminal = terminalRef.current
    if (terminal) {
      terminal.addEventListener("click", handleClick)
      return () => terminal.removeEventListener("click", handleClick)
    }
  }, [])

  const executeCommand = async () => {
    if (!currentCommand.trim() || isProcessing) return

    setIsProcessing(true)
    const cmd = currentCommand.trim()

    // Add command to history immediately
    const newCommand: TerminalCommand = {
      id: Date.now().toString(),
      command: cmd,
      output: "",
      timestamp: new Date(),
      type: "info",
    }
    setCommands((prev) => [...prev, newCommand])
    setCurrentCommand("")

    // Simulate command processing
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 700))

    let output = ""
    let type: "success" | "error" | "info" = "success"

    // Simulate different commands
    if (cmd.startsWith("ls")) {
      output = `mushroom_cultivation_data.csv  30GB  Nov 2 16:30
analysis_scripts/               4KB   Nov 2 16:25
models/                         128MB Nov 2 16:28
species_library.json            2.1MB Nov 2 16:30
results/                        256KB Nov 2 16:32`
    } else if (cmd.startsWith("cd")) {
      const path = cmd.split(" ")[1] || "~"
      setWorkingDirectory(path === "~" ? "/home/researcher" : `${workingDirectory}/${path}`)
      output = ""
    } else if (cmd.startsWith("python") || cmd.startsWith("pip")) {
      output = `Python 3.11.5 | Research Environment
🧬 Loading mushroom cultivation dataset...
✓ Dataset loaded: 1,547,823 rows × 47 columns
✓ Memory usage: 2.8 GB
Ready for analysis`
    } else if (cmd === "help" || cmd === "?") {
      output = `Available Commands:
  ls              - List files and directories
  cd [dir]        - Change directory
  python [file]   - Run Python script
  help            - Show this help message
  clear           - Clear terminal`
    } else if (cmd === "clear") {
      setCommands([])
      setIsProcessing(false)
      return
    } else {
      output = `Command not found: ${cmd}
Type 'help' for available commands`
      type = "error"
    }

    // Update the command with output
    setCommands((prev) => prev.map((c) => (c.id === newCommand.id ? { ...c, output, type } : c)))

    setIsProcessing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand()
    }
  }

  return (
    <div className="flex h-full flex-col bg-black/90 font-mono text-sm">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 border-b border-green-500/20 bg-green-950/30 px-4 py-2">
        <Terminal className="h-4 w-4 text-green-500" />
        <span className="text-xs text-green-400">CROWE LOGIC Research Terminal</span>
      </div>

      {/* Terminal Content */}
      <div ref={terminalRef} className="flex-1 overflow-auto p-4">
        {commands.map((cmd) => (
          <div key={cmd.id} className="mb-4">
            <div className="flex items-center gap-2 text-green-400">
              <span className="text-blue-400">researcher@crowe-logic</span>
              <span className="text-yellow-400">~{workingDirectory.replace("/home/researcher", "")}</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">{cmd.command}</span>
            </div>
            {cmd.output && (
              <pre className={`mt-1 whitespace-pre-wrap ${cmd.type === "error" ? "text-red-400" : "text-gray-300"}`}>
                {cmd.output}
              </pre>
            )}
          </div>
        ))}

        {/* Current Input */}
        <div className="flex items-center gap-2 text-green-400">
          <span className="text-blue-400">researcher@crowe-logic</span>
          <span className="text-yellow-400">~{workingDirectory.replace("/home/researcher", "")}</span>
          <ChevronRight className="h-3 w-3" />
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="flex-1 bg-transparent outline-none text-white caret-green-400"
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}
