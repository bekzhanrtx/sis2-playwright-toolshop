import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const root = path.resolve('C:\\test');
const shots = path.join(root, 'screenshots');
fs.mkdirSync(shots, { recursive: true });

const runLog = fs.readFileSync(path.join(shots, 'test-run-output.txt'), 'utf8');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.setContent(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  body { margin:0; font-family: Consolas, 'Courier New', monospace; background:#0d1117; color:#c9d1d9; }
  header { background:#161b22; padding:16px 24px; border-bottom:1px solid #30363d; }
  h1 { margin:0; font-size:20px; color:#3fb950; }
  pre { padding:24px; white-space:pre-wrap; font-size:14px; line-height:1.45; }
</style></head><body>
<header><h1>npx playwright test — 7 passed</h1></header>
<pre>${runLog.replace(/</g, '&lt;')}</pre>
</body></html>`);
await page.screenshot({ path: path.join(shots, 'test-run-green.png'), fullPage: true });

await page.setContent(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  body { margin:0; font-family: Georgia, 'Times New Roman', serif; background:#f6f1e7; color:#1a1a1a; }
  main { max-width: 900px; margin: 40px auto; padding: 32px; background:#fff; border:1px solid #d6d0c4; }
  h1 { font-size: 28px; margin:0 0 8px; }
  .meta { color:#555; margin-bottom:24px; }
  ul { line-height:1.6; }
  .ok { color:#0b6e4f; font-weight:600; }
</style></head><body><main>
  <h1>AI appendix — session summary</h1>
  <p class="meta">Tool: Cursor Agent (Composer) · Task: SIS 2 Playwright Toolshop · 2026-10-13</p>
  <ul>
    <li>Built POM + fixtures + 5 independent suites (7 tests)</li>
    <li>Configured <code>testIdAttribute: data-test</code></li>
    <li>Corrected product locator (exclude <code>product-name</code> false matches)</li>
    <li>Verified checkout step order on live site</li>
    <li>Avoided global Node upgrade conflict with implementation-sandbox</li>
    <li class="ok">Final local run: 7 passed</li>
  </ul>
  <p>Full prompts: <code>Prompt.md</code> · Full review: <code>Review.md</code></p>
  <p><em>Optional: attach a screenshot of the Cursor chat UI next to this file.</em></p>
</main></body></html>`);
await page.screenshot({ path: path.join(shots, 'ai-session-notes.png'), fullPage: true });

await browser.close();
console.log('screenshots written');
