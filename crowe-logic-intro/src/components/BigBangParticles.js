// Particle System Configuration
const CONFIG = {
  particleCount: {
    desktop: 5000,
    tablet: 2500,
    mobile: 1000
  },
  colors: {
    hot: [0xff6b35, 0xff8c42, 0xffa600], // Orange/red stars
    cool: [0x4ecdc4, 0x45b7d1, 0x96ceb4], // Blue/teal stars
    nebula: [0xc44569, 0x9b59b6, 0x8e44ad], // Purple/pink nebula
    gold: [0xC9A961, 0xD4AF37, 0xFFD700] // Gold accents (matching avatar ring)
  },
  explosion: {
    radius: 0,
    maxRadius: 50,
    expansionSpeed: 0.02,
    particleSpeed: 0.005,
    rotationSpeed: 0.0002
  },
  camera: {
    fov: 75,
    near: 0.1,
    far: 1000,
    positionZ: 30
  }
}

class BigBangParticleSystem {
  constructor(container) {
    this.container = container
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      CONFIG.camera.fov,
      window.innerWidth / window.innerHeight,
      CONFIG.camera.near,
      CONFIG.camera.far
    )
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false // Disable for performance
    })
    this.particles = null
    this.time = 0

    this.init()
  }

  init() {
    // Setup renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.container.appendChild(this.renderer.domElement)

    // Position camera
    this.camera.position.z = CONFIG.camera.positionZ

    // Create particles
    this.createParticles()

    // Start animation
    this.animate()

    // Handle resize
    window.addEventListener('resize', () => this.onResize())
  }

  createParticles() {
    const deviceType = this.getDeviceType()
    const particleCount = CONFIG.particleCount[deviceType]

    const geometry = new THREE.BufferGeometry()
    const positions = []
    const colors = []
    const sizes = []
    const velocities = []

    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = Math.random() * 5

      // Initial position (near center - the singularity)
      positions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      )

      // Color selection (weighted distribution)
      const colorType = Math.random()
      let color
      if (colorType < 0.4) {
        color = CONFIG.colors.hot[Math.floor(Math.random() * 3)]
      } else if (colorType < 0.7) {
        color = CONFIG.colors.cool[Math.floor(Math.random() * 3)]
      } else if (colorType < 0.95) {
        color = CONFIG.colors.nebula[Math.floor(Math.random() * 3)]
      } else {
        // Rare gold particles (matching brand colors)
        color = CONFIG.colors.gold[Math.floor(Math.random() * 3)]
      }

      const threeColor = new THREE.Color(color)
      colors.push(threeColor.r, threeColor.g, threeColor.b)

      // Size variation (some larger "star clusters")
      sizes.push(Math.random() * 3 + 1)

      // Velocity (radial expansion from center + randomization)
      velocities.push(
        Math.sin(phi) * Math.cos(theta) * (0.5 + Math.random() * 0.5),
        Math.sin(phi) * Math.sin(theta) * (0.5 + Math.random() * 0.5),
        Math.cos(phi) * (0.5 + Math.random() * 0.5)
      )
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))

    // Custom shader material for better performance and glow
    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    })

    this.particles = new THREE.Points(geometry, material)
    this.particles.userData.velocities = velocities
    this.scene.add(this.particles)
  }

  animate() {
    requestAnimationFrame(() => this.animate())

    this.time += 0.016 // ~60fps

    // Update particle positions
    const positions = this.particles.geometry.attributes.position.array
    const velocities = this.particles.userData.velocities

    for (let i = 0; i < positions.length; i += 3) {
      // Radial expansion
      positions[i] += velocities[i] * CONFIG.explosion.particleSpeed
      positions[i + 1] += velocities[i + 1] * CONFIG.explosion.particleSpeed
      positions[i + 2] += velocities[i + 2] * CONFIG.explosion.particleSpeed

      // Add slight spiral motion (galactic rotation)
      const angle = this.time * CONFIG.explosion.rotationSpeed
      const x = positions[i]
      const z = positions[i + 2]
      positions[i] = x * Math.cos(angle) - z * Math.sin(angle)
      positions[i + 2] = x * Math.sin(angle) + z * Math.cos(angle)
    }

    this.particles.geometry.attributes.position.needsUpdate = true

    // Slow rotation of entire system
    this.particles.rotation.y += 0.0001

    this.renderer.render(this.scene, this.camera)
  }

  getDeviceType() {
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  destroy() {
    this.renderer.dispose()
    this.particles.geometry.dispose()
    this.particles.material.dispose()
    window.removeEventListener('resize', this.onResize)
  }
}

export default BigBangParticleSystem
