import { BaseComponent } from '@backbase/e2e-tests';
import type { Amount } from '../../data/amount';

export class AmountComponent extends BaseComponent {
  currencyInput = this.rootLocator?.getByRole('combobox', { name: 'Currency' });
  valueInput = this.rootLocator?.getByRole('textbox', { name: 'Integer' });
  decimalsInput = this.rootLocator?.getByRole('textbox', { name: 'Decimals' });

  async fill(amount: Amount) {
    if (!this.valueInput || !this.decimalsInput) {
      throw new Error('Value or decimals input not found');
    }
    await this.valueInput.fill(amount.integer);
    await this.decimalsInput.fill(amount.decimal);
  }
}
