import {
  TransactionDetailsFixture,
  TransactionDetailsPage,
} from '@backbase-gsa/transactions-journey/e2e-tests';
import { test as playwrightTest } from '@playwright/test';
import { test as baseTest } from '../page-objects/test-runner';

export const mocksConfiguration =
  playwrightTest.extend<TransactionDetailsFixture>({
    detailsPage: async ({ page, baseURL }, use) => {
      await use(new TransactionDetailsPage(page, { baseURL }));
    },
    detailsData: {
      recipient: 'Hard Rock Cafe',
      category: 'Alcohol & Bars',
      description: 'Beer Bar Salt Lake',
      status: 'BILLED',
      id: '007jb5',
    },
  });

export const sandboxConfiguration = baseTest.extend<TransactionDetailsFixture>({
  detailsPage: async ({ page, baseURL }, use) => {
    await use(new TransactionDetailsPage(page, { baseURL }));
  },
  detailsData: {
    recipient: 'BP',
    category: 'Gasoline/Fuel',
    description: 'BP Global',
    status: 'BILLED',
    id: '8a82815f936800030193810b891452e0',
  },
  userType: 'userWithTransactionList',
});
