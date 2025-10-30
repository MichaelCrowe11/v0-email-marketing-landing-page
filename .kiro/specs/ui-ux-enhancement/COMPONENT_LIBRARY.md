# Crowe Logic Component Library

## Overview

This document provides comprehensive documentation for all reusable components in the Crowe Logic AI platform. Each component includes usage guidelines, props documentation, variants, accessibility notes, and code examples.

## Table of Contents

1. [Layout Components](#layout-components)
2. [Navigation Components](#navigation-components)
3. [Hero Components](#hero-components)
4. [Content Components](#content-components)
5. [Interactive Components](#interactive-components)
6. [Utility Components](#utility-components)
7. [UI Primitives](#ui-primitives)

---

## Layout Components

### GlobalHeader

**Purpose:** Fixed header navigation with search, theme toggle, and user menu.

**Location:** `components/global-header.tsx`

**Props:**
```typescript
interface GlobalHeaderProps {
  className?: string
}
```

**Variants:**
- Default: Full header with all features
- Mobile: Collapsed with hamburger menu

**Usage:**
```tsx
import { GlobalHeader } from '@/components/global-header'

<GlobalHeader />
```

**Features:**
- Responsive design (desktop/mobile)
- Search bar with keyboard shortcuts (Cmd/Ctrl+K)
- Theme toggle
- User menu with profile options
- Weather widget (optional)

**Accessibility:**
- Semantic `<header>` element
- Skip link to main content
- Keyboard navigation support
- ARIA labels for icon buttons
- Focus indicators on all interactive elements

**Best Practices:**
- Keep header height consistent (72px)
- Ensure search is always accessible
- Maintain z-index for proper layering
- Test on various screen sizes

---

### SidebarNav

**Purpose:** Collapsible sidebar navigation with grouped sections.

**Location:** `components/sidebar-nav.tsx`

**Props:**
```typescript
interface SidebarNavProps {
  className?: string
  defaultCollapsed?: boolean
}
```

**Variants:**
- Expanded: Full width (256px) with labels
- Collapsed: Icon-only (64px)
- Mobile: Overlay drawer

**Usage:**
```tsx
import { SidebarNav } from '@/components/sidebar-nav'

<SidebarNav defaultCollapsed={false} />
```

**Features:**
- Grouped navigation sections
- Active state highlighting
- Collapsible on desktop
- Drawer on mobile
- Quick action buttons

**Accessibility:**
- Semantic `<nav>` element
- ARIA labels for collapsed state
- Keyboard navigation (Tab, Arrow keys)
- Focus trap when drawer is open
- Screen reader announcements

**Best Practices:**
- Group related items logically
- Use clear, concise labels
- Provide visual feedback for active state
- Ensure touch targets are 44x44px minimum

---

## Navigation Components

### PremiumNav

**Purpose:** Premium tier navigation for authenticated users.

**Location:** `components/premium-nav.tsx`

**Props:**
```typescript
interface PremiumNavProps {
  tier: 'free' | 'basic' | 'pro' | 'enterprise'
  className?: string
}
```

**Usage:**
```tsx
import { PremiumNav } from '@/components/premium-nav'

<PremiumNav tier="pro" />
```

**Features:**
- Tier-based feature access
- Visual tier indicators
- Upgrade prompts for lower tiers
- Feature badges (New, Pro, Enterprise)

**Accessibility:**
- Clear tier labeling
- Keyboard accessible
- Screen reader friendly
- High contrast support

---

### DocsSidebar

**Purpose:** Documentation navigation sidebar.

**Location:** `components/docs-sidebar.tsx`

**Props:**
```typescript
interface DocsSidebarProps {
  sections: DocSection[]
  currentPath: string
  className?: string
}

interface DocSection {
  title: string
  items: DocItem[]
}

interface DocItem {
  title: string
  href: string
  badge?: string
}
```

**Usage:**
```tsx
import { DocsSidebar } from '@/components/docs-sidebar'

<DocsSidebar 
  sections={docSections} 
  currentPath="/docs/getting-started"
/>
```

**Features:**
- Hierarchical navigation
- Active page highlighting
- Collapsible sections
- Search integration

---

## Hero Components

### OrchestratedHero

**Purpose:** Animated hero section with AI processing visualizations.

**Location:** `components/orchestrated-hero.tsx`

**Props:**
```typescript
interface OrchestratedHeroProps {
  className?: string
  reducedMotion?: boolean
}
```

**Variants:**
- Full: All animations enabled
- Reduced Motion: Minimal animations
- Mobile: Optimized for small screens

**Usage:**
```tsx
import { OrchestratedHero } from '@/components/orchestrated-hero'

<OrchestratedHero />
```

**Features:**
- Animated code particles
- AI avatar with glow effects
- Terminal visualization
- Pipeline processing blocks
- Parallax scrolling effects

**Performance:**
- GPU-accelerated animations
- Reduced particle count on mobile
- Lazy loading for heavy assets
- Respects `prefers-reduced-motion`

**Accessibility:**
- Descriptive alt text for avatar
- Skip animation button
- Keyboard accessible CTAs
- Screen reader friendly content

**Best Practices:**
- Test on various devices
- Monitor frame rate (target 60fps)
- Provide fallback for older browsers
- Ensure CTAs are always visible

---

### Hero

**Purpose:** Simple hero section for internal pages.

**Location:** `components/hero.tsx`

**Props:**
```typescript
interface HeroProps {
  title: string
  subtitle?: string
  cta?: {
    text: string
    href: string
  }
  image?: string
  className?: string
}
```

**Usage:**
```tsx
import { Hero } from '@/components/hero'

<Hero 
  title="Welcome to Crowe Logic"
  subtitle="AI-powered mycology expertise"
  cta={{ text: "Get Started", href: "/chat" }}
/>
```

---

## Content Components

### StreamingChatDemo

**Purpose:** Interactive chat demo with realistic AI responses.

**Location:** `components/streaming-chat-demo.tsx`

**Props:**
```typescript
interface StreamingChatDemoProps {
  conversations?: Conversation[]
  autoPlay?: boolean
  className?: string
}

interface Conversation {
  id: string
  messages: Message[]
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  thinking?: string
  image?: string
  vrs?: VRSData
}
```

**Variants:**
- Phone Mockup: Realistic mobile interface
- Desktop: Full-width chat interface
- Embedded: Compact version for pages

**Usage:**
```tsx
import { StreamingChatDemo } from '@/components/streaming-chat-demo'

<StreamingChatDemo 
  conversations={demoConversations}
  autoPlay={true}
/>
```

**Features:**
- Realistic typing animation
- AI thinking states
- VRS (Visible Reasoning Summary) display
- Image analysis visualization
- Evidence ledger display
- Manual controls (play, pause, next)

**Accessibility:**
- ARIA live regions for updates
- Keyboard controls
- Screen reader announcements
- Alt text for images
- Descriptive labels

**Best Practices:**
- Keep conversations concise
- Show realistic timing
- Provide manual controls
- Link to actual chat feature

---

### Features

**Purpose:** Feature showcase grid with cards.

**Location:** `components/features.tsx`

**Props:**
```typescript
interface FeaturesProps {
  features: Feature[]
  columns?: 2 | 3 | 4
  className?: string
}

interface Feature {
  title: string
  description: string
  icon: React.ComponentType
  image?: string
  badge?: string
  href?: string
}
```

**Usage:**
```tsx
import { Features } from '@/components/features'

<Features 
  features={platformFeatures}
  columns={3}
/>
```

**Features:**
- Responsive grid layout
- Hover effects
- Staggered reveal animations
- Category filtering
- Image optimization

**Accessibility:**
- Semantic HTML structure
- Descriptive headings
- Alt text for images
- Keyboard accessible links

---

### Pricing

**Purpose:** Pricing tier comparison cards.

**Location:** `components/pricing.tsx`

**Props:**
```typescript
interface PricingProps {
  tiers: PricingTier[]
  billingPeriod?: 'monthly' | 'annual'
  className?: string
}

interface PricingTier {
  name: string
  price: number
  savings?: number
  features: string[]
  cta: string
  ctaLink: string
  featured?: boolean
  badge?: string
}
```

**Variants:**
- Card View: Side-by-side comparison
- Table View: Detailed feature comparison
- Mobile: Stacked cards

**Usage:**
```tsx
import { Pricing } from '@/components/pricing'

<Pricing 
  tiers={pricingTiers}
  billingPeriod="annual"
/>
```

**Features:**
- Responsive layout
- Featured tier highlighting
- Savings calculation
- Feature comparison
- Trust badges
- FAQ integration

**Accessibility:**
- Clear pricing information
- Descriptive feature lists
- Keyboard accessible CTAs
- Screen reader friendly

**Best Practices:**
- Highlight best value
- Show savings prominently
- Include all features
- Provide clear CTAs

---

### FAQ

**Purpose:** Accordion-style frequently asked questions.

**Location:** `components/faq.tsx`

**Props:**
```typescript
interface FAQProps {
  questions: FAQItem[]
  defaultOpen?: number
  className?: string
}

interface FAQItem {
  question: string
  answer: string | React.ReactNode
}
```

**Usage:**
```tsx
import { FAQ } from '@/components/faq'

<FAQ 
  questions={faqItems}
  defaultOpen={0}
/>
```

**Features:**
- Accordion interaction
- Smooth expand/collapse
- Rich text answers
- Search functionality

**Accessibility:**
- ARIA accordion pattern
- Keyboard navigation
- Focus management
- Screen reader support

---

### ProofSection

**Purpose:** Social proof with testimonials and case studies.

**Location:** `components/proof-section.tsx`

**Props:**
```typescript
interface ProofSectionProps {
  testimonials?: Testimonial[]
  stats?: Stat[]
  className?: string
}

interface Testimonial {
  quote: string
  author: string
  role: string
  avatar?: string
  company?: string
}

interface Stat {
  value: string
  label: string
  icon?: React.ComponentType
}
```

**Usage:**
```tsx
import { ProofSection } from '@/components/proof-section'

<ProofSection 
  testimonials={customerTestimonials}
  stats={platformStats}
/>
```

**Features:**
- Testimonial carousel
- Stat counters
- Company logos
- Case study links

---

## Interactive Components

### ThemeToggle

**Purpose:** Toggle between light and dark themes.

**Location:** `components/theme-toggle.tsx`

**Props:**
```typescript
interface ThemeToggleProps {
  className?: string
}
```

**Usage:**
```tsx
import { ThemeToggle } from '@/components/theme-toggle'

<ThemeToggle />
```

**Features:**
- Smooth theme transition
- Icon animation
- Persists preference
- System theme detection

**Accessibility:**
- ARIA label
- Keyboard accessible
- Focus indicator
- Screen reader announcement

---

### UserMenu

**Purpose:** Dropdown menu with user profile options.

**Location:** `components/user-menu.tsx`

**Props:**
```typescript
interface UserMenuProps {
  user: {
    name: string
    email: string
    avatar?: string
    tier: string
  }
  className?: string
}
```

**Usage:**
```tsx
import { UserMenu } from '@/components/user-menu'

<UserMenu user={currentUser} />
```

**Features:**
- Profile information
- Navigation links
- Sign out option
- Tier badge

**Accessibility:**
- ARIA menu pattern
- Keyboard navigation
- Focus trap
- Escape to close

---

### KeyboardShortcutsDialog

**Purpose:** Modal displaying keyboard shortcuts.

**Location:** `components/keyboard-shortcuts-dialog.tsx`

**Props:**
```typescript
interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}
```

**Usage:**
```tsx
import { KeyboardShortcutsDialog } from '@/components/keyboard-shortcuts-dialog'

<KeyboardShortcutsDialog 
  open={isOpen}
  onOpenChange={setIsOpen}
/>
```

**Features:**
- Grouped shortcuts
- Platform detection (Mac/Windows)
- Search functionality
- Printable format

**Accessibility:**
- Modal dialog pattern
- Focus trap
- Escape to close
- Screen reader friendly

---

### AccessibilitySettings

**Purpose:** User accessibility preferences panel.

**Location:** `components/accessibility-settings.tsx`

**Props:**
```typescript
interface AccessibilitySettingsProps {
  className?: string
}
```

**Usage:**
```tsx
import { AccessibilitySettings } from '@/components/accessibility-settings'

<AccessibilitySettings />
```

**Features:**
- Reduced motion toggle
- High contrast mode
- Font size adjustment
- Keyboard navigation help

**Accessibility:**
- Clear labels
- Immediate feedback
- Persists preferences
- Screen reader support

---

## Utility Components

### ScrollReveal

**Purpose:** Animate elements on scroll into view.

**Location:** `components/scroll-reveal.tsx`

**Props:**
```typescript
interface ScrollRevealProps {
  children: React.ReactNode
  animation?: 'fade' | 'slide-up' | 'scale'
  delay?: number
  threshold?: number
  className?: string
}
```

**Usage:**
```tsx
import { ScrollReveal } from '@/components/scroll-reveal'

<ScrollReveal animation="slide-up" delay={200}>
  <div>Content to reveal</div>
</ScrollReveal>
```

**Features:**
- Intersection Observer API
- Multiple animation types
- Staggered delays
- Respects reduced motion

**Accessibility:**
- Respects `prefers-reduced-motion`
- No layout shift
- Maintains content accessibility

---

### LoadingSkeleton

**Purpose:** Placeholder for loading content.

**Location:** `components/loading-skeleton.tsx`

**Props:**
```typescript
interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'avatar' | 'custom'
  width?: string | number
  height?: string | number
  count?: number
  className?: string
}
```

**Usage:**
```tsx
import { LoadingSkeleton } from '@/components/loading-skeleton'

<LoadingSkeleton variant="card" count={3} />
```

**Features:**
- Multiple variants
- Shimmer animation
- Customizable dimensions
- Responsive

**Accessibility:**
- ARIA live region
- Loading announcement
- Maintains layout

---

### ErrorBoundary

**Purpose:** Catch and display React errors gracefully.

**Location:** `components/error-boundary.tsx`

**Props:**
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}
```

**Usage:**
```tsx
import { ErrorBoundary } from '@/components/error-boundary'

<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

**Features:**
- Error catching
- Custom fallback UI
- Error logging
- Retry functionality

**Accessibility:**
- Clear error messages
- Actionable recovery options
- Keyboard accessible

---

### SkipLink

**Purpose:** Skip to main content link for keyboard users.

**Location:** `components/skip-link.tsx`

**Props:**
```typescript
interface SkipLinkProps {
  href?: string
  className?: string
}
```

**Usage:**
```tsx
import { SkipLink } from '@/components/skip-link'

<SkipLink href="#main-content" />
```

**Features:**
- Hidden until focused
- Smooth scroll
- Customizable target

**Accessibility:**
- First focusable element
- Visible on focus
- Clear label

---

### WebVitals

**Purpose:** Monitor and report Core Web Vitals.

**Location:** `components/web-vitals.tsx`

**Props:**
```typescript
interface WebVitalsProps {
  onMetric?: (metric: Metric) => void
}
```

**Usage:**
```tsx
import { WebVitals } from '@/components/web-vitals'

<WebVitals onMetric={handleMetric} />
```

**Features:**
- LCP, FID, CLS tracking
- Performance monitoring
- Analytics integration

---

## UI Primitives

### Button

**Location:** `components/ui/button.tsx`

**Variants:**
- `default`: Primary button
- `secondary`: Secondary button
- `outline`: Outlined button
- `ghost`: Minimal button
- `link`: Link-styled button
- `destructive`: Destructive action

**Sizes:**
- `sm`: Small (32px height)
- `md`: Medium (40px height)
- `lg`: Large (48px height)
- `icon`: Square icon button

**Usage:**
```tsx
import { Button } from '@/components/ui/button'

<Button variant="default" size="lg">
  Click me
</Button>
```

**Accessibility:**
- Semantic `<button>` element
- Disabled state
- Loading state
- Focus indicator

---

### Card

**Location:** `components/ui/card.tsx`

**Components:**
- `Card`: Container
- `CardHeader`: Header section
- `CardTitle`: Title
- `CardDescription`: Description
- `CardContent`: Main content
- `CardFooter`: Footer section

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content
  </CardContent>
</Card>
```

---

### Dialog

**Location:** `components/ui/dialog.tsx`

**Components:**
- `Dialog`: Root component
- `DialogTrigger`: Trigger button
- `DialogContent`: Modal content
- `DialogHeader`: Header section
- `DialogTitle`: Title
- `DialogDescription`: Description
- `DialogFooter`: Footer section

**Usage:**
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    Content
  </DialogContent>
</Dialog>
```

**Accessibility:**
- Modal dialog pattern
- Focus trap
- Escape to close
- ARIA attributes

---

## Best Practices

### Component Development

1. **Use TypeScript** for all components with proper prop types
2. **Export prop interfaces** for documentation and reuse
3. **Provide default props** where appropriate
4. **Use forwardRef** for components that need ref access
5. **Implement error boundaries** for complex components

### Styling

1. **Use design tokens** from `lib/design-system.ts`
2. **Apply consistent spacing** from spacing scale
3. **Use glass effects** from predefined classes
4. **Maintain responsive design** with mobile-first approach
5. **Test in both themes** (light and dark)

### Accessibility

1. **Use semantic HTML** elements
2. **Provide ARIA labels** for icon buttons
3. **Ensure keyboard navigation** works
4. **Test with screen readers**
5. **Maintain focus indicators**

### Performance

1. **Lazy load** heavy components
2. **Use React.memo** for expensive renders
3. **Optimize images** with Next.js Image
4. **Minimize re-renders** with proper dependencies
5. **Profile performance** regularly

### Testing

1. **Write unit tests** for logic
2. **Test accessibility** with axe
3. **Test keyboard navigation**
4. **Test on real devices**
5. **Monitor performance metrics**

---

## Resources

- **Design System:** `.kiro/specs/ui-ux-enhancement/DESIGN_SYSTEM.md`
- **Design Tokens:** `lib/design-system.ts`
- **Global Styles:** `app/globals.css`
- **Component Examples:** Check individual component files

---

## Contributing

When adding new components:

1. Follow existing patterns and conventions
2. Document props with TypeScript interfaces
3. Add accessibility features
4. Test in both themes
5. Update this documentation
6. Add usage examples
7. Include accessibility notes

---

## Version History

- **v1.0.0** (2025-10-29): Initial component library documentation
