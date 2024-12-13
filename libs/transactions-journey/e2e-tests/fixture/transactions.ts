import {
  PlaywrightTestArgs,
  TestType,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
} from '@playwright/test';
import { TransactionFixture } from '../model';
import { TransactionDetailsPage } from '../page-object/transaction-details.page';
import { TransactionsListPage } from '../page-object/transactions-list.page';

type BaseTestType = TestType<
  PlaywrightTestArgs & PlaywrightTestOptions,
  PlaywrightWorkerArgs & PlaywrightWorkerOptions
>;

export class TransactionFixtureBuilder {
  private baseTest!: BaseTestType;
  private data!: TransactionFixture['data'];

  setBaseTest(baseTest: BaseTestType): this {
    this.baseTest = baseTest;
    return this;
  }

  setData(data: TransactionFixture['data']): this {
    this.data = data;
    return this;
  }

  getFixture() {
    return this.baseTest.extend<TransactionFixture>({
      detailsPage: async ({ page, baseURL }, use) => {
        const pageObject = new TransactionDetailsPage(page, { baseURL });
        await use(pageObject);
      },
      listPage: async ({ page, baseURL }, use) => {
        const pageObject = new TransactionsListPage(page, { baseURL });
        await use(pageObject);
      },
      data: [this.data, { option: true }],
    });
  }
}
