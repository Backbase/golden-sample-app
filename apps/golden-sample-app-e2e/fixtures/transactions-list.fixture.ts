import {
  TransactionsListFixture,
  TransactionsListPage,
} from '@backbase-gsa/transactions-journey/e2e-tests';
import { test as baseTest } from '@playwright/test';

export const test = baseTest.extend<TransactionsListFixture>({
  listPage: async ({ page, baseURL }, use) => {
    const pageObject = new TransactionsListPage(page, { baseURL });
    await use(pageObject);
  },
  listData: {
    size: 10,
    searchedSize: 3,
    searchTerm: 'cafe',
    searchExpectations: [
      { term: 'KLM', count: 7 },
      { term: 'cafe', count: 3 },
    ],
  },
});
