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

export interface TransactionFixture {
  detailsPage: TransactionDetailsPage;
  listPage: TransactionsListPage;
  data: {
    details: TransactionDetailDataType;
    list: TransactionListDataType;
  };
}
