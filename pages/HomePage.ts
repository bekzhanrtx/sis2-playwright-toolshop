import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  /** Product cards only — excludes nested data-test="product-name" / "product-price". */
  readonly productCards: Locator = this.page.locator('a[data-test^="product-"]');
  readonly compareButton: Locator = this.byTestId('compare-btn').first();
  readonly navSignIn: Locator = this.byTestId('nav-sign-in');
  readonly navCart: Locator = this.byTestId('nav-cart');
  readonly cartQuantity: Locator = this.byTestId('cart-quantity');

  async open(): Promise<void> {
    // Catalog is API-driven; under parallel load it can take longer than a blank shell.
    const productsLoaded = this.page
      .waitForResponse(
        (res) =>
          res.url().includes('/products') &&
          res.request().method() === 'GET' &&
          res.ok(),
        { timeout: 30_000 }
      )
      .catch(() => null);

    await this.goto('/');
    await productsLoaded;
    await expect(this.productCards.first()).toBeVisible({ timeout: 30_000 });
  }

  /** Product IDs change between deploys — always pick from the live grid. */
  async openProductByIndex(index: number): Promise<void> {
    await expect(this.productCards.nth(index)).toBeVisible({ timeout: 30_000 });
    await this.productCards.nth(index).click();
  }

  productCard(index: number): Locator {
    return this.productCards.nth(index);
  }
}
