import { Transaction } from '../model/transaction';

export const transactionsMock: Transaction[] = [
  {
    categoryCode: '#12a580',
    dates: {
        valueDate: 1600493600000
    },
    transaction: {
        amountCurrency: {
        amount: 5000,
        currencyCode: 'EUR'
        },
        type: 'Salaries',
        creditDebitIndicator: 'CRDT'
    },
    merchant: {
        name: 'Backbase',
        accountNumber: 'SI64397745065188826'
    }
  },
  {
    categoryCode: '#12a580',
    dates: {
      valueDate: 1600387200000
    },
    transaction: {
      amountCurrency: {
        amount: 82.02,
        currencyCode: 'EUR'
      },
      type: 'Card Payment',
      creditDebitIndicator: 'DBIT'
    },
    merchant: {
      name: 'The Tea Lounge',
      accountNumber: 'SI64397745065188826'
    }
  },
  {
    categoryCode: '#d51271',
    dates: {
      valueDate: 1600473600000
    },
    transaction: {
      amountCurrency: {
        amount: 84.64,
        currencyCode: 'EUR'
      },
      type: 'Card Payment',
      creditDebitIndicator: 'DBIT'
    },
    merchant: {
      name: 'Texaco',
      accountNumber: 'SI64397745065188826'
    }
  }
];

export const debitMockTransaction: Transaction ={
    categoryCode: '#fbbb1b',
    dates: {
      valueDate: 1599868800000
    },
    transaction: {
      amountCurrency: {
        amount: 142.95,
        currencyCode: 'EUR'
      },
      type: 'Online Transfer',
      creditDebitIndicator: 'DBIT'
    },
    merchant: {
      name: 'Southern Electric Company',
      accountNumber: 'SI64397745065188826'
    }
  };

export const creditMockTransaction: Transaction ={
  categoryCode: '#fbbb1b',
  dates: {
    valueDate: 1599868800000
  },
  transaction: {
    amountCurrency: {
      amount: 142.95,
      currencyCode: 'EUR'
    },
    type: 'Online Transfer',
    creditDebitIndicator: 'CRDT'
  },
  merchant: {
    name: 'Southern Electric Company',
    accountNumber: 'SI64397745065188826'
  }
};
