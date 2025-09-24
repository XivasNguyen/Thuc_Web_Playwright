import { test } from '../src/fixtures/TestFixtures';
import { HomePage } from '../src/pages/HomePage';
import { CategoryPage } from '../src/pages/CategoryPage';

test.describe('Product Filtering & Sorting', () => {
  let homePage: HomePage;
  let categoryPage: CategoryPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    categoryPage = new CategoryPage(page);
    await homePage.navigateToHomePage();
    await homePage.navigateToCategory('Computers');
    await categoryPage.navigateToSubcategory('Notebooks');
  });

  test('should sort products by price', async () => {
    console.log('🧪 Testing product sorting by price');
    
    // Sort by price low to high
    await categoryPage.sortProductsByPrice('low-to-high');
    await categoryPage.verifyProductsSortedByPrice('ascending');
    
    // Sort by price high to low
    await categoryPage.sortProductsByPrice('high-to-low');
    await categoryPage.verifyProductsSortedByPrice('descending');
    
    console.log('✅ Product price sorting completed successfully');
  });

  test('should filter products by manufacturers and price range', async () => {
    console.log('🧪 Testing product filtering by manufacturers and price range');
    
    // Filter by manufacturer
    const availableManufacturers = await categoryPage.getAvailableManufacturers();
    if (availableManufacturers.length > 0) {
      await categoryPage.filterByManufacturer(availableManufacturers[0]);
      await categoryPage.verifyProductsFilteredByManufacturer(availableManufacturers[0]);
    }
    
    // Filter by price range
    await categoryPage.filterByPriceRange(100, 1000);
    await categoryPage.verifyProductsInPriceRange(100, 1000);
    
    console.log('✅ Product filtering completed successfully');
  });
});
