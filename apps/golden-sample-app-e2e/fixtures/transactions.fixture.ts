import { testWithAuth as baseTest } from '../test-runner/test-runner';
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
  Record<TestEnvironment, Pick<TransactionFixture, 'transactionDetailsData' | 'transactionsListData'>>
> = {
  // Mock data to run tests against mocks
  [TestEnvironment.MOCKS]: {
    transactionDetailsData: transactionDetailMocksData,
    transactionsListData: transactionListMockData,
  },
  // Sandbox data to run tests against sandbox env
  [TestEnvironment.SANDBOX]: {
    transactionDetailsData: transactionDetailSandboxData,
    transactionsListData: transactionListSandboxData,
  },
};

export const test = mergeTests(
  baseTest,
  transferTest
).extend<TransactionFixture>({
  // overrode default data based on environment config
  transactionDetailsData: async ({ env }, use) => await use(testData[env]!.transactionDetailsData),
  transactionsListData: async ({ env }, use) => await use(testData[env]!.transactionsListData),
  // type of the user
  userType: 'userWithNoContext',
});
