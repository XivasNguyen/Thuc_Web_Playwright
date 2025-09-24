/**
 * Interface for user registration data
 */
export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender?: 'Male' | 'Female';
  newsletter?: boolean;
}

/**
 * Core test data factory for generating test data
 */
export class TestDataFactory {
  /**
   * Generate unique email with timestamp
   */
  static generateUniqueEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}.${timestamp}.${random}@example.com`;
  }

  /**
   * Generate valid user registration data
   */
  static createValidUserRegistrationData(): UserRegistrationData {
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: this.generateUniqueEmail('user'),
      password: 'Password123!',
      confirmPassword: 'Password123!',
      gender: 'Male',
      newsletter: false,
    };
  }

  /**
   * Generate user registration data with weak password
   */
  static createWeakPasswordRegistrationData(): UserRegistrationData {
    const validData = this.createValidUserRegistrationData();
    return {
      ...validData,
      password: '123',
      confirmPassword: '123',
    };
  }

  /**
   * Generate user registration data with empty required fields
   */
  static createEmptyFieldsRegistrationData(): UserRegistrationData {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: 'Male',
      newsletter: false,
    };
  }

  /**
   * Generate user registration data with invalid email
   */
  static createInvalidEmailRegistrationData(): UserRegistrationData {
    const validData = this.createValidUserRegistrationData();
    return {
      ...validData,
      email: 'invalid-email',
    };
  }

  /**
   * Generate user registration data with password mismatch
   */
  static createPasswordMismatchRegistrationData(): UserRegistrationData {
    const validData = this.createValidUserRegistrationData();
    return {
      ...validData,
      confirmPassword: 'DifferentPassword123!',
    };
  }
}
