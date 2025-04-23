import { test as baseTest } from '@playwright/test';
import { TransactionFixture } from '../model';
import { TransactionDetailsPage, TransactionsPage } from '../page-objects';

export const test = baseTest.extend<TransactionFixture>({
  transactionDetailsPage: async ({ page, baseURL }, use) => {
    await use(
      new TransactionDetailsPage(page, { baseURL, url: '/transactions/{id}' })
    );
  },
  transactionsPage: async ({ page, baseURL }, use) => {
    await use(new TransactionsPage(page, { baseURL, url: '/transactions' }));
  },
});
