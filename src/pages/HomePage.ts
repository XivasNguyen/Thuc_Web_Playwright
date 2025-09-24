import { Page, Locator } from '@playwright/test';
import { BasePage } from './base/BasePage';

/**
 * Home Page Object class
 */
export class HomePage extends BasePage {
  // Locators
  private readonly searchBox: Locator;
  private readonly searchButton: Locator;
  private readonly computersCategory: Locator;
  private readonly electronicsCategory: Locator;

  constructor(page: Page) {
    super(page);
    this.searchBox = page.locator('#small-searchterms');
    this.searchButton = page.locator('button[type="submit"]').first();
    this.computersCategory = page.locator('a[href="/computers"]');
    this.electronicsCategory = page.locator('a[href="/electronics"]');
  }

  /**
   * Navigate to home page
   */
  async navigateToHomePage(): Promise<void> {
    await this.navigateTo(this.baseUrl);
    await this.waitForPageLoad();
  }

  /**
   * Search for a product
   */
  async searchForProduct(searchTerm: string): Promise<void> {
    await this.searchBox.fill(searchTerm);
    await this.searchButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Navigate to a category
   */
  async navigateToCategory(categoryName: string): Promise<void> {
    switch (categoryName.toLowerCase()) {
      case 'computers':
        await this.computersCategory.click();
        break;
      case 'electronics':
        await this.electronicsCategory.click();
        break;
      default:
        throw new Error(`Category ${categoryName} not supported`);
    }
    await this.waitForPageLoad();
  }

  /**
   * Verify home page is loaded
   */
  async verifyHomePageLoaded(): Promise<void> {
    await this.waitForElement(this.searchBox);
    await this.waitForElement(this.computersCategory);
  }
}
