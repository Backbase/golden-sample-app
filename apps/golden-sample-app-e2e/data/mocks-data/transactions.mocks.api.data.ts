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
        transactions: [
          { recipient: 'KLM', amount: '23.84' },
          { recipient: 'KLM', amount: '24.01' },
          { recipient: 'KLM', amount: '0.00' },
          { recipient: 'KLM', amount: '15,508.37' },
          { recipient: 'KLM', amount: '522.09' },
          { recipient: 'KLM', amount: '568.58' },
          { recipient: 'KLM', amount: '123.45' },
        ],
      },
      {
        term: 'cafe',
        transactions: [
          { recipient: 'Hard Rock Cafe', date: 'Mar. 2', amount: '401.97' },
          { recipient: 'Hard Rock Cafe', date: 'Mar. 2', amount: '50.31' },
          {
            recipient: 'Hard Rock Cafe',
            date: 'Mar. 2',
            amount: '829.25',
            accountNumber: '123456789',
          },
        ],
      },
      { term: 'unknown', transactions: [] },
    ],
  },
  recipients: [
    'KLM',
    'KLM',
    'KLM',
    'KLM',
    'Hard Rock Cafe',
    'Hard Rock Cafe',
    'KLM',
    'KLM',
    'Hard Rock Cafe',
    'KLM',
  ],
  recipientsSubset: ['KLM', 'Hard Rock Cafe'],
};
