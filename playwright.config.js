import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT && Number(process.env.PORT);

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: `http://localhost:${PORT || 5173}`,
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chrome', use: { ...devices['Desktop Chrome'] } }
  ],
  webServer: {
    command: 'npm run dev -- --host -- port 5173',
    url: `http://localhost:${PORT || 5173}`,
    reuseExistingServer: true
  }
});
