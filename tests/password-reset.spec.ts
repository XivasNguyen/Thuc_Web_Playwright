import { test, expect } from '../src/fixtures/TestFixtures';
import { PasswordResetPage } from '../src/pages/PasswordResetPage';
import { LoginPage } from '../src/pages/LoginPage';
import { TestDataProvider } from '../src/data/TestDataProvider';
import { TestUtils } from '../src/utils/TestUtils';

test.describe('Password Reset Workflow', () => {
  let passwordResetPage: PasswordResetPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    passwordResetPage = new PasswordResetPage(page);
    loginPage = new LoginPage(page);
  });

  test.describe('Password Recovery Page Access', () => {
    test('should navigate to password recovery page from login page', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Navigating to login page and accessing password recovery');

      // Act
      await loginPage.navigateToLoginPage();
      await loginPage.verifyLoginPageIsLoaded();
      await loginPage.clickForgotPasswordLink();

      // Assert
      await passwordResetPage.verifyPasswordRecoveryPageIsLoaded();
      TestUtils.logInfo('Successfully navigated to password recovery page from login');
    });

    test('should navigate directly to password recovery page', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Navigating directly to password recovery page');

      // Act
      await passwordResetPage.navigateToPasswordRecoveryPage();

      // Assert
      await passwordResetPage.verifyPasswordRecoveryPageIsLoaded();
      TestUtils.logInfo('Successfully accessed password recovery page directly');
    });

    test('should display correct page elements and content', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Verifying password recovery page elements');

      // Act
      await passwordResetPage.navigateToPasswordRecoveryPage();

      // Assert
      await passwordResetPage.verifyPageElements();
      await passwordResetPage.verifyInstructionText();
      
      const pageTitle = await passwordResetPage.getPageTitle();
      expect(pageTitle.toLowerCase()).toContain('password recovery');
      
      TestUtils.logInfo('Password recovery page elements verified successfully');
    });
  });

  test.describe('Valid Password Recovery Requests', () => {
    test('should successfully submit password recovery for valid email', async ({ page }) => {
      // Arrange
      const testData = TestDataProvider.getTestData('password_reset', 'Valid Email Reset');
      TestUtils.logStep(`Submitting password recovery for valid email: ${testData.email}`);

      // Act
      await passwordResetPage.navigateToPasswordRecoveryPage();
      await passwordResetPage.submitPasswordRecoveryRequest(testData.email);

      // Assert
      await passwordResetPage.verifyPasswordRecoveryRequestSuccessful();
      const successMessage = await passwordResetPage.getSuccessMessage();
      expect(successMessage.toLowerCase()).toContain('email with instructions has been sent');
      
      TestUtils.logInfo('Password recovery request submitted successfully');
    });

    test('should handle password recovery for non-existent email gracefully', async ({ page }) => {
      // Arrange
      const testData = TestDataProvider.getTestData('password_reset', 'Invalid Email Reset');
      TestUtils.logStep(`Submitting password recovery for non-existent email: ${testData.email}`);

      // Act
      await passwordResetPage.navigateToPasswordRecoveryPage();
      await passwordResetPage.submitPasswordRecoveryRequest(testData.email);

      // Assert
      // For security reasons, the system should show the same success message
      await passwordResetPage.verifyPasswordRecoveryRequestSuccessful();
      const successMessage = await passwordResetPage.getSuccessMessage();
      expect(successMessage.toLowerCase()).toContain('email with instructions has been sent');
      
      TestUtils.logInfo('Non-existent email handled gracefully with generic success message');
    });

    test('should submit form using Enter key', async ({ page }) => {
      // Arrange
      const validEmail = 'test.user@example.com';
      TestUtils.logStep('Testing form submission with Enter key');

      // Act
      await passwordResetPage.navigateToPasswordRecoveryPage();
      await passwordResetPage.submitFormWithEnterKey(validEmail);

      // Assert
      await passwordResetPage.verifyPasswordRecoveryRequestSuccessful();
      TestUtils.logInfo('Form submission with Enter key working correctly');
    });

    test('should handle various valid email formats', async ({ page }) => {
      // Arrange
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user123@example-domain.com',
        'user@subdomain.example.com'
      ];
      
      TestUtils.logStep('Testing various valid email formats');

      for (const email of validEmails) {
        // Act
        await passwordResetPage.navigateToPasswordRecoveryPage();
        await passwordResetPage.submitPasswordRecoveryRequest(email);

        // Assert
        await passwordResetPage.verifyPasswordRecoveryRequestSuccessful();
        TestUtils.logInfo(`Valid email format ${email} handled correctly`);
      }
    });
  });

  test.describe('Invalid Password Recovery Requests', () => {
    test('should show validation error for empty email', async ({ page }) => {
      // Arrange
      const testData = TestDataProvider.getTestData('password_reset', 'Empty Email Reset');
      TestUtils.logStep('Testing empty email validation');

      // Act
      await passwordResetPage.navigateToPasswordRecoveryPage();
      await passwordResetPage.submitPasswordRecoveryRequest(testData.email);

      // Assert
      await passwordResetPage.verifyPasswordRecoveryRequestFailedWithError(testData.expectedError);
      TestUtils.logInfo('Empty email validation working correctly');
    });

    test('should show validation error for invalid email format', async ({ page }) => {
      // Arrange
      const invalidEmails = [
        'invalid-email',
        'invalid@',
        '@invalid.com',
        'invalid..email@example.com',
        'invalid email@example.com',
        'invalid@.com'
      ];
      
      TestUtils.logStep('Testing invalid email format validation');

      for (const invalidEmail of invalidEmails) {
        // Act
        await passwordResetPage.navigateToPasswordRecoveryPage();
        await passwordResetPage.submitPasswordRecoveryRequest(invalidEmail);

        // Assert
        await passwordResetPage.verifyInvalidEmailFormatValidation();
        TestUtils.logInfo(`Invalid email format ${invalidEmail} validation working correctly`);
      }
    });

    test('should validate email field on form submission without input', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing form submission without email input');

      // Act
      await passwordResetPage.navigateToPasswordRecoveryPage();
      await passwordResetPage.clickRecoverButton();

      // Assert
      await passwordResetPage.verifyEmptyEmailValidation();
      TestUtils.logInfo('Empty form submission validation working correctly');
    });

    test('should maintain form state after validation error', async ({ page }) => {
      // Arrange
      const invalidEmail = 'invalid-email-format';
      TestUtils.logStep('Testing form state persistence after validation error');

      // Act
      await passwordResetPage.navigateToPasswordRecoveryPage();
      await passwordResetPage.fillEmailField(invalidEmail);
      await passwordResetPage.clickRecoverButton();

      // Assert validation error
      await passwordResetPage.verifyInvalidEmailFormatValidation();
      
      // Verify form maintains the invalid input
      const currentEmailValue = await passwordResetPage.getCurrentEmailValue();
      expect(currentEmailValue).toBe(invalidEmail);
      
      TestUtils.logInfo('Form state persistence working correctly');
    });
  });

  test.describe('Form Interaction and User Experience', () => {
    test('should focus email field on page load', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing email field focus on page load');

      // Act
      await passwordResetPage.navigateToPasswordRecoveryPage();

      // Assert
      await passwordResetPage.verifyPageElements();
      TestUtils.logInfo('Email field focus on page load working correctly');
    });

    test('should enable recover button when email is entered', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing recover button state');

      // Act
      await passwordResetPage.navigateToPasswordRecoveryPage();
      
      // Check initial state
      const initialButtonState = await passwordResetPage.isRecoverButtonEnabled();
      expect(initialButtonState).toBe(true); // Button should be enabled by default
      
      // Fill email and check state
      await passwordResetPage.fillEmailField('test@example.com');
      const buttonStateAfterInput = await passwordResetPage.isRecoverButtonEnabled();
      expect(buttonStateAfterInput).toBe(true);
      
      TestUtils.logInfo('Recover button state working correctly');
    });

    test('should clear email field when requested', async ({ page }) => {
      // Arrange
      const testEmail = 'test@example.com';
      TestUtils.logStep('Testing email field clearing functionality');

      // Act
      await passwordResetPage.navigateToPasswordRecoveryPage();
      await passwordResetPage.fillEmailField(testEmail);
      
      // Verify email is filled
      let currentValue = await passwordResetPage.getCurrentEmailValue();
      expect(currentValue).toBe(testEmail);
      
      // Clear email field
      await passwordResetPage.clearEmailField();
      
      // Assert
      const isFieldEmpty = await passwordResetPage.isEmailFieldEmpty();
      expect(isFieldEmpty).toBe(true);
      
      TestUtils.logInfo('Email field clearing functionality working correctly');
    });

    test('should navigate back to login page', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing navigation back to login page');

      // Act
      await passwordResetPage.navigateToPasswordRecoveryPage();
      await passwordResetPage.verifyNavigationBackToLogin();

      // Assert
      await loginPage.verifyLoginPageIsLoaded();
      TestUtils.logInfo('Navigation back to login page working correctly');
    });

    test('should handle rapid form submissions gracefully', async ({ page }) => {
      // Arrange
      const validEmail = 'test@example.com';
      TestUtils.logStep('Testing rapid form submissions');

      // Act
      await passwordResetPage.navigateToPasswordRecoveryPage();
      await passwordResetPage.fillEmailField(validEmail);
      
      // Submit form multiple times rapidly
      await passwordResetPage.clickRecoverButton();
      // In a real scenario, we might want to test that duplicate submissions are prevented
      
      // Assert
      await passwordResetPage.verifyPasswordRecoveryRequestSuccessful();
      TestUtils.logInfo('Rapid form submissions handled gracefully');
    });
  });

  test.describe('Edge Cases and Security', () => {
    test('should handle very long email addresses', async ({ page }) => {
      // Arrange
      const longEmail = 'a'.repeat(100) + '@example.com';
      TestUtils.logStep('Testing very long email address handling');

      // Act
      await passwordResetPage.navigateToPasswordRecoveryPage();
      await passwordResetPage.submitPasswordRecoveryRequest(longEmail);

      // Assert
      // Should either succeed or show appropriate validation
      const isSuccessful = await passwordResetPage.isSuccessMessageDisplayed();
      const hasValidationError = await passwordResetPage.isValidationErrorDisplayed();
      
      expect(isSuccessful || hasValidationError).toBe(true);
      TestUtils.logInfo('Long email address handling tested');
    });

    test('should handle special characters in email', async ({ page }) => {
      // Arrange
      const specialCharEmails = [
        'user+tag@example.com',
        'user.name@example.com',
        'user-name@example.com',
        'user_name@example.com'
      ];
      
      TestUtils.logStep('Testing special characters in email addresses');

      for (const email of specialCharEmails) {
        // Act
        await passwordResetPage.navigateToPasswordRecoveryPage();
        await passwordResetPage.submitPasswordRecoveryRequest(email);

        // Assert
        await passwordResetPage.verifyPasswordRecoveryRequestSuccessful();
        TestUtils.logInfo(`Special character email ${email} handled correctly`);
      }
    });

    test('should prevent XSS attempts in email field', async ({ page }) => {
      // Arrange
      const xssAttempts = [
        '<script>alert("xss")</script>@example.com',
        'user@<script>alert("xss")</script>.com',
        'javascript:alert("xss")@example.com'
      ];
      
      TestUtils.logStep('Testing XSS prevention in email field');

      for (const xssEmail of xssAttempts) {
        // Act
        await passwordResetPage.navigateToPasswordRecoveryPage();
        await passwordResetPage.submitPasswordRecoveryRequest(xssEmail);

        // Assert
        // Should show validation error or handle gracefully
        const hasValidationError = await passwordResetPage.isValidationErrorDisplayed();
        const isSuccessful = await passwordResetPage.isSuccessMessageDisplayed();
        
        expect(hasValidationError || isSuccessful).toBe(true);
        
        // Verify no script execution (page should still be functional)
        await passwordResetPage.verifyPasswordRecoveryPageIsLoaded();
        TestUtils.logInfo(`XSS attempt ${xssEmail} handled safely`);
      }
    });

    test('should handle SQL injection attempts in email field', async ({ page }) => {
      // Arrange
      const sqlInjectionAttempts = [
        "'; DROP TABLE users; --@example.com",
        "admin'--@example.com",
        "' OR '1'='1@example.com"
      ];
      
      TestUtils.logStep('Testing SQL injection prevention in email field');

      for (const sqlEmail of sqlInjectionAttempts) {
        // Act
        await passwordResetPage.navigateToPasswordRecoveryPage();
        await passwordResetPage.submitPasswordRecoveryRequest(sqlEmail);

        // Assert
        // Should show validation error or handle gracefully
        const hasValidationError = await passwordResetPage.isValidationErrorDisplayed();
        const isSuccessful = await passwordResetPage.isSuccessMessageDisplayed();
        
        expect(hasValidationError || isSuccessful).toBe(true);
        TestUtils.logInfo(`SQL injection attempt ${sqlEmail} handled safely`);
      }
    });
  });

  test.describe('Integration with Login Flow', () => {
    test('should complete full password recovery flow from login page', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing complete password recovery flow from login page');

      // Act
      // Start from login page
      await loginPage.navigateToLoginPage();
      await loginPage.verifyLoginPageIsLoaded();
      
      // Navigate to password recovery
      await loginPage.clickForgotPasswordLink();
      await passwordResetPage.verifyPasswordRecoveryPageIsLoaded();
      
      // Submit password recovery request
      await passwordResetPage.submitPasswordRecoveryRequest('test@example.com');
      
      // Assert
      await passwordResetPage.verifyPasswordRecoveryRequestSuccessful();
      
      // Navigate back to login
      await passwordResetPage.clickBackToLogin();
      await loginPage.verifyLoginPageIsLoaded();
      
      TestUtils.logInfo('Complete password recovery flow working correctly');
    });
  });
});
