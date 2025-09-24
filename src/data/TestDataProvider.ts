/**
 * Test Data Provider for managing test data across different test scenarios
 */
export class TestDataProvider {
  /**
   * Valid user registration test data sets
   */
  static readonly VALID_REGISTRATION_DATA = [
    {
      testCase: 'Standard Registration',
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe.test@example.com',
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!',
        company: 'Test Company Inc.',
        gender: 'Male' as const,
        newsletter: true,
      },
    },
    {
      testCase: 'Registration with Special Characters',
      data: {
        firstName: "O'Connor",
        lastName: 'Smith-Jones',
        email: 'oconnor.smith-jones@example.com',
        password: 'P@ssw0rd!2023',
        confirmPassword: 'P@ssw0rd!2023',
        company: 'O\'Connor & Associates',
        gender: 'Female' as const,
        newsletter: false,
      },
    },
    {
      testCase: 'Registration with Long Names',
      data: {
        firstName: 'Bartholomew',
        lastName: 'Constantinopolous',
        email: 'bartholomew.constantinopolous@example.com',
        password: 'VeryLongPassword123!@#',
        confirmPassword: 'VeryLongPassword123!@#',
        company: 'Very Long Company Name International Corporation Ltd.',
        gender: 'Male' as const,
        newsletter: true,
      },
    },
  ];

  /**
   * Invalid user registration test data sets
   */
  static readonly INVALID_REGISTRATION_DATA = [
    {
      testCase: 'Invalid Email Format',
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'invalid-email',
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
      },
      expectedError: 'Wrong email',
    },
    {
      testCase: 'Password Mismatch',
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test.mismatch@example.com',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!',
      },
      expectedError: 'The password and confirmation password do not match',
    },
    {
      testCase: 'Weak Password',
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test.weak@example.com',
        password: '123',
        confirmPassword: '123',
      },
      expectedError: 'Password must meet the following rules',
    },
    {
      testCase: 'Empty Required Fields',
      data: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      expectedError: 'First name is required',
    },
    {
      testCase: 'Existing Email',
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'existing.user@example.com',
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
      },
      expectedError: 'The specified email already exists',
    },
  ];

  /**
   * Valid login test data sets
   */
  static readonly VALID_LOGIN_DATA = [
    {
      testCase: 'Standard Login',
      data: {
        email: 'test.user@example.com',
        password: 'TestPassword123!',
        rememberMe: false,
      },
    },
    {
      testCase: 'Login with Remember Me',
      data: {
        email: 'test.user@example.com',
        password: 'TestPassword123!',
        rememberMe: true,
      },
    },
  ];

  /**
   * Invalid login test data sets
   */
  static readonly INVALID_LOGIN_DATA = [
    {
      testCase: 'Invalid Email',
      data: {
        email: 'nonexistent@example.com',
        password: 'TestPassword123!',
      },
      expectedError: 'Login was unsuccessful',
    },
    {
      testCase: 'Invalid Password',
      data: {
        email: 'test.user@example.com',
        password: 'WrongPassword123!',
      },
      expectedError: 'Login was unsuccessful',
    },
    {
      testCase: 'Empty Credentials',
      data: {
        email: '',
        password: '',
      },
      expectedError: 'Please enter your email',
    },
  ];

  /**
   * Product search test data sets
   */
  static readonly PRODUCT_SEARCH_DATA = [
    {
      testCase: 'Search for Computers',
      data: {
        searchTerm: 'computer',
        expectedResults: ['Build your own computer', 'Desktop', 'Notebook'],
      },
    },
    {
      testCase: 'Search for Apple Products',
      data: {
        searchTerm: 'apple',
        expectedResults: ['Apple MacBook Pro', 'Apple iPhone'],
      },
    },
    {
      testCase: 'Search for Non-existent Product',
      data: {
        searchTerm: 'nonexistentproduct123',
        expectedResults: [],
        expectedMessage: 'No products were found',
      },
    },
    {
      testCase: 'Empty Search',
      data: {
        searchTerm: '',
        expectedBehavior: 'show_all_products',
      },
    },
  ];

  /**
   * Category browsing test data sets
   */
  static readonly CATEGORY_DATA = [
    {
      testCase: 'Computers Category',
      data: {
        category: 'Computers',
        subcategories: ['Desktops', 'Notebooks', 'Software'],
        expectedProducts: ['Build your own computer', 'Digital Storm VANQUISH 3'],
      },
    },
    {
      testCase: 'Electronics Category',
      data: {
        category: 'Electronics',
        subcategories: ['Camera & photo', 'Cell phones'],
        expectedProducts: ['HTC One M8 Android L 5.0 Lollipop', 'Beats Pill 2.0 Wireless Speaker'],
      },
    },
    {
      testCase: 'Notebooks Subcategory',
      data: {
        category: 'Computers',
        subcategory: 'Notebooks',
        expectedProducts: ['Apple MacBook Pro 13-inch', 'Asus N551JK-XO076H Laptop'],
      },
    },
  ];

  /**
   * Product filtering test data sets
   */
  static readonly FILTER_DATA = [
    {
      testCase: 'Price Filter Low to High',
      data: {
        category: 'Computers',
        priceRange: { min: 500, max: 2000 },
        sortBy: 'Price: Low to High',
        expectedBehavior: 'products_sorted_by_price_ascending',
      },
    },
    {
      testCase: 'Manufacturer Filter',
      data: {
        category: 'Computers',
        manufacturer: 'Apple',
        expectedProducts: ['Apple MacBook Pro'],
      },
    },
    {
      testCase: 'Combined Filters',
      data: {
        category: 'Electronics',
        priceRange: { min: 100, max: 300 },
        manufacturer: 'HTC',
        sortBy: 'Name: A to Z',
        expectedBehavior: 'filtered_and_sorted_results',
      },
    },
  ];

  /**
   * Shopping cart test data sets
   */
  static readonly SHOPPING_CART_DATA = [
    {
      testCase: 'Add Single Product',
      data: {
        product: 'Build your own computer',
        quantity: 1,
        expectedTotal: 1200.00,
      },
    },
    {
      testCase: 'Add Multiple Products',
      data: {
        products: [
          { name: 'Build your own computer', quantity: 2 },
          { name: 'Apple MacBook Pro', quantity: 1 },
        ],
        expectedTotal: 4200.00, // (1200 * 2) + 1800
      },
    },
    {
      testCase: 'Update Quantity',
      data: {
        product: 'Build your own computer',
        initialQuantity: 1,
        updatedQuantity: 3,
        expectedTotal: 3600.00, // 1200 * 3
      },
    },
  ];

  /**
   * Checkout test data sets
   */
  static readonly CHECKOUT_DATA = [
    {
      testCase: 'Guest Checkout',
      data: {
        userType: 'guest',
        billingAddress: {
          firstName: 'Guest',
          lastName: 'User',
          email: 'guest.checkout@example.com',
          company: 'Guest Company',
          country: 'United States',
          state: 'California',
          city: 'Los Angeles',
          address1: '123 Guest Street',
          zipCode: '90210',
          phone: '+1234567890',
        },
        paymentMethod: 'Credit Card',
        shippingMethod: 'Ground',
      },
    },
    {
      testCase: 'Registered User Checkout',
      data: {
        userType: 'registered',
        email: 'test.user@example.com',
        password: 'TestPassword123!',
        useExistingAddress: true,
        paymentMethod: 'Credit Card',
        shippingMethod: 'Next Day Air',
      },
    },
  ];

  /**
   * Password reset test data sets
   */
  static readonly PASSWORD_RESET_DATA = [
    {
      testCase: 'Valid Email Reset',
      data: {
        email: 'test.user@example.com',
        expectedMessage: 'Email with instructions has been sent to you',
      },
    },
    {
      testCase: 'Invalid Email Reset',
      data: {
        email: 'nonexistent@example.com',
        expectedMessage: 'Email with instructions has been sent to you', // Same message for security
      },
    },
    {
      testCase: 'Empty Email Reset',
      data: {
        email: '',
        expectedError: 'Enter your email',
      },
    },
  ];

  /**
   * Address management test data sets
   */
  static readonly ADDRESS_DATA = [
    {
      testCase: 'Add New Address',
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        company: 'Doe Enterprises',
        country: 'United States',
        state: 'California',
        city: 'San Francisco',
        address1: '123 Market Street',
        address2: 'Suite 456',
        zipCode: '94105',
        phone: '+14155551234',
        fax: '+14155551235',
      },
    },
    {
      testCase: 'International Address',
      data: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        country: 'United Kingdom',
        city: 'London',
        address1: '10 Downing Street',
        zipCode: 'SW1A 2AA',
        phone: '+442071234567',
      },
    },
  ];

  /**
   * Newsletter subscription test data sets
   */
  static readonly NEWSLETTER_DATA = [
    {
      testCase: 'Valid Subscription',
      data: {
        email: 'newsletter.test@example.com',
        expectedMessage: 'Thank you for signing up',
      },
    },
    {
      testCase: 'Invalid Email Subscription',
      data: {
        email: 'invalid-email',
        expectedError: 'Wrong email',
      },
    },
    {
      testCase: 'Existing Subscription',
      data: {
        email: 'existing.subscriber@example.com',
        expectedMessage: 'Thank you for signing up', // Or appropriate existing subscriber message
      },
    },
  ];

  /**
   * Get test data by category and test case
   */
  static getTestData(category: string, testCase: string): any {
    const categoryData = this.getTestDataByCategory(category);
    const testData = categoryData.find((data: any) => data.testCase === testCase);
    return testData ? testData.data : null;
  }

  /**
   * Get all test data for a specific category
   */
  static getTestDataByCategory(category: string): any[] {
    switch (category.toLowerCase()) {
      case 'valid_registration':
        return this.VALID_REGISTRATION_DATA;
      case 'invalid_registration':
        return this.INVALID_REGISTRATION_DATA;
      case 'valid_login':
        return this.VALID_LOGIN_DATA;
      case 'invalid_login':
        return this.INVALID_LOGIN_DATA;
      case 'product_search':
        return this.PRODUCT_SEARCH_DATA;
      case 'category':
        return this.CATEGORY_DATA;
      case 'filter':
        return this.FILTER_DATA;
      case 'shopping_cart':
        return this.SHOPPING_CART_DATA;
      case 'checkout':
        return this.CHECKOUT_DATA;
      case 'password_reset':
        return this.PASSWORD_RESET_DATA;
      case 'address':
        return this.ADDRESS_DATA;
      case 'newsletter':
        return this.NEWSLETTER_DATA;
      default:
        throw new Error(`Unknown test data category: ${category}`);
    }
  }

  /**
   * Get random test data from a category
   */
  static getRandomTestData(category: string): any {
    const categoryData = this.getTestDataByCategory(category);
    const randomIndex = Math.floor(Math.random() * categoryData.length);
    return categoryData[randomIndex];
  }

  /**
   * Get test data for specific environment
   */
  static getEnvironmentTestData(environment: string = 'dev'): any {
    const baseConfig = {
      timeout: 30000,
      retries: 2,
      headless: true,
    };

    switch (environment.toLowerCase()) {
      case 'dev':
        return {
          ...baseConfig,
          baseUrl: 'https://demo.nopcommerce.com',
          debugMode: true,
          slowMo: 100,
        };
      case 'staging':
        return {
          ...baseConfig,
          baseUrl: 'https://demo.nopcommerce.com',
          debugMode: false,
          timeout: 45000,
        };
      case 'prod':
        return {
          ...baseConfig,
          baseUrl: 'https://demo.nopcommerce.com',
          debugMode: false,
          timeout: 60000,
          retries: 3,
        };
      default:
        return {
          ...baseConfig,
          baseUrl: 'https://demo.nopcommerce.com',
          debugMode: true,
        };
    }
  }
}
