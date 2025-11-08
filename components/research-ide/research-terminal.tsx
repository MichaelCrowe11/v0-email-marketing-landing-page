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
      command: "help",
      output: `CROWE CODE Research Terminal v2.1
Available Commands:
  ls              - List files and directories
  cd [dir]        - Change directory
  python [file]   - Run Python script
  crowe [prompt]  - Invoke Crowe Code autonomous coding assistant
  analyze [type]  - Run data analysis (batches, contamination, yield)
  help            - Show this help message
  clear           - Clear terminal
  
Type 'crowe' followed by what you want to build and Crowe Code will write the code for you.
Example: crowe analyze contamination patterns`,
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

    if (cmd.startsWith("crowe ")) {
      const prompt = cmd.substring(6).trim()
      output = `🧬 CROWE CODE ACTIVATED
Analyzing request: "${prompt}"
Generating code...

▓▓▓▓▓▓▓▓▓▓ 100%

✓ Code generation complete
✓ Optimized for research data
✓ Ready for execution

To view generated code, switch to the "Crowe Code" tab.`
      type = "success"

      // Trigger code generation in background
      fetch("/api/crowe-code/autonomous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      }).catch(console.error)
    } else if (cmd.startsWith("analyze ")) {
      const analysisType = cmd.substring(8).trim()
      output = `🔬 Running ${analysisType} analysis...
📊 Querying database...
✓ Retrieved ${Math.floor(Math.random() * 10000)} records
✓ Analysis complete

Results saved to: /results/${analysisType}_${Date.now()}.json`
    } else if (cmd.startsWith("ls")) {
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
      output = `CROWE CODE Research Terminal v2.1
Available Commands:
  ls              - List files and directories
  cd [dir]        - Change directory
  python [file]   - Run Python script
  crowe [prompt]  - Invoke Crowe Code autonomous coding assistant
  analyze [type]  - Run data analysis (batches, contamination, yield)
  help            - Show this help message
  clear           - Clear terminal
  
Type 'crowe' followed by what you want to build and Crowe Code will write the code for you.
Example: crowe analyze contamination patterns`
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
    <div className="flex h-full flex-col bg-black font-mono text-sm border border-neutral-800">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 border-b border-neutral-700 bg-neutral-900 px-4 py-2">
        <Terminal className="h-4 w-4 text-neutral-400" />
        <span className="text-xs text-neutral-300 font-medium">CROWE LOGIC Research Terminal</span>
      </div>

      {/* Terminal Content */}
      <div ref={terminalRef} className="flex-1 overflow-auto p-4">
        {commands.map((cmd) => (
          <div key={cmd.id} className="mb-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-400">researcher@crowe-logic</span>
              <span className="text-yellow-300">~{workingDirectory.replace("/home/researcher", "")}</span>
              <ChevronRight className="h-3 w-3 text-neutral-400" />
              <span className="text-white">{cmd.command}</span>
            </div>
            {cmd.output && (
              <pre
                className={`mt-1 whitespace-pre-wrap text-sm ${cmd.type === "error" ? "text-red-400" : "text-neutral-300"}`}
              >
                {cmd.output}
              </pre>
            )}
          </div>
        ))}

        {/* Current Input */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-blue-400">researcher@crowe-logic</span>
          <span className="text-yellow-300">~{workingDirectory.replace("/home/researcher", "")}</span>
          <ChevronRight className="h-3 w-3 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="flex-1 bg-transparent outline-none text-white caret-white"
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}
