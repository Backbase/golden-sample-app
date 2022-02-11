import { transactionsMock } from '../mocks/transactions-mocks';
import { FilterTransactionsPipe } from './filter-transactions.pipe';

describe('FilterTransactionsPipe', () => {
  let filterTransactionsPipe: FilterTransactionsPipe;

  beforeEach(() => {
    filterTransactionsPipe = new FilterTransactionsPipe();
  });

  it('should filter the transactions according to a string value', () => {
    const result = filterTransactionsPipe.transform(transactionsMock, 'Sal');

    expect(result[0]?.merchant?.name).toBe(transactionsMock[0]!.merchant!.name);
    expect(result.length).toBe(1);
  });

  it('should return unfiltered value', () => {
    const result = filterTransactionsPipe.transform(transactionsMock, '');
    expect(result).toBe(transactionsMock);
  });
});
