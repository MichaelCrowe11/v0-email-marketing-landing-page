# Bundle Analysis Guide

## Overview

The project is now configured with webpack-bundle-analyzer to help monitor and optimize bundle sizes.

## Running Bundle Analysis

To generate a bundle analysis report:

```bash
npm run build:analyze
```

This will:
1. Build the production bundle
2. Generate an interactive HTML report at `.next/analyze.html`
3. Generate a JSON stats file at `.next/bundle-stats.json`

## Viewing the Report

After running the analysis, open `.next/analyze.html` in your browser to see:
- Visual representation of bundle sizes
- Which packages contribute most to bundle size
- Opportunities for optimization

## What to Look For

### Large Dependencies
- Identify packages that are unexpectedly large
- Consider alternatives or lazy loading for large packages
- Check if tree-shaking is working properly

### Duplicate Code
- Look for the same package appearing multiple times
- Check for different versions of the same package
- Consolidate dependencies where possible

### Unused Code
- Identify code that's included but not used
- Verify tree-shaking is working for icon libraries
- Check for wildcard imports that should be specific

## Optimization Targets

Based on requirements:
- **Total Bundle Size**: < 300KB gzipped
- **Main Bundle**: < 100KB gzipped
- **Individual Chunks**: Keep route chunks small and focused

## Automated Monitoring

The bundle analyzer is configured to:
- Only run when `ANALYZE=true` environment variable is set
- Generate reports in the `.next` directory
- Not interfere with normal builds

## Next Steps

After analyzing the bundle:
1. Identify the largest contributors
2. Implement lazy loading for heavy components
3. Optimize imports (use specific imports instead of wildcards)
4. Consider code splitting for large features
5. Re-run analysis to verify improvements
