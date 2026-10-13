import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export type CapturedProduct = {
  name: string;
  price: number;
  priceText: string;
};

export class ProductPage extends BasePage {
  readonly productName: Locator = this.byTestId('product-name');
  readonly unitPrice: Locator = this.byTestId('unit-price');
  readonly addToCart: Locator = this.byTestId('add-to-cart');
  readonly increaseQuantity: Locator = this.byTestId('increase-quantity');
  readonly quantity: Locator = this.byTestId('quantity');
  readonly addToCompare: Locator = this.byTestId('add-to-compare');
  readonly navCart: Locator = this.byTestId('nav-cart');
  readonly cartQuantity: Locator = this.byTestId('cart-quantity');

  async expectLoaded(): Promise<void> {
    await expect(this.productName).toBeVisible();
    await expect(this.unitPrice).toBeVisible();
  }

  async captureDetails(): Promise<CapturedProduct> {
    await this.expectLoaded();
    const name = (await this.productName.innerText()).trim();
    const priceText = (await this.unitPrice.innerText()).trim();
    const price = Number(priceText.replace(/[^0-9.]/g, ''));
    return { name, price, priceText };
  }

  async setQuantityTo(target: number): Promise<void> {
    const current = Number(await this.quantity.inputValue());
    for (let i = current; i < target; i++) {
      await this.increaseQuantity.click();
    }
  }

  async addCurrentProductToCart(): Promise<void> {
    await this.addToCart.click();
    await expect(this.cartQuantity).toBeVisible();
  }
}
