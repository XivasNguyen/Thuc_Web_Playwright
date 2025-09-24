# 🤝 Contributing to Playwright Test Automation Framework

Thank you for your interest in contributing to this project! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## 📜 Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow:

- **Be respectful** and inclusive in all interactions
- **Be constructive** when providing feedback
- **Be patient** with newcomers and questions
- **Focus on the code**, not the person
- **Help create a welcoming environment** for everyone

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

1. **Node.js 18+** installed
2. **Git** configured with your credentials
3. **IDE** set up (VS Code recommended)
4. **Basic knowledge** of TypeScript and Playwright

### Fork and Clone

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/playwright-test-framework.git
   cd playwright-test-framework
   ```

3. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/playwright-test-framework.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   npx playwright install
   ```

## 🔄 Development Workflow

### Branch Strategy

1. **Create a feature branch** from `main`:
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards
3. **Test your changes** thoroughly
4. **Commit your changes** with conventional commits
5. **Push to your fork** and create a pull request

### Conventional Commits

Use conventional commit messages:

```
type(scope): description

feat(pages): add new product details page object
fix(tests): resolve flaky test in user registration
docs(readme): update installation instructions
test(cart): add tests for cart persistence
refactor(utils): improve error handling in TestUtils
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `style`: Code style changes
- `perf`: Performance improvements
- `ci`: CI/CD changes

## 📝 Coding Standards

### TypeScript Guidelines

1. **Use strict TypeScript**:
   ```typescript
   // Good
   function getUserData(userId: string): Promise<UserData> {
     return fetchUser(userId);
   }

   // Bad
   function getUserData(userId: any): any {
     return fetchUser(userId);
   }
   ```

2. **Prefer interfaces over types** for object shapes:
   ```typescript
   // Good
   interface UserData {
     id: string;
     name: string;
     email: string;
   }

   // Acceptable for unions
   type Status = 'pending' | 'completed' | 'failed';
   ```

3. **Use meaningful names**:
   ```typescript
   // Good
   const isUserLoggedIn = await headerComponent.isUserLoggedIn();
   
   // Bad
   const flag = await headerComponent.check();
   ```

### Page Object Model Guidelines

1. **Keep page objects focused**:
   ```typescript
   // Good - focused on login functionality
   export class LoginPage extends BasePage {
     async login(email: string, password: string): Promise<void> {
       await this.fillEmail(email);
       await this.fillPassword(password);
       await this.clickLoginButton();
     }
   }
   ```

2. **Use descriptive method names**:
   ```typescript
   // Good
   async verifyRegistrationSuccess(): Promise<void>
   async fillRegistrationForm(userData: UserData): Promise<void>
   
   // Bad
   async check(): Promise<void>
   async fill(data: any): Promise<void>
   ```

3. **Implement proper waiting strategies**:
   ```typescript
   // Good
   async clickSubmitButton(): Promise<void> {
     await this.waitForElement(this.submitButton);
     await this.clickElement(this.submitButton);
     await this.waitForPageLoad();
   }
   ```

### Test Writing Guidelines

1. **Follow AAA pattern** (Arrange, Act, Assert):
   ```typescript
   test('should register user successfully', async ({ page }) => {
     // Arrange
     const registrationPage = new RegistrationPage(page);
     const userData = TestDataFactory.createValidUserData();
     
     // Act
     await registrationPage.navigateToRegistration();
     await registrationPage.fillRegistrationForm(userData);
     await registrationPage.submitRegistration();
     
     // Assert
     await registrationPage.verifyRegistrationSuccess();
   });
   ```

2. **Use descriptive test names**:
   ```typescript
   // Good
   test('should display error message for invalid email format')
   test('should successfully add product to cart from search results')
   
   // Bad
   test('test login')
   test('cart test')
   ```

3. **Group related tests**:
   ```typescript
   test.describe('User Registration', () => {
     test.describe('Valid Registration', () => {
       test('should register with all required fields', async () => {});
       test('should register with optional fields', async () => {});
     });
     
     test.describe('Invalid Registration', () => {
       test('should reject invalid email format', async () => {});
       test('should reject weak password', async () => {});
     });
   });
   ```

## 🧪 Testing Guidelines

### Test Categories

1. **Unit Tests** - Test individual functions/methods
2. **Integration Tests** - Test page object interactions
3. **End-to-End Tests** - Test complete user workflows
4. **Performance Tests** - Test application performance
5. **Visual Tests** - Test UI appearance (if applicable)

### Test Data Management

1. **Use test data factories**:
   ```typescript
   // Good
   const userData = TestDataFactory.createValidUserData();
   const invalidUserData = TestDataFactory.createInvalidUserData();
   
   // Bad
   const userData = {
     firstName: 'John',
     lastName: 'Doe',
     email: 'john@example.com'
   };
   ```

2. **Avoid hardcoded values**:
   ```typescript
   // Good
   const searchTerm = TestDataProvider.getSearchTerm('electronics');
   
   // Bad
   const searchTerm = 'laptop';
   ```

### Running Tests

Before submitting changes:

```bash
# Run all tests
npm run test

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run formatting
npm run format

# Run specific test categories
npm run test:smoke
npm run test:regression
```

## 📚 Documentation

### Code Documentation

1. **Document complex functions**:
   ```typescript
   /**
    * Waits for element to be visible and clickable, then performs click
    * @param element - The element to click
    * @param options - Click options including timeout and position
    * @returns Promise that resolves when click is completed
    */
   async clickElement(element: Locator, options?: ClickOptions): Promise<void> {
     // Implementation
   }
   ```

2. **Update README** for new features
3. **Add inline comments** for complex logic
4. **Document configuration changes**

### Test Documentation

1. **Add test descriptions**:
   ```typescript
   test('should validate email format during registration', async ({ page }) => {
     // Test validates that the registration form properly checks
     // email format and displays appropriate error messages
   });
   ```

2. **Document test data requirements**
3. **Explain complex test scenarios**

## 🔍 Pull Request Process

### Before Submitting

1. **Ensure all tests pass**:
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

2. **Update documentation** if needed
3. **Add tests** for new functionality
4. **Follow commit message conventions**

### Pull Request Template

When creating a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Testing
- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project standards
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** in different environments
4. **Documentation review**
5. **Approval** and merge

## 🐛 Issue Reporting

### Bug Reports

Include the following information:

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10, macOS 12, Ubuntu 20.04]
- Node.js version: [e.g., 18.17.0]
- Browser: [e.g., Chrome 115, Firefox 116]
- Framework version: [e.g., 1.2.0]

## Additional Context
Screenshots, logs, or other relevant information
```

### Feature Requests

```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other approaches you've considered

## Additional Context
Any other relevant information
```

## 🏆 Recognition

Contributors will be recognized in:

- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page

## 📞 Getting Help

If you need help:

1. **Check existing documentation**
2. **Search existing issues**
3. **Ask in discussions**
4. **Contact maintainers**

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing! 🎉**

Your contributions help make this framework better for everyone.
