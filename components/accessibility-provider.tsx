'use client'

import { useEffect } from 'react'
import { useAccessibilityPreferences } from '@/lib/hooks/use-accessibility-preferences'

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { preferences, mounted } = useAccessibilityPreferences()

  useEffect(() => {
    if (!mounted) return

    // Apply preferences to document
    if (preferences.reducedMotion) {
      document.documentElement.classList.add('reduce-motion')
    } else {
      document.documentElement.classList.remove('reduce-motion')
    }

    if (preferences.highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }

    document.documentElement.setAttribute('data-font-size', preferences.fontSize)
  }, [preferences, mounted])

  return <>{children}</>
}
