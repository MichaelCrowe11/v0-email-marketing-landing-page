"use client"

import { useState, useEffect, useRef } from "react"
import { VoiceChat, type VoiceRecognitionResult } from "@/lib/voice-chat"

interface VoiceChatButtonProps {
  onTranscript: (text: string) => void
  disabled?: boolean
}

export function VoiceChatButton({ onTranscript, disabled }: VoiceChatButtonProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState("")
  const voiceChatRef = useRef<VoiceChat | null>(null)

  useEffect(() => {
    voiceChatRef.current = new VoiceChat()
    setIsSupported(voiceChatRef.current.isSupported())

    return () => {
      if (voiceChatRef.current) {
        voiceChatRef.current.stopListening()
      }
    }
  }, [])

  const toggleListening = () => {
    if (!voiceChatRef.current) return

    if (isListening) {
      voiceChatRef.current.stopListening()
      setIsListening(false)
      setInterimTranscript("")
    } else {
      const started = voiceChatRef.current.startListening(
        (result: VoiceRecognitionResult) => {
          if (result.isFinal) {
            onTranscript(result.transcript)
            setInterimTranscript("")
          } else {
            setInterimTranscript(result.transcript)
          }
        },
        (error: string) => {
          console.error("[v0] Voice recognition error:", error)
          setIsListening(false)
          setInterimTranscript("")
        },
      )

      if (started) {
        setIsListening(true)
      }
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={toggleListening}
        disabled={disabled}
        className={`h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
          isListening
            ? "bg-gradient-to-br from-red-500 to-pink-500 text-white animate-pulse"
            : "bg-gradient-to-br from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
        }`}
        aria-label={isListening ? "Stop listening" : "Start voice input"}
      >
        {isListening ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 sm:w-5 sm:h-5"
          >
            <path d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 sm:w-5 sm:h-5"
          >
            <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
            <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
          </svg>
        )}
      </button>

      {interimTranscript && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-card border border-border rounded-lg shadow-lg text-xs text-foreground whitespace-nowrap max-w-xs truncate">
          {interimTranscript}
        </div>
      )}

      {isListening && (
        <div className="absolute -inset-1 bg-gradient-to-br from-red-500/30 to-pink-500/30 rounded-xl blur-md animate-pulse -z-10" />
      )}
    </div>
  )
}
