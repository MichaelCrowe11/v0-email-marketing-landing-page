import BigBangParticleSystem from './components/BigBangParticles.js'
import BrandAvatar from './components/BrandAvatar.js'
import AudioManager from './components/AudioManager.js'

class CroweLogicIntro {
  constructor() {
    this.particleSystem = null
    this.brandAvatar = null
    this.audioManager = null
    this.loader = document.getElementById('loader')
    this.skipButton = document.getElementById('skip-intro')
    this.introCompleted = false

    this.init()
  }

  async init() {
    try {
      // Check for WebGL support
      if (!this.checkWebGLSupport()) {
        console.warn('WebGL not supported, using fallback')
        this.showFallback()
        return
      }

      // Load critical assets
      await this.loadAssets()

      // Create 3D particle system
      const container = document.getElementById('canvas-container')
      this.particleSystem = new BigBangParticleSystem(container)

      // Initialize brand avatar
      this.brandAvatar = new BrandAvatar()

      // Initialize audio manager (after particle system)
      this.audioManager = new AudioManager()

      // Hide loader
      this.hideLoader()

      // Setup skip button
      this.setupSkipButton()

      // Setup mute button
      this.setupMuteButton()

      // Auto-advance after 8 seconds
      setTimeout(() => {
        if (!this.introCompleted) {
          this.advance()
        }
      }, 8000)

    } catch (error) {
      console.error('Initialization error:', error)
      this.hideLoader()
      this.showFallback()
    }
  }

  checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas')
      return !!(window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
    } catch(e) {
      return false
    }
  }

  async loadAssets() {
    // Preload Crowe Logic avatar
    const avatarImage = new Image()
    avatarImage.src = 'assets/images/crowe-logic-avatar.png'

    return new Promise((resolve, reject) => {
      avatarImage.onload = () => resolve()
      avatarImage.onerror = () => {
        console.warn('Avatar image failed to load')
        resolve() // Graceful fallback
      }

      // Timeout after 5 seconds
      setTimeout(() => resolve(), 5000)
    })
  }

  hideLoader() {
    setTimeout(() => {
      this.loader.classList.add('hidden')
      setTimeout(() => {
        this.loader.remove()
      }, 500)
    }, 500)
  }

  setupSkipButton() {
    this.skipButton.addEventListener('click', () => {
      if (!this.introCompleted) {
        this.advance()
      }
    })
  }

  setupMuteButton() {
    const muteButton = document.getElementById('mute-toggle')
    if (muteButton && this.audioManager) {
      muteButton.addEventListener('click', () => {
        const isMuted = this.audioManager.toggle()
        muteButton.classList.toggle('muted', isMuted)
      })
    }
  }

  advance() {
    this.introCompleted = true

    // Stop audio when transitioning
    if (this.audioManager) {
      this.audioManager.stop()
    }

    // Add fade out animation
    document.body.style.transition = 'opacity 1s ease-out'
    document.body.style.opacity = '0'

    setTimeout(() => {
      // Transition to main site
      window.location.href = '/home'

      // Alternative: Fade out intro and show main content
      // document.getElementById('main-content').style.display = 'block'
      // document.body.style.opacity = '1'
    }, 1000)
  }

  showFallback() {
    // Simple fallback for non-WebGL browsers
    const fallback = document.createElement('div')
    fallback.className = 'fallback-intro'
    fallback.innerHTML = `
      <div class="brand-avatar visible">
        <div class="avatar-container">
          <img src="assets/images/crowe-logic-avatar.png" alt="Crowe Logic" class="avatar-image">
        </div>
        <h1 class="company-name">Crowe Logic, Inc</h1>
        <p class="company-tagline">AI Systems Architecture</p>
      </div>
    `
    document.body.appendChild(fallback)

    setTimeout(() => this.advance(), 3000)
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.croweLogicIntro = new CroweLogicIntro()
  })
} else {
  window.croweLogicIntro = new CroweLogicIntro()
}

export default CroweLogicIntro
