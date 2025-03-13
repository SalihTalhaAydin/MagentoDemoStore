import { Page, Locator } from '@playwright/test';
import BasePage from './basePage';

export default class CheckoutPage extends BasePage {
  // Shipping form locators
  readonly emailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly streetAddressInput: Locator;
  readonly cityInput: Locator;
  readonly stateSelect: Locator;
  readonly zipCodeInput: Locator;
  readonly countrySelect: Locator;
  readonly phoneNumberInput: Locator;
  readonly shippingMethodOptions: Locator;
  readonly nextButton: Locator;
  
  // Payment method locators
  readonly paymentMethods: Locator;
  readonly placeOrderButton: Locator;
  
  // Order confirmation locators
  readonly orderConfirmation: Locator;
  readonly orderNumber: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Shipping form
    this.emailInput = page.getByRole('textbox', { name: 'Email Address * Email Address' });
    this.firstNameInput = page.locator('input[name="firstname"]');
    this.lastNameInput = page.locator('input[name="lastname"]');
    this.streetAddressInput = page.locator('input[name="street[0]"]');
    this.cityInput = page.locator('input[name="city"]');
    this.stateSelect = page.locator('select[name="region_id"]');
    this.zipCodeInput = page.locator('input[name="postcode"]');
    this.countrySelect = page.locator('select[name="country_id"]');
    this.phoneNumberInput = page.locator('input[name="telephone"]');
    this.shippingMethodOptions = page.locator('.table-checkout-shipping-method input[type="radio"]');
    this.nextButton = page.locator('.button.action.continue.primary');
    
    // Payment method
    this.paymentMethods = page.locator('.payment-method-title input[type="radio"]');
    this.placeOrderButton = page.locator('.action.primary.checkout');
    
    // Order confirmation
    this.orderConfirmation = page.locator('.checkout-success');
    this.orderNumber = page.locator('.checkout-success .order-number');
    this.continueShoppingButton = page.locator('.checkout-success .action.primary.continue');
  }

  /**
   * Fill shipping information
   * @param customerInfo - Customer shipping information
   */
  async fillShippingInfo(customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    stateId: string; // State ID or code
    zipCode: string;
    countryId: string; // Country ID or code
    phoneNumber: string;
  }): Promise<void> {
    await this.fillText(this.emailInput, customerInfo.email);
    await this.fillText(this.firstNameInput, customerInfo.firstName);
    await this.fillText(this.lastNameInput, customerInfo.lastName);
    await this.fillText(this.streetAddressInput, customerInfo.street);
    await this.fillText(this.cityInput, customerInfo.city);
    await this.page.selectOption('select[name="region_id"]', customerInfo.stateId);
    await this.fillText(this.zipCodeInput, customerInfo.zipCode);
    await this.page.selectOption('select[name="country_id"]', customerInfo.countryId);
    await this.fillText(this.phoneNumberInput, customerInfo.phoneNumber);
  }

  /**
   * Select shipping method
   * @param index - Shipping method index (0-based)
   */
  async selectShippingMethod(index: number = 0): Promise<void> {
    await this.clickElement(this.shippingMethodOptions.nth(index));
  }

  /**
   * Click next button to proceed to payment
   */
  async goToPaymentMethod(): Promise<void> {
    await this.clickElement(this.nextButton);
  }

  /**
   * Select payment method
   * @param index - Payment method index (0-based)
   */
  async selectPaymentMethod(index: number = 0): Promise<void> {
    // Wait for payment methods to be visible
    await this.waitForElement(this.paymentMethods.first(), 10000);
    await this.clickElement(this.paymentMethods.nth(index));
  }

  /**
   * Place order
   */
  async placeOrder(): Promise<void> {
    await this.clickElement(this.placeOrderButton);
    await this.waitForElement(this.orderConfirmation, 30000);
  }

  /**
   * Get order number
   * @returns Order number as string
   */
  async getOrderNumber(): Promise<string> {
    return (await this.getText(this.orderNumber)).trim();
  }

  /**
   * Check if order is confirmed
   * @returns Boolean indicating if order is confirmed
   */
  async isOrderConfirmed(): Promise<boolean> {
    return await this.isElementVisible(this.orderConfirmation);
  }

  /**
   * Complete checkout process
   * @param customerInfo - Customer shipping information
   * @param shippingMethodIndex - Shipping method index
   * @param paymentMethodIndex - Payment method index
   */
  async completeCheckout(
    customerInfo: {
      email: string;
      firstName: string;
      lastName: string;
      street: string;
      city: string;
      stateId: string;
      zipCode: string;
      countryId: string;
      phoneNumber: string;
    },
    shippingMethodIndex: number = 0,
    paymentMethodIndex: number = 0
  ): Promise<void> {
    // Fill shipping information
    await this.fillShippingInfo(customerInfo);
    
    // Select shipping method
    await this.selectShippingMethod(shippingMethodIndex);
    
    
    // Go to payment method
    await this.goToPaymentMethod();
    
    //TODO PAYMENT METHOD IS NOT IMPLMENTED YET
    //await this.selectPaymentMethod(paymentMethodIndex);
    
    // Place order
    await this.placeOrder();
  }
}