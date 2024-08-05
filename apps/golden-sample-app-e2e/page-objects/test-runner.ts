import { test as baseTest } from '@playwright/test';
import { VisualValidator } from '../utils/visual-validator';
import { IdentityPage } from './pages/identity-page';
import { testConfig } from '../test-config';
import 'dotenv/config';

export const test = baseTest.extend<{
  // Pages
  identityPage: IdentityPage;
  visual: VisualValidator;
}>({
  identityPage: async ({ page }, use, testInfo) => {
    await use(
      new IdentityPage(page, testInfo, { url: testConfig.appBaseUrl() })
    );
  },
  visual: async ({ page }, use) => {
    await use(new VisualValidator(page));
  },
});
