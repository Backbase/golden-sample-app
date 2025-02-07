import { test as baseTest } from '@playwright/test';
import {
  TransactionFixture,
  TransactionDetailDataType,
  TransactionListDataType,
} from '../model';
import { TransactionDetailsPage, TransactionsListPage } from '../page-object';
import { defaultDetailsMocks, defaultListMocks } from './mocks';

export const test = baseTest.extend<TransactionFixture>({
  detailsPage: async ({ page, baseURL }, use) => {
    const pageObject = new TransactionDetailsPage(page, { baseURL });
    await use(pageObject);
  },
  // expected details data, should be overridden
  detailsData: {} as TransactionDetailDataType,
  // mocks data, can be overridden or bypassed via "useMocks"
  detailsMocks: async ({ useMocks }, use) =>
    await use(useMocks ? defaultDetailsMocks : {}),

  listPage: async ({ page, baseURL }, use) => {
    const pageObject = new TransactionsListPage(page, { baseURL });
    await use(pageObject);
  },
  // expected list data, should be overridden
  listData: {} as TransactionListDataType,
  // mocks data, can be overridden or bypassed via "useMocks"
  listMocks: async ({ useMocks }, use) =>
    await use(useMocks ? defaultListMocks : {}),

  useMocks: false,
});
