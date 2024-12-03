import {
  testTransactionsListHappyPath,
  testTransactionsListErrorsHandling,
} from '@backbase-gsa/transactions-journey/e2e-tests';
import {
  sandboxConfiguration,
  ephemeralConfiguration,
  mocksConfiguration,
} from '../fixtures/transactions-list.fixture';
import { getEnvironmentType } from '../utils/environment-utils';

const environmentType = getEnvironmentType();

if (environmentType === 'sandbox') {
  testTransactionsListHappyPath(sandboxConfiguration);
}

if (environmentType === 'ephemeral') {
  testTransactionsListHappyPath(ephemeralConfiguration);
}

if (environmentType === 'mocks') {
  testTransactionsListHappyPath(mocksConfiguration);
  testTransactionsListErrorsHandling(mocksConfiguration);
}
