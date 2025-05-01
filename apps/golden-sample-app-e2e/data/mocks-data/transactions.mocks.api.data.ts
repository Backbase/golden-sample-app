import { TransactionDataType } from '@backbase-gsa/transactions-journey/e2e-tests';

export const mockedTransactionsData: TransactionDataType = {
  transactions: [
    {
      recipient: 'Hard Rock Cafe',
      category: 'Alcohol & Bars',
      description: 'Beer Bar Salt Lake',
      status: 'BILLED',
      amount: { value: '829.25', currency: 'USD' },
      date: 'Mar 2, 2023',
      id: '007jb5',
    },
    {
      recipient: 'KLM',
      category: 'Travel',
      description: 'Travel',
      status: 'BILLED',
      amount: { value: '123.45', currency: 'USD' },
      date: 'May 1, 2023',
      id: '007jb8',
    },
  ],
  transactionList: {
    size: 10,
    searchExpectations: [
      {
        term: 'KLM',
        count: 7,
        firstTransaction: { recipient: 'KLM', amount: '23.84' },
      },
      {
        term: 'cafe',
        count: 3,
        firstTransaction: {
          recipient: 'Hard Rock Cafe',
          amount: { value: '401.97' },
        },
      },
      { term: 'unknown', count: 0 },
    ],
  },
};
