import { chromium } from 'playwright';

const BASE = 'https://practicesoftwaretesting.com';
const tid = (page, id) => page.locator(`[data-test="${id}"]`);

async function dump(page, label) {
  const ids = await page.evaluate(() =>
    [...new Set([...document.querySelectorAll('[data-test]')].map((el) => el.getAttribute('data-test')))].sort()
  );
  console.log(`\n=== ${label} ===\n${ids.join('\n')}`);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// --- HOME nav links ---
await page.goto(BASE, { waitUntil: 'networkidle' });
const navLinks = await page.evaluate(() =>
  [...document.querySelectorAll('a,button')].map((el) => ({
    text: (el.textContent || '').trim().slice(0, 40),
    href: el.getAttribute('href'),
    dataTest: el.getAttribute('data-test'),
    aria: el.getAttribute('aria-label'),
  })).filter((x) => /cart|checkout|compare|sign/i.test(`${x.text} ${x.href} ${x.dataTest} ${x.aria}`))
);
console.log('nav-like elements', JSON.stringify(navLinks, null, 2));

// --- ADD TO CART ---
await page.goto(`${BASE}/product/01M4ST4HCTP15HR7050D0XJHQR`, { waitUntil: 'networkidle' });
await tid(page, 'add-to-cart').click();
await page.locator('.toast-body, .alert, [role="alert"]').first().waitFor({ timeout: 5000 }).catch(() => {});
console.log('toast:', await page.locator('.toast-body, .alert, [role="alert"]').allTextContents());
console.log('localStorage keys', await page.evaluate(() => Object.keys(localStorage)));
console.log('localStorage sample', await page.evaluate(() => {
  const out = {};
  for (const k of Object.keys(localStorage)) out[k] = localStorage.getItem(k)?.slice(0, 200);
  return out;
}));

// dump ALL anchors in header
const header = await page.evaluate(() => {
  const headerEl = document.querySelector('nav, header, .navbar') || document.body;
  return [...headerEl.querySelectorAll('a,button,[data-test]')].map((el) => ({
    tag: el.tagName,
    text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50),
    href: el.getAttribute('href'),
    dataTest: el.getAttribute('data-test'),
  })).slice(0, 80);
});
console.log('header elements', JSON.stringify(header, null, 2));

// Go checkout and inspect cart table
await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle' });
await dump(page, 'CHECKOUT');
console.log('checkout text excerpt:\n', (await page.locator('body').innerText()).slice(0, 1500));

// Try guest checkout proceed
if (await tid(page, 'proceed-1').count()) console.log('proceed-1 text', await tid(page, 'proceed-1').innerText());
if (await tid(page, 'proceed-2').count()) console.log('proceed-2 text', await tid(page, 'proceed-2').innerText());
if (await tid(page, 'proceed-3').count()) console.log('proceed-3 text', await tid(page, 'proceed-3').innerText());

// Login error message
await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle' });
await tid(page, 'email').fill('bad@example.com');
await tid(page, 'password').fill('wrong');
await tid(page, 'login-submit').click();
await page.waitForTimeout(2500);
console.log('login error dump');
await dump(page, 'LOGIN ERR');
console.log('login body alerts:', await page.locator('.alert, [role="alert"], .help-block').allTextContents());
console.log('login excerpt', (await page.locator('body').innerText()).slice(0, 600));

// Forgot password
await page.goto(`${BASE}/auth/forgot-password`, { waitUntil: 'networkidle' });
await tid(page, 'email').fill('customer@practicesoftwaretesting.com');
await tid(page, 'forgot-password-submit').click();
await page.waitForTimeout(3000);
await dump(page, 'FORGOT OK');
console.log('forgot excerpt', (await page.locator('body').innerText()).slice(0, 800));

await tid(page, 'email').fill('not-an-email');
await tid(page, 'forgot-password-submit').click();
await page.waitForTimeout(1500);
await dump(page, 'FORGOT BAD');
console.log('forgot bad alerts', await page.locator('.alert, [role="alert"], [data-test*="error"], .help-block').allTextContents());

// Compare via home compare-btn
await page.goto(BASE, { waitUntil: 'networkidle' });
await tid(page, 'product-01M4ST4HCTP15HR7050D0XJHQR').hover();
await page.waitForTimeout(300);
await page.goto(`${BASE}/product/01M4ST4HCTP15HR7050D0XJHQR`, { waitUntil: 'networkidle' });
console.log('compare btn count', await tid(page, 'add-to-compare').count());
await tid(page, 'add-to-compare').click({ timeout: 10000 });
await page.waitForTimeout(1000);
await page.goto(`${BASE}/product/01M4ST4HCX3TE42XT35D00VP8G`, { waitUntil: 'networkidle' });
await tid(page, 'add-to-compare').click({ timeout: 10000 });
await page.waitForTimeout(1000);
await page.goto(BASE, { waitUntil: 'networkidle' });
console.log('compare-btn text', await tid(page, 'compare-btn').innerText().catch(() => 'n/a'));
await tid(page, 'compare-btn').click();
await page.waitForTimeout(2000);
console.log('compare url', page.url());
await dump(page, 'COMPARE PAGE');
console.log('compare excerpt', (await page.locator('body').innerText()).slice(0, 1200));

await browser.close();
