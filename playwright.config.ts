import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for visual regression testing
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  // Maximum time one test can run
  timeout: 60 * 1000,
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL for navigation
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
  },
  
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // iOS Mobile devices
    {
      name: 'iPhone 12',
      use: { ...devices['iPhone 12'] },
    },
    
    {
      name: 'iPhone 13',
      use: { ...devices['iPhone 13'] },
    },
    
    {
      name: 'iPhone 14',
      use: { ...devices['iPhone 14 Pro'] },
    },
    
    // Android Mobile devices
    {
      name: 'Pixel 5',
      use: { ...devices['Pixel 5'] },
    },
    
    {
      name: 'Galaxy S9+',
      use: { ...devices['Galaxy S9+'] },
    },
    
    // Tablet viewports
    {
      name: 'iPad',
      use: { ...devices['iPad (gen 7)'] },
    },
    
    {
      name: 'iPad Pro',
      use: { ...devices['iPad Pro'] },
    },
    
    {
      name: 'Galaxy Tab',
      use: { ...devices['Galaxy Tab S4'] },
    },
  ],
  
  // Run local dev server before starting tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
