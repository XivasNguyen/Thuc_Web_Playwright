import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base/BasePage';

/**
 * Category Page Object
 */
export class CategoryPage extends BasePage {
  // Category elements
  private readonly categoryTitle: Locator;
  private readonly categoryDescription: Locator;
  private readonly subcategoryList: Locator;
  private readonly subcategoryItems: Locator;

  // Product elements
  private readonly productItems: Locator;
  private readonly productTitles: Locator;
  private readonly productPrices: Locator;
  private readonly productImages: Locator;

  // Filtering elements
  private readonly priceRangeFilter: Locator;
  private readonly priceFromInput: Locator;
  private readonly priceToInput: Locator;
  private readonly filterByPriceButton: Locator;
  private readonly manufacturerFilter: Locator;
  private readonly manufacturerCheckboxes: Locator;
  private readonly specificationFilters: Locator;

  // Sorting elements
  private readonly sortByDropdown: Locator;
  private readonly displayModeGrid: Locator;
  private readonly displayModeList: Locator;
  private readonly pageSize: Locator;

  // Pagination
  private readonly paginationContainer: Locator;
  private readonly nextPageButton: Locator;
  private readonly previousPageButton: Locator;
  private readonly pageNumbers: Locator;

  // Breadcrumb
  private readonly breadcrumb: Locator;
  private readonly breadcrumbItems: Locator;

  // Messages
  private readonly noProductsMessage: Locator;
  private readonly resultsCount: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize category elements
    this.categoryTitle = page.locator('.page-title h1');
    this.categoryDescription = page.locator('.category-description');
    this.subcategoryList = page.locator('.sub-category-grid');
    this.subcategoryItems = page.locator('.sub-category-item');

    // Initialize product elements
    this.productItems = page.locator('.product-item');
    this.productTitles = page.locator('.product-title a');
    this.productPrices = page.locator('.price');
    this.productImages = page.locator('.product-item img');

    // Initialize filtering elements
    this.priceRangeFilter = page.locator('.price-range-filter');
    this.priceFromInput = page.locator('#price-from');
    this.priceToInput = page.locator('#price-to');
    this.filterByPriceButton = page.locator('button[value="Filter by price"]');
    this.manufacturerFilter = page.locator('.manufacturer-filter');
    this.manufacturerCheckboxes = page.locator('.manufacturer-filter input[type="checkbox"]');
    this.specificationFilters = page.locator('.specification-filter');

    // Initialize sorting elements
    this.sortByDropdown = page.locator('#products-orderby');
    this.displayModeGrid = page.locator('.grid-icon');
    this.displayModeList = page.locator('.list-icon');
    this.pageSize = page.locator('#products-pagesize');

    // Initialize pagination
    this.paginationContainer = page.locator('.pager');
    this.nextPageButton = page.locator('.next-page');
    this.previousPageButton = page.locator('.previous-page');
    this.pageNumbers = page.locator('.individual-page');

    // Initialize breadcrumb
    this.breadcrumb = page.locator('.breadcrumb');
    this.breadcrumbItems = page.locator('.breadcrumb a');

    // Initialize messages
    this.noProductsMessage = page.locator('.no-result');
    this.resultsCount = page.locator('.product-selectors .results');
  }

  /**
   * Navigate to category page
   */
  async navigateToCategory(categoryPath: string): Promise<void> {
    await this.navigateTo(categoryPath);
    await this.waitForPageLoad();
  }

  /**
   * Click on subcategory
   */
  async clickOnSubcategory(subcategoryName: string): Promise<void> {
    const subcategory = this.page.locator(`.sub-category-item a:has-text("${subcategoryName}")`);
    await this.clickElement(subcategory);
    await this.waitForPageLoad();
  }

  /**
   * Get category title
   */
  async getCategoryTitle(): Promise<string> {
    return await this.getElementText(this.categoryTitle);
  }

  /**
   * Get subcategories list
   */
  async getSubcategories(): Promise<string[]> {
    const subcategories: string[] = [];
    const subcategoryElements = await this.subcategoryItems.all();
    
    for (const element of subcategoryElements) {
      const titleElement = element.locator('h2 a');
      const title = await titleElement.textContent();
      if (title) {
        subcategories.push(title.trim());
      }
    }
    
    return subcategories;
  }

  /**
   * Get product count
   */
  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  /**
   * Get product titles
   */
  async getProductTitles(): Promise<string[]> {
    const titles: string[] = [];
    const titleElements = await this.productTitles.all();
    
    for (const element of titleElements) {
      const title = await element.textContent();
      if (title) {
        titles.push(title.trim());
      }
    }
    
    return titles;
  }

  /**
   * Get product prices
   */
  async getProductPrices(): Promise<number[]> {
    const prices: number[] = [];
    const priceElements = await this.productPrices.all();
    
    for (const element of priceElements) {
      const priceText = await element.textContent();
      if (priceText) {
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        if (!isNaN(price)) {
          prices.push(price);
        }
      }
    }
    
    return prices;
  }

  /**
   * Filter by price range
   */
  async filterByPriceRange(minPrice: number, maxPrice: number): Promise<void> {
    if (await this.isElementVisible(this.priceFromInput)) {
      await this.fillField(this.priceFromInput, minPrice.toString());
    }
    if (await this.isElementVisible(this.priceToInput)) {
      await this.fillField(this.priceToInput, maxPrice.toString());
    }
    if (await this.isElementVisible(this.filterByPriceButton)) {
      await this.clickElement(this.filterByPriceButton);
      await this.waitForPageLoad();
    }
  }

  /**
   * Filter by manufacturer
   */
  async filterByManufacturer(manufacturerName: string): Promise<void> {
    const manufacturerCheckbox = this.page.locator(
      `.manufacturer-filter input[type="checkbox"][value*="${manufacturerName}"]`
    );
    
    if (await this.isElementVisible(manufacturerCheckbox)) {
      await this.clickElement(manufacturerCheckbox);
      await this.waitForPageLoad();
    }
  }

  /**
   * Get available manufacturers
   */
  async getAvailableManufacturers(): Promise<string[]> {
    const manufacturers: string[] = [];
    const manufacturerElements = await this.manufacturerCheckboxes.all();
    
    for (const element of manufacturerElements) {
      const label = await element.locator('+ label').textContent();
      if (label) {
        manufacturers.push(label.trim());
      }
    }
    
    return manufacturers;
  }

  /**
   * Sort products by option
   */
  async sortProductsBy(sortOption: string): Promise<void> {
    await this.selectDropdownOption(this.sortByDropdown, sortOption);
    await this.waitForPageLoad();
  }

  /**
   * Change page size
   */
  async changePageSize(size: string): Promise<void> {
    await this.selectDropdownOption(this.pageSize, size);
    await this.waitForPageLoad();
  }

  /**
   * Switch to grid view
   */
  async switchToGridView(): Promise<void> {
    await this.clickElement(this.displayModeGrid);
    await this.waitForPageLoad();
  }

  /**
   * Switch to list view
   */
  async switchToListView(): Promise<void> {
    await this.clickElement(this.displayModeList);
    await this.waitForPageLoad();
  }

  /**
   * Click on product by index
   */
  async clickOnProduct(productIndex: number): Promise<void> {
    const productTitle = this.productTitles.nth(productIndex);
    await this.clickElement(productTitle);
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
  async clickOnBreadcrumbItem(itemText: string): Promise<void> {
    const breadcrumbItem = this.page.locator(`.breadcrumb a:has-text("${itemText}")`);
    await this.clickElement(breadcrumbItem);
    await this.waitForPageLoad();
  }

  /**
   * Verify category page is loaded
   */
  async verifyCategoryPageIsLoaded(expectedCategoryName?: string): Promise<void> {
    await this.waitForElement(this.categoryTitle);
    
    if (expectedCategoryName) {
      const categoryTitle = await this.getCategoryTitle();
      expect(categoryTitle.toLowerCase()).toContain(expectedCategoryName.toLowerCase());
    }
    
    // Verify either products or subcategories are present
    const hasProducts = await this.getProductCount() > 0;
    const hasSubcategories = await this.subcategoryItems.count() > 0;
    
    expect(hasProducts || hasSubcategories).toBe(true);
  }

  /**
   * Verify products are filtered by price range
   */
  async verifyProductsFilteredByPriceRange(minPrice: number, maxPrice: number): Promise<void> {
    const prices = await this.getProductPrices();
    expect(prices.length).toBeGreaterThan(0);
    
    for (const price of prices) {
      expect(price).toBeGreaterThanOrEqual(minPrice);
      expect(price).toBeLessThanOrEqual(maxPrice);
    }
  }

  /**
   * Verify products are filtered by manufacturer
   */
  async verifyProductsFilteredByManufacturer(manufacturerName: string): Promise<void> {
    const productTitles = await this.getProductTitles();
    expect(productTitles.length).toBeGreaterThan(0);
    
    // This is a simplified check - in a real scenario, you might need to check product details
    const containsManufacturer = productTitles.some(title => 
      title.toLowerCase().includes(manufacturerName.toLowerCase())
    );
    expect(containsManufacturer).toBe(true);
  }

  /**
   * Verify products are sorted by price (low to high)
   */
  async verifyProductsSortedByPriceLowToHigh(): Promise<void> {
    const prices = await this.getProductPrices();
    expect(prices.length).toBeGreaterThan(1);
    
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  }

  /**
   * Verify products are sorted by price (high to low)
   */
  async verifyProductsSortedByPriceHighToLow(): Promise<void> {
    const prices = await this.getProductPrices();
    expect(prices.length).toBeGreaterThan(1);
    
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
    }
  }

  /**
   * Verify products are sorted alphabetically (A to Z)
   */
  async verifyProductsSortedAlphabeticallyAtoZ(): Promise<void> {
    const titles = await this.getProductTitles();
    expect(titles.length).toBeGreaterThan(1);
    
    for (let i = 1; i < titles.length; i++) {
      expect(titles[i].toLowerCase()).toBeGreaterThanOrEqual(titles[i - 1].toLowerCase());
    }
  }

  /**
   * Verify products are sorted alphabetically (Z to A)
   */
  async verifyProductsSortedAlphabeticallyZtoA(): Promise<void> {
    const titles = await this.getProductTitles();
    expect(titles.length).toBeGreaterThan(1);
    
    for (let i = 1; i < titles.length; i++) {
      expect(titles[i].toLowerCase()).toBeLessThanOrEqual(titles[i - 1].toLowerCase());
    }
  }

  /**
   * Verify subcategories are displayed
   */
  async verifySubcategoriesAreDisplayed(expectedSubcategories: string[]): Promise<void> {
    const actualSubcategories = await this.getSubcategories();
    
    for (const expectedSubcategory of expectedSubcategories) {
      const isPresent = actualSubcategories.some(subcategory => 
        subcategory.toLowerCase().includes(expectedSubcategory.toLowerCase())
      );
      expect(isPresent).toBe(true);
    }
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
   * Check if no products message is displayed
   */
  async isNoProductsMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.noProductsMessage);
  }

  /**
   * Get no products message
   */
  async getNoProductsMessage(): Promise<string> {
    return await this.getElementText(this.noProductsMessage);
  }

  /**
   * Verify computers category is loaded
   */
  async verifyComputersCategoryLoaded(): Promise<void> {
    await this.waitForElement(this.categoryTitle);
    const title = await this.categoryTitle.textContent();
    expect(title?.toLowerCase()).toContain('computers');
  }

  /**
   * Navigate to subcategory
   */
  async navigateToSubcategory(subcategoryName: string): Promise<void> {
    const subcategory = this.page.locator(`a:has-text("${subcategoryName}")`);
    await subcategory.click();
    await this.waitForPageLoad();
  }

  /**
   * Verify notebooks subcategory is loaded
   */
  async verifyNotebooksSubcategoryLoaded(): Promise<void> {
    await this.waitForElement(this.categoryTitle);
    const title = await this.categoryTitle.textContent();
    expect(title?.toLowerCase()).toContain('notebooks');
  }

  /**
   * Verify products are displayed
   */
  async verifyProductsDisplayed(): Promise<void> {
    await this.waitForElement(this.productItems.first());
    const productCount = await this.productItems.count();
    expect(productCount).toBeGreaterThan(0);
  }

  /**
   * Verify breadcrumb navigation
   */
  async verifyBreadcrumb(expectedItems: string[]): Promise<void> {
    await this.waitForElement(this.breadcrumb);
    const breadcrumbText = await this.breadcrumb.textContent();
    for (const item of expectedItems) {
      expect(breadcrumbText).toContain(item);
    }
  }

  /**
   * Click breadcrumb item
   */
  async clickBreadcrumbItem(itemName: string): Promise<void> {
    const breadcrumbItem = this.page.locator(`.breadcrumb a:has-text("${itemName}")`);
    await breadcrumbItem.click();
    await this.waitForPageLoad();
  }

  /**
   * Sort products by price
   */
  async sortProductsByPrice(order: 'low-to-high' | 'high-to-low'): Promise<void> {
    const sortValue = order === 'low-to-high' ? 'Price: Low to High' : 'Price: High to Low';
    await this.sortByDropdown.selectOption({ label: sortValue });
    await this.waitForPageLoad();
  }

  /**
   * Verify products are sorted by price
   */
  async verifyProductsSortedByPrice(order: 'ascending' | 'descending'): Promise<void> {
    await this.waitForElement(this.productPrices.first());
    const prices = await this.productPrices.allTextContents();
    const numericPrices = prices.map(price => parseFloat(price.replace(/[^0-9.]/g, '')));

    for (let i = 1; i < numericPrices.length; i++) {
      if (order === 'ascending') {
        expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i - 1]);
      } else {
        expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i - 1]);
      }
    }
  }

  /**
   * Verify products are in price range
   */
  async verifyProductsInPriceRange(minPrice: number, maxPrice: number): Promise<void> {
    await this.waitForElement(this.productPrices.first());
    const prices = await this.productPrices.allTextContents();
    const numericPrices = prices.map(price => parseFloat(price.replace(/[^0-9.]/g, '')));

    for (const price of numericPrices) {
      expect(price).toBeGreaterThanOrEqual(minPrice);
      expect(price).toBeLessThanOrEqual(maxPrice);
    }
  }
}
