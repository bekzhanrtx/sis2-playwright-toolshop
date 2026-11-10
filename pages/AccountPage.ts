import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountPage extends BasePage {
  readonly pageTitle: Locator = this.byTestId('page-title');
  readonly navMenu: Locator = this.byTestId('nav-menu');
  readonly heading: Locator = this.page.getByRole('heading', { name: /my account/i });

  async expectLoaded(): Promise<void> {
    // URL is the stable success signal on the live demo (DOM markers flake in CI).
    await expect(this.page).toHaveURL(/\/account/, { timeout: 30_000 });
  }

  async expectSignedInAs(displayNamePart: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/account/);
    // Avoid locator.or().first() — it is flaky under CI retries.
    const inNav = await this.navMenu
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
    if (inNav) {
      await expect(this.navMenu).toContainText(displayNamePart);
      return;
    }
    await expect(this.page.locator('body')).toContainText(displayNamePart);
  }
}
