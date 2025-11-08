"use client"

import { useState } from "react"
import { Folder, FolderOpen, File, FileText, Database, ImageIcon, ChevronRight, ChevronDown } from "lucide-react"

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
          extension: "csv",
        },
        {
          id: "species_library.json",
          name: "species_library.json",
          type: "file",
          size: "2.1 MB",
          modified: "1 day ago",
          extension: "json",
        },
      ],
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
          extension: "py",
        },
        {
          id: "yield_prediction.py",
          name: "yield_prediction.py",
          type: "file",
          size: "22.8 KB",
          modified: "1 day ago",
          extension: "py",
        },
      ],
    },
  ])

  const toggleFolder = (nodeId: string) => {
    const updateNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
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
      return file.isExpanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />
    }

    switch (file.extension) {
      case "py":
        return <FileText className="h-4 w-4 text-blue-400" />
      case "csv":
        return <Database className="h-4 w-4 text-green-400" />
      case "json":
        return <FileText className="h-4 w-4 text-yellow-400" />
      case "jpg":
      case "png":
        return <ImageIcon className="h-4 w-4 text-purple-400" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const renderTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent/50 ${
            selectedFile === node.id ? "bg-accent" : ""
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(node.id)
            } else {
              onFileSelect?.(node)
            }
          }}
        >
          {node.type === "folder" && (
            <span className="text-muted-foreground">
              {node.isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </span>
          )}
          {getFileIcon(node)}
          <span className="flex-1 truncate">{node.name}</span>
          {node.size && node.type === "file" && <span className="text-xs text-muted-foreground">{node.size}</span>}
        </div>
        {node.children && node.isExpanded && renderTree(node.children, depth + 1)}
      </div>
    ))
  }

  return (
    <div className="h-full overflow-auto">
      <div className="border-b px-4 py-2">
        <h3 className="text-sm font-semibold">File Explorer</h3>
      </div>
      <div className="py-2">{renderTree(fileTree)}</div>
    </div>
  )
}
