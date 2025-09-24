import { Page, Locator, expect } from '@playwright/test';
import { TEST_CONFIG } from '../../config/test-config';

/**
 * Base Page Object class that provides common functionality for all pages
 */
export abstract class BasePage {
  protected page: Page;
  protected baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = TEST_CONFIG.URLS.HOME;
  }

  /**
   * Navigate to a specific URL
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ 
      state: 'visible', 
      timeout: timeout || TEST_CONFIG.DEFAULT_TIMEOUT 
    });
  }

  /**
   * Wait for an element to be hidden
   */
  async waitForElementToHide(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ 
      state: 'hidden', 
      timeout: timeout || TEST_CONFIG.DEFAULT_TIMEOUT 
    });
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: TEST_CONFIG.FULL_PAGE_SCREENSHOTS
    });
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled
   */
  async isElementEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingToComplete(): Promise<void> {
    const loadingSpinner = this.page.locator(TEST_CONFIG.SELECTORS.LOADING_SPINNER);
    if (await this.isElementVisible(loadingSpinner)) {
      await this.waitForElementToHide(loadingSpinner);
    }
  }

  /**
   * Get error message if present
   */
  async getErrorMessage(): Promise<string | null> {
    const errorElement = this.page.locator(TEST_CONFIG.SELECTORS.ERROR_MESSAGE);
    if (await this.isElementVisible(errorElement)) {
      return await errorElement.textContent();
    }
    return null;
  }

  /**
   * Get success message if present
   */
  async getSuccessMessage(): Promise<string | null> {
    const successElement = this.page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE);
    if (await this.isElementVisible(successElement)) {
      return await successElement.textContent();
    }
    return null;
  }

  /**
   * Verify page title contains expected text
   */
  async verifyPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(expectedTitle, 'i'));
  }

  /**
   * Verify current URL contains expected path
   */
  async verifyCurrentUrl(expectedPath: string): Promise<void> {
    expect(this.getCurrentUrl()).toContain(expectedPath);
  }

  /**
   * Fill form field with retry mechanism
   */
  async fillField(locator: Locator, value: string, options?: { clear?: boolean }): Promise<void> {
    await this.waitForElement(locator);
    
    if (options?.clear) {
      await locator.clear();
    }
    
    await locator.fill(value);
    
    // Verify the value was entered correctly
    const actualValue = await locator.inputValue();
    if (actualValue !== value) {
      // Retry once if value doesn't match
      await locator.clear();
      await locator.fill(value);
    }
  }

  /**
   * Click element with retry mechanism
   */
  async clickElement(locator: Locator, options?: { force?: boolean }): Promise<void> {
    await this.waitForElement(locator);
    await this.scrollIntoView(locator);
    await locator.click(options);
  }

  /**
   * Select dropdown option
   */
  async selectDropdownOption(locator: Locator, value: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.selectOption(value);
  }

  /**
   * Upload file
   */
  async uploadFile(locator: Locator, filePath: string): Promise<void> {
    await locator.setInputFiles(filePath);
  }

  /**
   * Hover over element
   */
  async hoverElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.hover();
  }

  /**
   * Double click element
   */
  async doubleClickElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.dblclick();
  }

  /**
   * Right click element
   */
  async rightClickElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.click({ button: 'right' });
  }

  /**
   * Press key
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Type text
   */
  async typeText(text: string): Promise<void> {
    await this.page.keyboard.type(text);
  }

  /**
   * Get element text content
   */
  async getElementText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return await locator.textContent() || '';
  }

  /**
   * Get element attribute value
   */
  async getElementAttribute(locator: Locator, attribute: string): Promise<string | null> {
    await this.waitForElement(locator);
    return await locator.getAttribute(attribute);
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Refresh the page
   */
  async refreshPage(): Promise<void> {
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack({ waitUntil: 'networkidle' });
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    await this.page.goForward({ waitUntil: 'networkidle' });
  }
}
