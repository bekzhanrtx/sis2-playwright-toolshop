import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { CustomerData } from '../utils/testData';

export class CheckoutPage extends BasePage {
  readonly productTitle: Locator = this.byTestId('product-title');
  readonly productQuantity: Locator = this.byTestId('product-quantity');
  readonly productPrice: Locator = this.byTestId('product-price');
  readonly cartTotal: Locator = this.byTestId('cart-total');
  readonly proceedToSignIn: Locator = this.byTestId('proceed-1');
  readonly proceedToBilling: Locator = this.byTestId('proceed-2');
  readonly proceedToPayment: Locator = this.byTestId('proceed-3');
  readonly emailInput: Locator = this.byTestId('email');
  readonly passwordInput: Locator = this.byTestId('password');
  readonly loginSubmit: Locator = this.byTestId('login-submit');
  readonly street: Locator = this.byTestId('street');
  readonly houseNumber: Locator = this.byTestId('house_number');
  readonly city: Locator = this.byTestId('city');
  readonly state: Locator = this.byTestId('state');
  readonly country: Locator = this.byTestId('country');
  readonly postalCode: Locator = this.byTestId('postal_code');
  readonly paymentMethod: Locator = this.byTestId('payment-method');
  readonly finishButton: Locator = this.byTestId('finish');
  readonly paymentSuccess: Locator = this.page.getByText(/payment was successful/i);

  async open(): Promise<void> {
    await this.goto('/checkout');
  }

  async expectCartItem(name: string, quantity: string): Promise<void> {
    await expect(this.productTitle).toContainText(name);
    await expect(this.productQuantity).toHaveValue(quantity);
  }

  async goToSignInStep(): Promise<void> {
    await this.proceedToSignIn.click();
    await expect(this.emailInput).toBeVisible();
  }

  async signInAtCheckout(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmit.click();
    await expect(this.proceedToBilling).toBeVisible();
  }

  async continueToBilling(): Promise<void> {
    await this.proceedToBilling.click();
    await expect(this.street).toBeVisible();
  }

  async fillBilling(data: CustomerData): Promise<void> {
    await this.street.fill(data.street);
    await this.houseNumber.fill(data.houseNumber);
    await this.city.fill(data.city);
    await this.state.fill(data.state);
    await this.country.selectOption(data.country);
    await this.postalCode.fill(data.postalCode);
  }

  async continueToPayment(): Promise<void> {
    await this.proceedToPayment.click();
    await expect(this.paymentMethod).toBeVisible();
  }

  async payWithCashOnDelivery(): Promise<void> {
    await this.paymentMethod.selectOption('cash-on-delivery');
    await expect(this.finishButton).toBeVisible();
    await this.finishButton.click();
    await expect(this.paymentSuccess).toBeVisible();
  }
}
