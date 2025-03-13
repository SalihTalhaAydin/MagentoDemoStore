export const Constants = {
    // URLs
    BASE_URL: 'https://magento.softwaretestingboard.com',
    LOGIN_URL: '/customer/account/login/',
    REGISTER_URL: '/customer/account/create/',
    ACCOUNT_URL: '/customer/account/',
    CART_URL: '/checkout/cart/',
    CHECKOUT_URL: '/checkout/',
    
    // Timeouts
    DEFAULT_TIMEOUT: 30000,
    ANIMATION_TIMEOUT: 500,
    
    // Test data
    DEFAULT_PASSWORD: 'Test@123456',
    DEFAULT_COUNTRY: 'US',
    DEFAULT_STATE: 'California',
    DEFAULT_STATE_ID: '12', // California
    
    // Product categories
    CATEGORIES: {
      MEN: 'Men',
      WOMEN: 'Women',
      GEAR: 'Gear',
      TRAINING: 'Training',
      SALE: 'Sale'
    },
    
    // Error messages
    ERROR_MESSAGES: {
      REQUIRED_FIELD: 'This is a required field.',
      INVALID_EMAIL: 'Please enter a valid email address.',
      INVALID_PASSWORD: 'Minimum length of this field must be equal or greater than 8 symbols.',
      LOGIN_FAILED: 'The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.'
    },
    
    // Success messages
    SUCCESS_MESSAGES: {
      REGISTRATION: 'Thank you for registering with',
      ADDED_TO_CART: 'You added',
      ORDER_PLACED: 'Thank you for your purchase!'
    }
  };