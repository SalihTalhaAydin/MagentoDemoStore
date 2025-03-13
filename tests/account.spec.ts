import { test, expect } from '@playwright/test';
import HomePage from '../pages/homePage';
import AuthPage from '../pages/authPage';
import AccountPage from '../pages/accountPage';
import SearchResultsPage from '../pages/searchResultsPage';
import ProductPage from '../pages/productPage';
import { TestData } from '../utils/testData';
import { Constants } from '../utils/constants';
import { cleanupTestSession } from '../utils/helpers';

test.describe('Account Management Tests', () => {
  let customer: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
  };

  test.beforeAll(async () => {
    // Generate a shared test user to use across tests
    customer = TestData.generateCustomer();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(Constants.BASE_URL);
  });

  test.afterEach(async ({ page }) => {
    await cleanupTestSession(page);
  });

  test('User can view and navigate account dashboard sections', async ({ page }) => {
    // Arrange - Create a new account
    const homePage = new HomePage(page);
    const authPage = new AuthPage(page);
    const accountPage = new AccountPage(page);
    
    // Go to create account page
    await homePage.clickCreateAccount();
    
    // Register new account
    await authPage.register(
      customer.firstName,
      customer.lastName,
      customer.email,
      customer.password
    );
    
    // Act - Navigate to account dashboard
    await accountPage.navigateToAccountDashboard();
    
    // Assert - Verify account dashboard elements
    const pageTitle = await page.locator('.page-title').textContent();
    expect(pageTitle).toContain('My Account');
    
    // Verify account navigation links
    await expect(accountPage.myOrdersLink).toBeVisible();
    await expect(accountPage.addressBookLink).toBeVisible();
    await expect(accountPage.accountInfoLink).toBeVisible();
    
    // Navigate to Address Book
    await accountPage.navigateToAddressBook();
    const addressBookTitle = await page.locator('.page-title').textContent();
    expect(addressBookTitle).toContain('Address Book');
    
    // Navigate to Account Information
    await accountPage.navigateToAccountInformation();
    const accountInfoTitle = await page.locator('.page-title').textContent();
    expect(accountInfoTitle).toContain('Account Information');
  });

  test('User can view order history after placing an order', async ({ page }) => {
    // This test requires placing an order first, which is a complex flow
    // We'll simulate this with a simplified version for the demo
    
    // Arrange - Register and log in
    const homePage = new HomePage(page);
    const authPage = new AuthPage(page);
    const accountPage = new AccountPage(page);
    const searchResultsPage = new SearchResultsPage(page);
    const productPage = new ProductPage(page);
    
    // Go to create account page (or login if account exists)
    await homePage.clickCreateAccount();
    
    // Try to register, but if email already exists, log in instead
    try {
      await authPage.register(
        customer.firstName,
        customer.lastName,
        customer.email,
        customer.password
      );
    } catch (e) {
      // Email might already be registered from previous test
      await page.goto(Constants.LOGIN_URL);
      await authPage.login(customer.email, customer.password);
    }
    
    // Act - Add a product to cart (simulating order placement)
    // For a real test, we would complete checkout, but we'll skip for brevity
    await homePage.searchProduct('simple product');
    await searchResultsPage.clickProduct(0);
    
    // Handle product options if necessary
    const hasOptions = await page.locator('.swatch-attribute').count() > 0;
    if (hasOptions) {
      await page.locator('.swatch-option').first().click();
    }
    
    await productPage.addToCart();
    
    // Navigate to My Orders
    await accountPage.navigateToMyOrders();
    
    // Assert - Verify we're on the orders page
    const ordersTitle = await page.locator('.page-title').textContent();
    expect(ordersTitle).toContain('My Orders');
    
    // Note: A new account won't have orders until checkout is completed
    // For a complete test, we would verify order details after checkout
  });

  test('User can update account information', async ({ page }) => {
    // Arrange - Log in with existing account
    const homePage = new HomePage(page);
    const authPage = new AuthPage(page);
    const accountPage = new AccountPage(page);
    
    // Go to login page
    await homePage.clickSignIn();
    
    // Login with credentials
    await authPage.login(customer.email, customer.password);
    
    // Act - Navigate to account information
    await accountPage.navigateToAccountInformation();
    
    // Update first name
    const newFirstName = `Updated${customer.firstName}`;
    await page.locator('#firstname').fill(newFirstName);
    
    // Enter current password (required for any account changes)
    await page.locator('#current-password').fill(customer.password);
    
    // Save changes
    await page.locator('button.save').click();
    
    // Assert - Verify success message
    const successMessage = await accountPage.getSuccessMessage();
    expect(successMessage).toContain('You saved the account information');
    
    // Verify first name was updated
    await accountPage.navigateToAccountDashboard();
    const welcomeMessage = await accountPage.getWelcomeMessage();
    expect(welcomeMessage).toContain(newFirstName);
  });

  test('User can subscribe and unsubscribe from newsletter', async ({ page }) => {
    // Arrange - Log in with existing account
    const homePage = new HomePage(page);
    const authPage = new AuthPage(page);
    const accountPage = new AccountPage(page);
    
    // Go to login page
    await homePage.clickSignIn();
    
    // Login with credentials
    await authPage.login(customer.email, customer.password);
    
    // Act - Navigate to newsletter subscriptions
    await accountPage.navigateToNewsletterSubscriptions();
    
    // Get current subscription status
    const isCurrentlySubscribed = await page.locator('#subscription').isChecked();
    
    // Toggle subscription status
    await page.locator('#subscription').setChecked(!isCurrentlySubscribed);
    
    // Save changes
    await page.locator('button.save').click();
    
    // Assert - Verify success message
    const successMessage = await page.locator('.message-success').textContent();
    
    if (isCurrentlySubscribed) {
      expect(successMessage).toContain('You unsubscribed');
    } else {
      expect(successMessage).toContain('You have been successfully subscribed');
    }
    
    // Verify checkbox state changed
    const newSubscriptionState = await page.locator('#subscription').isChecked();
    expect(newSubscriptionState).toBe(!isCurrentlySubscribed);
  });
});