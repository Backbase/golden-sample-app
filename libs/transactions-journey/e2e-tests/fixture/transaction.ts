import { test as baseTest } from '@playwright/test';
import {
  TransactionFixture,
  TransactionDetailsDataType,
  TransactionsListDataType,
} from '../model';
import { TransactionDetailsPage, TransactionsPage } from '../page-objects';

export const test = baseTest.extend<TransactionFixture>({
  transactionDetailsPage: async ({ page, baseURL }, use) => {
    await use(new TransactionDetailsPage(page, { url: `${baseURL}/transactions/{id}` }));
  },
  transactionDetailsData: {} as TransactionDetailsDataType, // pass default data
  transactionsPage: async ({ page, baseURL }, use) => {
    await use(new TransactionsPage(page, { url: `${baseURL}/transactions` }));
  },

  transactionsListData: {} as TransactionsListDataType, // pass default data
});
