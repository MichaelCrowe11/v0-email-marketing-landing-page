/**
 * Visual Regression Testing Setup
 * 
 * This file provides utilities for capturing and comparing screenshots
 * across different browsers and viewport sizes.
 */

export const VIEWPORTS = {
  mobile: { width: 375, height: 667, name: 'iPhone SE' },
  mobileLarge: { width: 414, height: 896, name: 'iPhone 11 Pro Max' },
  tablet: { width: 768, height: 1024, name: 'iPad' },
  desktop: { width: 1280, height: 720, name: 'Desktop HD' },
  desktopLarge: { width: 1920, height: 1080, name: 'Desktop Full HD' },
} as const;

export const PAGES_TO_TEST = [
  { path: '/', name: 'Homepage' },
  { path: '/chat', name: 'Chat' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/species-library', name: 'Species Library' },
  { path: '/knowledge-base', name: 'Knowledge Base' },
  { path: '/forum', name: 'Forum' },
  { path: '/profile', name: 'Profile' },
] as const;

export const BROWSERS = ['chrome', 'firefox', 'safari', 'edge'] as const;

export interface ScreenshotConfig {
  page: string;
  viewport: keyof typeof VIEWPORTS;
  browser: typeof BROWSERS[number];
  theme: 'light' | 'dark';
}

export function generateScreenshotPath(config: ScreenshotConfig): string {
  const { page, viewport, browser, theme } = config;
  const pageName = PAGES_TO_TEST.find(p => p.path === page)?.name || 'unknown';
  return `screenshots/${browser}/${theme}/${viewport}/${pageName}.png`;
}

export function generateBaselinePath(config: ScreenshotConfig): string {
  return `tests/visual-regression/baseline/${generateScreenshotPath(config)}`;
}

export function generateComparisonPath(config: ScreenshotConfig): string {
  return `tests/visual-regression/comparison/${generateScreenshotPath(config)}`;
}

export function generateDiffPath(config: ScreenshotConfig): string {
  return `tests/visual-regression/diff/${generateScreenshotPath(config)}`;
}
