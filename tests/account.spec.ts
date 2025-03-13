import { test, expect } from "@playwright/test";
import HomePage from "../pages/homePage";
import AuthPage from "../pages/authPage";
import AccountPage from "../pages/accountPage";
import SearchResultsPage from "../pages/searchResultsPage";
import ProductPage from "../pages/productPage";
import CartPage from "../pages/cartPage";
import CheckoutPage from "../pages/checkoutPage";
import { TestData } from "../utils/testData";
import { Constants } from "../utils/constants";
import { cleanupTestSession } from "../utils/helpers";

test.describe("Account Management Tests", () => {
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

  test("User can view and navigate account dashboard sections", async ({
    page,
  }) => {
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
    const pageTitle = await page.locator(".page-title").textContent();
    expect(pageTitle).toContain("My Account");

    // Verify account navigation links
    await expect(accountPage.myOrdersLink).toBeVisible();
    await expect(accountPage.addressBookLink).toBeVisible();
    await expect(accountPage.accountInfoLink).toBeVisible();

    // Navigate to Address Book
    await accountPage.navigateToAddressBook();
    const addressBookTitle = await page.locator(".page-title").textContent();
    expect(addressBookTitle).toContain("Add New Address");

    // Navigate to Account Information
    await accountPage.navigateToAccountInformation();
    const accountInfoTitle = await page.locator(".page-title").textContent();
    expect(accountInfoTitle).toContain("Edit Account Information");
  });

  test("User can update account information", async ({ page }) => {
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

    // Update first name
    const newFirstName = `Updated${customer.firstName}`;
    await page.locator("#firstname").fill(newFirstName);

    // Save changes
    await page.locator("button.save").click();

    // Assert - Verify success message
    const successMessage = await accountPage.getSuccessMessage();
    expect(successMessage).toContain("You saved the account information");

    // Verify first name was updated
    await accountPage.navigateToAccountDashboard();
    const welcomeMessage = await accountPage.getWelcomeMessage();
    expect(welcomeMessage).toContain(newFirstName);
  });
});
