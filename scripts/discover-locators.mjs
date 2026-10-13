import { chromium } from 'playwright';

const BASE = 'https://practicesoftwaretesting.com';

async function dump(page, label) {
  const ids = await page.evaluate(() =>
    [...document.querySelectorAll('[data-test]')]
      .map((el) => el.getAttribute('data-test'))
      .filter(Boolean)
      .sort()
  );
  console.log(`\n=== ${label} (${page.url()}) ===`);
  console.log([...new Set(ids)].join('\n'));
}

const tid = (page, id) => page.locator(`[data-test="${id}"]`);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto(`${BASE}/product/01M4ST4HCTP15HR7050D0XJHQR`, { waitUntil: 'domcontentloaded' });
await tid(page, 'add-to-cart').waitFor({ state: 'visible', timeout: 30000 });
await tid(page, 'add-to-cart').click();
await page.waitForTimeout(1500);
await dump(page, 'AFTER ADD TO CART');
console.log('cart-quantity:', await tid(page, 'cart-quantity').textContent().catch(() => 'missing'));
console.log('nav-cart visible:', await tid(page, 'nav-cart').isVisible().catch(() => false));

if (await tid(page, 'nav-cart').isVisible()) {
  await tid(page, 'nav-cart').click();
} else {
  await page.goto(`${BASE}/checkout`, { waitUntil: 'domcontentloaded' });
}
await page.waitForTimeout(2000);
await dump(page, 'CART/CHECKOUT WITH ITEM');

// proceed through checkout steps if possible
for (const step of ['proceed-1', 'proceed-2', 'proceed-3', 'proceed-to-checkout']) {
  if (await tid(page, step).count()) {
    console.log('found step button', step, 'text=', await tid(page, step).innerText().catch(() => ''));
  }
}

// Compare
await page.goto(`${BASE}/product/01M4ST4HCTP15HR7050D0XJHQR`, { waitUntil: 'domcontentloaded' });
await tid(page, 'add-to-compare').click();
await page.waitForTimeout(500);
await page.goto(`${BASE}/product/01M4ST4HCX3TE42XT35D00VP8G`, { waitUntil: 'domcontentloaded' });
await tid(page, 'add-to-compare').click();
await page.waitForTimeout(500);
if (await tid(page, 'nav-compare').count()) {
  await tid(page, 'nav-compare').click();
} else if (await tid(page, 'compare-btn').count()) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await tid(page, 'compare-btn').click();
} else {
  await page.goto(`${BASE}/compare`, { waitUntil: 'domcontentloaded' });
}
await page.waitForTimeout(2000);
await dump(page, 'COMPARE');

// Login error
await page.goto(`${BASE}/auth/login`, { waitUntil: 'domcontentloaded' });
await tid(page, 'email').fill('bad@example.com');
await tid(page, 'password').fill('wrongpass');
await tid(page, 'login-submit').click();
await page.waitForTimeout(2500);
await dump(page, 'LOGIN ERROR');
console.log(
  'alerts:',
  await page.locator('.alert, [role="alert"], [data-test*="error"]').allTextContents()
);

// Forgot password
await page.goto(`${BASE}/auth/forgot-password`, { waitUntil: 'domcontentloaded' });
await tid(page, 'email').fill('customer@practicesoftwaretesting.com');
await tid(page, 'forgot-password-submit').click();
await page.waitForTimeout(3000);
await dump(page, 'FORGOT AFTER SUBMIT');
console.log(
  'alerts:',
  await page.locator('.alert, [role="alert"], [data-test*="error"], [data-test*="success"]').allTextContents()
);
console.log('body excerpt:\n', (await page.locator('body').innerText()).slice(0, 1000));

// Valid login
await page.goto(`${BASE}/auth/login`, { waitUntil: 'domcontentloaded' });
await tid(page, 'email').fill('customer@practicesoftwaretesting.com');
await tid(page, 'password').fill('welcome01');
await tid(page, 'login-submit').click();
await page.waitForTimeout(3000);
await dump(page, 'AFTER VALID LOGIN');
console.log('url', page.url());

await browser.close();
