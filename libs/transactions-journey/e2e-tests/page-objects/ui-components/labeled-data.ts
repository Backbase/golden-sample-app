import { BaseComponent, getLocatorText } from '@backbase/e2e-tests';

export class LabeledData extends BaseComponent {
  label = this.child('dt');
  value = this.child('dd');

  async getText(): Promise<string> {
    return getLocatorText(this.value);
  }
}
