"use client"

import { Database, FileText, Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const MOCK_DATASETS = [
  { id: 1, name: "Human Genome (GRCh38)", type: "Genomic", size: "3.2 GB" },
  { id: 2, name: "UniProtKB/Swiss-Prot", type: "Proteomic", size: "1.5 GB" },
  { id: 3, name: "Cancer Cell Line Encyclopedia", type: "Expression", size: "500 MB" },
  { id: 4, name: "1000 Genomes Project", type: "Genomic", size: "200 TB" },
  { id: 5, name: "PDB Structures", type: "Structural", size: "50 GB" },
]

export function DatasetBrowser() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="space-y-2">
        <div className="text-xs font-semibold text-muted-foreground">DATASETS</div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search datasets..." className="h-8 pl-8 text-xs" />
        </div>
      </div>

      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="space-y-1">
          {MOCK_DATASETS.map((dataset) => (
            <div
              key={dataset.id}
              className="group flex items-center justify-between rounded-md p-2 text-sm hover:bg-muted/50 cursor-pointer"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Database className="h-4 w-4 flex-shrink-0 text-blue-500" />
                <div className="truncate">
                  <div className="font-medium truncate">{dataset.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {dataset.type} • {dataset.size}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon-sm" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Button variant="outline" size="sm" className="w-full bg-transparent">
        <FileText className="mr-2 h-3.5 w-3.5" />
        Upload Dataset
      </Button>
    </div>
  )
}
