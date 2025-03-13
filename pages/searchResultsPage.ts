import { Page, Locator } from '@playwright/test';
import BasePage from './basePage';

export default class SearchResultsPage extends BasePage {
  // Locators
  readonly productItems: Locator;
  readonly productTitles: Locator;
  readonly productPrices: Locator;
  readonly sortByDropdown: Locator;
  readonly filterSidebar: Locator;
  readonly filterOptions: string;
  readonly noResultsMessage: Locator;
  readonly pageTitle: Locator;
  readonly itemsCount: Locator;

  constructor(page: Page) {
    super(page);
    this.productItems = page.locator('.product-item');
    this.productTitles = page.locator('.product-item-link');
    this.productPrices = page.locator('.price');
    this.sortByDropdown = page.locator('#sorter');
    this.filterSidebar = page.locator('.filter-options');
    this.filterOptions = '.filter-options-item';
    this.noResultsMessage = page.locator('.message.notice');
    this.pageTitle = page.locator('.page-title');
    this.itemsCount = page.locator('.toolbar-number');
  }

  /**
   * Get search results count
   * @returns Number of search results
   */
  async getResultsCount(): Promise<number> {
    await this.waitForElement(this.productItems.first());
    return await this.productItems.count();
  }

  /**
   * Get search results page title
   * @returns Page title text
   */
  async getSearchResultsTitle(): Promise<string> {
    return await this.getText(this.pageTitle);
  }

  /**
   * Check if no results message is displayed
   * @returns Boolean indicating if no results message is shown
   */
  async hasNoResults(): Promise<boolean> {
    return await this.isElementVisible(this.noResultsMessage);
  }

  /**
   * Sort products by given option
   * @param option - Sort option (e.g. 'Price: Low to High')
   */
  async sortProductsBy(option: string): Promise<void> {
    await this.page.getByLabel('Sort By').selectOption(option)
    await this.waitForURLToContain(`product_list_order=${option}`)
  }

  /**
   * Apply filter by category and value
   * @param category - Filter category (e.g. 'Price', 'Color')
   * @param value - Filter value
   */
  async applyFilter(category: string, value: string): Promise<void> {
    // Open the filter category
    const filterCategory = this.page.locator(`${this.filterOptions} [data-role="title"]:has-text("${category}")`);
    if (await filterCategory.isVisible()) {
      await this.clickElement(filterCategory);
    }
    
    // Select the filter value
    const filterValue = this.page.locator(`//div[contains(@class, "filter-options-content")]//a[contains(., "${value}")]`);
    await this.clickElement(filterValue);
    await this.waitForNavigation();
  }

  /**
   * Click on a product by index
   * @param index - Product index (0-based)
   */
  async clickProduct(index: number = 0): Promise<void> {
    await this.clickElement(this.productTitles.nth(index));
    await this.waitForNavigation();
  }

  /**
   * Get total items count from toolbar
   * @returns Total items count as string
   */
  async getTotalItemsCount(): Promise<string> {
    return await this.getText(this.itemsCount);
  }
}