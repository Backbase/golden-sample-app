import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import baseConfig from './playwright.config';
import { join } from 'path';



export default defineConfig<any>({
  ...baseConfig,
  projects: [
    {
      name: 'localhost-mocked',
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
        launchOptions: {
          chromiumSandbox: false,
          args: ['--disable-infobars', '--no-sandbox', '--incognito'],
        },
        baseURL: 'http://localhost:4200/',
      },
    },
    {
      name: 'localhost-ebp-sndbx',
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
        launchOptions: {
          chromiumSandbox: false,
          args: ['--disable-infobars', '--no-sandbox', '--incognito'],
        },
        configPath: join(__dirname, 'apps/golden-sample-app-e2e/config/ebp-sndbx.config.json'),
        baseURL: 'http://localhost:4200/',
      },
      testIgnore: /mocked-.*/,
    },
  ],
  webServer: [
    {
      command: 'npm run mock-server',
      url: 'http://localhost:9999/dev-interface',
      timeout: 30 * 1000,
      reuseExistingServer: true,
    },
  ],
})
