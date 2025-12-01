import { test, Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TransactionDetailsDataType } from '../model';
import { createTransactionDetailsForMock } from '../model/transaction';

/**
 * Loads a mock JSON file from disk (read-only operation).
 * This is safe for parallel execution as it only reads.
 */
export function loadMockFile<T>(path: string): T {
  return JSON.parse(readFileSync(join(__dirname, path), 'utf-8'));
}

// Base mock data loaded once at module initialization (read-only)
const accessControlMocks = {
  '**/accessgroups/users/permissions/summary': loadMockFile(
    './access-control-summary.json'
  ),
  '**/accessgroups/service-agreements/context': loadMockFile(
    './access-control-context.json'
  ),
};
const arrangementsMocks = {
  '**/productsummary/context/arrangements**': loadMockFile(
    './product-summary-arrangements.json'
  ),
};

// Load base transactions list once (will be cloned per test)
const baseTransactionsList = loadMockFile<{ id: string }[]>(
  './transactions-list.json'
);

export const defaultTransactionsMock = {
  ...accessControlMocks,
  ...arrangementsMocks,
  '**/v2/transactions': baseTransactionsList,
};

export function setupPageMocks(page: Page, mocks: Record<string, unknown>) {
  test.step('Setup mock for transactions', async () => {
    for (const [endpoint, data] of Object.entries(mocks ?? {})) {
      page.route(endpoint, (route) => route.fulfill({ json: data }));
    }
  });
}

/**
 * Creates an in-memory copy of the transactions mock with additional transactions.
 * This is safe for parallel execution as it doesn't write to disk.
 *
 * @param transactions - Transactions to add or update in the mock
 * @returns A new mock object with the updated transactions list
 */
export function addTransactionsToMock(
  transactions: Partial<TransactionDetailsDataType>[]
): Record<string, unknown> {
  // Create a deep copy of the base transactions list to avoid mutations
  const transactionsList = JSON.parse(JSON.stringify(baseTransactionsList)) as {
    id: string;
  }[];

  for (const transaction of transactions) {
    const newTransaction = createTransactionDetailsForMock(transaction);
    const existingIndex = transactionsList.findIndex(
      (t) => t.id === newTransaction.id
    );
    const indexToUpdate =
      existingIndex >= 0 ? existingIndex : transactionsList.length;
    transactionsList[indexToUpdate] = newTransaction;
  }

  // Return a new mock object with the modified transactions list (in-memory only)
  return {
    ...accessControlMocks,
    ...arrangementsMocks,
    '**/v2/transactions': transactionsList,
  };
}
