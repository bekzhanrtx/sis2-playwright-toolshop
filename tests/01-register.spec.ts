import { test, expect } from '../fixtures/testFixtures';

test.describe('1. Register a new customer', () => {
  test('creates a unique account and lands on login or signed-in state', async ({
    registerPage,
    accountPage,
    newCustomer,
    page,
  }) => {
    await registerPage.open();
    await registerPage.register(newCustomer);

    // Assignment: unique account created → signed in OR on the login page.
    // URL / nav-menu is enough; the login form markup can vary after redirect.
    await expect
      .poll(
        async () => {
          if (/\/auth\/login|\/account/.test(page.url())) return 'ok';
          if (await accountPage.navMenu.isVisible().catch(() => false)) return 'ok';
          return 'pending';
        },
        { timeout: 45_000 }
      )
      .toBe('ok');

    const onLogin = /\/auth\/login/.test(page.url());
    const onAccount = /\/account/.test(page.url());
    const menuVisible = await accountPage.navMenu.isVisible().catch(() => false);

    expect(onLogin || onAccount || menuVisible).toBeTruthy();

    if (onAccount || menuVisible) {
      await expect(accountPage.navMenu).toContainText(newCustomer.firstName);
    }
  });
});
