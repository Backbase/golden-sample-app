import { test as baseTest } from '../page-objects/test-runner';
import {
  TransactionDetailsFixture,
  TransactionDetailsPage,
} from '@backbase-gsa/transactions-journey/e2e-tests';
import { transactionDetailMocksData, transactionDetailSandboxData } from '../data/transactions-detail.data';

export const test = baseTest.extend<TransactionDetailsFixture>({
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
  userType: 'userWithTransactionList',
});
