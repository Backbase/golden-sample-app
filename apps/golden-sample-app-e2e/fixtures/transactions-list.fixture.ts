import {
  TransactionsListFixture,
  TransactionsListPage,
} from '@backbase-gsa/transactions-journey/e2e-tests';
import { test as playwrightTest } from '@playwright/test';
import { test as baseTest } from '../page-objects/test-runner';

export const mocksConfiguration =
  playwrightTest.extend<TransactionsListFixture>({
    listPage: async ({ page, baseURL }, use) => {
      await use(new TransactionsListPage(page, { baseURL }));
    },
    listData: {
      size: 10,
      searchExpectations: [
        { term: 'KLM', count: 7 },
        { term: 'cafe', count: 3 },
      ],
    },
  });

export const sandboxConfiguration = baseTest.extend<TransactionsListFixture>({
  listPage: async ({ page, baseURL }, use) => {
    await use(new TransactionsListPage(page, { baseURL }));
  },
  listData: {
    size: 10,
    searchExpectations: [{ term: 'pocket', count: 5 }],
  },
  userType: 'userWithTransactionList',
});

// NOT IMPLEMENTED
export const ephemeralConfiguration =
  sandboxConfiguration.extend<TransactionsListFixture>({
    listData: {
      size: 0,
      searchExpectations: [],
    },
  });
