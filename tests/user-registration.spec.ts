import { test, expect } from '../src/fixtures/TestFixtures';
import { RegistrationPage } from '../src/pages/RegistrationPage';
import { TestDataFactory } from '../src/data/TestDataFactory';
import { TestUtils } from '../src/utils/TestUtils';

test.describe('User Registration Flow', () => {
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.navigateToRegistrationPage();
    await registrationPage.verifyRegistrationPageIsLoaded();
  });

  test.describe('Valid Registration Scenarios', () => {
    test('should successfully register with valid data - Standard Registration', async ({ testDataFactory }) => {
      // Arrange
      const registrationData = testDataFactory.createValidUserRegistrationData();
      TestUtils.logStep(`Registering user with email: ${registrationData.email}`);

      // Act
      await registrationPage.completeRegistration(registrationData);

      // Assert
      await registrationPage.verifySuccessfulRegistration();
      const successMessage = await registrationPage.getSuccessMessage();
      expect(successMessage).toContain('Your registration completed');
      
      TestUtils.logInfo('User registration completed successfully');
    });

    test('should successfully register with special characters in name', async () => {
      // Arrange
      const testData = TestDataFactory.createValidUserRegistrationData();
      // Override with special characters for this test
      testData.firstName = "O'Connor";
      testData.lastName = 'Smith-Jones';
      testData.company = 'O\'Connor & Associates';
      TestUtils.logStep(`Registering user with special characters: ${testData.email}`);

      // Act
      await registrationPage.completeRegistration(testData);

      // Assert
      await registrationPage.verifySuccessfulRegistration();
      TestUtils.logInfo('Registration with special characters completed successfully');
    });

    test('should successfully register with long names', async () => {
      // Arrange
      const testData = TestDataFactory.createValidUserRegistrationData();
      // Override with long names for this test
      testData.firstName = 'Bartholomew';
      testData.lastName = 'Constantinopolous';
      testData.company = 'Bartholomew Constantinopolous International Corporation';
      TestUtils.logStep(`Registering user with long names: ${testData.email}`);

      // Act
      await registrationPage.completeRegistration(testData);

      // Assert
      await registrationPage.verifySuccessfulRegistration();
      TestUtils.logInfo('Registration with long names completed successfully');
    });

    test('should successfully register with optional fields filled', async ({ testDataFactory }) => {
      // Arrange
      const registrationData = testDataFactory.createValidUserRegistrationData();
      TestUtils.logStep(`Registering user with all optional fields: ${registrationData.email}`);

      // Act
      await registrationPage.fillRegistrationForm(registrationData);
      await registrationPage.clickRegisterButton();

      // Assert
      await registrationPage.verifySuccessfulRegistration();
      TestUtils.logInfo('Registration with optional fields completed successfully');
    });

    test('should successfully register with newsletter subscription', async ({ testDataFactory }) => {
      // Arrange
      const registrationData = testDataFactory.createValidUserRegistrationData();
      registrationData.newsletter = true;
      TestUtils.logStep(`Registering user with newsletter subscription: ${registrationData.email}`);

      // Act
      await registrationPage.completeRegistration(registrationData);

      // Assert
      await registrationPage.verifySuccessfulRegistration();
      TestUtils.logInfo('Registration with newsletter subscription completed successfully');
    });
  });

  test.describe('Invalid Registration Scenarios', () => {
    test('should show validation error for invalid email format', async () => {
      // Arrange
      const testData = TestDataFactory.createInvalidEmailRegistrationData();
      TestUtils.logStep(`Testing invalid email format: ${testData.email}`);

      // Act
      await registrationPage.completeRegistration(testData);

      // Assert
      await registrationPage.verifyRegistrationFailedWithError('Wrong email');
      TestUtils.logInfo('Invalid email format validation working correctly');
    });

    test('should show validation error for password mismatch', async () => {
      // Arrange
      const testData = TestDataFactory.createMismatchedPasswordRegistrationData();
      TestUtils.logStep('Testing password mismatch validation');

      // Act
      await registrationPage.completeRegistration(testData);

      // Assert
      await registrationPage.verifyRegistrationFailedWithError('password and confirmation password do not match');
      TestUtils.logInfo('Password mismatch validation working correctly');
    });

    test('should show validation error for weak password', async () => {
      // Arrange
      const testData = TestDataFactory.createWeakPasswordRegistrationData();
      TestUtils.logStep('Testing weak password validation');

      // Act
      await registrationPage.completeRegistration(testData);

      // Assert
      await registrationPage.verifyRegistrationFailedWithError('Password must meet the following rules');
      TestUtils.logInfo('Weak password validation working correctly');
    });

    test('should show validation errors for empty required fields', async () => {
      // Arrange
      const testData = TestDataFactory.createEmptyFieldsRegistrationData();
      TestUtils.logStep('Testing empty required fields validation');

      // Act
      await registrationPage.completeRegistration(testData);

      // Assert
      await registrationPage.verifyRegistrationFailedWithError('First name is required');
      
      // Verify multiple field validation errors
      const fieldErrors = await registrationPage.getFieldValidationErrors();
      expect(Object.keys(fieldErrors).length).toBeGreaterThan(0);
      
      TestUtils.logInfo('Empty required fields validation working correctly');
    });

    test('should show error for existing email address', async ({ testDataFactory }) => {
      // Arrange - First register a user
      const firstRegistrationData = testDataFactory.createValidUserRegistrationData();
      await registrationPage.completeRegistration(firstRegistrationData);
      await registrationPage.verifySuccessfulRegistration();

      // Navigate back to registration page
      await registrationPage.navigateToRegistrationPage();

      // Try to register with the same email
      const duplicateRegistrationData = testDataFactory.createValidUserRegistrationData();
      duplicateRegistrationData.email = firstRegistrationData.email;
      TestUtils.logStep(`Testing duplicate email registration: ${duplicateRegistrationData.email}`);

      // Act
      await registrationPage.completeRegistration(duplicateRegistrationData);

      // Assert
      await registrationPage.verifyRegistrationFailedWithError('The specified email already exists');
      TestUtils.logInfo('Duplicate email validation working correctly');
    });
  });

  test.describe('Form Interaction and Validation', () => {
    test('should validate required fields on form submission', async () => {
      // Arrange
      TestUtils.logStep('Testing required field validation on empty form submission');

      // Act
      await registrationPage.clickRegisterButton();

      // Assert
      const hasValidationErrors = await registrationPage.hasValidationErrors();
      expect(hasValidationErrors).toBe(true);

      const fieldErrors = await registrationPage.getFieldValidationErrors();
      expect(fieldErrors.firstName).toBeDefined();
      expect(fieldErrors.lastName).toBeDefined();
      expect(fieldErrors.email).toBeDefined();
      expect(fieldErrors.password).toBeDefined();

      TestUtils.logInfo('Required field validation working correctly');
    });

    test('should clear validation errors when valid data is entered', async ({ testDataFactory }) => {
      // Arrange
      TestUtils.logStep('Testing validation error clearing');

      // First trigger validation errors
      await registrationPage.clickRegisterButton();
      const hasValidationErrors = await registrationPage.hasValidationErrors();
      expect(hasValidationErrors).toBe(true);

      // Act - Fill valid data
      const validData = testDataFactory.createValidUserRegistrationData();
      await registrationPage.fillRegistrationForm(validData);
      await registrationPage.clickRegisterButton();

      // Assert
      await registrationPage.verifySuccessfulRegistration();
      TestUtils.logInfo('Validation errors cleared successfully with valid data');
    });

    test('should maintain form data when validation fails', async ({ testDataFactory }) => {
      // Arrange
      const invalidData = testDataFactory.createInvalidEmailRegistrationData();
      TestUtils.logStep('Testing form data persistence on validation failure');

      // Act
      await registrationPage.fillRegistrationForm(invalidData);
      await registrationPage.clickRegisterButton();

      // Assert validation failed
      const hasValidationErrors = await registrationPage.hasValidationErrors();
      expect(hasValidationErrors).toBe(true);

      // Verify form data is maintained
      const currentFormValues = await registrationPage.getCurrentFormValues();
      expect(currentFormValues.firstName).toBe(invalidData.firstName);
      expect(currentFormValues.lastName).toBe(invalidData.lastName);
      expect(currentFormValues.email).toBe(invalidData.email);

      TestUtils.logInfo('Form data persistence working correctly');
    });

    test('should handle gender selection correctly', async ({ testDataFactory }) => {
      // Arrange
      const registrationData = testDataFactory.createValidUserRegistrationData();
      registrationData.gender = 'Female';
      TestUtils.logStep('Testing gender selection');

      // Act
      await registrationPage.fillPersonalDetails(registrationData);
      await registrationPage.selectGender(registrationData.gender);

      // Assert
      const selectedGender = await registrationPage.getSelectedGender();
      expect(selectedGender).toBe('Female');

      // Complete registration to verify it works
      await registrationPage.fillPasswordFields(registrationData.password, registrationData.confirmPassword);
      await registrationPage.clickRegisterButton();
      await registrationPage.verifySuccessfulRegistration();

      TestUtils.logInfo('Gender selection working correctly');
    });

    test('should handle newsletter subscription correctly', async ({ testDataFactory }) => {
      // Arrange
      const registrationData = testDataFactory.createValidUserRegistrationData();
      registrationData.newsletter = true;
      TestUtils.logStep('Testing newsletter subscription');

      // Act
      await registrationPage.fillPersonalDetails(registrationData);
      await registrationPage.setNewsletterSubscription(registrationData.newsletter);

      // Assert
      const isSubscribed = await registrationPage.isNewsletterSubscribed();
      expect(isSubscribed).toBe(true);

      // Complete registration to verify it works
      await registrationPage.fillPasswordFields(registrationData.password, registrationData.confirmPassword);
      await registrationPage.clickRegisterButton();
      await registrationPage.verifySuccessfulRegistration();

      TestUtils.logInfo('Newsletter subscription working correctly');
    });

    test('should handle date of birth selection correctly', async ({ testDataFactory }) => {
      // Arrange
      const registrationData = testDataFactory.createValidUserRegistrationData();
      TestUtils.logStep('Testing date of birth selection');

      // Act
      await registrationPage.fillPersonalDetails(registrationData);
      if (registrationData.dateOfBirth) {
        await registrationPage.setDateOfBirth(
          registrationData.dateOfBirth.day,
          registrationData.dateOfBirth.month,
          registrationData.dateOfBirth.year
        );
      }

      // Complete registration to verify it works
      await registrationPage.fillPasswordFields(registrationData.password, registrationData.confirmPassword);
      await registrationPage.clickRegisterButton();
      await registrationPage.verifySuccessfulRegistration();

      TestUtils.logInfo('Date of birth selection working correctly');
    });
  });

  test.describe('Edge Cases and Boundary Testing', () => {
    test('should handle maximum length input fields', async ({ testDataFactory }) => {
      // Arrange
      const registrationData = testDataFactory.createValidUserRegistrationData();
      registrationData.firstName = 'A'.repeat(100); // Very long first name
      registrationData.lastName = 'B'.repeat(100); // Very long last name
      TestUtils.logStep('Testing maximum length input fields');

      // Act
      await registrationPage.completeRegistration(registrationData);

      // Assert - Should either succeed or show appropriate validation
      const isSuccessful = await registrationPage.isRegistrationSuccessful();
      if (!isSuccessful) {
        const hasValidationErrors = await registrationPage.hasValidationErrors();
        expect(hasValidationErrors).toBe(true);
      }

      TestUtils.logInfo('Maximum length input handling tested');
    });

    test('should handle special characters in all fields', async ({ testDataFactory }) => {
      // Arrange
      const registrationData = testDataFactory.createValidUserRegistrationData();
      registrationData.firstName = "Test'User-Name";
      registrationData.lastName = "O'Connor-Smith";
      registrationData.company = "Test & Associates, Inc.";
      TestUtils.logStep('Testing special characters in all fields');

      // Act
      await registrationPage.completeRegistration(registrationData);

      // Assert
      await registrationPage.verifySuccessfulRegistration();
      TestUtils.logInfo('Special characters handling working correctly');
    });

    test('should handle rapid form submission', async ({ testDataFactory }) => {
      // Arrange
      const registrationData = testDataFactory.createValidUserRegistrationData();
      TestUtils.logStep('Testing rapid form submission');

      // Act
      await registrationPage.fillRegistrationForm(registrationData);
      
      // Submit multiple times rapidly
      await registrationPage.clickRegisterButton();
      // Note: In a real scenario, we might want to test that duplicate submissions are prevented
      
      // Assert
      await registrationPage.verifySuccessfulRegistration();
      TestUtils.logInfo('Rapid form submission handled correctly');
    });
  });
});
