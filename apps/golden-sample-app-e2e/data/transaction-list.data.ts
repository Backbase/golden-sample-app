import { TransactionListDataType } from '@backbase-gsa/transactions-journey/e2e-tests';

export const transactionListMockData: TransactionListDataType = {
  size: 10,
  searchExpectations: [
    { term: 'KLM', count: 7 },
    { term: 'cafe', count: 3 },
  ],
};

export const transactionListSandboxData: TransactionListDataType = {
  size: 10,
  searchExpectations: [{ term: 'pocket', count: 5 }],
};
