import { test as baseTest } from '@playwright/test';
import { IdentityPage } from './pages/identity-page';
import { testConfig } from '../test-config';
import 'dotenv/config';

export const test = baseTest.extend<{
  // Pages
  identityPage: IdentityPage;
}>({
  identityPage: async ({ page }, use, testInfo) => {
    await use(
      new IdentityPage(page, testInfo, { url: testConfig.appBaseUrl() }),
    );
  },
});
