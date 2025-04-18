import { VisualValidator } from '@backbase-gsa/e2e-tests';
import { TransactionDetailsPage } from '../page-objects/pages/transaction-details.po';
import { TransactionsPage } from '../page-objects/pages/transactions-list.po';

export interface TransactionDataType {
  transactionList: TransactionsListDataType;
  transactionDetails: TransactionDetailsDataType;
}

export interface TransactionsListDataType {
  size: number;
  searchExpectations: Array<{ term: string; count: number, firstTransaction?: Partial<TransactionDetailsDataType> }>;
}

export interface Amount {
  currency?: string;
  value: string;
}
export interface TransactionDetailsDataType {
  id: string;
  recipient: string;
  date: Date | string;
  amount: string | Amount;
  category: string;
  description: string;
  status: string;
  accountNumber: string;
}

export interface TransactionFixture {
  visual: VisualValidator;
  transactionDetailsPage: TransactionDetailsPage;
  transactionDetailsData: Partial<TransactionDetailsDataType>;
  transactionsPage: TransactionsPage;
  transactionsListData: TransactionsListDataType;
}
