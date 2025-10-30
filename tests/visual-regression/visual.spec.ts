/**
 * Visual Regression Test Suite
 * 
 * Captures screenshots across browsers, viewports, and themes
 * and compares them against baseline images.
 */

import { test, expect, Page } from '@playwright/test';
import { VIEWPORTS, PAGES_TO_TEST } from './setup';

// Configure test timeout for screenshot capture
test.setTimeout(60000);

// Helper to wait for page to be fully loaded
async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
  
  // Wait for any animations to complete
  await page.waitForTimeout(1000);
}

// Helper to set theme
async function setTheme(page: Page, theme: 'light' | 'dark') {
  await page.evaluate((theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, theme);
}

// Test each page across viewports and themes
for (const pageConfig of PAGES_TO_TEST) {
  test.describe(`${pageConfig.name} Visual Tests`, () => {
    
    for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
      test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
        
        test.use({
          viewport: { width: viewport.width, height: viewport.height },
        });
        
        test('Light theme screenshot', async ({ page }) => {
          await page.goto(pageConfig.path);
          await setTheme(page, 'light');
          await waitForPageLoad(page);
          
          // Take full page screenshot
          await expect(page).toHaveScreenshot(
            `${pageConfig.name}-${viewportName}-light.png`,
            {
              fullPage: true,
              animations: 'disabled',
              maxDiffPixels: 100, // Allow minor differences
            }
          );
        });
        
        test('Dark theme screenshot', async ({ page }) => {
          await page.goto(pageConfig.path);
          await setTheme(page, 'dark');
          await waitForPageLoad(page);
          
          // Take full page screenshot
          await expect(page).toHaveScreenshot(
            `${pageConfig.name}-${viewportName}-dark.png`,
            {
              fullPage: true,
              animations: 'disabled',
              maxDiffPixels: 100,
            }
          );
        });
        
      });
    }
    
  });
}

// Test interactive states
test.describe('Interactive State Tests', () => {
  
  test('Navigation hover states', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Hover over navigation items
    const navItem = page.locator('nav a').first();
    await navItem.hover();
    
    await expect(page).toHaveScreenshot('nav-hover-state.png', {
      animations: 'disabled',
    });
  });
  
  test('Button hover states', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Hover over primary CTA
    const ctaButton = page.locator('button, a').filter({ hasText: /get started|try/i }).first();
    await ctaButton.hover();
    
    await expect(page).toHaveScreenshot('button-hover-state.png', {
      animations: 'disabled',
    });
  });
  
  test('Pricing card hover states', async ({ page }) => {
    await page.goto('/pricing');
    await waitForPageLoad(page);
    
    // Hover over pricing card
    const pricingCard = page.locator('[class*="pricing"]').first();
    await pricingCard.hover();
    
    await expect(page).toHaveScreenshot('pricing-hover-state.png', {
      animations: 'disabled',
    });
  });
  
});

// Test focus states for accessibility
test.describe('Focus State Tests', () => {
  
  test('Keyboard navigation focus indicators', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    
    await expect(page).toHaveScreenshot('focus-state-first.png', {
      animations: 'disabled',
    });
    
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    
    await expect(page).toHaveScreenshot('focus-state-second.png', {
      animations: 'disabled',
    });
  });
  
});

// Test responsive breakpoints
test.describe('Responsive Breakpoint Tests', () => {
  
  const breakpoints = [
    { width: 320, height: 568, name: 'Extra Small' },
    { width: 640, height: 480, name: 'Small' },
    { width: 1024, height: 768, name: 'Medium' },
    { width: 1440, height: 900, name: 'Large' },
    { width: 2560, height: 1440, name: 'Extra Large' },
  ];
  
  for (const breakpoint of breakpoints) {
    test(`Homepage at ${breakpoint.name} (${breakpoint.width}px)`, async ({ page }) => {
      await page.setViewportSize({ 
        width: breakpoint.width, 
        height: breakpoint.height 
      });
      
      await page.goto('/');
      await waitForPageLoad(page);
      
      await expect(page).toHaveScreenshot(
        `homepage-${breakpoint.name.toLowerCase().replace(' ', '-')}.png`,
        {
          fullPage: true,
          animations: 'disabled',
        }
      );
    });
  }
  
});
