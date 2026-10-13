/**
 * Unique, collision-safe test data for independent runs (any order / parallel).
 */
export type CustomerData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  state: string;
  /** ISO country code used by both UI select and API */
  country: string;
  phone: string;
  email: string;
  password: string;
};

export function uniqueSuffix(): string {
  return `${Date.now()}${Math.floor(Math.random() * 10_000)}`;
}

/** Password avoids common leaked-password API rejection. */
export function uniquePassword(): string {
  return `Aa1!${uniqueSuffix()}`;
}

export function createCustomer(overrides: Partial<CustomerData> = {}): CustomerData {
  const suffix = uniqueSuffix();
  return {
    firstName: 'Auto',
    lastName: `User${suffix.slice(-4)}`,
    dateOfBirth: '1990-01-15',
    street: '1 Test Street',
    houseNumber: '10',
    postalCode: '050000',
    city: 'Almaty',
    state: 'Almaty',
    country: 'KZ',
    phone: '5551234567',
    email: `sis2.${suffix}@mailinator.com`,
    password: uniquePassword(),
    ...overrides,
  };
}

export const SEEDED_CUSTOMER = {
  email: 'customer2@practicesoftwaretesting.com',
  password: 'welcome01',
  displayName: 'Jack Howe',
} as const;
