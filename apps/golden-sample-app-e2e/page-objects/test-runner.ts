import { test as baseTest } from '@playwright/test';
import { IdentityPage } from './pages/identity-page';
import { testConfig } from '../test-config';
import 'dotenv/config';
import { Screen } from './screen';

export const test = baseTest.extend<{
  // Pages
  identityPage: IdentityPage;
  // States
  startFrom: Screen;
}>({
  startFrom: [Screen.loggedIn, {}],
  identityPage: async ({ page }, use, testInfo) => {
    await use(
      new IdentityPage(page, testInfo, { url: testConfig.appBaseUrl() }),
    );
  },
  storageState: async ({ identityPage, startFrom }, use) => {
    switch (startFrom) {
      case Screen.loggedOut:
        await identityPage.open();
        break;
      case Screen.loggedIn:
        await identityPage.login();
        break;
    }
    await use({ cookies: [], origins: [] });
  },
});
