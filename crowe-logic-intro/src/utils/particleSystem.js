/**
 * Particle System Utilities
 * Helper functions for particle calculations and effects
 */

export const ParticleUtils = {
  /**
   * Generate spherical coordinates
   * @returns {{theta: number, phi: number, radius: number}}
   */
  generateSphericalCoords(minRadius = 0, maxRadius = 5) {
    return {
      theta: Math.random() * Math.PI * 2,
      phi: Math.acos(Math.random() * 2 - 1),
      radius: minRadius + Math.random() * (maxRadius - minRadius)
    }
  },

  /**
   * Convert spherical to cartesian coordinates
   * @param {number} theta
   * @param {number} phi
   * @param {number} radius
   * @returns {{x: number, y: number, z: number}}
   */
  sphericalToCartesian(theta, phi, radius) {
    return {
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta),
      z: radius * Math.cos(phi)
    }
  },

  /**
   * Calculate velocity vector for radial expansion
   * @param {number} theta
   * @param {number} phi
   * @param {number} speed
   * @returns {{x: number, y: number, z: number}}
   */
  calculateRadialVelocity(theta, phi, speed = 1) {
    const baseSpeed = 0.5 + Math.random() * 0.5
    return {
      x: Math.sin(phi) * Math.cos(theta) * baseSpeed * speed,
      y: Math.sin(phi) * Math.sin(theta) * baseSpeed * speed,
      z: Math.cos(phi) * baseSpeed * speed
    }
  },

  /**
   * Apply rotation to a point
   * @param {number} x
   * @param {number} z
   * @param {number} angle
   * @returns {{x: number, z: number}}
   */
  rotatePoint(x, z, angle) {
    return {
      x: x * Math.cos(angle) - z * Math.sin(angle),
      z: x * Math.sin(angle) + z * Math.cos(angle)
    }
  },

  /**
   * Generate color based on weighted distribution
   * @param {Object} colorConfig
   * @returns {number}
   */
  selectColor(colorConfig) {
    const rand = Math.random()

    if (rand < 0.4) {
      // Hot colors (40%)
      return colorConfig.hot[Math.floor(Math.random() * colorConfig.hot.length)]
    } else if (rand < 0.7) {
      // Cool colors (30%)
      return colorConfig.cool[Math.floor(Math.random() * colorConfig.cool.length)]
    } else if (rand < 0.95) {
      // Nebula colors (25%)
      return colorConfig.nebula[Math.floor(Math.random() * colorConfig.nebula.length)]
    } else {
      // Gold accent colors (5%)
      return colorConfig.gold[Math.floor(Math.random() * colorConfig.gold.length)]
    }
  },

  /**
   * Generate random size with variation
   * @param {number} minSize
   * @param {number} maxSize
   * @returns {number}
   */
  generateSize(minSize = 1, maxSize = 4) {
    return minSize + Math.random() * (maxSize - minSize)
  },

  /**
   * Calculate distance between two points
   * @param {number} x1
   * @param {number} y1
   * @param {number} z1
   * @param {number} x2
   * @param {number} y2
   * @param {number} z2
   * @returns {number}
   */
  distance3D(x1, y1, z1, x2, y2, z2) {
    const dx = x2 - x1
    const dy = y2 - y1
    const dz = z2 - z1
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  },

  /**
   * Interpolate between two values
   * @param {number} start
   * @param {number} end
   * @param {number} progress
   * @returns {number}
   */
  lerp(start, end, progress) {
    return start + (end - start) * progress
  },

  /**
   * Clamp value between min and max
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  },

  /**
   * Generate noise value (simple)
   * @param {number} x
   * @returns {number}
   */
  noise(x) {
    const intX = Math.floor(x)
    const fracX = x - intX

    const v1 = Math.sin(intX * 12.9898 + 78.233) * 43758.5453123
    const v2 = Math.sin((intX + 1) * 12.9898 + 78.233) * 43758.5453123

    return this.lerp(v1 - Math.floor(v1), v2 - Math.floor(v2), fracX)
  }
}

export default ParticleUtils
