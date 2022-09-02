import { TransactionItem } from '@backbase/data-ang/transactions';

export const transactionsMock = [
  {
    valueDate: '1600493600000',
    type: 'Salaries',
    creditDebitIndicator: 'CRDT',
    transactionAmountCurrency: {
      amount: '5000',
      currencyCode: 'EUR',
    },
    merchant: {
      name: 'Backbase',
      id: 64397,
    },
  },
  {
    valueDate: 1600387200000,
    type: 'Card Payment',
    creditDebitIndicator: 'DBIT',
    transactionAmountCurrency: {
      amount: 82.02,
      currencyCode: 'EUR',
    },
    merchant: {
      name: 'The Tea Lounge',
      id: 64397,
    },
  },
  {
    valueDate: 1600473600000,
    type: 'Card Payment',
    creditDebitIndicator: 'DBIT',
    transactionAmountCurrency: {
      amount: 84.64,
      currencyCode: 'EUR',
    },
    merchant: {
      name: 'Texaco',
      id: 64397,
    },
  },
] as TransactionItem[];

export const debitMockTransaction = {
  valueDate: 1599868800000,
  type: 'Online Transfer',
  creditDebitIndicator: 'DBIT',
  transactionAmountCurrency: {
    amount: 142.95,
    currencyCode: 'EUR',
  },
  merchant: {
    name: 'Southern Electric Company',
    id: 64397,
  },
} as unknown as TransactionItem;

export const creditMockTransaction = {
  valueDate: 1599868800000,
  type: 'Online Transfer',
  creditDebitIndicator: 'CRDT',
  transactionAmountCurrency: {
    amount: 142.95,
    currencyCode: 'EUR',
  },
  merchant: {
    name: 'Southern Electric Company',
    id: 64397,
  },
} as unknown as TransactionItem;
