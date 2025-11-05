/**
 * Device Detection and Performance Utilities
 */

export const DeviceDetect = {
  /**
   * Get device type based on screen width
   * @returns {'mobile' | 'tablet' | 'desktop'}
   */
  getDeviceType() {
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  },

  /**
   * Check if device is mobile
   * @returns {boolean}
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },

  /**
   * Check if device is iOS
   * @returns {boolean}
   */
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  },

  /**
   * Check if device is Android
   * @returns {boolean}
   */
  isAndroid() {
    return /Android/.test(navigator.userAgent)
  },

  /**
   * Get device pixel ratio
   * @returns {number}
   */
  getPixelRatio() {
    return window.devicePixelRatio || 1
  },

  /**
   * Check if device supports touch
   * @returns {boolean}
   */
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  },

  /**
   * Get viewport dimensions
   * @returns {{width: number, height: number}}
   */
  getViewport() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  },

  /**
   * Check if user prefers reduced motion
   * @returns {boolean}
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },

  /**
   * Get recommended quality settings based on device
   * @returns {{particleCount: number, enableEffects: boolean}}
   */
  getQualitySettings() {
    const deviceType = this.getDeviceType()
    const pixelRatio = this.getPixelRatio()

    let particleCount
    let enableEffects = true

    if (deviceType === 'mobile') {
      particleCount = 1000
      enableEffects = pixelRatio < 2
    } else if (deviceType === 'tablet') {
      particleCount = 2500
      enableEffects = true
    } else {
      particleCount = 5000
      enableEffects = true
    }

    // Reduce quality if user prefers reduced motion
    if (this.prefersReducedMotion()) {
      particleCount = Math.floor(particleCount * 0.5)
      enableEffects = false
    }

    return {
      particleCount,
      enableEffects
    }
  }
}

export default DeviceDetect
