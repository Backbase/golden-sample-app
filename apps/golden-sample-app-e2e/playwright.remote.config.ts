import { defineConfig } from '@playwright/test';
import { baseConfig, withDevices } from './playwright.config';
import { ProjectTestArgs } from './src/fixtures/environment';
import { sndbxConfig } from './src/config/sndbx.config';

/**
 * Remote app base URL.
 *
 * If you need to test multiple locales, add a project per locale to the projects array
 * below and set the baseURL in the `use` section per project instead.
 */
const baseURL = 'https://app.stg.sdbxaz.azure.backbaseservices.com/en-US';

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
  // no webServer config needed as we're running against a remotely-deployed app
  projects: withDevices([
    {
      name: 'remote',
      grep: /@remote/,
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
