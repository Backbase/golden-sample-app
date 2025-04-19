import { testWithAuth as baseTest } from '../test-runner/test-runner';
import { mergeTests } from '@playwright/test';
import {
  TransactionDataType,
  TransactionFixture,
  test as transferTest,
} from '@backbase-gsa/transactions-journey/e2e-tests';
import { mockedTransactionsData } from '../data/mocks-data';
import { sandboxTransactionData } from '../data/sandbox-api-data';
import { TestEnvironment } from 'test.model';
import 'dotenv/config';

// Transactions test data per Env type
export const testData = (): TransactionDataType => {
  // Mock data to run tests against mocks
  const env =
    (process.env['TEST_ENVIRONMENT'] as TestEnvironment) ??
    TestEnvironment.MOCKS;
  switch (env) {
    case TestEnvironment.MOCKS:
      return mockedTransactionsData;
    case TestEnvironment.SANDBOX:
      return sandboxTransactionData;
  }
  return {} as TransactionDataType;
};

export const test = mergeTests(
  baseTest,
  transferTest
).extend<TransactionFixture>({
  // overrode default data based on environment config
  useMocks: async ({ env }, use) => await use(env === TestEnvironment.MOCKS),
  // type of the user
  userType: 'userWithNoContext',
});
