import { test } from '../src/fixtures/TestFixtures';
import { HomePage } from '../src/pages/HomePage';
import { SearchResultsPage } from '../src/pages/SearchResultsPage';

test.describe('Product Search', () => {
  let homePage: HomePage;
  let searchResultsPage: SearchResultsPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    searchResultsPage = new SearchResultsPage(page);
    await homePage.navigateToHomePage();
  });

  test('should search for products with valid search terms', async () => {
    console.log('🧪 Testing product search with valid terms');
    
    const searchTerm = 'laptop';
    await homePage.searchForProduct(searchTerm);
    await searchResultsPage.verifySearchResultsDisplayed();
    await searchResultsPage.verifySearchResultsContainTerm(searchTerm);
    
    console.log('✅ Product search completed successfully');
  });

  test('should handle empty or invalid search queries', async () => {
    console.log('🧪 Testing empty and invalid search queries');
    
    // Test empty search
    await homePage.searchForProduct('');
    await searchResultsPage.verifyNoSearchResultsOrError();
    
    // Test invalid search term
    await homePage.navigateToHomePage();
    await homePage.searchForProduct('xyzinvalidproduct123');
    await searchResultsPage.verifyNoProductsFoundMessage();
    
    console.log('✅ Empty and invalid search queries handled correctly');
  });
});
