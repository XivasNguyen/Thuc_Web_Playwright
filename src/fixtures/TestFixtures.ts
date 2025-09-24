import { test as base, Page } from '@playwright/test';
import { HeaderComponent } from '../pages/components/HeaderComponent';
import { FooterComponent } from '../pages/components/FooterComponent';
import { TestDataFactory } from '../data/TestDataFactory';
import { TestUtils } from '../utils/TestUtils';
import { ReportUtils } from '../utils/ReportUtils';

/**
 * Extended test fixtures with page objects and utilities
 */
export interface TestFixtures {
  page: Page;
  headerComponent: HeaderComponent;
  footerComponent: FooterComponent;
  testDataFactory: typeof TestDataFactory;
  testUtils: typeof TestUtils;
}

/**
 * Extended test with custom fixtures
 */
export const test = base.extend<TestFixtures>({
  /**
   * Page fixture - standard Playwright page with enhanced reporting
   */
  page: async ({ page }, use, testInfo) => {
    // Initialize report directories
    ReportUtils.initializeReportDirectories();

    // Set up page-level configurations
    await page.setViewportSize({ width: 1280, height: 720 });

    // Start trace recording
    await ReportUtils.startTraceRecording(page, testInfo);

    // Capture console logs
    ReportUtils.captureConsoleLogs(page, testInfo);

    // Capture network requests
    ReportUtils.captureNetworkRequests(page, testInfo);

    // Add console error tracking
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Add request/response logging for debugging
    if (process.env.DEBUG_NETWORK === 'true') {
      page.on('request', request => {
        console.log(`→ ${request.method()} ${request.url()}`);
      });

      page.on('response', response => {
        console.log(`← ${response.status()} ${response.url()}`);
      });
    }

    // Add error handling for uncaught exceptions
    page.on('pageerror', error => {
      console.error('Page error:', error.message);
    });

    let testError: Error | undefined;

    try {
      await use(page);
    } catch (error) {
      testError = error as Error;
      throw error;
    } finally {
      // Stop trace recording
      await ReportUtils.stopTraceRecording(page, testInfo);

      // Create failure report if test failed
      if (testInfo.status === 'failed' || testError) {
        await ReportUtils.createFailureReport(page, testInfo, testError);
      }

      // Log test result
      ReportUtils.logTestResult(testInfo);

      // Save test execution summary
      ReportUtils.saveTestExecutionSummary(testInfo);

      // Log console errors after test completion
      if (consoleErrors.length > 0) {
        console.warn('Console errors detected:', consoleErrors);
      }
    }
  },

  /**
   * Header component fixture
   */
  headerComponent: async ({ page }, use) => {
    const headerComponent = new HeaderComponent(page);
    await use(headerComponent);
  },

  /**
   * Footer component fixture
   */
  footerComponent: async ({ page }, use) => {
    const footerComponent = new FooterComponent(page);
    await use(footerComponent);
  },

  /**
   * Test data factory fixture
   */
  testDataFactory: async (_fixtures, use) => {
    await use(TestDataFactory);
  },

  /**
   * Test utils fixture
   */
  testUtils: async (_fixtures, use) => {
    await use(TestUtils);
  },
});

/**
 * Authenticated user fixture for tests that require login
 */
export const authenticatedTest = test.extend<TestFixtures & { authenticatedPage: Page }>({
  authenticatedPage: async ({ page, headerComponent }, use) => {
    // Navigate to home page
    await page.goto('/');
    
    // Perform login
    await headerComponent.clickLogin();
    
    // Fill login form (assuming we have valid test credentials)
    const loginData = TestDataFactory.createValidUserLoginData();
    await page.fill('#Email', loginData.email);
    await page.fill('#Password', loginData.password);
    await page.click('button[type="submit"]');
    
    // Wait for successful login
    await page.waitForURL('**/');
    
    // Verify user is logged in
    const isLoggedIn = await headerComponent.isUserLoggedIn();
    if (!isLoggedIn) {
      throw new Error('Failed to authenticate user');
    }

    await use(page);
  },
});

/**
 * Guest user fixture for tests that require guest checkout
 */
export const guestTest = test.extend<TestFixtures & { guestPage: Page }>({
  guestPage: async ({ page }, use) => {
    // Ensure user is not logged in
    await page.goto('/');
    
    // Check if user is logged in and logout if necessary
    const logoutLink = page.locator('a[href*="/logout"]');
    if (await logoutLink.isVisible()) {
      await logoutLink.click();
      await page.waitForLoadState('networkidle');
    }

    await use(page);
  },
});

/**
 * Mobile test fixture for mobile-specific tests
 */
export const mobileTest = test.extend<TestFixtures>({
  page: async ({ browser }, use) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 }, // iPhone SE dimensions
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      hasTouch: true,
      isMobile: true,
    });
    
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

/**
 * Performance test fixture with performance monitoring
 */
export const performanceTest = test.extend<TestFixtures & { performanceMetrics: any }>({
  performanceMetrics: async ({ page }, use) => {
    const metrics = {
      navigationStart: 0,
      loadComplete: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      networkRequests: [] as any[],
    };

    // Track network requests
    page.on('request', request => {
      metrics.networkRequests.push({
        url: request.url(),
        method: request.method(),
        timestamp: Date.now(),
      });
    });

    // Measure performance metrics
    await page.addInitScript(() => {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const paint = performance.getEntriesByType('paint');
          
          (window as any).performanceMetrics = {
            navigationStart: navigation.navigationStart,
            loadComplete: navigation.loadEventEnd,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          };
        }, 1000);
      });
    });

    await use(metrics);

    // Log performance metrics after test
    const pageMetrics = await page.evaluate(() => (window as any).performanceMetrics);
    if (pageMetrics) {
      console.log('Performance Metrics:', {
        ...pageMetrics,
        networkRequestCount: metrics.networkRequests.length,
      });
    }
  },
});

/**
 * API test fixture for tests that need to interact with APIs
 */
export const apiTest = test.extend<TestFixtures & { apiContext: any }>({
  apiContext: async ({ playwright }, use) => {
    const apiContext = await playwright.request.newContext({
      baseURL: 'https://demo.nopcommerce.com',
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    await use(apiContext);
    await apiContext.dispose();
  },
});

/**
 * Database test fixture (if database access is needed)
 */
export const databaseTest = test.extend<TestFixtures & { dbConnection: any }>({
  dbConnection: async (_fixtures, use) => {
    // Mock database connection for demo purposes
    const mockDb = {
      query: async (sql: string) => {
        console.log(`Mock DB Query: ${sql}`);
        return { rows: [], rowCount: 0 };
      },
      close: async () => {
        console.log('Mock DB connection closed');
      },
    };

    await use(mockDb);
    await mockDb.close();
  },
});

/**
 * Screenshot fixture for tests that need automatic screenshots
 */
export const screenshotTest = test.extend<TestFixtures>({
  page: async ({ page }, use, testInfo) => {
    // Take screenshot before test
    await page.screenshot({
      path: `test-results/screenshots/before-${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}.png`,
      fullPage: true,
    });

    await use(page);

    // Take screenshot after test
    await page.screenshot({
      path: `test-results/screenshots/after-${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}.png`,
      fullPage: true,
    });
  },
});

/**
 * Retry fixture for flaky tests
 */
export const retryTest = test.extend<TestFixtures>({
  page: async ({ page }, use, _testInfo) => {
    // Add retry logic for specific operations
    const originalGoto = page.goto.bind(page);
    page.goto = async (url: string, options?: any) => {
      let lastError;
      for (let i = 0; i < 3; i++) {
        try {
          return await originalGoto(url, options);
        } catch (error) {
          lastError = error;
          console.log(`Navigation attempt ${i + 1} failed, retrying...`);
          await TestUtils.wait(1000 * (i + 1)); // Exponential backoff
        }
      }
      throw lastError;
    };

    await use(page);
  },
});

// Export the expect function from Playwright
export { expect } from '@playwright/test';
