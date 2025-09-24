import { test } from '../src/fixtures/TestFixtures';
import { HomePage } from '../src/pages/HomePage';
import { CategoryPage } from '../src/pages/CategoryPage';

test.describe('Product Discovery', () => {
  let homePage: HomePage;
  let categoryPage: CategoryPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    categoryPage = new CategoryPage(page);
    await homePage.navigateToHomePage();
  });

  test('should browse products by category', async () => {
    console.log('🧪 Testing product browsing by category');
    
    // Navigate to Computers category
    await homePage.navigateToCategory('Computers');
    await categoryPage.verifyComputersCategoryLoaded();
    
    // Navigate to Notebooks subcategory
    await categoryPage.navigateToSubcategory('Notebooks');
    await categoryPage.verifyNotebooksSubcategoryLoaded();
    await categoryPage.verifyProductsDisplayed();
    
    console.log('✅ Product category browsing completed successfully');
  });

  test('should navigate category hierarchy and verify breadcrumbs', async () => {
    console.log('🧪 Testing category hierarchy navigation and breadcrumbs');
    
    // Navigate through category hierarchy
    await homePage.navigateToCategory('Computers');
    await categoryPage.verifyBreadcrumb(['Home', 'Computers']);
    
    await categoryPage.navigateToSubcategory('Notebooks');
    await categoryPage.verifyBreadcrumb(['Home', 'Computers', 'Notebooks']);
    
    // Navigate back using breadcrumbs
    await categoryPage.clickBreadcrumbItem('Computers');
    await categoryPage.verifyComputersCategoryLoaded();
    await categoryPage.verifyBreadcrumb(['Home', 'Computers']);
    
    console.log('✅ Category hierarchy and breadcrumbs working correctly');
  });
});
