import { test, expect } from '../fixtures/testFixtures';

test.describe('1. Register a new customer', () => {
  test('creates a unique account and lands on login or signed-in state', async ({
    registerPage,
    loginPage,
    accountPage,
    newCustomer,
    page,
  }) => {
    await registerPage.open();
    await registerPage.register(newCustomer);

    // Assignment: unique account created → signed in OR on the login page.
    await expect
      .poll(
        async () => {
          if (/\/auth\/login|\/account/.test(page.url())) return true;
          return accountPage.navMenu.isVisible().catch(() => false);
        },
        { timeout: 45_000 }
      )
      .toBeTruthy();

    const onLogin = /\/auth\/login/.test(page.url());
    const onAccount = /\/account/.test(page.url());
    const menuVisible = await accountPage.navMenu.isVisible().catch(() => false);

    expect(onLogin || onAccount || menuVisible).toBeTruthy();

    if (onLogin) {
      // URL alone proves "on the login page"; form may hydrate a moment later.
      await expect(page).toHaveURL(/\/auth\/login/);
      await expect(loginPage.submitButton.or(loginPage.emailInput).first()).toBeVisible({
        timeout: 30_000,
      });
    }

    if (onAccount || menuVisible) {
      await expect(accountPage.navMenu).toContainText(newCustomer.firstName);
    }
  });
});
