# 🎭 Playwright Test Automation Framework

A streamlined, production-ready test automation framework built with **Playwright** and **TypeScript** for testing the nopCommerce demo store. This framework focuses on **10 critical test cases** covering essential e-commerce workflows with desktop browser support (Chromium, Firefox, WebKit).

## 🌟 Core Features

- **Page Object Model (POM)** - Clean, maintainable test architecture with base page classes
- **HTML Report Generation** - Comprehensive test reports with pass/fail status and execution summary
- **Failure Artifacts** - Automatic screenshots, traces, and console logs on test failures
- **Environment Configuration** - Support for multiple environments (dev, staging, prod)
- **Cloud Execution Support** - Ready for cloud-based test execution
- **CI/CD Integration** - GitHub Actions workflow included
- **Parallel Test Execution** - Fast test execution with configurable workers

## 🎯 Recent Improvements

- **Enhanced Test Data Management**: Implemented unique email generation using timestamps to prevent "email already exists" errors
- **Improved Page Object Selectors**: Updated registration page selectors to match actual nopCommerce demo site structure
- **Fixed Test Execution Issues**: Resolved duplicate method definitions and import statement conflicts
- **Better Error Handling**: Enhanced test failure reporting with detailed error messages and screenshots
- **ESLint Configuration Migration**: Migrated from deprecated `.eslintrc.js` to modern `eslint.config.js` format (ESLint v9)
- **TypeScript Lint Fixes**: Resolved 47 critical ESLint errors including unused parameters, duplicate methods, and empty object patterns
- **Code Quality Improvements**: Fixed unused imports, added proper parameter prefixing for unused variables, and improved type safety
- **Framework Simplification**: Removed performance monitoring and API testing functionality to focus on core UI testing capabilities
- **Core Requirements Focus**: Streamlined framework to include only the 7 essential requirements: POM, HTML reporting, failure artifacts, environment config, cloud execution, CI/CD, and parallel execution
- **Test Suite Optimization**: Reduced from 420 tests to exactly 10 critical test cases covering essential e-commerce workflows
- **Browser Configuration**: Removed mobile browser support, focusing on desktop browsers only (Chromium, Firefox, WebKit)
- **Simplified Test Structure**: Consolidated test scenarios into 5 focused test files with 2 test cases each
- **Streamlined CI/CD**: Simplified GitHub Actions workflow by removing fancy features (scheduled runs, matrix builds, report merging, GitHub Pages deployment, Slack notifications, performance monitoring)

## 🧪 Test Coverage (10 Critical Test Cases)

### 1. **User Registration (2 test cases)**
- ✅ Register a new account with valid data
- ✅ Handle registration validation errors (invalid email, password mismatch, etc.)

### 2. **Password Reset Workflow (2 test cases)**
- ✅ Request password reset for an existing user email
- ✅ Handle password reset validation (invalid email, empty fields)

### 3. **Product Search (2 test cases)**
- ✅ Search for products with valid search terms
- ✅ Handle empty or invalid search queries

### 4. **Product Discovery (2 test cases)**
- ✅ Browse products by category (e.g., Computers → Notebooks)
- ✅ Navigate category hierarchy and verify breadcrumbs

### 5. **Product Filtering & Sorting (2 test cases)**
- ✅ Sort products by price (low to high, high to low)
- ✅ Filter products by manufacturers and price range

**Total Test Executions**: 30 (10 test cases × 3 desktop browsers)

## 🏗️ Framework Architecture

```
src/
├── config/                 # Environment and test configurations
├── data/                   # Core test data factory
├── fixtures/               # Essential test fixtures
├── pages/                  # Page Object Model implementation
│   ├── base/              # Base page classes
│   └── *.ts              # Specific page objects (HomePage, CategoryPage, etc.)
├── reporters/             # Core HTML reporter
└── utils/                 # Essential reporting utilities
tests/                     # 5 Test specification files (10 test cases total)
├── user-registration.spec.ts      # User registration tests (2 cases)
├── password-reset.spec.ts         # Password reset tests (2 cases)
├── product-search.spec.ts         # Product search tests (2 cases)
├── product-discovery.spec.ts      # Product discovery tests (2 cases)
└── product-filtering-sorting.spec.ts # Filtering & sorting tests (2 cases)
test-results/              # Test execution artifacts
├── html-report/          # Standard HTML reports
├── screenshots/          # Failure screenshots
├── traces/               # Playwright traces
└── logs/                 # Console logs
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd playwright-test-framework
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Running Tests

#### Basic Test Execution
```bash
# Run all tests
npm run test

# Run tests in headed mode
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Run specific test file
npm run test tests/user-registration.spec.ts
```

#### Environment-Specific Testing
```bash
# Run tests against staging environment
npm run test:staging

# Run tests against production environment
npm run test:prod

# Run tests against development environment
npm run test:dev
```

#### Browser-Specific Testing
```bash
# Run tests on Chromium only
npm run test:chromium

# Run tests on Firefox only
npm run test:firefox

# Run tests on WebKit only
npm run test:webkit
```

#### Test Categories
```bash
# Run smoke tests (critical functionality)
npm run test:smoke

# Run regression tests (full test suite)
npm run test:regression

# Run mobile tests
npm run test:mobile
```

## 📋 Test Scenarios

The framework includes comprehensive test coverage for the nopCommerce demo store:

### 🔐 User Registration Tests
- **Valid user registration** with all required fields
- **Invalid email format** validation
- **Password strength** requirements
- **Duplicate email** handling
- **Form field validation** and error messages
- **Terms and conditions** acceptance

### 🔑 Password Reset Tests
- **Valid email** password reset flow
- **Invalid email** handling
- **Non-existent email** scenarios
- **Email format validation**
- **Success message** verification

### 🔍 Product Search and Discovery Tests
- **Product search** functionality with various keywords
- **Category browsing** and navigation
- **Product filtering** by price, manufacturer, specifications
- **Product sorting** by price, name, popularity
- **Search results validation** and accuracy
- **Empty search** and no results handling
- **Case-insensitive search** functionality

### 🛒 Shopping Cart and Checkout Tests
- **Add products to cart** from various pages
- **Update product quantities** in cart
- **Remove products** from cart
- **Cart persistence** across sessions
- **Discount coupon** application
- **Gift card** functionality
- **Shipping estimation**
- **Checkout process** initiation
- **Terms of service** validation

## 🔧 Configuration

### Environment Configuration

The framework supports multiple environments through configuration files:

```typescript
// src/config/environments.ts
export const environments = {
  dev: {
    baseUrl: 'https://dev.nopcommerce.com',
    timeout: 30000,
    retries: 2
  },
  staging: {
    baseUrl: 'https://staging.nopcommerce.com',
    timeout: 45000,
    retries: 1
  },
  prod: {
    baseUrl: 'https://demo.nopcommerce.com',
    timeout: 60000,
    retries: 0
  }
};
```

### Test Configuration

Customize test behavior through environment variables:

```bash
# .env file
BASE_URL=https://demo.nopcommerce.com
ENVIRONMENT=staging
BROWSER=chromium
HEADLESS=true
WORKERS=4
TIMEOUT=30000
RETRIES=2
REPORT_OPEN=false
DEBUG_NETWORK=false
```

## 📊 Reporting

The framework provides multiple reporting options:

### 1. Standard HTML Report
- Interactive test results with filtering
- Screenshots and traces for failed tests
- Test execution timeline
- Browser and environment details

### 2. Custom HTML Report
- Enhanced visual design
- Test execution summary with metrics
- Failure analysis with artifacts

### 3. JSON Report
- Machine-readable test results
- Integration with external tools
- Detailed test metadata

### 4. JUnit Report
- CI/CD integration support
- Test result publishing
- Build status indicators

### Viewing Reports

```bash
# Open HTML report
npm run report:open

# Generate custom report
npm run report:custom

# View test results summary
npm run report:summary
```

## 🚀 CI/CD Integration

### GitHub Actions

The framework includes a comprehensive GitHub Actions workflow:

```yaml
# .github/workflows/playwright-tests.yml
- Automated test execution on push/PR
- Multi-browser testing matrix
- Environment-specific test runs
- Artifact collection and storage
- Test result publishing
- Slack notifications on failure
- GitHub Pages deployment for reports
```

### Running in CI/CD

```bash
# Set environment variables in your CI/CD system
CI=true
ENVIRONMENT=staging
BROWSER=chromium
HEADLESS=true
WORKERS=2
```

## 🧪 Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '../src/fixtures/TestFixtures';

test.describe('Feature Name', () => {
  test('should perform specific action', async ({ page, headerComponent }) => {
    // Arrange
    await page.goto('/');

    // Act
    await headerComponent.clickLogin();

    // Assert
    await expect(page).toHaveURL(/.*login.*/);
  });
});
```

### Using Page Objects

```typescript
test('should add product to cart', async ({ page }) => {
  const productPage = new ProductDetailsPage(page);
  const cartPage = new ShoppingCartPage(page);

  await productPage.navigateToProduct('/product-url');
  await productPage.addToCart(2);
  await productPage.verifyProductAddedToCart();

  await cartPage.navigateToShoppingCart();
  await cartPage.verifyCartContainsItem('Product Name');
});
```

### Data-Driven Testing

```typescript
const testData = TestDataProvider.getTestData('user_registration', 'Valid User');

test('should register user with valid data', async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  await registrationPage.navigateToRegistration();
  await registrationPage.fillRegistrationForm(testData);
  await registrationPage.submitRegistration();
  await registrationPage.verifyRegistrationSuccess();
});
```

## 🛠️ Development Guidelines

### Code Standards

- **TypeScript** strict mode enabled
- **ESLint** for code quality
- **Prettier** for code formatting
- **Conventional commits** for version control
- **Page Object Model** for test organization

### Best Practices

1. **Page Objects**
   - Keep page objects focused and cohesive
   - Use descriptive method names
   - Implement proper waiting strategies
   - Add comprehensive error handling

2. **Test Data**
   - Use data factories for test data generation
   - Avoid hardcoded values in tests
   - Implement data cleanup strategies
   - Support multiple test environments

3. **Assertions**
   - Use meaningful assertion messages
   - Implement custom matchers when needed
   - Verify both positive and negative scenarios


4. **Error Handling**
   - Implement retry mechanisms for flaky tests
   - Capture comprehensive failure artifacts
   - Use proper exception handling
   - Log meaningful error messages

### Adding New Tests

1. **Create Page Objects** for new pages
2. **Add Test Data** to data providers
3. **Write Test Specifications** following existing patterns
4. **Update Documentation** with new test scenarios
5. **Add CI/CD Integration** for new test suites

## 🔍 Debugging

### Local Debugging

```bash
# Run tests in debug mode
npm run test:debug

# Run specific test with debugging
npx playwright test tests/user-registration.spec.ts --debug

# Run tests with trace viewer
npm run test:trace
```

### Analyzing Failures

1. **Screenshots** - Automatic capture on test failure
2. **Traces** - Step-by-step execution recording
3. **Videos** - Full test execution recording
4. **Console Logs** - Browser console output
5. **Network Logs** - HTTP request/response data

### Common Issues

- **Element not found**: Check selectors and waiting strategies
- **Timeout errors**: Increase timeout values or improve waiting
- **Flaky tests**: Implement proper synchronization
- **Environment issues**: Verify configuration and connectivity



## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Write** tests for new functionality
4. **Ensure** all tests pass
5. **Submit** a pull request

### Development Setup

```bash
# Install development dependencies
npm install

# Run linting
npm run lint

# Run formatting
npm run format

# Run type checking
npm run type-check
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Test Data Management](https://playwright.dev/docs/test-fixtures)
- [CI/CD Best Practices](https://playwright.dev/docs/ci)

## 🐛 Troubleshooting

### Common Setup Issues

1. **Browser installation fails**
   ```bash
   npx playwright install --force
   ```

2. **Permission errors on Linux/Mac**
   ```bash
   sudo npx playwright install-deps
   ```

3. **Network connectivity issues**
   ```bash
   # Configure proxy if needed
   export HTTP_PROXY=http://proxy.company.com:8080
   export HTTPS_PROXY=http://proxy.company.com:8080
   ```

### Test Execution Issues

1. **Tests timing out**
   - Increase timeout values in configuration
   - Check network connectivity
   - Verify application responsiveness

2. **Flaky test failures**
   - Implement proper waiting strategies
   - Use stable selectors
   - Add retry mechanisms

3. **Environment-specific failures**
   - Verify environment configuration
   - Check application availability
   - Validate test data

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Playwright Team** for the excellent testing framework
- **Microsoft** for TypeScript and development tools
- **nopCommerce** for providing the demo application
- **Open Source Community** for inspiration and best practices

---

**Happy Testing! 🎭✨**

For questions, issues, or contributions, please open an issue or submit a pull request.
