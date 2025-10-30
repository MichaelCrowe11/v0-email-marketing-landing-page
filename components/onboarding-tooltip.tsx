'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface OnboardingTooltipProps {
  id: string
  title: string
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  targetSelector?: string
  delay?: number
}

export function OnboardingTooltip({
  id,
  title,
  content,
  position = 'bottom',
  targetSelector,
  delay = 0,
}: OnboardingTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenSeen, setHasBeenSeen] = useState(false)

  useEffect(() => {
    // Check if user has seen this tooltip
    const seen = localStorage.getItem(`tooltip-seen-${id}`)
    if (seen) {
      setHasBeenSeen(true)
      return
    }

    // Show tooltip after delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [id, delay])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem(`tooltip-seen-${id}`, 'true')
    setHasBeenSeen(true)
  }

  if (!isVisible || hasBeenSeen) return null

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  }

  return (
    <div
      className={`absolute z-50 ${positionClasses[position]} w-80 max-w-sm`}
      role="tooltip"
      aria-live="polite"
    >
      <div className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/10 rounded-lg p-4 shadow-2xl">
        {/* Arrow */}
        <div
          className={`absolute w-3 h-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/10 transform rotate-45 ${
            position === 'bottom'
              ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-t border-l'
              : position === 'top'
              ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-b border-r'
              : position === 'right'
              ? 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-l border-b'
              : 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 border-r border-t'
          }`}
        />

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Dismiss tooltip"
        >
          <X className="w-4 h-4 text-white/60" />
        </button>

        {/* Content */}
        <div className="pr-6">
          <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-white/80 leading-relaxed">{content}</p>
        </div>

        {/* Got it button */}
        <button
          onClick={handleDismiss}
          className="mt-3 px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-md transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  )
}

// Onboarding tour component
interface OnboardingTourStep {
  id: string
  title: string
  content: string
  targetSelector: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

interface OnboardingTourProps {
  steps: OnboardingTourStep[]
  onComplete?: () => void
}

export function OnboardingTour({ steps, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Check if user has completed the tour
    const completed = localStorage.getItem('onboarding-tour-completed')
    if (!completed) {
      setIsActive(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    setIsActive(false)
    localStorage.setItem('onboarding-tour-completed', 'true')
    onComplete?.()
  }

  if (!isActive || steps.length === 0) return null

  const step = steps[currentStep]

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

      {/* Tour step */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/10 rounded-lg p-6 shadow-2xl max-w-md w-full">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-8 bg-purple-500'
                      : index < currentStep
                      ? 'w-4 bg-purple-500/50'
                      : 'w-4 bg-white/20'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleSkip}
              className="text-xs text-white/60 hover:text-white/80 transition-colors"
            >
              Skip tour
            </button>
          </div>

          {/* Content */}
          <h2 className="text-xl font-bold text-white mb-2">{step.title}</h2>
          <p className="text-white/80 leading-relaxed mb-6">{step.content}</p>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/60">
              Step {currentStep + 1} of {steps.length}
            </div>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-medium transition-all"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// Default onboarding tour steps
export const defaultOnboardingSteps: OnboardingTourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Crowe Logic AI! 🍄',
    content:
      'Your intelligent mycology assistant powered by 20+ years of cultivation expertise. Let\'s take a quick tour of the key features.',
    targetSelector: '',
    position: 'bottom',
  },
  {
    id: 'chat',
    title: 'AI Chat Assistant',
    content:
      'Ask questions, get cultivation advice, and troubleshoot problems. Premium users get detailed reasoning with every response.',
    targetSelector: '[data-tour="chat"]',
    position: 'right',
  },
  {
    id: 'visual-analysis',
    title: 'Visual Analysis',
    content:
      'Upload images for contamination detection, species identification, and growth assessment. Get annotated results with confidence levels.',
    targetSelector: '[data-tour="visual-analysis"]',
    position: 'right',
  },
  {
    id: 'search',
    title: 'Quick Search',
    content:
      'Press Ctrl/⌘ + K to search across chat history, knowledge base, forum posts, and your projects. The fastest way to find anything!',
    targetSelector: '[data-tour="search"]',
    position: 'bottom',
  },
  {
    id: 'theme',
    title: 'Customize Your Experience',
    content:
      'Toggle between light and dark mode with Ctrl/⌘ + T. Adjust accessibility settings like font size and reduced motion in Settings.',
    targetSelector: '[data-tour="theme"]',
    position: 'bottom',
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    content:
      'Start exploring the platform. Press Shift + ? anytime to see keyboard shortcuts, or visit the Help section for detailed guides.',
    targetSelector: '',
    position: 'bottom',
  },
]
