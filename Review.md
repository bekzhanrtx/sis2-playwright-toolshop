# Review.md — AI help vs my work

**Author:** Rakhmankul Bekzhan  
**Level:** AI Level 1 (small prompts only)  
**Tool:** Cursor (Composer)

## Summary

AI was used for **short technical hints** (see `Prompt.md`).  
I built the project structure, page objects, tests, and documentation myself, then fixed failures until `npx playwright test` was green.

## What AI gave me

| Prompt topic | AI suggestion | What I did |
|--------------|---------------|------------|
| `testIdAttribute` | Use config `use.testIdAttribute` | Put it in `playwright.config.ts` |
| Fixture example | Small `test.extend` snippet | Extended it for all my pages + customer data |
| Product locator | Narrow the selector | Chose `a[data-test^="product-"]` after DevTools check |
| Password 422 | Use a stronger unique password | Implemented `uniquePassword()` in `utils/testData.ts` |

## What I implemented / fixed without AI doing it for me

1. Five independent specs under `tests/` matching the presentation TCs  
2. Page objects in `pages/` — **no locators in specs**  
3. Checkout flow on the real site: proceed-1 → login → proceed-2 → billing → proceed-3 → payment → finish  
4. Unique emails per run; API seed only where login/buy must not depend on the register UI test  
5. Compare TC: open two products, capture name + price, assert difference / ranking  
6. Reset password: known email confirmation + invalid email field error  
7. `Description.md`, `README.md`, screenshots of the green run  

## Why these decisions

- **`data-test` only** — required by the course; class / positional XPath forbidden  
- **No `waitForTimeout`** — web-first `expect(...)` instead  
- **Independent data** — tests must pass in any order and in parallel  
- **Meaningful asserts** — each TC can fail if the app breaks  

## Result

Local run: **7 passed** (`screenshots/test-run-green.png`).
