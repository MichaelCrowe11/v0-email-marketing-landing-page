"use client"

import { Brain, Eye, Zap, ChevronDown, Code2, Sparkles, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type AgentType = "deepparallel" | "deepthought" | "deepvision" | "crowelogic" | "o1" | "deepseek"

interface Agent {
  id: AgentType
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  specialty: string
}

const agents: Agent[] = [
  {
    id: "deepparallel",
    name: "DeepParallel",
    description: "Fast tactical reasoning with parallel processing",
    icon: Zap,
    color: "from-cyan-400 to-blue-500",
    specialty: "Quick Analysis",
  },
  {
    id: "deepthought",
    name: "DeepThought",
    description: "Deep philosophical reasoning and complex problem solving",
    icon: Brain,
    color: "from-purple-400 to-pink-500",
    specialty: "Deep Reasoning",
  },
  {
    id: "deepvision",
    name: "DeepVision",
    description: "Visual analysis and image understanding",
    icon: Eye,
    color: "from-green-400 to-amber-500",
    specialty: "Vision Analysis",
  },
  {
    id: "crowelogic",
    name: "Crowe Logic",
    description: "Advanced agentic coding assistant with research capabilities",
    icon: Code2,
    color: "from-orange-400 to-red-500",
    specialty: "Agentic Coding",
  },
  {
    id: "o1",
    name: "Crowe Logic Reasoning",
    description: "Deep reasoning engine for complex problem-solving and architecture",
    icon: Sparkles,
    color: "from-violet-400 to-fuchsia-500",
    specialty: "Advanced Reasoning",
  },
  {
    id: "deepseek",
    name: "Crowe Code",
    description: "High-speed code generation with deep reasoning capabilities",
    icon: Cpu,
    color: "from-blue-400 to-indigo-500",
    specialty: "Fast Coding",
  },
]

interface AgentSwitcherProps {
  currentAgent: AgentType
  onAgentChange: (agent: AgentType) => void
  disabled?: boolean
}

export function AgentSwitcher({ currentAgent, onAgentChange, disabled }: AgentSwitcherProps) {
  const current = agents.find(a => a.id === currentAgent) || agents[0]
  const Icon = current.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-2 bg-card/80 backdrop-blur-sm border border-border shadow-sm hover:bg-accent"
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-semibold">{current.name}</span>
          <ChevronDown className="w-3 h-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        {agents.map((agent) => {
          const AgentIcon = agent.icon
          const isActive = agent.id === currentAgent
          return (
            <DropdownMenuItem
              key={agent.id}
              onClick={() => onAgentChange(agent.id)}
              className={`flex items-start gap-3 p-3 cursor-pointer ${
                isActive ? "bg-accent" : ""
              }`}
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${agent.color} bg-opacity-10`}>
                <AgentIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{agent.name}</span>
                  {isActive && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{agent.description}</p>
                <span className="text-[10px] text-muted-foreground mt-1 inline-block">
                  {agent.specialty}
                </span>
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
