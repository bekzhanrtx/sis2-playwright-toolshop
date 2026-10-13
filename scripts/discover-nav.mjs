import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'https://practicesoftwaretesting.com';
const tid = (page, id) => page.locator(`[data-test="${id}"]`);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
});
const page = await context.newPage();
page.setDefaultTimeout(60000);

try {
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/discover-home.png', fullPage: true });
  console.log('title', await page.title());
  console.log('url', page.url());
  console.log('body start', (await page.locator('body').innerText()).slice(0, 300));

  await page.locator('[data-test^="product-"]').first().waitFor({ state: 'visible', timeout: 60000 });
  const productId = await page.locator('[data-test^="product-"]').first().getAttribute('data-test');
  console.log('first product', productId);

  const navbar = page.locator('nav').first();
  console.log('NAV TEXT:', (await navbar.innerText()).replace(/\s+/g, ' '));
  console.log(
    'NAV data-tests:',
    await navbar.locator('[data-test]').evaluateAll((els) => els.map((e) => e.getAttribute('data-test')))
  );

  await page.locator(`[data-test="${productId}"]`).click();
  await tid(page, 'product-name').waitFor({ state: 'visible' });
  console.log('name', await tid(page, 'product-name').innerText());
  console.log('price', await tid(page, 'unit-price').innerText());

  await tid(page, 'add-to-cart').click();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'screenshots/discover-after-add.png' });
  console.log('toasts', await page.locator('.toast-body, .alert, [role="status"]').allTextContents());
  console.log(
    'NAV after:',
    await page.locator('nav').first().locator('[data-test]').evaluateAll((els) =>
      els.map((e) => `${e.getAttribute('data-test')}=${(e.textContent || '').trim().slice(0, 20)}`)
    )
  );
  console.log('storage', await page.evaluate(() => ({ ...localStorage })));

  await page.goto(`${BASE}/checkout`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'screenshots/discover-checkout.png', fullPage: true });
  console.log('checkout text:\n', (await page.locator('body').innerText()).slice(0, 1800));
  const ids = await page.evaluate(() =>
    [...new Set([...document.querySelectorAll('[data-test]')].map((e) => e.getAttribute('data-test')))].sort()
  );
  console.log('ids:', ids.join(', '));

  // login invalid
  await page.goto(`${BASE}/auth/login`, { waitUntil: 'domcontentloaded' });
  await tid(page, 'email').fill('bad@example.com');
  await tid(page, 'password').fill('wrong');
  await tid(page, 'login-submit').click();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'screenshots/discover-login-error.png' });
  console.log('login err texts', await page.locator('.alert, [role="alert"], [data-test*="error"]').allTextContents());
  console.log('login body', (await page.locator('main, app-login, body').first().innerText()).slice(0, 500));

  // forgot
  await page.goto(`${BASE}/auth/forgot-password`, { waitUntil: 'domcontentloaded' });
  await tid(page, 'email').fill('customer@practicesoftwaretesting.com');
  await tid(page, 'forgot-password-submit').click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/discover-forgot.png' });
  console.log('forgot texts', await page.locator('.alert, [role="alert"]').allTextContents());
  console.log('forgot body', (await page.locator('body').innerText()).slice(0, 700));

  // compare two products via product page + home compare
  const products = await page.evaluate(() =>
    [...document.querySelectorAll('[data-test^="product-"]')].map((e) => e.getAttribute('data-test')).slice(0, 2)
  );
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-test^="product-"]').first().waitFor();
  const p1 = await page.locator('[data-test^="product-"]').nth(0).getAttribute('data-test');
  const p2 = await page.locator('[data-test^="product-"]').nth(1).getAttribute('data-test');
  console.log('compare candidates', p1, p2);
  await page.goto(`${BASE}/product/${p1.replace('product-', '')}`, { waitUntil: 'domcontentloaded' });
  await tid(page, 'add-to-compare').click();
  await page.waitForTimeout(800);
  await page.goto(`${BASE}/product/${p2.replace('product-', '')}`, { waitUntil: 'domcontentloaded' });
  await tid(page, 'add-to-compare').click();
  await page.waitForTimeout(800);
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await tid(page, 'compare-btn').first().click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/discover-compare.png', fullPage: true });
  console.log('compare url', page.url());
  console.log('compare body', (await page.locator('body').innerText()).slice(0, 1200));
  const cids = await page.evaluate(() =>
    [...new Set([...document.querySelectorAll('[data-test]')].map((e) => e.getAttribute('data-test')))].sort()
  );
  console.log('compare ids', cids.join(', '));
} catch (e) {
  console.error('FAILED', e);
  fs.mkdirSync('screenshots', { recursive: true });
  await page.screenshot({ path: 'screenshots/discover-error.png', fullPage: true }).catch(() => {});
  console.log('page content', (await page.content()).slice(0, 1500));
  process.exitCode = 1;
} finally {
  await browser.close();
}
