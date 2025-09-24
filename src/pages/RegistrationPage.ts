import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base/BasePage';
import { UserRegistrationData } from '../data/TestDataFactory';

/**
 * Registration Page Object
 */
export class RegistrationPage extends BasePage {
  // Personal details
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly emailField: Locator;
  private readonly companyField: Locator;

  // Date of birth (not available in nopCommerce demo)
  // private readonly dateOfBirthDayDropdown: Locator;
  // private readonly dateOfBirthMonthDropdown: Locator;
  // private readonly dateOfBirthYearDropdown: Locator;

  // Gender
  private readonly maleGenderRadio: Locator;
  private readonly femaleGenderRadio: Locator;

  // Password
  private readonly passwordField: Locator;
  private readonly confirmPasswordField: Locator;

  // Newsletter
  private readonly newsletterCheckbox: Locator;

  // Buttons
  private readonly registerButton: Locator;

  // Messages and validation
  private readonly successMessage: Locator;
  private readonly errorMessages: Locator;
  private readonly validationSummary: Locator;
  private readonly fieldValidationErrors: Locator;

  // Specific field validation errors
  private readonly firstNameValidationError: Locator;
  private readonly lastNameValidationError: Locator;
  private readonly emailValidationError: Locator;
  private readonly passwordValidationError: Locator;
  private readonly confirmPasswordValidationError: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize personal details fields
    this.firstNameField = page.locator('#FirstName');
    this.lastNameField = page.locator('#LastName');
    this.emailField = page.locator('#Email');
    this.companyField = page.locator('#Company');

    // Date of birth dropdowns not available in nopCommerce demo
    // this.dateOfBirthDayDropdown = page.locator('select[name="DateOfBirthDay"]');
    // this.dateOfBirthMonthDropdown = page.locator('select[name="DateOfBirthMonth"]');
    // this.dateOfBirthYearDropdown = page.locator('select[name="DateOfBirthYear"]');

    // Initialize gender radio buttons
    this.maleGenderRadio = page.locator('input[value="M"]');
    this.femaleGenderRadio = page.locator('input[value="F"]');

    // Initialize password fields
    this.passwordField = page.locator('#Password');
    this.confirmPasswordField = page.locator('#ConfirmPassword');

    // Initialize newsletter checkbox
    this.newsletterCheckbox = page.locator('#Newsletter');

    // Initialize buttons
    this.registerButton = page.locator('button:has-text("Register")');

    // Initialize messages and validation
    this.successMessage = page.locator('.result');
    this.errorMessages = page.locator('.message-error');
    this.validationSummary = page.locator('.validation-summary-errors');
    this.fieldValidationErrors = page.locator('.field-validation-error');

    // Initialize specific field validation errors
    this.firstNameValidationError = page.locator('#FirstName-error');
    this.lastNameValidationError = page.locator('#LastName-error');
    this.emailValidationError = page.locator('#Email-error');
    this.passwordValidationError = page.locator('#Password-error');
    this.confirmPasswordValidationError = page.locator('#ConfirmPassword-error');
  }

  /**
   * Navigate to registration page
   */
  async navigateToRegistrationPage(): Promise<void> {
    await this.navigateTo('/register');
    await this.waitForPageLoad();
  }

  /**
   * Fill personal details
   */
  async fillPersonalDetails(data: UserRegistrationData): Promise<void> {
    await this.fillField(this.firstNameField, data.firstName);
    await this.fillField(this.lastNameField, data.lastName);
    await this.fillField(this.emailField, data.email);
    
    if (data.company) {
      await this.fillField(this.companyField, data.company);
    }
  }

  /**
   * Set date of birth (not available in nopCommerce demo)
   */
  // async setDateOfBirth(day: number, month: number, year: number): Promise<void> {
  //   await this.selectDropdownOption(this.dateOfBirthDayDropdown, day.toString());
  //   await this.selectDropdownOption(this.dateOfBirthMonthDropdown, month.toString());
  //   await this.selectDropdownOption(this.dateOfBirthYearDropdown, year.toString());
  // }

  /**
   * Select gender
   */
  async selectGender(gender: 'Male' | 'Female'): Promise<void> {
    if (gender === 'Male') {
      await this.clickElement(this.maleGenderRadio);
    } else {
      await this.clickElement(this.femaleGenderRadio);
    }
  }

  /**
   * Fill password fields
   */
  async fillPasswordFields(password: string, confirmPassword: string): Promise<void> {
    await this.fillField(this.passwordField, password);
    await this.fillField(this.confirmPasswordField, confirmPassword);
  }

  /**
   * Set newsletter subscription
   */
  async setNewsletterSubscription(subscribe: boolean): Promise<void> {
    const isChecked = await this.newsletterCheckbox.isChecked();
    if (subscribe && !isChecked) {
      await this.clickElement(this.newsletterCheckbox);
    } else if (!subscribe && isChecked) {
      await this.clickElement(this.newsletterCheckbox);
    }
  }

  /**
   * Click register button
   */
  async clickRegisterButton(): Promise<void> {
    await this.clickElement(this.registerButton);
    await this.waitForPageLoad();
  }

  /**
   * Fill complete registration form
   */
  async fillRegistrationForm(data: UserRegistrationData): Promise<void> {
    await this.fillPersonalDetails(data);

    // Date of birth not available in nopCommerce demo
    // if (data.dateOfBirth) {
    //   await this.setDateOfBirth(
    //     data.dateOfBirth.day,
    //     data.dateOfBirth.month,
    //     data.dateOfBirth.year
    //   );
    // }
    
    if (data.gender) {
      await this.selectGender(data.gender);
    }
    
    await this.fillPasswordFields(data.password, data.confirmPassword);
    
    if (data.newsletter !== undefined) {
      await this.setNewsletterSubscription(data.newsletter);
    }
  }

  /**
   * Complete registration process
   */
  async completeRegistration(data: UserRegistrationData): Promise<void> {
    await this.fillRegistrationForm(data);
    await this.clickRegisterButton();
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
    await this.waitForElement(this.errorMessages);
    return await this.getElementText(this.errorMessages);
  }

  /**
   * Get validation summary errors
   */
  async getValidationSummaryErrors(): Promise<string[]> {
    await this.waitForElement(this.validationSummary);
    const errorElements = await this.validationSummary.locator('li').all();
    const errors: string[] = [];
    
    for (const element of errorElements) {
      const text = await element.textContent();
      if (text) {
        errors.push(text.trim());
      }
    }
    
    return errors;
  }

  /**
   * Get field validation errors
   */
  async getFieldValidationErrors(): Promise<Record<string, string>> {
    const errors: Record<string, string> = {};
    
    const fieldErrors = [
      { field: 'firstName', locator: this.firstNameValidationError },
      { field: 'lastName', locator: this.lastNameValidationError },
      { field: 'email', locator: this.emailValidationError },
      { field: 'password', locator: this.passwordValidationError },
      { field: 'confirmPassword', locator: this.confirmPasswordValidationError },
    ];
    
    for (const { field, locator } of fieldErrors) {
      if (await this.isElementVisible(locator)) {
        const errorText = await this.getElementText(locator);
        if (errorText) {
          errors[field] = errorText;
        }
      }
    }
    
    return errors;
  }

  /**
   * Check if registration was successful
   */
  async isRegistrationSuccessful(): Promise<boolean> {
    return await this.isElementVisible(this.successMessage);
  }

  /**
   * Check if there are validation errors
   */
  async hasValidationErrors(): Promise<boolean> {
    return await this.isElementVisible(this.validationSummary) || 
           await this.isElementVisible(this.fieldValidationErrors);
  }

  /**
   * Verify registration page is loaded
   */
  async verifyRegistrationPageIsLoaded(): Promise<void> {
    await this.verifyPageTitle('Register');
    await this.waitForElement(this.firstNameField);
    await this.waitForElement(this.lastNameField);
    await this.waitForElement(this.emailField);
    await this.waitForElement(this.passwordField);
    await this.waitForElement(this.confirmPasswordField);
    await this.waitForElement(this.registerButton);
  }

  /**
   * Verify successful registration
   */
  async verifySuccessfulRegistration(): Promise<void> {
    await this.waitForElement(this.successMessage);
    const message = await this.getSuccessMessage();
    expect(message).toContain('Your registration completed');
  }

  /**
   * Verify registration failed with specific error
   */
  async verifyRegistrationFailedWithError(expectedError: string): Promise<void> {
    const hasValidationErrors = await this.hasValidationErrors();
    expect(hasValidationErrors).toBe(true);
    
    // Check validation summary
    if (await this.isElementVisible(this.validationSummary)) {
      const summaryErrors = await this.getValidationSummaryErrors();
      const hasExpectedError = summaryErrors.some(error => 
        error.toLowerCase().includes(expectedError.toLowerCase())
      );
      expect(hasExpectedError).toBe(true);
    }
    
    // Check field validation errors
    const fieldErrors = await this.getFieldValidationErrors();
    const hasFieldError = Object.values(fieldErrors).some(error => 
      error.toLowerCase().includes(expectedError.toLowerCase())
    );
    
    // Check general error messages
    if (await this.isElementVisible(this.errorMessages)) {
      const errorMessage = await this.getErrorMessage();
      const hasGeneralError = errorMessage.toLowerCase().includes(expectedError.toLowerCase());
      expect(hasFieldError || hasGeneralError).toBe(true);
    } else {
      expect(hasFieldError).toBe(true);
    }
  }

  /**
   * Clear all form fields
   */
  async clearAllFields(): Promise<void> {
    await this.firstNameField.clear();
    await this.lastNameField.clear();
    await this.emailField.clear();
    await this.companyField.clear();
    await this.passwordField.clear();
    await this.confirmPasswordField.clear();
  }

  /**
   * Get current form values
   */
  async getCurrentFormValues(): Promise<Record<string, string>> {
    return {
      firstName: await this.firstNameField.inputValue(),
      lastName: await this.lastNameField.inputValue(),
      email: await this.emailField.inputValue(),
      company: await this.companyField.inputValue(),
      password: await this.passwordField.inputValue(),
      confirmPassword: await this.confirmPasswordField.inputValue(),
    };
  }

  /**
   * Check if newsletter is subscribed
   */
  async isNewsletterSubscribed(): Promise<boolean> {
    return await this.newsletterCheckbox.isChecked();
  }

  /**
   * Get selected gender
   */
  async getSelectedGender(): Promise<string | null> {
    if (await this.maleGenderRadio.isChecked()) {
      return 'Male';
    } else if (await this.femaleGenderRadio.isChecked()) {
      return 'Female';
    }
    return null;
  }

  /**
   * Verify form field is required
   */
  async verifyFieldIsRequired(fieldName: string): Promise<void> {
    const fieldErrors = await this.getFieldValidationErrors();
    expect(fieldErrors[fieldName]).toBeDefined();
    expect(fieldErrors[fieldName].toLowerCase()).toContain('required');
  }

  /**
   * Verify email format validation
   */
  async verifyEmailFormatValidation(): Promise<void> {
    const fieldErrors = await this.getFieldValidationErrors();
    expect(fieldErrors.email).toBeDefined();
    expect(fieldErrors.email.toLowerCase()).toContain('email');
  }

  /**
   * Verify password confirmation validation
   */
  async verifyPasswordConfirmationValidation(): Promise<void> {
    const fieldErrors = await this.getFieldValidationErrors();
    expect(fieldErrors.confirmPassword).toBeDefined();
    expect(fieldErrors.confirmPassword.toLowerCase()).toContain('match');
  }
}
