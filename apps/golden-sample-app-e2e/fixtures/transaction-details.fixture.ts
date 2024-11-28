import { test as baseTest } from '@playwright/test';
import {
  TransactionDetailsFixture,
  TransactionDetailsPage,
} from '@backbase-gsa/transactions-journey/e2e-tests';

export const test = baseTest.extend<TransactionDetailsFixture>({
  detailsPage: async ({ page, baseURL }, use) => {
    const pageObject = new TransactionDetailsPage(page, { baseURL });
    await use(pageObject);
  },
  detailsData: {
    recipient: 'Hard Rock Cafe',
    category: 'Alcohol & Bars',
    description: 'Beer Bar Salt Lake',
    status: 'BILLED',
    id: '007jb5',
  },
});
