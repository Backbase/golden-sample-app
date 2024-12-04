export { TRANSACTION_DETAILS } from './data/transaction-details.data';
export { TRANSACTIONS_LIST } from './data/transactions-list.data';

export { TRANSACTION_DETAILS_LOCATORS } from './locators/transaction-details.locators';
export { TRANSACTIONS_LIST_LOCATORS } from './locators/transactions-list.locators';

export { TransactionDetailsPage } from './page-object/transaction-details.page';
export { TransactionsListPage } from './page-object/transactions-list.page';

export {
  testTransactionDetails,
  TransactionDetailsFixture,
} from './specs/transaction-details.spec';
export {
  testTransactionListError,
  testTransactionsList,
  TransactionsListFixture,
} from './specs/transactions-list.spec';
