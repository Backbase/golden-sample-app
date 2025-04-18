import {
  TransactionsListDataType,
  TransactionDetailsDataType,
} from '@backbase-gsa/transactions-journey/e2e-tests';
export const transactionListSandboxData: TransactionsListDataType = {
  size: 10,
  searchExpectations: [{ term: 'pocket', count: 6 }],
};

export const transactionDetailSandboxData: Partial<TransactionDetailsDataType> = {
  recipient: 'Pocket Transfer',
  category: 'Entertainment',
  description: 'Pocket',
  status: 'BILLED',
  id: '8a82802294ac68e50194ce41c66331f0',
};
