# Tree-Shaking Verification Guide

## Quick Verification

To verify that tree-shaking is working correctly for icon and utility libraries, follow these steps:

## 1. Build with Bundle Analysis

```bash
npm run build:analyze
```

This will:
- Build the production bundle
- Generate `analyze.html` with visual bundle breakdown
- Generate `bundle-stats.json` with detailed statistics

## 2. Check the Analysis Report

Open the generated report:

```bash
# Windows
start .next/analyze.html

# Mac/Linux
open .next/analyze.html
```

## 3. What to Look For

### ✅ Good Signs (Tree-Shaking Working)

1. **Lucide React**:
   - Should see individual icon imports
   - Total lucide-react size should be < 30KB
   - No large "lucide-react" chunk containing all icons

2. **Date-fns** (if used):
   - Should see individual function imports
   - No large "date-fns" chunk containing entire library
   - Each function should be < 5KB

3. **Overall Bundle**:
   - Total JavaScript < 300KB gzipped
   - No large utility library chunks
   - Code split by route

### ❌ Warning Signs (Tree-Shaking Not Working)

1. Large chunks named:
   - `lucide-react` > 100KB
   - `date-fns` > 50KB
   - `lodash` or `lodash-es` > 50KB

2. Wildcard imports detected in source maps

3. Total bundle size > 500KB gzipped

## 4. Manual Code Inspection

### Check for Wildcard Imports

```bash
# Search for problematic import patterns
grep -r "import \* as" --include="*.tsx" --include="*.ts" app/ components/ lib/

# Should return no results (or only intentional ones)
```

### Check Lucide React Imports

```bash
# All lucide-react imports should use named imports
grep -r "from ['\"]lucide-react['\"]" --include="*.tsx" --include="*.ts" app/ components/

# Verify they all use: import { Icon1, Icon2 } from "lucide-react"
```

## 5. Runtime Verification

### Check Network Tab

1. Open DevTools → Network tab
2. Reload the page
3. Filter by JS files
4. Check sizes:
   - Main bundle: < 100KB gzipped
   - Route chunks: < 50KB each
   - Component chunks: < 30KB each

### Check Coverage

1. Open DevTools → Coverage tab (Cmd/Ctrl + Shift + P → "Show Coverage")
2. Reload the page
3. Check unused code percentage:
   - Should be < 20% unused code
   - If > 50% unused, tree-shaking may not be working

## 6. Performance Metrics

### Lighthouse Audit

```bash
# Run Lighthouse from Chrome DevTools
# Or use CLI:
npx lighthouse http://localhost:3000 --view
```

Check:
- Performance score > 90
- Total Blocking Time < 300ms
- First Contentful Paint < 1.5s

## Expected Results

### Before Tree-Shaking Optimization

```
Total Bundle Size: ~800KB gzipped
├─ lucide-react: ~300KB (entire library)
├─ date-fns: ~70KB (entire library)
├─ lodash: ~70KB (entire library)
└─ Application code: ~360KB
```

### After Tree-Shaking Optimization

```
Total Bundle Size: ~250KB gzipped
├─ lucide-react icons: ~20KB (only used icons)
├─ date-fns functions: ~5KB (only used functions)
├─ lodash: 0KB (not used)
└─ Application code: ~225KB
```

**Savings: ~550KB (69% reduction)**

## Troubleshooting

### If Bundle Size is Still Large

1. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   npm run build:analyze
   ```

2. **Check Next.js version**:
   ```bash
   npm list next
   # Should be 15.5.4 or higher
   ```

3. **Verify optimizePackageImports**:
   - Open `next.config.mjs`
   - Confirm `experimental.optimizePackageImports` includes:
     - `lucide-react`
     - `date-fns`
     - `lodash-es`

4. **Check for dynamic requires**:
   ```bash
   grep -r "require.*lucide-react" --include="*.tsx" --include="*.ts"
   # Should return no results
   ```

### If Icons Are Missing

1. Check import syntax:
   ```typescript
   // ✅ Correct
   import { Search, User } from "lucide-react"
   
   // ❌ Wrong
   import * as Icons from "lucide-react"
   ```

2. Verify icon names are correct (case-sensitive)

3. Check browser console for errors

## Continuous Monitoring

### Add to CI/CD Pipeline

```yaml
# .github/workflows/bundle-size.yml
name: Bundle Size Check

on: [pull_request]

jobs:
  check-bundle-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - name: Check bundle size
        run: |
          BUNDLE_SIZE=$(du -sb .next/static/chunks | cut -f1)
          MAX_SIZE=307200  # 300KB
          if [ $BUNDLE_SIZE -gt $MAX_SIZE ]; then
            echo "Bundle size $BUNDLE_SIZE exceeds maximum $MAX_SIZE"
            exit 1
          fi
```

### Regular Audits

Schedule monthly bundle analysis:
1. Run `npm run build:analyze`
2. Review bundle composition
3. Identify new large dependencies
4. Optimize as needed

## Success Criteria

✅ All checks passed if:

- [ ] Total bundle < 300KB gzipped
- [ ] No wildcard imports found
- [ ] Lucide-react chunk < 30KB
- [ ] Date-fns chunk < 10KB (if used)
- [ ] No lodash in bundle (not used)
- [ ] Lighthouse Performance > 90
- [ ] Coverage shows < 20% unused code

## Additional Resources

- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Chrome DevTools Coverage](https://developer.chrome.com/docs/devtools/coverage/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Last Updated**: 2025-10-30
**Status**: Tree-shaking fully configured and verified
