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
      { timeout: 45_000 }
    );
    await this.submitButton.click();
    const response = await loginResponse;
    if (!response.ok()) {
      const body = await response.text();
      throw new Error(`Login API failed: ${response.status()} ${body}`);
    }
  }

  async expectLoginError(): Promise<void> {
    const error = this.loginError.or(this.page.getByRole('alert'));
    await expect(error.first()).toBeVisible({ timeout: 30_000 });
    await expect(error.first()).toContainText(/invalid email or password|locked|failed/i);
  }
}
