import { Page } from '@playwright/test';

export class TransactionDetailsPage {
  private readonly itemLocator = 'bb-transaction-details dl > div';
  private readonly itemTitleLocator = 'dt';
  private readonly itemValueLocator = 'dd';
  constructor(
    private readonly page: Page,
    private readonly config: { baseURL?: string } = {}
  ) {}

  async navigate(id: string) {
    await this.page.goto(`${this.config.baseURL}/transactions/${id}`);
  }

  async getDetails() {
    await this.waitForVisibleDetails();

    const details: Record<string, string> = {};
    const items = await this.page.locator(this.itemLocator).all();

    for (const item of items) {
      const title = await item.locator(this.itemTitleLocator).innerText();
      const value = await item.locator(this.itemValueLocator).innerText();
      details[title] = value;
    }

    return details;
  }

  async waitForVisibleDetails() {
    await this.page.waitForSelector(this.itemLocator);
  }
}
