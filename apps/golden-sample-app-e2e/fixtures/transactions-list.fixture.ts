import { Page, Route, TestInfo, test as baseTest } from '@playwright/test';
import { TransactionsListFixture } from '@backbase-gsa/transactions-journey/e2e-tests';

export const test = baseTest.extend<TransactionsListFixture>({
  listPage: async ({ page }, use) => {
    const pageObject = TemplateNewPage.from({
      page,
      batchType,
      useDirectUrl: true,
    });
    await use(pageObject);
  },
  listData: {
    size: 10,
    searchedSize: 3,
    searchTerm: 'cafe',
  },
});
