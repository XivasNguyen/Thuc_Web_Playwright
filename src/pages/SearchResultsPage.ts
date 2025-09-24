import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base/BasePage';

/**
 * Search Results Page Object
 */
export class SearchResultsPage extends BasePage {
  // Search elements
  private readonly searchBox: Locator;
  private readonly searchButton: Locator;
  private readonly searchTerm: Locator;

  // Results elements
  private readonly productItems: Locator;
  private readonly productTitles: Locator;
  private readonly productPrices: Locator;
  private readonly productImages: Locator;
  private readonly addToCartButtons: Locator;
  private readonly addToWishlistButtons: Locator;
  private readonly addToCompareButtons: Locator;

  // Pagination
  private readonly paginationContainer: Locator;
  private readonly nextPageButton: Locator;
  private readonly previousPageButton: Locator;
  private readonly pageNumbers: Locator;

  // Sorting and filtering
  private readonly sortByDropdown: Locator;
  private readonly displayModeGrid: Locator;
  private readonly displayModeList: Locator;
  private readonly pageSize: Locator;

  // Filter options
  private readonly priceRangeFilter: Locator;
  private readonly manufacturerFilter: Locator;
  private readonly specificationFilters: Locator;

  // Messages
  private readonly noResultsMessage: Locator;
  private readonly resultsCount: Locator;
  private readonly searchWarning: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize search elements
    this.searchBox = page.locator('#small-searchterms');
    this.searchButton = page.locator('button[type="submit"]').filter({ hasText: 'Search' });
    this.searchTerm = page.locator('.search-term');

    // Initialize results elements
    this.productItems = page.locator('.product-item');
    this.productTitles = page.locator('.product-title a');
    this.productPrices = page.locator('.price');
    this.productImages = page.locator('.product-item img');
    this.addToCartButtons = page.locator('button[value="Add to cart"]');
    this.addToWishlistButtons = page.locator('button[title*="Add to wishlist"]');
    this.addToCompareButtons = page.locator('button[title*="Add to compare list"]');

    // Initialize pagination
    this.paginationContainer = page.locator('.pager');
    this.nextPageButton = page.locator('.next-page');
    this.previousPageButton = page.locator('.previous-page');
    this.pageNumbers = page.locator('.individual-page');

    // Initialize sorting and filtering
    this.sortByDropdown = page.locator('#products-orderby');
    this.displayModeGrid = page.locator('.grid-icon');
    this.displayModeList = page.locator('.list-icon');
    this.pageSize = page.locator('#products-pagesize');

    // Initialize filter options
    this.priceRangeFilter = page.locator('.price-range-filter');
    this.manufacturerFilter = page.locator('.manufacturer-filter');
    this.specificationFilters = page.locator('.specification-filter');

    // Initialize messages
    this.noResultsMessage = page.locator('.no-result');
    this.resultsCount = page.locator('.product-selectors .results');
    this.searchWarning = page.locator('.search-results .warning');
  }

  /**
   * Perform search
   */
  async performSearch(searchTerm: string): Promise<void> {
    await this.fillField(this.searchBox, searchTerm, { clear: true });
    await this.clickElement(this.searchButton);
    await this.waitForPageLoad();
  }

  /**
   * Get search results count
   */
  async getSearchResultsCount(): Promise<number> {
    const productItems = await this.productItems.count();
    return productItems;
  }

  /**
   * Get product titles from search results
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
   * Get product prices from search results
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
   * Go to next page
   */
  async goToNextPage(): Promise<void> {
    await this.clickElement(this.nextPageButton);
    await this.waitForPageLoad();
  }

  /**
   * Go to previous page
   */
  async goToPreviousPage(): Promise<void> {
    await this.clickElement(this.previousPageButton);
    await this.waitForPageLoad();
  }

  /**
   * Go to specific page
   */
  async goToPage(pageNumber: number): Promise<void> {
    const pageLink = this.page.locator(`.individual-page a[href*="page=${pageNumber}"]`);
    await this.clickElement(pageLink);
    await this.waitForPageLoad();
  }

  /**
   * Add product to cart by index
   */
  async addProductToCart(productIndex: number): Promise<void> {
    const addToCartButton = this.addToCartButtons.nth(productIndex);
    await this.clickElement(addToCartButton);
    await this.waitForPageLoad();
  }

  /**
   * Add product to wishlist by index
   */
  async addProductToWishlist(productIndex: number): Promise<void> {
    const addToWishlistButton = this.addToWishlistButtons.nth(productIndex);
    await this.clickElement(addToWishlistButton);
    await this.waitForPageLoad();
  }

  /**
   * Add product to compare list by index
   */
  async addProductToCompareList(productIndex: number): Promise<void> {
    const addToCompareButton = this.addToCompareButtons.nth(productIndex);
    await this.clickElement(addToCompareButton);
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
   * Check if no results message is displayed
   */
  async isNoResultsMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.noResultsMessage);
  }

  /**
   * Get no results message text
   */
  async getNoResultsMessage(): Promise<string> {
    return await this.getElementText(this.noResultsMessage);
  }

  /**
   * Check if search warning is displayed
   */
  async isSearchWarningDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.searchWarning);
  }

  /**
   * Get search warning text
   */
  async getSearchWarningText(): Promise<string> {
    return await this.getElementText(this.searchWarning);
  }

  /**
   * Get current search term
   */
  async getCurrentSearchTerm(): Promise<string> {
    if (await this.isElementVisible(this.searchTerm)) {
      return await this.getElementText(this.searchTerm);
    }
    return await this.searchBox.inputValue();
  }

  /**
   * Verify search results contain term
   */
  async verifySearchResultsContainTerm(searchTerm: string): Promise<void> {
    const productTitles = await this.getProductTitles();
    expect(productTitles.length).toBeGreaterThan(0);
    
    const containsSearchTerm = productTitles.some(title => 
      title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(containsSearchTerm).toBe(true);
  }

  /**
   * Verify no search results
   */
  async verifyNoSearchResults(): Promise<void> {
    const isNoResultsDisplayed = await this.isNoResultsMessageDisplayed();
    expect(isNoResultsDisplayed).toBe(true);
    
    const resultsCount = await this.getSearchResultsCount();
    expect(resultsCount).toBe(0);
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
   * Verify pagination is working
   */
  async verifyPaginationIsWorking(): Promise<void> {
    const isPaginationVisible = await this.isElementVisible(this.paginationContainer);
    if (isPaginationVisible) {
      const isNextButtonVisible = await this.isElementVisible(this.nextPageButton);
      expect(isNextButtonVisible).toBe(true);
    }
  }

  /**
   * Get current page number
   */
  async getCurrentPageNumber(): Promise<number> {
    const currentPageElement = this.page.locator('.current-page');
    if (await this.isElementVisible(currentPageElement)) {
      const pageText = await this.getElementText(currentPageElement);
      return parseInt(pageText);
    }
    return 1;
  }

  /**
   * Get total pages count
   */
  async getTotalPagesCount(): Promise<number> {
    const pageNumbers = await this.pageNumbers.all();
    if (pageNumbers.length > 0) {
      const lastPageElement = pageNumbers[pageNumbers.length - 1];
      const lastPageText = await lastPageElement.textContent();
      return lastPageText ? parseInt(lastPageText) : 1;
    }
    return 1;
  }

  /**
   * Verify search results page is loaded
   */
  async verifySearchResultsPageIsLoaded(): Promise<void> {
    await this.waitForElement(this.searchBox);
    await this.waitForElement(this.searchButton);
    
    // Check if we have results or no results message
    const hasResults = await this.getSearchResultsCount() > 0;
    const hasNoResultsMessage = await this.isNoResultsMessageDisplayed();
    
    expect(hasResults || hasNoResultsMessage).toBe(true);
  }

  /**
   * Get product information by index
   */
  async getProductInformation(productIndex: number): Promise<{
    title: string;
    price: string;
    imageAlt: string;
  }> {
    const titleElement = this.productTitles.nth(productIndex);
    const priceElement = this.productPrices.nth(productIndex);
    const imageElement = this.productImages.nth(productIndex);
    
    const title = await this.getElementText(titleElement);
    const price = await this.getElementText(priceElement);
    const imageAlt = await this.getElementAttribute(imageElement, 'alt') || '';
    
    return { title, price, imageAlt };
  }

  /**
   * Search for product and verify results
   */
  async searchAndVerifyResults(searchTerm: string, expectedMinResults: number = 1): Promise<void> {
    await this.performSearch(searchTerm);
    await this.verifySearchResultsPageIsLoaded();

    const resultsCount = await this.getSearchResultsCount();
    expect(resultsCount).toBeGreaterThanOrEqual(expectedMinResults);

    if (resultsCount > 0) {
      await this.verifySearchResultsContainTerm(searchTerm);
    }
  }

  /**
   * Navigate to search page
   */
  async navigateToSearchPage(): Promise<void> {
    await this.navigateTo('/search');
    await this.waitForPageLoad();
  }

  /**
   * Verify search results are displayed
   */
  async verifySearchResultsDisplayed(): Promise<void> {
    await this.waitForElement(this.productItems.first());
    const productCount = await this.productItems.count();
    expect(productCount).toBeGreaterThan(0);
  }

  /**
   * Verify no search results or error
   */
  async verifyNoSearchResultsOrError(): Promise<void> {
    try {
      await this.waitForElement(this.noResultsMessage, 5000);
    } catch {
      // If no results message is not found, check if we're still on search page
      const url = await this.page.url();
      expect(url).toContain('search');
    }
  }

  /**
   * Verify no products found message
   */
  async verifyNoProductsFoundMessage(): Promise<void> {
    await this.waitForElement(this.noResultsMessage);
    const message = await this.noResultsMessage.textContent();
    expect(message?.toLowerCase()).toContain('no products');
  }
}
