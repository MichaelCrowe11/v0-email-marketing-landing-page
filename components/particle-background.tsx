"use client"

import { useEffect, useRef } from "react"

interface ParticleBackgroundProps {
  particleCount?: number
  colors?: string[]
  speed?: number
  className?: string
}

export function ParticleBackground({
  particleCount = 1000,
  colors = ["#C9A961", "#45B7D1", "#9B59B6"],
  speed = 0.002,
  className = "",
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const particleSystemRef = useRef<any>(null)

  useEffect(() => {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const initParticles = async () => {
      // Load Three.js if not already loaded
      if (typeof window !== "undefined" && !(window as any).THREE) {
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r158/three.min.js"
        script.async = true

        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      }

      init()
    }

    initParticles()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (particleSystemRef.current?.destroy) {
        particleSystemRef.current.destroy()
      }
    }
  }, [particleCount, colors, speed])

  const init = () => {
    if (!canvasRef.current) return

    const THREE = (window as any).THREE
    if (!THREE) return

    try {
      const canvas = canvasRef.current
      const scene = new THREE.Scene()

      const camera = new THREE.PerspectiveCamera(
        75,
        canvas.offsetWidth / canvas.offsetHeight,
        0.1,
        1000
      )
      camera.position.z = 20

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
      })
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      // Create particles
      const geometry = new THREE.BufferGeometry()
      const positions: number[] = []
      const particleColors: number[] = []
      const velocities: number[] = []

      // Convert hex colors to Three.js colors
      const threeColors = colors.map(hex => new THREE.Color(hex))

      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(Math.random() * 2 - 1)
        const radius = Math.random() * 10

        positions.push(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        )

        const randomColor = threeColors[Math.floor(Math.random() * threeColors.length)]
        particleColors.push(randomColor.r, randomColor.g, randomColor.b)

        velocities.push(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        )
      }

      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
      geometry.setAttribute("color", new THREE.Float32BufferAttribute(particleColors, 3))

      const material = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })

      const particles = new THREE.Points(geometry, material)
      scene.add(particles)

      const animate = () => {
        animationFrameRef.current = requestAnimationFrame(animate)

        const posArray = particles.geometry.attributes.position.array as Float32Array

        for (let i = 0; i < posArray.length; i += 3) {
          posArray[i] += velocities[i] * speed
          posArray[i + 1] += velocities[i + 1] * speed
          posArray[i + 2] += velocities[i + 2] * speed

          // Boundary check - wrap around
          if (Math.abs(posArray[i]) > 20) velocities[i] *= -1
          if (Math.abs(posArray[i + 1]) > 20) velocities[i + 1] *= -1
          if (Math.abs(posArray[i + 2]) > 20) velocities[i + 2] *= -1
        }

        particles.geometry.attributes.position.needsUpdate = true
        particles.rotation.y += 0.0005

        renderer.render(scene, camera)
      }

      animate()

      const handleResize = () => {
        if (!canvas) return
        camera.aspect = canvas.offsetWidth / canvas.offsetHeight
        camera.updateProjectionMatrix()
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
      }

      window.addEventListener("resize", handleResize)

      particleSystemRef.current = {
        destroy: () => {
          window.removeEventListener("resize", handleResize)
          renderer.dispose()
          geometry.dispose()
          material.dispose()
        },
      }
    } catch (error) {
      console.error("Error initializing particle background:", error)
    }
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}
