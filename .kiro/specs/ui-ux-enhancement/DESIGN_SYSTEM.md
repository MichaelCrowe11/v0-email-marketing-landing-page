# Crowe Logic Design System Documentation

## Overview

This document provides comprehensive guidelines for the Crowe Logic AI platform design system. It establishes consistent visual language, interaction patterns, and implementation standards across the entire platform.

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Components](#components)
5. [Animations](#animations)
6. [Accessibility](#accessibility)
7. [Usage Guidelines](#usage-guidelines)

---

## Color System

### Base Palette

The Crowe Logic platform uses a monochromatic base palette inspired by OpenAI's minimalist approach, with vibrant accent colors for AI/tech elements.

#### Light Mode

```css
--background: oklch(1 0 0)           /* Pure white */
--foreground: oklch(0.15 0 0)        /* Near black */
--card: oklch(0.99 0 0)              /* Off-white */
--muted: oklch(0.96 0 0)             /* Light gray */
--border: oklch(0.9 0 0)             /* Border gray */
```

#### Dark Mode

```css
--background: oklch(0.1 0 0)         /* Near black */
--foreground: oklch(0.95 0 0)        /* Off-white */
--card: oklch(0.12 0 0)              /* Dark gray */
--muted: oklch(0.2 0 0)              /* Muted gray */
--border: oklch(0.22 0 0)            /* Border gray */
```

### Premium Glow Colors

These vibrant colors are used for AI elements, highlights, and interactive states:

```css
--glow-purple: #a855f7   /* Primary AI accent */
--glow-pink: #ec4899     /* Secondary accent */
--glow-cyan: #06b6d4     /* Tech/data accent */
--glow-blue: #3b82f6     /* Info/links */
--glow-green: #10b981    /* Success states */
--glow-amber: #f59e0b    /* Warning states */
```

### Semantic Colors

```css
--success: #10b981       /* Success messages, confirmations */
--error: #ef4444         /* Errors, destructive actions */
--warning: #f59e0b       /* Warnings, cautions */
--info: #3b82f6          /* Informational messages */
```

### Color Usage Guidelines

**DO:**
- Use monochromatic base colors for backgrounds, text, and UI elements
- Use glow colors sparingly for emphasis and AI-related features
- Ensure 4.5:1 contrast ratio for normal text (WCAG AA)
- Ensure 3:1 contrast ratio for large text (18px+ or 14px+ bold)
- Use semantic colors consistently for their intended purposes

**DON'T:**
- Don't use color as the sole indicator of information
- Don't use glow colors for large background areas
- Don't mix warm tones (orange, red) with the cool palette
- Don't use low-contrast color combinations

### Glass Morphism Effects

```css
/* Light Mode */
--glass-bg: rgba(255, 255, 255, 0.05)
--glass-border: rgba(255, 255, 255, 0.1)
--glass-shadow: rgba(0, 0, 0, 0.1)

/* Dark Mode */
--glass-bg: rgba(255, 255, 255, 0.03)
--glass-border: rgba(255, 255, 255, 0.08)
--glass-shadow: rgba(0, 0, 0, 0.5)
```

---

## Typography

### Font Families

```css
--font-sans: "Inter", "Inter Fallback", system-ui, -apple-system, sans-serif
--font-mono: "Fira Code", "Fira Code Fallback", "JetBrains Mono", monospace
--font-code: "Fira Code", "JetBrains Mono", "Courier New", monospace
```

### Font Scale

| Size | Value | Usage |
|------|-------|-------|
| xs   | 12px  | Captions, labels |
| sm   | 14px  | Secondary text |
| base | 16px  | Body text (default) |
| lg   | 18px  | Emphasized body text |
| xl   | 20px  | Small headings |
| 2xl  | 24px  | Section headings |
| 3xl  | 32px  | Page headings |
| 4xl  | 40px  | Hero headings |
| 5xl  | 48px  | Large hero text |
| 6xl  | 64px  | Extra large displays |

### Line Heights

| Name    | Value | Usage |
|---------|-------|-------|
| none    | 1.0   | Single line elements |
| tight   | 1.2   | Headings |
| snug    | 1.375 | Compact text |
| normal  | 1.5   | Body text (default) |
| relaxed | 1.6   | Code blocks |
| loose   | 2.0   | Spacious text |

### Font Weights

| Name      | Value | Usage |
|-----------|-------|-------|
| light     | 300   | Subtle text |
| normal    | 400   | Body text (default) |
| medium    | 500   | Emphasized text |
| semibold  | 600   | Subheadings |
| bold      | 700   | Headings |
| extrabold | 800   | Hero text |

### Typography Guidelines

**DO:**
- Use Inter for all UI text and body content
- Use Fira Code for code blocks, terminal output, and technical content
- Enable font ligatures for code (`font-variant-ligatures: common-ligatures`)
- Maintain consistent line heights within sections
- Use font weights to establish hierarchy

**DON'T:**
- Don't use more than 3 font weights on a single page
- Don't use font sizes smaller than 14px for body text
- Don't use all caps for long text passages
- Don't mix font families within the same component

### Code Typography

```css
.terminal-code {
  font-family: var(--font-code);
  font-weight: 500;
  letter-spacing: -0.02em;
  font-variant-ligatures: common-ligatures;
  font-feature-settings: "liga" 1, "calt" 1;
}
```

---

## Spacing & Layout

### Spacing Scale

Based on a 4px base unit for mathematical consistency:

| Token | Value | Usage |
|-------|-------|-------|
| 0     | 0     | No spacing |
| 1     | 4px   | Minimal spacing |
| 2     | 8px   | Tight spacing |
| 3     | 12px  | Small spacing |
| 4     | 16px  | Base spacing (default) |
| 5     | 20px  | Medium spacing |
| 6     | 24px  | Large spacing |
| 8     | 32px  | Extra large spacing |
| 10    | 40px  | Section spacing |
| 12    | 48px  | Large section spacing |
| 16    | 64px  | Hero spacing |
| 20    | 80px  | Extra large sections |
| 24    | 96px  | Page sections |
| 32    | 128px | Major page divisions |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| none  | 0     | Sharp corners |
| sm    | 4px   | Subtle rounding |
| md    | 6px   | Small elements |
| lg    | 8px   | Cards, buttons (default) |
| xl    | 12px  | Large cards |
| 2xl   | 16px  | Prominent elements |
| 3xl   | 24px  | Hero elements |
| full  | 9999px| Circular elements |

### Layout Guidelines

**DO:**
- Use consistent spacing multiples (4, 8, 16, 24, 32)
- Maintain visual rhythm with consistent spacing
- Use larger spacing for section breaks
- Apply appropriate border radius for element size

**DON'T:**
- Don't use arbitrary spacing values
- Don't mix spacing scales within a component
- Don't use excessive border radius on small elements

---

## Components

### Glass Effects

#### Glass Panel (Default)

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.08),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
}
```

**Usage:** Navigation panels, sidebars, overlays

#### Glass Card

```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.06),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.5);
}
```

**Usage:** Content cards, feature cards, pricing tiers

#### Glass Button

```css
.glass-button {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}
```

**Usage:** Secondary buttons, navigation items

#### Glass Terminal

```css
.glass-terminal {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3),
              inset 0 0 60px 0 rgba(0, 255, 0, 0.02);
}
```

**Usage:** Code blocks, terminal displays, technical content

#### Glass Phone

```css
.glass-phone {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px) saturate(200%);
  border: 2px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 60px 0 rgba(0, 0, 0, 0.3),
              0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}
```

**Usage:** Phone mockups, premium showcases

### Shadows

| Name  | Value | Usage |
|-------|-------|-------|
| sm    | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Subtle elevation |
| base  | `0 1px 3px 0 rgba(0, 0, 0, 0.1)` | Default cards |
| md    | `0 4px 6px -1px rgba(0, 0, 0, 0.1)` | Elevated cards |
| lg    | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` | Modals, popovers |
| xl    | `0 20px 25px -5px rgba(0, 0, 0, 0.1)` | Large modals |
| 2xl   | `0 25px 50px -12px rgba(0, 0, 0, 0.25)` | Hero elements |

---

## Animations

### Duration

| Name    | Value  | Usage |
|---------|--------|-------|
| fast    | 150ms  | Micro-interactions |
| base    | 200ms  | Default transitions |
| medium  | 300ms  | Hover effects |
| slow    | 400ms  | Page transitions |
| slower  | 600ms  | Complex animations |
| slowest | 1000ms | Hero animations |

### Easing Functions

| Name      | Value | Usage |
|-----------|-------|-------|
| linear    | `linear` | Continuous motion |
| easeIn    | `cubic-bezier(0.4, 0, 1, 1)` | Accelerating |
| easeOut   | `cubic-bezier(0, 0, 0.2, 1)` | Decelerating |
| easeInOut | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth transitions |
| spring    | `cubic-bezier(0.16, 1, 0.3, 1)` | Bouncy, natural |
| bounce    | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Playful bounce |

### Animation Guidelines

**DO:**
- Use spring easing for most UI interactions
- Keep animations under 400ms for responsiveness
- Respect `prefers-reduced-motion` setting
- Use GPU-accelerated properties (transform, opacity)
- Add `will-change` for animated elements

**DON'T:**
- Don't animate layout properties (width, height, top, left)
- Don't use animations longer than 1 second
- Don't animate multiple properties simultaneously without purpose
- Don't ignore reduced motion preferences

### Common Animations

```css
/* Fade In */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translate3d(0, 8px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

/* Scale In */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale3d(0.96, 0.96, 1);
  }
  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

/* Slide Up */
@keyframes slide-up-fade {
  from {
    opacity: 0;
    transform: translate3d(0, 16px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
```

---

## Accessibility

### Focus Indicators

All interactive elements must have visible focus indicators:

```css
*:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  border-radius: 4px;
}
```

### Color Contrast

- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text (18px+ or 14px+ bold):** Minimum 3:1 contrast ratio
- **UI components:** Minimum 3:1 contrast ratio

### Touch Targets

- **Minimum size:** 44x44 pixels
- **Recommended size:** 48x48 pixels for primary actions
- **Spacing:** Minimum 8px between adjacent touch targets

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### High Contrast Mode

```css
@media (prefers-contrast: more) {
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0 0 0);
    --border: oklch(0 0 0);
  }
  
  .glass-panel,
  .glass-card {
    background: var(--background) !important;
    backdrop-filter: none !important;
    border: 2px solid var(--border) !important;
  }
}
```

---

## Usage Guidelines

### Implementing Design Tokens

```typescript
import { designSystem } from '@/lib/design-system'

// Access colors
const bgColor = designSystem.colors.light.background

// Access spacing
const padding = designSystem.spacing[4] // 16px

// Access animations
const duration = designSystem.animationDuration.medium // 300ms
const easing = designSystem.animationEasing.spring
```

### Using Glass Effects

```tsx
// Default glass panel
<div className="glass-panel rounded-xl p-6">
  Content
</div>

// Premium glass card
<div className="glass-card rounded-2xl p-8 hover:scale-105 transition-transform">
  Content
</div>

// Glass button
<button className="glass-button px-6 py-3 rounded-lg">
  Click me
</button>
```

### Typography Implementation

```tsx
// Heading
<h1 className="text-4xl font-bold leading-tight">
  Hero Heading
</h1>

// Body text
<p className="text-base font-normal leading-normal">
  Body content with optimal readability
</p>

// Code
<code className="font-code text-sm terminal-code">
  const example = true;
</code>
```

### Responsive Design

```tsx
// Mobile-first approach
<div className="
  p-4 sm:p-6 md:p-8 lg:p-12
  text-base sm:text-lg md:text-xl
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
  Responsive content
</div>
```

---

## Best Practices

### Performance

1. **Use CSS transforms** for animations (GPU-accelerated)
2. **Add `will-change`** for elements that will animate
3. **Lazy load** images and heavy components
4. **Use `contain`** CSS property for layout optimization
5. **Minimize backdrop-filter** usage (expensive operation)

### Consistency

1. **Use design tokens** instead of hardcoded values
2. **Follow spacing scale** for all margins and padding
3. **Apply consistent border radius** based on element size
4. **Use semantic color names** for clarity
5. **Maintain visual hierarchy** with typography scale

### Accessibility

1. **Test with keyboard navigation** only
2. **Verify color contrast** with tools
3. **Provide text alternatives** for images
4. **Use semantic HTML** elements
5. **Test with screen readers** (NVDA, JAWS, VoiceOver)

### Mobile Optimization

1. **Use minimum 16px font size** on iOS to prevent zoom
2. **Ensure 44x44px touch targets** minimum
3. **Handle safe area insets** for notched devices
4. **Optimize images** for mobile bandwidth
5. **Test on real devices** when possible

---

## Resources

### Tools

- **Color Contrast Checker:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Accessibility Testing:** [axe DevTools](https://www.deque.com/axe/devtools/)
- **Performance Testing:** [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- **Design Tokens:** `lib/design-system.ts`

### References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## Version History

- **v1.0.0** (2025-10-29): Initial design system documentation
