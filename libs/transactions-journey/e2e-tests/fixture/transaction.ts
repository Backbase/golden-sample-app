import { test as baseTest } from '@playwright/test';
import {
  TransactionFixture,
  TransactionsListDataType,
  TransactionDetailsDataType,
} from '../model';
import { TransactionDetailsPage, TransactionsPage } from '../page-objects';
import {
  addTransactionsToMock,
  defaultTransactionsMock,
  setupPageMocks,
} from '../mocks';
import { MakeTransferPage } from '../page-objects/pages/make-transfer';

export const test = baseTest.extend<TransactionFixture>({
  // mocks data setup, can be overridden or bypassed via "useMocks"
  transactionMockSetup: async ({ page, useMocks }, use) =>
    await use((transactions: Partial<TransactionDetailsDataType>[]) => {
      if (useMocks) {
        setupPageMocks(page, addTransactionsToMock(transactions));
      }
    }),
  transactionsMockSetup: async ({ page, useMocks }, use) =>
    await use(() => {
      if (useMocks) {
        setupPageMocks(page, defaultTransactionsMock);
      }
    }),
  makeTransferPage: async ({ page, baseURL }, use) => {
    await use(new MakeTransferPage(page, { baseURL, url: '/make-transfer' }));
  },
  transactionDetailsPage: async ({ page, baseURL }, use) => {
    await use(
      new TransactionDetailsPage(page, {
        baseURL,
        url: '/transactions/{id}',
      })
    );
  },
  transactionsPage: async ({ page, baseURL }, use) => {
    await use(new TransactionsPage(page, { baseURL, url: '/transactions' }));
  },
});
