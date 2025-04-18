import { test as baseTest } from '@playwright/test';
import {
  TransactionFixture,
  TransactionDetailsDataType,
  TransactionsListDataType,
} from '../model';
import { TransactionDetailsPage, TransactionsPage } from '../page-objects';
import {
  defaultDetailsMocks,
  defaultListMocks,
  setupPageMocks,
} from '../mocks';

export const test = baseTest.extend<TransactionFixture>({
  transactionDetailsPage: async ({ page, baseURL }, use) => {
    await use(new TransactionDetailsPage(page, { url: `${baseURL}/transactions/{id}` }));
  },
  transactionDetailsData: {} as TransactionDetailsDataType, // pass default data
  // mocks data setup, can be overridden or bypassed via "useMocks"
  detailsMocksSetup: async ({ useMocks, page }, use) =>
    use(() => setupPageMocks(page, useMocks ? defaultDetailsMocks : {})),

  transactionsPage: async ({ page, baseURL }, use) => {
    await use(new TransactionsPage(page, { url: `${baseURL}/transactions` }));
  },

  transactionsListData: {} as TransactionsListDataType, // pass default data
  // mocks data setup, can be overridden or bypassed via "useMocks"
  listMocksSetup: async ({ useMocks, page }, use) =>
      use(() => setupPageMocks(page, useMocks ? defaultListMocks : {})),
  useMocks: true,
});
