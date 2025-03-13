import { test, expect } from '@playwright/test';
import HomePage from '../pages/homePage';
import SearchResultsPage from '../pages/searchResultsPage';
import ProductPage from '../pages/productPage';
import { TestData } from '../utils/testData';
import { Constants } from '../utils/constants';

test.describe('Product Search Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(Constants.BASE_URL);
  });

  test('User can search for products and get relevant results', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    
    // Get a random search term
    const searchTerms = TestData.getSearchTerms();
    const randomSearchTerm = TestData.getRandomItem(searchTerms);
    
    // Act
    // Search for product
    await homePage.searchProduct(randomSearchTerm);
    
    // Assert
    // Verify search results are displayed
    const resultsCount = await searchResultsPage.getResultsCount();
    expect(resultsCount).toBeGreaterThan(0);
    
    // Verify search results title contains search term
    const searchResultsTitle = await searchResultsPage.getSearchResultsTitle();
    expect(searchResultsTitle.toLowerCase()).toContain(`search results for: '${randomSearchTerm}'`);
    
    // Verify product titles contain search term or are relevant
    const productTitles = await page.locator('.product-item-link').allTextContents();
    
    let atLeastOneRelevantResult = false;
    for (const title of productTitles) {
      if (title.toLowerCase().includes(randomSearchTerm.toLowerCase())) {
        atLeastOneRelevantResult = true;
        break;
      }
    }
    
    expect(atLeastOneRelevantResult).toBeTruthy();
  });

  test('User can sort search results', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    
    // Use a search term that will return multiple results
    const searchTerm = 'tee';
    
    // Act
    // Search for product
    await homePage.searchProduct(searchTerm);
    
    // Sort by price (low to high)
    await searchResultsPage.sortProductsBy('price');
    
    // Get all product prices
    const priceElements = page.locator('.price-wrapper .price');
    const count = await priceElements.count();
    
    let prices: number[] = [];
    for (let i = 0; i < count; i++) {
      const priceText = await priceElements.nth(i).textContent();
      if (priceText) {
        prices.push(parseFloat(priceText.replace('$', '')));
      }
    }
    
    // Assert
    // Verify prices are sorted in ascending order
    let isSorted = true;
    for (let i = 0; i < prices.length - 1; i++) {
      if (prices[i] < prices[i + 1]) {
        isSorted = false;
        break;
      }
    }
    
    expect(isSorted).toBeTruthy();
  });

  test('User can navigate to product detail page from search results', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    const productPage = new ProductPage(page);
    
    // Use a common search term
    const searchTerm = 'bag';
    
    // Act
    // Search for product
    await homePage.searchProduct(searchTerm);
    
    // Get the title of the first product in search results
    const firstProductTitle = await page.locator('.product-item-link').first().textContent();
    
    // Click on the first product
    await searchResultsPage.clickProduct(0);
    
    // Get the title on the product detail page
    const productDetailTitle = (await productPage.getProductTitle());
    
    // Assert
    // Verify the product detail page shows the correct product
    expect(productDetailTitle?.trim).toEqual(firstProductTitle?.trim);
    
    // Verify product page elements are present
    const addToCartButton = page.locator('#product-addtocart-button');
    await expect(addToCartButton).toBeVisible();
    
    const productPrice = page.locator('.product-info-price .price');
    await expect(productPrice).toBeVisible();
  });
});