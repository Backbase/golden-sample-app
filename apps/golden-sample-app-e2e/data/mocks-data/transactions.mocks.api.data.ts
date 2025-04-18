import {
  TransactionsListDataType,
  TransactionDetailsDataType,
} from '@backbase-gsa/transactions-journey/e2e-tests';

export const transactionListMockData: TransactionsListDataType = {
  size: 10,
  searchExpectations: [
    { term: 'KLM', count: 7, firstTransaction: { recipient: 'KLM', amount: '23.84' } },
    { term: 'cafe', count: 3, firstTransaction: { recipient: 'Hard Rock Cafe', amount: { value: '829.25' }  }},
    { term: 'unknown', count: 0 },
  ],
};

export const transactionDetailMocksData: Partial<TransactionDetailsDataType> = {
  recipient: 'Hard Rock Cafe',
  category: 'Alcohol & Bars',
  description: 'Beer Bar Salt Lake',
  status: 'BILLED',
  id: '007jb5',
};
