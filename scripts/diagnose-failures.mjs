import { chromium } from 'playwright';

const BASE = 'https://practicesoftwaretesting.com';
const API = 'https://api.practicesoftwaretesting.com';
const tid = (page, id) => page.locator(`[data-test="${id}"]`);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.setDefaultTimeout(45000);

// Home products
await page.goto(BASE, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(5000);
const cards = await page.locator('a[data-test^="product-"]').count();
const names = await page.locator('[data-test="product-name"]').count();
console.log('home cards', cards, 'names', names);
console.log('body snippet', (await page.locator('body').innerText()).slice(0, 400));

// API register + login
const email = `diag.${Date.now()}@mailinator.com`;
const password = `Aa1!${Date.now()}`;
const reg = await page.request.post(`${API}/users/register`, {
  data: {
    first_name: 'Auto',
    last_name: 'Diag',
    dob: '1990-01-15',
    phone: '5551234567',
    email,
    password,
    address: {
      street: '1 Test',
      city: 'Almaty',
      state: 'Almaty',
      country: 'KZ',
      postal_code: '050000',
    },
  },
});
console.log('api register', reg.status(), await reg.text());
const loginApi = await page.request.post(`${API}/users/login`, {
  data: { email, password },
});
console.log('api login', loginApi.status(), (await loginApi.text()).slice(0, 200));

// UI login
await page.goto(`${BASE}/auth/login`, { waitUntil: 'domcontentloaded' });
await tid(page, 'email').fill(email);
await tid(page, 'password').fill(password);
const loginResp = page.waitForResponse((r) => r.url().includes('/users/login') && r.request().method() === 'POST').catch(() => null);
await tid(page, 'login-submit').click();
const lr = await loginResp;
console.log('ui login response', lr?.status(), lr ? await lr.text().then((t) => t.slice(0, 200)) : 'none');
await page.waitForTimeout(3000);
console.log('after login url', page.url());
console.log('alerts', await page.locator('.alert, [role="alert"], [data-test*="error"]').allTextContents());

// invalid login
await page.goto(`${BASE}/auth/login`, { waitUntil: 'domcontentloaded' });
await tid(page, 'email').fill('nobody.invalid@example.com');
await tid(page, 'password').fill('WrongPass1!');
await tid(page, 'login-submit').click();
await page.waitForTimeout(3000);
console.log('invalid alerts', await page.locator('.alert, [role="alert"], [data-test*="error"]').allTextContents());
const ids = await page.evaluate(() =>
  [...new Set([...document.querySelectorAll('[data-test]')].map((e) => e.getAttribute('data-test')))].sort()
);
console.log('login ids', ids.filter((x) => /error|login|alert/i.test(x)).join(', '));

await browser.close();
