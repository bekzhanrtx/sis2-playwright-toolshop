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

    // App may either auto-sign-in or redirect to the login form.
    await Promise.race([
      page.waitForURL(/\/auth\/login/, { timeout: 15_000 }),
      page.waitForURL(/\/account/, { timeout: 15_000 }),
      accountPage.navMenu.waitFor({ state: 'visible', timeout: 15_000 }),
    ]);

    const onLogin = /\/auth\/login/.test(page.url());
    const onAccount = /\/account/.test(page.url());
    const menuVisible = await accountPage.navMenu.isVisible().catch(() => false);

    expect(onLogin || onAccount || menuVisible).toBeTruthy();

    if (onLogin) {
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.submitButton).toBeVisible();
    }

    if (onAccount || menuVisible) {
      await expect(accountPage.navMenu).toContainText(newCustomer.firstName);
    }
  });
});
