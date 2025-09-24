import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Staging environment configuration
 */
export default defineConfig({
  testDir: './tests',
  timeout: 45000,
  expect: { timeout: 15000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: 3,
  
  reporter: [
    ['html', { outputFolder: 'test-results/staging/html-report', open: 'never' }],
    ['json', { outputFile: 'test-results/staging/results.json' }],
    ['junit', { outputFile: 'test-results/staging/junit.xml' }],
    ['line'],
  ],
  
  outputDir: 'test-results/staging/artifacts',
  
  use: {
    baseURL: 'https://demo.nopcommerce.com',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    navigationTimeout: 60000,
    actionTimeout: 45000,
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
