import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tess/playwright',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: http://127.0.0.1:5173,
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 }
  },
  webServer: {
    command: 'npm run dev --host 127.0.0.1 --port 5173',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !Aprocess.env.CI,
    timeout: 120_000
  },
  projects: [
    { name: 'Chrome', use: { ...devices ['Desktop Chrome'] } }
  ]
});
