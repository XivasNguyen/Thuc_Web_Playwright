# 🚀 Setup Guide

This guide will help you set up the Playwright Test Automation Framework from scratch.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (version 18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (comes with Node.js) or **yarn**
   - Verify npm: `npm --version`
   - Or install yarn: `npm install -g yarn`

3. **Git**
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation: `git --version`

4. **Visual Studio Code** (recommended)
   - Download from [code.visualstudio.com](https://code.visualstudio.com/)
   - Install Playwright extension for better development experience

## Installation Steps

### 1. Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd playwright-test-framework

# Or if you're starting fresh
mkdir playwright-test-framework
cd playwright-test-framework
git init
```

### 2. Install Dependencies

```bash
# Install all project dependencies
npm install

# Or using yarn
yarn install
```

### 3. Install Playwright Browsers

```bash
# Install Playwright browsers and system dependencies
npx playwright install

# Install system dependencies (Linux/Mac)
npx playwright install-deps

# For specific browsers only
npx playwright install chromium firefox webkit
```

### 4. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your settings
nano .env  # or use your preferred editor
```

#### Environment Variables

Configure the following variables in your `.env` file:

```bash
# Application URL
BASE_URL=https://demo.nopcommerce.com

# Test Environment
ENVIRONMENT=staging

# Browser Configuration
BROWSER=chromium
HEADLESS=true

# Execution Configuration
WORKERS=4
TIMEOUT=30000
RETRIES=2

# Reporting Configuration
REPORT_OPEN=false
DEBUG_NETWORK=false

# CI/CD Configuration
CI=false
```

### 5. Verify Installation

```bash
# Run a simple test to verify setup
npm run test:smoke

# Check if all browsers are installed
npx playwright --version
```

## IDE Setup

### Visual Studio Code

1. **Install Extensions:**
   - Playwright Test for VSCode
   - TypeScript and JavaScript Language Features
   - ESLint
   - Prettier

2. **Configure Settings:**
   ```json
   {
     "playwright.reuseBrowser": true,
     "playwright.showTrace": true,
     "typescript.preferences.importModuleSpecifier": "relative"
   }
   ```

3. **Debug Configuration:**
   Create `.vscode/launch.json`:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Debug Playwright Tests",
         "type": "node",
         "request": "launch",
         "program": "${workspaceFolder}/node_modules/.bin/playwright",
         "args": ["test", "--debug"],
         "console": "integratedTerminal",
         "internalConsoleOptions": "neverOpen"
       }
     ]
   }
   ```

### IntelliJ IDEA / WebStorm

1. **Install Plugins:**
   - Node.js
   - TypeScript
   - Playwright

2. **Configure Run Configurations:**
   - Create new Node.js configuration
   - Set working directory to project root
   - Set JavaScript file to `node_modules/.bin/playwright`
   - Add arguments: `test`

## Project Structure Setup

If you're setting up the framework from scratch, create the following structure:

```
playwright-test-framework/
├── .github/
│   └── workflows/
│       └── playwright-tests.yml
├── src/
│   ├── config/
│   │   ├── environments.ts
│   │   └── test-config.ts
│   ├── data/
│   │   ├── TestDataFactory.ts
│   │   └── TestDataProvider.ts
│   ├── fixtures/
│   │   └── TestFixtures.ts
│   ├── pages/
│   │   ├── base/
│   │   │   └── BasePage.ts
│   │   ├── components/
│   │   │   ├── HeaderComponent.ts
│   │   │   └── FooterComponent.ts
│   │   └── [PageObjects].ts
│   ├── reporters/
│   │   └── CustomHtmlReporter.ts
│   └── utils/
│       ├── TestUtils.ts
│       ├── WaitUtils.ts
│       └── ReportUtils.ts
├── tests/
│   └── *.spec.ts
├── test-results/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

## Configuration Files

### 1. TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": [
    "src/**/*",
    "tests/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "test-results"
  ]
}
```

### 2. ESLint Configuration (`.eslintrc.js`)

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    '@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'no-console': 'warn'
  }
};
```

### 3. Prettier Configuration (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

## Docker Setup (Optional)

For containerized testing, create a `Dockerfile`:

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "test"]
```

And `docker-compose.yml`:

```yaml
version: '3.8'
services:
  playwright-tests:
    build: .
    environment:
      - CI=true
      - HEADLESS=true
    volumes:
      - ./test-results:/app/test-results
```

## Troubleshooting Setup Issues

### Common Problems and Solutions

1. **Browser Installation Fails**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Reinstall browsers
   npx playwright install --force
   ```

2. **Permission Errors (Linux/Mac)**
   ```bash
   # Fix permissions
   sudo chown -R $(whoami) ~/.cache/ms-playwright
   
   # Install system dependencies
   sudo npx playwright install-deps
   ```

3. **Network/Proxy Issues**
   ```bash
   # Configure npm proxy
   npm config set proxy http://proxy.company.com:8080
   npm config set https-proxy http://proxy.company.com:8080
   
   # Or set environment variables
   export HTTP_PROXY=http://proxy.company.com:8080
   export HTTPS_PROXY=http://proxy.company.com:8080
   ```

4. **TypeScript Compilation Errors**
   ```bash
   # Check TypeScript version
   npx tsc --version
   
   # Compile TypeScript
   npx tsc --noEmit
   ```

5. **Port Conflicts**
   ```bash
   # Check if ports are in use
   lsof -i :3000  # Replace with your port
   
   # Kill process using port
   kill -9 <PID>
   ```

## Verification Checklist

After setup, verify everything works:

- [ ] Node.js and npm are installed and working
- [ ] All dependencies are installed (`npm list`)
- [ ] Playwright browsers are installed (`npx playwright --version`)
- [ ] Environment file is configured (`.env` exists)
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] Linting passes (`npm run lint`)
- [ ] Sample test runs successfully (`npm run test:smoke`)
- [ ] Reports are generated (`test-results/` directory exists)

## Next Steps

Once setup is complete:

1. **Read the main README.md** for usage instructions
2. **Explore the test examples** in the `tests/` directory
3. **Run the full test suite** to see all features in action
4. **Start writing your own tests** using the provided patterns

## Getting Help

If you encounter issues during setup:

1. Check the [Troubleshooting](#troubleshooting-setup-issues) section
2. Review the [Playwright documentation](https://playwright.dev/)
3. Open an issue in the repository
4. Check existing issues for similar problems

---

**Setup Complete! 🎉**

You're now ready to start using the Playwright Test Automation Framework.
