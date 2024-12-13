import {
  PlaywrightTestArgs,
  TestType,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
} from '@playwright/test';
import {
  TransactionDetailDataType,
  TransactionFixture,
  TransactionListDataType,
} from '../model';
import { TransactionDetailsPage } from '../page-object/transaction-details.page';
import { TransactionsListPage } from '../page-object/transactions-list.page';
type BaseTestType = TestType<
  PlaywrightTestArgs &
    PlaywrightTestOptions & {
      userType: string;
      user: any;
    },
  PlaywrightWorkerArgs & PlaywrightWorkerOptions
>;
export class TransactionFixtureBuilder {
  private detailsData: TransactionDetailDataType =
    {} as TransactionDetailDataType; // todo default-data
  private listData: TransactionListDataType = {} as TransactionListDataType; // todo default-data
  private baseTest!: BaseTestType;

  setDetailsData(data: TransactionDetailDataType): this {
    this.detailsData = data;
    return this;
  }

  setListData(data: TransactionListDataType): this {
    this.listData = data;
    return this;
  }

  setBaseTest(baseTest: BaseTestType): this {
    this.baseTest = baseTest;
    return this;
  }

  getFixutre() {
    return this.baseTest.extend<TransactionFixture>({
      detailsPage: async ({ page, baseURL }, use) => {
        const pageObject = new TransactionDetailsPage(page, { baseURL });
        await use(pageObject);
      },
      detailsData: async ({}, use) => {
        await use(this.detailsData);
      },
      listPage: async ({ page, baseURL }, use) => {
        const pageObject = new TransactionsListPage(page, { baseURL });
        await use(pageObject);
      },

      listData: async ({}, use) => {
        use(this.listData);
      },
      userType: 'userWithNoContext',
    });
  }
}
