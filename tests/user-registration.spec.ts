import { test } from '../src/fixtures/TestFixtures';
import { RegistrationPage } from '../src/pages/RegistrationPage';
import { TestDataFactory } from '../src/data/TestDataFactory';

test.describe('User Registration Flow', () => {
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.navigateToRegistrationPage();
    await registrationPage.verifyRegistrationPageIsLoaded();
  });

  test('should successfully register with valid data', async () => {
    console.log('🧪 Testing user registration with valid data');
    
    const userData = TestDataFactory.createValidUserRegistrationData();
    await registrationPage.fillRegistrationForm(userData);
    await registrationPage.submitRegistration();
    await registrationPage.verifyRegistrationSuccess();
    
    console.log('✅ User registration completed successfully');
  });

  test('should handle registration validation errors', async () => {
    console.log('🧪 Testing registration validation errors');
    
    // Test invalid email format
    const invalidEmailData = TestDataFactory.createInvalidEmailRegistrationData();
    await registrationPage.fillRegistrationForm(invalidEmailData);
    await registrationPage.submitRegistration();
    await registrationPage.verifyEmailValidationError();
    
    // Clear form and test password mismatch
    await registrationPage.navigateToRegistrationPage();
    const passwordMismatchData = TestDataFactory.createPasswordMismatchRegistrationData();
    await registrationPage.fillRegistrationForm(passwordMismatchData);
    await registrationPage.submitRegistration();
    await registrationPage.verifyPasswordMismatchError();
    
    console.log('✅ Registration validation errors handled correctly');
  });
});
