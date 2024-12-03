import { PlaywrightTestArgs, PlaywrightTestOptions, test as base } from '@playwright/test';
import { authenticateUser } from './utils/user-authenticator';
import { readFile } from './utils/read-file';

export type UseFunction = (...args: any[]) => Promise<void>;

export type WorkerOptions = {
  skipTestsWithConfirmation: boolean;
};

export type TestOptions = {
  configPath: string;
};


export type CommonFixtures = TestOptions &
 
  PlaywrightTestArgs &
  PlaywrightTestOptions;

export const workerFixtured = base.extend<{ key: any; value: unknown }, WorkerOptions>({
  skipTestsWithConfirmation: [true, { scope: 'worker', option: true }],
});

export const test = workerFixtured.extend<CommonFixtures>({
  configPath: ['', { option: true }],
  config: async ({ configPath }, use) => {
    const configObject = readFile<any>(configPath);
    await use(configObject);
  },

  testUser: async ({ config }, use) => {
    await use(config.users['userWithTransactionList']);
  },

  page: async ({ page, config }, use) => {
    page = await augmentPageWithBaasHeader(page, config);
    await page.goto(config.baseUrl);
    await use(page);
  },
  storageState: async ({ testUser, config, loginState }, use) => {
    const sessionStoragePath = getStorageStatePathForUser(testUser.username);
      await authenticateUser(testUser, config);
      await use(sessionStoragePath);
  },
});

export const expect = test.expect;
