import { transactionsMock } from '../mocks/transactions-mocks';
import { FilterTransactionsPipe } from './filter-transactions.pipe';

describe('FilterTransactionsPipe', () => {
  let filterTransactionsPipe: FilterTransactionsPipe;

  beforeEach(() => {
    filterTransactionsPipe = new FilterTransactionsPipe();
  });

  it('should filter the transactions according to a string value', () => {
    const result = filterTransactionsPipe.transform(transactionsMock, 'Sal');

    // Because we are working with the mocks in thix context with optional fields in model
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(result[0]?.merchant?.name).toBe(transactionsMock[0]!.merchant!.name);
    expect(result.length).toBe(1);
  });

  it('should return unfiltered value', () => {
    const result = filterTransactionsPipe.transform(transactionsMock, '');
    expect(result).toBe(transactionsMock);
  });
});
