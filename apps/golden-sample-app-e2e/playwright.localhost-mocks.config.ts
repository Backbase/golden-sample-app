import { workspaceRoot } from '@nx/devkit';
import { defineConfig } from '@playwright/test';
import { baseConfig, withDevices } from './playwright.config';
import { mocksConfig } from './src/config/mocks.config';
import { ProjectTestArgs } from './src/fixtures/environment';

const baseURL = 'http://localhost:4200';

/**
 * nx executor target name for serving the app locally.
 * Using serve-static for CI as it's faster and less memory-intensive
 */
const serveTarget = process.env.CI ? 'serve-static' : 'serve';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<ProjectTestArgs>({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    baseURL,
    useMocks: true,
    environmentConfig: mocksConfig,
  },
  /* Run your local dev server before starting the tests (unless a non-default URL is provided in the env vars) */
  webServer: {
    command: `npx nx run golden-sample-app:${serveTarget}:mocks`,
    url: baseURL,
    reuseExistingServer: true,
    cwd: workspaceRoot,
  },
  projects: withDevices([
    {
      name: 'localhost-mocks',
      grep: /@mocks/,
      grepInvert: [/@visual/, /@a11y/],
      use: {
        headless: true,
        launchOptions: {
          chromiumSandbox: false,
          args: ['--disable-infobars', '--no-sandbox', '--incognito'],
        },
      },
    },
    {
      name: 'localhost-mocks-visual',
      grep: /@visual/,
      workers: 2,
      use: {
        headless: true,
        launchOptions: {
          chromiumSandbox: false,
          args: ['--disable-infobars', '--no-sandbox', '--incognito'],
        },
      },
    },
    {
      name: 'localhost-mocks-a11y',
      grep: /@a11y/,
      workers: 2,
      use: {
        headless: true,
        launchOptions: {
          chromiumSandbox: false,
          args: ['--disable-infobars', '--no-sandbox', '--incognito'],
        },
      },
    },
  ]),
});
