import { Page, TestInfo } from '@playwright/test';
import { TestUtils } from './TestUtils';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Utility functions for enhanced reporting and failure handling
 */
export class ReportUtils {
  private static readonly REPORTS_DIR = 'test-results';
  private static readonly SCREENSHOTS_DIR = path.join(ReportUtils.REPORTS_DIR, 'screenshots');
  private static readonly TRACES_DIR = path.join(ReportUtils.REPORTS_DIR, 'traces');
  private static readonly VIDEOS_DIR = path.join(ReportUtils.REPORTS_DIR, 'videos');
  private static readonly LOGS_DIR = path.join(ReportUtils.REPORTS_DIR, 'logs');

  /**
   * Initialize report directories
   */
  static initializeReportDirectories(): void {
    const directories = [
      ReportUtils.REPORTS_DIR,
      ReportUtils.SCREENSHOTS_DIR,
      ReportUtils.TRACES_DIR,
      ReportUtils.VIDEOS_DIR,
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
    const timestamp = TestUtils.getCurrentTimestamp();
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

    console.log(`📸 Failure screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  /**
   * Take screenshot with custom name
   */
  static async takeCustomScreenshot(
    page: Page,
    name: string,
    options?: { fullPage?: boolean; type?: 'png' | 'jpeg' }
  ): Promise<string> {
    const timestamp = TestUtils.getCurrentTimestamp();
    const screenshotPath = path.join(
      ReportUtils.SCREENSHOTS_DIR,
      `${name}-${timestamp}.${options?.type || 'png'}`
    );

    await page.screenshot({
      path: screenshotPath,
      fullPage: options?.fullPage ?? true,
      type: options?.type || 'png',
    });

    console.log(`📸 Screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  /**
   * Capture page trace on failure
   */
  static async captureFailureTrace(page: Page, testInfo: TestInfo): Promise<string> {
    const timestamp = TestUtils.getCurrentTimestamp();
    const testName = testInfo.title.replace(/[^a-zA-Z0-9]/g, '-');
    const tracePath = path.join(
      ReportUtils.TRACES_DIR,
      `failure-trace-${testName}-${timestamp}.zip`
    );

    try {
      await page.context().tracing.stop({ path: tracePath });
      console.log(`🔍 Failure trace saved: ${tracePath}`);
      return tracePath;
    } catch (error) {
      console.warn(`⚠️ Failed to capture trace: ${error}`);
      return '';
    }
  }

  /**
   * Start trace recording
   */
  static async startTraceRecording(page: Page, testInfo: TestInfo): Promise<void> {
    try {
      // Check if tracing is already started
      const context = page.context();
      // Only start if not already tracing
      await context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
      });
      console.log(`🔍 Trace recording started for: ${testInfo.title}`);
    } catch (error) {
      if (error.message && error.message.includes('already started')) {
        console.log(`🔍 Trace recording already active for: ${testInfo.title}`);
      } else {
        console.warn(`⚠️ Failed to start trace recording: ${error}`);
      }
    }
  }

  /**
   * Stop trace recording
   */
  static async stopTraceRecording(page: Page, testInfo: TestInfo): Promise<string> {
    const timestamp = TestUtils.getCurrentTimestamp();
    const testName = testInfo.title.replace(/[^a-zA-Z0-9]/g, '-');
    const tracePath = path.join(
      ReportUtils.TRACES_DIR,
      `trace-${testName}-${timestamp}.zip`
    );

    try {
      await page.context().tracing.stop({ path: tracePath });
      console.log(`🔍 Trace recording stopped: ${tracePath}`);
      return tracePath;
    } catch (error) {
      console.warn(`⚠️ Failed to stop trace recording: ${error}`);
      return '';
    }
  }

  /**
   * Capture console logs
   */
  static captureConsoleLogs(page: Page, testInfo: TestInfo): void {
    const logs: string[] = [];
    const timestamp = TestUtils.getCurrentTimestamp();
    const testName = testInfo.title.replace(/[^a-zA-Z0-9]/g, '-');
    const logPath = path.join(
      ReportUtils.LOGS_DIR,
      `console-${testName}-${timestamp}.log`
    );

    page.on('console', msg => {
      const logEntry = `[${new Date().toISOString()}] ${msg.type().toUpperCase()}: ${msg.text()}`;
      logs.push(logEntry);
      console.log(`🖥️ Console: ${logEntry}`);
    });

    // Save logs to file when test completes
    process.on('exit', () => {
      if (logs.length > 0) {
        fs.writeFileSync(logPath, logs.join('\n'));
        console.log(`📝 Console logs saved: ${logPath}`);
      }
    });
  }

  /**
   * Capture network requests
   */
  static captureNetworkRequests(page: Page, testInfo: TestInfo): void {
    const requests: any[] = [];
    const timestamp = TestUtils.getCurrentTimestamp();
    const testName = testInfo.title.replace(/[^a-zA-Z0-9]/g, '-');
    const networkLogPath = path.join(
      ReportUtils.LOGS_DIR,
      `network-${testName}-${timestamp}.json`
    );

    page.on('request', request => {
      requests.push({
        timestamp: new Date().toISOString(),
        method: request.method(),
        url: request.url(),
        headers: request.headers(),
        postData: request.postData(),
      });
    });

    page.on('response', response => {
      const requestIndex = requests.findIndex(req => req.url === response.url());
      if (requestIndex !== -1) {
        requests[requestIndex].response = {
          status: response.status(),
          statusText: response.statusText(),
          headers: response.headers(),
        };
      }
    });

    // Save network logs to file when test completes
    process.on('exit', () => {
      if (requests.length > 0) {
        fs.writeFileSync(networkLogPath, JSON.stringify(requests, null, 2));
        console.log(`🌐 Network logs saved: ${networkLogPath}`);
      }
    });
  }

  /**
   * Generate test execution summary
   */
  static generateTestExecutionSummary(testInfo: TestInfo): any {
    return {
      testTitle: testInfo.title,
      testFile: testInfo.file,
      status: testInfo.status,
      duration: testInfo.duration,
      startTime: new Date(Date.now() - testInfo.duration),
      endTime: new Date(),
      retry: testInfo.retry,
      workerIndex: testInfo.workerIndex,
      project: testInfo.project.name,
      browser: testInfo.project.use?.browserName || 'unknown',
      viewport: testInfo.project.use?.viewport || { width: 0, height: 0 },
      userAgent: testInfo.project.use?.userAgent || 'unknown',
      errors: testInfo.errors.map(error => ({
        message: error.message,
        stack: error.stack,
      })),
      attachments: testInfo.attachments.map(attachment => ({
        name: attachment.name,
        contentType: attachment.contentType,
        path: attachment.path,
      })),
    };
  }

  /**
   * Save test execution summary
   */
  static saveTestExecutionSummary(testInfo: TestInfo): void {
    const summary = ReportUtils.generateTestExecutionSummary(testInfo);
    const timestamp = TestUtils.getCurrentTimestamp();
    const testName = testInfo.title.replace(/[^a-zA-Z0-9]/g, '-');
    const summaryPath = path.join(
      ReportUtils.LOGS_DIR,
      `summary-${testName}-${timestamp}.json`
    );

    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`📊 Test summary saved: ${summaryPath}`);
  }



  /**
   * Capture browser information
   */
  static async captureBrowserInfo(page: Page): Promise<any> {
    try {
      const browserInfo = await page.evaluate(() => ({
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        screen: {
          width: screen.width,
          height: screen.height,
          colorDepth: screen.colorDepth,
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }));

      console.log(`🌐 Browser info captured: ${browserInfo.userAgent}`);
      return browserInfo;
    } catch (error) {
      console.warn(`⚠️ Failed to capture browser info: ${error}`);
      return null;
    }
  }

  /**
   * Create comprehensive failure report
   */
  static async createFailureReport(page: Page, testInfo: TestInfo, error?: Error): Promise<void> {
    console.log(`🚨 Creating failure report for: ${testInfo.title}`);
    
    try {
      // Initialize directories
      ReportUtils.initializeReportDirectories();

      // Capture screenshot
      const screenshotPath = await ReportUtils.takeFailureScreenshot(page, testInfo);

      // Capture trace
      const tracePath = await ReportUtils.captureFailureTrace(page, testInfo);

      // Capture browser info
      const browserInfo = await ReportUtils.captureBrowserInfo(page);

      // Create comprehensive failure report
      const failureReport = {
        testInfo: ReportUtils.generateTestExecutionSummary(testInfo),
        error: error ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        } : null,
        artifacts: {
          screenshot: screenshotPath,
          trace: tracePath,
        },
        browserInfo,
        timestamp: new Date().toISOString(),
      };

      const timestamp = TestUtils.getCurrentTimestamp();
      const testName = testInfo.title.replace(/[^a-zA-Z0-9]/g, '-');
      const reportPath = path.join(
        ReportUtils.LOGS_DIR,
        `failure-report-${testName}-${timestamp}.json`
      );

      fs.writeFileSync(reportPath, JSON.stringify(failureReport, null, 2));
      console.log(`📋 Comprehensive failure report saved: ${reportPath}`);

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

  /**
   * Log test step with timestamp
   */
  static logTestStep(step: string, testInfo?: TestInfo): void {
    const timestamp = new Date().toISOString();
    const testName = testInfo ? testInfo.title : 'Unknown Test';
    console.log(`🔍 [${timestamp}] ${testName}: ${step}`);
  }

  /**
   * Log test result
   */
  static logTestResult(testInfo: TestInfo): void {
    const status = testInfo.status;
    const duration = testInfo.duration;
    const emoji = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⚠️';
    
    console.log(`${emoji} Test: ${testInfo.title}`);
    console.log(`   Status: ${status}`);
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Retry: ${testInfo.retry}`);
    
    if (testInfo.errors.length > 0) {
      console.log(`   Errors: ${testInfo.errors.length}`);
      testInfo.errors.forEach((error, index) => {
        console.log(`     ${index + 1}. ${error.message}`);
      });
    }
  }

  /**
   * Clean up old report files
   */
  static cleanupOldReports(daysToKeep: number = 7): void {
    const directories = [
      ReportUtils.SCREENSHOTS_DIR,
      ReportUtils.TRACES_DIR,
      ReportUtils.VIDEOS_DIR,
      ReportUtils.LOGS_DIR,
    ];

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    directories.forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);
          
          if (stats.mtime < cutoffDate) {
            fs.unlinkSync(filePath);
            console.log(`🗑️ Cleaned up old report file: ${filePath}`);
          }
        });
      }
    });
  }
}
