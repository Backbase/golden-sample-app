import {
  createTransactionDetailsForMock,
  TransactionDetailsDataType,
  TransactionDataType,
} from '@backbase/transactions-journey/e2e-tests';
/**
 * Deterministic transaction seed used by integration specs to inject a
 * predictable row into the mocked `/v2/transactions` list via
 * `transactionMockSetup([...])`. Kept in `data/mocks-data/` alongside the
 * journey-wide mocked dataset so any integration spec can reuse it without
 * redeclaring the shape.
 */
export const integrationVendorSeed: Partial<TransactionDetailsDataType> = {
  id: 'integration-seed-001',
  recipient: 'Integration Vendor',
  category: 'Office Supplies',
  description: 'Pens and notebooks',
  status: 'BILLED',
  amount: { value: '42.00', currency: 'USD' },
  date: 'Apr 5, 2024',
  accountNumber: '999000111',
};

/**
 * Wire-shaped transaction record as the `/v2/transactions` endpoint emits it.
 * Returned by `createTransactionDetailsForMock(...)` from the journey lib.
 */
export type MockTransactionRecord = ReturnType<
  typeof createTransactionDetailsForMock
>;

/**
 * Fluent, reusable builder that composes deterministic `/v2/transactions`
 * 200-response payloads for integration specs. Use the static seeds and named
 * presets for canonical scenarios, or compose ad-hoc payloads via the fluent
 * `add(...).add(...).build()` API.
 *
 * @example
 * // Canonical 2-vendor success payload:
 * const body = TransactionsResponseBuilder.twoVendorSuccess();
 *
 * @example
 * // Ad-hoc composition for a bespoke scenario:
 * const body = new TransactionsResponseBuilder()
 *   .add({ id: 'x', recipient: 'X', amount: { value: '1', currency: 'USD' } })
 *   .add({ id: 'y', recipient: 'Y', amount: { value: '2', currency: 'USD' } })
 *   .build();
 */
export class TransactionsResponseBuilder {
  static readonly ACME_COFFEE_SEED: Partial<TransactionDetailsDataType> = {
    id: 'ext-dep-positive-001',
    recipient: 'Acme Coffee',
    category: 'Food & Drink',
    description: 'Morning latte',
    status: 'BILLED',
    amount: { value: '4.75', currency: 'USD' },
    date: 'Jun 10, 2024',
    accountNumber: '555000222',
  };

  static readonly CITY_LIBRARY_SEED: Partial<TransactionDetailsDataType> = {
    id: 'ext-dep-positive-002',
    recipient: 'City Library',
    category: 'Books',
    description: 'Late return fee',
    status: 'BILLED',
    amount: { value: '1.50', currency: 'USD' },
    date: 'Jun 10, 2024',
    accountNumber: '555000333',
  };

  private readonly items: MockTransactionRecord[] = [];

  add(seed: Partial<TransactionDetailsDataType>): this {
    this.items.push(createTransactionDetailsForMock(seed));
    return this;
  }

  build(): MockTransactionRecord[] {
    return [...this.items];
  }

  /**
   * Canonical two-vendor 200-response payload used by external-dependency
   * integration tests to drive a deterministic happy-path render.
   */
  static twoVendorSuccess(): MockTransactionRecord[] {
    return new TransactionsResponseBuilder()
      .add(TransactionsResponseBuilder.ACME_COFFEE_SEED)
      .add(TransactionsResponseBuilder.CITY_LIBRARY_SEED)
      .build();
  }
}
export const mockedTransactionsData: TransactionDataType = {
  transactions: [
    {
      recipient: 'Hard Rock Cafe',
      category: 'Alcohol & Bars',
      description: 'Beer Bar Salt Lake',
      status: 'BILLED',
      amount: { value: '829.25', currency: 'USD' },
      date: 'Mar 2, 2023',
      id: '007jb5',
    },
    {
      recipient: 'KLM',
      category: 'Travel',
      description: 'Travel',
      status: 'BILLED',
      amount: { value: '123.45', currency: 'USD' },
      date: 'May 1, 2023',
      id: '007jb8',
    },
  ],
  transactionList: {
    size: 10,
    searchExpectations: [
      {
        term: 'KLM',
        transactions: [
          { recipient: 'KLM', amount: '23.84' },
          { recipient: 'KLM', amount: '24.01' },
          { recipient: 'KLM', amount: '0.00' },
          { recipient: 'KLM', amount: '15,508.37' },
          { recipient: 'KLM', amount: '522.09' },
          { recipient: 'KLM', amount: '568.58' },
          { recipient: 'KLM', amount: '123.45' },
        ],
      },
      {
        term: 'cafe',
        transactions: [
          { recipient: 'Hard Rock Cafe', date: 'Mar. 2', amount: '401.97' },
          { recipient: 'Hard Rock Cafe', date: 'Mar. 2', amount: '50.31' },
          {
            recipient: 'Hard Rock Cafe',
            date: 'Mar. 2',
            amount: '829.25',
            accountNumber: '123456789',
          },
        ],
      },
      { term: 'unknown', transactions: [] },
    ],
  },
  recipients: [
    'KLM',
    'KLM',
    'KLM',
    'KLM',
    'Hard Rock Cafe',
    'Hard Rock Cafe',
    'KLM',
    'KLM',
    'Hard Rock Cafe',
    'KLM',
  ],
  recipientsSubset: ['KLM', 'Hard Rock Cafe'],
};
