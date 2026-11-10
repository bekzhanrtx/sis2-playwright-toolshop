/**
 * Used by: npx playwright merge-reports --config merge.config.ts ./all-blob-reports
 * Turns per-shard blob reports into one HTML report + merged JUnit.
 */
export default {
  testDir: './tests',
  reporter: [
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'reports/junit-merged.xml' }],
  ],
};
