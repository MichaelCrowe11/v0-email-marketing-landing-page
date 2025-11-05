"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface BigBangIntroProps {
  onComplete?: () => void
}

export function BigBangIntro({ onComplete }: BigBangIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAvatar, setShowAvatar] = useState(false)
  const animationFrameRef = useRef<number>()
  const particleSystemRef = useRef<any>(null)

  useEffect(() => {
    const loadAndInit = async () => {
      try {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setIsLoading(false)
          setShowAvatar(true)
          setTimeout(() => onComplete?.(), 2000)
          return
        }

        // Load Three.js dynamically
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

        setIsLoading(false)
        initParticleSystem()
        setTimeout(() => setShowAvatar(true), 500)
        setTimeout(() => onComplete?.(), 8000)
      } catch (error) {
        console.error("Failed to load Three.js:", error)
        // Graceful fallback
        setIsLoading(false)
        setShowAvatar(true)
        setTimeout(() => onComplete?.(), 3000)
      }
    }

    loadAndInit()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (particleSystemRef.current?.destroy) {
        particleSystemRef.current.destroy()
      }
    }
  }, [onComplete])

  const initParticleSystem = () => {
    if (!canvasRef.current || typeof window === "undefined") return

    const THREE = (window as any).THREE
    if (!THREE) return

    try {
      const canvas = canvasRef.current
      const scene = new THREE.Scene()

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      camera.position.z = 30

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      // Particle configuration
      const particleCount = getParticleCount()
      const geometry = new THREE.BufferGeometry()
      const positions: number[] = []
      const colors: number[] = []
      const velocities: number[] = []

      const colorPalette = {
        hot: [0xff6b35, 0xff8c42, 0xffa600],
        cool: [0x4ecdc4, 0x45b7d1, 0x96ceb4],
        nebula: [0xc44569, 0x9b59b6, 0x8e44ad],
        gold: [0xc9a961, 0xd4af37, 0xffd700],
      }

      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(Math.random() * 2 - 1)
        const radius = Math.random() * 5

        positions.push(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        )

        // Color selection (weighted distribution)
        const colorType = Math.random()
        let color: number
        if (colorType < 0.4) {
          color = colorPalette.hot[Math.floor(Math.random() * 3)]
        } else if (colorType < 0.7) {
          color = colorPalette.cool[Math.floor(Math.random() * 3)]
        } else if (colorType < 0.95) {
          color = colorPalette.nebula[Math.floor(Math.random() * 3)]
        } else {
          color = colorPalette.gold[Math.floor(Math.random() * 3)]
        }

        const threeColor = new THREE.Color(color)
        colors.push(threeColor.r, threeColor.g, threeColor.b)

        velocities.push(
          Math.sin(phi) * Math.cos(theta) * (0.5 + Math.random() * 0.5),
          Math.sin(phi) * Math.sin(theta) * (0.5 + Math.random() * 0.5),
          Math.cos(phi) * (0.5 + Math.random() * 0.5)
        )
      }

      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
      geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))

      const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      })

      const particles = new THREE.Points(geometry, material)
      scene.add(particles)

      let time = 0

      const animate = () => {
        animationFrameRef.current = requestAnimationFrame(animate)
        time += 0.016

        const posArray = particles.geometry.attributes.position.array as Float32Array

        for (let i = 0; i < posArray.length; i += 3) {
          posArray[i] += velocities[i] * 0.005
          posArray[i + 1] += velocities[i + 1] * 0.005
          posArray[i + 2] += velocities[i + 2] * 0.005

          // Spiral rotation
          const angle = time * 0.0002
          const x = posArray[i]
          const z = posArray[i + 2]
          posArray[i] = x * Math.cos(angle) - z * Math.sin(angle)
          posArray[i + 2] = x * Math.sin(angle) + z * Math.cos(angle)
        }

        particles.geometry.attributes.position.needsUpdate = true
        particles.rotation.y += 0.0001

        renderer.render(scene, camera)
      }

      animate()

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
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
      console.error("Error initializing particle system:", error)
    }
  }

  const handleSkip = () => {
    onComplete?.()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black">
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Loading Indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10"
          >
            <div className="w-12 h-12 border-3 border-[#C9A961] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-sm text-zinc-400 tracking-wider">
              Initializing Crowe Logic...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand Avatar Card */}
      <AnimatePresence>
        {showAvatar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center pointer-events-none"
          >
            {/* Avatar with Golden Ring */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative mx-auto mb-8 w-56 h-56"
            >
              {/* Pulsing Glow */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 60px rgba(201, 169, 97, 0.4)",
                    "0 0 80px rgba(201, 169, 97, 0.6)",
                    "0 0 60px rgba(201, 169, 97, 0.4)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
              />

              {/* Golden Ring Container */}
              <div className="relative w-full h-full rounded-full p-2 bg-gradient-to-br from-[#C9A961] to-[#8B7355]">
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#A0895C] to-[#6D5D48]" />
                <div className="relative w-full h-full rounded-full overflow-hidden bg-black">
                  <Image
                    src="/crowe-avatar.png"
                    alt="Crowe Logic"
                    width={220}
                    height={220}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
            </motion.div>

            {/* Company Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-white mb-3 tracking-wide"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Michael Crowe
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-zinc-400 tracking-widest font-light"
            >
              AI Systems Architect
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={handleSkip}
        aria-label="Skip introduction"
        className="fixed top-4 right-4 sm:top-8 sm:right-8 z-30 px-4 py-2 sm:px-6 sm:py-3 bg-black/50 border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-lg pointer-events-auto"
      >
        Skip Intro
      </motion.button>
    </div>
  )
}

function getParticleCount(): number {
  if (typeof window === "undefined") return 1000
  const width = window.innerWidth
  if (width < 768) return 1000
  if (width < 1024) return 2500
  return 5000
}
