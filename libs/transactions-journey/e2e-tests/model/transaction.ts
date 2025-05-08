import { formatDate, VisualValidator } from '@backbase-gsa/e2e-tests';
import { TransactionDetailsPage } from '../page-objects/pages/transaction-details-page';
import { TransactionsPage } from '../page-objects/pages/transactions-list-page';
import { MakeTransferPage } from '../page-objects/pages/make-transfer';

export interface TransactionDataType {
  transactions: Partial<TransactionDetailsDataType>[];
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
  amount: string | Amount | number;
  category: string;
  description: string;
  status: string;
  accountNumber: string;
}

export interface TransactionFixture {
  visual: VisualValidator;
  transactionMockSetup: (
    transactions: Partial<TransactionDetailsDataType>[]
  ) => void | Promise<void>;
  transactionsMockSetup: (
    transaction: TransactionsListDataType
  ) => void | Promise<void>;
  makeTransferPage: MakeTransferPage;
  transactionDetailsPage: TransactionDetailsPage;
  transactionsPage: TransactionsPage;
}

export const getAmountValue = (
  amount: string | Amount | number | undefined
): string => {
  if (!amount) {
    return '0';
  }
  if (typeof amount === 'string') {
    return amount;
  }
  if (typeof amount === 'number') {
    return amount.toString();
  }
  return amount.value;
};

export const createTransactionDetailsForMock = (
  transaction: Partial<TransactionDetailsDataType>
) => {
  return {
    id: transaction.id || '007jb5',
    category: transaction.category || 'Alcohol & Bars',
    description: transaction.description || 'Beer Bar Salt Lake',
    arrangementId: '0jb123wer456tgyhuj9869',
    reference: '1w23e4r5t6y7u8i9o0',
    originalDescription: 'BEER BAR 65000000764SALT LAKE C',
    typeGroup: 'Payment',
    type: 'Withdrawal',
    categoryId: 4,
    bookingDate: transaction.date
      ? formatDate(transaction.date, 'YYYY-MM-DD')
      : '2023-03-11',
    valueDate: '2023-03-12',
    creditDebitIndicator: 'DBIT',
    transactionAmountCurrency: getAmount(transaction.amount) || {
      amount: '839.25000',
      currencyCode: 'USD',
    },
    counterPartyName: transaction.recipient || 'Hard Rock Cafe',
    counterPartyAccountNumber: transaction.accountNumber || '123456789',
    counterPartyBIC: '112233',
    counterPartyCountry: 'SE',
    counterPartyBankName: 'Sweden Bank',
    billingStatus: transaction.status || 'BILLED',
    checkSerialNumber: 123456789,
    checkImageAvailability: 'AVAILABLE',
    state: 'COMPLETED',
  };
};

const getCurrencyFromSymbol = (str: string): string =>
  str.includes('€') ? 'EUR' : 'USD';

const getAmount = (
  amount: string | Amount | number | undefined
): { amount: string; currencyCode: string } => {
  if (!amount) {
    return { amount: '0.00000', currencyCode: 'USD' };
  }
  if (typeof amount === 'string') {
    return {
      amount: parseFloat(amount.replace(/[^\d.-]/g, '')).toFixed(5),
      currencyCode: getCurrencyFromSymbol(amount),
    };
  }
  if (typeof amount === 'object') {
    const value =
      typeof amount.value === 'string'
        ? parseFloat(amount.value)
        : amount.value;
    return {
      amount: value.toFixed(5),
      currencyCode: amount.currency || 'USD',
    };
  }
  return { amount: amount.toFixed(5), currencyCode: 'USD' };
};
