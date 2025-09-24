import { test as base, Page } from '@playwright/test';
import { ReportUtils } from '../utils/ReportUtils';

/**
 * Core test fixtures for POM architecture
 */
export interface TestFixtures {
  page: Page;
}

/**
 * Core test fixture with failure artifacts support
 */
export const test = base.extend<TestFixtures>({
  page: async ({ page }, use, testInfo) => {
    // Initialize report directories
    ReportUtils.initializeReportDirectories();

    // Start trace recording for failure artifacts
    await ReportUtils.startTraceRecording(page, testInfo);

    // Capture console logs for failure artifacts
    ReportUtils.captureConsoleLogs(page, testInfo);

    let testError: Error | undefined;

    try {
      await use(page);
    } catch (error) {
      testError = error as Error;
      throw error;
    } finally {
      // Stop trace recording
      await ReportUtils.stopTraceRecording(page, testInfo);

      // Create failure artifacts if test failed
      if (testInfo.status === 'failed' || testError) {
        await ReportUtils.createFailureReport(page, testInfo, testError);
      }
    }
  },
});

// Export expect from Playwright for convenience
export { expect } from '@playwright/test';
