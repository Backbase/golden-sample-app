import { Page } from '@playwright/test';
import { TRANSACTIONS_LIST_LOCATORS } from '../locators/transactions-list.locators';

export class TransactionsListPage {
  private readonly locators = TRANSACTIONS_LIST_LOCATORS;

  constructor(
    private readonly page: Page,
    private readonly config: { baseURL?: string } = {}
  ) {}

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

  async waitForVisibleTransactions() {
    await this.page.waitForSelector(this.locators.transaction);
  }
}
