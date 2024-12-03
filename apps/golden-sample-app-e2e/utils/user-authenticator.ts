import { UserData } from '../data';
import { Browser, Page, chromium } from '@playwright/test';
import { IdentityLoginPage } from '../page-objects/pages/identity-login.po';
import { getStorageStatePathForUser } from './config-utils';
import { Config } from '../data';
import { augmentPageWithBaasHeader } from './playwright-utils';
import { BasePage } from '../page-objects/pages/base-page.po';

export const authenticateUser = async (user: UserData, config: Config, externalBrowser?: Browser) => {
  const browser = externalBrowser ? externalBrowser : await chromium.launch({ headless: true });

  const context = await browser.newContext();
  context.setExtraHTTPHeaders({ [config.baasKey]: config.baasHeader });

  const page = await augmentPageWithBaasHeader(await context.newPage(), config);

  await retriedLogin(user, config, page, 3);



  const basePage = new BasePage(page);

  try {
    await basePage.pageTitleHeader.waitFor({ state: 'visible', timeout: 10000 });
  } catch {
    const contextSelectionPage = new SelectContextPage(page);
    await contextSelectionPage.selectContext(user.masterContext.name);
  } finally {
    await basePage.pageTitleHeader.waitFor({ state: 'visible' });
  }

  const userSessionState = getStorageStatePathForUser(user.username);
  await context.storageState({ path: userSessionState as string });
  await page.close();
  await context.close();

  if (!externalBrowser) {
    await browser.close();
  }
};

const retriedLogin = async (user: UserData, config: Config, page: Page, retries: number) => {
  for (let i = 1; i <= retries; i++) {
    await page.goto(config.baseUrl);
    const identityPage = new IdentityLoginPage(page);
    try {
      await identityPage.loginThroughUI(user.username, user.password);
      await page.waitForURL(`${config.baseUrl}/**`, { timeout: 7000 });
      break;
    } catch (e: unknown) {
      console.log(`Failed to login, attempt ${i} out of ${retries}`);
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
    if (i == 3) throw new Error(`Authenticator failed to log in ${user.username} in ${retries} attempts.`);
  }
};
