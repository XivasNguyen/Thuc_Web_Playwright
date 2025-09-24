import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Production environment configuration
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: { timeout: 20000 },
  fullyParallel: false, // More conservative for production
  forbidOnly: true,
  retries: 3,
  workers: 1, // Single worker for production stability
  
  reporter: [
    ['html', { outputFolder: 'test-results/prod/html-report', open: 'never' }],
    ['json', { outputFile: 'test-results/prod/results.json' }],
    ['junit', { outputFile: 'test-results/prod/junit.xml' }],
    ['line'],
    ['github'], // GitHub Actions integration
  ],
  
  outputDir: 'test-results/prod/artifacts',
  
  use: {
    baseURL: 'https://demo.nopcommerce.com',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    navigationTimeout: 90000,
    actionTimeout: 60000,
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
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
