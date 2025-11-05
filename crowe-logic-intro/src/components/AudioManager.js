/**
 * Audio Manager for Crowe Logic Intro
 * Handles all sound effects and ambient audio
 */

class AudioManager {
  constructor() {
    this.sounds = {}
    this.enabled = false
    this.muted = false
    this.masterVolume = 0.3
    this.init()
  }

  init() {
    // Respect user preference for reduced motion
    if (this.prefersReducedMotion()) {
      console.log('AudioManager: Reduced motion preferred, disabling audio')
      return
    }

    // Load audio files
    this.loadSounds()

    // Enable on first user interaction (autoplay policy compliance)
    this.enableOnInteraction()
  }

  loadSounds() {
    // Main ambient space drone (loops throughout intro)
    this.sounds.ambient = new Audio('assets/sounds/space-ambient.mp3')
    this.sounds.ambient.loop = true
    this.sounds.ambient.volume = 0.3 * this.masterVolume

    // Big bang impact (plays immediately)
    this.sounds.impact = new Audio('assets/sounds/big-bang-impact.mp3')
    this.sounds.impact.volume = 0.6 * this.masterVolume

    // Particle expansion whoosh
    this.sounds.expansion = new Audio('assets/sounds/particle-expansion.mp3')
    this.sounds.expansion.volume = 0.4 * this.masterVolume

    // Stellar twinkle effects
    this.sounds.twinkle = new Audio('assets/sounds/stellar-twinkle.mp3')
    this.sounds.twinkle.volume = 0.25 * this.masterVolume

    // Avatar reveal chord
    this.sounds.avatar = new Audio('assets/sounds/avatar-reveal.mp3')
    this.sounds.avatar.volume = 0.5 * this.masterVolume

    // Preload all sounds
    Object.values(this.sounds).forEach(sound => {
      sound.preload = 'auto'

      // Error handling
      sound.addEventListener('error', (e) => {
        console.warn(`AudioManager: Failed to load ${sound.src}`, e)
      })
    })
  }

  enableOnInteraction() {
    const enableAudio = () => {
      this.enabled = true
      this.playIntroSequence()
    }

    // Listen for any user interaction
    document.addEventListener('click', enableAudio, { once: true })
    document.addEventListener('keydown', enableAudio, { once: true })
    document.addEventListener('touchstart', enableAudio, { once: true })
  }

  playIntroSequence() {
    if (!this.enabled || this.muted) return

    try {
      // Start ambient drone immediately
      this.sounds.ambient.play().catch(e => {
        console.warn('AudioManager: Ambient playback failed', e)
      })

      // Big bang impact at start
      this.sounds.impact.play().catch(e => {
        console.warn('AudioManager: Impact playback failed', e)
      })

      // Particle expansion after 500ms
      setTimeout(() => {
        if (this.enabled && !this.muted) {
          this.sounds.expansion.play().catch(e => {
            console.warn('AudioManager: Expansion playback failed', e)
          })
        }
      }, 500)

      // Stellar twinkles after 2 seconds
      setTimeout(() => {
        if (this.enabled && !this.muted) {
          this.playTwinkles()
        }
      }, 2000)

      // Avatar reveal after 500ms (when avatar fades in)
      setTimeout(() => {
        if (this.enabled && !this.muted) {
          this.sounds.avatar.play().catch(e => {
            console.warn('AudioManager: Avatar reveal playback failed', e)
          })
        }
      }, 500)

    } catch (error) {
      console.error('AudioManager: Playback sequence error', error)
    }
  }

  playTwinkles() {
    if (!this.enabled || this.muted) return

    let twinkleCount = 0
    const maxTwinkles = 15 // Limit total twinkles

    const playRandomTwinkle = () => {
      if (!this.enabled || this.muted || twinkleCount >= maxTwinkles) {
        return
      }

      // Clone the audio for overlapping plays
      const twinkleClone = this.sounds.twinkle.cloneNode()
      twinkleClone.volume = this.sounds.twinkle.volume
      twinkleClone.play().catch(e => {
        console.warn('AudioManager: Twinkle playback failed', e)
      })

      twinkleCount++

      // Random interval between twinkles (300-800ms)
      const nextInterval = 300 + Math.random() * 500
      setTimeout(playRandomTwinkle, nextInterval)
    }

    playRandomTwinkle()
  }

  playUISound(soundType) {
    if (!this.enabled || this.muted) return

    // For UI sounds (hover, click)
    const uiSound = new Audio(`assets/sounds/ui-${soundType}.mp3`)
    uiSound.volume = 0.3 * this.masterVolume
    uiSound.play().catch(e => {
      console.warn(`AudioManager: UI sound ${soundType} failed`, e)
    })
  }

  toggle() {
    this.muted = !this.muted

    if (this.muted) {
      this.stop()
    } else if (this.enabled) {
      this.playIntroSequence()
    }

    return this.muted
  }

  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume))

    // Update all sound volumes
    Object.values(this.sounds).forEach(sound => {
      sound.volume = sound.volume * this.masterVolume
    })
  }

  stop() {
    Object.values(this.sounds).forEach(sound => {
      sound.pause()
      sound.currentTime = 0
    })
  }

  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  destroy() {
    this.stop()

    // Remove all audio elements
    Object.values(this.sounds).forEach(sound => {
      sound.src = ''
      sound.load()
    })

    this.sounds = {}
    this.enabled = false
  }
}

export default AudioManager
