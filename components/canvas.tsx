"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"

interface CanvasProps {
  isOpen: boolean
  onClose: () => void
  initialContent?: string
}

export function Canvas({ isOpen, onClose, initialContent = "" }: CanvasProps) {
  const [content, setContent] = useState(initialContent)
  const [title, setTitle] = useState("Untitled Document")

  const exportAsMarkdown = () => {
    const blob = new Blob([`# ${title}\n\n${content}`], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportAsText = () => {
    const blob = new Blob([`${title}\n\n${content}`], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[80vh] flex flex-col bg-card border-border">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 text-foreground"
              placeholder="Document Title"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 mr-2"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={exportAsText}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 mr-2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                .txt
              </Button>
              <Button variant="outline" size="sm" onClick={exportAsMarkdown}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 mr-2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                .md
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-4 pt-4">
          <div className="flex-1 flex flex-col">
            <div className="text-xs text-muted-foreground mb-2 font-medium">Editor</div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full p-4 bg-muted/30 border border-border rounded-lg text-sm text-foreground font-mono resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              placeholder="Start writing or paste content here..."
            />
          </div>

          <div className="flex-1 flex flex-col">
            <div className="text-xs text-muted-foreground mb-2 font-medium">Preview</div>
            <div className="flex-1 p-4 bg-background border border-border rounded-lg overflow-y-auto">
              <div className="prose prose-sm max-w-none text-foreground">
                <h1 className="text-xl font-bold mb-4">{title}</h1>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{content}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4 flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {content.length} characters • {content.split(/\s+/).filter(Boolean).length} words
          </div>
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
