import { test, expect } from "@playwright/test";
import HomePage from "../pages/homePage";
import AuthPage from "../pages/authPage";
import AccountPage from "../pages/accountPage";
import { TestData } from "../utils/testData";
import { Constants } from "../utils/constants";
import { cleanupTestSession } from "../utils/helpers";

test.describe("Authentication Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(Constants.BASE_URL);
  });

  test.afterEach(async ({ page }) => {
    await cleanupTestSession(page);
  });

  test("User can register a new account", async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const authPage = new AuthPage(page);
    const accountPage = new AccountPage(page);

    const customer = TestData.generateCustomer();

    // Act
    // Go to create account page
    await homePage.clickCreateAccount();

    // Fill registration form and submit
    await authPage.register(
      customer.firstName,
      customer.lastName,
      customer.email,
      customer.password
    );

    // Assert
    // Check for success message
    const successMessage = await authPage.getRegistrationSuccessMessage();
    expect(successMessage).toContain(Constants.SUCCESS_MESSAGES.REGISTRATION);

    // Verify user is logged in and on account dashboard
    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    // Verify welcome message contains customer name
    const welcomeMessage = await accountPage.getWelcomeMessage();
    expect(welcomeMessage).toContain(customer.firstName);
    expect(welcomeMessage).toContain(customer.lastName);
  });

  test("User can login with valid credentials", async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const authPage = new AuthPage(page);
    const accountPage = new AccountPage(page);

    // Register a new user first to ensure we have valid credentials
    const customer = TestData.generateCustomer();

    // Navigate to create account page
    await page.goto(Constants.REGISTER_URL);

    // Register new account
    await authPage.register(
      customer.firstName,
      customer.lastName,
      customer.email,
      customer.password
    );

    // Logout (clean session)
    await cleanupTestSession(page);
    await page.goto(Constants.BASE_URL);

    // Act
    // Navigate to login page
    await homePage.clickSignIn();

    // Login with credentials
    await authPage.login(customer.email, customer.password);

    // Assert
    // Verify user is logged in
    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    // Navigate to account page and verify welcome message
    await accountPage.navigateToAccountDashboard();
    const welcomeMessage = await accountPage.getWelcomeMessage();
    expect(welcomeMessage).toContain(customer.firstName);
  });

  test("User cannot login with invalid credentials", async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const authPage = new AuthPage(page);

    // Act
    // Navigate to login page
    await homePage.clickSignIn();

    // Login with invalid credentials
    await authPage.login("invalid_email@example.com", "invalid_password");

    // Assert
    // Verify error message is displayed
    const errorMessage = await authPage.getLoginErrorMessage();
    expect(errorMessage).toContain(Constants.ERROR_MESSAGES.LOGIN_FAILED);

    // Verify user is not logged in
    let isLoggedIn = false;
    try {
      isLoggedIn = await homePage.isUserLoggedIn();
    } catch (error) {
      isLoggedIn = false; // Explicitly handle failures
    }
    expect(isLoggedIn).toBeFalsy();
  });

  test("User can access and update account information", async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const authPage = new AuthPage(page);
    const accountPage = new AccountPage(page);

    // Register a new user first
    const customer = TestData.generateCustomer();

    // Navigate to create account page
    await page.goto(Constants.REGISTER_URL);

    // Register new account
    await authPage.register(
      customer.firstName,
      customer.lastName,
      customer.email,
      customer.password
    );

    // Act
    // Navigate to account information page
    await accountPage.navigateToAccountInformation();

    // Update password
    const newPassword = `${customer.password}New!`;
    await accountPage.changePassword(customer.password, newPassword);

    // Assert
    // Verify success message
    const successMessage = await accountPage.getSuccessMessage();
    expect(successMessage).toContain("You saved the account information");

    // Logout and login with new password to verify it was updated
    await cleanupTestSession(page);
    await page.goto(Constants.LOGIN_URL);
    await authPage.login(customer.email, newPassword);

    // Verify user is logged in
    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });
});
