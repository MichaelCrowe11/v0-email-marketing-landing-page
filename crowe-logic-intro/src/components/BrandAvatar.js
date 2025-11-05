class BrandAvatar {
  constructor() {
    this.element = document.getElementById('brand-avatar')
    this.avatarContainer = document.querySelector('.avatar-container')
    this.init()
  }

  init() {
    // Fade in animation after short delay
    setTimeout(() => {
      this.element.classList.add('visible')
    }, 500)

    // Optional: Subtle mouse parallax effect
    this.addParallax()

    // Optional: Interactive glow on hover
    this.addInteractiveGlow()
  }

  addParallax() {
    let ticking = false

    document.addEventListener('mousemove', (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5) * 20
          const y = (e.clientY / window.innerHeight - 0.5) * 20

          this.element.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
          ticking = false
        })
        ticking = true
      }
    })
  }

  addInteractiveGlow() {
    this.avatarContainer.addEventListener('mouseenter', () => {
      this.avatarContainer.style.boxShadow = '0 0 100px rgba(201, 169, 97, 0.8)'
    })

    this.avatarContainer.addEventListener('mouseleave', () => {
      this.avatarContainer.style.boxShadow = '0 0 60px rgba(201, 169, 97, 0.4)'
    })
  }
}

export default BrandAvatar
