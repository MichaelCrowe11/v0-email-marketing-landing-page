"use client"

export interface VoiceRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
}

export class VoiceChat {
  private recognition: any
  private synthesis: SpeechSynthesis | null = null
  private isListening = false
  private onResultCallback: ((result: VoiceRecognitionResult) => void) | null = null
  private onErrorCallback: ((error: string) => void) | null = null

  constructor() {
    if (typeof window !== "undefined") {
      // Initialize Web Speech API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
        this.recognition.continuous = true
        this.recognition.interimResults = true
        this.recognition.lang = "en-US"

        this.recognition.onresult = (event: any) => {
          const result = event.results[event.results.length - 1]
          const transcript = result[0].transcript
          const confidence = result[0].confidence
          const isFinal = result.isFinal

          if (this.onResultCallback) {
            this.onResultCallback({ transcript, confidence, isFinal })
          }
        }

        this.recognition.onerror = (event: any) => {
          if (this.onErrorCallback) {
            this.onErrorCallback(event.error)
          }
        }

        this.recognition.onend = () => {
          if (this.isListening) {
            // Restart if we're still supposed to be listening
            this.recognition.start()
          }
        }
      }

      this.synthesis = window.speechSynthesis
    }
  }

  startListening(onResult: (result: VoiceRecognitionResult) => void, onError: (error: string) => void): boolean {
    if (!this.recognition) {
      onError("Speech recognition not supported in this browser")
      return false
    }

    this.onResultCallback = onResult
    this.onErrorCallback = onError
    this.isListening = true

    try {
      this.recognition.start()
      return true
    } catch (error) {
      onError("Failed to start speech recognition")
      return false
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.isListening = false
      this.recognition.stop()
    }
  }

  speak(text: string, onEnd?: () => void) {
    if (!this.synthesis) {
      console.error("Speech synthesis not supported")
      return
    }

    // Cancel any ongoing speech
    this.synthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Try to use a natural-sounding voice
    const voices = this.synthesis.getVoices()
    const preferredVoice =
      voices.find((v) => v.name.includes("Natural") || v.name.includes("Premium")) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0]

    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    if (onEnd) {
      utterance.onend = onEnd
    }

    this.synthesis.speak(utterance)
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  isSupported(): boolean {
    return !!this.recognition && !!this.synthesis
  }
}
