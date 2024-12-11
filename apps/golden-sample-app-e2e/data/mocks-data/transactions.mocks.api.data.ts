import {
  TransactionListDataType,
  TransactionDetailDataType,
} from '@backbase-gsa/transactions-journey/e2e-tests';

export const transactionListMockData: TransactionListDataType = {
  size: 10,
  searchExpectations: [
    { term: 'KLM', count: 7 },
    { term: 'cafe', count: 3 },
  ],
};

export const transactionDetailMocksData: TransactionDetailDataType = {
  recipient: 'Hard Rock Cafe',
  category: 'Alcohol & Bars',
  description: 'Beer Bar Salt Lake',
  status: 'BILLED',
  id: '007jb5',
};
