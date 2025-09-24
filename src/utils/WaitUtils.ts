import { Page, Locator, expect } from '@playwright/test';

/**
 * Utility functions for waiting and synchronization
 */
export class WaitUtils {
  /**
   * Wait for element to be visible with custom timeout
   */
  static async waitForVisible(locator: Locator, timeout: number = 30000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden with custom timeout
   */
  static async waitForHidden(locator: Locator, timeout: number = 30000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Wait for element to be attached to DOM
   */
  static async waitForAttached(locator: Locator, timeout: number = 30000): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout });
  }

  /**
   * Wait for element to be detached from DOM
   */
  static async waitForDetached(locator: Locator, timeout: number = 30000): Promise<void> {
    await locator.waitFor({ state: 'detached', timeout });
  }

  /**
   * Wait for page to load completely
   */
  static async waitForPageLoad(page: Page, timeout: number = 60000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for DOM content to be loaded
   */
  static async waitForDOMContentLoaded(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('domcontentloaded', { timeout });
  }

  /**
   * Wait for all resources to load
   */
  static async waitForLoad(page: Page, timeout: number = 60000): Promise<void> {
    await page.waitForLoadState('load', { timeout });
  }

  /**
   * Wait for URL to contain specific text
   */
  static async waitForUrlToContain(page: Page, urlPart: string, timeout: number = 30000): Promise<void> {
    await page.waitForURL(url => url.includes(urlPart), { timeout });
  }

  /**
   * Wait for URL to match pattern
   */
  static async waitForUrlToMatch(page: Page, pattern: RegExp, timeout: number = 30000): Promise<void> {
    await page.waitForURL(pattern, { timeout });
  }

  /**
   * Wait for element to have specific text
   */
  static async waitForElementText(locator: Locator, expectedText: string, timeout: number = 30000): Promise<void> {
    await expect(locator).toHaveText(expectedText, { timeout });
  }

  /**
   * Wait for element to contain specific text
   */
  static async waitForElementToContainText(locator: Locator, expectedText: string, timeout: number = 30000): Promise<void> {
    await expect(locator).toContainText(expectedText, { timeout });
  }

  /**
   * Wait for element to have specific attribute value
   */
  static async waitForElementAttribute(locator: Locator, attribute: string, value: string, timeout: number = 30000): Promise<void> {
    await expect(locator).toHaveAttribute(attribute, value, { timeout });
  }

  /**
   * Wait for element to have specific CSS class
   */
  static async waitForElementClass(locator: Locator, className: string, timeout: number = 30000): Promise<void> {
    await expect(locator).toHaveClass(new RegExp(className), { timeout });
  }

  /**
   * Wait for element to be enabled
   */
  static async waitForElementEnabled(locator: Locator, timeout: number = 30000): Promise<void> {
    await expect(locator).toBeEnabled({ timeout });
  }

  /**
   * Wait for element to be disabled
   */
  static async waitForElementDisabled(locator: Locator, timeout: number = 30000): Promise<void> {
    await expect(locator).toBeDisabled({ timeout });
  }

  /**
   * Wait for element to be checked (for checkboxes/radio buttons)
   */
  static async waitForElementChecked(locator: Locator, timeout: number = 30000): Promise<void> {
    await expect(locator).toBeChecked({ timeout });
  }

  /**
   * Wait for element to be unchecked
   */
  static async waitForElementUnchecked(locator: Locator, timeout: number = 30000): Promise<void> {
    await expect(locator).not.toBeChecked({ timeout });
  }

  /**
   * Wait for element count to match expected number
   */
  static async waitForElementCount(locator: Locator, count: number, timeout: number = 30000): Promise<void> {
    await expect(locator).toHaveCount(count, { timeout });
  }

  /**
   * Wait for page title to contain text
   */
  static async waitForPageTitle(page: Page, title: string, timeout: number = 30000): Promise<void> {
    await expect(page).toHaveTitle(new RegExp(title, 'i'), { timeout });
  }

  /**
   * Wait for network request to complete
   */
  static async waitForRequest(page: Page, urlPattern: string | RegExp, timeout: number = 30000): Promise<void> {
    await page.waitForRequest(urlPattern, { timeout });
  }

  /**
   * Wait for network response
   */
  static async waitForResponse(page: Page, urlPattern: string | RegExp, timeout: number = 30000): Promise<void> {
    await page.waitForResponse(urlPattern, { timeout });
  }

  /**
   * Wait for function to return true
   */
  static async waitForFunction(page: Page, fn: () => boolean | Promise<boolean>, timeout: number = 30000): Promise<void> {
    await page.waitForFunction(fn, undefined, { timeout });
  }

  /**
   * Wait for selector to appear
   */
  static async waitForSelector(page: Page, selector: string, timeout: number = 30000): Promise<void> {
    await page.waitForSelector(selector, { timeout });
  }

  /**
   * Wait for timeout (use sparingly)
   */
  static async waitForTimeout(milliseconds: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * Wait for element to be clickable (visible and enabled)
   */
  static async waitForClickable(locator: Locator, timeout: number = 30000): Promise<void> {
    await this.waitForVisible(locator, timeout);
    await this.waitForElementEnabled(locator, timeout);
  }

  /**
   * Wait for loading spinner to disappear
   */
  static async waitForLoadingToComplete(page: Page, spinnerSelector: string = '.loading', timeout: number = 30000): Promise<void> {
    try {
      const spinner = page.locator(spinnerSelector);
      await this.waitForVisible(spinner, 5000);
      await this.waitForHidden(spinner, timeout);
    } catch {
      // Spinner might not appear, which is fine
    }
  }

  /**
   * Wait for overlay to disappear
   */
  static async waitForOverlayToDisappear(page: Page, overlaySelector: string = '.overlay', timeout: number = 30000): Promise<void> {
    try {
      const overlay = page.locator(overlaySelector);
      await this.waitForHidden(overlay, timeout);
    } catch {
      // Overlay might not be present, which is fine
    }
  }

  /**
   * Wait for modal to appear
   */
  static async waitForModal(page: Page, modalSelector: string = '.modal', timeout: number = 30000): Promise<void> {
    const modal = page.locator(modalSelector);
    await this.waitForVisible(modal, timeout);
  }

  /**
   * Wait for modal to disappear
   */
  static async waitForModalToDisappear(page: Page, modalSelector: string = '.modal', timeout: number = 30000): Promise<void> {
    try {
      const modal = page.locator(modalSelector);
      await this.waitForHidden(modal, timeout);
    } catch {
      // Modal might not be present, which is fine
    }
  }

  /**
   * Wait for alert to appear
   */
  static async waitForAlert(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForEvent('dialog', { timeout });
  }

  /**
   * Wait for download to start
   */
  static async waitForDownload(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForEvent('download', { timeout });
  }

  /**
   * Wait for popup window
   */
  static async waitForPopup(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForEvent('popup', { timeout });
  }

  /**
   * Wait for console message
   */
  static async waitForConsoleMessage(page: Page, messageText: string, timeout: number = 30000): Promise<void> {
    await page.waitForEvent('console', {
      predicate: msg => msg.text().includes(messageText),
      timeout
    });
  }

  /**
   * Wait with retry mechanism
   */
  static async waitWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    retryDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await this.waitForTimeout(retryDelay);
        }
      }
    }
    
    throw lastError!;
  }

  /**
   * Wait for element to be stable (not moving)
   */
  static async waitForElementStable(locator: Locator, timeout: number = 30000): Promise<void> {
    const startTime = Date.now();
    let lastPosition: { x: number; y: number } | null = null;
    let stableCount = 0;
    const requiredStableChecks = 3;
    
    while (Date.now() - startTime < timeout) {
      try {
        const box = await locator.boundingBox();
        if (box) {
          const currentPosition = { x: box.x, y: box.y };
          
          if (lastPosition && 
              Math.abs(currentPosition.x - lastPosition.x) < 1 && 
              Math.abs(currentPosition.y - lastPosition.y) < 1) {
            stableCount++;
            if (stableCount >= requiredStableChecks) {
              return;
            }
          } else {
            stableCount = 0;
          }
          
          lastPosition = currentPosition;
        }
        
        await this.waitForTimeout(100);
      } catch {
        // Element might not be visible yet
        await this.waitForTimeout(100);
      }
    }
    
    throw new Error(`Element did not stabilize within ${timeout}ms`);
  }
}
