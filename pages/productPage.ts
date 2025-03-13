import { Page, Locator } from '@playwright/test';
import BasePage from './basePage';

export default class ProductPage extends BasePage {
  // Locators
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly addToCartButton: Locator;
  readonly quantityInput: Locator;
  readonly sizeOptions: Locator;
  readonly colorOptions: Locator;
  readonly successMessage: Locator;
  readonly reviewsTab: Locator;
  readonly addToWishlistButton: Locator;
  readonly addToCompareButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.locator('.page-title');
    this.productPrice = page.locator('.product-info-price .price');
    this.productDescription = page.locator('.product.attribute.description');
    this.addToCartButton = page.locator('#product-addtocart-button');
    this.quantityInput = page.locator('#qty');
    this.sizeOptions = page.locator('.swatch-option.text');
    this.colorOptions = page.locator('.swatch-option.color');
    this.successMessage = page.locator('[data-ui-id="message-success"]');
    this.reviewsTab = page.locator('#tab-label-reviews-title');
    this.addToWishlistButton = page.locator('.towishlist');
    this.addToCompareButton = page.locator('.tocompare');
  }

  /**
   * Get product title
   * @returns Product title text
   */
  async getProductTitle(): Promise<string> {
    return await this.getText(this.productTitle);
  }

  /**
   * Get product price
   * @returns Product price text
   */
  async getProductPrice(): Promise<string> {
    return await this.getText(this.productPrice);
  }

  /**
   * Set product quantity
   * @param quantity - Product quantity
   */
  async setQuantity(quantity: number): Promise<void> {
    await this.fillText(this.quantityInput, quantity.toString());
  }

  /**
   * Select product size
   * @param size - Product size (e.g. 'S', 'M', 'L')
   */
  async selectSize(size: string): Promise<void> {
    const sizeOption = this.page.locator(`.swatch-option.text:has-text("${size}")`);
    await this.clickElement(sizeOption);
  }

  /**
   * Select product color
   * @param colorIndex - Color index (0-based)
   */
  async selectColor(colorIndex: number = 0): Promise<void> {
    await this.clickElement(this.colorOptions.nth(colorIndex));
  }

  /**
   * Add product to cart
   * @param quantity - Product quantity (optional)
   * @param size - Product size (optional)
   * @param colorIndex - Color index (optional)
   */
  async addToCart(quantity?: number, size?: string, colorIndex?: number): Promise<void> {
    // Set quantity if provided
    if (quantity && quantity > 1) {
      await this.setQuantity(quantity);
    }
    
    // Select size if available and provided
    if (size && await this.sizeOptions.count() > 0) {
      await this.selectSize(size);
    }
    
    // Select color if available and provided
    if (typeof colorIndex === 'number' && await this.colorOptions.count() > 0) {
      await this.selectColor(colorIndex);
    }
    
    await this.clickElement(this.addToCartButton);
    
    // Wait for success message
    await this.waitForElement(this.successMessage, 10000);
  }

  /**
   * Get success message
   * @returns Success message text
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.successMessage);
  }
}