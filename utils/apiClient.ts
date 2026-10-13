import { APIRequestContext, expect } from '@playwright/test';
import { CustomerData } from './testData';

const API_URL = 'https://api.practicesoftwaretesting.com';

/**
 * Seed a user via REST so UI login tests stay independent of the register UI.
 * If registration UI breaks, only the register suite should fail.
 */
export async function registerCustomerViaApi(
  request: APIRequestContext,
  customer: CustomerData
): Promise<void> {
  const response = await request.post(`${API_URL}/users/register`, {
    data: {
      first_name: customer.firstName,
      last_name: customer.lastName,
      dob: customer.dateOfBirth,
      phone: customer.phone,
      email: customer.email,
      password: customer.password,
      address: {
        street: customer.street,
        city: customer.city,
        state: customer.state,
        country: customer.country,
        postal_code: customer.postalCode,
      },
    },
  });

  expect(response.status(), await response.text()).toBe(201);
}
