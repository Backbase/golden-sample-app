import { Page } from '@playwright/test';
import { TRANSACTIONS_LOCATORS } from '../locators/transactions.locators';

export class TransactionDetailsPage {
  constructor(
    private readonly page: Page,
    private readonly config: { baseURL?: string } = {}
  ) {}
  private readonly locators = TRANSACTIONS_LOCATORS;

  async navigate(id: string) {
    await this.page.goto(`${this.config.baseURL}/transactions/${id}`);
  }

  async getDetails() {
    await this.waitForVisibleDetails();

    const details: Record<string, string> = {};
    const items = await this.page.locator(this.locators.item).all();

    for (const item of items) {
      const title = await item.locator(this.locators.itemTitle).innerText();
      const value = await item.locator(this.locators.itemValue).innerText();
      details[title] = value;
    }

    return details;
  }

  async waitForVisibleDetails() {
    await this.page.waitForSelector(this.locators.item);
  }
}
