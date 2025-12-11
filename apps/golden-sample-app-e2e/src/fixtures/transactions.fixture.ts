import { test as baseTest } from './test';
import { mergeTests } from '@playwright/test';
import {
  TransactionDataType,
  TransactionFixture,
  test as transferTest,
} from '@backbase/transactions-journey/e2e-tests';
import { mockedTransactionsData } from '../data/mocks-data';
import { sandboxTransactionData } from '../data/sandbox-api-data';
import { TestEnvironment } from './environment';
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
  // type of the user
  userType: 'userWithNoContext',
});
