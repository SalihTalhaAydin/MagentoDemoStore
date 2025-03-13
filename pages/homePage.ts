import { Page, Locator } from '@playwright/test';
import BasePage from './basePage';

export default class HomePage extends BasePage {
  // Locators
  readonly signInLink: Locator;
  readonly createAccountLink: Locator;
  readonly searchBar: Locator;
  readonly searchButton: Locator;
  readonly accountMenuButton: Locator;
  readonly cartIcon: Locator;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.signInLink = page.locator('.authorization-link a');
    this.createAccountLink = page.locator('a:has-text("Create an Account")');
    this.searchBar = page.locator('#search');
    this.searchButton = page.locator('button[title="Search"]');
    this.accountMenuButton = page.locator('.action.switch');
    this.cartIcon = page.locator('.minicart-wrapper .action.showcart');
    this.welcomeMessage = page.locator('.greet.welcome');
  }

  /**
   * Navigate to the home page
   */
  async navigateToHome(): Promise<void> {
    await this.navigate('/');
    await this.waitForNavigation();
  }

  /**
   * Click on the sign in link
   */
  async clickSignIn(): Promise<void> {
    await this.clickElement(this.signInLink);
    await this.waitForNavigation();
  }

  /**
   * Click on the create account link
   */
  async clickCreateAccount(): Promise<void> {
    await this.clickElement(this.createAccountLink);
    await this.waitForNavigation();
  }

  /**
   * Search for a product
   * @param searchTerm - Product search term
   */
  async searchProduct(searchTerm: string): Promise<void> {
    await this.fillText(this.searchBar, searchTerm);
    await this.clickElement(this.searchButton);
    await this.waitForNavigation();
  }

  /**
   * Check if user is logged in
   * @returns Boolean indicating if user is logged in
   */
  async isUserLoggedIn(): Promise<boolean> {
    return await this.isElementVisible(this.welcomeMessage);
  }

  /**
   * Open cart
   */
  async openCart(): Promise<void> {
    await this.clickElement(this.cartIcon);
  }
}