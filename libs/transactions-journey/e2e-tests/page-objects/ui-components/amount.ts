import { BaseComponent } from '@backbase/e2e-tests';
import type { Amount } from '../../data/amount';

export class AmountComponent extends BaseComponent {
  currencyInput = this.childByTestId('currency');
  valueInput = this.childByTestId('value');
  decimalsInput = this.childByTestId('s');

  async fill(amount: Amount) {
    await this.valueInput.fill(amount.integer);
    await this.decimalsInput.fill(amount.decimal);
  }
}
