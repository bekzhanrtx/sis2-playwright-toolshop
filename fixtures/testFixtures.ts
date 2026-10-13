import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { AccountPage } from '../pages/AccountPage';
import { ProductPage } from '../pages/ProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { createCustomer, CustomerData } from '../utils/testData';
import { registerCustomerViaApi } from '../utils/apiClient';

type Pages = {
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  forgotPasswordPage: ForgotPasswordPage;
  accountPage: AccountPage;
  productPage: ProductPage;
  checkoutPage: CheckoutPage;
};

type DataFixtures = {
  /** Fresh unique customer object (not yet registered). */
  newCustomer: CustomerData;
  /** Customer already created via API — ready for UI login. */
  registeredCustomer: CustomerData;
};

export const test = base.extend<Pages & DataFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  newCustomer: async ({}, use) => {
    await use(createCustomer());
  },

  registeredCustomer: async ({ request }, use) => {
    const customer = createCustomer();
    await registerCustomerViaApi(request, customer);
    await use(customer);
  },
});

export { expect } from '@playwright/test';
