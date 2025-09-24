import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';

/**
 * Footer component that appears on all pages
 */
export class FooterComponent extends BasePage {
  // Information links
  private readonly sitemapLink: Locator;
  private readonly shippingReturnsLink: Locator;
  private readonly privacyNoticeLink: Locator;
  private readonly conditionsOfUseLink: Locator;
  private readonly aboutUsLink: Locator;
  private readonly contactUsLink: Locator;

  // Customer service links
  private readonly searchLink: Locator;
  private readonly newsLink: Locator;
  private readonly blogLink: Locator;
  private readonly recentlyViewedProductsLink: Locator;
  private readonly compareProductsLink: Locator;
  private readonly newProductsLink: Locator;

  // My account links
  private readonly myAccountFooterLink: Locator;
  private readonly ordersLink: Locator;
  private readonly addressesLink: Locator;
  private readonly shoppingCartFooterLink: Locator;
  private readonly wishlistFooterLink: Locator;
  private readonly vendorAccountLink: Locator;

  // Social media links
  private readonly facebookLink: Locator;
  private readonly twitterLink: Locator;
  private readonly rssLink: Locator;
  private readonly youtubeLink: Locator;
  private readonly instagramLink: Locator;

  // Newsletter
  private readonly newsletterEmailInput: Locator;
  private readonly subscribeButton: Locator;

  // Copyright
  private readonly copyrightText: Locator;
  private readonly poweredByLink: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize information links
    this.sitemapLink = page.locator('a[href*="/sitemap"]');
    this.shippingReturnsLink = page.locator('a[href*="/shipping-returns"]');
    this.privacyNoticeLink = page.locator('a[href*="/privacy-notice"]');
    this.conditionsOfUseLink = page.locator('a[href*="/conditions-of-use"]');
    this.aboutUsLink = page.locator('a[href*="/about-us"]');
    this.contactUsLink = page.locator('a[href*="/contactus"]');

    // Initialize customer service links
    this.searchLink = page.locator('a[href*="/search"]');
    this.newsLink = page.locator('a[href*="/news"]');
    this.blogLink = page.locator('a[href*="/blog"]');
    this.recentlyViewedProductsLink = page.locator('a[href*="/recentlyviewedproducts"]');
    this.compareProductsLink = page.locator('a[href*="/compareproducts"]');
    this.newProductsLink = page.locator('a[href*="/newproducts"]');

    // Initialize my account links
    this.myAccountFooterLink = page.locator('a[href*="/customer/info"]');
    this.ordersLink = page.locator('a[href*="/order/history"]');
    this.addressesLink = page.locator('a[href*="/customer/addresses"]');
    this.shoppingCartFooterLink = page.locator('a[href*="/cart"]');
    this.wishlistFooterLink = page.locator('a[href*="/wishlist"]');
    this.vendorAccountLink = page.locator('a[href*="/vendor/apply"]');

    // Initialize social media links
    this.facebookLink = page.locator('a[href*="facebook.com"]');
    this.twitterLink = page.locator('a[href*="twitter.com"]');
    this.rssLink = page.locator('a[href*="/news/rss"]');
    this.youtubeLink = page.locator('a[href*="youtube.com"]');
    this.instagramLink = page.locator('a[href*="instagram.com"]');

    // Initialize newsletter
    this.newsletterEmailInput = page.locator('input[placeholder*="Enter your email"]');
    this.subscribeButton = page.locator('button:has-text("Subscribe")');

    // Initialize copyright
    this.copyrightText = page.locator('text=Copyright');
    this.poweredByLink = page.locator('a[href*="nopcommerce.com"]');
  }

  /**
   * Navigate to sitemap
   */
  async clickSitemap(): Promise<void> {
    await this.clickElement(this.sitemapLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to shipping & returns page
   */
  async clickShippingReturns(): Promise<void> {
    await this.clickElement(this.shippingReturnsLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to privacy notice
   */
  async clickPrivacyNotice(): Promise<void> {
    await this.clickElement(this.privacyNoticeLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to conditions of use
   */
  async clickConditionsOfUse(): Promise<void> {
    await this.clickElement(this.conditionsOfUseLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to about us page
   */
  async clickAboutUs(): Promise<void> {
    await this.clickElement(this.aboutUsLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to contact us page
   */
  async clickContactUs(): Promise<void> {
    await this.clickElement(this.contactUsLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to search page
   */
  async clickSearch(): Promise<void> {
    await this.clickElement(this.searchLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to news page
   */
  async clickNews(): Promise<void> {
    await this.clickElement(this.newsLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to blog
   */
  async clickBlog(): Promise<void> {
    await this.clickElement(this.blogLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to recently viewed products
   */
  async clickRecentlyViewedProducts(): Promise<void> {
    await this.clickElement(this.recentlyViewedProductsLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to compare products
   */
  async clickCompareProducts(): Promise<void> {
    await this.clickElement(this.compareProductsLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to new products
   */
  async clickNewProducts(): Promise<void> {
    await this.clickElement(this.newProductsLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to orders page
   */
  async clickOrders(): Promise<void> {
    await this.clickElement(this.ordersLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to addresses page
   */
  async clickAddresses(): Promise<void> {
    await this.clickElement(this.addressesLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to vendor account application
   */
  async clickVendorAccount(): Promise<void> {
    await this.clickElement(this.vendorAccountLink);
    await this.waitForPageLoad();
  }

  /**
   * Subscribe to newsletter
   */
  async subscribeToNewsletter(email: string): Promise<void> {
    await this.fillField(this.newsletterEmailInput, email);
    await this.clickElement(this.subscribeButton);
    await this.waitForPageLoad();
  }

  /**
   * Click Facebook link
   */
  async clickFacebook(): Promise<void> {
    await this.clickElement(this.facebookLink);
  }

  /**
   * Click Twitter link
   */
  async clickTwitter(): Promise<void> {
    await this.clickElement(this.twitterLink);
  }

  /**
   * Click RSS link
   */
  async clickRSS(): Promise<void> {
    await this.clickElement(this.rssLink);
  }

  /**
   * Click YouTube link
   */
  async clickYouTube(): Promise<void> {
    await this.clickElement(this.youtubeLink);
  }

  /**
   * Click Instagram link
   */
  async clickInstagram(): Promise<void> {
    await this.clickElement(this.instagramLink);
  }

  /**
   * Get copyright text
   */
  async getCopyrightText(): Promise<string> {
    return await this.getElementText(this.copyrightText);
  }

  /**
   * Verify footer is displayed
   */
  async verifyFooterIsDisplayed(): Promise<void> {
    await this.waitForElement(this.copyrightText);
    await this.waitForElement(this.poweredByLink);
  }

  /**
   * Verify all information links are present
   */
  async verifyInformationLinksArePresent(): Promise<void> {
    await this.waitForElement(this.sitemapLink);
    await this.waitForElement(this.shippingReturnsLink);
    await this.waitForElement(this.privacyNoticeLink);
    await this.waitForElement(this.conditionsOfUseLink);
    await this.waitForElement(this.aboutUsLink);
    await this.waitForElement(this.contactUsLink);
  }

  /**
   * Verify all social media links are present
   */
  async verifySocialMediaLinksArePresent(): Promise<void> {
    await this.waitForElement(this.facebookLink);
    await this.waitForElement(this.twitterLink);
    await this.waitForElement(this.rssLink);
    await this.waitForElement(this.youtubeLink);
    await this.waitForElement(this.instagramLink);
  }
}
