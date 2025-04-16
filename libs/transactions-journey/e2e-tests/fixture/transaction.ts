import { test as baseTest } from '@playwright/test';
import {
  TransactionFixture,
  TransactionDetailDataType,
  TransactionListDataType,
} from '../model';
import { TransactionDetailsPage, TransactionsListPage } from '../page-objects';
import {
  defaultDetailsMocks,
  defaultListMocks,
  setupPageMocks,
} from '../mocks';

export const test = baseTest.extend<TransactionFixture>({
  transactionsDetailsPage: async ({ page }, use) => {
    await use(new TransactionDetailsPage(page));
 },
 transactionsDetailsData: {} as TransactionDetailDataType, // pass default data
 transactionsListPage: async ({ page }, use) => {
    await use(new TransactionsListPage(page));
 },
  // mocks data setup, can be overridden or bypassed via "useMocks"
  detailsMocksSetup: async ({ useMocks, page }, use) =>
    use(() => setupPageMocks(page, useMocks ? defaultDetailsMocks : {})),

  // expected list data, should be overridden
  transactionsListData: {} as TransactionListDataType,
  // mocks data setup, can be overridden or bypassed via "useMocks"
  listMocksSetup: async ({ useMocks, page }, use) =>
    use(() => setupPageMocks(page, useMocks ? defaultListMocks : {})),

  useMocks: true,
});
