"use client"

import { useState } from "react"
import {
  Folder,
  FolderOpen,
  File,
  FileText,
  Database,
  Image,
  Play,
  ChevronRight,
  ChevronDown,
  Upload,
  Plus,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  size?: string
  modified?: string
  children?: FileNode[]
  isExpanded?: boolean
  extension?: string
}

interface FileExplorerProps {
  onFileSelect?: (file: FileNode) => void
  selectedFile?: string
}

export function FileExplorer({ onFileSelect, selectedFile }: FileExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [fileTree, setFileTree] = useState<FileNode[]>([
    {
      id: "datasets",
      name: "datasets",
      type: "folder",
      isExpanded: true,
      children: [
        {
          id: "mushroom_cultivation_data.csv",
          name: "mushroom_cultivation_data.csv",
          type: "file",
          size: "30.2 GB",
          modified: "2 hours ago",
          extension: "csv"
        },
        {
          id: "species_library.json",
          name: "species_library.json",
          type: "file",
          size: "2.1 MB",
          modified: "1 day ago",
          extension: "json"
        },
        {
          id: "contamination_samples",
          name: "contamination_samples",
          type: "folder",
          children: [
            {
              id: "trichoderma_images",
              name: "trichoderma_images",
              type: "folder",
              children: [
                { id: "sample_001.jpg", name: "sample_001.jpg", type: "file", size: "2.3 MB", extension: "jpg" },
                { id: "sample_002.jpg", name: "sample_002.jpg", type: "file", size: "1.8 MB", extension: "jpg" },
                { id: "sample_003.jpg", name: "sample_003.jpg", type: "file", size: "2.1 MB", extension: "jpg" }
              ]
            }
          ]
        },
        {
          id: "substrate_analysis.xlsx",
          name: "substrate_analysis.xlsx",
          type: "file",
          size: "15.6 MB",
          modified: "3 days ago",
          extension: "xlsx"
        }
      ]
    },
    {
      id: "scripts",
      name: "analysis_scripts",
      type: "folder",
      isExpanded: true,
      children: [
        {
          id: "contamination_detection.py",
          name: "contamination_detection.py",
          type: "file",
          size: "15.2 KB",
          modified: "4 hours ago",
          extension: "py"
        },
        {
          id: "yield_prediction.py",
          name: "yield_prediction.py",
          type: "file",
          size: "22.8 KB",
          modified: "1 day ago",
          extension: "py"
        },
        {
          id: "substrate_optimization.py",
          name: "substrate_optimization.py",
          type: "file",
          size: "18.4 KB",
          modified: "2 days ago",
          extension: "py"
        },
        {
          id: "data_preprocessing.py",
          name: "data_preprocessing.py",
          type: "file",
          size: "12.1 KB",
          modified: "3 days ago",
          extension: "py"
        }
      ]
    },
    {
      id: "notebooks",
      name: "jupyter_notebooks",
      type: "folder",
      children: [
        {
          id: "exploratory_analysis.ipynb",
          name: "exploratory_analysis.ipynb",
          type: "file",
          size: "892 KB",
          modified: "5 hours ago",
          extension: "ipynb"
        },
        {
          id: "ml_model_training.ipynb",
          name: "ml_model_training.ipynb",
          type: "file",
          size: "1.2 MB",
          modified: "1 day ago",
          extension: "ipynb"
        },
        {
          id: "contamination_analysis.ipynb",
          name: "contamination_analysis.ipynb",
          type: "file",
          size: "756 KB",
          modified: "2 days ago",
          extension: "ipynb"
        }
      ]
    },
    {
      id: "models",
      name: "trained_models",
      type: "folder",
      children: [
        {
          id: "yield_predictor_v2.pkl",
          name: "yield_predictor_v2.pkl",
          type: "file",
          size: "128 MB",
          modified: "6 hours ago",
          extension: "pkl"
        },
        {
          id: "contamination_classifier.h5",
          name: "contamination_classifier.h5",
          type: "file",
          size: "245 MB",
          modified: "1 day ago",
          extension: "h5"
        },
        {
          id: "substrate_optimizer.onnx",
          name: "substrate_optimizer.onnx",
          type: "file",
          size: "89 MB",
          modified: "3 days ago",
          extension: "onnx"
        }
      ]
    },
    {
      id: "results",
      name: "research_results",
      type: "folder",
      children: [
        {
          id: "yield_analysis_2024.csv",
          name: "yield_analysis_2024.csv",
          type: "file",
          size: "45.2 MB",
          modified: "1 hour ago",
          extension: "csv"
        },
        {
          id: "contamination_report.pdf",
          name: "contamination_report.pdf",
          type: "file",
          size: "8.3 MB",
          modified: "2 days ago",
          extension: "pdf"
        },
        {
          id: "optimization_plots",
          name: "optimization_plots",
          type: "folder",
          children: [
            { id: "yield_vs_temp.png", name: "yield_vs_temp.png", type: "file", size: "1.2 MB", extension: "png" },
            { id: "contamination_heatmap.png", name: "contamination_heatmap.png", type: "file", size: "950 KB", extension: "png" },
            { id: "substrate_comparison.png", name: "substrate_comparison.png", type: "file", size: "1.5 MB", extension: "png" }
          ]
        }
      ]
    }
  ])

  const toggleFolder = (nodeId: string) => {
    const updateNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId && node.type === "folder") {
          return { ...node, isExpanded: !node.isExpanded }
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) }
        }
        return node
      })
    }
    setFileTree(updateNode(fileTree))
  }

  const getFileIcon = (file: FileNode) => {
    if (file.type === "folder") {
      return file.isExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />
    }

    switch (file.extension) {
      case "py": return <File className="w-4 h-4 text-yellow-400" />
      case "ipynb": return <FileText className="w-4 h-4 text-orange-400" />
      case "csv":
      case "xlsx": return <Database className="w-4 h-4 text-green-400" />
      case "jpg":
      case "png": return <Image className="w-4 h-4 text-purple-400" />
      case "pkl":
      case "h5":
      case "onnx": return <Play className="w-4 h-4 text-blue-400" />
      default: return <File className="w-4 h-4" />
    }
  }

  const getFileColor = (file: FileNode) => {
    if (file.id === selectedFile) {
      return "bg-primary/20 text-primary border-primary/50"
    }
    return "hover:bg-accent/50 text-foreground"
  }

  const renderNode = (node: FileNode, depth = 0) => {
    const filteredChildren = node.children?.filter(child =>
      child.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-colors ${getFileColor(node)}`}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(node.id)
            } else {
              onFileSelect?.(node)
            }
          }}
        >
          {node.type === "folder" && (
            <div className="w-4 h-4 flex items-center justify-center">
              {node.isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </div>
          )}

          {getFileIcon(node)}

          <span className="flex-1 text-sm truncate">{node.name}</span>

          {node.size && (
            <span className="text-xs text-muted-foreground">{node.size}</span>
          )}
        </div>

        {node.type === "folder" && node.isExpanded && filteredChildren && (
          <div>
            {filteredChildren.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4" />
          <span className="font-medium text-sm">Research Files</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Plus className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Upload className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 h-8 text-sm"
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-auto p-2">
        {fileTree.map(node => renderNode(node))}
      </div>

      {/* Status */}
      <div className="flex items-center justify-between p-2 border-t border-border text-xs text-muted-foreground">
        <span>30.8 GB total</span>
        <span>1,247 files</span>
      </div>
    </div>
  )
}