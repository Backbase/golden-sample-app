import { Page, Route } from '@playwright/test';

export class TransactionsListPage {
  private readonly searchInputLocator =
    'bb-transactions-view bb-input-text-ui input';
  private readonly transactionLocator =
    'bb-transactions-view bb-transaction-item';
  constructor(
    private readonly page: Page,
    private readonly config: { baseURL?: string } = {}
  ) {}

  async navigate() {
    await this.page.goto(`${this.config.baseURL}/transactions`);
  }

  async searchTransactions(searchTerm: string) {
    const searchInput = this.page.locator(this.searchInputLocator);
    await searchInput.fill(searchTerm);
  }

  async getTransactionsNumber() {
    await this.waitForVisibleTransactions();

    return this.page.locator(this.transactionLocator).count();
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
    await this.page.waitForSelector(this.transactionLocator);
  }
}
