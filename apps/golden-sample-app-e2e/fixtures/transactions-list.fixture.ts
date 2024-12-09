import {
  TransactionsListFixture,
  TransactionsListPage,
} from '@backbase-gsa/transactions-journey/e2e-tests';
import { test as baseTest } from '../page-objects/test-runner';
import { transactionListMockData, transactionListSandboxData } from '../data/transaction-list.data';

export const test = baseTest.extend<TransactionsListFixture>({
  listPage: async ({ page, baseURL }, use) => {
    const pageObject = new TransactionsListPage(page, { baseURL });
    await use(pageObject);
  },

  listData: async ({ page, baseURL }, use, workerInfo) => {
    if (workerInfo.project.name.includes('mocked')) {
      await use(transactionListMockData);
    } else {
      await use(transactionListSandboxData);
    }
  },
  userType: 'userWithNoContext',
});
