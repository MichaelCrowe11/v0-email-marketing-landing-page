"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface CodeGenerationIntroProps {
  onComplete: () => void
}

export function CodeGenerationIntro({ onComplete }: CodeGenerationIntroProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 2
      })
    }, 30)

    if (progress >= 100) {
      setTimeout(onComplete, 500)
    }

    return () => clearInterval(timer)
  }, [progress, onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 relative border-2 border-border rounded-full p-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0059-uidEXFLqOMKCV8KKSQzX49Du7xOv3w.png"
              alt="Crowe Logic"
              fill
              className="object-contain rounded-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Crowe Logic</h1>
          <p className="text-xl text-muted-foreground">Professional Agricultural Research Platform</p>
        </div>

        <div className="space-y-3">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-muted-foreground font-mono tabular-nums">Initializing platform... {progress}%</p>
        </div>

        {progress >= 100 && (
          <Button onClick={onComplete} size="lg" className="animate-fade-in">
            Enter Platform
          </Button>
        )}

        <button
          onClick={onComplete}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
        >
          Skip →
        </button>
      </div>
    </div>
  )
}
