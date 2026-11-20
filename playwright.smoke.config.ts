import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PREVIEW_SMOKE_PORT ?? 4287);

export default defineConfig({
  testDir: './tests',
  testMatch: /preview-smoke\.spec\.ts$/,
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    ...devices['Desktop Chrome'],
    viewport: { width: 1360, height: 900 },
  },
  webServer: {
    command: `PREVIEW_PORT=${PORT} ./scripts/worktree-preview.sh`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
