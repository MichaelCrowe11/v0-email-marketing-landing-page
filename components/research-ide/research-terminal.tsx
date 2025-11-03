"use client"

import { useState, useRef, useEffect } from "react"
import { Terminal, ChevronRight, Folder, File, Database, Brain, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

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
drwxr-xr-x  8 researcher  staff   256 Nov  2 16:30 .
drwxr-xr-x  5 researcher  staff   160 Nov  2 16:29 ..
-rw-r--r--  1 researcher  staff  30GB Nov  2 16:30 mushroom_cultivation_data.csv
drwxr-xr-x  3 researcher  staff    96 Nov  2 16:30 analysis_scripts/
drwxr-xr-x  4 researcher  staff   128 Nov  2 16:30 models/
-rw-r--r--  1 researcher  staff  2.1M Nov  2 16:30 species_library.json
drwxr-xr-x  2 researcher  staff    64 Nov  2 16:30 results/`,
      timestamp: new Date(),
      type: "success"
    }
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

  // Focus input on click
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }

    const terminal = terminalRef.current
    if (terminal) {
      terminal.addEventListener('click', handleClick)
      return () => terminal.removeEventListener('click', handleClick)
    }
  }, [])

  const executeCommand = async () => {
    if (!currentCommand.trim() || isProcessing) return

    setIsProcessing(true)
    const cmd = currentCommand.trim()

    // Simulate command processing
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500))

    let output = ""
    let type: "success" | "error" | "info" = "success"

    // Simulate different commands
    if (cmd.startsWith("ls")) {
      output = `mushroom_cultivation_data.csv    30GB    Nov 2 16:30
analysis_scripts/               4KB     Nov 2 16:25
models/                        128MB    Nov 2 16:28
species_library.json           2.1MB    Nov 2 16:30
results/                       256KB    Nov 2 16:32
contamination_analysis.py      15KB     Nov 2 16:31
yield_prediction.ipynb         892KB    Nov 2 16:33`
    } else if (cmd.startsWith("cd")) {
      const path = cmd.split(" ")[1] || "~"
      setWorkingDirectory(path === "~" ? "/home/researcher" : `${workingDirectory}/${path}`)
      output = ""
    } else if (cmd.startsWith("python")) {
      output = `Python 3.11.5 | packaged by conda-forge
>>> Importing required libraries...
>>> Loading mushroom cultivation dataset...
>>> Dataset shape: (1,547,823 rows × 47 columns)
>>> Memory usage: 2.8 GB
>>> Ready for analysis

Available modules:
- pandas, numpy, scipy, scikit-learn
- matplotlib, seaborn, plotly
- tensorflow, pytorch, xgboost
- custom mushroom analysis toolkit`
    } else if (cmd.includes("crowe-logic")) {
      output = `🧠 CROWE LOGIC Research Assistant Activated
🔬 Specialized in mycological data analysis
🚀 GPU acceleration enabled
🌐 Connected to fungal knowledge base

Available commands:
  crowe-logic analyze [dataset]     - AI-powered data analysis
  crowe-logic predict [model]       - Yield/contamination predictions
  crowe-logic optimize [parameters] - Cultivation optimization
  crowe-logic chat                  - Interactive research assistance

Ready to assist with your mushroom research!`
    } else if (cmd.includes("head mushroom")) {
      output = `species,substrate,inoculation_date,harvest_date,temperature_avg,humidity_avg,co2_level,yield_wet_g,yield_dry_g,contamination_rate,ph_level,moisture_content
Pleurotus_ostreatus,oak_sawdust,2024-01-15,2024-02-28,72.3,85.2,1200,2456.7,245.2,0.02,6.8,0.65
Shiitake,oak_logs,2024-01-20,2024-04-15,68.5,78.9,1100,1789.3,178.4,0.01,6.2,0.58
Pleurotus_eryngii,cotton_hulls,2024-01-22,2024-03-08,74.1,88.7,1350,3201.5,312.8,0.03,7.1,0.72
Ganoderma_lucidum,hardwood_chips,2024-01-25,2024-06-12,70.8,82.4,980,892.6,89.1,0.01,6.5,0.45
Lion's_Mane,beech_sawdust,2024-01-28,2024-03-20,71.2,84.6,1250,1967.8,196.3,0.02,6.9,0.62`
    } else if (cmd.includes("nvidia-smi") || cmd.includes("gpu")) {
      output = `+-----------------------------------------------------------------------------+
| NVIDIA-SMI 535.104.05   Driver Version: 535.104.05   CUDA Version: 12.2     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  RTX 4090           Off  | 00000000:01:00.0  On |                  Off |
| 35%   42C    P2    85W / 450W |   8192MiB / 24564MiB |     45%      Default |
+-------------------------------+----------------------+----------------------+

GPU ready for ML model training and large dataset processing`
    } else if (cmd.includes("top") || cmd.includes("htop")) {
      output = `  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
 2156 research  20   0 18.2g   2.8g   1.2g R  89.7 11.2   4:23.45 python
 2234 research  20   0  8.1g   1.4g   890m S  45.3  5.6   2:15.67 jupyter-lab
 2311 research  20   0  4.2g   820m   456m S  23.1  3.2   1:08.23 node
 1987 research  20   0  2.1g   512m   234m S  12.4  2.0   0:34.56 crowe-logic

Memory: 24.0GB total, 18.2GB used, 5.8GB free
Swap:   8.0GB total, 0.2GB used, 7.8GB free

Active processes: Mushroom data analysis pipeline running`
    } else if (cmd.includes("jupyter")) {
      output = `Starting Jupyter Lab...
[I 16:45:23.456 LabApp] Serving notebooks from /home/researcher/mushroom-research
[I 16:45:23.456 LabApp] Jupyter Lab is running at:
[I 16:45:23.456 LabApp] http://localhost:8888/?token=abc123def456
[I 16:45:23.456 LabApp] or http://127.0.0.1:8888/?token=abc123def456

📊 Mushroom Analysis Notebooks Available:
- contamination_prediction.ipynb
- yield_optimization.ipynb
- substrate_comparison.ipynb
- species_classification.ipynb`
    } else if (cmd.includes("docker")) {
      output = `CONTAINER ID   IMAGE              COMMAND                  STATUS         PORTS
a1b2c3d4e5f6   tensorflow/tf   "jupyter-lab --allo…"   Up 2 hours     0.0.0.0:8888->8888/tcp
f6e5d4c3b2a1   mysql:8.0       "docker-entrypoint.s…"  Up 2 hours     0.0.0.0:3306->3306/tcp
9z8y7x6w5v4u   redis:alpine    "docker-entrypoint.s…"  Up 2 hours     0.0.0.0:6379->6379/tcp

🐳 Research environment containers running
📊 All data services operational`
    } else if (cmd.includes("git")) {
      output = `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   analysis_scripts/contamination_model.py
	modified:   results/yield_analysis_2024.csv

Untracked files:
  (use "git add <file>..." to include in what will be committed)

	new_strain_analysis.ipynb
	models/best_yield_predictor_v2.pkl

Research progress: 47 commits, 15 experiments completed`
    } else {
      // Unknown command
      type = "error"
      output = `zsh: command not found: ${cmd}

Available research commands:
  ls, cd, python, jupyter, docker, git
  crowe-logic [command] - AI research assistant
  head mushroom_cultivation_data.csv - View dataset
  nvidia-smi - Check GPU status
  htop - Monitor system resources`
    }

    const newCommand: TerminalCommand = {
      id: Date.now().toString(),
      command: cmd,
      output,
      timestamp: new Date(),
      type
    }

    setCommands(prev => [...prev, newCommand])
    setCurrentCommand("")
    setIsProcessing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      executeCommand()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      // Could implement command history here
    }
  }

  const getPromptColor = () => {
    return "text-green-400"
  }

  const formatOutput = (cmd: TerminalCommand) => {
    const color = cmd.type === "error" ? "text-red-400" :
                 cmd.type === "info" ? "text-blue-400" : "text-foreground"

    return (
      <div key={cmd.id} className="mb-2">
        <div className="flex items-center gap-2">
          <span className={getPromptColor()}>researcher@crowe-logic</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-blue-400">{workingDirectory}</span>
          <span className={getPromptColor()}>$</span>
          <span className="text-foreground">{cmd.command}</span>
        </div>
        {cmd.output && (
          <pre className={`${color} whitespace-pre-wrap font-mono text-sm mt-1 leading-relaxed`}>
            {cmd.output}
          </pre>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-black/95 text-green-400 rounded-lg border border-border overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-3 bg-accent/10 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <Terminal className="w-4 h-4" />
          <span className="text-sm font-mono">Research Terminal</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Database className="w-3 h-3" />
            <span>30GB Dataset</span>
          </div>
          <div className="flex items-center gap-1">
            <Brain className="w-3 h-3" />
            <span>CROWE LOGIC</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>GPU Ready</span>
          </div>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 p-4 overflow-auto font-mono text-sm"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.95)" }}
      >
        {/* Welcome Message */}
        <div className="mb-4 text-cyan-400">
          <pre>{`
╔══════════════════════════════════════════════════╗
║           🍄 CROWE LOGIC Research Terminal        ║
║               Mushroom Data Analysis Suite       ║
╚══════════════════════════════════════════════════╝

Welcome to the Advanced Mycological Research Environment
- 30GB cultivation dataset loaded and indexed
- ML models: TensorFlow, PyTorch, XGBoost ready
- GPU acceleration enabled for deep learning
- CROWE LOGIC AI assistant standing by

Type 'crowe-logic help' for AI assistance commands
`}</pre>
        </div>

        {/* Command History */}
        {commands.map(formatOutput)}

        {/* Current Input */}
        <div className="flex items-center gap-2">
          <span className={getPromptColor()}>researcher@crowe-logic</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-blue-400">{workingDirectory}</span>
          <span className={getPromptColor()}>$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="flex-1 bg-transparent border-none outline-none text-foreground font-mono"
            placeholder={isProcessing ? "Processing..." : "Enter command..."}
            autoFocus
          />
          {isProcessing && (
            <div className="w-2 h-4 bg-green-400 animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2 p-2 bg-accent/10 border-t border-border text-xs">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => setCurrentCommand("crowe-logic analyze mushroom_cultivation_data.csv")}
        >
          🧠 AI Analysis
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => setCurrentCommand("python contamination_analysis.py")}
        >
          🐍 Run Python
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => setCurrentCommand("jupyter lab")}
        >
          📊 Jupyter
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => setCurrentCommand("head mushroom_cultivation_data.csv")}
        >
          👁️ View Data
        </Button>
      </div>
    </div>
  )
}