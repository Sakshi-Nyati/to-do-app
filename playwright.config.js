import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: { timeout: 5000 },
  fullPageScreenshot: true,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npm run dev -- --port 5173 --host',
    url: 'http://localhost:5173',
    reuseExistingServer: true
  },
  projects: [
    {
      name: 'chroming',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
