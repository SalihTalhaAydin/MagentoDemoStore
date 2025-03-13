import { Page } from '@playwright/test';

/**
 * Wait for a specific amount of time (use sparingly)
 * @param ms - Time to wait in milliseconds
 * @returns Promise that resolves after specified time
 */
export async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extract number from string (e.g. "$45.99" -> 45.99)
 * @param text - Text containing number
 * @returns Extracted number
 */
export function extractNumber(text: string): number {
  const match = text.match(/(\d+([.,]\d+)?)/);
  if (match) {
    return parseFloat(match[0].replace(',', '.'));
  }
  return 0;
}

/**
 * Format date as MM/DD/YYYY
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}/${day}/${year}`;
}

/**
 * Get random integer between min and max (inclusive)
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random integer
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Assert element contains text
 * @param page - Playwright page
 * @param selector - Element selector
 * @param text - Text to assert
 * @returns Promise that resolves when assertion is complete
 */
export async function assertElementContainsText(page: Page, selector: string, text: string): Promise<void> {
  await page.waitForSelector(selector);
  const elementText = await page.$eval(selector, el => el.textContent || '');
  if (!elementText.includes(text)) {
    throw new Error(`Element ${selector} does not contain text "${text}"`);
  }
}

/**
 * Generate a random email with timestamp to avoid conflicts
 * @returns Random email
 */
export function generateRandomEmail(): string {
  const timestamp = new Date().getTime();
  return `test_user_${timestamp}@example.com`;
}

/**
 * Clean up test data (logout, clear cache, etc.)
 * @param page - Playwright page
 */
export async function cleanupTestSession(page: Page): Promise<void> {
  // Clear cookies and local storage
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}