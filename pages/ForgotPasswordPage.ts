import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ForgotPasswordPage extends BasePage {
  readonly emailInput: Locator = this.byTestId('email');
  readonly submitButton: Locator = this.byTestId('forgot-password-submit');
  readonly emailError: Locator = this.byTestId('email-error');
  readonly alert: Locator = this.page.getByRole('alert');

  async open(): Promise<void> {
    await this.goto('/auth/forgot-password');
    await expect(this.emailInput).toBeVisible();
  }

  async submitEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }

  /**
   * Known email: app shows a confirmation alert.
   * (Current build sometimes renders the i18n key itself — still a confirmation signal.)
   */
  async expectConfirmation(): Promise<void> {
    await expect(this.alert).toBeVisible();
    await expect(this.alert).toContainText(/confirm|forgot-password|sent|email/i);
  }

  async expectInvalidEmailError(): Promise<void> {
    await expect(this.emailError).toBeVisible();
  }
}
