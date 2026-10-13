import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountPage extends BasePage {
  readonly pageTitle: Locator = this.byTestId('page-title');
  readonly navMenu: Locator = this.byTestId('nav-menu');
  readonly heading: Locator = this.page.getByRole('heading', { name: /my account/i });

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/account/);
    await expect(this.heading).toBeVisible();
  }

  async expectSignedInAs(displayNamePart: string): Promise<void> {
    await expect(this.navMenu).toContainText(displayNamePart);
  }
}
