'use client'

import { X } from 'lucide-react'
import { KEYBOARD_SHORTCUTS, formatShortcut } from '@/lib/keyboard-shortcuts'

interface KeyboardShortcutsDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  if (!open) return null

  const shortcuts = [
    { ...KEYBOARD_SHORTCUTS.SEARCH, label: 'Search' },
    { ...KEYBOARD_SHORTCUTS.THEME_TOGGLE, label: 'Toggle Theme' },
    { ...KEYBOARD_SHORTCUTS.NAVIGATION, label: 'Focus Navigation' },
    { ...KEYBOARD_SHORTCUTS.SKIP_TO_CONTENT, label: 'Skip to Content' },
    { ...KEYBOARD_SHORTCUTS.HELP, label: 'Show Help' },
  ]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => onOpenChange?.(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div
        className="glass-card w-full max-w-2xl mx-4 p-6 rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="shortcuts-title" className="text-2xl font-semibold">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={() => onOpenChange?.(false)}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
              >
                <span className="text-sm font-medium">{shortcut.label}</span>
                <kbd className="px-3 py-1.5 text-sm font-mono bg-background border border-border rounded-md">
                  {formatShortcut(shortcut)}
                </kbd>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-semibold mb-2">Navigation</h3>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Tab</span>
                <span>Next element</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shift + Tab</span>
                <span>Previous element</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Enter</span>
                <span>Activate element</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Escape</span>
                <span>Close dialog</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
