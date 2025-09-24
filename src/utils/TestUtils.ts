import { Page } from '@playwright/test';

/**
 * Utility functions for test automation
 */
export class TestUtils {
  /**
   * Generate random email address
   */
  static generateRandomEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}.${timestamp}.${random}@example.com`;
  }

  /**
   * Generate random string
   */
  static generateRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random number within range
   */
  static generateRandomNumber(min: number = 1, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate random phone number
   */
  static generateRandomPhoneNumber(): string {
    const areaCode = this.generateRandomNumber(200, 999);
    const exchange = this.generateRandomNumber(200, 999);
    const number = this.generateRandomNumber(1000, 9999);
    return `+1${areaCode}${exchange}${number}`;
  }

  /**
   * Generate random password
   */
  static generateRandomPassword(length: number = 12): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    
    let password = '';
    
    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Wait for specified time
   */
  static async wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * Format currency
   */
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  /**
   * Parse price from string
   */
  static parsePrice(priceString: string): number {
    const cleanPrice = priceString.replace(/[^0-9.,]/g, '');
    return parseFloat(cleanPrice.replace(',', ''));
  }

  /**
   * Get current timestamp
   */
  static getCurrentTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  /**
   * Get current date in format YYYY-MM-DD
   */
  static getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Get future date
   */
  static getFutureDate(daysFromNow: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Generate test data for user registration
   */
  static generateUserData() {
    return {
      firstName: `Test${this.generateRandomString(5)}`,
      lastName: `User${this.generateRandomString(5)}`,
      email: this.generateRandomEmail('testuser'),
      password: this.generateRandomPassword(),
      company: `Test Company ${this.generateRandomNumber(1, 1000)}`,
      phone: this.generateRandomPhoneNumber(),
      dateOfBirth: {
        day: this.generateRandomNumber(1, 28),
        month: this.generateRandomNumber(1, 12),
        year: this.generateRandomNumber(1950, 2000),
      },
    };
  }

  /**
   * Generate test data for address
   */
  static generateAddressData() {
    return {
      firstName: `Test${this.generateRandomString(5)}`,
      lastName: `User${this.generateRandomString(5)}`,
      email: this.generateRandomEmail('address'),
      company: `Test Company ${this.generateRandomNumber(1, 1000)}`,
      country: 'United States',
      state: 'California',
      city: `Test City ${this.generateRandomNumber(1, 100)}`,
      address1: `${this.generateRandomNumber(100, 9999)} Test Street`,
      address2: `Apt ${this.generateRandomNumber(1, 100)}`,
      zipCode: `${this.generateRandomNumber(10000, 99999)}`,
      phone: this.generateRandomPhoneNumber(),
      fax: this.generateRandomPhoneNumber(),
    };
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeTimestampedScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = this.getCurrentTimestamp();
    await page.screenshot({
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true,
    });
  }

  /**
   * Scroll to element smoothly
   */
  static async smoothScrollToElement(page: Page, selector: string): Promise<void> {
    await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, selector);
    await this.wait(1000); // Wait for smooth scroll to complete
  }

  /**
   * Get random item from array
   */
  static getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Shuffle array
   */
  static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Remove special characters from string
   */
  static removeSpecialCharacters(str: string): string {
    return str.replace(/[^a-zA-Z0-9\s]/g, '');
  }

  /**
   * Capitalize first letter
   */
  static capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Convert string to slug
   */
  static stringToSlug(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Check if string contains only numbers
   */
  static isNumeric(str: string): boolean {
    return /^\d+$/.test(str);
  }

  /**
   * Generate random boolean
   */
  static randomBoolean(): boolean {
    return Math.random() < 0.5;
  }

  /**
   * Get environment variable with default value
   */
  static getEnvVar(name: string, defaultValue: string = ''): string {
    return process.env[name] || defaultValue;
  }

  /**
   * Log test step
   */
  static logStep(step: string): void {
    console.log(`🔍 Test Step: ${step}`);
  }

  /**
   * Log test info
   */
  static logInfo(info: string): void {
    console.log(`ℹ️  Info: ${info}`);
  }

  /**
   * Log test warning
   */
  static logWarning(warning: string): void {
    console.log(`⚠️  Warning: ${warning}`);
  }

  /**
   * Log test error
   */
  static logError(error: string): void {
    console.log(`❌ Error: ${error}`);
  }
}
