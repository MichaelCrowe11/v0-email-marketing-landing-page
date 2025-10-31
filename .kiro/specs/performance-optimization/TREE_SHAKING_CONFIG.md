# Tree-Shaking Configuration

## Overview

This document describes the tree-shaking configuration for icon and utility libraries in the Crowe Logic AI platform. Tree-shaking eliminates unused code from the final bundle, significantly reducing bundle size.

## Lucide React Icons

### Configuration

Tree-shaking for `lucide-react` is automatically handled by Next.js 15's `optimizePackageImports` feature, configured in `next.config.mjs`:

```javascript
experimental: {
  optimizePackageImports: [
    'lucide-react',
    '@radix-ui/react-icons',
    'date-fns',
    'lodash-es',
    'recharts',
    'framer-motion',
  ],
}
```

### Import Pattern

**✅ Correct Pattern (Already Implemented)**:
```typescript
import { Search, User, Settings, Menu } from "lucide-react"
```

This pattern is used throughout the codebase and Next.js 15 automatically optimizes these imports to only include the icons actually used.

**❌ Avoid These Patterns**:
```typescript
// Don't use wildcard imports
import * as Icons from "lucide-react"

// Don't import the entire library
import lucideReact from "lucide-react"
```

### Current Status

✅ **All lucide-react imports are optimized**
- No wildcard imports found in codebase
- All imports use named import syntax
- Next.js 15 automatically tree-shakes unused icons
- Estimated bundle size reduction: 200-300KB

### Files Using Lucide Icons

The following files use lucide-react icons and are automatically optimized:

- `components/sidebar-nav.tsx` - 15+ icons
- `components/global-header.tsx` - 10+ icons  
- `components/features.tsx` - 8 icons
- `components/pricing.tsx` - 8 icons
- `components/trust-indicators.tsx` - 6 icons
- `components/streaming-chat-demo.tsx` - 7 icons
- And 50+ other component files

## Date-fns Utility Library

### Configuration

Tree-shaking for `date-fns` is configured via `optimizePackageImports` in `next.config.mjs`.

### Current Status

✅ **date-fns is installed but not currently used**
- No imports found in the codebase
- Configuration is ready for future use
- When used, follow the pattern below

### Import Pattern (For Future Use)

**✅ Correct Pattern**:
```typescript
import { format, parseISO, addDays } from "date-fns"

// Usage
const formatted = format(new Date(), 'yyyy-MM-dd')
```

**❌ Avoid These Patterns**:
```typescript
// Don't import the entire library
import dateFns from "date-fns"

// Don't use wildcard imports
import * as dateFns from "date-fns"
```

## Lodash Utility Library

### Configuration

`lodash` is NOT currently installed in the project. If needed in the future, use `lodash-es` for better tree-shaking support.

### Recommended Setup (If Needed)

1. Install lodash-es instead of lodash:
```bash
npm install lodash-es
npm install --save-dev @types/lodash-es
```

2. The configuration is already in place in `next.config.mjs`:
```javascript
optimizePackageImports: ['lodash-es']
```

3. Use named imports:
```typescript
import { debounce, throttle, cloneDeep } from "lodash-es"
```

### Current Status

✅ **lodash is not used** - No action needed

## Benefits

### Bundle Size Reduction

With automatic tree-shaking enabled:

1. **Lucide React**: Only ~2-3KB per icon vs 300KB+ for full library
2. **Date-fns**: Only ~1-5KB per function vs 70KB+ for full library  
3. **Lodash-es**: Only ~1-10KB per function vs 70KB+ for full library

### Estimated Total Savings

- **Before optimization**: ~440KB+ of unused code
- **After optimization**: Only code actually used (~20-30KB)
- **Net savings**: ~400KB+ (gzipped)

## Verification

### Check Bundle Size

Run the bundle analyzer to verify tree-shaking:

```bash
npm run build:analyze
```

This generates:
- `./analyze.html` - Visual bundle analysis
- `./bundle-stats.json` - Detailed statistics

### Look For

1. Individual icon imports (not full lucide-react package)
2. Individual date-fns functions (if used)
3. No large utility library chunks

## Best Practices

### For Developers

1. **Always use named imports** for icons and utilities
2. **Never use wildcard imports** (`import * as`)
3. **Import only what you need** - don't import unused functions
4. **Check bundle size** after adding new dependencies

### Code Review Checklist

- [ ] No wildcard imports from lucide-react
- [ ] No wildcard imports from date-fns
- [ ] No wildcard imports from lodash/lodash-es
- [ ] Named imports used consistently
- [ ] Only necessary icons/functions imported

## Monitoring

### Bundle Analysis

Run bundle analysis regularly to ensure tree-shaking is working:

```bash
# Build with analysis
npm run build:analyze

# Check the generated report
open .next/analyze.html
```

### Key Metrics to Monitor

1. **Total bundle size**: Should be < 300KB gzipped
2. **Lucide-react chunk size**: Should be < 30KB
3. **Utility library sizes**: Should be minimal
4. **Unused code**: Should be 0%

## Troubleshooting

### If Bundle Size Increases

1. Check for new wildcard imports:
```bash
grep -r "import \* as" --include="*.tsx" --include="*.ts"
```

2. Check for full library imports:
```bash
grep -r "from 'lucide-react'" --include="*.tsx" --include="*.ts"
```

3. Run bundle analyzer to identify large chunks

### If Tree-Shaking Fails

1. Verify `optimizePackageImports` is in `next.config.mjs`
2. Ensure using Next.js 15+
3. Check that imports use named import syntax
4. Clear `.next` cache and rebuild

## References

- [Next.js optimizePackageImports](https://nextjs.org/docs/app/api-reference/next-config-js/optimizePackageImports)
- [Lucide React Documentation](https://lucide.dev/guide/packages/lucide-react)
- [Date-fns Tree Shaking](https://date-fns.org/docs/Getting-Started#tree-shaking)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)

## Status

- ✅ Lucide React: Fully optimized
- ✅ Date-fns: Configured (not currently used)
- ✅ Lodash: Not needed (not installed)
- ✅ Next.js 15 optimizePackageImports: Enabled
- ✅ Bundle analyzer: Configured

**Last Updated**: 2025-10-30
**Configuration Status**: Complete
