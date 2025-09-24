import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base/BasePage';

/**
 * Password Reset Page Object
 */
export class PasswordResetPage extends BasePage {
  // Form elements
  private readonly emailField: Locator;
  private readonly recoverButton: Locator;
  private readonly backToLoginLink: Locator;

  // Messages
  private readonly successMessage: Locator;
  private readonly errorMessage: Locator;
  private readonly validationError: Locator;

  // Page elements
  private readonly pageTitle: Locator;
  private readonly instructionText: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize form elements
    this.emailField = page.locator('#Email');
    this.recoverButton = page.locator('button[type="submit"]').filter({ hasText: 'Recover' });
    this.backToLoginLink = page.locator('a[href*="/login"]');

    // Initialize messages
    this.successMessage = page.locator('.result');
    this.errorMessage = page.locator('.message-error');
    this.validationError = page.locator('.field-validation-error');

    // Initialize page elements
    this.pageTitle = page.locator('h1');
    this.instructionText = page.locator('.page-body');
  }

  /**
   * Navigate to password recovery page
   */
  async navigateToPasswordRecoveryPage(): Promise<void> {
    await this.navigateTo('/passwordrecovery');
    await this.waitForPageLoad();
  }

  /**
   * Fill email field
   */
  async fillEmailField(email: string): Promise<void> {
    await this.fillField(this.emailField, email, { clear: true });
  }

  /**
   * Click recover button
   */
  async clickRecoverButton(): Promise<void> {
    await this.clickElement(this.recoverButton);
    await this.waitForPageLoad();
  }

  /**
   * Click back to login link
   */
  async clickBackToLogin(): Promise<void> {
    await this.clickElement(this.backToLoginLink);
    await this.waitForPageLoad();
  }

  /**
   * Submit password recovery request
   */
  async submitPasswordRecoveryRequest(email: string): Promise<void> {
    await this.fillEmailField(email);
    await this.clickRecoverButton();
  }

  /**
   * Get success message
   */
  async getSuccessMessage(): Promise<string> {
    await this.waitForElement(this.successMessage);
    return await this.getElementText(this.successMessage);
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return await this.getElementText(this.errorMessage);
  }

  /**
   * Get validation error
   */
  async getValidationError(): Promise<string> {
    await this.waitForElement(this.validationError);
    return await this.getElementText(this.validationError);
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.getElementText(this.pageTitle);
  }

  /**
   * Get instruction text
   */
  async getInstructionText(): Promise<string> {
    return await this.getElementText(this.instructionText);
  }

  /**
   * Check if success message is displayed
   */
  async isSuccessMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.successMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Check if validation error is displayed
   */
  async isValidationErrorDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.validationError);
  }

  /**
   * Verify password recovery page is loaded
   */
  async verifyPasswordRecoveryPageIsLoaded(): Promise<void> {
    await this.verifyPageTitle('Password recovery');
    await this.waitForElement(this.emailField);
    await this.waitForElement(this.recoverButton);
    
    const pageTitle = await this.getPageTitle();
    expect(pageTitle.toLowerCase()).toContain('password recovery');
  }

  /**
   * Verify password recovery request was successful
   */
  async verifyPasswordRecoveryRequestSuccessful(): Promise<void> {
    await this.waitForElement(this.successMessage);
    const message = await this.getSuccessMessage();
    expect(message.toLowerCase()).toContain('email with instructions has been sent');
  }

  /**
   * Verify password recovery request failed with specific error
   */
  async verifyPasswordRecoveryRequestFailedWithError(expectedError: string): Promise<void> {
    const hasValidationError = await this.isValidationErrorDisplayed();
    const hasErrorMessage = await this.isErrorMessageDisplayed();
    
    expect(hasValidationError || hasErrorMessage).toBe(true);
    
    if (hasValidationError) {
      const validationError = await this.getValidationError();
      expect(validationError.toLowerCase()).toContain(expectedError.toLowerCase());
    } else if (hasErrorMessage) {
      const errorMessage = await this.getErrorMessage();
      expect(errorMessage.toLowerCase()).toContain(expectedError.toLowerCase());
    }
  }

  /**
   * Clear email field
   */
  async clearEmailField(): Promise<void> {
    await this.emailField.clear();
  }

  /**
   * Get current email value
   */
  async getCurrentEmailValue(): Promise<string> {
    return await this.emailField.inputValue();
  }

  /**
   * Check if email field is empty
   */
  async isEmailFieldEmpty(): Promise<boolean> {
    const value = await this.getCurrentEmailValue();
    return value.trim() === '';
  }

  /**
   * Check if recover button is enabled
   */
  async isRecoverButtonEnabled(): Promise<boolean> {
    return await this.isElementEnabled(this.recoverButton);
  }

  /**
   * Verify email field validation
   */
  async verifyEmailFieldValidation(expectedError: string): Promise<void> {
    const hasValidationError = await this.isValidationErrorDisplayed();
    expect(hasValidationError).toBe(true);
    
    const validationError = await this.getValidationError();
    expect(validationError.toLowerCase()).toContain(expectedError.toLowerCase());
  }

  /**
   * Verify empty email validation
   */
  async verifyEmptyEmailValidation(): Promise<void> {
    await this.verifyEmailFieldValidation('enter your email');
  }

  /**
   * Verify invalid email format validation
   */
  async verifyInvalidEmailFormatValidation(): Promise<void> {
    await this.verifyEmailFieldValidation('wrong email');
  }

  /**
   * Verify page contains expected elements
   */
  async verifyPageElements(): Promise<void> {
    await this.waitForElement(this.emailField);
    await this.waitForElement(this.recoverButton);
    await this.waitForElement(this.backToLoginLink);
    
    // Verify email field is focused (common UX practice)
    const isEmailFieldFocused = await this.emailField.evaluate(el => el === document.activeElement);
    expect(isEmailFieldFocused).toBe(true);
  }

  /**
   * Verify instruction text is present and informative
   */
  async verifyInstructionText(): Promise<void> {
    const instructionText = await this.getInstructionText();
    expect(instructionText.length).toBeGreaterThan(0);
    expect(instructionText.toLowerCase()).toContain('email');
  }

  /**
   * Test form submission with Enter key
   */
  async submitFormWithEnterKey(email: string): Promise<void> {
    await this.fillEmailField(email);
    await this.emailField.press('Enter');
    await this.waitForPageLoad();
  }

  /**
   * Verify navigation back to login works
   */
  async verifyNavigationBackToLogin(): Promise<void> {
    await this.clickBackToLogin();
    await this.verifyCurrentUrl('/login');
  }
}
