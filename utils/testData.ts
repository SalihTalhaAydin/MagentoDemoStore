import faker from 'faker'

export class TestData {
  /**
   * Generate random customer data
   * @returns Random customer data object
   */
  static generateCustomer() {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = `user${faker.datatype.uuid()}@testemail.com`;
    
    return {
      firstName,
      lastName,
      email,
      password: 'Test@123456',
      phoneNumber: faker.phone.phoneNumber('##########')
    };
  }

  /**
   * Generate random US address
   * @returns Random US address object
   */
  static generateUSAddress() {
    return {
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      stateCode: '1', // Default to California
      zipCode: faker.address.zipCode('#####'),
      countryId: 'US'
    };
  }

  /**
   * Generate random product search terms
   * @returns Array of product search terms
   */
  static getSearchTerms() {
    return [
      'shirt',
      'jacket',
      'pants',
      'shoes',
      'bag',
      'watch',
      'hoodie'
    ];
  }

  /**
   * Get random item from array
   * @param array - Array of items
   * @returns Random item from array
   */
  static getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate complete customer checkout info
   * @returns Customer checkout info object
   */
  static generateCheckoutInfo() {
    const customer = this.generateCustomer();
    const address = this.generateUSAddress();
    
    return {
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      street: address.street,
      city: address.city,
      stateId: address.stateCode,
      zipCode: address.zipCode,
      countryId: address.countryId,
      phoneNumber: customer.phoneNumber,
      password: customer.password
    };
  }
}