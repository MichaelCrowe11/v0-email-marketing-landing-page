'use client'

import { useEffect, useState } from 'react'
import { KEYBOARD_SHORTCUTS, matchesShortcut } from '@/lib/keyboard-shortcuts'
import { KeyboardShortcutsDialog } from './keyboard-shortcuts-dialog'

export function GlobalKeyboardHandler() {
  const [showShortcuts, setShowShortcuts] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Show keyboard shortcuts dialog (Shift + ?)
      if (matchesShortcut(event, KEYBOARD_SHORTCUTS.HELP)) {
        event.preventDefault()
        setShowShortcuts(true)
        return
      }

      // Search (Ctrl/Cmd + K)
      if (matchesShortcut(event, KEYBOARD_SHORTCUTS.SEARCH)) {
        event.preventDefault()
        // Trigger search modal (implement based on your search component)
        const searchButton = document.querySelector('[data-search-trigger]') as HTMLElement
        searchButton?.click()
        return
      }

      // Theme toggle (Ctrl/Cmd + T)
      if (matchesShortcut(event, KEYBOARD_SHORTCUTS.THEME_TOGGLE)) {
        event.preventDefault()
        const themeButton = document.querySelector('[data-theme-toggle]') as HTMLElement
        themeButton?.click()
        return
      }

      // Focus navigation (Ctrl/Cmd + N)
      if (matchesShortcut(event, KEYBOARD_SHORTCUTS.NAVIGATION)) {
        event.preventDefault()
        const nav = document.querySelector('nav') as HTMLElement
        const firstLink = nav?.querySelector('a, button') as HTMLElement
        firstLink?.focus()
        return
      }

      // Skip to content (Ctrl/Cmd + S)
      if (matchesShortcut(event, KEYBOARD_SHORTCUTS.SKIP_TO_CONTENT)) {
        event.preventDefault()
        const mainContent = document.getElementById('main-content')
        mainContent?.focus()
        mainContent?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <KeyboardShortcutsDialog
      open={showShortcuts}
      onOpenChange={setShowShortcuts}
    />
  )
}
