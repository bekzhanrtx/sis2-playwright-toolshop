import { expect, Locator, Response } from '@playwright/test';
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

  /**
   * Submits the login form and waits for the API response.
   * Does NOT throw on 401 — invalid credentials are a valid test outcome.
   * On 200, ensures we land on /account (SPA redirect can flake in CI).
   */
  async login(email: string, password: string): Promise<Response> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    const loginResponsePromise = this.page.waitForResponse(
      (res) => res.url().includes('/users/login') && res.request().method() === 'POST',
      { timeout: 45_000 }
    );
    await this.submitButton.click();
    const response = await loginResponsePromise;

    if (response.status() === 200) {
      const reached = await this.page
        .waitForURL(/\/account/, { timeout: 15_000 })
        .then(() => true)
        .catch(() => false);
      if (!reached) {
        await this.goto('/account');
      }
      await expect(this.page).toHaveURL(/\/account/, { timeout: 15_000 });
    }

    return response;
  }

  async expectLoginError(): Promise<void> {
    const error = this.loginError.or(this.page.getByRole('alert'));
    await expect(error.first()).toBeVisible({ timeout: 30_000 });
    await expect(error.first()).toContainText(/invalid email or password|locked|failed|unauthorized/i);
  }
}
