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
      id: 64397745065188826,
    },
  },
  {
    valueDate: 1600387200000,
    type: 'Card Payment',
    creditDebitIndicator: 'DBIT',
    transactionAmountCurrency: {
      amountCurrency: {
        amount: 82.02,
        currencyCode: 'EUR',
      },
    },
    merchant: {
      name: 'The Tea Lounge',
      id: 64397745065188826,
    },
  },
  {
    valueDate: 1600473600000,
    transactionAmountCurrency: {
      amountCurrency: {
        amount: 84.64,
        currencyCode: 'EUR',
      },
      type: 'Card Payment',
      creditDebitIndicator: 'DBIT',
    },
    merchant: {
      name: 'Texaco',
      id: 64397745065188826,
    },
  },
] as TransactionItem[];

export const debitMockTransaction = {
  valueDate: 1599868800000,
  transactionAmountCurrency: {
    amountCurrency: {
      amount: 142.95,
      currencyCode: 'EUR',
    },
    type: 'Online Transfer',
    creditDebitIndicator: 'DBIT',
  },
  merchant: {
    name: 'Southern Electric Company',
    id: 64397745065188826,
  },
} as unknown as TransactionItem;

export const creditMockTransaction = {
  valueDate: 1599868800000,
  transactionAmountCurrency: {
    amountCurrency: {
      amount: 142.95,
      currencyCode: 'EUR',
    },
    type: 'Online Transfer',
    creditDebitIndicator: 'CRDT',
  },
  merchant: {
    name: 'Southern Electric Company',
    id: 64397745065188826,
  },
} as unknown as TransactionItem;
