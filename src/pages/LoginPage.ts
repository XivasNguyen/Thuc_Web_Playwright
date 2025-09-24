import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base/BasePage';
import { UserLoginData } from '../data/TestDataFactory';

/**
 * Login Page Object
 */
export class LoginPage extends BasePage {
  // Form elements
  private readonly emailField: Locator;
  private readonly passwordField: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly loginButton: Locator;

  // Links
  private readonly forgotPasswordLink: Locator;
  private readonly registerLink: Locator;

  // Messages
  private readonly errorMessage: Locator;
  private readonly validationSummary: Locator;
  private readonly fieldValidationErrors: Locator;

  // Page elements
  private readonly pageTitle: Locator;
  private readonly loginForm: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize form elements
    this.emailField = page.locator('#Email');
    this.passwordField = page.locator('#Password');
    this.rememberMeCheckbox = page.locator('#RememberMe');
    this.loginButton = page.locator('button[type="submit"]').filter({ hasText: 'Log in' });

    // Initialize links
    this.forgotPasswordLink = page.locator('a[href*="/passwordrecovery"]');
    this.registerLink = page.locator('a[href*="/register"]');

    // Initialize messages
    this.errorMessage = page.locator('.message-error');
    this.validationSummary = page.locator('.validation-summary-errors');
    this.fieldValidationErrors = page.locator('.field-validation-error');

    // Initialize page elements
    this.pageTitle = page.locator('h1');
    this.loginForm = page.locator('.login-form');
  }

  /**
   * Navigate to login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.navigateTo('/login');
    await this.waitForPageLoad();
  }

  /**
   * Fill login credentials
   */
  async fillLoginCredentials(email: string, password: string): Promise<void> {
    await this.fillField(this.emailField, email, { clear: true });
    await this.fillField(this.passwordField, password, { clear: true });
  }

  /**
   * Set remember me option
   */
  async setRememberMe(remember: boolean): Promise<void> {
    const isChecked = await this.rememberMeCheckbox.isChecked();
    if (remember && !isChecked) {
      await this.clickElement(this.rememberMeCheckbox);
    } else if (!remember && isChecked) {
      await this.clickElement(this.rememberMeCheckbox);
    }
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
  }

  /**
   * Click forgot password link
   */
  async clickForgotPasswordLink(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
    await this.waitForPageLoad();
  }

  /**
   * Click register link
   */
  async clickRegisterLink(): Promise<void> {
    await this.clickElement(this.registerLink);
    await this.waitForPageLoad();
  }

  /**
   * Perform complete login
   */
  async performLogin(loginData: UserLoginData): Promise<void> {
    await this.fillLoginCredentials(loginData.email, loginData.password);
    
    if (loginData.rememberMe !== undefined) {
      await this.setRememberMe(loginData.rememberMe);
    }
    
    await this.clickLoginButton();
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return await this.getElementText(this.errorMessage);
  }

  /**
   * Get validation errors
   */
  async getValidationErrors(): Promise<string[]> {
    const errors: string[] = [];
    
    if (await this.isElementVisible(this.validationSummary)) {
      const errorElements = await this.validationSummary.locator('li').all();
      for (const element of errorElements) {
        const text = await element.textContent();
        if (text) {
          errors.push(text.trim());
        }
      }
    }
    
    if (await this.isElementVisible(this.fieldValidationErrors)) {
      const fieldErrorElements = await this.fieldValidationErrors.all();
      for (const element of fieldErrorElements) {
        const text = await element.textContent();
        if (text) {
          errors.push(text.trim());
        }
      }
    }
    
    return errors;
  }

  /**
   * Check if login was successful
   */
  async isLoginSuccessful(): Promise<boolean> {
    // Check if we're redirected to home page or my account page
    const currentUrl = this.getCurrentUrl();
    return currentUrl.includes('/') && !currentUrl.includes('/login');
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Check if validation errors are displayed
   */
  async hasValidationErrors(): Promise<boolean> {
    return await this.isElementVisible(this.validationSummary) || 
           await this.isElementVisible(this.fieldValidationErrors);
  }

  /**
   * Verify login page is loaded
   */
  async verifyLoginPageIsLoaded(): Promise<void> {
    await this.verifyPageTitle('Welcome, Please Sign In!');
    await this.waitForElement(this.emailField);
    await this.waitForElement(this.passwordField);
    await this.waitForElement(this.loginButton);
    await this.waitForElement(this.forgotPasswordLink);
  }

  /**
   * Verify successful login
   */
  async verifySuccessfulLogin(): Promise<void> {
    const isSuccessful = await this.isLoginSuccessful();
    expect(isSuccessful).toBe(true);
  }

  /**
   * Verify login failed with specific error
   */
  async verifyLoginFailedWithError(expectedError: string): Promise<void> {
    const hasError = await this.isErrorMessageDisplayed();
    const hasValidationErrors = await this.hasValidationErrors();
    
    expect(hasError || hasValidationErrors).toBe(true);
    
    if (hasError) {
      const errorMessage = await this.getErrorMessage();
      expect(errorMessage.toLowerCase()).toContain(expectedError.toLowerCase());
    } else if (hasValidationErrors) {
      const validationErrors = await this.getValidationErrors();
      const hasExpectedError = validationErrors.some(error => 
        error.toLowerCase().includes(expectedError.toLowerCase())
      );
      expect(hasExpectedError).toBe(true);
    }
  }

  /**
   * Clear login form
   */
  async clearLoginForm(): Promise<void> {
    await this.emailField.clear();
    await this.passwordField.clear();
  }

  /**
   * Get current form values
   */
  async getCurrentFormValues(): Promise<{ email: string; password: string; rememberMe: boolean }> {
    return {
      email: await this.emailField.inputValue(),
      password: await this.passwordField.inputValue(),
      rememberMe: await this.rememberMeCheckbox.isChecked(),
    };
  }

  /**
   * Verify forgot password link navigation
   */
  async verifyForgotPasswordLinkNavigation(): Promise<void> {
    await this.clickForgotPasswordLink();
    await this.verifyCurrentUrl('/passwordrecovery');
  }

  /**
   * Verify register link navigation
   */
  async verifyRegisterLinkNavigation(): Promise<void> {
    await this.clickRegisterLink();
    await this.verifyCurrentUrl('/register');
  }

  /**
   * Submit form with Enter key
   */
  async submitFormWithEnterKey(email: string, password: string): Promise<void> {
    await this.fillLoginCredentials(email, password);
    await this.passwordField.press('Enter');
    await this.waitForPageLoad();
  }

  /**
   * Verify page elements are present
   */
  async verifyPageElements(): Promise<void> {
    await this.waitForElement(this.emailField);
    await this.waitForElement(this.passwordField);
    await this.waitForElement(this.rememberMeCheckbox);
    await this.waitForElement(this.loginButton);
    await this.waitForElement(this.forgotPasswordLink);
    await this.waitForElement(this.registerLink);
  }

  /**
   * Verify email field is focused on page load
   */
  async verifyEmailFieldIsFocused(): Promise<void> {
    const isEmailFieldFocused = await this.emailField.evaluate(el => el === document.activeElement);
    expect(isEmailFieldFocused).toBe(true);
  }
}
