"use client"

import { Terminal, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function TerminalOutput() {
  return (
    <div className="flex h-full flex-col bg-black text-green-400 font-mono text-sm">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          <span className="font-semibold">Terminal</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" className="h-6 w-6 text-muted-foreground hover:text-foreground">
            <Trash2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="h-6 w-6 text-muted-foreground hover:text-foreground">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-1">
          <div>$ python main.py</div>
          <div className="text-white/80">
            Analysis Results: {"{"} 'length': 14, 'gc_content': 42.857142857142854 {"}"}
          </div>
          <div className="animate-pulse">_</div>
        </div>
      </ScrollArea>
    </div>
  )
}
