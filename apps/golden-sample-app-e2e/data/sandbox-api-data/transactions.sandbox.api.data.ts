import {
  TransactionListDataType,
  TransactionDetailDataType,
} from '@backbase-gsa/transactions-journey/e2e-tests';
export const transactionListSandboxData: TransactionListDataType = {
  size: 10,
  searchExpectations: [{ term: 'pocket', count: 5 }],
};

export const transactionDetailSandboxData: TransactionDetailDataType = {
  recipient: 'BP',
  category: 'Gasoline/Fuel',
  description: 'BP Global',
  status: 'BILLED',
  id: '8a82815f936800030193810b891452e0',
};
