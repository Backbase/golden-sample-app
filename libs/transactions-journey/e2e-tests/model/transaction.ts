import { PlaywrightTestArgs } from '@playwright/test';
import { TransactionDetailsPage } from '../page-objects/transaction-details.page';
import { TransactionsListPage } from '../page-objects/transactions-list.page';

export interface TransactionDataType {
  transactionList: TransactionListDataType;
  transactionDetails: TransactionDetailDataType;
}

export interface TransactionListDataType {
  size: number;
  searchExpectations: Array<{ term: string; count: number }>;
}
export interface TransactionDetailDataType {
  recipient: string;
  category: string;
  description: string;
  status: string;
  id: string;
}

export type TransactionFixture = {
  transactionsDetailsPage: TransactionDetailsPage;
  transactionsDetailsData: TransactionDetailDataType;
  detailsMocksSetup: () => void | Promise<void>;

  transactionsListPage: TransactionsListPage;
  transactionsListData: TransactionListDataType;
  listMocksSetup: () => void | Promise<void>;

  useMocks: boolean;
} & PlaywrightTestArgs;
