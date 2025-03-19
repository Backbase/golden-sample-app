import {
  TransactionListDataType,
  TransactionDetailDataType,
} from '@backbase-gsa/transactions-journey/e2e-tests';
export const transactionListSandboxData: TransactionListDataType = {
  size: 10,
  searchExpectations: [{ term: 'pocket', count: 6 }],
};

export const transactionDetailSandboxData: TransactionDetailDataType = {
  recipient: 'Pocket Transfer',
  category: 'Entertainment',
  description: 'Pocket',
  status: 'BILLED',
  id: '8a82802294ac68e50194ce41c66331f0',
};
