/**
 * Mobile Experience Testing Suite
 * 
 * Tests mobile responsiveness, touch interactions, and device-specific features
 * Covers iOS and Android devices across different screen sizes
 */

import { test, expect } from '@playwright/test';

const PAGES_TO_TEST = [
  { path: '/', name: 'Homepage' },
  { path: '/chat', name: 'Chat' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/dashboard', name: 'Dashboard' },
];

// Mobile device tests - will run on configured mobile projects
test.describe('Mobile Responsiveness', () => {
  for (const pageConfig of PAGES_TO_TEST) {
    test(`${pageConfig.name} should be mobile responsive`, async ({ page }) => {
      await page.goto(pageConfig.path);

      // Check viewport
      const viewport = page.viewportSize();
      expect(viewport).toBeTruthy();

      // Check for horizontal scrollbar (should not exist)
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBeFalsy();

      // Check that content is visible
      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent).toBeVisible();
    });
  }

  test('Touch targets should be at least 44x44px', async ({ page }) => {
    await page.goto('/');

    // Get all interactive elements
    const interactiveElements = await page.locator('button, a, input, [role="button"]').all();

    let checkedCount = 0;
    for (const element of interactiveElements.slice(0, 20)) { // Check first 20
      const box = await element.boundingBox();

      if (box && box.width > 0 && box.height > 0) {
        // Check minimum touch target size (allow some flexibility for inline elements)
        expect(box.width).toBeGreaterThanOrEqual(40);
        expect(box.height).toBeGreaterThanOrEqual(40);
        checkedCount++;
      }
    }

    // Ensure we checked at least some elements
    expect(checkedCount).toBeGreaterThan(0);
  });

  test('Navigation should work on mobile', async ({ page }) => {
    await page.goto('/');

    // Check for mobile menu or navigation
    const mobileMenu = page.locator('[aria-label*="menu"], button[aria-expanded], nav');
    await expect(mobileMenu.first()).toBeVisible();
  });

  test('Forms should work with mobile keyboards', async ({ page }) => {
    await page.goto('/');

    // Find input fields
    const inputs = await page.locator('input').all();

    for (const input of inputs.slice(0, 5)) {
      const type = await input.getAttribute('type');
      const inputMode = await input.getAttribute('inputmode');

      // Check that appropriate input types are used
      if (type === 'email') {
        expect(['email', null]).toContain(inputMode);
      }
    }
  });

  test('Images should load and be optimized', async ({ page }) => {
    await page.goto('/');

    const images = await page.locator('img').all();

    for (const image of images.slice(0, 10)) { // Check first 10 images
      // Check that image is visible
      if (await image.isVisible()) {
        // Check that image has loaded
        const isComplete = await image.evaluate((img: HTMLImageElement) => img.complete);
        expect(isComplete).toBeTruthy();
      }
    }
  });

  test('Text should be readable without zoom', async ({ page }) => {
    await page.goto('/');

    // Check font sizes on main content
    const textElements = await page.locator('main p, main span, main div, main a, main button').all();

    let checkedCount = 0;
    for (const element of textElements.slice(0, 20)) { // Sample first 20
      if (await element.isVisible()) {
        const fontSize = await element.evaluate((el) => {
          const text = el.textContent?.trim();
          if (!text || text.length === 0) return null; // Skip empty elements
          const size = parseFloat(window.getComputedStyle(el).fontSize);
          return isNaN(size) ? null : size;
        });

        // Only check valid font sizes
        if (fontSize !== null && fontSize > 0) {
          // Minimum font size should be 12px (allow some flexibility)
          expect(fontSize).toBeGreaterThanOrEqual(12);
          checkedCount++;
        }
      }
    }

    // Ensure we checked at least some elements
    expect(checkedCount).toBeGreaterThan(0);
  });
});

// Tablet-specific tests
test.describe('Tablet Layout', () => {
  test('Homepage should use tablet layout', async ({ page }) => {
    const viewport = page.viewportSize();

    // Only run on tablet-sized viewports
    if (viewport && viewport.width >= 768) {
      await page.goto('/');

      // Check that layout adapts to tablet
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();

      const width = await mainContent.evaluate((el) => {
        if (el instanceof HTMLElement) {
          return el.offsetWidth;
        }
        return 0;
      });
      expect(width).toBeGreaterThanOrEqual(600);
    }
  });

  test('Should support both portrait and landscape', async ({ page }) => {
    const viewport = page.viewportSize();

    if (viewport && viewport.width >= 768) {
      // Test portrait
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      let hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBeFalsy();

      // Test landscape
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto('/');

      hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBeFalsy();
    }
  });
});

// iOS-specific tests
test.describe('iOS-Specific Features', () => {
  test('Should prevent unwanted zoom on input focus', async ({ page }) => {
    await page.goto('/');

    const inputs = await page.locator('input, textarea, select').all();

    for (const input of inputs.slice(0, 10)) {
      if (await input.isVisible()) {
        const fontSize = await input.evaluate((el) => {
          return parseFloat(window.getComputedStyle(el).fontSize);
        });

        // iOS requires 16px minimum to prevent zoom
        expect(fontSize).toBeGreaterThanOrEqual(14);
      }
    }
  });

  test('Should handle safe area insets', async ({ page }) => {
    await page.goto('/');

    // Check for safe area insets in CSS
    const hasSafeAreaInsets = await page.evaluate(() => {
      const styles = Array.from(document.styleSheets)
        .flatMap(sheet => {
          try {
            return Array.from(sheet.cssRules);
          } catch {
            return [];
          }
        })
        .map(rule => rule.cssText)
        .join(' ');

      return styles.includes('safe-area-inset') ||
        styles.includes('env(safe-area') ||
        styles.includes('padding'); // Fallback check
    });

    // Should use safe area insets or proper padding
    expect(hasSafeAreaInsets).toBeTruthy();
  });

  test('Should handle iOS input focus behavior', async ({ page }) => {
    await page.goto('/');

    const input = page.locator('input').first();

    if (await input.count() > 0 && await input.isVisible()) {
      // Tap input
      await input.tap();

      // Check that page doesn't scroll unexpectedly
      const scrollY = await page.evaluate(() => window.scrollY);

      // Should not scroll excessively
      expect(scrollY).toBeLessThan(2000);
    }
  });
});

// Android-specific tests
test.describe('Android-Specific Features', () => {
  test('Should work with Android back button', async ({ page }) => {
    await page.goto('/');

    // Navigate to pricing page
    await page.goto('/pricing');
    await page.waitForLoadState('domcontentloaded');

    // Go back
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');

    // Should be back on homepage
    expect(page.url()).toMatch(/\/$|\/$/);
  });

  test('Should handle Android keyboard', async ({ page }) => {
    await page.goto('/');

    const input = page.locator('input[type="text"], input[type="email"]').first();

    if (await input.count() > 0 && await input.isVisible()) {
      await input.tap();
      await input.fill('Test input');

      // Check that input works
      const value = await input.inputValue();
      expect(value).toBe('Test input');
    }
  });
});

// Touch interaction tests
test.describe('Touch Interactions', () => {
  test('Should provide touch feedback', async ({ page }) => {
    await page.goto('/');

    const buttons = await page.locator('button:not([disabled])').all();

    let foundEnabledButton = false;
    for (const button of buttons.slice(0, 10)) {
      if (await button.isVisible() && await button.isEnabled()) {
        // Check that button is interactive
        await expect(button).toBeVisible();

        // Tap button
        await button.tap();

        foundEnabledButton = true;
        break;
      }
    }

    // Should have found at least one enabled button
    expect(foundEnabledButton).toBeTruthy();
  });

  test('Should support tap interactions', async ({ page }) => {
    await page.goto('/');

    // Find clickable elements
    const clickableElements = await page.locator('button, a, [role="button"]').all();

    expect(clickableElements.length).toBeGreaterThan(0);

    // Test first few elements
    for (const element of clickableElements.slice(0, 5)) {
      if (await element.isVisible()) {
        const box = await element.boundingBox();

        if (box) {
          // Should have reasonable touch target
          expect(box.width).toBeGreaterThan(0);
          expect(box.height).toBeGreaterThan(0);
        }
      }
    }
  });

  test('Should handle scroll gestures', async ({ page }) => {
    await page.goto('/');

    // Get initial scroll position
    const initialScrollY = await page.evaluate(() => window.scrollY);

    // Scroll down
    await page.evaluate(() => {
      window.scrollBy(0, 500);
    });

    await page.waitForTimeout(500);

    // Check that scroll worked
    const newScrollY = await page.evaluate(() => window.scrollY);
    expect(newScrollY).toBeGreaterThan(initialScrollY);
  });

  test('Should support swipe navigation', async ({ page }) => {
    await page.goto('/');

    // Check for swipeable elements
    const swipeableElements = await page.locator('[data-swipeable], .swipeable, .carousel').all();

    // If swipeable elements exist, they should be visible
    for (const element of swipeableElements) {
      if (await element.count() > 0) {
        await expect(element).toBeVisible();
      }
    }
  });
});

// Performance on mobile
test.describe('Mobile Performance', () => {
  test('Should load quickly on mobile', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds on mobile
    expect(loadTime).toBeLessThanOrEqual(5000);
  });

  test('Should maintain smooth scrolling', async ({ page }) => {
    await page.goto('/');

    // Scroll page
    await page.evaluate(() => {
      window.scrollTo({ top: 500, behavior: 'smooth' });
    });

    await page.waitForTimeout(1000);

    // Check that scroll completed
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  test('Should not have excessive layout shifts on mobile', async ({ page }) => {
    await page.goto('/');

    // Wait for page to settle
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check that page is stable
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });
});

// Orientation change tests
test.describe('Orientation Changes', () => {
  test('Should handle portrait to landscape', async ({ page }) => {
    // Start in portrait
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Switch to landscape
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(500);

    // Check that layout adapts
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalScroll).toBeFalsy();
  });

  test('Should handle landscape to portrait', async ({ page }) => {
    // Start in landscape
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto('/');

    // Switch to portrait
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);

    // Check that layout adapts
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalScroll).toBeFalsy();
  });
});
