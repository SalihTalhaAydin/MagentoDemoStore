import { Page, Locator } from '@playwright/test';
import BasePage from './basePage';

export default class CartPage extends BasePage {
  // Locators
  readonly cartItems: Locator;
  readonly cartItemName: Locator;
  readonly cartItemPrice: Locator;
  readonly cartItemQty: Locator;
  readonly cartItemSubtotal: Locator;
  readonly removeItemButton: Locator;
  readonly updateCartButton: Locator;
  readonly emptyCartButton: Locator;
  readonly cartSubtotal: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly continueShopping: Locator;
  readonly applyDiscountCodeButton: Locator;
  readonly discountCodeInput: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart.item');
    this.cartItemName = page.locator('.product-item-name');
    this.cartItemPrice = page.locator('.price');
    this.cartItemQty = page.locator('[class="input-text qty"]');
    this.cartItemSubtotal = page.locator('.subtotal .price');
    this.removeItemButton = page.locator('.action-delete');
    this.updateCartButton = page.locator('.update');
    this.emptyCartButton = page.locator('#empty_cart_button');
    this.cartSubtotal = page.locator('.subtotal .price');
    this.proceedToCheckoutButton = page.getByRole('button', { name: 'Proceed to Checkout' });
    this.emptyCartMessage = page.locator('.cart-empty');
    this.continueShopping = page.locator('.action.continue');
    this.applyDiscountCodeButton = page.locator('.action.apply.primary');
    this.discountCodeInput = page.locator('#coupon_code');
  }

  /**
   * Navigate to the cart page
   */
  async navigateToCart(): Promise<void> {
    await this.navigate('/checkout/cart/');
    await this.waitForNavigation();
  }

  /**
   * Get cart items count
   * @returns Number of items in cart
   */
  async getCartItemsCount(): Promise<number> {
    if (await this.isElementVisible(this.emptyCartMessage)) {
      return 0;
    }
    return await this.cartItems.count();
  }

  /**
   * Update item quantity
   * @param index - Item index (0-based)
   * @param quantity - New quantity
   */
  async updateItemQuantity(index: number, quantity: number): Promise<string> {
    await this.fillText(this.cartItemQty.nth(index), quantity.toString());
    await this.clickElement(this.updateCartButton);
    await this.waitForNavigation();
    const updatedQuantity = await this.cartItemQty.nth(index).getAttribute('value');
    return updatedQuantity?.trim() ?? '-1';
  }

  /**
   * Remove item from cart
   * @param index - Item index (0-based)
   */
  async removeItem(index: number): Promise<void> {
    await this.clickElement(this.removeItemButton.nth(index));
    await this.waitForNavigation();
  }

  /**
   * Empty the cart
   */
  async emptyCart(): Promise<void> {
    if (await this.isElementVisible(this.emptyCartButton)) {
      await this.clickElement(this.emptyCartButton);
      // Accept the confirmation dialog
      await this.page.waitForEvent('dialog', { timeout: 5000 })
        .then(dialog => dialog.accept());
      await this.waitForNavigation();
    }
  }

  /**
   * Get cart subtotal
   * @returns Cart subtotal text
   */
  async getCartSubtotal(): Promise<string> {
    return await this.getText(this.cartSubtotal);
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout(): Promise<void> {
    await this.clickElement(this.proceedToCheckoutButton);
    await this.waitForNavigation();
  }

  /**
   * Check if cart is empty
   * @returns Boolean indicating if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    return await this.isElementVisible(this.emptyCartMessage);
  }

  /**
   * Apply discount code
   * @param code - Discount code
   */
  async applyDiscountCode(code: string): Promise<void> {
    await this.fillText(this.discountCodeInput, code);
    await this.clickElement(this.applyDiscountCodeButton);
    await this.waitForNavigation();
  }
}