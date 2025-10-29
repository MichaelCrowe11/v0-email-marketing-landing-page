"use client"

import { useState } from "react"
import { Settings, Eye, Zap, Type, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAccessibilityPreferences } from "@/lib/hooks/use-accessibility-preferences"

export function AccessibilitySettings() {
  const [isOpen, setIsOpen] = useState(false)
  const { preferences, toggleReducedMotion, toggleHighContrast, setFontSize, mounted } = useAccessibilityPreferences()

  if (!mounted) return null

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 px-0"
        onClick={() => setIsOpen(true)}
        aria-label="Accessibility settings"
        title="Accessibility settings"
      >
        <Eye className="h-4 w-4" aria-hidden="true" />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-title"
        >
          <div
            className="glass-card w-full max-w-md mx-4 p-6 rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 id="accessibility-title" className="text-2xl font-semibold">
                  Accessibility
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label="Close accessibility settings"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Reduced Motion */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <h3 className="font-semibold">Reduce Motion</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Minimize animations and transitions for a calmer experience
                </p>
                <button
                  onClick={toggleReducedMotion}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                    preferences.reducedMotion ? 'bg-primary' : 'bg-muted'
                  }`}
                  role="switch"
                  aria-checked={preferences.reducedMotion}
                  aria-label="Toggle reduced motion"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* High Contrast */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <h3 className="font-semibold">High Contrast</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Increase contrast for better readability
                </p>
                <button
                  onClick={toggleHighContrast}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                    preferences.highContrast ? 'bg-primary' : 'bg-muted'
                  }`}
                  role="switch"
                  aria-checked={preferences.highContrast}
                  aria-label="Toggle high contrast"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <h3 className="font-semibold">Font Size</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Adjust text size for comfortable reading
                </p>
                <div className="flex gap-2" role="radiogroup" aria-label="Font size options">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                        preferences.fontSize === size
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:bg-accent'
                      }`}
                      role="radio"
                      aria-checked={preferences.fontSize === size}
                      aria-label={`${size.charAt(0).toUpperCase() + size.slice(1)} font size`}
                    >
                      <span className="capitalize">{size}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                These settings are saved to your browser and will persist across sessions
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
