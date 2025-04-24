import { VisualValidator } from '@backbase-gsa/e2e-tests';
import { TransactionDetailsPage } from '../page-objects/pages/transaction-details-page';
import { TransactionsPage } from '../page-objects/pages/transactions-list-page';

export interface TransactionDataType {
  transactionDetails: Partial<TransactionDetailsDataType>;
  transactionList: TransactionsListDataType;
}

export interface TransactionsListDataType {
  size: number;
  searchExpectations: {
    term: string;
    count: number;
    firstTransaction?: Partial<TransactionDetailsDataType>;
  }[];
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
  transactionMockSetup: () => void | Promise<void>;
  transactionsMockSetup: () => void | Promise<void>;
  transactionDetailsPage: TransactionDetailsPage;
  transactionsPage: TransactionsPage;
}
