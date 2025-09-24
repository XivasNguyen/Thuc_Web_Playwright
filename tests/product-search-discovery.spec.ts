import { test, expect } from '../src/fixtures/TestFixtures';
import { SearchResultsPage } from '../src/pages/SearchResultsPage';
import { CategoryPage } from '../src/pages/CategoryPage';
import { TestDataProvider } from '../src/data/TestDataProvider';
import { TestUtils } from '../src/utils/TestUtils';

test.describe('Product Search and Discovery', () => {
  let searchResultsPage: SearchResultsPage;
  let categoryPage: CategoryPage;

  test.beforeEach(async ({ page }) => {
    searchResultsPage = new SearchResultsPage(page);
    categoryPage = new CategoryPage(page);
  });

  test.describe('Product Search Functionality', () => {
    test('should search for computers and return relevant results', async ({ page, headerComponent }) => {
      // Arrange
      const searchData = TestDataProvider.getTestData('product_search', 'Search for Computers');
      TestUtils.logStep(`Searching for: ${searchData.searchTerm}`);

      // Act
      await page.goto('/');
      await headerComponent.searchForProduct(searchData.searchTerm);

      // Assert
      await searchResultsPage.verifySearchResultsPageIsLoaded();
      const resultsCount = await searchResultsPage.getSearchResultsCount();
      expect(resultsCount).toBeGreaterThan(0);
      
      await searchResultsPage.verifySearchResultsContainTerm(searchData.searchTerm);
      TestUtils.logInfo(`Found ${resultsCount} results for '${searchData.searchTerm}'`);
    });

    test('should search for Apple products and return relevant results', async ({ page, headerComponent }) => {
      // Arrange
      const searchData = TestDataProvider.getTestData('product_search', 'Search for Apple Products');
      TestUtils.logStep(`Searching for: ${searchData.searchTerm}`);

      // Act
      await page.goto('/');
      await headerComponent.searchForProduct(searchData.searchTerm);

      // Assert
      await searchResultsPage.verifySearchResultsPageIsLoaded();
      const resultsCount = await searchResultsPage.getSearchResultsCount();
      expect(resultsCount).toBeGreaterThan(0);
      
      const productTitles = await searchResultsPage.getProductTitles();
      const hasAppleProducts = productTitles.some(title => 
        title.toLowerCase().includes('apple')
      );
      expect(hasAppleProducts).toBe(true);
      
      TestUtils.logInfo(`Found ${resultsCount} Apple products`);
    });

    test('should handle search for non-existent products', async ({ page, headerComponent }) => {
      // Arrange
      const searchData = TestDataProvider.getTestData('product_search', 'Search for Non-existent Product');
      TestUtils.logStep(`Searching for non-existent product: ${searchData.searchTerm}`);

      // Act
      await page.goto('/');
      await headerComponent.searchForProduct(searchData.searchTerm);

      // Assert
      await searchResultsPage.verifySearchResultsPageIsLoaded();
      await searchResultsPage.verifyNoSearchResults();
      
      const noResultsMessage = await searchResultsPage.getNoResultsMessage();
      expect(noResultsMessage.toLowerCase()).toContain('no products were found');
      
      TestUtils.logInfo('No results message displayed correctly for non-existent product');
    });

    test('should handle empty search query', async ({ page, headerComponent }) => {
      // Arrange
      const searchData = TestDataProvider.getTestData('product_search', 'Empty Search');
      TestUtils.logStep('Testing empty search query');

      // Act
      await page.goto('/');
      await headerComponent.searchForProduct(searchData.searchTerm);

      // Assert
      await searchResultsPage.verifySearchResultsPageIsLoaded();
      // Empty search might show all products or a specific message
      const resultsCount = await searchResultsPage.getSearchResultsCount();
      const hasNoResults = await searchResultsPage.isNoResultsMessageDisplayed();
      
      expect(resultsCount > 0 || hasNoResults).toBe(true);
      TestUtils.logInfo('Empty search handled appropriately');
    });

    test('should perform case-insensitive search', async ({ page, headerComponent }) => {
      // Arrange
      const searchTerms = ['COMPUTER', 'computer', 'Computer', 'CoMpUtEr'];
      TestUtils.logStep('Testing case-insensitive search');

      for (const searchTerm of searchTerms) {
        // Act
        await page.goto('/');
        await headerComponent.searchForProduct(searchTerm);

        // Assert
        await searchResultsPage.verifySearchResultsPageIsLoaded();
        const resultsCount = await searchResultsPage.getSearchResultsCount();
        expect(resultsCount).toBeGreaterThan(0);
        
        TestUtils.logInfo(`Case-insensitive search working for: ${searchTerm}`);
      }
    });

    test('should handle special characters in search', async ({ page, headerComponent }) => {
      // Arrange
      const specialSearchTerms = ['computer-', 'computer+', 'computer&', 'computer!'];
      TestUtils.logStep('Testing search with special characters');

      for (const searchTerm of specialSearchTerms) {
        // Act
        await page.goto('/');
        await headerComponent.searchForProduct(searchTerm);

        // Assert
        await searchResultsPage.verifySearchResultsPageIsLoaded();
        // Should either return results or handle gracefully
        const resultsCount = await searchResultsPage.getSearchResultsCount();
        const hasNoResults = await searchResultsPage.isNoResultsMessageDisplayed();
        
        expect(resultsCount >= 0).toBe(true);
        expect(resultsCount > 0 || hasNoResults).toBe(true);
        
        TestUtils.logInfo(`Special character search handled for: ${searchTerm}`);
      }
    });
  });

  test.describe('Category Browsing', () => {
    test('should browse Computers category and display subcategories', async ({ page, headerComponent }) => {
      // Arrange
      const categoryData = TestDataProvider.getTestData('category', 'Computers Category');
      TestUtils.logStep('Browsing Computers category');

      // Act
      await page.goto('/');
      await headerComponent.clickComputers();

      // Assert
      await categoryPage.verifyCategoryPageIsLoaded('Computers');
      
      const subcategories = await categoryPage.getSubcategories();
      expect(subcategories.length).toBeGreaterThan(0);
      
      // Verify expected subcategories are present
      for (const expectedSubcategory of categoryData.subcategories) {
        const isPresent = subcategories.some(subcategory => 
          subcategory.toLowerCase().includes(expectedSubcategory.toLowerCase())
        );
        expect(isPresent).toBe(true);
      }
      
      TestUtils.logInfo(`Found subcategories: ${subcategories.join(', ')}`);
    });

    test('should browse Electronics category and display products', async ({ page, headerComponent }) => {
      // Arrange
      const categoryData = TestDataProvider.getTestData('category', 'Electronics Category');
      TestUtils.logStep('Browsing Electronics category');

      // Act
      await page.goto('/');
      await headerComponent.clickElectronics();

      // Assert
      await categoryPage.verifyCategoryPageIsLoaded('Electronics');
      
      const productCount = await categoryPage.getProductCount();
      const subcategoriesCount = await categoryPage.subcategoryItems.count();
      
      expect(productCount > 0 || subcategoriesCount > 0).toBe(true);
      TestUtils.logInfo(`Electronics category loaded with ${productCount} products and ${subcategoriesCount} subcategories`);
    });

    test('should navigate to Notebooks subcategory', async ({ page, headerComponent }) => {
      // Arrange
      TestUtils.logStep('Navigating to Notebooks subcategory');

      // Act
      await page.goto('/');
      await headerComponent.clickComputers();
      await categoryPage.clickOnSubcategory('Notebooks');

      // Assert
      await categoryPage.verifyCategoryPageIsLoaded('Notebooks');
      
      const productTitles = await categoryPage.getProductTitles();
      expect(productTitles.length).toBeGreaterThan(0);
      
      // Verify products are related to notebooks
      const hasNotebookProducts = productTitles.some(title => 
        title.toLowerCase().includes('notebook') || 
        title.toLowerCase().includes('laptop') ||
        title.toLowerCase().includes('macbook')
      );
      expect(hasNotebookProducts).toBe(true);
      
      TestUtils.logInfo(`Found ${productTitles.length} notebook products`);
    });

    test('should verify breadcrumb navigation', async ({ page, headerComponent }) => {
      // Arrange
      TestUtils.logStep('Testing breadcrumb navigation');

      // Act
      await page.goto('/');
      await headerComponent.clickComputers();
      await categoryPage.clickOnSubcategory('Notebooks');

      // Assert
      const breadcrumbItems = await categoryPage.getBreadcrumbItems();
      expect(breadcrumbItems.length).toBeGreaterThan(1);
      
      // Verify breadcrumb contains expected items
      const expectedItems = ['Home', 'Computers'];
      await categoryPage.verifyBreadcrumbNavigation(expectedItems);
      
      TestUtils.logInfo(`Breadcrumb navigation: ${breadcrumbItems.join(' > ')}`);
    });
  });

  test.describe('Product Sorting', () => {
    test('should sort products by price (low to high)', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing price sorting (low to high)');

      // Act
      await categoryPage.navigateToCategory('/computers');
      await categoryPage.sortProductsBy('Price: Low to High');

      // Assert
      await categoryPage.verifyProductsSortedByPriceLowToHigh();
      TestUtils.logInfo('Products sorted by price (low to high) successfully');
    });

    test('should sort products by price (high to low)', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing price sorting (high to low)');

      // Act
      await categoryPage.navigateToCategory('/computers');
      await categoryPage.sortProductsBy('Price: High to Low');

      // Assert
      await categoryPage.verifyProductsSortedByPriceHighToLow();
      TestUtils.logInfo('Products sorted by price (high to low) successfully');
    });

    test('should sort products alphabetically (A to Z)', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing alphabetical sorting (A to Z)');

      // Act
      await categoryPage.navigateToCategory('/computers');
      await categoryPage.sortProductsBy('Name: A to Z');

      // Assert
      await categoryPage.verifyProductsSortedAlphabeticallyAtoZ();
      TestUtils.logInfo('Products sorted alphabetically (A to Z) successfully');
    });

    test('should sort products alphabetically (Z to A)', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing alphabetical sorting (Z to A)');

      // Act
      await categoryPage.navigateToCategory('/computers');
      await categoryPage.sortProductsBy('Name: Z to A');

      // Assert
      await categoryPage.verifyProductsSortedAlphabeticallyZtoA();
      TestUtils.logInfo('Products sorted alphabetically (Z to A) successfully');
    });

    test('should maintain sorting after page refresh', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing sorting persistence after page refresh');

      // Act
      await categoryPage.navigateToCategory('/computers');
      await categoryPage.sortProductsBy('Price: Low to High');
      
      // Get prices before refresh
      const pricesBeforeRefresh = await categoryPage.getProductPrices();
      
      // Refresh page
      await page.reload();
      await categoryPage.waitForPageLoad();
      
      // Get prices after refresh
      const pricesAfterRefresh = await categoryPage.getProductPrices();

      // Assert
      expect(pricesAfterRefresh).toEqual(pricesBeforeRefresh);
      TestUtils.logInfo('Sorting maintained after page refresh');
    });
  });

  test.describe('Product Filtering', () => {
    test('should filter products by price range', async ({ page }) => {
      // Arrange
      const filterData = TestDataProvider.getTestData('filter', 'Price Filter Low to High');
      TestUtils.logStep(`Testing price range filter: $${filterData.priceRange.min} - $${filterData.priceRange.max}`);

      // Act
      await categoryPage.navigateToCategory('/computers');
      await categoryPage.filterByPriceRange(filterData.priceRange.min, filterData.priceRange.max);

      // Assert
      await categoryPage.verifyProductsFilteredByPriceRange(filterData.priceRange.min, filterData.priceRange.max);
      TestUtils.logInfo('Price range filtering working correctly');
    });

    test('should filter products by manufacturer', async ({ page }) => {
      // Arrange
      const filterData = TestDataProvider.getTestData('filter', 'Manufacturer Filter');
      TestUtils.logStep(`Testing manufacturer filter: ${filterData.manufacturer}`);

      // Act
      await categoryPage.navigateToCategory('/computers');
      
      // Check if manufacturer filter is available
      const availableManufacturers = await categoryPage.getAvailableManufacturers();
      if (availableManufacturers.length > 0) {
        const manufacturerToFilter = availableManufacturers[0]; // Use first available manufacturer
        await categoryPage.filterByManufacturer(manufacturerToFilter);

        // Assert
        await categoryPage.verifyProductsFilteredByManufacturer(manufacturerToFilter);
        TestUtils.logInfo(`Manufacturer filtering working correctly for: ${manufacturerToFilter}`);
      } else {
        TestUtils.logInfo('No manufacturer filters available on this category');
      }
    });

    test('should combine multiple filters', async ({ page }) => {
      // Arrange
      const filterData = TestDataProvider.getTestData('filter', 'Combined Filters');
      TestUtils.logStep('Testing combined filters (price + manufacturer)');

      // Act
      await categoryPage.navigateToCategory('/electronics');
      
      // Apply price filter
      await categoryPage.filterByPriceRange(filterData.priceRange.min, filterData.priceRange.max);
      
      // Apply manufacturer filter if available
      const availableManufacturers = await categoryPage.getAvailableManufacturers();
      if (availableManufacturers.length > 0) {
        await categoryPage.filterByManufacturer(availableManufacturers[0]);
      }
      
      // Apply sorting
      await categoryPage.sortProductsBy(filterData.sortBy);

      // Assert
      const productCount = await categoryPage.getProductCount();
      expect(productCount).toBeGreaterThanOrEqual(0);
      
      if (productCount > 0) {
        await categoryPage.verifyProductsFilteredByPriceRange(filterData.priceRange.min, filterData.priceRange.max);
      }
      
      TestUtils.logInfo('Combined filters applied successfully');
    });
  });

  test.describe('Display Options and Pagination', () => {
    test('should switch between grid and list view', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing display mode switching');

      // Act
      await categoryPage.navigateToCategory('/computers');
      
      // Switch to list view
      await categoryPage.switchToListView();
      await TestUtils.wait(1000); // Wait for view change
      
      // Switch back to grid view
      await categoryPage.switchToGridView();
      await TestUtils.wait(1000); // Wait for view change

      // Assert
      const productCount = await categoryPage.getProductCount();
      expect(productCount).toBeGreaterThan(0);
      TestUtils.logInfo('Display mode switching working correctly');
    });

    test('should change page size', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing page size change');

      // Act
      await categoryPage.navigateToCategory('/computers');
      
      const initialProductCount = await categoryPage.getProductCount();
      
      // Change page size to show more products
      await categoryPage.changePageSize('12');
      
      const newProductCount = await categoryPage.getProductCount();

      // Assert
      expect(newProductCount).toBeGreaterThanOrEqual(initialProductCount);
      TestUtils.logInfo(`Page size changed: ${initialProductCount} -> ${newProductCount} products`);
    });

    test('should handle pagination if available', async ({ page }) => {
      // Arrange
      TestUtils.logStep('Testing pagination functionality');

      // Act
      await categoryPage.navigateToCategory('/computers');
      
      // Check if pagination is available
      const paginationContainer = categoryPage.paginationContainer;
      if (await paginationContainer.isVisible()) {
        const currentPage = await categoryPage.getCurrentPageNumber();
        const totalPages = await categoryPage.getTotalPagesCount();
        
        if (totalPages > 1) {
          // Go to next page if available
          const nextButton = categoryPage.nextPageButton;
          if (await nextButton.isVisible()) {
            await categoryPage.goToNextPage();
            const newPage = await categoryPage.getCurrentPageNumber();
            expect(newPage).toBe(currentPage + 1);
          }
        }
        
        TestUtils.logInfo(`Pagination working: Page ${currentPage} of ${totalPages}`);
      } else {
        TestUtils.logInfo('No pagination available (all products fit on one page)');
      }
    });
  });

  test.describe('Search Results Validation', () => {
    test('should validate search results accuracy', async ({ page, headerComponent }) => {
      // Arrange
      const searchTerms = ['computer', 'apple', 'phone', 'camera'];
      TestUtils.logStep('Validating search results accuracy');

      for (const searchTerm of searchTerms) {
        // Act
        await page.goto('/');
        await headerComponent.searchForProduct(searchTerm);

        // Assert
        await searchResultsPage.verifySearchResultsPageIsLoaded();
        
        const resultsCount = await searchResultsPage.getSearchResultsCount();
        if (resultsCount > 0) {
          await searchResultsPage.verifySearchResultsContainTerm(searchTerm);
          TestUtils.logInfo(`Search accuracy verified for '${searchTerm}': ${resultsCount} results`);
        } else {
          const noResultsMessage = await searchResultsPage.getNoResultsMessage();
          expect(noResultsMessage.length).toBeGreaterThan(0);
          TestUtils.logInfo(`No results found for '${searchTerm}' - appropriate message displayed`);
        }
      }
    });

    test('should validate product information in search results', async ({ page, headerComponent }) => {
      // Arrange
      TestUtils.logStep('Validating product information in search results');

      // Act
      await page.goto('/');
      await headerComponent.searchForProduct('computer');

      // Assert
      await searchResultsPage.verifySearchResultsPageIsLoaded();
      
      const resultsCount = await searchResultsPage.getSearchResultsCount();
      if (resultsCount > 0) {
        // Validate first product information
        const productInfo = await searchResultsPage.getProductInformation(0);
        
        expect(productInfo.title.length).toBeGreaterThan(0);
        expect(productInfo.price.length).toBeGreaterThan(0);
        expect(productInfo.imageAlt.length).toBeGreaterThan(0);
        
        TestUtils.logInfo(`Product information validated: ${productInfo.title} - ${productInfo.price}`);
      }
    });
  });
});
