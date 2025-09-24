import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Development environment configuration
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 2,
  
  reporter: [
    ['html', { outputFolder: 'test-results/dev/html-report', open: 'on-failure' }],
    ['json', { outputFile: 'test-results/dev/results.json' }],
    ['line'],
  ],
  
  outputDir: 'test-results/dev/artifacts',
  
  use: {
    baseURL: 'https://demo.nopcommerce.com',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    navigationTimeout: 60000,
    actionTimeout: 30000,
    headless: false, // Run headed in dev for debugging
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
