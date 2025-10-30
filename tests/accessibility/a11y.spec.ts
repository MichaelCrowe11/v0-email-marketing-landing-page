/**
 * Accessibility Testing Suite
 * 
 * Tests WCAG 2.1 AA compliance using axe-core
 * Covers keyboard navigation, screen reader support, and color contrast
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES_TO_TEST = [
  { path: '/', name: 'Homepage' },
  { path: '/chat', name: 'Chat' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/species-library', name: 'Species Library' },
  { path: '/knowledge-base', name: 'Knowledge Base' },
  { path: '/forum', name: 'Forum' },
  { path: '/profile', name: 'Profile' },
];

// Test each page for accessibility violations
for (const pageConfig of PAGES_TO_TEST) {
  test.describe(`${pageConfig.name} Accessibility`, () => {
    
    test('should not have any automatically detectable WCAG A or AA violations', async ({ page }) => {
      await page.goto(pageConfig.path);
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });
    
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(pageConfig.path);
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['best-practice'])
        .include('h1, h2, h3, h4, h5, h6')
        .analyze();
      
      // Check for heading order violations
      const headingViolations = accessibilityScanResults.violations.filter(
        v => v.id === 'heading-order'
      );
      
      expect(headingViolations).toEqual([]);
    });
    
    test('should have sufficient color contrast', async ({ page }) => {
      await page.goto(pageConfig.path);
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .include('*')
        .analyze();
      
      // Check for color contrast violations
      const contrastViolations = accessibilityScanResults.violations.filter(
        v => v.id === 'color-contrast'
      );
      
      expect(contrastViolations).toEqual([]);
    });
    
    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto(pageConfig.path);
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      
      // Check for ARIA-related violations
      const ariaViolations = accessibilityScanResults.violations.filter(
        v => v.id.includes('aria')
      );
      
      expect(ariaViolations).toEqual([]);
    });
    
    test('should have alt text for images', async ({ page }) => {
      await page.goto(pageConfig.path);
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a'])
        .analyze();
      
      // Check for image alt text violations
      const imageViolations = accessibilityScanResults.violations.filter(
        v => v.id === 'image-alt'
      );
      
      expect(imageViolations).toEqual([]);
    });
    
  });
}

// Keyboard navigation tests
test.describe('Keyboard Navigation', () => {
  
  test('should allow tab navigation through interactive elements', async ({ page }) => {
    await page.goto('/');
    
    // Start from the beginning
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      const styles = window.getComputedStyle(el!);
      return {
        tagName: el?.tagName,
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow,
      };
    });
    
    // Ensure focus indicator is visible (outline or box-shadow)
    expect(
      focusedElement.outline !== 'none' || 
      focusedElement.outlineWidth !== '0px' ||
      focusedElement.boxShadow !== 'none'
    ).toBeTruthy();
  });
  
  test('should have skip links for main content', async ({ page }) => {
    await page.goto('/');
    
    // Press Tab to focus skip link
    await page.keyboard.press('Tab');
    
    // Check if skip link is present
    const skipLink = await page.locator('a[href="#main-content"], a[href="#main"]').first();
    await expect(skipLink).toBeVisible();
  });
  
  test('should allow escape key to close modals', async ({ page }) => {
    await page.goto('/');
    
    // Try to open a modal (if exists)
    const modalTrigger = await page.locator('[role="button"][aria-haspopup="dialog"]').first();
    
    if (await modalTrigger.count() > 0) {
      await modalTrigger.click();
      await page.waitForTimeout(500);
      
      // Press Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      
      // Modal should be closed
      const modal = await page.locator('[role="dialog"]');
      await expect(modal).not.toBeVisible();
    }
  });
  
  test('should trap focus within modals', async ({ page }) => {
    await page.goto('/');
    
    // Try to open a modal
    const modalTrigger = await page.locator('[role="button"][aria-haspopup="dialog"]').first();
    
    if (await modalTrigger.count() > 0) {
      await modalTrigger.click();
      await page.waitForTimeout(500);
      
      // Tab through modal elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        
        // Check that focus is still within modal
        const focusedElement = await page.evaluate(() => {
          const el = document.activeElement;
          const modal = document.querySelector('[role="dialog"]');
          return modal?.contains(el);
        });
        
        expect(focusedElement).toBeTruthy();
      }
    }
  });
  
  test('should support arrow key navigation in menus', async ({ page }) => {
    await page.goto('/');
    
    // Find a menu
    const menu = await page.locator('[role="menu"], [role="menubar"]').first();
    
    if (await menu.count() > 0) {
      // Focus first menu item
      await menu.locator('[role="menuitem"]').first().focus();
      
      // Press ArrowDown
      await page.keyboard.press('ArrowDown');
      
      // Check that focus moved
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.getAttribute('role');
      });
      
      expect(focusedElement).toBe('menuitem');
    }
  });
  
});

// Screen reader tests
test.describe('Screen Reader Support', () => {
  
  test('should have proper landmark regions', async ({ page }) => {
    await page.goto('/');
    
    // Check for main landmark
    const main = await page.locator('main, [role="main"]');
    await expect(main).toHaveCount(1);
    
    // Check for navigation landmark
    const nav = await page.locator('nav, [role="navigation"]');
    await expect(nav).toHaveCount(1);
    
    // Check for banner (header)
    const banner = await page.locator('header, [role="banner"]');
    await expect(banner).toHaveCount(1);
    
    // Check for contentinfo (footer)
    const footer = await page.locator('footer, [role="contentinfo"]');
    await expect(footer).toHaveCount(1);
  });
  
  test('should have descriptive page titles', async ({ page }) => {
    for (const pageConfig of PAGES_TO_TEST) {
      await page.goto(pageConfig.path);
      
      const title = await page.title();
      
      // Title should not be empty and should be descriptive
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(10);
      expect(title).toContain('Crowe Logic');
    }
  });
  
  test('should have ARIA live regions for dynamic content', async ({ page }) => {
    await page.goto('/chat');
    
    // Check for live regions
    const liveRegions = await page.locator('[aria-live]');
    
    if (await liveRegions.count() > 0) {
      const ariaLive = await liveRegions.first().getAttribute('aria-live');
      expect(['polite', 'assertive', 'off']).toContain(ariaLive);
    }
  });
  
  test('should have proper button labels', async ({ page }) => {
    await page.goto('/');
    
    const buttons = await page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      
      // Button should have accessible name (text content or aria-label)
      const accessibleName = await button.evaluate((el) => {
        return el.textContent?.trim() || el.getAttribute('aria-label');
      });
      
      expect(accessibleName).toBeTruthy();
    }
  });
  
  test('should have proper link text', async ({ page }) => {
    await page.goto('/');
    
    const links = await page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      
      // Link should have accessible name
      const accessibleName = await link.evaluate((el) => {
        return el.textContent?.trim() || el.getAttribute('aria-label');
      });
      
      expect(accessibleName).toBeTruthy();
      
      // Avoid generic link text
      const genericText = ['click here', 'read more', 'here', 'link'];
      const isGeneric = genericText.some(text => 
        accessibleName?.toLowerCase() === text
      );
      
      expect(isGeneric).toBeFalsy();
    }
  });
  
});

// Form accessibility tests
test.describe('Form Accessibility', () => {
  
  test('should have labels for all form inputs', async ({ page }) => {
    await page.goto('/');
    
    const inputs = await page.locator('input, textarea, select');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const type = await input.getAttribute('type');
      
      // Skip hidden inputs
      if (type === 'hidden') continue;
      
      // Check for label or aria-label
      const hasLabel = await input.evaluate((el) => {
        const id = el.id;
        const label = id ? document.querySelector(`label[for="${id}"]`) : null;
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledby = el.getAttribute('aria-labelledby');
        
        return !!(label || ariaLabel || ariaLabelledby);
      });
      
      expect(hasLabel).toBeTruthy();
    }
  });
  
  test('should show error messages accessibly', async ({ page }) => {
    await page.goto('/');
    
    // Find a form
    const form = await page.locator('form').first();
    
    if (await form.count() > 0) {
      // Try to submit without filling required fields
      const submitButton = await form.locator('button[type="submit"]');
      
      if (await submitButton.count() > 0) {
        await submitButton.click();
        await page.waitForTimeout(500);
        
        // Check for error messages with proper ARIA
        const errorMessages = await page.locator('[role="alert"], [aria-invalid="true"]');
        
        if (await errorMessages.count() > 0) {
          // Error messages should be associated with inputs
          const hasProperAssociation = await errorMessages.first().evaluate((el) => {
            return el.getAttribute('role') === 'alert' || 
                   el.getAttribute('aria-live') === 'assertive';
          });
          
          expect(hasProperAssociation).toBeTruthy();
        }
      }
    }
  });
  
});

// Reduced motion tests
test.describe('Reduced Motion Support', () => {
  
  test('should respect prefers-reduced-motion', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    
    // Check that animations are disabled or reduced
    const hasReducedMotion = await page.evaluate(() => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });
    
    expect(hasReducedMotion).toBeTruthy();
    
    // Check that CSS respects this preference
    const animationDuration = await page.evaluate(() => {
      const el = document.querySelector('*');
      const styles = window.getComputedStyle(el!);
      return styles.animationDuration;
    });
    
    // Animation should be instant or very short
    expect(['0s', '0.01s']).toContain(animationDuration);
  });
  
});
