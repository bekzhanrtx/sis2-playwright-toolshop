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

    // After a successful register API call the app may redirect slowly.
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
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.submitButton).toBeVisible();
    }

    if (onAccount || menuVisible) {
      await expect(accountPage.navMenu).toContainText(newCustomer.firstName);
    }
  });
});
