# SIS 2 — Test Automation with Playwright

**Author:** Rakhmankul Bekzhan
**Deadline:** October 23  
**Application under test:** [https://practicesoftwaretesting.com/](https://practicesoftwaretesting.com/) (Toolshop — Angular frontend + REST API)

## Goal

Automate at least five independent end-to-end acceptance tests with Playwright (TypeScript), structured for grading:

- Page Object Model (no locators inside spec files)
- At least one Playwright fixture
- Unique data per run where needed
- Meaningful assertions that can fail
- No `waitForTimeout`, no CSS-class locators, no positional XPath
- Tests must pass in any order and in parallel

## List of test cases to automate

| # | Test case | What it must prove |
|---|-----------|--------------------|
| 1 | Register a new customer | A unique new account is created; user ends up signed in or on the login page |
| 2 | Log in | Valid credentials reach the account page; invalid ones show an error and do not |
| 3 | Buy a product | Add to cart → cart shows the right item and quantity → checkout completes |
| 4 | Compare two products | Open two products, capture name and price, assert the stated comparison |
| 5 | Reset a password | Forgot-password flow: confirmation for a known email; error for an invalid one |

Each test is independent and creates whatever data it needs. No test depends on another having run first.

## Planned approach

1. Configure Playwright with `testIdAttribute: 'data-test'` (site convention).
2. Put all selectors in page objects under `pages/`.
3. Expose pages + unique customer data through fixtures in `fixtures/testFixtures.ts`.
4. Generate unique emails/passwords in `utils/testData.ts`; seed users via API when the UI register flow is not under test.
5. Use web-first assertions (`expect(...).toBeVisible()`, URL checks, etc.) instead of hard sleeps.
6. Document AI usage in `Prompt.md` + `Review.md` (Level 1 appendix).

## How to run

Requirements: Node.js **20+** recommended (Playwright 1.64+).

```bash
npm install
npx playwright install chromium
npx playwright test
```

Optional HTML report:

```bash
npx playwright show-report
```

## Repository layout

```
pages/          Page objects (locators live here only)
fixtures/       Custom Playwright fixtures
utils/          Unique test data + API helpers
tests/          Specs — one file per acceptance area
screenshots/    Evidence (run results, AI appendix)
Description.md  This file
Prompt.md       Exact AI prompt(s) used
Review.md       Review of AI output + corrections
```
