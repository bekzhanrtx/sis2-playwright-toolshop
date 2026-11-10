import { defineConfig, devices } from '@playwright/test';

/**
 * SIS 2 — Toolshop Playwright suite
 * Target: https://practicesoftwaretesting.com/
 *
 * CI behaviour is switched on by process.env.CI
 * (GitHub Actions sets it automatically).
 */
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true, // shards split tests, not whole files
  forbidOnly: isCI, // forgotten test.only fails CI
  retries: isCI ? 2 : 1, // live demo site can flake under parallel load
  workers: isCI ? 2 : undefined, // GitHub runners have 2–4 vCPUs
  timeout: 90_000,
  expect: { timeout: 20_000 },
  reporter: isCI
    ? [
        ['list'],
        ['blob'], // for merging shards
        ['junit', { outputFile: 'reports/junit.xml' }],
      ]
    : [
        ['list'],
        ['html', { open: 'never' }],
      ],
  use: {
    // Use || so an empty Actions variable does not wipe the default URL.
    baseURL: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: isCI ? 'retain-on-failure' : 'off',
    navigationTimeout: 45_000,
    actionTimeout: 20_000,
    /* Site uses data-test, not data-testid */
    testIdAttribute: 'data-test',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
