import { test as baseTest } from '@playwright/test';
import { IdentityPage } from '../page-objects/pages/identity-page';
import { User } from '../data/data-types/user';
import { TestEnvironment } from 'test.model';
import { readFile, VisualValidator } from '@backbase-gsa/e2e-tests';
import { TestRunnerItems } from './test-runner-items';
import { TransactionsPage } from '@backbase-gsa/transactions-journey/e2e-tests';

export const test = baseTest.extend<TestRunnerItems>({
  identityPage: async ({ page, baseURL }, use) => {
    await use(new IdentityPage(page, { baseURL }));
  },
  transactionsPage: async ({ page, baseURL }, use) => {
    await use(new TransactionsPage(page, { baseURL }));
  },
  visual: async ({ page }, use) => {
    await use(new VisualValidator(page));
  },
  configPath: ['', { option: true }],
  config: async ({ configPath }, use) => {
    await use(configPath ? readFile(configPath) : { users: {} });
  },
});

export const testWithAuth = test.extend<{
  // Authentication
  userType: string;
  user: User;
}>({
  userType: ['', { option: true }],
  user: async ({ config, userType }, use) => {
    await use(config.users[userType]);
  },
});
