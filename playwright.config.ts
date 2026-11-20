import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  expect: {
    timeout: 15_000,
  },
  reporter: [['list']],
  use: {
    trace: 'retain-on-failure',
    video: {
      mode: 'on',
      size: { width: 1280, height: 800 },
    },
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        video: {
          mode: 'on',
          size: { width: 1440, height: 900 },
        },
      },
      testMatch: /.*(explorer|hero-desktop)\.spec\.ts/,
    },
    {
      name: 'mobile-iphone',
      use: {
        ...devices['iPhone 15 Pro'],
        defaultBrowserType: 'chromium',
        viewport: { width: 393, height: 852 },
        video: {
          mode: 'on',
          size: { width: 393, height: 852 },
        },
      },
      testMatch: /.*hero-mobile\.spec\.ts/,
    },
  ],
  webServer: [
    {
      command: 'LUMINA_AGENT_MODE=replay pnpm --filter @a2ui-catalog/agent start',
      url: 'http://localhost:10002/health',
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: 'pnpm --filter @a2ui-catalog/explorer preview',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: 'pnpm --filter @a2ui-catalog/studio preview',
      url: 'http://localhost:5174',
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
});
