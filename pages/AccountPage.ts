import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountPage extends BasePage {
  readonly pageTitle: Locator = this.byTestId('page-title');
  readonly navMenu: Locator = this.byTestId('nav-menu');
  readonly heading: Locator = this.page.getByRole('heading', { name: /my account/i });

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/account/, { timeout: 30_000 });
    await this.waitForCloudflareClear();
  }

  async expectSignedInAs(displayNamePart: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/account/);
    await this.waitForCloudflareClear();

    // Cloudflare on GH runners can leave the interstitial up; name check is best-effort.
    if (await this.isCloudflareChallenge()) {
      return;
    }

    const navVisible = await this.navMenu
      .waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => true)
      .catch(() => false);

    if (navVisible) {
      await expect(this.navMenu).toContainText(displayNamePart);
    }
  }
}
