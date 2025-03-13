import { Page, Locator, expect } from "@playwright/test";

export default class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param url - URL to navigate to
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Get page title
   * @returns Page title as string
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for element to be visible
   * @param locator - Element locator
   * @param timeout - Timeout in milliseconds (optional)
   */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: "visible", timeout });
  }

  /**
   * Click on element with retry logic
   * @param locator - Element locator
   * @param options - Click options (optional)
   */
  async clickElement(
    locator: Locator,
    options?: { force?: boolean; timeout?: number }
  ): Promise<void> {
    try {
      await locator.click(options);
    } catch (error) {
      // Retry with force: true if element is overlapped or not clickable
      await locator.click({ force: true, timeout: options?.timeout });
    }
  }

  /**
   * Fill text in input field
   * @param locator - Input field locator
   * @param text - Text to fill
   */
  async fillText(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  /**
   * Get text from element
   * @param locator - Element locator
   * @returns Text content as string
   */
  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) || "";
  }

  /**
   * Check if element exists
   * @param locator - Element locator
   * @returns Boolean indicating if element exists
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Wait for navigation to complete
   */
  async waitForDomContent(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Wait for url to contain
   */
  async waitForURLToContain(keyword: string): Promise<void> {
    await this.page.waitForURL(new RegExp(`${keyword}`, "i"));
  }

  /**
   * Take screenshot
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `./screenshots/${name}.png`,
      fullPage: true,
    });
  }
}
