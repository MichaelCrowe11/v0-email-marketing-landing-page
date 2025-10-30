# Testing Documentation

## Overview

This directory contains comprehensive testing infrastructure for the Crowe Logic AI platform, covering visual regression, accessibility, performance, mobile experience, and user testing.

## Test Suites

### 1. Visual Regression Testing
**Location**: `tests/visual-regression/`

Tests visual consistency across browsers, viewports, and themes using Playwright.

**Run Tests**:
```bash
npm run test:visual
```

**Coverage**:
- 8 major pages
- 4 browsers (Chrome, Firefox, Safari, Edge)
- 5 viewport sizes
- Light and dark themes
- Interactive states (hover, focus)

### 2. Accessibility Testing
**Location**: `tests/accessibility/`

Tests WCAG 2.1 AA compliance using axe-core and manual testing protocols.

**Run Tests**:
```bash
npm run test:a11y
```

**Coverage**:
- Automated axe-core scans
- Keyboard navigation
- Screen reader support
- Color contrast
- ARIA compliance
- Reduced motion support

### 3. Performance Testing
**Location**: `tests/performance/`

Tests Core Web Vitals and runs Lighthouse audits.

**Run Tests**:
```bash
npm run test:performance
```

**Coverage**:
- Lighthouse audits (desktop and mobile)
- Core Web Vitals (FCP, LCP, CLS, FID, TTI)
- Network performance (3G, 4G)
- Resource loading
- Runtime performance

### 4. Mobile Testing
**Location**: `tests/mobile/`

Tests mobile responsiveness and device-specific features.

**Run Tests**:
```bash
npm run test:mobile
```

**Coverage**:
- 6 phone devices (iOS and Android)
- 3 tablet devices
- Touch interactions
- Mobile layouts
- iOS-specific features
- Android-specific features

### 5. User Testing
**Location**: `tests/user-testing/`

Framework for conducting user testing with target users.

**Resources**:
- User testing guide
- Test script for facilitators
- Feedback forms
- Analysis templates

## Quick Start

### Install Dependencies

```bash
# Install Playwright
npm install -D @playwright/test
npx playwright install

# Install accessibility testing
npm install -D @axe-core/playwright

# Install performance testing
npm install -D lighthouse chrome-launcher playwright-lighthouse
```

### Run All Tests

```bash
# Run complete test suite
npm test

# Run specific test suite
npm run test:visual
npm run test:a11y
npm run test:performance
npm run test:mobile
```

### Update Baselines

```bash
# Update visual regression baselines
npm run test:visual:update
```

## Test Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:visual": "playwright test tests/visual-regression",
    "test:visual:update": "playwright test tests/visual-regression --update-snapshots",
    "test:a11y": "playwright test tests/accessibility",
    "test:performance": "playwright test tests/performance",
    "test:mobile": "playwright test tests/mobile",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report"
  }
}
```

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run tests
        run: npm test
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

## Performance Targets

### Core Web Vitals
- **FCP**: < 1.5s
- **LCP**: < 2.5s
- **TTI**: < 3.5s
- **CLS**: < 0.1
- **FID**: < 100ms

### Lighthouse Scores
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 90+

### Mobile Performance
- **Load Time (WiFi)**: < 2s
- **Load Time (4G)**: < 3s
- **Touch Target Size**: ≥ 44x44px
- **Scroll FPS**: 60fps

## Accessibility Standards

### WCAG 2.1 AA Compliance
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Color contrast (4.5:1 for text)
- ✅ Focus indicators
- ✅ ARIA labels
- ✅ Semantic HTML
- ✅ Reduced motion support

## Browser Support

### Desktop
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Mobile
- iOS Safari (latest 2 versions)
- Chrome Mobile (latest 2 versions)
- Samsung Internet (latest version)

## Troubleshooting

### Tests Failing Locally

1. **Clear cache and restart dev server**
```bash
rm -rf .next
npm run dev
```

2. **Update Playwright**
```bash
npx playwright install
```

3. **Check Node version**
```bash
node --version  # Should be 18+
```

### Flaky Tests

1. **Add wait conditions**
```typescript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1000);
```

2. **Increase timeouts**
```typescript
test.setTimeout(60000);
```

3. **Disable animations**
```typescript
await page.addStyleTag({
  content: '* { animation: none !important; transition: none !important; }'
});
```

### Performance Issues

1. **Run tests in parallel**
```bash
npx playwright test --workers=4
```

2. **Run specific tests**
```bash
npx playwright test tests/visual-regression/visual.spec.ts
```

3. **Use headed mode for debugging**
```bash
npm run test:headed
```

## Best Practices

### Writing Tests

1. **Use descriptive test names**
```typescript
test('should display error message when form is invalid', async ({ page }) => {
  // Test code
});
```

2. **Follow AAA pattern**
```typescript
// Arrange
await page.goto('/');

// Act
await page.click('button');

// Assert
await expect(page.locator('.message')).toBeVisible();
```

3. **Use page object model**
```typescript
class HomePage {
  constructor(private page: Page) {}
  
  async navigate() {
    await this.page.goto('/');
  }
  
  async clickCTA() {
    await this.page.click('[data-testid="cta"]');
  }
}
```

### Test Data

1. **Use test IDs**
```tsx
<button data-testid="submit-button">Submit</button>
```

2. **Avoid brittle selectors**
```typescript
// ❌ Bad
await page.click('.btn.btn-primary.mt-4');

// ✅ Good
await page.click('[data-testid="submit-button"]');
```

3. **Use fixtures for test data**
```typescript
const testUser = {
  email: 'test@example.com',
  password: 'password123',
};
```

## Resources

### Documentation
- [Playwright Docs](https://playwright.dev/)
- [axe-core Docs](https://github.com/dequelabs/axe-core)
- [Lighthouse Docs](https://developers.google.com/web/tools/lighthouse)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Tools
- [Playwright Test Generator](https://playwright.dev/docs/codegen)
- [Playwright Inspector](https://playwright.dev/docs/inspector)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

### Community
- [Playwright Discord](https://discord.com/invite/playwright)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/playwright)

## Contributing

When adding new tests:

1. Follow existing test structure
2. Add documentation
3. Update this README
4. Ensure tests pass locally
5. Add to CI/CD pipeline

## Requirements Coverage

This testing infrastructure addresses all requirements from the UI/UX Enhancement spec:

- **Requirement 1.1**: Visual consistency (Visual Regression)
- **Requirement 2.1-2.5**: Mobile experience (Mobile Testing)
- **Requirement 4.1-4.5**: Accessibility (Accessibility Testing)
- **Requirement 8.1-8.5**: Performance (Performance Testing)
- **Requirement 9.1**: Brand consistency (Visual Regression)
- **All Requirements**: User satisfaction (User Testing)

## Support

For questions or issues with testing:
- Create an issue in the repository
- Contact the QA team
- Check the troubleshooting section above

---

**Last Updated**: [Current Date]
**Version**: 1.0.0
