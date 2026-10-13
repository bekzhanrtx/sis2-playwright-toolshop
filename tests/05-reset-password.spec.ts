import { test, expect } from '../fixtures/testFixtures';
import { SEEDED_CUSTOMER } from '../utils/testData';

test.describe('5. Reset a password', () => {
  test('known email shows confirmation', async ({ forgotPasswordPage }) => {
    await forgotPasswordPage.open();
    await forgotPasswordPage.submitEmail(SEEDED_CUSTOMER.email);
    await forgotPasswordPage.expectConfirmation();
  });

  test('invalid email shows a field error', async ({ forgotPasswordPage }) => {
    await forgotPasswordPage.open();
    await forgotPasswordPage.submitEmail('not-a-valid-email');
    await forgotPasswordPage.expectInvalidEmailError();
    await expect(forgotPasswordPage.submitButton).toBeVisible();
  });
});
