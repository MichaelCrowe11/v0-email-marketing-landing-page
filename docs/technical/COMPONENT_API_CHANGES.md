# Component API Changes - UI/UX Enhancement

This document outlines all component API changes made during the comprehensive UI/UX enhancement project.

## New Components

### OnboardingTooltip
**Location**: `components/onboarding-tooltip.tsx`

Provides contextual tooltips for user onboarding.

```typescript
interface OnboardingTooltipProps {
  id: string                    // Unique identifier for localStorage tracking
  title: string                 // Tooltip title
  content: string              // Tooltip content
  position?: 'top' | 'bottom' | 'left' | 'right'  // Position relative to target
  targetSelector?: string      // CSS selector for target element
  delay?: number              // Delay before showing (ms)
}
```

**Usage**:
```tsx
<OnboardingTooltip
  id="search-feature"
  title="Quick Search"
  content="Press Ctrl/⌘ + K to search anywhere"
  position="bottom"
  delay={1000}
/>
```

### OnboardingTour
**Location**: `components/onboarding-tooltip.tsx`

Multi-step onboarding tour with progress tracking.

```typescript
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
```

**Usage**:
```tsx
import { OnboardingTour, defaultOnboardingSteps } from '@/components/onboarding-tooltip'

<OnboardingTour
  steps={defaultOnboardingSteps}
  onComplete={() => console.log('Tour completed')}
/>
```

### AccessibilitySettings
**Location**: `components/accessibility-settings.tsx`

User-configurable accessibility preferences.

```typescript
// No props - manages its own state via useAccessibilityPreferences hook
```

**Features**:
- Font size adjustment (small, medium, large)
- High contrast mode toggle
- Reduced motion toggle
- Keyboard navigation preferences
- Persists to localStorage

### KeyboardShortcutsDialog
**Location**: `components/keyboard-shortcuts-dialog.tsx`

Displays all available keyboard shortcuts.

```typescript
interface KeyboardShortcutsDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}
```

**Usage**:
```tsx
<KeyboardShortcutsDialog
  open={isOpen}
  onOpenChange={setIsOpen}
/>
```

### WebVitals
**Location**: `components/web-vitals.tsx`

Client-side Core Web Vitals monitoring.

```typescript
// No props - automatically reports metrics
```

**Usage**:
```tsx
// In app/layout.tsx
import { WebVitals } from '@/components/web-vitals'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
```

### ScrollReveal
**Location**: `components/scroll-reveal.tsx`

Intersection Observer-based reveal animations.

```typescript
interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number              // Animation delay (ms)
  direction?: 'up' | 'down' | 'left' | 'right'
  threshold?: number          // Intersection threshold (0-1)
  once?: boolean             // Animate only once
  className?: string
}
```

**Usage**:
```tsx
<ScrollReveal direction="up" delay={200}>
  <FeatureCard />
</ScrollReveal>
```

### TrustIndicators
**Location**: `components/trust-indicators.tsx`

Displays trust badges and credibility indicators.

```typescript
interface TrustIndicatorsProps {
  variant?: 'default' | 'compact'
  showAll?: boolean
}
```

**Usage**:
```tsx
<TrustIndicators variant="compact" showAll={false} />
```

## Modified Components

### GlobalHeader
**Location**: `components/global-header.tsx`

**Changes**:
- Added keyboard shortcut hints to search bar
- Improved mobile responsiveness
- Added data-tour attributes for onboarding
- Enhanced accessibility with ARIA labels

**New Props**:
```typescript
interface GlobalHeaderProps {
  // ... existing props
  showKeyboardHints?: boolean  // Show keyboard shortcut hints (default: true)
}
```

### SidebarNav
**Location**: `components/sidebar-nav.tsx`

**Changes**:
- Grouped navigation items into collapsible sections
- Added visual indicators for new features
- Improved active state styling
- Added quick action buttons

**New Props**:
```typescript
interface SidebarNavProps {
  // ... existing props
  collapsible?: boolean        // Allow section collapse (default: true)
  showBadges?: boolean        // Show "New" badges (default: true)
}
```

### OrchestratedHero
**Location**: `components/orchestrated-hero.tsx`

**Changes**:
- Optimized particle animations for performance
- Added reduced motion support
- Improved mobile layout
- Enhanced accessibility

**New Props**:
```typescript
interface OrchestratedHeroProps {
  // ... existing props
  particleCount?: number       // Number of particles (default: 20, mobile: 10)
  enableParallax?: boolean    // Enable parallax effect (default: true)
  respectReducedMotion?: boolean  // Respect prefers-reduced-motion (default: true)
}
```

### StreamingChatDemo
**Location**: `components/streaming-chat-demo.tsx`

**Changes**:
- Enhanced phone mockup design
- Improved AI thinking state visualization
- Added demo controls (pause, next, previous)
- Better VRS formatting

**New Props**:
```typescript
interface StreamingChatDemoProps {
  // ... existing props
  showControls?: boolean       // Show demo controls (default: true)
  autoPlay?: boolean          // Auto-advance conversations (default: true)
  playbackSpeed?: number      // Speed multiplier (default: 1)
}
```

### Pricing
**Location**: `components/pricing.tsx`

**Changes**:
- Improved card layout and visual hierarchy
- Added comparison features
- Enhanced hover states
- Better mobile layout

**New Props**:
```typescript
interface PricingProps {
  // ... existing props
  showComparison?: boolean     // Show comparison table (default: false)
  highlightTier?: string      // Tier to highlight (default: 'premium')
}
```

### Features
**Location**: `components/features.tsx`

**Changes**:
- Added staggered reveal animations
- Improved image quality and consistency
- Added category filters
- Enhanced hover effects

**New Props**:
```typescript
interface FeaturesProps {
  // ... existing props
  enableFilters?: boolean      // Show category filters (default: true)
  animationDelay?: number     // Stagger delay between cards (default: 100)
}
```

### Footer
**Location**: `components/footer.tsx`

**Changes**:
- Added comprehensive contact information
- Improved credibility indicators
- Better mobile layout
- Enhanced accessibility

**No API changes** - internal improvements only.

## New Hooks

### useAccessibilityPreferences
**Location**: `lib/hooks/use-accessibility-preferences.ts`

Manages user accessibility preferences.

```typescript
interface AccessibilityPreferences {
  fontSize: 'small' | 'medium' | 'large'
  highContrast: boolean
  reducedMotion: boolean
  keyboardNavigation: boolean
}

function useAccessibilityPreferences(): {
  preferences: AccessibilityPreferences
  updatePreferences: (updates: Partial<AccessibilityPreferences>) => void
  resetPreferences: () => void
}
```

**Usage**:
```tsx
const { preferences, updatePreferences } = useAccessibilityPreferences()

// Update font size
updatePreferences({ fontSize: 'large' })

// Check reduced motion
if (preferences.reducedMotion) {
  // Disable animations
}
```

## New Utilities

### Design System
**Location**: `lib/design-system.ts`

Centralized design tokens and utilities.

```typescript
export const designSystem = {
  colors: { /* color tokens */ },
  typography: { /* font tokens */ },
  spacing: { /* spacing scale */ },
  borderRadius: { /* radius scale */ },
  shadows: { /* shadow definitions */ },
  animations: { /* animation timings */ },
}

// Utility functions
export function getColor(path: string): string
export function getSpacing(size: string): string
export function applyGlassEffect(variant: 'default' | 'premium' | 'shiny'): CSSProperties
```

### Performance Utilities
**Location**: `lib/performance.ts`

Performance monitoring and optimization utilities.

```typescript
// Report Core Web Vitals
export function reportWebVitals(metric: Metric): void

// Lazy load component
export function lazyLoad<T>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options?: { fallback?: ReactNode }
): LazyExoticComponent<ComponentType<T>>

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void
```

### Accessibility Utilities
**Location**: `lib/accessibility.ts`

Accessibility helper functions.

```typescript
// Check if reduced motion is preferred
export function prefersReducedMotion(): boolean

// Generate unique ID for ARIA
export function generateAriaId(prefix: string): string

// Announce to screen readers
export function announceToScreenReader(message: string, priority?: 'polite' | 'assertive'): void

// Trap focus within element
export function trapFocus(element: HTMLElement): () => void

// Get focusable elements
export function getFocusableElements(container: HTMLElement): HTMLElement[]
```

### Keyboard Shortcuts
**Location**: `lib/keyboard-shortcuts.ts`

Keyboard shortcut management.

```typescript
export const KEYBOARD_SHORTCUTS = {
  SEARCH: { key: 'k', ctrl: true, meta: true, description: 'Open search' },
  THEME_TOGGLE: { key: 't', ctrl: true, meta: true, description: 'Toggle theme' },
  // ... more shortcuts
}

export function matchesShortcut(event: KeyboardEvent, shortcut: ShortcutDefinition): boolean
export function formatShortcut(shortcut: ShortcutDefinition): string
```

## CSS Changes

### New CSS Files

#### mobile-optimizations.css
**Location**: `app/mobile-optimizations.css`

Mobile-specific optimizations:
- Touch target sizing
- Viewport fixes
- iOS-specific fixes
- Android-specific fixes

#### mobile-performance.css
**Location**: `app/mobile-performance.css`

Performance optimizations for mobile:
- GPU acceleration
- Containment
- Will-change hints
- Lazy loading styles

### Modified CSS

#### globals.css
**Location**: `app/globals.css`

**Changes**:
- Added CSS custom properties for design system
- Improved glass morphism effects
- Enhanced focus indicators
- Added reduced motion support

**New CSS Variables**:
```css
:root {
  /* Design System Colors */
  --color-primary: oklch(0.7 0.2 270);
  --color-secondary: oklch(0.6 0.25 330);
  --color-accent: oklch(0.65 0.25 195);
  
  /* Spacing Scale */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Animations */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Breaking Changes

### None
All changes are backward compatible. Existing components will continue to work without modifications.

## Migration Guide

### Adopting New Components

#### Before (Custom Implementation):
```tsx
// Custom tooltip implementation
<div className="tooltip">
  <span>Hover for info</span>
  <div className="tooltip-content">Information</div>
</div>
```

#### After (Using OnboardingTooltip):
```tsx
<OnboardingTooltip
  id="feature-info"
  title="Feature Name"
  content="Information about this feature"
  position="bottom"
/>
```

### Using Design System

#### Before (Hardcoded Values):
```tsx
<div style={{
  color: '#a855f7',
  padding: '16px',
  borderRadius: '8px'
}}>
  Content
</div>
```

#### After (Design System):
```tsx
import { designSystem } from '@/lib/design-system'

<div style={{
  color: designSystem.colors.primary,
  padding: designSystem.spacing.md,
  borderRadius: designSystem.borderRadius.lg
}}>
  Content
</div>
```

### Accessibility Improvements

#### Before (No Accessibility):
```tsx
<button onClick={handleClick}>
  <Icon />
</button>
```

#### After (With Accessibility):
```tsx
<button
  onClick={handleClick}
  aria-label="Descriptive action"
  className="focus-visible:ring-2 focus-visible:ring-purple-500"
>
  <Icon aria-hidden="true" />
</button>
```

## Testing Changes

### New Test Utilities

```typescript
// Test accessibility
import { testAccessibility } from '@/tests/utils/accessibility'

test('component is accessible', async () => {
  const { container } = render(<Component />)
  await testAccessibility(container)
})

// Test keyboard navigation
import { testKeyboardNavigation } from '@/tests/utils/keyboard'

test('component supports keyboard navigation', async () => {
  render(<Component />)
  await testKeyboardNavigation(['Tab', 'Enter'])
})

// Test responsive behavior
import { testResponsive } from '@/tests/utils/responsive'

test('component is responsive', async () => {
  await testResponsive(<Component />, ['mobile', 'tablet', 'desktop'])
})
```

## Performance Considerations

### Component Optimization

All enhanced components now include:
- React.memo for expensive renders
- Proper dependency arrays in hooks
- Debounced/throttled event handlers
- Lazy loading for heavy components
- CSS containment for better rendering

### Example:
```tsx
import { memo } from 'react'
import { debounce } from '@/lib/performance'

export const OptimizedComponent = memo(function OptimizedComponent({ onSearch }) {
  const debouncedSearch = debounce(onSearch, 300)
  
  return (
    <div style={{ contain: 'layout style paint' }}>
      <input onChange={(e) => debouncedSearch(e.target.value)} />
    </div>
  )
})
```

## Future Deprecations

None planned. All components are stable and will be maintained.

## Support

For questions about component APIs:
- Check component source code for inline documentation
- Review Storybook documentation (coming soon)
- Ask in the development forum
- Contact the development team

---

**Last Updated**: December 2024
**Version**: 2.0.0
