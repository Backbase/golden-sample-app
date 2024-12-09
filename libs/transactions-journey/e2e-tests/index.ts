export { TRANSACTION_DETAILS } from './data/transaction-details.data';
export { TRANSACTIONS_LIST } from './data/transactions-list.data';

export { TransactionDetailsPage } from './page-object/transaction-details.page';
export { TransactionsListPage } from './page-object/transactions-list.page';

export {
  TransactionDetailsFixture,
  testTransactionDetails,
} from './specs/transaction-details.spec';
export {
  TransactionsListFixture,
  testTransactionListError,
  testTransactionsList,
} from './specs/transactions-list.spec';
