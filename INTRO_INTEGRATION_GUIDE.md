# Intro Integration Guide
## Dual-Intro Strategy for Crowe Logic

**Version:** 1.0.0
**Last Updated:** 2025-11-05

---

## 🎯 Strategy Overview

Crowe Logic uses a **dual-intro system** to create contextual first impressions:

1. **Big Bang Intro** - Landing page (first visit)
2. **Code Generation Intro** - IDE/Workbench (first access)

This ensures users see relevant demonstrations based on their entry point.

---

## 📍 Intro Mapping

```
User Journey                 Intro Type              File Location
───────────────────────────────────────────────────────────────────────
First visit to /            → Big Bang Intro       → components/big-bang-intro.tsx
First access to /workbench  → Code Generation     → components/code-generation-intro.tsx
Direct to /chat             → None (direct access)
Direct to /docs             → None (direct access)
```

---

## 🔧 Implementation

### Option 1: Replace Current Intro (Landing Page Only)

Update `app/page.tsx` to use Big Bang Intro:

```tsx
"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { OrchestratedHero } from "@/components/orchestrated-hero"
// ... other imports

// Lazy load Big Bang Intro
const BigBangIntro = dynamic(() => import("@/components/big-bang-intro").then(mod => ({ default: mod.BigBangIntro })), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black" />
})

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [hasSeenIntro, setHasSeenIntro] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const resetIntro = params.get("reset-intro")

    if (resetIntro === "true") {
      localStorage.removeItem("crowe-bigbang-intro-seen")
      window.location.href = "/"
      return
    }

    const introSeen = localStorage.getItem("crowe-bigbang-intro-seen")
    if (introSeen === "true") {
      setShowIntro(false)
      setHasSeenIntro(true)
    }
  }, [])

  const handleIntroComplete = () => {
    setShowIntro(false)
    setHasSeenIntro(true)
    localStorage.setItem("crowe-bigbang-intro-seen", "true")
  }

  if (showIntro && !hasSeenIntro) {
    return <BigBangIntro onComplete={handleIntroComplete} />
  }

  return (
    <main className="min-h-screen">
      <OrchestratedHero />
      {/* Rest of your page */}
    </main>
  )
}
```

---

### Option 2: Keep Both Intros (Recommended)

Keep Big Bang for landing page, Code Generation for workbench.

#### Step 1: Update Landing Page (`app/page.tsx`)

```tsx
// Change the localStorage key to differentiate
const BigBangIntro = dynamic(() => import("@/components/big-bang-intro").then(mod => ({ default: mod.BigBangIntro })), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black" />
})

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [hasSeenIntro, setHasSeenIntro] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    // NEW: Use separate localStorage key
    const introSeen = localStorage.getItem("crowe-bigbang-intro-seen")
    if (introSeen === "true") {
      setShowIntro(false)
      setHasSeenIntro(true)
    }
  }, [])

  const handleIntroComplete = () => {
    setShowIntro(false)
    setHasSeenIntro(true)
    // NEW: Different localStorage key
    localStorage.setItem("crowe-bigbang-intro-seen", "true")
  }

  if (showIntro && !hasSeenIntro) {
    return <BigBangIntro onComplete={handleIntroComplete} />
  }

  return (
    <main className="min-h-screen">
      {/* Your existing content */}
    </main>
  )
}
```

#### Step 2: Update Workbench Page (`app/workbench/page.tsx`)

Keep the existing code generation intro, but ensure it uses a different localStorage key:

```tsx
// Assuming this is in your workbench page
useEffect(() => {
  // Keep this key different from landing page
  const introSeen = localStorage.getItem("crowe-intro-seen") // Original key
  if (introSeen === "true") {
    setShowIntro(false)
    setHasSeenIntro(true)
  }
}, [])

const handleIntroComplete = () => {
  setShowIntro(false)
  setHasSeenIntro(true)
  localStorage.setItem("crowe-intro-seen", "true") // Original key
}
```

Now you have:
- `crowe-bigbang-intro-seen` - Landing page
- `crowe-intro-seen` - Workbench/IDE

---

## 🎨 Using Design Language Components

### Particle Background

Add ambient particles to any section:

```tsx
import { ParticleBackground } from "@/components/particle-background"

export function MyComponent() {
  return (
    <section className="relative min-h-screen bg-black">
      <ParticleBackground
        particleCount={1500}
        colors={["#C9A961", "#45B7D1", "#9B59B6"]}
        speed={0.003}
      />

      <div className="relative z-10">
        {/* Your content here */}
      </div>
    </section>
  )
}
```

**Use cases**:
- Hero sections
- Feature highlights
- Testimonials background
- Pricing pages

---

### Golden Ring Avatar

Wrap any image or content in golden ring:

```tsx
import { GoldenRing } from "@/components/golden-ring"
import Image from "next/image"

export function ProfileCard() {
  return (
    <GoldenRing size="lg" glow pulse>
      <Image
        src="/avatar.png"
        alt="Profile"
        width={128}
        height={128}
        className="w-full h-full object-cover"
      />
    </GoldenRing>
  )
}
```

**Use cases**:
- User avatars
- Team member photos
- Featured content
- Premium badges
- Agent representations

---

## 🎭 Intro Triggers

### Manual Trigger Options

#### Reset Landing Intro
```
https://yoursite.com/?reset-intro=true
```

#### Reset Workbench Intro
```
https://yoursite.com/workbench?reset-intro=true
```

#### Force Show Intro (Testing)
```tsx
// In your component
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    // localStorage.removeItem("crowe-bigbang-intro-seen")
    // localStorage.removeItem("crowe-intro-seen")
  }
}, [])
```

---

## 📊 Analytics Integration

Track intro completion:

```tsx
const handleIntroComplete = () => {
  setShowIntro(false)
  setHasSeenIntro(true)
  localStorage.setItem("crowe-bigbang-intro-seen", "true")

  // Track analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'intro_complete', {
      intro_type: 'big_bang',
      duration_seconds: 8
    })
  }
}
```

---

## 🎯 Best Practices

### 1. Loading Performance

Always lazy load intros:

```tsx
const BigBangIntro = dynamic(
  () => import("@/components/big-bang-intro").then(mod => ({ default: mod.BigBangIntro })),
  {
    ssr: false,  // Don't render on server
    loading: () => <div className="min-h-screen bg-black" />  // Fallback
  }
)
```

### 2. Reduced Motion

Both intro components respect `prefers-reduced-motion`. No additional setup needed.

### 3. Mobile Optimization

Particle counts automatically adjust:
- Mobile: 1,000 particles
- Tablet: 2,500 particles
- Desktop: 5,000 particles

### 4. Skip Button Accessibility

Both intros include keyboard-accessible skip buttons:
- Click to skip
- Tab + Enter to skip
- Auto-advance after 8 seconds

---

## 🎨 Customization

### Change Big Bang Intro Text

Edit `components/big-bang-intro.tsx`:

```tsx
<motion.h1>
  Your Company Name  {/* Change this */}
</motion.h1>

<motion.p>
  Your Tagline  {/* Change this */}
</motion.p>
```

### Change Particle Colors

```tsx
// In BigBangIntro component
const colorPalette = {
  hot: [0xff6b35, 0xff8c42, 0xffa600],
  cool: [0x4ecdc4, 0x45b7d1, 0x96ceb4],
  nebula: [0xc44569, 0x9b59b6, 0x8e44ad],
  gold: [0xc9a961, 0xd4af37, 0xffd700],
}
```

### Change Duration

```tsx
// In BigBangIntro component
setTimeout(() => onComplete?.(), 8000)  // Change from 8000ms
```

---

## 🐛 Troubleshooting

### Intro Keeps Showing

**Problem**: localStorage not persisting

**Solution**:
```tsx
// Check localStorage in browser console
localStorage.getItem("crowe-bigbang-intro-seen")
localStorage.getItem("crowe-intro-seen")

// Manual clear
localStorage.clear()
```

### Particles Not Showing

**Problem**: Three.js failed to load

**Solution**:
- Check browser console for errors
- Verify CDN is accessible
- Component will fallback gracefully (show avatar only)

### Low Frame Rate

**Problem**: Too many particles for device

**Solution**:
- Particle count auto-adjusts based on screen size
- Manually override in component if needed:

```tsx
<ParticleBackground
  particleCount={500}  // Lower count
  speed={0.001}        // Slower speed
/>
```

---

## 📱 Responsive Behavior

### Avatar Sizes

| Breakpoint | Avatar Size | Text Size |
|------------|-------------|-----------|
| Mobile (<768px) | 150px | 2rem |
| Tablet (768-1024px) | 180px | 2.5rem |
| Desktop (>1024px) | 220px | 3.5rem |

### Particle Counts

| Breakpoint | Particles | Performance |
|------------|-----------|-------------|
| Mobile | 1,000 | 30fps target |
| Tablet | 2,500 | 45fps target |
| Desktop | 5,000 | 60fps target |

---

## 🔄 Migration Path

### From CodeGenerationIntro to BigBangIntro

1. **Backup current setup**:
   ```bash
   git commit -am "Backup before intro migration"
   ```

2. **Test Big Bang Intro**:
   ```
   http://localhost:3000/?reset-intro=true
   ```

3. **Update localStorage key** in `app/page.tsx`

4. **Deploy** and monitor analytics

5. **Keep CodeGenerationIntro** for `/workbench`

---

## 🎯 Future Enhancements

### Planned Features

- [ ] Micro-intros for feature pages
- [ ] Sound effects integration
- [ ] User preference for intro type
- [ ] A/B testing framework
- [ ] Analytics dashboard
- [ ] Custom intro builder

### Potential Micro-Intros

```tsx
// /chat - Conversation bubbles
<ConversationIntro onComplete={handleComplete} />

// /workbench/agents - Agent network
<AgentNetworkIntro onComplete={handleComplete} />

// /crowe-vision - Image analysis
<VisionDemoIntro onComplete={handleComplete} />
```

---

## 📚 Related Documentation

- [Design Language System](./DESIGN_LANGUAGE.md)
- [Big Bang Intro Spec](./crowe-logic-intro/README.md)
- [Component Library](./components/)

---

## ✅ Integration Checklist

Before deploying:

- [ ] Big Bang Intro loads on landing page
- [ ] Code Generation Intro loads on workbench
- [ ] localStorage keys are different for each
- [ ] Skip buttons work on both
- [ ] Auto-advance works (8 seconds)
- [ ] Reduced motion respected
- [ ] Mobile responsive (test on phone)
- [ ] Analytics tracking implemented
- [ ] No console errors
- [ ] Performance: 60fps on desktop

---

## 🆘 Support

**Issues?** Check:
1. Browser console for errors
2. Network tab for failed requests
3. localStorage values
4. Three.js CDN accessibility

**Need help?** Contact: development@crowelogic.com

---

**Version:** 1.0.0
**Last Updated:** 2025-11-05
**Maintained by:** Crowe Logic Development Team
