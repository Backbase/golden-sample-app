import { Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

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

export const defaultTransactionMock = {
  ...accessControlMocks,
  ...arrangementsMocks,
  ...transactionsMocks,
};

export function loadMockFile<T>(path: string): T {
  return JSON.parse(readFileSync(join(__dirname, path), 'utf-8'));
}

export function setupPageMocks(page: Page, mocks: Record<string, unknown>) {
  for (const [endpoint, data] of Object.entries(mocks ?? {})) {
    page.route(endpoint, (route) => route.fulfill({ json: data }));
  }
}
