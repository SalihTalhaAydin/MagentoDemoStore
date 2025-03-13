import { Page, Locator } from '@playwright/test';
import BasePage from './basePage';

export default class AccountPage extends BasePage {
  // Account dashboard locators
  readonly accountDashboardTitle: Locator;
  readonly welcomeMessage: Locator;
  
  // Account navigation locators
  readonly myAccountLink: Locator;
  readonly myOrdersLink: Locator;
  readonly myDownloadableProductsLink: Locator;
  readonly myWishlistLink: Locator;
  readonly addressBookLink: Locator;
  readonly accountInfoLink: Locator;
  readonly paymentMethodsLink: Locator;
  readonly newsletterSubscriptionsLink: Locator;
  readonly billingAgreementsLink: Locator;
  readonly myProductReviewsLink: Locator;
  
  // Orders section locators
  readonly recentOrdersTable: Locator;
  readonly orderRows: Locator;
  readonly viewOrderLinks: Locator;
  readonly reorderLinks: Locator;
  
  // Edit account locators
  readonly changePasswordCheckbox: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmNewPasswordInput: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Account dashboard
    this.accountDashboardTitle = page.locator('.page-title');
    this.welcomeMessage = page.locator('.box-information .box-content p');
    
    // Account navigation
    this.myAccountLink = page.locator('.nav.item:has-text("My Account")');
    this.myOrdersLink = page.locator('.nav.item:has-text("My Orders")');
    this.myDownloadableProductsLink = page.locator('.nav.item:has-text("My Downloadable Products")');
    this.myWishlistLink = page.locator('.nav.item:has-text("My Wish List")');
    this.addressBookLink = page.locator('.nav.item:has-text("Address Book")');
    this.accountInfoLink = page.locator('.nav.item:has-text("Account Information")');
    this.paymentMethodsLink = page.locator('.nav.item:has-text("Stored Payment Methods")');
    this.newsletterSubscriptionsLink = page.locator('.nav.item:has-text("Newsletter Subscriptions")');
    this.billingAgreementsLink = page.locator('.nav.item:has-text("Billing Agreements")');
    this.myProductReviewsLink = page.locator('.nav.item:has-text("My Product Reviews")');
    
    // Orders section
    this.recentOrdersTable = page.locator('.order-products-toolbar');
    this.orderRows = page.locator('.table-order-items tr');
    this.viewOrderLinks = page.locator('a:has-text("View Order")');
    this.reorderLinks = page.locator('a:has-text("Reorder")');
    
    // Edit account
    this.changePasswordCheckbox = page.locator('#change-password')
    this.currentPasswordInput = page.locator('#current-password');
    this.newPasswordInput = page.locator('#password');
    this.confirmNewPasswordInput = page.locator('#password-confirmation');
    this.saveButton = page.locator('button.save');
    this.successMessage = page.locator('.message-success');
  }

  /**
   * Navigate to account dashboard
   */
  async navigateToAccountDashboard(): Promise<void> {
    await this.navigate('/customer/account/');
    await this.waitForNavigation();
  }

  /**
   * Get welcome message
   * @returns Welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    return await this.getText(this.welcomeMessage);
  }

  /**
   * Navigate to my orders
   */
  async navigateToMyOrders(): Promise<void> {
    await this.clickElement(this.myOrdersLink);
    await this.waitForNavigation();
  }

  /**
   * Get order count
   * @returns Number of orders
   */
  async getOrderCount(): Promise<number> {
    try {
      await this.waitForElement(this.orderRows.first(), 5000);
      return await this.orderRows.count();
    } catch (error) {
      // No orders found
      return 0;
    }
  }

  /**
   * Navigate to account information
   */
  async navigateToAccountInformation(): Promise<void> {
    await this.clickElement(this.accountInfoLink);
    await this.waitForNavigation();
  }

  /**
   * Change password
   * @param currentPassword - Current password
   * @param newPassword - New password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.navigateToAccountInformation();
    await this.clickElement(this.changePasswordCheckbox)
    await this.fillText(this.currentPasswordInput, currentPassword);
    await this.fillText(this.newPasswordInput, newPassword);
    await this.fillText(this.confirmNewPasswordInput, newPassword);
    await this.clickElement(this.saveButton);
    await this.waitForElement(this.successMessage);
  }

  /**
   * Get success message
   * @returns Success message text
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.successMessage);
  }

  /**
   * Navigate to address book
   */
  async navigateToAddressBook(): Promise<void> {
    await this.clickElement(this.addressBookLink);
    await this.waitForNavigation();
  }

  /**
   * Navigate to my wishlist
   */
  async navigateToMyWishlist(): Promise<void> {
    await this.clickElement(this.myWishlistLink);
    await this.waitForNavigation();
  }

  /**
   * Navigate to newsletter subscriptions
   */
  async navigateToNewsletterSubscriptions(): Promise<void> {
    await this.clickElement(this.newsletterSubscriptionsLink);
    await this.waitForNavigation();
  }
}