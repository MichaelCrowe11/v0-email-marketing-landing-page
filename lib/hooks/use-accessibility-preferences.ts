"use client"

import { useState, useEffect } from 'react'

export interface AccessibilityPreferences {
  reducedMotion: boolean
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
}

const STORAGE_KEY = 'accessibility-preferences'

const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
}

export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(DEFAULT_PREFERENCES)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Load from localStorage
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed })
      } catch (e) {
        console.error('Failed to parse accessibility preferences:', e)
      }
    }

    // Check system preferences
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const highContrastQuery = window.matchMedia('(prefers-contrast: more)')

    const updateSystemPreferences = () => {
      setPreferences((prev) => ({
        ...prev,
        reducedMotion: prev.reducedMotion || reducedMotionQuery.matches,
        highContrast: prev.highContrast || highContrastQuery.matches,
      }))
    }

    updateSystemPreferences()

    // Listen for changes
    reducedMotionQuery.addEventListener('change', updateSystemPreferences)
    highContrastQuery.addEventListener('change', updateSystemPreferences)

    return () => {
      reducedMotionQuery.removeEventListener('change', updateSystemPreferences)
      highContrastQuery.removeEventListener('change', updateSystemPreferences)
    }
  }, [])

  const updatePreferences = (updates: Partial<AccessibilityPreferences>) => {
    const newPreferences = { ...preferences, ...updates }
    setPreferences(newPreferences)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences))

    // Apply to document
    if (updates.reducedMotion !== undefined) {
      document.documentElement.classList.toggle('reduce-motion', updates.reducedMotion)
    }
    if (updates.highContrast !== undefined) {
      document.documentElement.classList.toggle('high-contrast', updates.highContrast)
    }
    if (updates.fontSize) {
      document.documentElement.setAttribute('data-font-size', updates.fontSize)
    }
  }

  const toggleReducedMotion = () => {
    updatePreferences({ reducedMotion: !preferences.reducedMotion })
  }

  const toggleHighContrast = () => {
    updatePreferences({ highContrast: !preferences.highContrast })
  }

  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    updatePreferences({ fontSize: size })
  }

  return {
    preferences,
    updatePreferences,
    toggleReducedMotion,
    toggleHighContrast,
    setFontSize,
    mounted,
  }
}
