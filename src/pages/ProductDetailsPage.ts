import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base/BasePage';

/**
 * Product Details Page Object
 */
export class ProductDetailsPage extends BasePage {
  // Product information
  private readonly productTitle: Locator;
  private readonly productPrice: Locator;
  private readonly productDescription: Locator;
  private readonly productImages: Locator;
  private readonly productMainImage: Locator;
  private readonly productThumbnails: Locator;

  // Product options
  private readonly quantityInput: Locator;
  private readonly addToCartButton: Locator;
  private readonly addToWishlistButton: Locator;
  private readonly addToCompareButton: Locator;

  // Product specifications
  private readonly productSpecifications: Locator;
  private readonly productAttributes: Locator;

  // Reviews section
  private readonly reviewsSection: Locator;
  private readonly writeReviewButton: Locator;
  private readonly reviewItems: Locator;

  // Related products
  private readonly relatedProducts: Locator;
  private readonly relatedProductItems: Locator;

  // Messages
  private readonly successMessage: Locator;
  private readonly errorMessage: Locator;
  private readonly warningMessage: Locator;

  // Breadcrumb
  private readonly breadcrumb: Locator;
  private readonly breadcrumbItems: Locator;

  // Product availability
  private readonly availabilityInfo: Locator;
  private readonly stockQuantity: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize product information
    this.productTitle = page.locator('.product-name h1');
    this.productPrice = page.locator('.price-value-1');
    this.productDescription = page.locator('.product-collateral .full-description');
    this.productImages = page.locator('.product-essential .picture img');
    this.productMainImage = page.locator('.product-main-picture img');
    this.productThumbnails = page.locator('.picture-thumbs img');

    // Initialize product options
    this.quantityInput = page.locator('#addtocart_1_EnteredQuantity');
    this.addToCartButton = page.locator('#add-to-cart-button-1');
    this.addToWishlistButton = page.locator('#add-to-wishlist-button-1');
    this.addToCompareButton = page.locator('#add-to-compare-list-button-1');

    // Initialize product specifications
    this.productSpecifications = page.locator('.product-collateral .product-specs');
    this.productAttributes = page.locator('.attributes');

    // Initialize reviews section
    this.reviewsSection = page.locator('.product-review-list');
    this.writeReviewButton = page.locator('.write-product-review');
    this.reviewItems = page.locator('.product-review-item');

    // Initialize related products
    this.relatedProducts = page.locator('.related-products');
    this.relatedProductItems = page.locator('.related-products .product-item');

    // Initialize messages
    this.successMessage = page.locator('.bar-notification.success');
    this.errorMessage = page.locator('.bar-notification.error');
    this.warningMessage = page.locator('.bar-notification.warning');

    // Initialize breadcrumb
    this.breadcrumb = page.locator('.breadcrumb');
    this.breadcrumbItems = page.locator('.breadcrumb a');

    // Initialize product availability
    this.availabilityInfo = page.locator('.availability');
    this.stockQuantity = page.locator('.stock-quantity');
  }

  /**
   * Navigate to product details page
   */
  async navigateToProduct(productUrl: string): Promise<void> {
    await this.navigateTo(productUrl);
    await this.waitForPageLoad();
  }

  /**
   * Get product title
   */
  async getProductTitle(): Promise<string> {
    return await this.getElementText(this.productTitle);
  }

  /**
   * Get product price
   */
  async getProductPrice(): Promise<string> {
    return await this.getElementText(this.productPrice);
  }

  /**
   * Get product description
   */
  async getProductDescription(): Promise<string> {
    return await this.getElementText(this.productDescription);
  }

  /**
   * Set quantity
   */
  async setQuantity(quantity: number): Promise<void> {
    await this.fillField(this.quantityInput, quantity.toString(), { clear: true });
  }

  /**
   * Get current quantity
   */
  async getCurrentQuantity(): Promise<number> {
    const quantityValue = await this.quantityInput.inputValue();
    return parseInt(quantityValue) || 1;
  }

  /**
   * Add product to cart
   */
  async addToCart(quantity: number = 1): Promise<void> {
    await this.setQuantity(quantity);
    await this.clickElement(this.addToCartButton);
    await this.waitForPageLoad();
  }

  /**
   * Add product to wishlist
   */
  async addToWishlist(): Promise<void> {
    await this.clickElement(this.addToWishlistButton);
    await this.waitForPageLoad();
  }

  /**
   * Add product to compare list
   */
  async addToCompareList(): Promise<void> {
    await this.clickElement(this.addToCompareButton);
    await this.waitForPageLoad();
  }

  /**
   * Click on product thumbnail
   */
  async clickProductThumbnail(thumbnailIndex: number): Promise<void> {
    const thumbnail = this.productThumbnails.nth(thumbnailIndex);
    await this.clickElement(thumbnail);
    await this.waitForPageLoad();
  }

  /**
   * Get product specifications
   */
  async getProductSpecifications(): Promise<Record<string, string>> {
    const specifications: Record<string, string> = {};
    
    if (await this.isElementVisible(this.productSpecifications)) {
      const specElements = await this.productSpecifications.locator('tr').all();
      
      for (const specElement of specElements) {
        const labelElement = specElement.locator('td').first();
        const valueElement = specElement.locator('td').last();
        
        const label = await labelElement.textContent();
        const value = await valueElement.textContent();
        
        if (label && value) {
          specifications[label.trim()] = value.trim();
        }
      }
    }
    
    return specifications;
  }

  /**
   * Get product reviews count
   */
  async getProductReviewsCount(): Promise<number> {
    if (await this.isElementVisible(this.reviewsSection)) {
      return await this.reviewItems.count();
    }
    return 0;
  }

  /**
   * Get related products count
   */
  async getRelatedProductsCount(): Promise<number> {
    if (await this.isElementVisible(this.relatedProducts)) {
      return await this.relatedProductItems.count();
    }
    return 0;
  }

  /**
   * Click on related product
   */
  async clickRelatedProduct(productIndex: number): Promise<void> {
    const relatedProduct = this.relatedProductItems.nth(productIndex);
    const productLink = relatedProduct.locator('.product-title a');
    await this.clickElement(productLink);
    await this.waitForPageLoad();
  }

  /**
   * Get breadcrumb items
   */
  async getBreadcrumbItems(): Promise<string[]> {
    const breadcrumbItems: string[] = [];
    const breadcrumbElements = await this.breadcrumbItems.all();
    
    for (const element of breadcrumbElements) {
      const text = await element.textContent();
      if (text) {
        breadcrumbItems.push(text.trim());
      }
    }
    
    return breadcrumbItems;
  }

  /**
   * Click on breadcrumb item
   */
  async clickBreadcrumbItem(itemText: string): Promise<void> {
    const breadcrumbItem = this.page.locator(`.breadcrumb a:has-text("${itemText}")`);
    await this.clickElement(breadcrumbItem);
    await this.waitForPageLoad();
  }

  /**
   * Check if product is in stock
   */
  async isProductInStock(): Promise<boolean> {
    if (await this.isElementVisible(this.availabilityInfo)) {
      const availabilityText = await this.getElementText(this.availabilityInfo);
      return availabilityText.toLowerCase().includes('in stock');
    }
    return true; // Assume in stock if no availability info
  }

  /**
   * Get stock quantity
   */
  async getStockQuantity(): Promise<number | null> {
    if (await this.isElementVisible(this.stockQuantity)) {
      const stockText = await this.getElementText(this.stockQuantity);
      const match = stockText.match(/(\d+)/);
      return match ? parseInt(match[1]) : null;
    }
    return null;
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
   * Verify product details page is loaded
   */
  async verifyProductDetailsPageIsLoaded(expectedProductName?: string): Promise<void> {
    await this.waitForElement(this.productTitle);
    await this.waitForElement(this.productPrice);
    await this.waitForElement(this.addToCartButton);
    
    if (expectedProductName) {
      const productTitle = await this.getProductTitle();
      expect(productTitle.toLowerCase()).toContain(expectedProductName.toLowerCase());
    }
  }

  /**
   * Verify product was added to cart successfully
   */
  async verifyProductAddedToCart(): Promise<void> {
    const isSuccessDisplayed = await this.isSuccessMessageDisplayed();
    expect(isSuccessDisplayed).toBe(true);
    
    const successMessage = await this.getSuccessMessage();
    expect(successMessage.toLowerCase()).toContain('added to your shopping cart');
  }

  /**
   * Verify product was added to wishlist successfully
   */
  async verifyProductAddedToWishlist(): Promise<void> {
    const isSuccessDisplayed = await this.isSuccessMessageDisplayed();
    expect(isSuccessDisplayed).toBe(true);
    
    const successMessage = await this.getSuccessMessage();
    expect(successMessage.toLowerCase()).toContain('added to wishlist');
  }

  /**
   * Verify product was added to compare list successfully
   */
  async verifyProductAddedToCompareList(): Promise<void> {
    const isSuccessDisplayed = await this.isSuccessMessageDisplayed();
    expect(isSuccessDisplayed).toBe(true);
    
    const successMessage = await this.getSuccessMessage();
    expect(successMessage.toLowerCase()).toContain('added to compare list');
  }

  /**
   * Verify product information is complete
   */
  async verifyProductInformationIsComplete(): Promise<void> {
    const title = await this.getProductTitle();
    const price = await this.getProductPrice();
    
    expect(title.length).toBeGreaterThan(0);
    expect(price.length).toBeGreaterThan(0);
    
    // Verify main image is present
    await this.waitForElement(this.productMainImage);
    
    // Verify add to cart button is present and enabled
    await this.waitForElement(this.addToCartButton);
    const isAddToCartEnabled = await this.isElementEnabled(this.addToCartButton);
    expect(isAddToCartEnabled).toBe(true);
  }

  /**
   * Verify breadcrumb navigation
   */
  async verifyBreadcrumbNavigation(expectedItems: string[]): Promise<void> {
    const breadcrumbItems = await this.getBreadcrumbItems();
    
    for (const expectedItem of expectedItems) {
      const isPresent = breadcrumbItems.some(item => 
        item.toLowerCase().includes(expectedItem.toLowerCase())
      );
      expect(isPresent).toBe(true);
    }
  }

  /**
   * Get product information summary
   */
  async getProductInformationSummary(): Promise<{
    title: string;
    price: string;
    description: string;
    inStock: boolean;
    reviewsCount: number;
    relatedProductsCount: number;
  }> {
    const title = await this.getProductTitle();
    const price = await this.getProductPrice();
    const description = await this.getProductDescription();
    const inStock = await this.isProductInStock();
    const reviewsCount = await this.getProductReviewsCount();
    const relatedProductsCount = await this.getRelatedProductsCount();
    
    return {
      title,
      price,
      description,
      inStock,
      reviewsCount,
      relatedProductsCount,
    };
  }
}
