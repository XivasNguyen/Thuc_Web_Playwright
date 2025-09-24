/**
 * Test configuration and constants
 */

export const TEST_CONFIG = {
  // Timeouts
  DEFAULT_TIMEOUT: 30000,
  NAVIGATION_TIMEOUT: 60000,
  API_TIMEOUT: 10000,
  
  // Retry settings
  DEFAULT_RETRIES: 2,
  FLAKY_TEST_RETRIES: 3,
  
  // Screenshot settings
  SCREENSHOT_MODE: 'only-on-failure' as const,
  FULL_PAGE_SCREENSHOTS: true,
  
  // Video settings
  VIDEO_MODE: 'retain-on-failure' as const,
  
  // Trace settings
  TRACE_MODE: 'on-first-retry' as const,
  
  // Browser settings
  HEADLESS: process.env.CI ? true : false,
  SLOW_MO: process.env.CI ? 0 : 100,
  
  // Test data
  TEST_USER: {
    EMAIL: 'test.user@example.com',
    PASSWORD: 'TestPassword123!',
    FIRST_NAME: 'Test',
    LAST_NAME: 'User',
    COMPANY: 'Test Company',
    PHONE: '+1234567890',
  },
  
  // URLs
  URLS: {
    HOME: '/',
    REGISTER: '/register',
    LOGIN: '/login',
    FORGOT_PASSWORD: '/passwordrecovery',
    COMPUTERS: '/computers',
    NOTEBOOKS: '/computers/notebooks',
    CART: '/cart',
    CHECKOUT: '/checkout',
  },
  
  // Selectors (common ones)
  SELECTORS: {
    LOADING_SPINNER: '.loading',
    ERROR_MESSAGE: '.message-error',
    SUCCESS_MESSAGE: '.message-success',
    VALIDATION_ERROR: '.field-validation-error',
  },
} as const;

export type TestConfig = typeof TEST_CONFIG;
