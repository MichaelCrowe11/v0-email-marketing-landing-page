/**
 * Keyboard shortcuts configuration and utilities
 * Provides centralized keyboard shortcut management for the platform
 */

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  meta?: boolean
  description: string
  action: () => void
}

export const KEYBOARD_SHORTCUTS = {
  SEARCH: { key: 'k', ctrl: true, meta: true, description: 'Open search' },
  THEME_TOGGLE: { key: 't', ctrl: true, meta: true, description: 'Toggle theme' },
  NAVIGATION: { key: 'n', ctrl: true, meta: true, description: 'Focus navigation' },
  SKIP_TO_CONTENT: { key: 's', ctrl: true, meta: true, description: 'Skip to main content' },
  HELP: { key: '?', shift: true, description: 'Show keyboard shortcuts' },
} as const

/**
 * Check if a keyboard event matches a shortcut definition
 */
export function matchesShortcut(
  event: KeyboardEvent,
  shortcut: { key: string; ctrl?: boolean; alt?: boolean; shift?: boolean; meta?: boolean }
): boolean {
  const key = event.key.toLowerCase()
  const ctrl = event.ctrlKey || event.metaKey
  const alt = event.altKey
  const shift = event.shiftKey

  return (
    key === shortcut.key.toLowerCase() &&
    (shortcut.ctrl ? ctrl : !ctrl || !shortcut.meta) &&
    (shortcut.alt ? alt : !alt) &&
    (shortcut.shift ? shift : !shift)
  )
}

/**
 * Format shortcut for display
 */
export function formatShortcut(shortcut: {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  meta?: boolean
}): string {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const parts: string[] = []

  if (shortcut.ctrl || shortcut.meta) {
    parts.push(isMac ? '⌘' : 'Ctrl')
  }
  if (shortcut.alt) {
    parts.push(isMac ? '⌥' : 'Alt')
  }
  if (shortcut.shift) {
    parts.push(isMac ? '⇧' : 'Shift')
  }
  parts.push(shortcut.key.toUpperCase())

  return parts.join(isMac ? '' : '+')
}
