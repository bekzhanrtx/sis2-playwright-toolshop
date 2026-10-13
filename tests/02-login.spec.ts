import { test, expect } from '../fixtures/testFixtures';

test.describe('2. Log in', () => {
  test('valid credentials reach the account page', async ({
    loginPage,
    accountPage,
    registeredCustomer,
  }) => {
    await loginPage.open();
    await loginPage.login(registeredCustomer.email, registeredCustomer.password);

    await accountPage.expectLoaded();
    await accountPage.expectSignedInAs(registeredCustomer.firstName);
  });

  test('invalid credentials show an error and stay off the account page', async ({
    loginPage,
    page,
  }) => {
    await loginPage.open();
    await loginPage.login('nobody.invalid@example.com', 'WrongPass1!');

    await loginPage.expectLoginError();
    await expect(page).not.toHaveURL(/\/account/);
    await expect(loginPage.emailInput).toBeVisible();
  });
});
