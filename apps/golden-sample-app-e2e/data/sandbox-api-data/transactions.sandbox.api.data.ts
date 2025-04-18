import {
  TransactionsListDataType,
  TransactionDetailsDataType,
} from '@backbase-gsa/transactions-journey/e2e-tests';
export const transactionListSandboxData: TransactionsListDataType = {
  size: 10,
  searchExpectations: [{ term: 'pocket', count: 5 }],
};

export const transactionDetailSandboxData: Partial<TransactionDetailsDataType> = {
  recipient: 'BP',
  category: 'Gasoline/Fuel',
  description: 'BP Global',
  status: 'BILLED',
  id: '8a82815f936800030193810b891452e0',
};
