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
  transactionMockSetup: async ({ page }, use) =>
    await use((transactions: Partial<TransactionDetailsDataType>[]) =>
      setupPageMocks(page, addTransactionsToMock(transactions))
    ),
  transactionsMockSetup: async ({ page }, use) =>
    use((transactions: TransactionsListDataType) =>
      setupPageMocks(page, defaultTransactionsMock)
    ),
  makeTransferPage: async ({ page, visual, baseURL }, use) => {
    await use(
      new MakeTransferPage(page, { baseURL, url: '/make-transfer', visual })
    );
  },
  transactionDetailsPage: async ({ page, visual, baseURL }, use) => {
    await use(
      new TransactionDetailsPage(page, {
        baseURL,
        url: '/transactions/{id}',
        visual,
      })
    );
  },
  transactionsPage: async ({ page, visual, baseURL }, use) => {
    await use(
      new TransactionsPage(page, { baseURL, url: '/transactions', visual })
    );
  },
});
