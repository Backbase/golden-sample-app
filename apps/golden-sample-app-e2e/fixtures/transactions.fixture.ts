import { testWithAuth as baseTest } from '../page-objects/test-runner';
import {
  TransactionFixtureBuilder,
  TransactionFixture,
} from '@backbase-gsa/transactions-journey/e2e-tests';
import {
  transactionDetailMocksData,
  transactionListMockData,
} from '../data/mocks-data';
import { TestEnvironment } from 'test.model';
import {
  transactionDetailSandboxData,
  transactionListSandboxData,
} from '../data/sandbox-api-data';

// Transactions test data per env type
const dataConfiguration: Partial<
  Record<TestEnvironment, TransactionFixture['data']>
> = {
  [TestEnvironment.MOCKS]: {
    details: transactionDetailMocksData,
    list: transactionListMockData,
  },
  [TestEnvironment.SANDBOX]: {
    details: transactionDetailSandboxData,
    list: transactionListSandboxData,
  },
};

// Transactions test fixture
export const test = new TransactionFixtureBuilder()
  .setBaseTest(
    baseTest.extend<TransactionFixture>({
      data: async ({ env }, use) => await use(dataConfiguration[env]!),
      userType: 'userWithNoContext',
    })
  )
  .getFixture();
