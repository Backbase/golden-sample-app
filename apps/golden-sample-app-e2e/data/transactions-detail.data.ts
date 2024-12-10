import { TransactionDetailDataType } from '@backbase-gsa/transactions-journey/e2e-tests';

export const transactionDetailMocksData: TransactionDetailDataType = {
  recipient: 'Hard Rock Cafe',
  category: 'Alcohol & Bars',
  description: 'Beer Bar Salt Lake',
  status: 'BILLED',
  id: '007jb5',
};

export const transactionDetailSandboxData: TransactionDetailDataType = {
  recipient: 'BP',
  category: 'Gasoline/Fuel',
  description: 'BP Global',
  status: 'BILLED',
  id: '8a82815f936800030193810b891452e0',
};
