import { chromium } from 'playwright';

const BASE = 'https://practicesoftwaretesting.com';
const tid = (page, id) => page.locator(`[data-test="${id}"]`);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.setDefaultTimeout(45000);

await page.goto(BASE, { waitUntil: 'domcontentloaded' });
await page.locator('[data-test^="product-"]').first().waitFor();
await page.locator('[data-test^="product-"]').first().click();
await tid(page, 'add-to-cart').click();
await tid(page, 'nav-cart').waitFor({ state: 'visible' });
await tid(page, 'nav-cart').click();
await tid(page, 'product-title').waitFor({ state: 'visible' });
console.log('cart title', await tid(page, 'product-title').innerText());
console.log('qty', await tid(page, 'product-quantity').inputValue().catch(async () => tid(page, 'product-quantity').innerText()));
console.log('price', await tid(page, 'product-price').innerText());

await tid(page, 'proceed-1').click();
await page.waitForTimeout(1000);
console.log('after proceed-1 url/text', page.url());
console.log((await page.locator('body').innerText()).slice(0, 500));

// login with seeded customer
await tid(page, 'email').fill('customer@practicesoftwaretesting.com');
await tid(page, 'password').fill('welcome01');
await tid(page, 'login-submit').click();
await page.waitForTimeout(2500);
console.log('after login in checkout');
console.log((await page.locator('body').innerText()).slice(0, 800));
const ids = await page.evaluate(() =>
  [...new Set([...document.querySelectorAll('[data-test]')].map((e) => e.getAttribute('data-test')))].sort()
);
console.log('ids', ids.join(', '));

if (await tid(page, 'proceed-2').count()) {
  console.log('proceed-2', await tid(page, 'proceed-2').innerText());
  await tid(page, 'proceed-2').click();
  await page.waitForTimeout(1500);
}
console.log('after proceed-2');
console.log((await page.locator('body').innerText()).slice(0, 800));

if (await tid(page, 'proceed-3').count()) {
  console.log('proceed-3', await tid(page, 'proceed-3').innerText());
}
const options = await tid(page, 'payment-method').locator('option').evaluateAll((opts) =>
  opts.map((o) => ({ value: o.value, text: o.textContent.trim() }))
);
console.log('payment options', options);

await tid(page, 'payment-method').selectOption({ index: 1 });
await page.waitForTimeout(500);
const afterPayIds = await page.evaluate(() =>
  [...new Set([...document.querySelectorAll('[data-test]')].map((e) => e.getAttribute('data-test')))].sort()
);
console.log('after payment select ids', afterPayIds.join(', '));
console.log('body', (await page.locator('body').innerText()).slice(0, 1000));

if (await tid(page, 'finish').isEnabled()) {
  await tid(page, 'finish').click();
  await page.waitForTimeout(3000);
  console.log('after finish', (await page.locator('body').innerText()).slice(0, 800));
  await page.screenshot({ path: 'screenshots/discover-order-done.png', fullPage: true });
}

// registration success redirect check quickly via API
const api = await page.request.post('https://api.practicesoftwaretesting.com/users/register', {
  data: {
    first_name: 'Auto',
    last_name: 'Tester',
    dob: '1990-01-01',
    phone: '1234567890',
    email: `auto.${Date.now()}@example.com`,
    password: 'Welcome01!',
    address: {
      street: 'Test Street',
      city: 'Test City',
      state: 'Test State',
      country: 'Kazakhstan',
      postal_code: '010000',
    },
  },
});
console.log('api register status', api.status(), await api.text());

await browser.close();
