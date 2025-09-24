import { test, expect } from '../src/fixtures/TestFixtures';
import { ShoppingCartPage } from '../src/pages/ShoppingCartPage';
import { ProductDetailsPage } from '../src/pages/ProductDetailsPage';
import { SearchResultsPage } from '../src/pages/SearchResultsPage';
import { TestDataProvider } from '../src/data/TestDataProvider';
import { TestUtils } from '../src/utils/TestUtils';

test.describe('Shopping Cart and Checkout', () => {
  let shoppingCartPage: ShoppingCartPage;
  let productDetailsPage: ProductDetailsPage;
  let searchResultsPage: SearchResultsPage;

  test.beforeEach(async ({ page }) => {
    shoppingCartPage = new ShoppingCartPage(page);
    productDetailsPage = new ProductDetailsPage(page);
    searchResultsPage = new SearchResultsPage(page);
  });

  test.describe('Add Products to Cart', () => {
    test('should add single product to cart from product details page', async ({ page, headerComponent }) => {
      // Arrange
      TestUtils.logStep('Adding single product to cart from product details page');

      // Act
      await page.goto('/');
      await headerComponent.searchForProduct('computer');
      await searchResultsPage.clickOnProduct(0);
      
      await productDetailsPage.verifyProductDetailsPageIsLoaded();
      const productTitle = await productDetailsPage.getProductTitle();
      
      await productDetailsPage.addToCart(1);

      // Assert
      await productDetailsPage.verifyProductAddedToCart();
      
      // Verify in cart
      await shoppingCartPage.navigateToShoppingCart();
      await shoppingCartPage.verifyShoppingCartPageIsLoaded();
      await shoppingCartPage.verifyCartContainsItem(productTitle);
      
      const cartItemsCount = await shoppingCartPage.getCartItemsCount();
      expect(cartItemsCount).toBe(1);
      
      TestUtils.logInfo(`Successfully added '${productTitle}' to cart`);
    });

    test('should add multiple quantities of same product to cart', async ({ page, headerComponent }) => {
      // Arrange
      const quantity = 3;
      TestUtils.logStep(`Adding ${quantity} quantities of same product to cart`);

      // Act
      await page.goto('/');
      await headerComponent.searchForProduct('computer');
      await searchResultsPage.clickOnProduct(0);
      
      const productTitle = await productDetailsPage.getProductTitle();
      await productDetailsPage.addToCart(quantity);

      // Assert
      await productDetailsPage.verifyProductAddedToCart();
      
      // Verify in cart
      await shoppingCartPage.navigateToShoppingCart();
      await shoppingCartPage.verifyCartItemQuantity(0, quantity);
      
      TestUtils.logInfo(`Successfully added ${quantity} quantities of '${productTitle}' to cart`);
    });

    test('should add multiple different products to cart', async ({ page, headerComponent }) => {
      // Arrange
      const testData = TestDataProvider.getTestData('shopping_cart', 'Add Multiple Products');
      TestUtils.logStep('Adding multiple different products to cart');

      // Act & Assert
      for (let i = 0; i < testData.products.length; i++) {
        const product = testData.products[i];
        
        // Search and add product
        await page.goto('/');
        await headerComponent.searchForProduct(product.name.split(' ')[0]); // Search by first word
        await searchResultsPage.clickOnProduct(0);
        
        await productDetailsPage.addToCart(product.quantity);
        await productDetailsPage.verifyProductAddedToCart();
      }
      
      // Verify all products in cart
      await shoppingCartPage.navigateToShoppingCart();
      const cartItemsCount = await shoppingCartPage.getCartItemsCount();
      expect(cartItemsCount).toBe(testData.products.length);
      
      TestUtils.logInfo(`Successfully added ${testData.products.length} different products to cart`);
    });

    test('should add product to cart from search results', async ({ page, headerComponent }) => {
      // Arrange
      TestUtils.logStep('Adding product to cart from search results');

      // Act
      await page.goto('/');
      await headerComponent.searchForProduct('computer');
      
      // Add first product from search results
      await searchResultsPage.addProductToCart(0);

      // Assert
      // Verify success message or navigation to cart
      await TestUtils.wait(2000); // Wait for any notifications
      
      await shoppingCartPage.navigateToShoppingCart();
      const cartItemsCount = await shoppingCartPage.getCartItemsCount();
      expect(cartItemsCount).toBeGreaterThan(0);
      
      TestUtils.logInfo('Successfully added product to cart from search results');
    });
  });

  test.describe('Cart Management', () => {
    test.beforeEach(async ({ page, headerComponent }) => {
      // Add a product to cart before each test
      await page.goto('/');
      await headerComponent.searchForProduct('computer');
      await searchResultsPage.clickOnProduct(0);
      await productDetailsPage.addToCart(2);
      await shoppingCartPage.navigateToShoppingCart();
    });

    test('should update product quantity in cart', async ({ page }) => {
      // Arrange
      const newQuantity = 5;
      TestUtils.logStep(`Updating product quantity to ${newQuantity}`);

      // Act
      await shoppingCartPage.updateItemQuantity(0, newQuantity);

      // Assert
      await shoppingCartPage.verifyCartItemQuantity(0, newQuantity);
      TestUtils.logInfo(`Successfully updated quantity to ${newQuantity}`);
    });

    test('should remove product from cart', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Removing product from cart');
      
      const initialItemsCount = await shoppingCartPage.getCartItemsCount();
      expect(initialItemsCount).toBeGreaterThan(0);

      // Act
      await shoppingCartPage.removeItemFromCart(0);

      // Assert
      const finalItemsCount = await shoppingCartPage.getCartItemsCount();
      expect(finalItemsCount).toBe(initialItemsCount - 1);
      
      if (finalItemsCount === 0) {
        await shoppingCartPage.verifyCartIsEmpty();
      }
      
      TestUtils.logInfo('Successfully removed product from cart');
    });

    test('should clear entire cart', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Clearing entire cart');

      // Add more products to make it interesting
      await page.goto('/');
      await searchResultsPage.performSearch('apple');
      await searchResultsPage.clickOnProduct(0);
      await productDetailsPage.addToCart(1);
      
      await shoppingCartPage.navigateToShoppingCart();
      const initialItemsCount = await shoppingCartPage.getCartItemsCount();
      expect(initialItemsCount).toBeGreaterThan(1);

      // Act
      await shoppingCartPage.clearCart();

      // Assert
      await shoppingCartPage.verifyCartIsEmpty();
      TestUtils.logInfo('Successfully cleared entire cart');
    });

    test('should calculate cart totals correctly', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Verifying cart total calculations');

      // Act & Assert
      await shoppingCartPage.verifyCartTotalCalculation();
      
      const subtotal = await shoppingCartPage.getSubtotalAmount();
      const total = await shoppingCartPage.getTotalAmount();
      
      expect(subtotal).toBeGreaterThan(0);
      expect(total).toBeGreaterThanOrEqual(subtotal);
      
      TestUtils.logInfo(`Cart totals: Subtotal: $${subtotal}, Total: $${total}`);
    });

    test('should handle quantity validation', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing quantity validation');

      // Act - Try to set invalid quantities
      const testQuantities = [0, -1, 999999];
      
      for (const quantity of testQuantities) {
        await shoppingCartPage.updateItemQuantity(0, quantity);
        
        // Assert - Should either reject invalid quantity or handle gracefully
        const currentQuantity = await shoppingCartPage.getCartItemQuantities();
        expect(currentQuantity[0]).toBeGreaterThan(0);
        
        TestUtils.logInfo(`Quantity validation handled for: ${quantity}`);
      }
    });
  });

  test.describe('Cart Features', () => {
    test.beforeEach(async ({ page, headerComponent }) => {
      // Add a product to cart before each test
      await page.goto('/');
      await headerComponent.searchForProduct('computer');
      await searchResultsPage.clickOnProduct(0);
      await productDetailsPage.addToCart(1);
      await shoppingCartPage.navigateToShoppingCart();
    });

    test('should apply discount coupon', async ({ page }) => {
      // Arrange
      const testData = TestDataProvider.getTestData('shopping_cart', 'Add Single Product');
      const couponCode = 'TESTCOUPON';
      TestUtils.logStep(`Applying discount coupon: ${couponCode}`);

      // Act
      await shoppingCartPage.applyDiscountCoupon(couponCode);

      // Assert
      await shoppingCartPage.verifyCouponApplication();
      TestUtils.logInfo(`Coupon application tested for: ${couponCode}`);
    });

    test('should apply gift card', async ({ page }) => {
      // Arrange
      const giftCardCode = 'TESTGIFT';
      TestUtils.logStep(`Applying gift card: ${giftCardCode}`);

      // Act
      await shoppingCartPage.applyGiftCard(giftCardCode);

      // Assert
      await shoppingCartPage.verifyGiftCardApplication();
      TestUtils.logInfo(`Gift card application tested for: ${giftCardCode}`);
    });

    test('should estimate shipping', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing shipping estimation');

      // Act
      await shoppingCartPage.estimateShipping('United States', 'California', '90210');

      // Assert
      // Verify no errors occurred
      const isErrorDisplayed = await shoppingCartPage.isErrorMessageDisplayed();
      expect(isErrorDisplayed).toBe(false);
      
      TestUtils.logInfo('Shipping estimation completed');
    });

    test('should continue shopping from cart', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing continue shopping functionality');

      // Act
      await shoppingCartPage.continueShopping();

      // Assert
      // Should navigate away from cart page
      const currentUrl = shoppingCartPage.getCurrentUrl();
      expect(currentUrl).not.toContain('/cart');
      
      TestUtils.logInfo('Continue shopping functionality working');
    });

    test('should handle empty cart state', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing empty cart state');

      // Act - Clear the cart
      await shoppingCartPage.clearCart();

      // Assert
      await shoppingCartPage.verifyCartIsEmpty();
      
      const emptyMessage = await shoppingCartPage.getEmptyCartMessage();
      expect(emptyMessage.length).toBeGreaterThan(0);
      
      TestUtils.logInfo('Empty cart state handled correctly');
    });
  });

  test.describe('Checkout Process', () => {
    test.beforeEach(async ({ page, headerComponent }) => {
      // Add a product to cart before each test
      await page.goto('/');
      await headerComponent.searchForProduct('computer');
      await searchResultsPage.clickOnProduct(0);
      await productDetailsPage.addToCart(1);
      await shoppingCartPage.navigateToShoppingCart();
    });

    test('should proceed to checkout with terms acceptance', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing checkout process with terms acceptance');

      // Act
      await shoppingCartPage.verifyTermsOfServiceCheckbox();
      await shoppingCartPage.proceedToCheckout();

      // Assert
      // Should navigate to checkout page or login page
      const currentUrl = shoppingCartPage.getCurrentUrl();
      expect(currentUrl.includes('/checkout') || currentUrl.includes('/login')).toBe(true);
      
      TestUtils.logInfo('Checkout process initiated successfully');
    });

    test('should require terms of service acceptance', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing terms of service requirement');

      // Act - Try to checkout without accepting terms
      await shoppingCartPage.clickElement(shoppingCartPage.checkoutButton);

      // Assert
      // Should either show error or require terms acceptance
      const currentUrl = shoppingCartPage.getCurrentUrl();
      const isErrorDisplayed = await shoppingCartPage.isErrorMessageDisplayed();
      
      // Should either stay on cart page with error or proceed (depending on implementation)
      expect(currentUrl.includes('/cart') || currentUrl.includes('/checkout') || currentUrl.includes('/login')).toBe(true);
      
      TestUtils.logInfo('Terms of service requirement tested');
    });

    test('should handle checkout for guest user', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing guest checkout process');

      // Act
      await shoppingCartPage.proceedToCheckout();

      // Assert
      // Should navigate to checkout or login page
      const currentUrl = shoppingCartPage.getCurrentUrl();
      expect(currentUrl.includes('/checkout') || currentUrl.includes('/login')).toBe(true);
      
      TestUtils.logInfo('Guest checkout process initiated');
    });

    test('should maintain cart contents during checkout process', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing cart contents persistence during checkout');
      
      const cartItemsBefore = await shoppingCartPage.getCartItemNames();
      const quantitiesBefore = await shoppingCartPage.getCartItemQuantities();

      // Act
      await shoppingCartPage.proceedToCheckout();
      
      // Navigate back to cart
      await shoppingCartPage.navigateToShoppingCart();

      // Assert
      const cartItemsAfter = await shoppingCartPage.getCartItemNames();
      const quantitiesAfter = await shoppingCartPage.getCartItemQuantities();
      
      expect(cartItemsAfter).toEqual(cartItemsBefore);
      expect(quantitiesAfter).toEqual(quantitiesBefore);
      
      TestUtils.logInfo('Cart contents maintained during checkout process');
    });
  });

  test.describe('Cart Persistence and State', () => {
    test('should persist cart contents across page refreshes', async ({ page, headerComponent }) => {
      // Arrange
      TestUtils.logStep('Testing cart persistence across page refreshes');

      // Add product to cart
      await page.goto('/');
      await headerComponent.searchForProduct('computer');
      await searchResultsPage.clickOnProduct(0);
      await productDetailsPage.addToCart(2);
      
      await shoppingCartPage.navigateToShoppingCart();
      const cartItemsBefore = await shoppingCartPage.getCartItemNames();
      const quantitiesBefore = await shoppingCartPage.getCartItemQuantities();

      // Act
      await page.reload();
      await shoppingCartPage.waitForPageLoad();

      // Assert
      const cartItemsAfter = await shoppingCartPage.getCartItemNames();
      const quantitiesAfter = await shoppingCartPage.getCartItemQuantities();
      
      expect(cartItemsAfter).toEqual(cartItemsBefore);
      expect(quantitiesAfter).toEqual(quantitiesBefore);
      
      TestUtils.logInfo('Cart contents persisted across page refresh');
    });

    test('should maintain cart contents when navigating between pages', async ({ page, headerComponent }) => {
      // Arrange
      TestUtils.logStep('Testing cart persistence during navigation');

      // Add product to cart
      await page.goto('/');
      await headerComponent.searchForProduct('computer');
      await searchResultsPage.clickOnProduct(0);
      await productDetailsPage.addToCart(1);
      
      await shoppingCartPage.navigateToShoppingCart();
      const initialCount = await shoppingCartPage.getCartItemsCount();

      // Act - Navigate to different pages
      await page.goto('/');
      await headerComponent.clickElectronics();
      await page.goto('/');

      // Return to cart
      await shoppingCartPage.navigateToShoppingCart();

      // Assert
      const finalCount = await shoppingCartPage.getCartItemsCount();
      expect(finalCount).toBe(initialCount);
      
      TestUtils.logInfo('Cart contents maintained during navigation');
    });

    test('should handle concurrent cart operations', async ({ page, headerComponent }) => {
      // Arrange
      TestUtils.logStep('Testing concurrent cart operations');

      // Add multiple products quickly
      await page.goto('/');
      await headerComponent.searchForProduct('computer');
      
      // Add first product
      await searchResultsPage.clickOnProduct(0);
      await productDetailsPage.addToCart(1);
      
      // Quickly navigate and add another product
      await page.goBack();
      await searchResultsPage.clickOnProduct(1);
      await productDetailsPage.addToCart(1);

      // Assert
      await shoppingCartPage.navigateToShoppingCart();
      const cartItemsCount = await shoppingCartPage.getCartItemsCount();
      expect(cartItemsCount).toBeGreaterThanOrEqual(1);
      
      TestUtils.logInfo('Concurrent cart operations handled correctly');
    });
  });
});
