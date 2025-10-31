/**
 * Animation utilities for performance-optimized animations
 * Uses only transform and opacity for GPU acceleration
 */

export function shouldAnimate(): boolean {
  if (typeof window === 'undefined') return true
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  return !mediaQuery.matches
}

export function addWillChange(element: HTMLElement, properties: string[]) {
  if (!shouldAnimate()) return
  
  element.style.willChange = properties.join(', ')
}

export function removeWillChange(element: HTMLElement) {
  element.style.willChange = 'auto'
}

export function animateWithGPU(
  element: HTMLElement,
  animation: () => void,
  properties: string[] = ['transform', 'opacity']
) {
  if (!shouldAnimate()) {
    animation()
    return
  }
  
  addWillChange(element, properties)
  
  requestAnimationFrame(() => {
    animation()
    
    // Remove will-change after animation completes
    setTimeout(() => {
      removeWillChange(element)
    }, 300)
  })
}

export function createAnimationObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) {
  if (typeof window === 'undefined') return null
  
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry)
      }
    })
  }, {
    threshold: 0.1,
    ...options,
  })
}
