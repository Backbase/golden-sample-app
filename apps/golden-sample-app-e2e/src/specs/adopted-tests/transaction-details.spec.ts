import { test, testData } from '../../fixtures/transactions.fixture';
import { testTransactionDetails } from '@backbase/transactions-journey/e2e-tests';

testTransactionDetails(test, testData());
