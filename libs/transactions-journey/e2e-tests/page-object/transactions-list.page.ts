import { Page } from '@playwright/test';
import { TRANSACTIONS_LIST_LOCATORS } from '../locators/transactions-list.locators';

export class TransactionsListPage {
  private readonly locators = TRANSACTIONS_LIST_LOCATORS;

  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('transactions');
  }

  async searchTransactions(searchTerm: string) {
    const searchInput = this.page.locator(this.locators.searchInput);
    await searchInput.fill(searchTerm);
  }

  async getTransactionsNumber() {
    return this.page.locator(this.locators.transaction).count();
  }
}
