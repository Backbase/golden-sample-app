import { test, testData } from '../../fixtures/transactions.fixture';
import { testTransactionsList } from '@backbase-gsa/transactions-journey/e2e-tests';

testTransactionsList(test, testData());
