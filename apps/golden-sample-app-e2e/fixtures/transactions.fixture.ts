import { testWithAuth as baseTest } from '../page-objects/test-runner';
import {
  TransactionFixture,
  TransactionDetailsPage,
  TransactionsListPage,
} from '@backbase-gsa/transactions-journey/e2e-tests';
import {
  transactionDetailMocksData,
  transactionListMockData,
} from '../data/mocks-data';
import {
  transactionDetailSandboxData,
  transactionListSandboxData,
} from '../data/sandbox-api-data';
import { TestEnvironment } from 'test.model';

export const test = baseTest.extend<TransactionFixture>({
  detailsPage: async ({ page, baseURL }, use) => {
    const pageObject = new TransactionDetailsPage(page, { baseURL });
    await use(pageObject);
  },
  detailsData: async ({ env }, use) => {
    // Based on the configurations, it passes data to the test
    if (env === TestEnvironment.MOCKS) {
      // passing mock data to check against mocks
      await use(transactionDetailMocksData);
    } else {
      // passing sandbox enc related data to check against sandbox env
      await use(transactionDetailSandboxData);
    }
  },
  listPage: async ({ page, baseURL }, use) => {
    const pageObject = new TransactionsListPage(page, { baseURL });
    await use(pageObject);
  },

  listData: async ({ env }, use, workerInfo) => {
    // Based on the configurations, it passes data to the test
    if (env === TestEnvironment.MOCKS) {
      // passing mock data to check against mocks
      await use(transactionListMockData);
    } else {
      // passing sandbox enc related data to check against sandbox env
      await use(transactionListSandboxData);
    }
  },
  userType: 'userWithNoContext',
});
