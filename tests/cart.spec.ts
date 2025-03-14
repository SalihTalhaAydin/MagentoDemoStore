import { test, expect } from '@playwright/test';
import HomePage from '../pages/homePage';
import SearchResultsPage from '../pages/searchResultsPage';
import ProductPage from '../pages/productPage';
import CartPage from '../pages/cartPage';
import CheckoutPage from '../pages/checkoutPage';
import { TestData } from '../utils/testData';
import { Constants } from '../utils/constants';
import { cleanupTestSession, extractNumber } from '../utils/helpers';

test.describe('Shopping Cart and Checkout Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(Constants.BASE_URL);
  });

  test.afterEach(async ({ page }) => {
    await cleanupTestSession(page);
  });

  test('User can add product to cart', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    const productPage = new ProductPage(page);
    
    // Use a specific search term to find a product
    const searchTerm = 'tee';
    
    // Act
    // Search for product
    await homePage.searchProduct(searchTerm);
    
    // Click on the first product
    await searchResultsPage.clickProduct(0);
    
    // Get product name before adding to cart
    const productName = await productPage.getProductTitle();
    
    // Add product to cart (with default options where applicable)
    // For configurable products like clothing, we'll need to select size/color
    const productAddOptions = page.locator('.swatch-attribute');
    const hasOptions = await productAddOptions.count() > 0;
    
    if (hasOptions) {
      // Select the first available size
      const sizeOptions = page.locator('.swatch-attribute.size .swatch-option');
      if (await sizeOptions.count() > 0) {
        await sizeOptions.first().click();
      }
      
      // Select the first available color
      const colorOptions = page.locator('.swatch-attribute.color .swatch-option');
      if (await colorOptions.count() > 0) {
        await colorOptions.first().click();
      }
    }
    
    await productPage.addToCart();
    
    // Assert
    // Verify success message
    const successMessage = await productPage.getSuccessMessage();
    expect(successMessage).toContain(Constants.SUCCESS_MESSAGES.ADDED_TO_CART);
    expect(successMessage).toContain(productName?.trim());
    
    // Verify cart icon shows item was added
    // This will be specific to the Magento theme being used
    // For the Luma theme, there's typically a counter on the cart icon
    const cartCounter = page.locator('.counter-number');
    await expect(cartCounter).toBeVisible();
    
    const counterText = await cartCounter.textContent();
    expect(parseInt(counterText || '0')).toBeGreaterThan(0);
  });

  test('User can update cart quantity and remove items', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    
    // Use a specific search term to find a product
    const searchTerm = 'shirt';
    
    // Act - Add product to cart
    await homePage.searchProduct(searchTerm);
    await searchResultsPage.clickProduct(0);
    
    // Handle configurable product options if present
    const productAddOptions = page.locator('.swatch-attribute');
    const hasOptions = await productAddOptions.count() > 0;
    
    if (hasOptions) {
      const sizeOptions = page.locator('.swatch-attribute.size .swatch-option');
      if (await sizeOptions.count() > 0) {
        await sizeOptions.first().click();
      }
      
      const colorOptions = page.locator('.swatch-attribute.color .swatch-option');
      if (await colorOptions.count() > 0) {
        await colorOptions.first().click();
      }
    }
    
    await productPage.addToCart();
    
    // Navigate to cart page
    await cartPage.navigateToCart();
    
    // Get initial cart count
    const initialCartCount = await cartPage.getCartItemsCount();
    expect(initialCartCount).toBe(1);
    
    // Update quantity to 2
    const updatedQty = await cartPage.updateItemQuantity(0, 2);
    
    // Assert - Verify quantity is updated
    expect(updatedQty).toBe('2');
    
    // Remove item from cart
    await cartPage.removeItem(0);
    
    // Assert - Verify cart is empty
    const isCartEmpty = await cartPage.isCartEmpty();
    expect(isCartEmpty).toBeTruthy();
  });

  test('User can complete checkout process as guest', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Generate customer and shipping info
    const checkoutInfo = TestData.generateCheckoutInfo();
    
    // Act - Add product to cart
    await homePage.searchProduct('jacket');
    await searchResultsPage.clickProduct(0);
    
    // Handle configurable product options if present
    const productAddOptions = page.locator('.swatch-attribute');
    const hasOptions = await productAddOptions.count() > 0;
    
    if (hasOptions) {
      const sizeOptions = page.locator('.swatch-attribute.size .swatch-option');
      if (await sizeOptions.count() > 0) {
        await sizeOptions.first().click();
      }
      
      const colorOptions = page.locator('.swatch-attribute.color .swatch-option');
      if (await colorOptions.count() > 0) {
        await colorOptions.first().click();
      }
    }
    
    await productPage.addToCart();
    
    // Navigate to cart and proceed to checkout
    await cartPage.navigateToCart();
    await cartPage.proceedToCheckout();
    
    // Complete checkout process
    await checkoutPage.completeCheckout(checkoutInfo);
    
    // Assert - Verify order confirmation
    const isOrderConfirmed = await checkoutPage.isOrderConfirmed();
    expect(isOrderConfirmed).toBeTruthy();
  });
});