import { test as baseTest } from '@playwright/test';
import { TransactionFixture } from '../model';
import { TransactionDetailsPage, TransactionsPage } from '../page-objects';
import {
  defaultTransactionMock,
  defaultTransactionsMock,
  setupPageMocks,
} from '../mocks';

export const test = baseTest.extend<TransactionFixture>({
  // mocks data setup, can be overridden or bypassed via "useMocks"
  transactionMockSetup: async ({ page }, use) =>
    use(() => setupPageMocks(page, defaultTransactionMock)),
  transactionsMockSetup: async ({ page }, use) =>
    use(() => setupPageMocks(page, defaultTransactionsMock)),
  transactionDetailsPage: async ({ page, baseURL }, use) => {
    await use(
      new TransactionDetailsPage(page, { baseURL, url: '/transactions/{id}' })
    );
  },
  transactionsPage: async ({ page, baseURL }, use) => {
    await use(new TransactionsPage(page, { baseURL, url: '/transactions' }));
  },
});
