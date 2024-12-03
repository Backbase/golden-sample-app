import { testTransactionDetails } from '@backbase-gsa/transactions-journey/e2e-tests';
import {
  sandboxConfiguration,
  mocksConfiguration,
} from '../fixtures/transaction-details.fixture';
import { getEnvironmentType } from '../utils/environment-utils';

const environmentType = getEnvironmentType();

if (environmentType === 'sandbox') {
  testTransactionDetails(sandboxConfiguration);
}

if (environmentType === 'mocks') {
  testTransactionDetails(mocksConfiguration);
}
