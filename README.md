# SIS 2 — Playwright Toolshop

End-to-end tests for [Practice Software Testing (Toolshop)](https://practicesoftwaretesting.com/) using **Playwright + TypeScript**.

**Author:** Rakhmankul Bekzhan

## CI

[![Playwright Tests](https://github.com/bekzhanrtx/sis2-playwright-toolshop/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/bekzhanrtx/sis2-playwright-toolshop/actions/workflows/playwright.yml)

**CI system:** GitHub Actions. It is built into GitHub, where the repository already lives, needs no server of its own, is free for public repositories and supports matrices for sharding.

**Pipeline** (`.github/workflows/playwright.yml`):

- runs on every push and pull request;
- `npm ci` with the npm cache, Chromium installed with system dependencies;
- the full Playwright suite split into 4 shards (`--shard=i/4`) running in parallel;
- the `merge-reports` job merges the shards' blob reports into one HTML report and JUnit;
- artefacts: `playwright-report` (HTML), `test-results-N` (traces, screenshots, videos, JUnit), `junit-report`; kept for 14 days.

**CI settings** (`playwright.config.ts`, when `CI=true`):
`forbidOnly: true`, `retries: 2`, reporters `list`, `blob`, `junit`, `trace: 'on-first-retry'`.

### Runtime

| Configuration | Total run time | Run tests step (slowest shard) | Run |
| --- | --- | --- | --- |
| 1 job, no sharding | _fill after Actions run_ | _fill after Actions run_ | [_link_](https://github.com/bekzhanrtx/sis2-playwright-toolshop/actions) |
| 4 shards + merge | _fill after Actions run_ | _fill after Actions run_ | [_link_](https://github.com/bekzhanrtx/sis2-playwright-toolshop/actions) |

Median of 3 runs via `workflow_dispatch`. Conclusion: _fill after measuring — with a small suite, setup time may dominate, so 4 shards may not cut total wall time much._

### Running locally (CI mode)

```bash
npm ci
npx playwright install --with-deps chromium
# bash / Git Bash:
CI=true npx playwright test
# PowerShell:
# $env:CI = "true"; npx playwright test; Remove-Item Env:CI
```

Optional: set `BASE_URL` (GitHub Actions → Variables, or local env). Default is `https://practicesoftwaretesting.com`.

---

## What is covered

| # | Suite | File |
|---|--------|------|
| 1 | Register a new customer | `tests/01-register.spec.ts` |
| 2 | Log in (valid + invalid) | `tests/02-login.spec.ts` |
| 3 | Buy a product (cart → checkout) | `tests/03-buy-product.spec.ts` |
| 4 | Compare two products (name + price) | `tests/04-compare-products.spec.ts` |
| 5 | Reset password | `tests/05-reset-password.spec.ts` |

Design choices for grading:

- **Page Object Model** — locators only in `pages/`
- **Fixtures** — `fixtures/testFixtures.ts`
- **Unique data** per run — `utils/testData.ts`
- **`data-test`** via `testIdAttribute` in `playwright.config.ts`
- No `waitForTimeout`, no CSS-class locators, no positional XPath
- Tests are independent (any order / parallel)

## Requirements

- Node.js **20+** (Playwright 1.64)
- Chromium for Playwright

```bash
npm install
npx playwright install chromium
npx playwright test
```

Useful scripts:

```bash
npm test                 # headless run
npm run test:headed      # visible browser (good for demo)
npx playwright test --headed --workers=1
npx playwright show-report
```

## Project layout

```
.github/workflows/   GitHub Actions (Playwright CI)
pages/               Page objects
fixtures/            Playwright fixtures
utils/               Test data + API helper
tests/               Specs (5 suites)
screenshots/         Run evidence + AI appendix images
playwright.config.ts CI-aware Playwright config
merge.config.ts      Merge shard blob reports
Description.md       Plan / TC list
Prompt.md            AI prompts (Level 1) — tests
Review.md            Review of AI help + my fixes
CI-Prompt.md         AI prompts for the CI pipeline task
README.md            This file
```

## Demo tip

Show the run in headed mode, then open the HTML report:

```bash
npx playwright test --headed --workers=1
npx playwright show-report
```

You do **not** need to open the Toolshop site manually — tests hit it themselves.

## Docs for submission

| File | Role |
|------|------|
| `Description.md` | Goal + list of TCs |
| `Prompt.md` | Exact prompts / tool used (tests) |
| `Review.md` | What I kept, what I changed, why |
| `CI-Prompt.md` | AI appendix for the CI pipeline task |
| `screenshots/` | Green run + appendix visuals |
