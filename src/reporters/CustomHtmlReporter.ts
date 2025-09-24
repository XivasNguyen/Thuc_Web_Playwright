import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Core HTML Reporter for test execution summary
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

  onBegin(_config: any, suite: any) {
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
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff; }
        .summary-card.passed { border-left-color: #28a745; }
        .summary-card.failed { border-left-color: #dc3545; }
        .summary-card.skipped { border-left-color: #ffc107; }
        .summary-card h3 { margin: 0 0 10px 0; font-size: 2em; }
        .summary-card p { margin: 0; color: #666; }
        .test-results { margin-top: 30px; }
        .test-item { padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #ddd; }
        .test-item.passed { background: #d4edda; border-left-color: #28a745; }
        .test-item.failed { background: #f8d7da; border-left-color: #dc3545; }
        .test-item.skipped { background: #fff3cd; border-left-color: #ffc107; }
        .test-title { font-weight: bold; margin-bottom: 5px; }
        .test-meta { font-size: 0.9em; color: #666; }
        .timestamp { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Test Execution Report</h1>
            <p>Generated on ${this.endTime.toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>${totalTests}</h3>
                <p>Total Tests</p>
            </div>
            <div class="summary-card passed">
                <h3>${passedTests}</h3>
                <p>Passed</p>
            </div>
            <div class="summary-card failed">
                <h3>${failedTests}</h3>
                <p>Failed</p>
            </div>
            <div class="summary-card skipped">
                <h3>${skippedTests}</h3>
                <p>Skipped</p>
            </div>
            <div class="summary-card">
                <h3>${passRate}%</h3>
                <p>Pass Rate</p>
            </div>
            <div class="summary-card">
                <h3>${Math.round(duration / 1000)}s</h3>
                <p>Duration</p>
            </div>
        </div>
        
        <div class="test-results">
            <h2>Test Results</h2>
            ${this.testResults.map(({ test, result }) => `
                <div class="test-item ${result.status}">
                    <div class="test-title">${test.title}</div>
                    <div class="test-meta">
                        Status: ${result.status.toUpperCase()} | 
                        Duration: ${result.duration}ms | 
                        File: ${path.basename(test.location.file)}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="timestamp">
            <p>Report generated at ${this.endTime.toISOString()}</p>
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync(this.reportPath, html);
  }
}
