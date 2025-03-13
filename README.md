# Magento E-commerce Test Automation

This project contains automated tests for a Magento demo store using Playwright and TypeScript. The tests cover critical e-commerce user flows including authentication, product search, shopping cart operations, and account management.

## 🚀 Features

- **Page Object Model**: Well-structured design pattern for maintainable and scalable tests
- **Type Safety**: Leverages TypeScript for better code quality and developer experience
- **CI/CD Integration**: GitHub Actions workflow for continuous testing
- **Test Data Generation**: Dynamic test data creation for robust testing
- **Parallel Execution**: Tests run in parallel for faster feedback
- **Cross-browser Testing**: Tests run on multiple browsers (Chromium, Firefox, WebKit)
- **Mobile Testing**: Support for mobile viewports
- **Reporting**: HTML and Allure reports for better visualization of test results
- **Retry Logic**: Automatically retries flaky tests for better stability

## 📋 Test Scenarios

### 1. Authentication Tests
- User registration
- Login with valid credentials
- Login with invalid credentials
- Account information update

### 2. Product Search Tests
- Search for products and verify results
- Filter search results
- Sort search results
- Navigate to product detail page

### 3. Shopping Cart & Checkout Tests
- Add product to cart
- Update cart quantity and remove items
- Complete checkout process as guest
- Verify cart subtotal calculation

### 4. Account Management Tests
- View and navigate account dashboard
- View order history
- Update account information
- Subscribe/unsubscribe from newsletter

## 🛠️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/magento-playwright-tests.git
   cd magento-playwright-tests
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

## 🧪 Running Tests

Run all tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

Run tests in headed mode:
```bash
npm run test:headed
```

Run specific test file:
```bash
npx playwright test tests/auth.spec.ts
```

Debug tests:
```bash
npm run debug
```

## 📊 Test Report

After running tests, view the HTML report:
```bash
npm run report
```

## 📁 Project Structure

```
magento-playwright-tests/
├── .github/workflows/       # GitHub Actions configuration
├── playwright.config.ts     # Playwright configuration
├── tests/                   # Test files
│   ├── auth.spec.ts         # Authentication tests
│   ├── search.spec.ts       # Product search tests
│   ├── cart.spec.ts         # Shopping cart tests
│   └── account.spec.ts      # Account management tests
├── pages/                   # Page Object Models
│   ├── basePage.ts          # Base page with common methods
│   ├── homePage.ts          # Home page object
│   ├── authPage.ts          # Login/Register page object
│   └── ...                  # Other page objects
└── utils/                   # Utilities and helpers
    ├── testData.ts          # Test data generator
    ├── helpers.ts           # Helper functions
    └── constants.ts         # Constants used across tests
```

## ✨ Bonus Features

1. **Robust Error Handling**: Tests include retry logic and error recovery
2. **Dynamic Test Data**: Generated unique test data to avoid conflicts
3. **Cross-Browser Compatibility**: Tests run on multiple browsers
4. **CI Integration**: GitHub Actions workflow for automated testing
5. **Comprehensive Documentation**: Well-documented code and README
6. **Test Data Cleanup**: Each test cleans up after itself
7. **Extensible Framework**: Easy to add new test cases

## 🔍 Areas for Improvement

With more time, the following enhancements could be made:

1. **API Integration**: Use API calls for test setup to speed up tests
2. **Visual Testing**: Add screenshot comparison for UI verification
3. **Performance Metrics**: Track and report page load times
4. **Data-Driven Testing**: Parameterize tests for more coverage
5. **Custom Reporter**: Create custom reporting with business metrics
6. **Environment Configuration**: Support for multiple test environments

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.