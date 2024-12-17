import { testWithAuth as baseTest } from '../page-objects/test-runner';
import { mergeTests } from '@playwright/test';
import {
  TransactionFixture,
  test as transferTest,
} from '@backbase-gsa/transactions-journey/e2e-tests';
import {
  transactionDetailMocksData,
  transactionListMockData,
} from '../data/mocks-data';
import {
  transactionDetailSandboxData,
  transactionListSandboxData,
} from '../data/sandbox-api-data';
import { TestEnvironment } from 'test.model';

export const test = mergeTests(
  baseTest,
  transferTest
).extend<TransactionFixture>({
  // overrode default data based on environment config
  detailsData: async ({ env }, use) => {
    // Based on the configurations, it passes data to the test
    if (env === TestEnvironment.MOCKS) {
      // passing mock data to check against mocks
      await use(transactionDetailMocksData);
    } else {
      // passing sandbox enc related data to check against sandbox env
      await use(transactionDetailSandboxData);
    }
  },
  // overrode default data based on environment config
  listData: async ({ env }, use, workerInfo) => {
    // Based on the configurations, it passes data to the test
    if (env === TestEnvironment.MOCKS) {
      // passing mock data to check against mocks
      await use(transactionListMockData);
    } else {
      // passing sandbox enc related data to check against sandbox env
      await use(transactionListSandboxData);
    }
  },
  userType: 'userWithNoContext',
});
