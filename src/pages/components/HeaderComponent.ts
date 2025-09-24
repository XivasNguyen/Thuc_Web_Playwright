import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';

/**
 * Header component that appears on all pages
 */
export class HeaderComponent extends BasePage {
  // Header elements
  private readonly logo: Locator;
  private readonly searchBox: Locator;
  private readonly searchButton: Locator;
  private readonly registerLink: Locator;
  private readonly loginLink: Locator;
  private readonly logoutLink: Locator;
  private readonly myAccountLink: Locator;
  private readonly wishlistLink: Locator;
  private readonly shoppingCartLink: Locator;
  private readonly currencySelector: Locator;

  // Navigation menu
  private readonly computersMenu: Locator;
  private readonly electronicsMenu: Locator;
  private readonly apparelMenu: Locator;
  private readonly digitalDownloadsMenu: Locator;
  private readonly booksMenu: Locator;
  private readonly jewelryMenu: Locator;
  private readonly giftCardsMenu: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize header elements
    this.logo = page.locator('a[href="/"]').first();
    this.searchBox = page.locator('input[id="small-searchterms"]');
    this.searchButton = page.locator('button[type="submit"]').filter({ hasText: 'Search' });
    this.registerLink = page.locator('a[href*="/register"]');
    this.loginLink = page.locator('a[href*="/login"]');
    this.logoutLink = page.locator('a[href*="/logout"]');
    this.myAccountLink = page.locator('a[href*="/customer/info"]');
    this.wishlistLink = page.locator('a[href*="/wishlist"]');
    this.shoppingCartLink = page.locator('a[href*="/cart"]');
    this.currencySelector = page.locator('#customerCurrency');

    // Initialize navigation menu
    this.computersMenu = page.locator('a[href*="/computers"]').first();
    this.electronicsMenu = page.locator('a[href*="/electronics"]').first();
    this.apparelMenu = page.locator('a[href*="/apparel"]').first();
    this.digitalDownloadsMenu = page.locator('a[href*="/digital-downloads"]').first();
    this.booksMenu = page.locator('a[href*="/books"]').first();
    this.jewelryMenu = page.locator('a[href*="/jewelry"]').first();
    this.giftCardsMenu = page.locator('a[href*="/gift-cards"]').first();
  }

  /**
   * Click on the logo to go to home page
   */
  async clickLogo(): Promise<void> {
    await this.clickElement(this.logo);
  }

  /**
   * Search for a product
   */
  async searchForProduct(searchTerm: string): Promise<void> {
    await this.fillField(this.searchBox, searchTerm);
    await this.clickElement(this.searchButton);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to register page
   */
  async clickRegister(): Promise<void> {
    await this.clickElement(this.registerLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to login page
   */
  async clickLogin(): Promise<void> {
    await this.clickElement(this.loginLink);
    await this.waitForPageLoad();
  }

  /**
   * Logout user
   */
  async clickLogout(): Promise<void> {
    await this.clickElement(this.logoutLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to my account page
   */
  async clickMyAccount(): Promise<void> {
    await this.clickElement(this.myAccountLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to wishlist
   */
  async clickWishlist(): Promise<void> {
    await this.clickElement(this.wishlistLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to shopping cart
   */
  async clickShoppingCart(): Promise<void> {
    await this.clickElement(this.shoppingCartLink);
    await this.waitForPageLoad();
  }

  /**
   * Change currency
   */
  async changeCurrency(currency: string): Promise<void> {
    await this.selectDropdownOption(this.currencySelector, currency);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Computers category
   */
  async clickComputers(): Promise<void> {
    await this.clickElement(this.computersMenu);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Electronics category
   */
  async clickElectronics(): Promise<void> {
    await this.clickElement(this.electronicsMenu);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Apparel category
   */
  async clickApparel(): Promise<void> {
    await this.clickElement(this.apparelMenu);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Digital Downloads category
   */
  async clickDigitalDownloads(): Promise<void> {
    await this.clickElement(this.digitalDownloadsMenu);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Books category
   */
  async clickBooks(): Promise<void> {
    await this.clickElement(this.booksMenu);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Jewelry category
   */
  async clickJewelry(): Promise<void> {
    await this.clickElement(this.jewelryMenu);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Gift Cards category
   */
  async clickGiftCards(): Promise<void> {
    await this.clickElement(this.giftCardsMenu);
    await this.waitForPageLoad();
  }

  /**
   * Get shopping cart count
   */
  async getShoppingCartCount(): Promise<string> {
    const cartText = await this.getElementText(this.shoppingCartLink);
    const match = cartText.match(/\((\d+)\)/);
    return match ? match[1] : '0';
  }

  /**
   * Get wishlist count
   */
  async getWishlistCount(): Promise<string> {
    const wishlistText = await this.getElementText(this.wishlistLink);
    const match = wishlistText.match(/\((\d+)\)/);
    return match ? match[1] : '0';
  }

  /**
   * Check if user is logged in
   */
  async isUserLoggedIn(): Promise<boolean> {
    return await this.isElementVisible(this.myAccountLink);
  }

  /**
   * Get current currency
   */
  async getCurrentCurrency(): Promise<string> {
    return await this.getElementAttribute(this.currencySelector, 'value') || 'USD';
  }

  /**
   * Verify header is displayed
   */
  async verifyHeaderIsDisplayed(): Promise<void> {
    await this.waitForElement(this.logo);
    await this.waitForElement(this.searchBox);
    await this.waitForElement(this.registerLink);
  }
}
