import { Page } from '@playwright/test';
import { TRANSACTION_DETAILS_LOCATORS } from '../locators/transaction-details.locators';

export class TransactionDetailsPage {
  private readonly locators = TRANSACTION_DETAILS_LOCATORS;

  constructor(private page: Page) {}

  async navigate(id: string) {
    await this.page.goto(`transactions/${id}`);
  }

  async getDetails() {
    const details: Record<string, string> = {};
    const items = await this.page.locator(this.locators.item).all();

    for (const item of items) {
      const title = await item.locator(this.locators.itemTitle).innerText();
      const value = await item.locator(this.locators.itemValue).innerText();
      details[title] = value;
    }

    return details;
  }
}
