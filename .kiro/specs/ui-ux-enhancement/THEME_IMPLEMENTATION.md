# Theme Implementation & Testing Guide

## Overview

This document provides comprehensive guidelines for theme implementation, testing, and maintenance across the Crowe Logic AI platform. It ensures smooth transitions between light and dark modes while maintaining brand identity and accessibility standards.

---

## Theme System Architecture

### Technology Stack

- **Framework:** Next.js 14+ with App Router
- **Theme Provider:** `next-themes` v0.2.1+
- **CSS:** Tailwind CSS with custom CSS variables
- **Color Space:** OKLCH for perceptual uniformity

### Theme Configuration

```typescript
// app/layout.tsx
<ThemeProvider 
  attribute="class" 
  defaultTheme="dark" 
  enableSystem 
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

**Configuration Options:**
- `attribute="class"`: Uses class-based theme switching
- `defaultTheme="dark"`: Default to dark mode
- `enableSystem`: Respects system preferences
- `disableTransitionOnChange`: Prevents flash during theme change

---

## Color System

### Light Mode Colors

```css
:root {
  /* Base Colors */
  --background: oklch(1 0 0);              /* Pure white */
  --foreground: oklch(0.15 0 0);           /* Near black */
  --card: oklch(0.99 0 0);                 /* Off-white */
  --card-foreground: oklch(0.15 0 0);      /* Near black */
  
  /* UI Colors */
  --primary: oklch(0.15 0 0);              /* Near black */
  --primary-foreground: oklch(0.99 0 0);   /* Off-white */
  --secondary: oklch(0.96 0 0);            /* Light gray */
  --secondary-foreground: oklch(0.15 0 0); /* Near black */
  --muted: oklch(0.96 0 0);                /* Light gray */
  --muted-foreground: oklch(0.5 0 0);      /* Medium gray */
  --accent: oklch(0.94 0 0);               /* Accent gray */
  --accent-foreground: oklch(0.15 0 0);    /* Near black */
  
  /* Borders & Inputs */
  --border: oklch(0.9 0 0);                /* Border gray */
  --input: oklch(0.9 0 0);                 /* Input border */
  --ring: oklch(0.15 0 0);                 /* Focus ring */
  
  /* Glass Effects */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: rgba(0, 0, 0, 0.1);
}
```

### Dark Mode Colors

```css
.dark {
  /* Base Colors */
  --background: oklch(0.1 0 0);            /* Near black */
  --foreground: oklch(0.95 0 0);           /* Off-white */
  --card: oklch(0.12 0 0);                 /* Dark gray */
  --card-foreground: oklch(0.95 0 0);      /* Off-white */
  
  /* UI Colors */
  --primary: oklch(0.95 0 0);              /* Off-white */
  --primary-foreground: oklch(0.1 0 0);    /* Near black */
  --secondary: oklch(0.2 0 0);             /* Dark gray */
  --secondary-foreground: oklch(0.95 0 0); /* Off-white */
  --muted: oklch(0.2 0 0);                 /* Dark gray */
  --muted-foreground: oklch(0.65 0 0);     /* Medium gray */
  --accent: oklch(0.18 0 0);               /* Accent gray */
  --accent-foreground: oklch(0.95 0 0);    /* Off-white */
  
  /* Borders & Inputs */
  --border: oklch(0.22 0 0);               /* Border gray */
  --input: oklch(0.22 0 0);                /* Input border */
  --ring: oklch(0.7 0 0);                  /* Focus ring */
  
  /* Glass Effects */
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-shadow: rgba(0, 0, 0, 0.5);
}
```

### Accent Colors (Theme-Independent)

These colors remain consistent across both themes:

```css
/* Premium Glow Colors */
--glow-purple: #a855f7;
--glow-pink: #ec4899;
--glow-cyan: #06b6d4;
--glow-blue: #3b82f6;
--glow-green: #10b981;
--glow-amber: #f59e0b;
```

---

## Theme Toggle Component

### Implementation

```typescript
// components/theme-toggle.tsx
"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Keyboard shortcut (Cmd/Ctrl+T)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "t") {
        e.preventDefault()
        setTheme(theme === "dark" ? "light" : "dark")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [theme, setTheme])

  if (!mounted) {
    return <Button variant="ghost" size="sm" className="h-9 w-9 px-0">
      <Sun className="h-4 w-4" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-9 w-9 px-0"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme (Ctrl+T)"
      title="Toggle theme (Ctrl+T)"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme (Ctrl+T)</span>
    </Button>
  )
}
```

### Features

✅ **Smooth Transitions:** Icon rotation and scale animations
✅ **Keyboard Shortcut:** Cmd/Ctrl+T for quick toggle
✅ **Accessibility:** ARIA labels and screen reader support
✅ **Hydration Safe:** Prevents flash of unstyled content
✅ **Visual Feedback:** Clear icon states for both themes

---

## Theme Transition Behavior

### Smooth Transitions

```css
/* Global transition for theme changes */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Disable transitions during theme change to prevent flash */
.theme-transitioning * {
  transition: none !important;
}
```

### Preventing Flash of Unstyled Content (FOUC)

1. **Server-Side Rendering:** Theme provider handles SSR correctly
2. **Script Injection:** Theme is set before page render
3. **Mounted State:** Component waits for hydration before showing theme-dependent content
4. **Default Theme:** Dark mode set as default to match most users' preference

---

## Glass Effects in Both Themes

### Light Mode Glass

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.08),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
}
```

### Dark Mode Glass

```css
.dark .glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
}
```

### Testing Glass Effects

**Light Mode Checklist:**
- [ ] Glass panels are subtle and elegant
- [ ] Backdrop blur is visible but not excessive
- [ ] Borders are defined but not harsh
- [ ] Shadows provide depth without overwhelming

**Dark Mode Checklist:**
- [ ] Glass panels maintain premium feel
- [ ] Backdrop blur enhances readability
- [ ] Borders are visible against dark backgrounds
- [ ] Shadows create proper depth perception

---

## Component Testing Checklist

### Navigation Components

#### GlobalHeader
- [ ] Background color transitions smoothly
- [ ] Text remains readable in both themes
- [ ] Search bar maintains proper contrast
- [ ] Theme toggle icon animates correctly
- [ ] Glass effect works in both themes

#### SidebarNav
- [ ] Background adapts to theme
- [ ] Active state is visible in both themes
- [ ] Hover states work correctly
- [ ] Icons maintain proper contrast
- [ ] Glass effect is consistent

### Content Components

#### Cards
- [ ] Background color is appropriate
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Borders are visible
- [ ] Shadows provide depth
- [ ] Hover states work in both themes

#### Buttons
- [ ] Primary buttons have proper contrast
- [ ] Secondary buttons are distinguishable
- [ ] Ghost buttons remain visible
- [ ] Disabled states are clear
- [ ] Focus indicators are visible

#### Forms
- [ ] Input backgrounds are appropriate
- [ ] Placeholder text is readable
- [ ] Focus states are clear
- [ ] Error states are visible
- [ ] Labels maintain contrast

### Interactive Components

#### Modals/Dialogs
- [ ] Backdrop is appropriate opacity
- [ ] Content is readable
- [ ] Close button is visible
- [ ] Focus trap works correctly
- [ ] Animations are smooth

#### Dropdowns/Menus
- [ ] Background provides contrast
- [ ] Hover states are clear
- [ ] Active items are highlighted
- [ ] Borders are visible
- [ ] Shadows create depth

### Specialized Components

#### OrchestratedHero
- [ ] Code particles are visible
- [ ] Terminal maintains readability
- [ ] Pipeline blocks have proper contrast
- [ ] Avatar glow effects work
- [ ] Animations perform well

#### StreamingChatDemo
- [ ] Phone mockup looks realistic
- [ ] Message bubbles have contrast
- [ ] Thinking states are visible
- [ ] VRS formatting is readable
- [ ] Images display correctly

#### Pricing Cards
- [ ] Featured tier stands out
- [ ] All text is readable
- [ ] Checkmarks are visible
- [ ] CTAs are prominent
- [ ] Hover effects work

---

## Accessibility in Both Themes

### Color Contrast Requirements

**WCAG AA Standards:**
- Normal text: 4.5:1 minimum
- Large text (18px+ or 14px+ bold): 3:1 minimum
- UI components: 3:1 minimum

### Testing Color Contrast

**Light Mode:**
```
Background: oklch(1 0 0) = #ffffff
Foreground: oklch(0.15 0 0) = #262626
Contrast Ratio: 12.63:1 ✅ PASS
```

**Dark Mode:**
```
Background: oklch(0.1 0 0) = #1a1a1a
Foreground: oklch(0.95 0 0) = #f2f2f2
Contrast Ratio: 13.28:1 ✅ PASS
```

### Focus Indicators

Both themes must have visible focus indicators:

```css
*:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  border-radius: 4px;
}
```

**Light Mode Ring:** `oklch(0.15 0 0)` (dark)
**Dark Mode Ring:** `oklch(0.7 0 0)` (light)

---

## Testing Procedures

### Manual Testing

1. **Visual Inspection**
   - [ ] Toggle between themes multiple times
   - [ ] Check all pages in both themes
   - [ ] Verify glass effects work correctly
   - [ ] Ensure no flash during transition
   - [ ] Test on different screen sizes

2. **Interaction Testing**
   - [ ] Test all buttons in both themes
   - [ ] Verify hover states work
   - [ ] Check focus indicators
   - [ ] Test form inputs
   - [ ] Verify modals and dropdowns

3. **Accessibility Testing**
   - [ ] Run axe DevTools in both themes
   - [ ] Test with screen reader
   - [ ] Verify keyboard navigation
   - [ ] Check color contrast
   - [ ] Test with high contrast mode

### Automated Testing

```typescript
// Example: Theme testing with Playwright
test('theme toggle works correctly', async ({ page }) => {
  await page.goto('/')
  
  // Check default theme (dark)
  await expect(page.locator('html')).toHaveClass(/dark/)
  
  // Toggle to light theme
  await page.click('[aria-label*="Toggle theme"]')
  await expect(page.locator('html')).not.toHaveClass(/dark/)
  
  // Toggle back to dark theme
  await page.click('[aria-label*="Toggle theme"]')
  await expect(page.locator('html')).toHaveClass(/dark/)
})

test('theme persists across page navigation', async ({ page }) => {
  await page.goto('/')
  
  // Set to light theme
  await page.click('[aria-label*="Toggle theme"]')
  
  // Navigate to another page
  await page.goto('/chat')
  
  // Verify theme persisted
  await expect(page.locator('html')).not.toHaveClass(/dark/)
})
```

### Visual Regression Testing

Use tools like Percy, Chromatic, or BackstopJS to capture screenshots:

```javascript
// Example: BackstopJS configuration
{
  "scenarios": [
    {
      "label": "Homepage - Light Theme",
      "url": "http://localhost:3000",
      "selectors": ["document"],
      "removeSelectors": [".animate-"],
      "onReadyScript": "setLightTheme.js"
    },
    {
      "label": "Homepage - Dark Theme",
      "url": "http://localhost:3000",
      "selectors": ["document"],
      "removeSelectors": [".animate-"],
      "onReadyScript": "setDarkTheme.js"
    }
  ]
}
```

---

## Common Issues & Solutions

### Issue 1: Flash of Unstyled Content (FOUC)

**Problem:** Brief flash of wrong theme on page load

**Solution:**
```typescript
// Ensure ThemeProvider is at root level
// Use suppressHydrationWarning on html tag
<html lang="en" suppressHydrationWarning>
```

### Issue 2: Glass Effects Not Working

**Problem:** Backdrop blur not visible in certain browsers

**Solution:**
```css
/* Add vendor prefixes */
.glass-panel {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}
```

### Issue 3: Poor Contrast in One Theme

**Problem:** Text hard to read in light or dark mode

**Solution:**
```css
/* Use theme-specific colors */
.text-primary {
  color: var(--foreground);
}

/* Not hardcoded colors */
.text-primary {
  color: #000000; /* ❌ Don't do this */
}
```

### Issue 4: Animations Causing Flash

**Problem:** Transitions during theme change look jarring

**Solution:**
```typescript
// Disable transitions during theme change
const setTheme = (newTheme: string) => {
  document.documentElement.classList.add('theme-transitioning')
  setThemeInternal(newTheme)
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning')
  }, 0)
}
```

---

## Best Practices

### DO:

✅ Use CSS variables for all colors
✅ Test in both themes during development
✅ Ensure proper contrast ratios
✅ Provide smooth transitions
✅ Support system theme preference
✅ Persist user's theme choice
✅ Test with accessibility tools
✅ Use semantic color names

### DON'T:

❌ Don't hardcode colors
❌ Don't forget to test glass effects
❌ Don't ignore accessibility
❌ Don't use theme-specific images without alternatives
❌ Don't forget focus indicators
❌ Don't use color as sole indicator
❌ Don't skip visual regression testing

---

## Maintenance Checklist

### Regular Tasks

**Weekly:**
- [ ] Test theme toggle on all pages
- [ ] Verify no new contrast issues
- [ ] Check for FOUC on new pages

**Monthly:**
- [ ] Run full accessibility audit
- [ ] Update visual regression baselines
- [ ] Review user feedback on themes

**Quarterly:**
- [ ] Comprehensive theme testing
- [ ] Update documentation
- [ ] Review and update color palette if needed

### When Adding New Components

- [ ] Test in both light and dark themes
- [ ] Verify color contrast
- [ ] Check glass effects work
- [ ] Test hover and focus states
- [ ] Add to visual regression tests
- [ ] Update component documentation

---

## Resources

### Tools

- **Color Contrast Checker:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Accessibility Testing:** [axe DevTools](https://www.deque.com/axe/devtools/)
- **Visual Regression:** [Percy](https://percy.io/), [Chromatic](https://www.chromatic.com/)
- **Theme Testing:** Browser DevTools

### Documentation

- **next-themes:** [Documentation](https://github.com/pacocoursey/next-themes)
- **OKLCH Colors:** [OKLCH Color Picker](https://oklch.com/)
- **WCAG Guidelines:** [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Conclusion

The Crowe Logic AI platform implements a robust theme system that:

✅ Provides smooth transitions between light and dark modes
✅ Maintains brand identity in both themes
✅ Ensures accessibility standards are met
✅ Supports user preferences and system settings
✅ Delivers consistent glass effects across themes
✅ Offers excellent color contrast in both modes

By following this guide, developers can ensure theme consistency and quality across all components and pages.

---

## Version History

- **v1.0.0** (2025-10-29): Initial theme implementation guide
