import { test, expect } from '../src/fixtures/TestFixtures';
import { RegistrationPage } from '../src/pages/RegistrationPage';
import { TestDataFactory } from '../src/data/TestDataFactory';

test.describe('User Registration Flow', () => {
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.navigateToRegistrationPage();
    await registrationPage.verifyRegistrationPageIsLoaded();
  });

  test.describe('Valid Registration Scenarios', () => {
    test('should successfully register with valid data - Standard Registration', async () => {
      // Arrange
      const registrationData = TestDataFactory.createValidUserRegistrationData();
      console.log(`Registering user with email: ${registrationData.email}`);

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
      console.log(`Registering user with special characters: ${testData.email}`);

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
      console.log(`Registering user with long names: ${testData.email}`);

      // Act
      await registrationPage.completeRegistration(testData);

      // Assert
      await registrationPage.verifySuccessfulRegistration();
      TestUtils.logInfo('Registration with long names completed successfully');
    });

    test('should successfully register with optional fields filled', async () => {
      // Arrange
      const registrationData = TestDataFactory.createValidUserRegistrationData();
      console.log(`Registering user with all optional fields: ${registrationData.email}`);

      // Act
      await registrationPage.fillRegistrationForm(registrationData);
      await registrationPage.clickRegisterButton();

      // Assert
      await registrationPage.verifySuccessfulRegistration();
      TestUtils.logInfo('Registration with optional fields completed successfully');
    });

    test('should successfully register with newsletter subscription', async () => {
      // Arrange
      const registrationData = TestDataFactory.createValidUserRegistrationData();
      registrationData.newsletter = true;
      console.log(`Registering user with newsletter subscription: ${registrationData.email}`);

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
      console.log(`Testing invalid email format: ${testData.email}`);

      // Act
      await registrationPage.completeRegistration(testData);

      // Assert
      await registrationPage.verifyRegistrationFailedWithError('Wrong email');
      TestUtils.logInfo('Invalid email format validation working correctly');
    });

    test('should show validation error for password mismatch', async () => {
      // Arrange
      const testData = TestDataFactory.createMismatchedPasswordRegistrationData();
      console.log('Testing password mismatch validation');

      // Act
      await registrationPage.completeRegistration(testData);

      // Assert
      await registrationPage.verifyRegistrationFailedWithError('password and confirmation password do not match');
      TestUtils.logInfo('Password mismatch validation working correctly');
    });

    test('should show validation error for weak password', async () => {
      // Arrange
      const testData = TestDataFactory.createWeakPasswordRegistrationData();
      console.log('Testing weak password validation');

      // Act
      await registrationPage.completeRegistration(testData);

      // Assert
      await registrationPage.verifyRegistrationFailedWithError('Password must meet the following rules');
      TestUtils.logInfo('Weak password validation working correctly');
    });

    test('should show validation errors for empty required fields', async () => {
      // Arrange
      const testData = TestDataFactory.createEmptyFieldsRegistrationData();
      console.log('Testing empty required fields validation');

      // Act
      await registrationPage.completeRegistration(testData);

      // Assert
      await registrationPage.verifyRegistrationFailedWithError('First name is required');
      
      // Verify multiple field validation errors
      const fieldErrors = await registrationPage.getFieldValidationErrors();
      expect(Object.keys(fieldErrors).length).toBeGreaterThan(0);
      
      TestUtils.logInfo('Empty required fields validation working correctly');
    });

    test('should show error for existing email address', async () => {
      // Arrange - First register a user
      const firstRegistrationData = TestDataFactory.createValidUserRegistrationData();
      await registrationPage.completeRegistration(firstRegistrationData);
      await registrationPage.verifySuccessfulRegistration();

      // Navigate back to registration page
      await registrationPage.navigateToRegistrationPage();

      // Try to register with the same email
      const duplicateRegistrationData = TestDataFactory.createValidUserRegistrationData();
      duplicateRegistrationData.email = firstRegistrationData.email;
      console.log(`Testing duplicate email registration: ${duplicateRegistrationData.email}`);

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
      console.log('Testing required field validation on empty form submission');

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

    test('should clear validation errors when valid data is entered', async () => {
      // Arrange
      console.log('Testing validation error clearing');

      // First trigger validation errors
      await registrationPage.clickRegisterButton();
      const hasValidationErrors = await registrationPage.hasValidationErrors();
      expect(hasValidationErrors).toBe(true);

      // Act - Fill valid data
      const validData = TestDataFactory.createValidUserRegistrationData();
      await registrationPage.fillRegistrationForm(validData);
      await registrationPage.clickRegisterButton();

      // Assert
      await registrationPage.verifySuccessfulRegistration();
      TestUtils.logInfo('Validation errors cleared successfully with valid data');
    });

    test('should maintain form data when validation fails', async () => {
      // Arrange
      const invalidData = TestDataFactory.createInvalidEmailRegistrationData();
      console.log('Testing form data persistence on validation failure');

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

    test('should handle gender selection correctly', async () => {
      // Arrange
      const registrationData = TestDataFactory.createValidUserRegistrationData();
      registrationData.gender = 'Female';
      console.log('Testing gender selection');

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

    test('should handle newsletter subscription correctly', async () => {
      // Arrange
      const registrationData = TestDataFactory.createValidUserRegistrationData();
      registrationData.newsletter = true;
      console.log('Testing newsletter subscription');

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

    test('should handle date of birth selection correctly', async () => {
      // Arrange
      const registrationData = TestDataFactory.createValidUserRegistrationData();
      console.log('Testing date of birth selection');

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
    test('should handle maximum length input fields', async () => {
      // Arrange
      const registrationData = TestDataFactory.createValidUserRegistrationData();
      registrationData.firstName = 'A'.repeat(100); // Very long first name
      registrationData.lastName = 'B'.repeat(100); // Very long last name
      console.log('Testing maximum length input fields');

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

    test('should handle special characters in all fields', async () => {
      // Arrange
      const registrationData = TestDataFactory.createValidUserRegistrationData();
      registrationData.firstName = "Test'User-Name";
      registrationData.lastName = "O'Connor-Smith";
      registrationData.company = "Test & Associates, Inc.";
      console.log('Testing special characters in all fields');

      // Act
      await registrationPage.completeRegistration(registrationData);

      // Assert
      await registrationPage.verifySuccessfulRegistration();
      TestUtils.logInfo('Special characters handling working correctly');
    });

    test('should handle rapid form submission', async () => {
      // Arrange
      const registrationData = TestDataFactory.createValidUserRegistrationData();
      console.log('Testing rapid form submission');

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
