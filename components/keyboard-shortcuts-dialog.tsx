"use client"

import { useEffect, useState } from "react"
import { X, Keyboard } from "lucide-react"
import { KEYBOARD_SHORTCUTS, formatShortcut } from "@/lib/keyboard-shortcuts"

export function KeyboardShortcutsDialog() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Show shortcuts dialog with Shift+?
      if (event.shiftKey && event.key === '?') {
        event.preventDefault()
        setIsOpen(true)
      }
      // Close with Escape
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div
        className="glass-card w-full max-w-2xl mx-4 p-6 rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Keyboard className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 id="shortcuts-title" className="text-2xl font-semibold">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-label="Close keyboard shortcuts dialog"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3">
            {Object.entries(KEYBOARD_SHORTCUTS).map(([key, shortcut]) => (
              <div
                key={key}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <span className="text-sm text-foreground">{shortcut.description}</span>
                <kbd className="px-3 py-1.5 text-xs font-semibold text-foreground bg-muted border border-border rounded-md shadow-sm font-mono">
                  {formatShortcut(shortcut)}
                </kbd>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-semibold mb-2">Navigation</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Navigate through interactive elements</span>
                <kbd className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded">Tab</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Navigate backwards</span>
                <kbd className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded">Shift+Tab</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Navigate menu items</span>
                <kbd className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded">Arrow Keys</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Activate focused element</span>
                <kbd className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded">Enter</kbd>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  )
}
