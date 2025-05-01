import { test, Page } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { TransactionDetailsDataType } from '../model';
import { createTransactionDetailsForMock } from '../model/transaction';

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
const transactionsMocks = {
  '**/v2/transactions': loadMockFile('./transactions-list.json'),
};

export const defaultTransactionsMock = {
  ...accessControlMocks,
  ...arrangementsMocks,
  ...transactionsMocks,
};

export function loadMockFile<T>(path: string): T {
  return JSON.parse(readFileSync(join(__dirname, path), 'utf-8'));
}

export function writeMockFile<T>(path: string, data: T): void {
  writeFileSync(join(__dirname, path), JSON.stringify(data, null, 2), 'utf-8');
}

export function setupPageMocks(page: Page, mocks: Record<string, unknown>) {
  test.step('Setup mock for transactions', async () => {
    for (const [endpoint, data] of Object.entries(mocks ?? {})) {
      page.route(endpoint, (route) => route.fulfill({ json: data }));
    }
  });
}

export function addTransactionsToMock(
  transactions: Partial<TransactionDetailsDataType>[]
) {
  for (const transaction of transactions) {
    const transactionsList = loadMockFile<{ id: string }[]>(
      './transactions-list.json'
    );
    const newTransaction = createTransactionDetailsForMock(transaction);
    const existingIndex = transactionsList.findIndex(
      (t) => t.id === newTransaction.id
    );
    const indexToUpdate =
      existingIndex >= 0 ? existingIndex : transactionsList.length;
    transactionsList[indexToUpdate] = newTransaction;
    writeMockFile('./transactions-list.json', transactionsList);
  }

  return defaultTransactionsMock;
}
