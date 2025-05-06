import { BaseComponent } from '@backbase-gsa/e2e-tests';

export class LabeledData extends BaseComponent {
  label = this.child('dt');
  value = this.child('dd');

  async getText(): Promise<string | undefined> {
    const text = await this.value.textContent();
    return text?.trim();
  }
}
