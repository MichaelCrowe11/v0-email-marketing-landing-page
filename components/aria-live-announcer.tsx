'use client'

import { useEffect, useState } from 'react'

interface AriaLiveAnnouncerProps {
  message?: string
  priority?: 'polite' | 'assertive'
}

// Global announcer instance
let announceCallback: ((message: string, priority?: 'polite' | 'assertive') => void) | null = null

export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  if (announceCallback) {
    announceCallback(message, priority)
  }
}

export function AriaLiveAnnouncer() {
  const [announcement, setAnnouncement] = useState<{
    message: string
    priority: 'polite' | 'assertive'
  } | null>(null)

  useEffect(() => {
    announceCallback = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      setAnnouncement({ message, priority })
      
      // Clear announcement after it's been read
      setTimeout(() => {
        setAnnouncement(null)
      }, 1000)
    }

    return () => {
      announceCallback = null
    }
  }, [])

  return (
    <>
      {/* Polite announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement?.priority === 'polite' && announcement.message}
      </div>

      {/* Assertive announcements */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement?.priority === 'assertive' && announcement.message}
      </div>
    </>
  )
}
