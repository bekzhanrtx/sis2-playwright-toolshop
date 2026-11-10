# CI-Prompt.md — использование AI (Level 1)

CI pipeline писал сам по PDF-гайду курса.  
ИИ использовал минимально — точечные вопросы, не генерацию всего workflow.

**Инструмент:** Cursor (Composer)  
**Дата:** 2026-11-10  
**Дедлайн CI:** Nov 22

---

## Промпт 1

```
В playwright.config.ts как правильно включить forbidOnly и retries только когда CI=true?
```

**Зачем:** в гайде есть `isCI`, хотел быстро сверить синтаксис. Конфиг и reporters (list/blob/junit) настроил сам.

---

## Промпт 2

```
GitHub Actions: короткий пример upload-artifact для playwright-report с retention-days 14.
Полный workflow не пиши.
```

**Зачем:** уточнил поля `path` / `retention-days`. Файл `.github/workflows/playwright.yml` (4 шарда + merge-reports) собрал по гайду сам.

---

## Промпт 3

```
Как вызвать merge-reports для blob после шардов? Нужен пример одной команды и merge.config.ts.
```

**Зачем:** сверить команду `npx playwright merge-reports --config merge.config.ts ./all-blob-reports`.  
`merge.config.ts` и job `merge-reports` дописал сам.

---

## Что сделал сам (без AI)

- `.github/workflows/playwright.yml` — `on: push` / `pull_request` / `workflow_dispatch`, matrix 4 shards, `npm ci` + cache, chromium `--with-deps`
- `playwright.config.ts` — `BASE_URL`, `testIdAttribute: 'data-test'`, blob/junit в CI
- `merge.config.ts`
- секция **CI** в `README.md` + badge для `bekzhanrtx/sis2-playwright-toolshop`
- `.gitignore` — `reports/`, `all-blob-reports/`, `.act-artifacts/`
- таблицу Runtime заполню после реальных runs в Actions (1 shard vs 4)
