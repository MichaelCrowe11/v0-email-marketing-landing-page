# Visual Regression Testing Guide

## Overview

This directory contains the visual regression testing setup for the Crowe Logic AI platform. Visual regression testing helps catch unintended UI changes by comparing screenshots across different browsers, viewports, and themes.

## Setup

### Prerequisites

1. Install Playwright for cross-browser testing:
```bash
npm install -D @playwright/test
npx playwright install
```

2. Install Pixelmatch for image comparison:
```bash
npm install -D pixelmatch pngjs
```

## Running Tests

### Capture Baseline Screenshots

First time setup - capture baseline screenshots:
```bash
npm run test:visual:baseline
```

### Run Visual Regression Tests

Compare current UI against baseline:
```bash
npm run test:visual
```

### Update Baselines

After intentional UI changes, update baselines:
```bash
npm run test:visual:update
```

## Test Coverage

### Pages Tested
- Homepage (/)
- Chat (/chat)
- Pricing (/pricing)
- Dashboard (/dashboard)
- Species Library (/species-library)
- Knowledge Base (/knowledge-base)
- Forum (/forum)
- Profile (/profile)

### Browsers
- Chrome
- Firefox
- Safari (macOS only)
- Edge

### Viewports
- Mobile (375x667 - iPhone SE)
- Mobile Large (414x896 - iPhone 11 Pro Max)
- Tablet (768x1024 - iPad)
- Desktop (1280x720 - HD)
- Desktop Large (1920x1080 - Full HD)

### Themes
- Light mode
- Dark mode

## Interpreting Results

### Diff Images

When differences are detected, three images are generated:
1. **Baseline**: The expected appearance
2. **Current**: The actual current appearance
3. **Diff**: Highlighted differences in red

### Acceptable Differences

Some differences are acceptable:
- Anti-aliasing variations between browsers
- Font rendering differences
- Minor animation timing differences

### Unacceptable Differences

These require investigation:
- Layout shifts
- Missing elements
- Color changes
- Broken images
- Text overflow

## Best Practices

1. **Run tests before committing**: Catch visual regressions early
2. **Review diffs carefully**: Not all differences are bugs
3. **Update baselines intentionally**: Only after verifying changes are correct
4. **Test in multiple browsers**: Cross-browser consistency is important
5. **Test both themes**: Ensure dark mode works correctly

## Troubleshooting

### Tests Failing Locally

1. Ensure dev server is running: `npm run dev`
2. Clear browser cache
3. Update Playwright: `npx playwright install`

### Flaky Tests

1. Add wait conditions for animations
2. Disable animations in test mode
3. Use stable test data

### Performance Issues

1. Run tests in parallel: `npx playwright test --workers=4`
2. Test fewer viewports during development
3. Use headless mode for faster execution

## CI/CD Integration

Add to your CI pipeline:
```yaml
- name: Run Visual Regression Tests
  run: |
    npm run build
    npm run start &
    sleep 10
    npm run test:visual
```

## Requirements Coverage

This testing setup addresses:
- **Requirement 1.1**: Visual consistency across platform
- **Requirement 9.1**: Brand consistency verification
