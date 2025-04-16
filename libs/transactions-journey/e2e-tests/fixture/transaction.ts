import { test as baseTest } from '@playwright/test';
import {
  TransactionFixture,
  TransactionDetailDataType,
  TransactionListDataType,
} from '../model';
import { TransactionDetailsPage, TransactionsListPage } from '../page-object';
import {
  defaultDetailsMocks,
  defaultListMocks,
  setupPageMocks,
} from '../mocks';

export const test = baseTest.extend<TransactionFixture>({
  detailsPage: async ({ page, baseURL }, use) => {
    await use(new TransactionDetailsPage(page, { baseURL }));
  },
  detailsData: {} as TransactionDetailDataType, // pass default data
  listPage: async ({ page, baseURL }, use) => {
    await use(new TransactionsListPage(page, { baseURL }));
  },
  detailsMocksSetup: async ({ useMocks, page }, use) =>
    use(() => setupPageMocks(page, useMocks ? defaultDetailsMocks : {})),

  // expected list data, should be overridden
  listData: {} as TransactionListDataType,
  // mocks data setup, can be overridden or bypassed via "useMocks"
  listMocksSetup: async ({ useMocks, page }, use) =>
    use(() => setupPageMocks(page, useMocks ? defaultListMocks : {})),

  useMocks: true,
});
