import { test as baseTest } from '@playwright/test';
import { VisualValidator } from '../utils/visual-validator';
import { IdentityPage } from './pages/identity-page';
import { testConfig } from '../test-config';
import { User } from '../data/data-types/user';
import { readFile } from '../utils/read-file';
import 'dotenv/config';

export const test = baseTest.extend<{
  // Pages
  identityPage: IdentityPage;
  visual: VisualValidator;
  configPath: string;
  config: { users: Record<string, User> };
  // Authentication
  userType: string;
  user: User;
}>({
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
  userType: ['', { option: true }],
  user: async ({ config, userType }, use) => {
    await use(config.users[userType]);
  },
  storageState: async ({ page, identityPage, user, baseURL }, use) => {
    if (user) {
      await identityPage.login(user);
      await page.goto(baseURL ?? '');
      await page.waitForTimeout(1000);
    }
    await use({ cookies: [], origins: [] });
  },
});
