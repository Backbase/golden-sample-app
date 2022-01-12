import { FilterTransactionsPipe } from './filter-transactions.pipe';

const mockTransactions = [
  {
    categoryCode: '#12a580',
    dates: {
      valueDate: 1600493600000,
    },
    transaction: {
      amountCurrency: {
        amount: 5000,
        currencyCode: 'EUR',
      },
      type: 'Salaries',
      creditDebitIndicator: 'CRDT',
    },
    merchant: {
      name: 'Backbase',
      accountNumber: 'SI64397745065188826',
    },
  },
  {
    categoryCode: '#12a580',
    dates: {
      valueDate: 1600387200000,
    },
    transaction: {
      amountCurrency: {
        amount: 82.02,
        currencyCode: 'EUR',
      },
      type: 'Card Payment',
      creditDebitIndicator: 'DBIT',
    },
    merchant: {
      name: 'The Tea Lounge',
      accountNumber: 'SI64397745065188826',
    },
  },
  {
    categoryCode: '#d51271',
    dates: {
      valueDate: 1600473600000,
    },
    transaction: {
      amountCurrency: {
        amount: 84.64,
        currencyCode: 'EUR',
      },
      type: 'Card Payment',
      creditDebitIndicator: 'DBIT',
    },
    merchant: {
      name: 'Texaco',
      accountNumber: 'SI64397745065188826',
    },
  },
];

describe('FilterTransactionsPipe', () => {
  let filterTransactionsPipe: FilterTransactionsPipe;
  beforeEach(() => {
    filterTransactionsPipe = new FilterTransactionsPipe();
  });
  it('should filter the transactions according to a string value', () => {
    const result = filterTransactionsPipe.transform(mockTransactions, 'TEA');
    expect(result[0].merchant.name).toBe(mockTransactions[1].merchant.name);
  });
  it('should return unfiltered value', () => {
    const result = filterTransactionsPipe.transform(mockTransactions, '');
    expect(result).toBe(mockTransactions);
  });
});
