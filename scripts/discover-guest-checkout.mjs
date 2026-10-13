import { chromium } from 'playwright';

const BASE = 'https://practicesoftwaretesting.com';
const API = 'https://api.practicesoftwaretesting.com';
const tid = (page, id) => page.locator(`[data-test="${id}"]`);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.setDefaultTimeout(45000);

const email = `buyer.${Date.now()}@mailinator.com`;
const password = `Str0ng!Pass${Date.now()}`;
await page.request.post(`${API}/users/register`, {
  data: {
    first_name: 'Auto',
    last_name: 'Buyer',
    dob: '1990-01-15',
    phone: '5551234567',
    email,
    password,
    address: {
      street: '1 Test Street',
      city: 'Almaty',
      state: 'Almaty',
      country: 'KZ',
      postal_code: '050000',
    },
  },
});

await page.goto(BASE, { waitUntil: 'domcontentloaded' });
await page.locator('[data-test^="product-"]').first().waitFor();
await page.locator('[data-test^="product-"]').first().click();
await tid(page, 'increase-quantity').click();
const expectedName = await tid(page, 'product-name').innerText();
await tid(page, 'add-to-cart').click();
await tid(page, 'nav-cart').click();
console.log({
  title: (await tid(page, 'product-title').innerText()).trim(),
  qty: await tid(page, 'product-quantity').inputValue(),
  expectedName,
});
await tid(page, 'proceed-1').click();
await tid(page, 'email').fill(email);
await tid(page, 'password').fill(password);
await tid(page, 'login-submit').click();
await tid(page, 'proceed-2').waitFor({ state: 'visible' });
await tid(page, 'proceed-2').click();
await tid(page, 'street').waitFor({ state: 'visible' });
await tid(page, 'street').fill('1 Test Street');
await tid(page, 'house_number').fill('10');
await tid(page, 'city').fill('Almaty');
await tid(page, 'state').fill('Almaty');
await tid(page, 'country').selectOption('KZ');
await tid(page, 'postal_code').fill('050000');
await tid(page, 'proceed-3').click();
await tid(page, 'payment-method').waitFor({ state: 'visible' });
await tid(page, 'payment-method').selectOption('cash-on-delivery');
await tid(page, 'finish').waitFor({ state: 'visible' });
await tid(page, 'finish').click();
await page.getByText(/Payment was successful|thanks|confirmed|order/i).first().waitFor({ timeout: 15000 });
await page.screenshot({ path: 'screenshots/discover-order-done.png', fullPage: true });
console.log('DONE:\n', (await page.locator('body').innerText()).slice(0, 1500));
await browser.close();
