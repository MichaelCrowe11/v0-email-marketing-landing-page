# Mobile Optimization Developer Guide

## Quick Reference for Using Mobile Optimizations

### CSS Classes Available

#### Performance Optimization Classes

```css
/* CSS Containment */
.mobile-contain-layout      /* Layout containment */
.mobile-contain-paint       /* Paint containment */
.mobile-contain-strict      /* Strict containment */
.mobile-contain-content     /* Content containment */

/* Lazy Loading */
.lazy-load                  /* Content visibility auto */
.below-fold                 /* Lazy load below-fold content */
.critical-content           /* Ensure immediate rendering */

/* Scroll Optimization */
.mobile-scroll-optimized    /* Optimized scrolling with GPU acceleration */
.momentum-scroll            /* Momentum scrolling */
.no-overscroll             /* Prevent overscroll bounce */

/* Component Optimization */
.mobile-list-optimized      /* Optimized list rendering */
.mobile-list-item-optimized /* Optimized list item */
.mobile-grid-optimized      /* Optimized grid rendering */
.mobile-card-optimized      /* Optimized card rendering */
.mobile-modal-optimized     /* Optimized modal rendering */
```

#### iOS-Specific Classes

```css
/* iOS Compatibility */
.ios-compatible             /* Universal iOS fixes */

/* Component-Specific iOS Fixes */
.terminal-mobile-optimized  /* Optimized terminal for mobile */
.chat-demo-mobile-optimized /* Optimized chat demo */
.pricing-card-mobile-optimized /* Optimized pricing cards */
.feature-card-mobile-optimized /* Optimized feature cards */
.sidebar-mobile-optimized   /* Optimized sidebar */
.header-mobile-optimized    /* Optimized header */
```

### HTML Attributes for iOS

#### Video Elements
```html
<!-- Enable inline playback on iOS -->
<video playsinline webkit-playsinline>
  <source src="video.mp4" type="video/mp4">
</video>
```

#### Audio Elements
```html
<!-- Enable inline playback on iOS -->
<audio playsinline webkit-playsinline>
  <source src="audio.mp3" type="audio/mpeg">
</audio>
```

#### Input Elements
```html
<!-- Prevent iOS zoom - use 16px minimum font size -->
<input type="text" style="font-size: 16px;" />

<!-- Use appropriate input modes for better keyboards -->
<input type="email" inputmode="email" />
<input type="tel" inputmode="tel" />
<input type="number" inputmode="numeric" />
<input type="search" inputmode="search" />
```

### Next.js Image Optimization

```tsx
import Image from 'next/image'

// Optimized image with lazy loading
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Priority image (above the fold)
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority
/>
```

### Performance Best Practices

#### 1. Use CSS Containment
```tsx
// For list items
<div className="mobile-list-item-optimized">
  {/* Content */}
</div>

// For cards
<div className="mobile-card-optimized">
  {/* Content */}
</div>
```

#### 2. Lazy Load Below-Fold Content
```tsx
// Content below the fold
<section className="below-fold">
  {/* This will lazy load */}
</section>

// Critical above-fold content
<section className="critical-content">
  {/* This renders immediately */}
</section>
```

#### 3. Optimize Animations on Mobile
```tsx
// Component with reduced animations on mobile
<div className="animate-spin-slow md:animate-spin">
  {/* Slower animation on mobile */}
</div>
```

#### 4. Use Optimized Scrolling
```tsx
// Scrollable container
<div className="mobile-scroll-optimized overflow-y-auto">
  {/* Scrollable content */}
</div>
```

### iOS-Specific Best Practices

#### 1. Handle Safe Area Insets
```tsx
// Component that respects safe areas
<div className="mobile-sticky-header">
  {/* Automatically handles notch */}
</div>

<div className="mobile-sticky-cta">
  {/* Automatically handles home indicator */}
</div>
```

#### 2. Prevent Input Zoom
```tsx
// All inputs automatically have 16px minimum
<input
  type="text"
  className="mobile-search-input"
  placeholder="Search..."
/>
```

#### 3. Optimize for iOS Viewport
```tsx
// Full height on iOS
<div className="min-h-screen">
  {/* Automatically uses -webkit-fill-available */}
</div>
```

### Testing Checklist

#### Mobile Performance
- [ ] Run Lighthouse audit (target: 90+ performance score)
- [ ] Test on 3G network
- [ ] Check Core Web Vitals
- [ ] Verify lazy loading works
- [ ] Test scroll performance (60fps)

#### iOS-Specific
- [ ] Test on iPhone with notch (safe area insets)
- [ ] Test input focus (no zoom)
- [ ] Test orientation changes
- [ ] Test scrolling (momentum)
- [ ] Test modal behavior
- [ ] Test video/audio playback

#### Touch Interactions
- [ ] Verify 44x44px minimum touch targets
- [ ] Test touch feedback (ripple effects)
- [ ] Test swipe gestures
- [ ] Test form inputs

### Common Issues and Solutions

#### Issue: Input Zooms on iOS
**Solution**: Ensure font-size is at least 16px
```css
input {
  font-size: 16px !important;
}
```

#### Issue: Content Hidden by Notch
**Solution**: Use safe area insets
```css
.header {
  padding-top: max(1rem, env(safe-area-inset-top));
}
```

#### Issue: Slow Scrolling Performance
**Solution**: Use optimized scroll class
```tsx
<div className="mobile-scroll-optimized">
  {/* Content */}
</div>
```

#### Issue: Animations Lag on Mobile
**Solution**: Reduce animation complexity
```css
@media (max-width: 768px) {
  .animate-spin-slow {
    animation-duration: 6s; /* Slower = less CPU */
  }
}
```

#### Issue: Images Load Slowly
**Solution**: Use Next.js Image with optimization
```tsx
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
/>
```

### Performance Monitoring

#### Check Performance in DevTools
```javascript
// Monitor Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

#### Lighthouse CI
```bash
# Run Lighthouse audit
npm install -g @lhci/cli
lhci autorun
```

### Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [CSS Containment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Containment)
- [iOS Safe Area](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [Web Vitals](https://web.dev/vitals/)
- [Mobile Performance](https://web.dev/mobile/)

### Support

For issues or questions about mobile optimizations:
1. Check this guide first
2. Review the implementation summary
3. Check the design document
4. Test on actual devices
5. Use browser DevTools for debugging

### Version History

- **v1.0** (Current): Initial mobile optimization implementation
  - Performance enhancements
  - iOS-specific fixes
  - Touch optimizations
  - Layout optimizations
