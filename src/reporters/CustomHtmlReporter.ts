import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Custom HTML Reporter for enhanced test reporting
 */
export default class CustomHtmlReporter implements Reporter {
  private testResults: Array<{
    test: TestCase;
    result: TestResult;
  }> = [];
  
  private startTime: Date = new Date();
  private endTime: Date = new Date();
  private outputDir: string = 'test-results';
  private reportPath: string = path.join(this.outputDir, 'custom-report.html');

  constructor(options: { outputDir?: string } = {}) {
    this.outputDir = options.outputDir || 'test-results';
    this.reportPath = path.join(this.outputDir, 'custom-report.html');
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  onBegin(config: any, suite: any) {
    this.startTime = new Date();
    console.log(`🚀 Starting test execution with ${suite.allTests().length} tests`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.testResults.push({ test, result });
    
    const status = result.status;
    const emoji = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⚠️';
    console.log(`${emoji} ${test.title} (${result.duration}ms)`);
  }

  onEnd(_result: FullResult) {
    this.endTime = new Date();
    this.generateHtmlReport();
    console.log(`📊 Custom HTML report generated: ${this.reportPath}`);
  }

  private generateHtmlReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.result.status === 'passed').length;
    const failedTests = this.testResults.filter(r => r.result.status === 'failed').length;
    const skippedTests = this.testResults.filter(r => r.result.status === 'skipped').length;
    const flakyTests = this.testResults.filter(r => r.result.status === 'flaky').length;
    
    const duration = this.endTime.getTime() - this.startTime.getTime();
    const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Execution Report</title>
    <style>
        ${this.getStyles()}
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>🎭 Playwright Test Execution Report</h1>
            <div class="timestamp">Generated on: ${this.endTime.toLocaleString()}</div>
        </header>

        <div class="summary">
            <div class="summary-card">
                <div class="summary-title">Test Summary</div>
                <div class="summary-stats">
                    <div class="stat">
                        <span class="stat-number">${totalTests}</span>
                        <span class="stat-label">Total Tests</span>
                    </div>
                    <div class="stat passed">
                        <span class="stat-number">${passedTests}</span>
                        <span class="stat-label">Passed</span>
                    </div>
                    <div class="stat failed">
                        <span class="stat-number">${failedTests}</span>
                        <span class="stat-label">Failed</span>
                    </div>
                    <div class="stat skipped">
                        <span class="stat-number">${skippedTests}</span>
                        <span class="stat-label">Skipped</span>
                    </div>
                    <div class="stat flaky">
                        <span class="stat-number">${flakyTests}</span>
                        <span class="stat-label">Flaky</span>
                    </div>
                </div>
                <div class="pass-rate">
                    <div class="pass-rate-bar">
                        <div class="pass-rate-fill" style="width: ${passRate}%"></div>
                    </div>
                    <div class="pass-rate-text">${passRate}% Pass Rate</div>
                </div>
            </div>

            <div class="summary-card">
                <div class="summary-title">Execution Details</div>
                <div class="execution-details">
                    <div class="detail">
                        <span class="detail-label">Start Time:</span>
                        <span class="detail-value">${this.startTime.toLocaleString()}</span>
                    </div>
                    <div class="detail">
                        <span class="detail-label">End Time:</span>
                        <span class="detail-value">${this.endTime.toLocaleString()}</span>
                    </div>
                    <div class="detail">
                        <span class="detail-label">Duration:</span>
                        <span class="detail-value">${this.formatDuration(duration)}</span>
                    </div>
                    <div class="detail">
                        <span class="detail-label">Environment:</span>
                        <span class="detail-value">${process.env.NODE_ENV || 'development'}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="filters">
            <button class="filter-btn active" onclick="filterTests('all')">All Tests</button>
            <button class="filter-btn" onclick="filterTests('passed')">Passed (${passedTests})</button>
            <button class="filter-btn" onclick="filterTests('failed')">Failed (${failedTests})</button>
            <button class="filter-btn" onclick="filterTests('skipped')">Skipped (${skippedTests})</button>
            <button class="filter-btn" onclick="filterTests('flaky')">Flaky (${flakyTests})</button>
        </div>

        <div class="test-results">
            ${this.generateTestResultsHtml()}
        </div>
    </div>

    <script>
        ${this.getJavaScript()}
    </script>
</body>
</html>`;

    fs.writeFileSync(this.reportPath, html);
  }

  private generateTestResultsHtml(): string {
    return this.testResults.map(({ test, result }) => {
      const status = result.status;
      const statusClass = status === 'passed' ? 'passed' : 
                         status === 'failed' ? 'failed' : 
                         status === 'skipped' ? 'skipped' : 'flaky';
      
      const statusIcon = status === 'passed' ? '✅' : 
                        status === 'failed' ? '❌' : 
                        status === 'skipped' ? '⏭️' : '🔄';

      const errorHtml = result.error ? `
        <div class="error-details">
          <div class="error-message">${this.escapeHtml(result.error.message || '')}</div>
          <div class="error-stack">${this.escapeHtml(result.error.stack || '')}</div>
        </div>
      ` : '';

      const attachmentsHtml = result.attachments.length > 0 ? `
        <div class="attachments">
          <div class="attachments-title">Attachments:</div>
          ${result.attachments.map(attachment => `
            <div class="attachment">
              <span class="attachment-name">${attachment.name}</span>
              ${attachment.path ? `<a href="${attachment.path}" target="_blank">View</a>` : ''}
            </div>
          `).join('')}
        </div>
      ` : '';

      return `
        <div class="test-result ${statusClass}" data-status="${status}">
          <div class="test-header">
            <div class="test-status">${statusIcon}</div>
            <div class="test-info">
              <div class="test-title">${this.escapeHtml(test.title)}</div>
              <div class="test-meta">
                <span class="test-file">${this.escapeHtml(test.location.file)}</span>
                <span class="test-duration">${result.duration}ms</span>
                ${result.retry > 0 ? `<span class="test-retry">Retry: ${result.retry}</span>` : ''}
              </div>
            </div>
          </div>
          ${errorHtml}
          ${attachmentsHtml}
        </div>
      `;
    }).join('');
  }

  private getStyles(): string {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background-color: #f5f5f5;
        color: #333;
        line-height: 1.6;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .header {
        text-align: center;
        margin-bottom: 30px;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .header h1 {
        color: #2c3e50;
        margin-bottom: 10px;
      }

      .timestamp {
        color: #7f8c8d;
        font-size: 14px;
      }

      .summary {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 30px;
      }

      .summary-card {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .summary-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 15px;
        color: #2c3e50;
      }

      .summary-stats {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .stat {
        text-align: center;
      }

      .stat-number {
        display: block;
        font-size: 24px;
        font-weight: 700;
        color: #34495e;
      }

      .stat.passed .stat-number { color: #27ae60; }
      .stat.failed .stat-number { color: #e74c3c; }
      .stat.skipped .stat-number { color: #f39c12; }
      .stat.flaky .stat-number { color: #9b59b6; }

      .stat-label {
        font-size: 12px;
        color: #7f8c8d;
        text-transform: uppercase;
      }

      .pass-rate-bar {
        height: 8px;
        background: #ecf0f1;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 5px;
      }

      .pass-rate-fill {
        height: 100%;
        background: linear-gradient(90deg, #27ae60, #2ecc71);
        transition: width 0.3s ease;
      }

      .pass-rate-text {
        text-align: center;
        font-weight: 600;
        color: #27ae60;
      }

      .execution-details {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .detail {
        display: flex;
        justify-content: space-between;
      }

      .detail-label {
        font-weight: 600;
        color: #34495e;
      }

      .detail-value {
        color: #7f8c8d;
      }

      .filters {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }

      .filter-btn {
        padding: 8px 16px;
        border: 2px solid #bdc3c7;
        background: white;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
      }

      .filter-btn:hover {
        border-color: #3498db;
        color: #3498db;
      }

      .filter-btn.active {
        background: #3498db;
        border-color: #3498db;
        color: white;
      }

      .test-results {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .test-result {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        overflow: hidden;
        border-left: 4px solid #bdc3c7;
      }

      .test-result.passed { border-left-color: #27ae60; }
      .test-result.failed { border-left-color: #e74c3c; }
      .test-result.skipped { border-left-color: #f39c12; }
      .test-result.flaky { border-left-color: #9b59b6; }

      .test-header {
        display: flex;
        align-items: center;
        padding: 15px 20px;
      }

      .test-status {
        font-size: 20px;
        margin-right: 15px;
      }

      .test-info {
        flex: 1;
      }

      .test-title {
        font-size: 16px;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 5px;
      }

      .test-meta {
        display: flex;
        gap: 15px;
        font-size: 12px;
        color: #7f8c8d;
      }

      .test-file {
        font-family: monospace;
      }

      .test-duration {
        font-weight: 600;
      }

      .test-retry {
        color: #f39c12;
        font-weight: 600;
      }

      .error-details {
        padding: 15px 20px;
        background: #fdf2f2;
        border-top: 1px solid #fed7d7;
      }

      .error-message {
        font-weight: 600;
        color: #e53e3e;
        margin-bottom: 10px;
      }

      .error-stack {
        font-family: monospace;
        font-size: 12px;
        color: #718096;
        white-space: pre-wrap;
        background: #f7fafc;
        padding: 10px;
        border-radius: 4px;
        overflow-x: auto;
      }

      .attachments {
        padding: 15px 20px;
        background: #f8f9fa;
        border-top: 1px solid #e9ecef;
      }

      .attachments-title {
        font-weight: 600;
        margin-bottom: 10px;
        color: #495057;
      }

      .attachment {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
      }

      .attachment-name {
        font-family: monospace;
        font-size: 12px;
        color: #6c757d;
      }

      .attachment a {
        color: #007bff;
        text-decoration: none;
        font-size: 12px;
      }

      .attachment a:hover {
        text-decoration: underline;
      }

      @media (max-width: 768px) {
        .summary {
          grid-template-columns: 1fr;
        }
        
        .summary-stats {
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .test-meta {
          flex-direction: column;
          gap: 5px;
        }
      }
    `;
  }

  private getJavaScript(): string {
    return `
      function filterTests(status) {
        const testResults = document.querySelectorAll('.test-result');
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        // Update active filter button
        filterBtns.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Show/hide test results
        testResults.forEach(result => {
          if (status === 'all' || result.dataset.status === status) {
            result.style.display = 'block';
          } else {
            result.style.display = 'none';
          }
        });
      }
      
      // Add smooth scrolling to anchors
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
          });
        });
      });
    `;
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
