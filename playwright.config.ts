import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { getEnvironment } from './src/config/environments';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const environment = getEnvironment(process.env.NODE_ENV || 'dev');

/**
 * Enhanced Playwright configuration with comprehensive settings
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',

  /* Global test timeout */
  timeout: environment.timeout,

  /* Expect timeout for assertions */
  expect: {
    timeout: 10000,
  },

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? environment.retries : 1,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : environment.workers,

  /* Reporter to use */
  reporter: [
    ['html', {
      outputFolder: 'test-results/html-report',
      open: process.env.REPORT_OPEN === 'true' ? 'always' : 'never'
    }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['./src/reporters/CustomHtmlReporter.ts', {
      outputDir: 'test-results'
    }],
    ['line'],
  ],

  /* Output directory for test artifacts */
  outputDir: 'test-results/artifacts',

  /* Shared settings for all projects */
  use: {
    /* Base URL */
    baseURL: environment.baseUrl,

    /* Browser context options */
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    /* Collect trace when retrying the failed test */
    trace: process.env.TRACE_MODE as any || 'on-first-retry',

    /* Record video */
    video: process.env.VIDEO_MODE as any || 'retain-on-failure',

    /* Take screenshot */
    screenshot: process.env.SCREENSHOT_MODE as any || 'only-on-failure',

    /* Navigation timeout */
    navigationTimeout: 60000,

    /* Action timeout */
    actionTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: environment.headless,
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        headless: environment.headless,
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        headless: environment.headless,
      },
    },

  ],
});
