import { test as baseTest } from '@playwright/test';
import { VisualValidator } from '../utils/visual-validator';
import { IdentityPage } from './pages/identity-page';
import { testConfig } from '../test-config';
import { User } from '../data/data-types/user';
import { readFile } from '../utils/read-file';
import 'dotenv/config';
import { TestEnvironment, TestOptions } from '../../../test.model';
import { Cookie } from '@playwright/test';

interface StorageState {
  cookies: Cookie[];
  origins: Array<{
    origin: string;
    localStorage: Array<{ name: string; value: string }>;
  }>;
}

interface TestRunnerOptions extends TestOptions {
  identityPage: IdentityPage;
  visual: VisualValidator;
  config: { users: Record<string, User> };
  env: TestEnvironment;
}

export const test = baseTest.extend<TestRunnerOptions>({
  identityPage: async ({ page }, use, testInfo) => {
    await use(
      new IdentityPage(page, testInfo, { url: testConfig.appBaseUrl() })
    );
  },
  visual: async ({ page }, use) => {
    await use(new VisualValidator(page));
  },
  configPath: ['', { option: true }],
  config: async ({ configPath }, use) => {
    await use(configPath ? readFile(configPath) : { users: {} });
  },
  testEnvironment: [TestEnvironment.MOCKS, { option: true }],
  env: async ({ testEnvironment }, use) => {
    await use(testEnvironment);
  },
});

interface AuthTestOptions extends TestOptions {
  userType: string;
  user: User;
  config: { users: Record<string, User> };
  env: TestEnvironment;
  authPage: IdentityPage;
}

export const testWithAuth = test.extend<AuthTestOptions>({
  userType: ['', { option: true }],
  user: async ({ config, userType }, use) => {
    await use(config.users[userType]);
  },
  authPage: async ({ browser, baseURL, user }, use, testInfo) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const identityPage = new IdentityPage(page, testInfo, { url: testConfig.appBaseUrl() });
    
    if (user) {
      await identityPage.login(user);
      await page.goto(baseURL ?? '');
      await page.waitForTimeout(1000);
    }
    
    await use(identityPage);
    await context.close();
  }
});
