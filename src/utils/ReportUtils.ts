import { Page, TestInfo } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Core reporting utilities for failure artifacts
 */
export class ReportUtils {
  private static readonly REPORTS_DIR = 'test-results';
  private static readonly SCREENSHOTS_DIR = path.join(ReportUtils.REPORTS_DIR, 'screenshots');
  private static readonly TRACES_DIR = path.join(ReportUtils.REPORTS_DIR, 'traces');
  private static readonly LOGS_DIR = path.join(ReportUtils.REPORTS_DIR, 'logs');

  /**
   * Initialize report directories
   */
  static initializeReportDirectories(): void {
    const directories = [
      ReportUtils.REPORTS_DIR,
      ReportUtils.SCREENSHOTS_DIR,
      ReportUtils.TRACES_DIR,
      ReportUtils.LOGS_DIR,
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Take screenshot on failure
   */
  static async takeFailureScreenshot(page: Page, testInfo: TestInfo): Promise<string> {
    const timestamp = Date.now();
    const testName = testInfo.title.replace(/[^a-zA-Z0-9]/g, '-');
    const screenshotPath = path.join(
      ReportUtils.SCREENSHOTS_DIR,
      `failure-${testName}-${timestamp}.png`
    );

    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      type: 'png',
    });

    console.log(`📸 Screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  /**
   * Start trace recording
   */
  static async startTraceRecording(page: Page, _testInfo: TestInfo): Promise<void> {
    try {
      await page.context().tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
      });
    } catch (error) {
      console.warn(`⚠️ Failed to start trace recording: ${error}`);
    }
  }

  /**
   * Stop trace recording and save
   */
  static async stopTraceRecording(page: Page, testInfo: TestInfo): Promise<string | null> {
    try {
      const timestamp = Date.now();
      const testName = testInfo.title.replace(/[^a-zA-Z0-9]/g, '-');
      const tracePath = path.join(
        ReportUtils.TRACES_DIR,
        `trace-${testName}-${timestamp}.zip`
      );

      await page.context().tracing.stop({ path: tracePath });
      console.log(`🔍 Trace saved: ${tracePath}`);
      return tracePath;
    } catch (error) {
      console.warn(`⚠️ Failed to stop trace recording: ${error}`);
      return null;
    }
  }

  /**
   * Capture console logs
   */
  static captureConsoleLogs(page: Page, _testInfo: TestInfo): void {
    const logs: string[] = [];
    
    page.on('console', msg => {
      const logEntry = `[${new Date().toISOString()}] ${msg.type()}: ${msg.text()}`;
      logs.push(logEntry);
    });

    // Save logs when page is closed or test ends
    page.on('close', () => {
      if (logs.length > 0) {
        ReportUtils.saveConsoleLogs(logs, _testInfo);
      }
    });
  }

  /**
   * Save console logs to file
   */
  private static saveConsoleLogs(logs: string[], testInfo: TestInfo): void {
    const timestamp = Date.now();
    const testName = testInfo.title.replace(/[^a-zA-Z0-9]/g, '-');
    const logPath = path.join(
      ReportUtils.LOGS_DIR,
      `console-${testName}-${timestamp}.log`
    );

    fs.writeFileSync(logPath, logs.join('\n'));
    console.log(`📝 Console logs saved: ${logPath}`);
  }

  /**
   * Create comprehensive failure report with artifacts
   */
  static async createFailureReport(page: Page, testInfo: TestInfo, error?: Error): Promise<void> {
    try {
      console.log(`🚨 Test failed: ${testInfo.title}`);

      // Initialize directories
      ReportUtils.initializeReportDirectories();

      // Capture screenshot
      const screenshotPath = await ReportUtils.takeFailureScreenshot(page, testInfo);

      // Capture trace (already stopped in fixture)
      const tracePath = await ReportUtils.stopTraceRecording(page, testInfo);

      // Create failure report
      const failureReport = {
        testInfo: {
          title: testInfo.title,
          file: testInfo.file,
          status: testInfo.status,
          duration: testInfo.duration,
          retry: testInfo.retry,
          project: testInfo.project.name,
        },
        error: error ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        } : null,
        artifacts: {
          screenshot: screenshotPath,
          trace: tracePath,
        },
        timestamp: new Date().toISOString(),
      };

      const timestamp = Date.now();
      const testName = testInfo.title.replace(/[^a-zA-Z0-9]/g, '-');
      const reportPath = path.join(
        ReportUtils.LOGS_DIR,
        `failure-report-${testName}-${timestamp}.json`
      );

      fs.writeFileSync(reportPath, JSON.stringify(failureReport, null, 2));
      console.log(`📋 Failure report saved: ${reportPath}`);

      // Attach artifacts to test
      if (screenshotPath && fs.existsSync(screenshotPath)) {
        testInfo.attachments.push({
          name: 'failure-screenshot',
          path: screenshotPath,
          contentType: 'image/png',
        });
      }

      if (tracePath && fs.existsSync(tracePath)) {
        testInfo.attachments.push({
          name: 'failure-trace',
          path: tracePath,
          contentType: 'application/zip',
        });
      }
    } catch (reportError) {
      console.error(`❌ Failed to create failure report: ${reportError}`);
    }
  }
}
