import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { CustomerData } from '../utils/testData';

export class RegisterPage extends BasePage {
  readonly firstName: Locator = this.byTestId('first-name');
  readonly lastName: Locator = this.byTestId('last-name');
  readonly dateOfBirth: Locator = this.byTestId('dob');
  readonly street: Locator = this.byTestId('street');
  readonly houseNumber: Locator = this.byTestId('house_number');
  readonly postalCode: Locator = this.byTestId('postal_code');
  readonly city: Locator = this.byTestId('city');
  readonly state: Locator = this.byTestId('state');
  readonly country: Locator = this.byTestId('country');
  readonly phone: Locator = this.byTestId('phone');
  readonly email: Locator = this.byTestId('email');
  readonly password: Locator = this.byTestId('password');
  readonly submitButton: Locator = this.byTestId('register-submit');

  async open(): Promise<void> {
    await this.goto('/auth/register');
    await expect(this.firstName).toBeVisible();
  }

  async fillForm(data: CustomerData): Promise<void> {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.dateOfBirth.fill(data.dateOfBirth);
    await this.street.fill(data.street);
    await this.houseNumber.fill(data.houseNumber);
    await this.postalCode.fill(data.postalCode);
    await this.city.fill(data.city);
    await this.state.fill(data.state);
    await this.country.selectOption(data.country);
    await this.phone.fill(data.phone);
    await this.email.fill(data.email);
    await this.password.fill(data.password);
  }

  async register(data: CustomerData): Promise<void> {
    await this.fillForm(data);
    await this.submitButton.click();
  }
}
