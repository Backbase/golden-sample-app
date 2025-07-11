import { TransactionDataType } from '@backbase/transactions-journey/e2e-tests';

export const sandboxTransactionData: TransactionDataType = {
  transactions: [
    {
      recipient: 'Pocket Transfer',
      category: 'Entertainment',
      description: 'Pocket',
      status: 'BILLED',
      id: '8a82802294ac68e50194ce41c66331f0',
    },
  ],
  transactionList: {
    size: 10,
    searchExpectations: [{ term: 'pocket', transactions: [] }],
  },
};
