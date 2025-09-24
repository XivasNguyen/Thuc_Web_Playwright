import { TestUtils } from '../utils/TestUtils';

/**
 * Interface for user registration data
 */
export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  company?: string;
  dateOfBirth?: {
    day: number;
    month: number;
    year: number;
  };
  gender?: 'Male' | 'Female';
  newsletter?: boolean;
}

/**
 * Interface for user login data
 */
export interface UserLoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Interface for address data
 */
export interface AddressData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  country: string;
  state?: string;
  city: string;
  address1: string;
  address2?: string;
  zipCode: string;
  phone: string;
  fax?: string;
}

/**
 * Interface for product search data
 */
export interface ProductSearchData {
  searchTerm: string;
  category?: string;
  manufacturer?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy?: 'Name: A to Z' | 'Name: Z to A' | 'Price: Low to High' | 'Price: High to Low' | 'Created on';
}

/**
 * Interface for credit card data
 */
export interface CreditCardData {
  cardholderName: string;
  cardNumber: string;
  expirationMonth: string;
  expirationYear: string;
  cardCode: string;
}

/**
 * Test Data Factory for generating test data
 */
export class TestDataFactory {
  /**
   * Generate valid user registration data
   */
  static createValidUserRegistrationData(): UserRegistrationData {
    const password = TestUtils.generateRandomPassword(12);
    return {
      firstName: `Test${TestUtils.generateRandomString(5)}`,
      lastName: `User${TestUtils.generateRandomString(5)}`,
      email: TestUtils.generateRandomEmail('testuser'),
      password: password,
      confirmPassword: password,
      company: `Test Company ${TestUtils.generateRandomNumber(1, 1000)}`,
      dateOfBirth: {
        day: TestUtils.generateRandomNumber(1, 28),
        month: TestUtils.generateRandomNumber(1, 12),
        year: TestUtils.generateRandomNumber(1950, 2000),
      },
      gender: TestUtils.randomBoolean() ? 'Male' : 'Female',
      newsletter: TestUtils.randomBoolean(),
    };
  }

  /**
   * Generate user registration data with invalid email
   */
  static createInvalidEmailRegistrationData(): UserRegistrationData {
    const validData = this.createValidUserRegistrationData();
    return {
      ...validData,
      email: 'invalid-email-format',
    };
  }

  /**
   * Generate user registration data with mismatched passwords
   */
  static createMismatchedPasswordRegistrationData(): UserRegistrationData {
    const validData = this.createValidUserRegistrationData();
    return {
      ...validData,
      confirmPassword: 'DifferentPassword123!',
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
      company: '',
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
    };
  }

  /**
   * Generate valid user login data
   */
  static createValidUserLoginData(): UserLoginData {
    return {
      email: 'test.user@example.com',
      password: 'TestPassword123!',
      rememberMe: false,
    };
  }

  /**
   * Generate user login data with invalid credentials
   */
  static createInvalidUserLoginData(): UserLoginData {
    return {
      email: 'invalid.user@example.com',
      password: 'WrongPassword123!',
      rememberMe: false,
    };
  }

  /**
   * Generate valid address data
   */
  static createValidAddressData(): AddressData {
    return {
      firstName: `Test${TestUtils.generateRandomString(5)}`,
      lastName: `User${TestUtils.generateRandomString(5)}`,
      email: TestUtils.generateRandomEmail('address'),
      company: `Test Company ${TestUtils.generateRandomNumber(1, 1000)}`,
      country: 'United States',
      state: 'California',
      city: `Test City ${TestUtils.generateRandomNumber(1, 100)}`,
      address1: `${TestUtils.generateRandomNumber(100, 9999)} Test Street`,
      address2: `Apt ${TestUtils.generateRandomNumber(1, 100)}`,
      zipCode: `${TestUtils.generateRandomNumber(10000, 99999)}`,
      phone: TestUtils.generateRandomPhoneNumber(),
      fax: TestUtils.generateRandomPhoneNumber(),
    };
  }

  /**
   * Generate product search data for computers
   */
  static createComputerSearchData(): ProductSearchData {
    return {
      searchTerm: 'computer',
      category: 'Computers',
      sortBy: 'Price: Low to High',
    };
  }

  /**
   * Generate product search data for notebooks
   */
  static createNotebookSearchData(): ProductSearchData {
    return {
      searchTerm: 'notebook',
      category: 'Computers >> Notebooks',
      manufacturer: 'Apple',
      priceRange: {
        min: 1000,
        max: 3000,
      },
      sortBy: 'Price: High to Low',
    };
  }

  /**
   * Generate product search data with price filter
   */
  static createPriceFilterSearchData(): ProductSearchData {
    return {
      searchTerm: '',
      category: 'Electronics',
      priceRange: {
        min: 100,
        max: 500,
      },
      sortBy: 'Price: Low to High',
    };
  }

  /**
   * Generate invalid search data
   */
  static createInvalidSearchData(): ProductSearchData {
    return {
      searchTerm: 'xyznonexistentproduct123',
    };
  }

  /**
   * Generate valid credit card data
   */
  static createValidCreditCardData(): CreditCardData {
    return {
      cardholderName: 'Test User',
      cardNumber: '4111111111111111', // Test Visa card number
      expirationMonth: '12',
      expirationYear: '2025',
      cardCode: '123',
    };
  }

  /**
   * Generate invalid credit card data
   */
  static createInvalidCreditCardData(): CreditCardData {
    return {
      cardholderName: 'Test User',
      cardNumber: '1234567890123456', // Invalid card number
      expirationMonth: '12',
      expirationYear: '2020', // Expired year
      cardCode: '123',
    };
  }

  /**
   * Generate test data for password reset
   */
  static createPasswordResetData() {
    return {
      email: TestUtils.generateRandomEmail('passwordreset'),
      existingUserEmail: 'test.user@example.com',
      invalidEmail: 'nonexistent@example.com',
    };
  }

  /**
   * Generate test data for newsletter subscription
   */
  static createNewsletterData() {
    return {
      validEmail: TestUtils.generateRandomEmail('newsletter'),
      invalidEmail: 'invalid-email-format',
      existingEmail: 'existing.subscriber@example.com',
    };
  }

  /**
   * Generate test data for contact form
   */
  static createContactFormData() {
    return {
      fullName: `Test User ${TestUtils.generateRandomString(5)}`,
      email: TestUtils.generateRandomEmail('contact'),
      enquiry: `This is a test enquiry message generated at ${new Date().toISOString()}. ${TestUtils.generateRandomString(50)}`,
    };
  }

  /**
   * Generate test data for product review
   */
  static createProductReviewData() {
    const ratings = [1, 2, 3, 4, 5];
    return {
      reviewTitle: `Test Review ${TestUtils.generateRandomString(10)}`,
      reviewText: `This is a test review generated at ${new Date().toISOString()}. ${TestUtils.generateRandomString(100)}`,
      rating: TestUtils.getRandomItem(ratings),
    };
  }

  /**
   * Generate test data for wishlist
   */
  static createWishlistData() {
    return {
      productIds: ['1', '2', '3'], // Sample product IDs
      quantities: [1, 2, 1],
    };
  }

  /**
   * Generate test data for shopping cart
   */
  static createShoppingCartData() {
    return {
      products: [
        { id: '1', name: 'Build your own computer', quantity: 1 },
        { id: '2', name: 'Apple MacBook Pro', quantity: 2 },
      ],
      couponCode: 'TESTCOUPON',
      giftCardCode: 'TESTGIFT',
    };
  }

  /**
   * Generate test data for checkout
   */
  static createCheckoutData() {
    return {
      billingAddress: this.createValidAddressData(),
      shippingAddress: this.createValidAddressData(),
      paymentMethod: 'Credit Card',
      creditCard: this.createValidCreditCardData(),
      shippingMethod: 'Ground',
      specialInstructions: `Test order placed at ${new Date().toISOString()}`,
    };
  }

  /**
   * Get predefined test users for different scenarios
   */
  static getPredefinedUsers() {
    return {
      validUser: {
        email: 'test.user@example.com',
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
      },
      adminUser: {
        email: 'admin@example.com',
        password: 'AdminPassword123!',
        firstName: 'Admin',
        lastName: 'User',
      },
      lockedUser: {
        email: 'locked.user@example.com',
        password: 'LockedPassword123!',
        firstName: 'Locked',
        lastName: 'User',
      },
    };
  }

  /**
   * Get test data based on environment
   */
  static getEnvironmentSpecificData(environment: string = 'dev') {
    const baseData = {
      baseUrl: 'https://demo.nopcommerce.com',
      timeout: 30000,
    };

    switch (environment.toLowerCase()) {
      case 'dev':
        return {
          ...baseData,
          testUser: this.getPredefinedUsers().validUser,
          enableDebugMode: true,
        };
      case 'staging':
        return {
          ...baseData,
          testUser: this.getPredefinedUsers().validUser,
          enableDebugMode: false,
        };
      case 'prod':
        return {
          ...baseData,
          testUser: this.getPredefinedUsers().validUser,
          enableDebugMode: false,
          timeout: 60000,
        };
      default:
        return {
          ...baseData,
          testUser: this.getPredefinedUsers().validUser,
          enableDebugMode: true,
        };
    }
  }
}
