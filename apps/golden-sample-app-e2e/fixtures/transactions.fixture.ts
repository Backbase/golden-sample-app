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

// Transactions test data per Env type
const testData: Partial<
  Record<TestEnvironment, Pick<TransactionFixture, 'detailsData' | 'listData'>>
> = {
  // Mock data to run tests against mocks
  [TestEnvironment.MOCKS]: {
    detailsData: transactionDetailMocksData,
    listData: transactionListMockData,
  },
  // Sandbox data to run tests against sandbox env
  [TestEnvironment.SANDBOX]: {
    detailsData: transactionDetailSandboxData,
    listData: transactionListSandboxData,
  },
};

export const test = mergeTests(
  baseTest,
  transferTest
).extend<TransactionFixture>({
  // overrode default data based on environment config
  detailsData: async ({ env }, use) => await use(testData[env]!.detailsData),
  listData: async ({ env }, use) => await use(testData[env]!.listData),
  // whether to use mocks or not
  useMocks: async ({ env }, use) => await use(env === TestEnvironment.MOCKS),
  // type of the user
  userType: 'userWithNoContext',
});
