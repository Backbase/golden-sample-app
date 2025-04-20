import { PlaywrightTestConfig, devices } from '@playwright/test';
import 'dotenv/config';

// Reference: https://playwright.dev/docs/test-configuration
const config: PlaywrightTestConfig = {
  timeout: (Number(process.env['TIMEOUT']) || 120) * 1000,
  testDir: './apps/golden-sample-app-e2e/specs/',
  retries: process.env['CI'] ? 1 : 0,
  grep: process.env['TEST_TAG'] ? RegExp(process.env['TEST_TAG']) : undefined,
  outputDir: 'reports/test-output',
  forbidOnly: !!process.env['CI'],
  workers: process.env['CI'] ? 4 : 1,
  fullyParallel: true,
  expect: {
    timeout: (Number(process.env['EXPECT_TIMEOUT']) || 5) * 1000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  reporter: [
    ['list'], 
    ['allure-playwright',
      {
        detail: false,
        resultsDir: 'reports/allure-results',
        links: {
          issue: {
            nameTemplate: "Issue #%s",
            urlTemplate: "https://golden-sample-app.com/jira/browse/%s",
          },
        },
      }], 
    ['html', 
      { 
        outputFolder: 'reports/html-report' 
      }]
  ],
  globalSetup: require.resolve(__dirname + '/global-setup.ts'),
  use: {
    trace: 'retain-on-failure',
    baseURL: process.env['BASE_URL'] ?? 'http://localhost:4200/',
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    headless: process.env['HEADLESS']?.toLowerCase() !== 'false',
    viewport: {
      width: Number(process.env['SCREEN_WIDTH']) || 1280,
      height: Number(process.env['SCREEN_HEIGHT']) || 720,
    },
    contextOptions: {
      ignoreHTTPSErrors: true,
      acceptDownloads: true,
    },
  },
  projects: [
    {
      name: 'web-chrome',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          chromiumSandbox: false,
          args: [
            // List of Chrome arguments: http://peter.sh/experiments/chromium-command-line-switches/
            '--disable-gpu',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
          ],
        },
      },
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Nexus 7'],
        isMobile: true,
        baseURL: 'http://localhost:4201',
      },
    },
  ],
  webServer: [
    {
      command: 'npm run mock-server',
      url: 'http://localhost:9999/dev-interface',
      timeout: 30 * 1000,
      reuseExistingServer: false,
    },
    {
      command: 'npx nx serve -c=mocks --port=4201',
      url: 'http://localhost:4201/',
      timeout: 120 * 1000,
      reuseExistingServer: false,
    },
  ],
};

export default config;