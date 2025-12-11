import { workspaceRoot } from '@nx/devkit';
import { devices, PlaywrightTestConfig } from '@playwright/test';
import { join, relative } from 'node:path';
import { ProjectTestArgs } from './src/fixtures/environment';

// Calculate standard output dirs based on nx project root
const projectPath = relative(workspaceRoot, __dirname);
const distDir = join(workspaceRoot, 'dist', '.playwright', projectPath);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export const baseConfig: PlaywrightTestConfig<ProjectTestArgs> = {
  outputDir: join(distDir, 'test-output'),
  globalSetup: require.resolve('./src/global-setup'),
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        detail: false,
        resultsDir: join(distDir, 'reports/allure'),
        suiteTitle: true,
        links: {
          issue: {
            nameTemplate: 'Issue #%s',
            urlTemplate: 'https://golden-sample-app.com/jira/browse/%s',
          },
        },
      },
    ],
    [
      'html',
      {
        outputFolder: join(distDir, 'reports/html'),
      },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    // baseURL,
    screenshot: 'only-on-failure',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    video: 'on-first-retry',
    viewport: {
      width: 1280,
      height: 720,
    },
    contextOptions: {
      acceptDownloads: true,
    },
  },
  projects: [
    // projects are defined in the other config files
    // that extend this one
  ],
};

export interface DeviceConfig {
  name: string;
  config: (typeof devices)[string];
}

const defaultDevices: DeviceConfig[] = [
  {
    name: 'chrome',
    config: devices['Desktop Chrome'],
  },
  {
    name: 'firefox',
    config: devices['Desktop Firefox'],
  },
  {
    name: 'safari',
    config: devices['Desktop Safari'],
  },
];

export type Projects = NonNullable<
  PlaywrightTestConfig<ProjectTestArgs>['projects']
>;

export function withDevices(
  projects: Projects,
  devices = defaultDevices
): Projects {
  return projects.flatMap((p) =>
    devices.map((d) => ({
      ...p,
      name: `${p.name}-${d.name}`,
      use: {
        ...p.use,
        ...d.config,
      },
    }))
  );
}
