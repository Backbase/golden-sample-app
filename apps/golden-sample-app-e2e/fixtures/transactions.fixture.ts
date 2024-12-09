import { test as baseTest } from '../page-objects/test-runner';
import {
  TransactionFixture,
  TransactionDetailsPage,
  TransactionsListPage,
} from '@backbase-gsa/transactions-journey/e2e-tests';
import {
  transactionDetailMocksData,
  transactionDetailSandboxData,
} from '../data/transactions-detail.data';
import {
  transactionListMockData,
  transactionListSandboxData,
} from '../data/transaction-list.data';

export const test = baseTest.extend<TransactionFixture>({
  detailsPage: async ({ page, baseURL }, use) => {
    const pageObject = new TransactionDetailsPage(page, { baseURL });
    await use(pageObject);
  },
  detailsData: async ({ page, baseURL }, use, workerInfo) => {
    if (workerInfo.project.name.includes('mocked')) {
      await use(transactionDetailMocksData);
    } else {
      await use(transactionDetailSandboxData);
    }
  },
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
