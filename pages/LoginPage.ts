import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator = this.byTestId('email');
  readonly passwordInput: Locator = this.byTestId('password');
  readonly submitButton: Locator = this.byTestId('login-submit');
  readonly loginError: Locator = this.byTestId('login-error');
  readonly forgotPasswordLink: Locator = this.byTestId('forgot-password-link');
  readonly registerLink: Locator = this.byTestId('register-link');

  async open(): Promise<void> {
    await this.goto('/auth/login');
    await expect(this.emailInput).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    const loginResponse = this.page.waitForResponse(
      (res) => res.url().includes('/users/login') && res.request().method() === 'POST',
      { timeout: 30_000 }
    );
    await this.submitButton.click();
    await loginResponse;
  }

  async expectLoginError(): Promise<void> {
    // Prefer data-test; fall back to role=alert if the app renders only a banner.
    const error = this.loginError.or(this.page.getByRole('alert'));
    await expect(error.first()).toBeVisible({ timeout: 20_000 });
    await expect(error.first()).toContainText(/invalid email or password|locked|failed/i);
  }
}
