import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base/BasePage';

/**
 * Shopping Cart Page Object
 */
export class ShoppingCartPage extends BasePage {
  // Cart elements
  private readonly cartItems: Locator;
  private readonly cartItemNames: Locator;
  private readonly cartItemPrices: Locator;
  private readonly cartItemQuantities: Locator;
  private readonly cartItemSubtotals: Locator;
  private readonly removeItemButtons: Locator;
  private readonly updateCartButton: Locator;
  private readonly continueShoppingButton: Locator;

  // Quantity controls
  private readonly quantityInputs: Locator;
  private readonly quantityUpdateButtons: Locator;

  // Cart totals
  private readonly subtotalAmount: Locator;
  private readonly shippingAmount: Locator;
  private readonly taxAmount: Locator;
  private readonly totalAmount: Locator;

  // Checkout elements
  private readonly checkoutButton: Locator;
  private readonly termsOfServiceCheckbox: Locator;
  private readonly termsOfServiceLink: Locator;

  // Coupon and gift card
  private readonly discountCouponInput: Locator;
  private readonly applyCouponButton: Locator;
  private readonly giftCardInput: Locator;
  private readonly applyGiftCardButton: Locator;

  // Messages
  private readonly emptyCartMessage: Locator;
  private readonly successMessage: Locator;
  private readonly errorMessage: Locator;
  private readonly warningMessage: Locator;

  // Estimate shipping
  private readonly estimateShippingSection: Locator;
  private readonly countryDropdown: Locator;
  private readonly stateDropdown: Locator;
  private readonly zipCodeInput: Locator;
  private readonly estimateShippingButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize cart elements
    this.cartItems = page.locator('.cart-item-row');
    this.cartItemNames = page.locator('.product-name a');
    this.cartItemPrices = page.locator('.product-unit-price');
    this.cartItemQuantities = page.locator('.qty-input');
    this.cartItemSubtotals = page.locator('.product-subtotal');
    this.removeItemButtons = page.locator('button[name="removefromcart"]');
    this.updateCartButton = page.locator('button[name="updatecart"]');
    this.continueShoppingButton = page.locator('button[name="continueshopping"]');

    // Initialize quantity controls
    this.quantityInputs = page.locator('input[name*="quantity"]');
    this.quantityUpdateButtons = page.locator('button[name="updatecart"]');

    // Initialize cart totals
    this.subtotalAmount = page.locator('.cart-total-left .value-summary');
    this.shippingAmount = page.locator('.shipping-cost .value-summary');
    this.taxAmount = page.locator('.tax-value .value-summary');
    this.totalAmount = page.locator('.order-total .value-summary');

    // Initialize checkout elements
    this.checkoutButton = page.locator('#checkout');
    this.termsOfServiceCheckbox = page.locator('#termsofservice');
    this.termsOfServiceLink = page.locator('a[href*="conditionsofuse"]');

    // Initialize coupon and gift card
    this.discountCouponInput = page.locator('#discountcouponcode');
    this.applyCouponButton = page.locator('button[name="applydiscountcouponcode"]');
    this.giftCardInput = page.locator('#giftcardcouponcode');
    this.applyGiftCardButton = page.locator('button[name="applygiftcardcouponcode"]');

    // Initialize messages
    this.emptyCartMessage = page.locator('.no-data');
    this.successMessage = page.locator('.bar-notification.success');
    this.errorMessage = page.locator('.bar-notification.error');
    this.warningMessage = page.locator('.bar-notification.warning');

    // Initialize estimate shipping
    this.estimateShippingSection = page.locator('.estimate-shipping');
    this.countryDropdown = page.locator('#CountryId');
    this.stateDropdown = page.locator('#StateProvinceId');
    this.zipCodeInput = page.locator('#ZipPostalCode');
    this.estimateShippingButton = page.locator('button[name="estimateshipping"]');
  }

  /**
   * Navigate to shopping cart page
   */
  async navigateToShoppingCart(): Promise<void> {
    await this.navigateTo('/cart');
    await this.waitForPageLoad();
  }

  /**
   * Get cart items count
   */
  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Get cart item names
   */
  async getCartItemNames(): Promise<string[]> {
    const names: string[] = [];
    const nameElements = await this.cartItemNames.all();
    
    for (const element of nameElements) {
      const name = await element.textContent();
      if (name) {
        names.push(name.trim());
      }
    }
    
    return names;
  }

  /**
   * Get cart item quantities
   */
  async getCartItemQuantities(): Promise<number[]> {
    const quantities: number[] = [];
    const quantityElements = await this.cartItemQuantities.all();
    
    for (const element of quantityElements) {
      const quantity = await element.inputValue();
      quantities.push(parseInt(quantity) || 0);
    }
    
    return quantities;
  }

  /**
   * Update item quantity
   */
  async updateItemQuantity(itemIndex: number, newQuantity: number): Promise<void> {
    const quantityInput = this.quantityInputs.nth(itemIndex);
    await this.fillField(quantityInput, newQuantity.toString(), { clear: true });
    await this.clickElement(this.updateCartButton);
    await this.waitForPageLoad();
  }

  /**
   * Remove item from cart
   */
  async removeItemFromCart(itemIndex: number): Promise<void> {
    const removeButton = this.removeItemButtons.nth(itemIndex);
    await this.clickElement(removeButton);
    await this.waitForPageLoad();
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<void> {
    const itemsCount = await this.getCartItemsCount();
    
    for (let i = itemsCount - 1; i >= 0; i--) {
      await this.removeItemFromCart(i);
    }
  }

  /**
   * Get subtotal amount
   */
  async getSubtotalAmount(): Promise<number> {
    const subtotalText = await this.getElementText(this.subtotalAmount);
    return parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
  }

  /**
   * Get total amount
   */
  async getTotalAmount(): Promise<number> {
    const totalText = await this.getElementText(this.totalAmount);
    return parseFloat(totalText.replace(/[^0-9.]/g, ''));
  }

  /**
   * Apply discount coupon
   */
  async applyDiscountCoupon(couponCode: string): Promise<void> {
    await this.fillField(this.discountCouponInput, couponCode);
    await this.clickElement(this.applyCouponButton);
    await this.waitForPageLoad();
  }

  /**
   * Apply gift card
   */
  async applyGiftCard(giftCardCode: string): Promise<void> {
    await this.fillField(this.giftCardInput, giftCardCode);
    await this.clickElement(this.applyGiftCardButton);
    await this.waitForPageLoad();
  }

  /**
   * Accept terms of service
   */
  async acceptTermsOfService(): Promise<void> {
    if (await this.isElementVisible(this.termsOfServiceCheckbox)) {
      const isChecked = await this.termsOfServiceCheckbox.isChecked();
      if (!isChecked) {
        await this.clickElement(this.termsOfServiceCheckbox);
      }
    }
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout(): Promise<void> {
    await this.acceptTermsOfService();
    await this.clickElement(this.checkoutButton);
    await this.waitForPageLoad();
  }

  /**
   * Continue shopping
   */
  async continueShopping(): Promise<void> {
    await this.clickElement(this.continueShoppingButton);
    await this.waitForPageLoad();
  }

  /**
   * Estimate shipping
   */
  async estimateShipping(country: string, state?: string, zipCode?: string): Promise<void> {
    if (await this.isElementVisible(this.estimateShippingSection)) {
      await this.selectDropdownOption(this.countryDropdown, country);
      
      if (state && await this.isElementVisible(this.stateDropdown)) {
        await this.selectDropdownOption(this.stateDropdown, state);
      }
      
      if (zipCode) {
        await this.fillField(this.zipCodeInput, zipCode);
      }
      
      await this.clickElement(this.estimateShippingButton);
      await this.waitForPageLoad();
    }
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    return await this.isElementVisible(this.emptyCartMessage);
  }

  /**
   * Get empty cart message
   */
  async getEmptyCartMessage(): Promise<string> {
    return await this.getElementText(this.emptyCartMessage);
  }

  /**
   * Check if success message is displayed
   */
  async isSuccessMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.successMessage);
  }

  /**
   * Get success message
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getElementText(this.successMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    return await this.getElementText(this.errorMessage);
  }

  /**
   * Verify shopping cart page is loaded
   */
  async verifyShoppingCartPageIsLoaded(): Promise<void> {
    await this.verifyPageTitle('Shopping cart');
    
    // Check if cart has items or is empty
    const hasItems = await this.getCartItemsCount() > 0;
    const isEmpty = await this.isCartEmpty();
    
    expect(hasItems || isEmpty).toBe(true);
  }

  /**
   * Verify cart contains item
   */
  async verifyCartContainsItem(itemName: string): Promise<void> {
    const cartItemNames = await this.getCartItemNames();
    const containsItem = cartItemNames.some(name => 
      name.toLowerCase().includes(itemName.toLowerCase())
    );
    expect(containsItem).toBe(true);
  }

  /**
   * Verify cart item quantity
   */
  async verifyCartItemQuantity(itemIndex: number, expectedQuantity: number): Promise<void> {
    const quantities = await this.getCartItemQuantities();
    expect(quantities[itemIndex]).toBe(expectedQuantity);
  }

  /**
   * Verify cart total calculation
   */
  async verifyCartTotalCalculation(): Promise<void> {
    const subtotal = await this.getSubtotalAmount();
    const total = await this.getTotalAmount();
    
    // Basic verification - total should be at least equal to subtotal
    expect(total).toBeGreaterThanOrEqual(subtotal);
  }

  /**
   * Verify cart is empty
   */
  async verifyCartIsEmpty(): Promise<void> {
    const isEmpty = await this.isCartEmpty();
    expect(isEmpty).toBe(true);
    
    const emptyMessage = await this.getEmptyCartMessage();
    expect(emptyMessage.toLowerCase()).toContain('cart is empty');
  }

  /**
   * Verify terms of service checkbox
   */
  async verifyTermsOfServiceCheckbox(): Promise<void> {
    if (await this.isElementVisible(this.termsOfServiceCheckbox)) {
      await this.waitForElement(this.termsOfServiceCheckbox);
      await this.waitForElement(this.termsOfServiceLink);
    }
  }

  /**
   * Get cart item details
   */
  async getCartItemDetails(itemIndex: number): Promise<{
    name: string;
    price: string;
    quantity: number;
    subtotal: string;
  }> {
    const nameElement = this.cartItemNames.nth(itemIndex);
    const priceElement = this.cartItemPrices.nth(itemIndex);
    const quantityElement = this.cartItemQuantities.nth(itemIndex);
    const subtotalElement = this.cartItemSubtotals.nth(itemIndex);
    
    const name = await this.getElementText(nameElement);
    const price = await this.getElementText(priceElement);
    const quantity = parseInt(await quantityElement.inputValue());
    const subtotal = await this.getElementText(subtotalElement);
    
    return { name, price, quantity, subtotal };
  }

  /**
   * Verify coupon application
   */
  async verifyCouponApplication(expectedDiscount?: number): Promise<void> {
    const isSuccessDisplayed = await this.isSuccessMessageDisplayed();
    const isErrorDisplayed = await this.isErrorMessageDisplayed();
    
    expect(isSuccessDisplayed || isErrorDisplayed).toBe(true);
    
    if (isSuccessDisplayed && expectedDiscount) {
      // Verify discount is applied to total
      const total = await this.getTotalAmount();
      expect(total).toBeLessThan(await this.getSubtotalAmount());
    }
  }

  /**
   * Verify gift card application
   */
  async verifyGiftCardApplication(expectedCredit?: number): Promise<void> {
    const isSuccessDisplayed = await this.isSuccessMessageDisplayed();
    const isErrorDisplayed = await this.isErrorMessageDisplayed();
    
    expect(isSuccessDisplayed || isErrorDisplayed).toBe(true);
    
    if (isSuccessDisplayed && expectedCredit) {
      // Verify gift card credit is applied
      const total = await this.getTotalAmount();
      expect(total).toBeLessThan(await this.getSubtotalAmount());
    }
  }
}
