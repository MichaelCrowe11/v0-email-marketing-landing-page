# Performance Testing Guide

## Overview

This directory contains comprehensive performance testing for the Crowe Logic AI platform. Tests measure Core Web Vitals, run Lighthouse audits, and profile runtime performance.

## Setup

### Prerequisites

1. Install Lighthouse and Chrome Launcher:
```bash
npm install -D lighthouse chrome-launcher
npm install -D playwright-lighthouse
```

2. Install performance monitoring tools:
```bash
npm install -D web-vitals
```

## Running Tests

### Lighthouse Audits

Run full Lighthouse audits:
```bash
npm run test:lighthouse
```

### Core Web Vitals

Measure Core Web Vitals:
```bash
npm run test:vitals
```

### Network Performance

Test on different network conditions:
```bash
npm run test:network
```

### Full Performance Suite

Run all performance tests:
```bash
npm run test:performance
```

## Performance Targets

### Core Web Vitals

| Metric | Target | Description |
|--------|--------|-------------|
| **FCP** | < 1.5s | First Contentful Paint |
| **LCP** | < 2.5s | Largest Contentful Paint |
| **TTI** | < 3.5s | Time to Interactive |
| **CLS** | < 0.1 | Cumulative Layout Shift |
| **FID** | < 100ms | First Input Delay |
| **TBT** | < 200ms | Total Blocking Time |

### Lighthouse Scores

| Category | Target | Description |
|----------|--------|-------------|
| **Performance** | 90+ | Loading speed and runtime performance |
| **Accessibility** | 95+ | WCAG compliance and usability |
| **Best Practices** | 90+ | Code quality and security |
| **SEO** | 90+ | Search engine optimization |

### Resource Budgets

| Resource | Budget | Description |
|----------|--------|-------------|
| **JavaScript** | < 500KB | Total JS bundle size |
| **CSS** | < 100KB | Total CSS size |
| **Images** | < 2MB | Total image size |
| **Fonts** | < 200KB | Total font size |
| **Total** | < 3MB | Total page weight |

## Testing Methodology

### Desktop Testing

Desktop tests use:
- **Viewport**: 1350x940
- **Network**: Fast 3G (10 Mbps)
- **CPU**: No throttling
- **Device**: Desktop Chrome

### Mobile Testing

Mobile tests use:
- **Viewport**: 375x667 (iPhone SE)
- **Network**: Slow 4G (1.6 Mbps)
- **CPU**: 4x slowdown
- **Device**: Mobile Chrome

### Network Conditions

| Network | Download | Upload | Latency |
|---------|----------|--------|---------|
| **Fast 3G** | 1.6 Mbps | 750 Kbps | 150ms |
| **Slow 4G** | 4 Mbps | 3 Mbps | 100ms |
| **4G** | 10 Mbps | 10 Mbps | 40ms |

## Interpreting Results

### Lighthouse Scores

**90-100**: Excellent - No action needed
**50-89**: Needs improvement - Review recommendations
**0-49**: Poor - Immediate action required

### Core Web Vitals

**Good**: Meets target thresholds
**Needs Improvement**: Close to target, minor optimizations needed
**Poor**: Significantly exceeds target, major optimizations required

### Performance Metrics

```
FCP (First Contentful Paint)
├── Good: 0-1.8s
├── Needs Improvement: 1.8-3.0s
└── Poor: > 3.0s

LCP (Largest Contentful Paint)
├── Good: 0-2.5s
├── Needs Improvement: 2.5-4.0s
└── Poor: > 4.0s

CLS (Cumulative Layout Shift)
├── Good: 0-0.1
├── Needs Improvement: 0.1-0.25
└── Poor: > 0.25

FID (First Input Delay)
├── Good: 0-100ms
├── Needs Improvement: 100-300ms
└── Poor: > 300ms
```

## Optimization Strategies

### Image Optimization

1. **Use Next.js Image Component**
```tsx
import Image from 'next/image';

<Image
  src="/mushroom.jpg"
  alt="Mushroom"
  width={800}
  height={600}
  loading="lazy"
  quality={85}
/>
```

2. **Use Modern Formats**
- WebP for photos (30% smaller than JPEG)
- AVIF for even better compression (50% smaller)
- SVG for icons and logos

3. **Lazy Load Below-Fold Images**
```tsx
<Image loading="lazy" />
```

### JavaScript Optimization

1. **Code Splitting**
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSkeleton />,
});
```

2. **Tree Shaking**
```tsx
// ❌ Bad - imports entire library
import _ from 'lodash';

// ✅ Good - imports only what's needed
import debounce from 'lodash/debounce';
```

3. **Minimize Third-Party Scripts**
- Audit all third-party scripts
- Load non-critical scripts async
- Use script strategy in Next.js

### CSS Optimization

1. **Critical CSS**
```tsx
// Inline critical CSS in <head>
<style dangerouslySetInnerHTML={{ __html: criticalCss }} />
```

2. **Remove Unused CSS**
```bash
npm install -D purgecss
```

3. **Use CSS Containment**
```css
.component {
  contain: layout style paint;
}
```

### Runtime Performance

1. **Use React.memo**
```tsx
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});
```

2. **Optimize Re-renders**
```tsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
```

3. **Virtual Scrolling**
```tsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={1000}
  itemSize={50}
>
  {Row}
</FixedSizeList>
```

### Animation Performance

1. **Use CSS Transforms**
```css
/* ❌ Bad - triggers layout */
.element {
  animation: move 1s;
}
@keyframes move {
  to { left: 100px; }
}

/* ✅ Good - GPU accelerated */
.element {
  animation: move 1s;
}
@keyframes move {
  to { transform: translateX(100px); }
}
```

2. **Use will-change**
```css
.animated {
  will-change: transform, opacity;
}
```

3. **Debounce Expensive Operations**
```tsx
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  []
);
```

## Monitoring in Production

### Real User Monitoring (RUM)

1. **Web Vitals Library**
```tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

2. **Send to Analytics**
```tsx
function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  const url = '/api/analytics';
  
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: 'POST', keepalive: true });
  }
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

### Performance Budgets

Set up performance budgets in `next.config.js`:
```js
module.exports = {
  experimental: {
    performanceBudgets: {
      maxInitialLoadSize: 500 * 1024, // 500KB
      maxPageLoadSize: 1000 * 1024,   // 1MB
    },
  },
};
```

### Continuous Monitoring

1. **Lighthouse CI**
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install && npm run build
      - run: npm install -g @lhci/cli
      - run: lhci autorun
```

2. **Performance Alerts**
- Set up alerts for performance regressions
- Monitor Core Web Vitals trends
- Track bundle size changes

## Troubleshooting

### Slow FCP/LCP

1. **Check server response time**
2. **Optimize critical rendering path**
3. **Preload critical resources**
4. **Reduce render-blocking resources**

### High CLS

1. **Set explicit dimensions for images**
2. **Reserve space for ads/embeds**
3. **Avoid inserting content above existing content**
4. **Use CSS containment**

### Poor FID/TBT

1. **Break up long tasks**
2. **Optimize JavaScript execution**
3. **Use web workers for heavy computation**
4. **Defer non-critical JavaScript**

### Large Bundle Size

1. **Analyze bundle with webpack-bundle-analyzer**
2. **Remove unused dependencies**
3. **Use dynamic imports**
4. **Enable tree shaking**

## Tools and Resources

### Testing Tools
- **Lighthouse**: https://developers.google.com/web/tools/lighthouse
- **WebPageTest**: https://www.webpagetest.org/
- **Chrome DevTools**: Built-in performance profiler
- **Playwright**: Automated performance testing

### Monitoring Tools
- **Vercel Analytics**: Built-in for Vercel deployments
- **Google Analytics**: Web Vitals reporting
- **Sentry**: Performance monitoring
- **New Relic**: Application performance monitoring

### Documentation
- **Web Vitals**: https://web.dev/vitals/
- **Next.js Performance**: https://nextjs.org/docs/advanced-features/measuring-performance
- **React Performance**: https://react.dev/learn/render-and-commit

## Requirements Coverage

This testing setup addresses:
- **Requirement 8.1**: Loading optimizations
- **Requirement 8.2**: Runtime performance
- **Requirement 8.3**: Animation performance
- **Requirement 8.4**: Image optimization
- **Requirement 8.5**: Core Web Vitals targets
