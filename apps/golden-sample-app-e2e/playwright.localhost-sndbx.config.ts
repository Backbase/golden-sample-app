import { workspaceRoot } from '@nx/devkit';
import { defineConfig } from '@playwright/test';
import { baseConfig, withDevices } from './playwright.config';
import { sndbxConfig } from './src/config/sndbx.config';
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
    useMocks: false,
    environmentConfig: sndbxConfig,
  },
  /* Run your local dev server before starting the tests */
  webServer: {
    command: `npx nx run golden-sample-app:${serveTarget}:sndbx`,
    url: baseURL,
    reuseExistingServer: true,
    cwd: workspaceRoot,
  },
  projects: withDevices([
    {
      name: 'localhost-sndbx',
      grep: /@ephemeral/,
      grepInvert: [/@visual/, /@a11y/],
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
