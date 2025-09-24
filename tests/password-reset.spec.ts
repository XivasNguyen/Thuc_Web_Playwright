import { test } from '../src/fixtures/TestFixtures';
import { PasswordResetPage } from '../src/pages/PasswordResetPage';

test.describe('Password Reset Workflow', () => {
  let passwordResetPage: PasswordResetPage;

  test.beforeEach(async ({ page }) => {
    passwordResetPage = new PasswordResetPage(page);
    await passwordResetPage.navigateToPasswordResetPage();
    await passwordResetPage.verifyPasswordResetPageIsLoaded();
  });

  test('should request password reset for existing user email', async () => {
    console.log('🧪 Testing password reset request for valid email');
    
    const validEmail = 'test@example.com';
    await passwordResetPage.enterEmail(validEmail);
    await passwordResetPage.submitPasswordResetRequest();
    await passwordResetPage.verifyPasswordResetRequestSuccess();
    
    console.log('✅ Password reset request completed successfully');
  });

  test('should handle password reset validation errors', async () => {
    console.log('🧪 Testing password reset validation errors');
    
    // Test empty email field
    await passwordResetPage.submitPasswordResetRequest();
    await passwordResetPage.verifyEmptyEmailError();
    
    // Test invalid email format
    await passwordResetPage.enterEmail('invalid-email');
    await passwordResetPage.submitPasswordResetRequest();
    await passwordResetPage.verifyInvalidEmailError();
    
    console.log('✅ Password reset validation errors handled correctly');
  });
});
