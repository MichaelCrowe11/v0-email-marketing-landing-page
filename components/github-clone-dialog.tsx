"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GitBranch, Loader2 } from "lucide-react"

interface GitHubCloneDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCloneSuccess: (repository: any) => void
}

export function GitHubCloneDialog({ open, onOpenChange, onCloneSuccess }: GitHubCloneDialogProps) {
  const [repoUrl, setRepoUrl] = useState("")
  const [isCloning, setIsCloning] = useState(false)
  const [error, setError] = useState("")

  const handleClone = async () => {
    setError("")
    setIsCloning(true)

    try {
      const response = await fetch("/api/github/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to clone repository")
        setIsCloning(false)
        return
      }

      onCloneSuccess(data.repository)
      onOpenChange(false)
      setRepoUrl("")
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsCloning(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#252526] border-[#3e3e42] text-[#cccccc]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#e0e0e0]">
            <GitBranch className="w-5 h-5 text-[#0078d4]" />
            Clone Repository
          </DialogTitle>
          <DialogDescription className="text-[#969696]">
            Enter a GitHub repository URL to clone into your workspace
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="repo-url" className="text-[#cccccc]">
              Repository URL
            </Label>
            <Input
              id="repo-url"
              placeholder="https://github.com/username/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="bg-[#1e1e1e] border-[#3e3e42] text-[#cccccc]"
            />
          </div>

          {error && <p className="text-sm text-[#f48771]">{error}</p>}

          <div className="text-xs text-[#858585] space-y-1">
            <p>Examples:</p>
            <p>• https://github.com/MichaelCrowe11/synapse-lang</p>
            <p>• https://github.com/vercel/next.js</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-[#cccccc]">
            Cancel
          </Button>
          <Button
            onClick={handleClone}
            disabled={!repoUrl || isCloning}
            className="bg-[#0078d4] hover:bg-[#1084d8] text-white"
          >
            {isCloning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cloning...
              </>
            ) : (
              <>
                <GitBranch className="w-4 h-4 mr-2" />
                Clone
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
