import { Page, Locator } from '@playwright/test';
import BasePage from './basePage';

export default class AuthPage extends BasePage {
  // Login form locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly loginErrorMessage: Locator;
  
  // Registration form locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly regEmailInput: Locator;
  readonly regPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly createAccountButton: Locator;
  readonly registrationSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Login form
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('[title="Password"]');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.forgotPasswordLink = page.locator('a:has-text("Forgot Your Password?")');
    this.loginErrorMessage = page.getByText('The account sign-in was');
    
    // Registration form
    this.firstNameInput = page.locator('#firstname');
    this.lastNameInput = page.locator('#lastname');
    this.regEmailInput = page.locator('#email_address');
    this.regPasswordInput = page.locator('#password');
    this.confirmPasswordInput = page.locator('#password-confirmation');
    this.createAccountButton = page.locator('button[title="Create an Account"]');
    this.registrationSuccessMessage = page.locator('.message-success');
  }

  /**
   * Login with credentials
   * @param email - User email
   * @param password - User password
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillText(this.emailInput, email);
    await this.fillText(this.passwordInput, password);
    await this.clickElement(this.signInButton);
    await this.waitForDomContent();
  }

  /**
   * Register a new user
   * @param firstName - User first name
   * @param lastName - User last name
   * @param email - User email
   * @param password - User password
   */
  async register(firstName: string, lastName: string, email: string, password: string): Promise<void> {
    await this.fillText(this.firstNameInput, firstName);
    await this.fillText(this.lastNameInput, lastName);
    await this.fillText(this.regEmailInput, email);
    await this.fillText(this.regPasswordInput, password);
    await this.fillText(this.confirmPasswordInput, password);
    await this.clickElement(this.createAccountButton);
    await this.waitForNavigation();
  }

  /**
   * Get login error message
   * @returns Error message text
   */
  async getLoginErrorMessage(): Promise<string> {
    await this.waitForElement(this.loginErrorMessage);
    return await this.getText(this.loginErrorMessage);
  }

  /**
   * Get registration success message
   * @returns Success message text
   */
  async getRegistrationSuccessMessage(): Promise<string> {
    await this.waitForElement(this.registrationSuccessMessage);
    return await this.getText(this.registrationSuccessMessage);
  }
}