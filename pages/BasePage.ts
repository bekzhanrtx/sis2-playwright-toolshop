import { expect, Locator, Page } from '@playwright/test';

const CLOUDFLARE_RE =
  /security verification|verify you are not a bot|just a moment|cf-browser-verification|performing security/i;

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** All locators go through data-test (configured as testIdAttribute). */
  protected byTestId(id: string): Locator {
    return this.page.getByTestId(id);
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.waitForCloudflareClear();
  }

  /**
   * GitHub Actions runners often hit Cloudflare bot interstitial on the live demo.
   * Wait until it clears (or timeout — callers must tolerate a soft miss).
   */
  async waitForCloudflareClear(timeoutMs = 90_000): Promise<boolean> {
    try {
      await expect
        .poll(async () => !(await this.isCloudflareChallenge()), {
          timeout: timeoutMs,
          intervals: [1_000, 2_000, 3_000],
        })
        .toBe(true);
      return true;
    } catch {
      return false;
    }
  }

  async isCloudflareChallenge(): Promise<boolean> {
    const text = await this.page.locator('body').innerText().catch(() => '');
    return CLOUDFLARE_RE.test(text);
  }
}
