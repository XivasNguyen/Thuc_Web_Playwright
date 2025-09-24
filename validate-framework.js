const fs = require('fs');
const path = require('path');

/**
 * Framework Validation Script
 * Validates the structure and completeness of the Playwright Test Automation Framework
 */

console.log('🎭 Playwright Test Automation Framework Validation');
console.log('='.repeat(60));

let validationResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  issues: []
};

function logResult(test, status, message) {
  const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${emoji} ${test}: ${message}`);
  
  if (status === 'PASS') {
    validationResults.passed++;
  } else if (status === 'FAIL') {
    validationResults.failed++;
    validationResults.issues.push(`${test}: ${message}`);
  } else {
    validationResults.warnings++;
  }
}

function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  logResult(
    description,
    exists ? 'PASS' : 'FAIL',
    exists ? 'File exists' : `File missing: ${filePath}`
  );
  return exists;
}

function checkDirectoryExists(dirPath, description) {
  const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  logResult(
    description,
    exists ? 'PASS' : 'FAIL',
    exists ? 'Directory exists' : `Directory missing: ${dirPath}`
  );
  return exists;
}

function checkPackageJson() {
  console.log('\n📦 Package Configuration');
  console.log('-'.repeat(30));
  
  if (!checkFileExists('package.json', 'Package.json exists')) {
    return;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Check required dependencies
    const requiredDeps = ['@playwright/test', 'dotenv'];
    const requiredDevDeps = ['@typescript-eslint/eslint-plugin', '@typescript-eslint/parser', 'eslint', 'prettier'];
    
    requiredDeps.forEach(dep => {
      const exists = packageJson.dependencies && packageJson.dependencies[dep] ||
                    packageJson.devDependencies && packageJson.devDependencies[dep];
      logResult(
        `Dependency: ${dep}`,
        exists ? 'PASS' : 'FAIL',
        exists ? 'Installed' : 'Missing'
      );
    });
    
    requiredDevDeps.forEach(dep => {
      const exists = packageJson.devDependencies && packageJson.devDependencies[dep];
      logResult(
        `Dev Dependency: ${dep}`,
        exists ? 'PASS' : 'WARN',
        exists ? 'Installed' : 'Missing (optional)'
      );
    });
    
    // Check scripts
    const requiredScripts = ['test', 'test:headed', 'test:debug'];
    requiredScripts.forEach(script => {
      const exists = packageJson.scripts && packageJson.scripts[script];
      logResult(
        `Script: ${script}`,
        exists ? 'PASS' : 'FAIL',
        exists ? 'Configured' : 'Missing'
      );
    });
    
  } catch (error) {
    logResult('Package.json parsing', 'FAIL', `Invalid JSON: ${error.message}`);
  }
}

function checkProjectStructure() {
  console.log('\n🏗️ Project Structure');
  console.log('-'.repeat(30));
  
  // Check main directories
  const requiredDirs = [
    'src',
    'src/config',
    'src/data',
    'src/fixtures',
    'src/pages',
    'src/pages/base',
    'src/pages/components',
    'src/utils',
    'src/reporters',
    'tests'
  ];
  
  requiredDirs.forEach(dir => {
    checkDirectoryExists(dir, `Directory: ${dir}`);
  });
  
  // Check configuration files
  const configFiles = [
    'playwright.config.ts',
    'tsconfig.json',
    '.env.example',
    '.gitignore'
  ];
  
  configFiles.forEach(file => {
    checkFileExists(file, `Config: ${file}`);
  });
}

function checkPageObjects() {
  console.log('\n📄 Page Objects');
  console.log('-'.repeat(30));
  
  const pageObjects = [
    'src/pages/base/BasePage.ts',
    'src/pages/components/HeaderComponent.ts',
    'src/pages/components/FooterComponent.ts',
    'src/pages/RegistrationPage.ts',
    'src/pages/LoginPage.ts',
    'src/pages/PasswordResetPage.ts',
    'src/pages/SearchResultsPage.ts',
    'src/pages/CategoryPage.ts',
    'src/pages/ProductDetailsPage.ts',
    'src/pages/ShoppingCartPage.ts'
  ];
  
  pageObjects.forEach(page => {
    checkFileExists(page, `Page Object: ${path.basename(page)}`);
  });
}

function checkTestFiles() {
  console.log('\n🧪 Test Files');
  console.log('-'.repeat(30));
  
  const testFiles = [
    'tests/user-registration.spec.ts',
    'tests/password-reset.spec.ts',
    'tests/product-search-discovery.spec.ts',
    'tests/shopping-cart-checkout.spec.ts'
  ];
  
  testFiles.forEach(test => {
    checkFileExists(test, `Test: ${path.basename(test)}`);
  });
}

function checkUtilities() {
  console.log('\n🛠️ Utilities');
  console.log('-'.repeat(30));
  
  const utilities = [
    'src/utils/TestUtils.ts',
    'src/utils/WaitUtils.ts',
    'src/utils/ReportUtils.ts',
    'src/data/TestDataFactory.ts',
    'src/data/TestDataProvider.ts',
    'src/fixtures/TestFixtures.ts',
    'src/config/environments.ts',
    'src/config/test-config.ts'
  ];
  
  utilities.forEach(util => {
    checkFileExists(util, `Utility: ${path.basename(util)}`);
  });
}

function checkReporting() {
  console.log('\n📊 Reporting');
  console.log('-'.repeat(30));
  
  checkFileExists('src/reporters/CustomHtmlReporter.ts', 'Custom HTML Reporter');
  
  // Check if test-results directory structure can be created
  const reportDirs = [
    'test-results',
    'test-results/html-report',
    'test-results/screenshots',
    'test-results/traces',
    'test-results/logs'
  ];
  
  reportDirs.forEach(dir => {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      logResult(`Report Directory: ${dir}`, 'PASS', 'Can be created');
    } catch (error) {
      logResult(`Report Directory: ${dir}`, 'FAIL', `Cannot create: ${error.message}`);
    }
  });
}

function checkCICD() {
  console.log('\n🚀 CI/CD Integration');
  console.log('-'.repeat(30));
  
  checkFileExists('.github/workflows/playwright-tests.yml', 'GitHub Actions Workflow');
  
  // Check documentation
  const docs = ['README.md', 'SETUP.md', 'CONTRIBUTING.md'];
  docs.forEach(doc => {
    checkFileExists(doc, `Documentation: ${doc}`);
  });
}

function checkFileContent() {
  console.log('\n📝 Content Validation');
  console.log('-'.repeat(30));
  
  // Check if key files have content
  const filesToCheck = [
    'src/pages/base/BasePage.ts',
    'src/fixtures/TestFixtures.ts',
    'playwright.config.ts'
  ];
  
  filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const hasContent = content.trim().length > 100; // Arbitrary minimum
      logResult(
        `Content: ${path.basename(file)}`,
        hasContent ? 'PASS' : 'WARN',
        hasContent ? 'Has substantial content' : 'File seems empty or minimal'
      );
    }
  });
}

function generateSummary() {
  console.log('\n📋 Validation Summary');
  console.log('='.repeat(60));
  
  const total = validationResults.passed + validationResults.failed + validationResults.warnings;
  const passRate = total > 0 ? ((validationResults.passed / total) * 100).toFixed(1) : 0;
  
  console.log(`✅ Passed: ${validationResults.passed}`);
  console.log(`❌ Failed: ${validationResults.failed}`);
  console.log(`⚠️  Warnings: ${validationResults.warnings}`);
  console.log(`📊 Pass Rate: ${passRate}%`);
  
  if (validationResults.failed > 0) {
    console.log('\n🚨 Critical Issues:');
    validationResults.issues.forEach(issue => {
      console.log(`   • ${issue}`);
    });
  }
  
  console.log('\n🎯 Framework Status:');
  if (validationResults.failed === 0) {
    console.log('✅ Framework is ready for use!');
  } else if (validationResults.failed < 5) {
    console.log('⚠️  Framework has minor issues but is mostly functional');
  } else {
    console.log('❌ Framework has significant issues that need to be addressed');
  }
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Fix any critical issues listed above');
  console.log('2. Run: npm install (if dependencies are missing)');
  console.log('3. Run: npx playwright install (to install browsers)');
  console.log('4. Run: npm run test (to execute tests)');
  console.log('5. Check test results in test-results/ directory');
}

// Run all validations
function runValidation() {
  try {
    checkPackageJson();
    checkProjectStructure();
    checkPageObjects();
    checkTestFiles();
    checkUtilities();
    checkReporting();
    checkCICD();
    checkFileContent();
    generateSummary();
  } catch (error) {
    console.error('❌ Validation failed with error:', error.message);
    process.exit(1);
  }
}

// Execute validation
runValidation();
