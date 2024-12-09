import { Page, Route } from '@playwright/test';
import { TRANSACTIONS_LOCATORS } from '../locators/transactions.locators';

export class TransactionsListPage {
  constructor(
    private readonly page: Page,
    private readonly config: { baseURL?: string } = {}
  ) {}
  private readonly locators = TRANSACTIONS_LOCATORS;

  async navigate() {
    await this.page.goto(`${this.config.baseURL}/transactions`);
  }

  async searchTransactions(searchTerm: string) {
    const searchInput = this.page.locator(this.locators.searchInput);
    await searchInput.fill(searchTerm);
  }

  async getTransactionsNumber() {
    await this.waitForVisibleTransactions();

    return this.page.locator(this.locators.transaction).count();
  }

  async getTransactionListError() {
    await this.page.route(
      '**/transaction-manager/client-api/v2/transactions',
      async (route: Route) => {
        await route.fulfill({
          status: 500,
        });
      }
    );
  }

  async waitForVisibleTransactions() {
    await this.page.waitForSelector(this.locators.transaction);
  }
}
