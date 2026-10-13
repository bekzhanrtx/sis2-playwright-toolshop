import { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** All locators go through data-test (configured as testIdAttribute). */
  protected byTestId(id: string): Locator {
    return this.page.getByTestId(id);
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }
}
