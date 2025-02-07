import { PlaywrightTestArgs } from '@playwright/test';
import { TransactionDetailsPage } from '../page-object/transaction-details.page';
import { TransactionsListPage } from '../page-object/transactions-list.page';

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
  detailsPage: TransactionDetailsPage;
  detailsData: TransactionDetailDataType;
  detailsMocks: Record<string, object | string>;

  listPage: TransactionsListPage;
  listData: TransactionListDataType;
  listMocks: Record<string, object | string>;

  useMocks: boolean;
} & PlaywrightTestArgs;
