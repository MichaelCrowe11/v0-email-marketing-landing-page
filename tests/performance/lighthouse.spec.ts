/**
 * Performance Testing Suite
 * 
 * Tests Core Web Vitals and runs Lighthouse audits
 * Measures performance on different network conditions
 */

import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const PAGES_TO_TEST = [
  { path: '/', name: 'Homepage' },
  { path: '/chat', name: 'Chat' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/dashboard', name: 'Dashboard' },
];

const LIGHTHOUSE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
  },
};

const MOBILE_CONFIG = {
  ...LIGHTHOUSE_CONFIG,
  settings: {
    ...LIGHTHOUSE_CONFIG.settings,
    formFactor: 'mobile',
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
    },
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false,
    },
  },
};

// Performance thresholds
const THRESHOLDS = {
  performance: 90,
  accessibility: 95,
  bestPractices: 90,
  seo: 90,
  fcp: 1500, // First Contentful Paint (ms)
  lcp: 2500, // Largest Contentful Paint (ms)
  tti: 3500, // Time to Interactive (ms)
  cls: 0.1,  // Cumulative Layout Shift
  fid: 100,  // First Input Delay (ms)
  tbt: 200,  // Total Blocking Time (ms)
};

// Test each page with Lighthouse
for (const pageConfig of PAGES_TO_TEST) {
  test.describe(`${pageConfig.name} Performance`, () => {
    
    test('should meet desktop performance thresholds', async () => {
      const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
      const options = {
        logLevel: 'info',
        output: 'json',
        port: chrome.port,
      };
      
      const runnerResult = await lighthouse(
        `http://localhost:3000${pageConfig.path}`,
        options,
        LIGHTHOUSE_CONFIG
      );
      
      await chrome.kill();
      
      if (!runnerResult) {
        throw new Error('Lighthouse failed to run');
      }
      
      const { lhr } = runnerResult;
      
      // Check category scores
      expect(lhr.categories.performance.score! * 100).toBeGreaterThanOrEqual(
        THRESHOLDS.performance
      );
      expect(lhr.categories.accessibility.score! * 100).toBeGreaterThanOrEqual(
        THRESHOLDS.accessibility
      );
      expect(lhr.categories['best-practices'].score! * 100).toBeGreaterThanOrEqual(
        THRESHOLDS.bestPractices
      );
      expect(lhr.categories.seo.score! * 100).toBeGreaterThanOrEqual(
        THRESHOLDS.seo
      );
      
      // Check Core Web Vitals
      const fcp = lhr.audits['first-contentful-paint'].numericValue!;
      const lcp = lhr.audits['largest-contentful-paint'].numericValue!;
      const tti = lhr.audits['interactive'].numericValue!;
      const cls = lhr.audits['cumulative-layout-shift'].numericValue!;
      const tbt = lhr.audits['total-blocking-time'].numericValue!;
      
      expect(fcp).toBeLessThanOrEqual(THRESHOLDS.fcp);
      expect(lcp).toBeLessThanOrEqual(THRESHOLDS.lcp);
      expect(tti).toBeLessThanOrEqual(THRESHOLDS.tti);
      expect(cls).toBeLessThanOrEqual(THRESHOLDS.cls);
      expect(tbt).toBeLessThanOrEqual(THRESHOLDS.tbt);
    });
    
    test('should meet mobile performance thresholds', async () => {
      const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
      const options = {
        logLevel: 'info',
        output: 'json',
        port: chrome.port,
      };
      
      const runnerResult = await lighthouse(
        `http://localhost:3000${pageConfig.path}`,
        options,
        MOBILE_CONFIG
      );
      
      await chrome.kill();
      
      if (!runnerResult) {
        throw new Error('Lighthouse failed to run');
      }
      
      const { lhr } = runnerResult;
      
      // Mobile thresholds are slightly lower
      expect(lhr.categories.performance.score! * 100).toBeGreaterThanOrEqual(
        THRESHOLDS.performance - 10
      );
      
      // Check mobile-specific metrics
      const fcp = lhr.audits['first-contentful-paint'].numericValue!;
      const lcp = lhr.audits['largest-contentful-paint'].numericValue!;
      
      // Mobile thresholds are higher due to throttling
      expect(fcp).toBeLessThanOrEqual(THRESHOLDS.fcp * 2);
      expect(lcp).toBeLessThanOrEqual(THRESHOLDS.lcp * 2);
    });
    
  });
}

// Core Web Vitals tests using Playwright
test.describe('Core Web Vitals', () => {
  
  test('should measure FCP (First Contentful Paint)', async ({ page }) => {
    await page.goto('/');
    
    const fcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            resolve(fcpEntry.startTime);
          }
        }).observe({ entryTypes: ['paint'] });
      });
    });
    
    expect(fcp).toBeLessThanOrEqual(THRESHOLDS.fcp);
  });
  
  test('should measure LCP (Largest Contentful Paint)', async ({ page }) => {
    await page.goto('/');
    
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Resolve after page load
        setTimeout(() => {
          const entries = performance.getEntriesByType('largest-contentful-paint');
          const lastEntry = entries[entries.length - 1] as any;
          resolve(lastEntry?.startTime || 0);
        }, 5000);
      });
    });
    
    expect(lcp).toBeLessThanOrEqual(THRESHOLDS.lcp);
  });
  
  test('should measure CLS (Cumulative Layout Shift)', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to settle
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
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
    
    expect(cls).toBeLessThanOrEqual(THRESHOLDS.cls);
  });
  
  test('should measure FID (First Input Delay)', async ({ page }) => {
    await page.goto('/');
    
    // Simulate user interaction
    const button = await page.locator('button, a').first();
    
    const startTime = Date.now();
    await button.click();
    const endTime = Date.now();
    
    const fid = endTime - startTime;
    
    expect(fid).toBeLessThanOrEqual(THRESHOLDS.fid);
  });
  
  test('should measure TTI (Time to Interactive)', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for main thread to be idle
    await page.evaluate(() => {
      return new Promise((resolve) => {
        requestIdleCallback(resolve);
      });
    });
    
    const tti = Date.now() - startTime;
    
    expect(tti).toBeLessThanOrEqual(THRESHOLDS.tti);
  });
  
});

// Network condition tests
test.describe('Network Performance', () => {
  
  test('should load on 3G network', async ({ page, context }) => {
    // Simulate 3G network
    await context.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Add latency
      await route.continue();
    });
    
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time on 3G
    expect(loadTime).toBeLessThanOrEqual(5000);
  });
  
  test('should load on 4G network', async ({ page, context }) => {
    // Simulate 4G network
    await context.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 20)); // Add latency
      await route.continue();
    });
    
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;
    
    // Should load quickly on 4G
    expect(loadTime).toBeLessThanOrEqual(2000);
  });
  
});

// Resource loading tests
test.describe('Resource Loading', () => {
  
  test('should optimize image loading', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src,
        loading: img.loading,
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: img.src.split('.').pop()?.split('?')[0],
      }));
    });
    
    // Check that images use lazy loading
    const belowFoldImages = images.slice(3); // Skip hero images
    const lazyLoadedCount = belowFoldImages.filter(
      img => img.loading === 'lazy'
    ).length;
    
    expect(lazyLoadedCount).toBeGreaterThan(0);
    
    // Check that images use modern formats
    const modernFormats = ['webp', 'avif'];
    const modernFormatCount = images.filter(
      img => modernFormats.includes(img.format || '')
    ).length;
    
    expect(modernFormatCount).toBeGreaterThan(0);
  });
  
  test('should minimize JavaScript bundle size', async ({ page }) => {
    const resources = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter((entry: any) => entry.name.includes('.js'))
        .map((entry: any) => ({
          name: entry.name,
          size: entry.transferSize,
          duration: entry.duration,
        }));
    });
    
    await page.goto('/');
    
    const totalJsSize = resources.reduce((sum, r) => sum + r.size, 0);
    
    // Total JS should be under 500KB
    expect(totalJsSize).toBeLessThanOrEqual(500 * 1024);
  });
  
  test('should use code splitting', async ({ page }) => {
    await page.goto('/');
    
    const initialScripts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script[src]'))
        .map(script => (script as HTMLScriptElement).src);
    });
    
    // Navigate to another page
    await page.goto('/chat');
    
    const chatScripts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script[src]'))
        .map(script => (script as HTMLScriptElement).src);
    });
    
    // Should have different scripts (code splitting)
    const uniqueScripts = chatScripts.filter(
      script => !initialScripts.includes(script)
    );
    
    expect(uniqueScripts.length).toBeGreaterThan(0);
  });
  
});

// Runtime performance tests
test.describe('Runtime Performance', () => {
  
  test('should maintain 60fps during scroll', async ({ page }) => {
    await page.goto('/');
    
    // Start performance monitoring
    await page.evaluate(() => {
      (window as any).frameTimings = [];
      let lastTime = performance.now();
      
      function measureFrame() {
        const currentTime = performance.now();
        const frameDuration = currentTime - lastTime;
        (window as any).frameTimings.push(frameDuration);
        lastTime = currentTime;
        requestAnimationFrame(measureFrame);
      }
      
      requestAnimationFrame(measureFrame);
    });
    
    // Scroll the page
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    
    await page.waitForTimeout(2000);
    
    // Check frame timings
    const frameTimings = await page.evaluate(() => (window as any).frameTimings);
    
    // Calculate average FPS
    const avgFrameDuration = frameTimings.reduce((a: number, b: number) => a + b, 0) / frameTimings.length;
    const avgFps = 1000 / avgFrameDuration;
    
    // Should maintain at least 50fps (allowing some drops)
    expect(avgFps).toBeGreaterThanOrEqual(50);
  });
  
  test('should not have memory leaks', async ({ page }) => {
    await page.goto('/');
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    // Navigate and interact
    for (let i = 0; i < 5; i++) {
      await page.goto('/chat');
      await page.goto('/pricing');
      await page.goto('/');
    }
    
    // Force garbage collection (if available)
    await page.evaluate(() => {
      if ((window as any).gc) {
        (window as any).gc();
      }
    });
    
    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    // Memory should not grow significantly (allow 50% increase)
    expect(finalMemory).toBeLessThanOrEqual(initialMemory * 1.5);
  });
  
});
