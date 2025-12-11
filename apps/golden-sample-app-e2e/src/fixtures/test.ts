import { VisualValidator } from '@backbase/e2e-tests';
import { IdentityPage } from '../page-objects/pages/identity-page';
import { User } from '../data/data-types/user';
import { TransactionsPage } from '@backbase/transactions-journey/e2e-tests';
import { test as baseTest } from '@playwright/test';
import { ProjectTestArgs } from './environment';

export interface TestOptions {
  language: 'Arabic' | 'English';
  visual: VisualValidator;
  identityPage: IdentityPage;
  transactionsPage: TransactionsPage;
  userType: string;
  user: User;
}

export const test = baseTest.extend<TestOptions & ProjectTestArgs>({
  /**
   * environmentConfig needs to be delcared as an option fixture here to be accessible in the tests
   * but its actual value used will be provided in the playwright.config.*.ts files
   */
  environmentConfig: [{}, { option: true }],
  /**
   * useMocks needs to be delcared as an option fixture here to be accessible in the tests
   * but its actual value used will be provided in the playwright.config.*.ts files
   */
  useMocks: [true, { option: true }],

  identityPage: async ({ page, baseURL }, use) => {
    await use(new IdentityPage(page, { baseURL }));
  },
  transactionsPage: async ({ page, baseURL }, use, testInfo) => {
    await use(new TransactionsPage(page, { baseURL, testInfo }));
  },
  visual: async ({ page }, use) => {
    await use(new VisualValidator(page));
  },

  userType: ['', { option: true }],
  user: async ({ userType, environmentConfig }, use) => {
    const user = environmentConfig.users?.[userType];
    if (!user) {
      throw new Error(`User ${userType} not found in environment config`);
    }
    await use(user);
  },
});
