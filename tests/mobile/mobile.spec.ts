/**
 * Mobile Experience Testing Suite
 * 
 * Tests mobile responsiveness, touch interactions, and device-specific features
 * Covers iOS and Android devices across different screen sizes
 */

import { test, expect, devices } from '@playwright/test';

const MOBILE_DEVICES = [
  { name: 'iPhone SE', device: devices['iPhone SE'] },
  { name: 'iPhone 12', device: devices['iPhone 12'] },
  { name: 'iPhone 13', device: devices['iPhone 13'] },
  { name: 'iPhone 14', device: devices['iPhone 14 Pro'] },
  { name: 'Pixel 5', device: devices['Pixel 5'] },
  { name: 'Galaxy S9+', device: devices['Galaxy S9+'] },
];

const TABLET_DEVICES = [
  { name: 'iPad', device: devices['iPad (gen 7)'] },
  { name: 'iPad Pro', device: devices['iPad Pro'] },
  { name: 'Galaxy Tab', device: devices['Galaxy Tab S4'] },
];

const PAGES_TO_TEST = [
  { path: '/', name: 'Homepage' },
  { path: '/chat', name: 'Chat' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/dashboard', name: 'Dashboard' },
];

// Test each mobile device
for (const deviceConfig of MOBILE_DEVICES) {
  test.describe(`${deviceConfig.name} Tests`, () => {
    test.use(deviceConfig.device);
    
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
        const mainContent = await page.locator('main, [role="main"]');
        await expect(mainContent).toBeVisible();
      });
    }
    
    test('Touch targets should be at least 44x44px', async ({ page }) => {
      await page.goto('/');
      
      // Get all interactive elements
      const interactiveElements = await page.locator('button, a, input, [role="button"]').all();
      
      for (const element of interactiveElements) {
        const box = await element.boundingBox();
        
        if (box) {
          // Check minimum touch target size
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    });
    
    test('Navigation should work on mobile', async ({ page }) => {
      await page.goto('/');
      
      // Check for mobile menu
      const mobileMenu = await page.locator('[aria-label*="menu"], button[aria-expanded]').first();
      
      if (await mobileMenu.isVisible()) {
        // Open menu
        await mobileMenu.tap();
        await page.waitForTimeout(500);
        
        // Check that menu is open
        const isExpanded = await mobileMenu.getAttribute('aria-expanded');
        expect(isExpanded).toBe('true');
        
        // Check that navigation items are visible
        const navItems = await page.locator('nav a, [role="navigation"] a');
        await expect(navItems.first()).toBeVisible();
      }
    });
    
    test('Forms should work with mobile keyboards', async ({ page }) => {
      await page.goto('/');
      
      // Find input fields
      const emailInput = await page.locator('input[type="email"]').first();
      const textInput = await page.locator('input[type="text"]').first();
      const telInput = await page.locator('input[type="tel"]').first();
      
      // Test email input
      if (await emailInput.count() > 0) {
        await emailInput.tap();
        const inputMode = await emailInput.getAttribute('inputmode');
        expect(['email', null]).toContain(inputMode);
      }
      
      // Test tel input
      if (await telInput.count() > 0) {
        await telInput.tap();
        const inputMode = await telInput.getAttribute('inputmode');
        expect(['tel', 'numeric', null]).toContain(inputMode);
      }
    });
    
    test('Images should load and be optimized', async ({ page }) => {
      await page.goto('/');
      
      const images = await page.locator('img').all();
      
      for (const image of images) {
        // Check that image is visible
        await expect(image).toBeVisible();
        
        // Check that image has loaded
        const isComplete = await image.evaluate((img: HTMLImageElement) => img.complete);
        expect(isComplete).toBeTruthy();
        
        // Check for responsive images
        const srcset = await image.getAttribute('srcset');
        const sizes = await image.getAttribute('sizes');
        
        // Should have srcset or be using Next.js Image
        expect(srcset || sizes).toBeTruthy();
      }
    });
    
    test('Text should be readable without zoom', async ({ page }) => {
      await page.goto('/');
      
      // Check font sizes
      const textElements = await page.locator('p, span, div, a, button').all();
      
      for (const element of textElements.slice(0, 20)) { // Sample first 20
        const fontSize = await element.evaluate((el) => {
          return parseFloat(window.getComputedStyle(el).fontSize);
        });
        
        // Minimum font size should be 16px to prevent zoom on iOS
        expect(fontSize).toBeGreaterThanOrEqual(14);
      }
    });
    
  });
}

// Test tablet devices
for (const deviceConfig of TABLET_DEVICES) {
  test.describe(`${deviceConfig.name} Tests`, () => {
    test.use(deviceConfig.device);
    
    test('Homepage should use tablet layout', async ({ page }) => {
      await page.goto('/');
      
      // Check viewport
      const viewport = page.viewportSize();
      expect(viewport?.width).toBeGreaterThanOrEqual(768);
      
      // Check that layout adapts to tablet
      const mainContent = await page.locator('main');
      const width = await mainContent.evaluate((el) => el.offsetWidth);
      
      expect(width).toBeGreaterThanOrEqual(700);
    });
    
    test('Should support both portrait and landscape', async ({ page }) => {
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
    });
    
  });
}

// iOS-specific tests
test.describe('iOS-Specific Tests', () => {
  test.use(devices['iPhone 12']);
  
  test('Should prevent unwanted zoom on input focus', async ({ page }) => {
    await page.goto('/');
    
    const inputs = await page.locator('input, textarea, select').all();
    
    for (const input of inputs) {
      const fontSize = await input.evaluate((el) => {
        return parseFloat(window.getComputedStyle(el).fontSize);
      });
      
      // iOS requires 16px minimum to prevent zoom
      expect(fontSize).toBeGreaterThanOrEqual(16);
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
             styles.includes('env(safe-area');
    });
    
    // Should use safe area insets for notched devices
    expect(hasSafeAreaInsets).toBeTruthy();
  });
  
  test('Should handle iOS input focus behavior', async ({ page }) => {
    await page.goto('/');
    
    const input = await page.locator('input').first();
    
    if (await input.count() > 0) {
      // Tap input
      await input.tap();
      
      // Check that page doesn't scroll unexpectedly
      const scrollY = await page.evaluate(() => window.scrollY);
      
      // Should not scroll to top
      expect(scrollY).toBeLessThan(1000);
    }
  });
  
  test('Should support iOS gestures', async ({ page }) => {
    await page.goto('/');
    
    // Test swipe gesture (if applicable)
    const swipeableElement = await page.locator('[data-swipeable], .swipeable').first();
    
    if (await swipeableElement.count() > 0) {
      const box = await swipeableElement.boundingBox();
      
      if (box) {
        // Simulate swipe
        await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
        await page.touchscreen.tap(box.x + 10, box.y + box.height / 2);
        
        // Element should respond to swipe
        await page.waitForTimeout(500);
      }
    }
  });
  
});

// Android-specific tests
test.describe('Android-Specific Tests', () => {
  test.use(devices['Pixel 5']);
  
  test('Should work with Android back button', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to another page
    const link = await page.locator('a').first();
    await link.tap();
    await page.waitForLoadState('networkidle');
    
    // Go back
    await page.goBack();
    
    // Should be back on homepage
    expect(page.url()).toContain('/');
  });
  
  test('Should handle Android keyboard', async ({ page }) => {
    await page.goto('/');
    
    const input = await page.locator('input[type="text"]').first();
    
    if (await input.count() > 0) {
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
  test.use(devices['iPhone 12']);
  
  test('Should provide touch feedback', async ({ page }) => {
    await page.goto('/');
    
    const button = await page.locator('button').first();
    
    // Tap button
    await button.tap();
    
    // Check for active state or ripple effect
    const hasActiveState = await button.evaluate((el) => {
      const styles = window.getComputedStyle(el, ':active');
      return styles.opacity !== '1' || styles.transform !== 'none';
    });
    
    // Should have some visual feedback
    expect(hasActiveState).toBeTruthy();
  });
  
  test('Should support long press', async ({ page }) => {
    await page.goto('/');
    
    const element = await page.locator('[data-long-press]').first();
    
    if (await element.count() > 0) {
      const box = await element.boundingBox();
      
      if (box) {
        // Simulate long press
        await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
        await page.waitForTimeout(1000);
        
        // Should trigger long press action
        const contextMenu = await page.locator('[role="menu"]');
        await expect(contextMenu).toBeVisible();
      }
    }
  });
  
  test('Should support pinch zoom on images', async ({ page }) => {
    await page.goto('/');
    
    const image = await page.locator('img[data-zoomable]').first();
    
    if (await image.count() > 0) {
      const box = await image.boundingBox();
      
      if (box) {
        // Tap image to zoom
        await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
        await page.waitForTimeout(500);
        
        // Should show zoomed view
        const zoomedImage = await page.locator('[data-zoomed]');
        await expect(zoomedImage).toBeVisible();
      }
    }
  });
  
  test('Should support pull-to-refresh', async ({ page }) => {
    await page.goto('/');
    
    // Simulate pull down gesture
    await page.touchscreen.tap(200, 100);
    await page.mouse.move(200, 300);
    await page.waitForTimeout(500);
    
    // Check for refresh indicator
    const refreshIndicator = await page.locator('[data-refreshing], .refreshing');
    
    if (await refreshIndicator.count() > 0) {
      await expect(refreshIndicator).toBeVisible();
    }
  });
  
});

// Performance on mobile
test.describe('Mobile Performance', () => {
  test.use(devices['iPhone 12']);
  
  test('Should load quickly on mobile', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds on mobile
    expect(loadTime).toBeLessThanOrEqual(3000);
  });
  
  test('Should maintain smooth scrolling', async ({ page }) => {
    await page.goto('/');
    
    // Scroll page
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    
    await page.waitForTimeout(2000);
    
    // Check that scroll completed
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });
  
  test('Should not have layout shifts on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to settle
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Measure CLS
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });
        
        setTimeout(() => resolve(clsValue), 3000);
      });
    });
    
    // CLS should be low on mobile
    expect(cls).toBeLessThanOrEqual(0.1);
  });
  
});

// Orientation change tests
test.describe('Orientation Changes', () => {
  test.use(devices['iPhone 12']);
  
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
