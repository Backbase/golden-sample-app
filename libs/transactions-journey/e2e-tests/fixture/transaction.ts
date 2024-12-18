import { test as baseTest } from '@playwright/test';
import {
  TransactionFixture,
  TransactionDetailDataType,
  TransactionListDataType,
} from '../model';
import { TransactionDetailsPage, TransactionsListPage } from '../page-object';

export const test = baseTest.extend<TransactionFixture>({
  detailsPage: async ({ page, baseURL }, use) => {
    const pageObject = new TransactionDetailsPage(page, { baseURL });
    await use(pageObject);
  },
  detailsData: {} as TransactionDetailDataType, // pass default data
  listPage: async ({ page, baseURL }, use) => {
    const pageObject = new TransactionsListPage(page, { baseURL });
    await use(pageObject);
  },

  listData: {} as TransactionListDataType, // pass default data
});
