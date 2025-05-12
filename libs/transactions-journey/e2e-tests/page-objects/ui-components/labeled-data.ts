import { BaseComponent, getLocatorText } from '@backbase-gsa/e2e-tests';

export class LabeledData extends BaseComponent {
  label = this.child('dt');
  value = this.child('dd');

  async getText(): Promise<string> {
    return getLocatorText(this.value);
  }
}
